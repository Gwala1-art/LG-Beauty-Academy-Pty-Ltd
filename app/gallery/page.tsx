import PageHero from "@/components/PageHero";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata = {
  title: "Beauty Portfolio",
  description: "Browse makeup artistry, bridal hairstyling and beauty photos provided by LG Beauty Academy.",
};

export default function GalleryPage() {
  return <><PageHero eyebrow="LG BEAUTY ACADEMY PORTFOLIO" title="Our beauty work." description="Explore makeup artistry, hairstyles and photos from LG Beauty Academy." /><section className="page-content"><GalleryGrid /></section></>;
}