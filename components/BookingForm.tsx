"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Service = { id: string; name: string; price_cents: number | null; deposit_cents: number | null; duration_minutes: number | null };
type AddOn = { id: string; name: string; price_cents: number };
type Zone = { id: string; name: string; fee_cents: number };
type Slot = { id: string; starts_at: string; ends_at: string };
type Options = { services: Service[]; addOns: AddOn[]; zones: Zone[]; slots: Slot[] };

const money = (cents: number | null | undefined) => cents == null ? "Quote on request" : new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
const localDate = () => new Date(Date.now() + 120 * 60 * 1000).toISOString().slice(0, 10);

export default function BookingForm({ initialService = "" }: { initialService?: string }) {
  const [options, setOptions] = useState<Options>({ services: [], addOns: [], zones: [], slots: [] });
  const [serviceId, setServiceId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [date, setDate] = useState("");
  const [slotId, setSlotId] = useState("");
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [paymentChoice, setPaymentChoice] = useState("full");
  const [state, setState] = useState<"loading" | "ready" | "unavailable">("loading");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/booking-options").then(async (response) => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Booking options are not available yet.");
      setOptions((current) => ({ ...current, ...body }));
      const requested = body.services.find((item: Service) => item.name.toLowerCase() === initialService.toLowerCase());
      if (requested) setServiceId(requested.id);
      setState("ready");
    }).catch((error: unknown) => { setMessage(error instanceof Error ? error.message : "Booking options are not available yet."); setState("unavailable"); });
  }, [initialService]);

  useEffect(() => {
    setSlotId("");
    if (!date || !serviceId) { setOptions((current) => ({ ...current, slots: [] })); return; }
    const query = new URLSearchParams({ date, serviceId });
    fetch(`/api/booking-options?${query}`).then(async (response) => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not load availability.");
      setOptions((current) => ({ ...current, slots: body.slots || [] }));
    }).catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Could not load availability."));
  }, [date, serviceId]);

  const service = options.services.find((item) => item.id === serviceId);
  const zone = options.zones.find((item) => item.id === zoneId);
  const selectedAddOns = options.addOns.filter((item) => addOnIds.includes(item.id));
  const payable = useMemo(() => service?.price_cents == null ? null : service.price_cents + selectedAddOns.reduce((sum, item) => sum + item.price_cents, 0) + (zone?.fee_cents || 0), [service, selectedAddOns, zone]);
  const depositAmount = service?.deposit_cents == null ? null : service.deposit_cents + selectedAddOns.reduce((sum, item) => sum + item.price_cents, 0) + (zone?.fee_cents || 0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSending(true); setMessage(""); setReference("");
    const body = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, serviceId, slotId, zoneId: zoneId || null, addOnIds, paymentChoice, policyAccepted: formData.get("policyAccepted") === "on" }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your request could not be submitted.");
      if (result.checkoutUrl) { window.location.assign(result.checkoutUrl); return; }
      setReference(result.reference || "");
      setMessage(result.message || "Your request has been received. It is not confirmed until the business responds.");
      form.reset(); setDate(""); setSlotId(""); setAddOnIds([]); setZoneId("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Your request could not be submitted."); }
    finally { setSending(false); }
  }

  return <div className="booking-layout">
    <form className="booking-form" onSubmit={submit}>
      {state === "loading" && <div className="form-message field-full" role="status">Loading current services and availability...</div>}
      {state === "unavailable" && <div className="form-message field-full" role="alert">{message} The booking database has not been connected. Please check back after setup.</div>}
      <div className="field field-full"><label htmlFor="booking-service">SERVICE</label><select id="booking-service" required value={serviceId} onChange={(event) => setServiceId(event.target.value)} disabled={state !== "ready"}><option value="">Select a service</option>{options.services.map((item) => <option key={item.id} value={item.id}>{item.name} · {money(item.price_cents)}</option>)}</select></div>
      <div className="field"><label htmlFor="booking-date">PREFERRED DATE</label><input id="booking-date" name="date" type="date" min={localDate()} required value={date} onChange={(event) => setDate(event.target.value)} /></div>
      <div className="field"><label htmlFor="booking-slot">AVAILABLE TIME</label><select id="booking-slot" name="slot" required value={slotId} onChange={(event) => setSlotId(event.target.value)} disabled={!date || !serviceId}><option value="">{date ? "Select an available time" : "Choose a date first"}</option>{options.slots.map((slot) => <option key={slot.id} value={slot.id}>{new Intl.DateTimeFormat("en-ZA", { timeStyle: "short", timeZone: "Africa/Johannesburg" }).format(new Date(slot.starts_at))}</option>)}</select></div>
      {date && serviceId && options.slots.length === 0 && <div className="empty-state field-full">No available times are published for this date. Please choose another date or send an enquiry.</div>}
      <div className="field"><label htmlFor="customer-name">YOUR NAME</label><input id="customer-name" name="name" autoComplete="name" required maxLength={100} /></div>
      <div className="field"><label htmlFor="customer-email">EMAIL</label><input id="customer-email" name="email" type="email" autoComplete="email" required maxLength={254} /></div>
      <div className="field"><label htmlFor="customer-phone">TELEPHONE</label><input id="customer-phone" name="phone" type="tel" autoComplete="tel" required maxLength={32} /></div>
      <div className="field"><label htmlFor="booking-zone">TRAVEL AREA</label><select id="booking-zone" value={zoneId} onChange={(event) => setZoneId(event.target.value)}><option value="">I need a travel quote</option>{options.zones.map((item) => <option key={item.id} value={item.id}>{item.name} · {money(item.fee_cents)}</option>)}</select></div>
      <div className="field field-full"><label htmlFor="service-address">MOBILE SERVICE ADDRESS</label><input id="service-address" name="address" autoComplete="street-address" placeholder="Street address, suburb and city" required maxLength={300} /></div>
      <div className="field"><label htmlFor="event-type">EVENT TYPE</label><input id="event-type" name="eventType" placeholder="Wedding, celebration..." maxLength={100} /></div>
      <div className="field"><label htmlFor="event-date">EVENT DATE (IF DIFFERENT)</label><input id="event-date" name="eventDate" type="date" /></div>
      {options.addOns.length > 0 && <fieldset className="field field-full" style={{ border: 0, padding: 0, margin: 0 }}><legend className="eyebrow">OPTIONAL ADD-ONS</legend>{options.addOns.map((item) => <label className="checkline" key={item.id}><input type="checkbox" checked={addOnIds.includes(item.id)} onChange={(event) => setAddOnIds((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))} />{item.name} · {money(item.price_cents)}</label>)}</fieldset>}
      {payable != null && <div className="field field-full"><label htmlFor="payment-choice">PAYMENT PREFERENCE</label><select id="payment-choice" value={paymentChoice} onChange={(event) => setPaymentChoice(event.target.value)}><option value="full">Pay in full · {money(payable)}</option>{depositAmount != null && <option value="deposit">Pay configured deposit · {money(depositAmount)}</option>}</select></div>}
      <div className="field field-full"><label htmlFor="booking-notes">ADDITIONAL NOTES</label><textarea id="booking-notes" name="notes" maxLength={1500} /></div>
      <label className="checkline field-full"><input type="checkbox" name="policyAccepted" required />I have read and acknowledge the <Link href="/booking-policy" target="_blank">booking policy</Link>. I understand this request is not confirmed until LG Beauty Academy responds.</label>
      {message && <div className="form-message field-full" role={reference ? "status" : "alert"}>{message}{reference && <><br />Booking reference: <strong>{reference}</strong></>}</div>}
      <button className="button button-dark field-full" disabled={sending || state !== "ready" || !serviceId || !slotId}>{sending ? "Submitting..." : payable == null ? "Request an appointment" : "Continue to secure payment"}</button>
    </form>
    <aside className="booking-aside"><span className="eyebrow">YOUR REQUEST</span><h2>Appointment details</h2><p>Prices and travel fees shown here come from the current business configuration.</p><div className="price-line"><span>Service</span><strong>{service?.name || "Not selected"}</strong></div>{service && <div className="price-line"><span>Service price</span><strong>{money(service.price_cents)}</strong></div>}{selectedAddOns.map((item) => <div className="price-line" key={item.id}><span>{item.name}</span><strong>{money(item.price_cents)}</strong></div>)}<div className="price-line"><span>Travel</span><strong>{zone ? money(zone.fee_cents) : "Quote required"}</strong></div><div className="price-line total"><span>Estimate</span><strong>{money(payable)}</strong></div><div className="notice-box">No charge is made unless secure payment is configured and completed. A booking remains unconfirmed until payment verification and business confirmation are complete.</div><p>Need a location outside the listed areas? Choose “I need a travel quote”; the team will confirm whether it can be accommodated.</p></aside>
  </div>;
}