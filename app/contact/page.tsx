import Link from "next/link";
import PageHero from "@/components/PageHero";
import ContactEnquiryForm from "@/components/ContactEnquiryForm";

export default function ContactPage() {
  const email = process.env.NEXT_PUBLIC_BUSINESS_EMAIL;
  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^\d]/g, "");
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL;
  const area = process.env.NEXT_PUBLIC_SERVICE_AREA;
  return <><PageHero eyebrow="CONTACT LG BEAUTY ACADEMY" title="Let’s talk about your moment." description="Share your preferred service, date and location. We’ll confirm availability, travel coverage and pricing directly with you." /><section className="page-content"><div className="contact-grid"><div><span className="eyebrow">GET IN TOUCH</span><h2 className="section-title">A personal reply, next.</h2><p className="body-copy">Business contact details will appear here once configured by LG Beauty Academy. For now, you can send a booking or class enquiry through the relevant form.</p><p><Link className="button button-dark" href="/booking">Request an appointment</Link></p><p><Link className="text-link" href="/classes">Ask about makeup classes ↗</Link></p></div><div>
    <div className="contact-row"><span>EMAIL</span>{email ? <a href={`mailto:${email}`}>{email}</a> : <p>Not configured</p>}</div>
    <div className="contact-row"><span>PHONE</span>{phone ? <a href={`tel:${phone}`}>{phone}</a> : <p>Not configured</p>}</div>
    <div className="contact-row"><span>WHATSAPP</span>{whatsapp ? <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">Message LG Beauty Academy</a> : <p>Not configured</p>}</div>
    <div className="contact-row"><span>INSTAGRAM</span>{instagram ? <a href={instagram} target="_blank" rel="noreferrer">Visit Instagram ↗</a> : <p>Not configured</p>}</div>
    <div className="contact-row"><span>MOBILE SERVICE AREA</span><p>{area || "Service area to be confirmed"}</p></div>
    <span className="eyebrow" style={{ display: "block", marginTop: 32 }}>SEND A MESSAGE</span><ContactEnquiryForm />
    </div></div></section></>;
}