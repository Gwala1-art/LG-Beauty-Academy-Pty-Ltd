import PageHero from "@/components/PageHero";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata = {
  title: "Beauty Inspiration Gallery",
  description: "Browse an editorial beauty moodboard featuring makeup, bridal beauty, hairstyling and makeup education inspiration.",
};

export default function GalleryPage() {
  return <><PageHero eyebrow="THE BEAUTY EDIT" title="A little inspiration for your moment." description="An editorial moodboard across makeup, bridal beauty, hairstyling and learning. Placeholder imagery is clearly identified, never presented as client work." /><section className="page-content"><GalleryGrid /></section></>;
}