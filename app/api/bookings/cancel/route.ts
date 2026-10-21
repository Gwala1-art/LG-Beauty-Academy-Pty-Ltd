import { getSupabase, cleanText, validEmail } from "@/lib/supabase";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return Response.json({ error: "Please submit a valid request." }, { status: 400 }); }
  const reference = cleanText(body.reference, 40).toUpperCase();
  const email = cleanText(body.email, 254).toLowerCase();
  const notes = cleanText(body.notes, 1500);
  if (!/^LGB-[A-Z0-9-]{6,32}$/.test(reference) || !validEmail(email)) return Response.json({ error: "Enter a valid booking reference and email address." }, { status: 400 });
  try {
    const db = getSupabase();
    const { data, error } = await db.from("bookings").select("id,customer_email,booking_status").eq("reference", reference).maybeSingle();
    if (error || !data || data.customer_email !== email) return Response.json({ error: "We could not match that reference and email." }, { status: 404 });
    if (["cancelled", "declined"].includes(data.booking_status)) return Response.json({ error: "This booking is already closed." }, { status: 409 });
    const { error: updateError } = await db.from("bookings").update({ booking_status: "cancellation_requested" }).eq("id", data.id);
    if (updateError) return Response.json({ error: "Could not submit the cancellation request." }, { status: 503 });
    const enquiry = await db.from("enquiries").insert({ kind: "cancellation", name: "Cancellation request", email, booking_reference: reference, notes: `Cancellation request: ${notes}`.slice(0, 1500) });
    if (enquiry.error) return Response.json({ error: "The status was updated, but the request details could not be saved. Please contact the business." }, { status: 503 });
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Booking storage is unavailable." }, { status: 503 });
  }
}