import { getSupabase } from "@/lib/supabase";

type PaystackVerifyResponse = {
  status?: boolean;
  data?: { id?: number; reference?: string; status?: string; amount?: number; currency?: string; receipt_number?: string | null };
};

export async function verifyPaystackPayment(reference: string): Promise<"paid" | "failed" | "pending"> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return "pending";
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` }, cache: "no-store",
  });
  if (!response.ok) return "pending";
  const result = await response.json() as PaystackVerifyResponse;
  const payment = result.data;
  if (payment?.reference !== reference) return "pending";
  const db = getSupabase();
  if (result.status && payment.status === "success" && payment.id && Number.isSafeInteger(payment.amount) && payment.currency === "ZAR") {
    const { data, error } = await db.rpc("finalize_paystack_payment", {
      p_reference: reference,
      p_amount_cents: payment.amount,
      p_currency: payment.currency,
      p_transaction_id: String(payment.id),
      p_receipt_number: payment.receipt_number || null,
    });
    return !error && data === true ? "paid" : "pending";
  }
  if (result.status && (payment.status === "failed" || payment.status === "abandoned")) {
    const { data, error } = await db.rpc("mark_paystack_payment_failed", { p_reference: reference });
    return !error && data === true ? "failed" : "pending";
  }
  return "pending";
}