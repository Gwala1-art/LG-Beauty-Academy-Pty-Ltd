import PageHero from "@/components/PageHero";
import { policies } from "@/lib/content";

export default function BookingPolicyPage() {
  return <><PageHero eyebrow="CLEAR EXPECTATIONS" title="Booking policy." description="These editable starting terms are intended to make booking expectations clear. Final business terms should be reviewed and approved before launch." /><section className="page-content policy-content">{policies.booking.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}<p style={{ marginTop: 25 }}>The final approved terms and any applicable fees will be shown before checkout. These defaults should be reviewed for your specific business and legal requirements.</p></section></>;
}