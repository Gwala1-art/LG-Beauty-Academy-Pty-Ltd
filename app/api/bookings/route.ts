import { getSupabase, cleanText, isUuid, validEmail } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const paymentsEnabled = process.env.PAYMENTS_ENABLED === "true";
  const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
  const paystackMode = process.env.PAYSTACK_MODE || "test";
  if (paymentsEnabled && (!paystackSecret || !["test", "live"].includes(paystackMode) || !paystackSecret.startsWith(paystackMode === "test" ? "sk_test_" : "sk_live_"))) {
    return Response.json({ error: "Payment configuration is incomplete or the key does not match the selected test/live mode." }, { status: 503 });
  }
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return Response.json({ error: "Please submit a valid request." }, { status: 400 }); }

  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 254).toLowerCase();
  const phone = cleanText(body.phone, 32);
  const address = cleanText(body.address, 300);
  const eventType = cleanText(body.eventType, 100);
  const notes = cleanText(body.notes, 1500);
  const serviceId = body.serviceId;
  const slotId = body.slotId;
  const zoneId = body.zoneId || null;
  const rawAddOns = Array.isArray(body.addOnIds) ? body.addOnIds : [];
  const addOnIds = rawAddOns.filter(isUuid);
  const paymentChoice = body.paymentChoice === "deposit" ? "deposit" : "full";
  const accepted = body.policyAccepted === true;
  const eventDate = cleanText(body.eventDate, 10);

  if (!name || !validEmail(email) || phone.replace(/\D/g, "").length < 7 || !address) return Response.json({ error: "Enter a valid name, email, telephone number and service address." }, { status: 400 });
  if (!isUuid(serviceId) || !isUuid(slotId) || (zoneId !== null && !isUuid(zoneId)) || rawAddOns.length > 10 || addOnIds.length !== rawAddOns.length || new Set(addOnIds).size !== addOnIds.length) return Response.json({ error: "Please choose valid service, time and travel options." }, { status: 400 });
  if (!accepted) return Response.json({ error: "Please acknowledge the booking policy before submitting." }, { status: 400 });
  if (eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) return Response.json({ error: "Enter a valid event date." }, { status: 400 });

  try {
    const db = getSupabase();
    const { data, error } = await db.rpc("reserve_booking", {
      p_service_id: serviceId,
      p_slot_id: slotId,
      p_addon_ids: addOnIds,
      p_zone_id: zoneId,
      p_payment_choice: paymentChoice,
      p_customer_name: name,
      p_customer_email: email,
      p_customer_phone: phone,
      p_service_address: address,
      p_event_type: eventType,
      p_event_date: eventDate || null,
      p_notes: notes,
      p_policy_accepted: accepted,
    });
    if (error || !data?.reference) return Response.json({ error: error?.message || "Could not reserve that appointment." }, { status: 409 });

    const amount = Number(data.amount_due_cents);
    if (paymentsEnabled && paystackSecret && Number.isSafeInteger(amount) && amount > 0 && data.currency === "ZAR") {
      const callback = process.env.PAYSTACK_CALLBACK_URL || `${new URL(request.url).origin}/api/payments/callback`;
      const pending = await db.from("bookings").update({ payment_status: "pending", booking_status: "awaiting_payment" }).eq("reference", data.reference);
      if (pending.error) return Response.json({ error: "The appointment was saved, but secure checkout could not be started. Please contact the business." }, { status: 503 });
      const checkoutResponse = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: { Authorization: `Bearer ${paystackSecret}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount: String(amount), currency: "ZAR", reference: data.reference, callback_url: callback }),
        cache: "no-store",
      });
      const checkout = await checkoutResponse.json();
      if (checkoutResponse.ok && checkout.status && typeof checkout.data?.authorization_url === "string" && checkout.data.authorization_url.startsWith("https://checkout.paystack.com/")) {
        return Response.json({ reference: data.reference, checkoutUrl: checkout.data.authorization_url });
      }
      await db.from("bookings").update({ payment_status: "not_required", booking_status: "requested" }).eq("reference", data.reference);
    }

    return Response.json({
      reference: data.reference,
      message: data.amount_due_cents == null
        ? "Your request is saved. Travel coverage and fees need to be confirmed before this appointment can be accepted. No payment was taken."
        : "Your request is saved for business review. It is not yet confirmed and no payment was taken.",
    }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Booking storage is unavailable.";
    return Response.json({ error: message }, { status: 503 });
  }
}