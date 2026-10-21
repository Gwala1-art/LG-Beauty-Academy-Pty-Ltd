import { NextRequest } from "next/server";
import { verifyPaystackPayment } from "@/lib/payments";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference") || "";
  if (!/^LGB-[A-Z0-9-]{6,32}$/.test(reference)) return Response.redirect(new URL("/booking/complete?status=not-found", request.url));
  try {
    await verifyPaystackPayment(reference);
    return Response.redirect(new URL(`/booking/complete?reference=${encodeURIComponent(reference)}`, request.url));
  } catch {
    return Response.redirect(new URL(`/booking/complete?reference=${encodeURIComponent(reference)}&status=pending`, request.url));
  }
}