import Link from "next/link";
import PageHero from "@/components/PageHero";
import { getSupabase } from "@/lib/supabase";

export default async function BookingCompletePage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const params = await searchParams;
  let paymentStatus = "pending";
  let bookingStatus = "requested";
  let receiptNumber: string | null = null;
  if (params.reference && /^LGB-[A-Z0-9-]{6,32}$/.test(params.reference)) {
    try {
      const db = getSupabase();
      const { data } = await db.from("bookings").select("id,payment_status,booking_status").eq("reference", params.reference).maybeSingle();
      paymentStatus = data?.payment_status || "pending";
      bookingStatus = data?.booking_status || "requested";
      if (data?.id && paymentStatus === "paid") {
        const { data: transaction } = await db.from("payment_transactions").select("receipt_number").eq("booking_id", data.id).maybeSingle();
        receiptNumber = transaction?.receipt_number || null;
      }
    } catch { paymentStatus = "pending"; }
  }
  const paid = paymentStatus === "paid";
  const confirmed = bookingStatus === "confirmed";
  return <><PageHero eyebrow="PAYMENT STATUS" title={confirmed ? "Your appointment is confirmed." : paid ? "Your payment was received." : "Thank you for your update."} description={confirmed ? "Payment was verified securely. Your appointment has been confirmed." : paid ? "Payment is verified. The business will confirm your appointment separately." : "A return to this page alone does not confirm payment. Status is read from the booking records."} /><section className="page-content"><div className="success-panel"><h2>{paid ? "Payment verified" : paymentStatus === "failed" ? "Payment not completed" : "Payment verification pending"}</h2><p>Booking reference: <strong>{params.reference || "Not provided"}</strong></p>{receiptNumber && <p>Receipt number: <strong>{receiptNumber}</strong></p>}<p>{paid ? (confirmed ? "Keep this reference and receipt number for your records." : "Your payment is recorded, but the appointment still needs business confirmation. Contact the business with this reference.") : paymentStatus === "failed" ? "No successful payment was verified. The time may be requested again while it remains available." : "If you completed payment, allow a moment for the provider notification. If the status does not update, contact the business with your booking reference."} No card information is stored by this website.</p><Link href="/contact" className="button button-dark">Contact the studio</Link></div></section></>;
}