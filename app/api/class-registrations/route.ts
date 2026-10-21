import { getSupabase, cleanText, isUuid, validEmail } from "@/lib/supabase";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return Response.json({ error: "Please submit a valid registration." }, { status: 400 }); }
  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 254).toLowerCase();
  const phone = cleanText(body.phone, 32);
  const notes = cleanText(body.notes, 1500);
  const sessionId = body.sessionId;
  if (!name || !validEmail(email) || phone.replace(/\D/g, "").length < 7 || !isUuid(sessionId)) return Response.json({ error: "Enter your contact details and choose an available class date." }, { status: 400 });
  try {
    const { data, error } = await getSupabase().rpc("register_for_class", { p_session_id: sessionId, p_customer_name: name, p_customer_email: email, p_customer_phone: phone, p_notes: notes });
    if (error || !data?.reference) return Response.json({ error: error?.message || "This class date is no longer available." }, { status: 409 });
    return Response.json({ reference: data.reference, message: "Your registration request is saved. It is not confirmed until LG Beauty Academy contacts you." }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Class registration is unavailable." }, { status: 503 });
  }
}