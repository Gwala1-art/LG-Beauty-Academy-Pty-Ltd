import { getSupabase, cleanText, validEmail } from "@/lib/supabase";

const kinds = new Set(["class", "refund", "contact"]);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return Response.json({ error: "Please submit a valid request." }, { status: 400 }); }
  const kind = cleanText(body.kind, 20);
  const name = cleanText(body.name, 100);
  const email = cleanText(body.email, 254).toLowerCase();
  const phone = cleanText(body.phone, 32);
  const service = cleanText(body.service, 120);
  const reference = cleanText(body.reference, 40);
  const notes = cleanText(body.notes, 1500);
  if (!kinds.has(kind) || !name || !validEmail(email)) return Response.json({ error: "Enter your name and a valid email address." }, { status: 400 });
  if (kind === "refund" && (!reference || !notes)) return Response.json({ error: "A booking reference and explanation are required." }, { status: 400 });
  try {
    const { error } = await getSupabase().from("enquiries").insert({ kind, name, email, phone, service, booking_reference: reference, notes });
    if (error) throw new Error("Could not save your enquiry.");
    return Response.json({ ok: true }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Enquiry storage is unavailable." }, { status: 503 });
  }
}