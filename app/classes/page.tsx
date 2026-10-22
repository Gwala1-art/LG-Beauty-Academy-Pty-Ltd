import PageHero from "@/components/PageHero";
import ClassCatalog from "@/components/ClassCatalog";
import ClassEnquiryForm from "@/components/ClassEnquiryForm";
import PortfolioHighlights from "@/components/PortfolioHighlights";
import { galleryImages } from "@/lib/content";

export const metadata = {
  title: "Makeup Courses and Classes",
  description: "Two-day makeup classes cost R2,500 and include a goodie bag. Ask LG Beauty Academy about available dates and enrolment.",
};

export default function ClassesPage() {
  return <><PageHero eyebrow="MAKEUP EDUCATION" title="Learn the art, in your own way." description="Personal makeup education for curious beginners and beauty lovers looking to build practical skills. Two-day classes are R2,500 and include a goodie bag. Ask us about available dates." /><PortfolioHighlights eyebrow="BEAUTY IN PRACTICE" title="A closer look at the artistry." images={[galleryImages[0], galleryImages[1], galleryImages[3]]} /><section className="page-content"><div className="class-price-banner"><span className="eyebrow">TWO-DAY MAKEUP CLASS</span><strong>R2,500</strong><span>Goodie bag included</span></div><ClassCatalog /><div className="notice-box" style={{ marginTop: 30 }}>Class dates and places are confirmed by the academy before enrolment. No qualification, accreditation or certificate is implied.</div></section><section id="register" className="page-content" style={{ paddingTop: 0 }}><div className="content-columns"><div><span className="eyebrow">ASK ABOUT A CLASS</span><h2>Start with what you want to learn.</h2><p>Choose a published session and share any goals or questions. A place is confirmed only after the business responds.</p></div><ClassEnquiryForm /></div></section></>;
}