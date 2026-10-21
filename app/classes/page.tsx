import PageHero from "@/components/PageHero";
import ClassCatalog from "@/components/ClassCatalog";
import ClassEnquiryForm from "@/components/ClassEnquiryForm";

export default function ClassesPage() {
  return <><PageHero eyebrow="MAKEUP EDUCATION" title="Learn the art, in your own way." description="Personal makeup education for curious beginners and beauty lovers looking to build practical skills. Dates and fees are confirmed personally before enrolment." /><section className="page-content"><ClassCatalog /><div className="notice-box" style={{ marginTop: 30 }}>Class descriptions, outcomes, duration, price, dates and available places are controlled by the business. No qualification, accreditation or certificate is implied.</div></section><section id="register" className="page-content" style={{ paddingTop: 0 }}><div className="content-columns"><div><span className="eyebrow">ASK ABOUT A CLASS</span><h2>Start with what you want to learn.</h2><p>Choose a published session and share any goals or questions. A place is confirmed only after the business responds.</p></div><ClassEnquiryForm /></div></section></>;
}