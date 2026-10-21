"use client";

import { FormEvent, useEffect, useState } from "react";

export default function ClassEnquiryForm() {
  const [sessions, setSessions] = useState<{ id: string; courseId: string; courseName: string; startsAt: string; price: number | null }[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  useEffect(() => {
    fetch("/api/class-options").then(async (response) => {
      const data = await response.json();
      if (response.ok) setSessions((data.sessions || []).map((session: { id: string; course_id: string; starts_at: string; price_cents: number | null }) => ({ id: session.id, courseId: session.course_id, startsAt: session.starts_at, price: session.price_cents, courseName: data.courses.find((course: { id: string }) => course.id === session.course_id)?.name || "Makeup class" })));
    }).catch(() => undefined);
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setSending(true);
    setMessage("");
    try {
      const response = await fetch("/api/class-registrations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The request could not be sent.");
      setMessage(`${result.message} Reference: ${result.reference}`);
      form.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
    } finally { setSending(false); }
  }
  return <form className="booking-form" onSubmit={submit}>
    <div className="field field-full"><label htmlFor="class-name">YOUR NAME</label><input id="class-name" name="name" autoComplete="name" required maxLength={100} /></div>
    <div className="field"><label htmlFor="class-email">EMAIL</label><input id="class-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
    <div className="field"><label htmlFor="class-phone">TELEPHONE</label><input id="class-phone" name="phone" autoComplete="tel" required maxLength={32} /></div>
    <div className="field field-full"><label htmlFor="class-session">AVAILABLE CLASS DATE</label><select id="class-session" name="sessionId" required defaultValue=""><option value="" disabled>{sessions.length ? "Select a class date" : "No dates currently published"}</option>{sessions.map((session) => <option key={session.id} value={session.id}>{session.courseName} · {new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg" }).format(new Date(session.startsAt))}</option>)}</select></div>
    <div className="field field-full"><label htmlFor="class-message">WHAT WOULD YOU LIKE TO LEARN?</label><textarea id="class-message" name="notes" maxLength={1500} /></div>
    {message && <div className="form-message field-full" role="status">{message}</div>}
    <button className="button button-dark field-full" disabled={sending || sessions.length === 0}>{sending ? "Registering..." : "Request a class place"}</button>
    {sessions.length === 0 && <div className="empty-state field-full">No class dates are published yet. Please contact the business to request a suitable date.</div>}
  </form>;
}