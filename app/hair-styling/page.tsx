import Link from "next/link";
import PageHero from "@/components/PageHero";
import PortfolioHighlights from "@/components/PortfolioHighlights";
import { galleryImages } from "@/lib/content";

export const metadata = {
  title: "Hairstyling",
  description: "Ask LG Beauty Academy about event hairstyling to complement a makeup look. Styling and availability are confirmed by enquiry.",
};

export default function HairStylingPage() {
  return <><PageHero eyebrow="HAIR STYLING" title="Finishing touches, made personal." description="Event hairstyling to complement your beauty look, discussed and confirmed around your hair, occasion and chosen location." /><PortfolioHighlights eyebrow="HAIRSTYLING PORTFOLIO" title="Style with a personal touch." images={[galleryImages[2], galleryImages[4]]} /><section className="page-content"><div className="content-columns"><div><h2>Tell us what you have in mind.</h2><p>Share your preferred style, hair length and texture, event date, location and any preparation questions. The exact service, timing and price are confirmed with you before booking.</p><Link className="button button-dark" href="/booking?service=Hairstyling">Enquire about hairstyling</Link></div><div><span className="eyebrow">HELPFUL TO INCLUDE</span><ul className="bullet-list"><li>A reference image or description of your preferred style</li><li>Hair length and any relevant preparation details</li><li>Event and ready-by time</li><li>Your preferred service address</li></ul></div></div></section></>;
}