import PageHero from "@/components/PageHero";
import RefundRequestForm from "@/components/RefundRequestForm";
import { policies } from "@/lib/content";

export default function RefundPolicyPage() {
  return <><PageHero eyebrow="FAIR & TRANSPARENT" title="Refund policy." description="Refund requests are assessed in line with the booking terms agreed with you and applicable South African law." /><section className="page-content"><div className="content-columns"><div className="policy-content">{policies.refund.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}</div><div><span className="eyebrow">REQUEST A REVIEW</span><h2 className="section-title">Tell us what happened.</h2><p className="body-copy">Include your booking reference so the business can find the relevant details. Submitting a request does not itself approve a refund.</p><RefundRequestForm /></div></div></section></>;
}