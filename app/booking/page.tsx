import PageHero from "@/components/PageHero";
import BookingForm from "@/components/BookingForm";

export const metadata = {
  title: "Request an Appointment",
  description: "Request a mobile beauty appointment with LG Beauty Academy. Availability, travel coverage and pricing are confirmed before acceptance.",
};

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const params = await searchParams;
  const allowed = ["Soft Glam Makeup", "Full Glam Makeup", "Bridal Makeup", "Special Occasion Makeup", "Hairstyling", "Mobile Makeup Services"];
  const initialService = allowed.find((name) => name.toLowerCase() === params.service?.toLowerCase()) || "";
  return <><PageHero eyebrow="ONLINE BOOKING" title="Plan your beauty moment." description="Choose a service and a currently published appointment time. Your mobile address, travel area and booking policy are confirmed before any payment." /><section className="page-content"><BookingForm initialService={initialService} /></section></>;
}