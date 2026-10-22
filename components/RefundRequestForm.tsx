"use client";

import { FormEvent, useState } from "react";

export default function RefundRequestForm() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [hasError, setHasError] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setSending(true); setMessage(""); setHasError(false);
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, kind: "refund" }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The request could not be sent.");
      setMessage("Your refund request has been received for review."); form.reset();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Please try again."); setHasError(true); }
    finally { setSending(false); }
  }
  return <form className="booking-form" onSubmit={submit}>
    <div className="field"><label htmlFor="refund-name">YOUR NAME</label><input id="refund-name" name="name" autoComplete="name" required maxLength={100} /></div>
    <div className="field"><label htmlFor="refund-email">EMAIL</label><input id="refund-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
    <div className="field field-full"><label htmlFor="refund-reference">BOOKING REFERENCE</label><input id="refund-reference" name="reference" required maxLength={40} /></div>
    <div className="field field-full"><label htmlFor="refund-reason">HOW CAN WE HELP?</label><textarea id="refund-reason" name="notes" required maxLength={1500} /></div>
    {message && <div className={`form-message field-full ${hasError ? "error" : "success"}`} role={hasError ? "alert" : "status"}>{message}</div>}
    <button className="button button-dark field-full" disabled={sending}>{sending ? "Sending..." : "Submit refund request"}</button>
  </form>;
}