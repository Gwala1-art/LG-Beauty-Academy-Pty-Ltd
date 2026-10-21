import { createHmac, timingSafeEqual } from "node:crypto";
import { verifyPaystackPayment } from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const signature = request.headers.get("x-paystack-signature");
  if (!secret || !signature) return Response.json({ error: "Invalid webhook signature." }, { status: 401 });
  const payload = await request.text();
  const expected = createHmac("sha512", secret).update(payload).digest("hex");
  const receivedBytes = Buffer.from(signature, "hex");
  const expectedBytes = Buffer.from(expected, "hex");
  if (receivedBytes.length !== expectedBytes.length || !timingSafeEqual(receivedBytes, expectedBytes)) return Response.json({ error: "Invalid webhook signature." }, { status: 401 });
  let event: { event?: string; data?: { reference?: string } };
  try { event = JSON.parse(payload) as typeof event; }
  catch { return Response.json({ error: "Invalid webhook payload." }, { status: 400 }); }
  if (event.event === "charge.success" && event.data?.reference && /^LGB-[A-Z0-9-]{6,32}$/.test(event.data.reference)) {
    try { await verifyPaystackPayment(event.data.reference); }
    catch { return Response.json({ error: "Payment verification is temporarily unavailable." }, { status: 503 }); }
  }
  return Response.json({ received: true });
}