"use client";

import { FormEvent, useState } from "react";

export default function CancellationForm() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true); setMessage("");
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const response = await fetch("/api/bookings/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The request could not be submitted.");
      setMessage("Your cancellation request has been sent. The appointment is not cancelled until LG Beauty Academy confirms."); form.reset();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Please try again."); }
    finally { setSending(false); }
  }
  return <form className="booking-form" onSubmit={submit}>
    <div className="field"><label htmlFor="cancel-reference">BOOKING REFERENCE</label><input id="cancel-reference" name="reference" required maxLength={40} /></div>
    <div className="field"><label htmlFor="cancel-email">BOOKING EMAIL</label><input id="cancel-email" name="email" type="email" required maxLength={254} /></div>
    <div className="field field-full"><label htmlFor="cancel-notes">ADDITIONAL DETAILS</label><textarea id="cancel-notes" name="notes" maxLength={1500} /></div>
    {message && <div className="form-message field-full" role="status">{message}</div>}
    <button className="button button-dark field-full" disabled={sending}>{sending ? "Sending..." : "Request cancellation"}</button>
  </form>;
}