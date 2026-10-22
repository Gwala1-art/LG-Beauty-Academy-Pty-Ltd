import Link from "next/link";
import PageHero from "@/components/PageHero";
import Catalog from "@/components/Catalog";
import PortfolioHighlights from "@/components/PortfolioHighlights";
import { galleryImages, serviceCatalog } from "@/lib/content";

export const metadata = {
  title: "Mobile Beauty Services",
  description: "Discover makeup, bridal beauty and hairstyling services from LG Beauty Academy, subject to availability and travel coverage.",
};

export default function ServicesPage() {
  return <><PageHero eyebrow="MAKEUP & BEAUTY SERVICES" title="Your look, your location." description="Professional beauty services brought to your home or chosen venue, subject to availability and travel coverage. Each service is confirmed personally before booking." /><PortfolioHighlights eyebrow="OUR BEAUTY WORK" title="Looks created by LG Beauty Academy." images={galleryImages.slice(0, 3)} /><section className="page-content"><Catalog items={serviceCatalog} /><div className="notice-box" style={{ marginTop: 32 }}>Prices, durations and active services are controlled by LG Beauty Academy. Location coverage and any travel charge are confirmed before payment.</div><p><Link href="/booking" className="button button-dark">Request an appointment</Link></p></section></>;
}