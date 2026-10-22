import Link from "next/link";
import PageHero from "@/components/PageHero";
import PortfolioHighlights from "@/components/PortfolioHighlights";
import { galleryImages } from "@/lib/content";

export const metadata = {
  title: "Bridal Beauty",
  description: "Explore personalised bridal makeup services from LG Beauty Academy, with location, timing and travel details confirmed in advance.",
};

export default function BridalPage() {
  return <><PageHero eyebrow="BRIDAL BEAUTY" title="A little calm before the confetti." description="Bridal makeup, thoughtfully planned around your features, your celebration and the people sharing your day." /><PortfolioHighlights eyebrow="BRIDAL HAIRSTYLING" title="Details for your special day." images={[galleryImages[4]]} /><section className="page-content"><div className="content-columns"><div><span className="eyebrow">YOUR BRIDAL ENQUIRY</span><h2>Beauty for a day that moves quickly.</h2><p>Share your wedding date, getting-ready location, party size and the look you have in mind. LG Beauty Academy will confirm whether the date and location can be accommodated and discuss timing, travel and pricing before you commit.</p><p>Bridal bookings may require a separate written agreement. Any agreement, deposit, travel fee and cancellation terms will be provided for review before payment.</p><Link className="button button-dark" href="/booking?service=Bridal%20Makeup">Enquire about bridal makeup</Link></div><div><span className="eyebrow">PLANNING DETAILS</span><ul className="bullet-list"><li>Wedding date and getting-ready address</li><li>Number of people requesting makeup</li><li>Preferred style and inspiration references</li><li>Ready-by time and any schedule constraints</li><li>Travel coverage and charges confirmed in advance</li></ul><p>Availability is not confirmed until you receive direct confirmation from the business.</p></div></div></section></>;
}