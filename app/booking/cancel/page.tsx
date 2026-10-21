import PageHero from "@/components/PageHero";
import CancellationForm from "@/components/CancellationForm";

export default function CancellationRequestPage() {
  return <><PageHero eyebrow="APPOINTMENT CHANGES" title="Request a cancellation." description="Requests are reviewed under the terms agreed for your booking and applicable consumer rights." /><section className="page-content"><div className="content-columns"><div><h2 className="section-title">Let us know what has changed.</h2><p className="body-copy">A cancellation request is not automatically approved or refunded. The appointment remains active until LG Beauty Academy confirms the change.</p><div className="notice-box">Any refund will be assessed under the agreed booking terms and applicable South African law.</div></div><CancellationForm /></div></section></>;
}