"use client";

import { FormEvent, useState } from "react";

export default function ContactEnquiryForm() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true); setMessage("");
    try {
      const data = Object.fromEntries(new FormData(form).entries());
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, kind: "contact" }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The request could not be sent.");
      setMessage("Thank you. Your message has been received."); form.reset();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Please try again."); }
    finally { setSending(false); }
  }
  return <form className="booking-form" onSubmit={submit}>
    <div className="field"><label htmlFor="contact-name">YOUR NAME</label><input id="contact-name" name="name" autoComplete="name" required maxLength={100} /></div>
    <div className="field"><label htmlFor="contact-email">EMAIL</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
    <div className="field"><label htmlFor="contact-phone">TELEPHONE</label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={32} /></div>
    <div className="field"><label htmlFor="contact-subject">WHAT IS THIS ABOUT?</label><select id="contact-subject" name="service"><option value="General enquiry">General enquiry</option><option value="Service question">Service question</option><option value="Travel area">Travel area</option><option value="Media or collaboration">Media or collaboration</option></select></div>
    <div className="field field-full"><label htmlFor="contact-notes">MESSAGE</label><textarea id="contact-notes" name="notes" required maxLength={1500} /></div>
    {message && <div className="form-message field-full" role="status">{message}</div>}
    <button className="button button-dark field-full" disabled={sending}>{sending ? "Sending..." : "Send enquiry"}</button>
  </form>;
}