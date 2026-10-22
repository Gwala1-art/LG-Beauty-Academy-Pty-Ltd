import bridalUpdo from "../img/1.jpg";
import softGlam from "../img/5ab311cb-5d85-4810-8f11-e68c8388e208.jpg";
import braidedLook from "../img/a7331eaa-7831-4a67-9798-1fab913c5a9e.jpg";
import academyPortrait from "../img/IMG_0358.jpg";
import glamMakeup from "../img/IMG_6213.jpg";

export const formatZar = (cents: number) =>
  `R${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(cents / 100)}`;

export const serviceCatalog = [
  { name: "Soft Glam Makeup", description: "A polished, skin-first look with softly defined eyes and a luminous finish, created around your features and occasion.", duration: "Allow 90 minutes", priceCents: 85000 },
  { name: "Full Glam Makeup", description: "A more defined, camera-ready makeup look with a customised finish for evenings, celebrations and special moments.", duration: "Allow 120 minutes", priceCents: 100000 },
  { name: "Bridal Makeup", description: "Thoughtful bridal beauty, planned for your day and delivered at your chosen location, subject to travel coverage.", duration: "Consultation required", priceCents: 150000 },
  { name: "Special Occasion Makeup", description: "Personal makeup artistry for birthdays, graduations, celebrations, events and everything worth remembering.", duration: "Allow 90 minutes" },
  { name: "Hairstyling", description: "Event hairstyling to complement your look. Style, hair preparation and timing are confirmed during consultation.", duration: "Confirmed on enquiry" },
  { name: "Mobile Makeup Services", description: "Professional makeup artistry at home or another agreed location. Travel availability and fees are confirmed before booking.", duration: "Varies by service" },
];

export const classCatalog = [
  { name: "Beginner Makeup Class", description: "Build a comfortable foundation, explore your makeup kit and practise a simple, wearable routine.", outcomes: "Product basics, skin preparation, complexion and everyday application", duration: "2 days", priceCents: 250000 },
  { name: "Soft Glam Masterclass", description: "Learn a softly defined glam look, from complexion preparation through to balanced finishing details.", outcomes: "Skin prep, soft definition, blending and polished finishing", duration: "2 days", priceCents: 250000 },
  { name: "Full Glam Masterclass", description: "Explore a more defined occasion look and practise techniques for a confident, camera-ready finish.", outcomes: "Fuller coverage, eye definition, blending and long-wear finishing", duration: "2 days", priceCents: 250000 },
  { name: "Bridal Makeup Training", description: "A focused learning session exploring bridal makeup planning and application. Content and experience are confirmed before enrolment.", outcomes: "Consultation, look planning, application and day-of considerations", duration: "2 days", priceCents: 250000 },
  { name: "One-on-One Makeup Lesson", description: "A personal session shaped around your experience, goals, features and the products you already own.", outcomes: "A tailored routine, guided practice and individual feedback", duration: "2 days", priceCents: 250000 },
  { name: "Personal Makeup Coaching", description: "Ongoing, individual guidance to help you refine your technique and feel more confident with makeup.", outcomes: "Personal goals, practical technique and next-step guidance", duration: "2 days", priceCents: 250000 },
];

export const galleryImages = [
  { category: "Soft glam", label: "Soft glam", src: softGlam, alt: "Soft glam makeup look with the LG Beauty Academy cape" },
  { category: "Makeup artistry", label: "Golden eye makeup", src: glamMakeup, alt: "Golden eye makeup with defined lashes" },
  { category: "Hair styling", label: "Braided updo", src: braidedLook, alt: "Braided updo paired with a finished makeup look" },
  { category: "Academy", label: "At the academy", src: academyPortrait, alt: "LG Beauty Academy team member in branded workwear" },
  { category: "Bridal hairstyling", label: "Pearl-accented bridal updo", src: bridalUpdo, alt: "Elegant low updo decorated with pearl hair accessories" },
];

export const policies = {
  booking: [
    ["Availability and confirmation", "Appointments depend on availability and are not confirmed until LG Beauty Academy has accepted the request and, where applicable, verified the required payment."],
    ["Price and deposits", "Any deposit, balance, travel charge and additional fee will be disclosed and agreed with you before payment. No amount is assumed by this website while prices remain unconfigured."],
    ["Changes and rescheduling", "Please request rescheduling at least 48 hours in advance where possible. A new time is subject to availability; contact the business to discuss your circumstances."],
    ["Travel and service locations", "Mobile appointments are subject to confirmed travel coverage. Any travel charge or location restriction will be shared before checkout. Locations outside configured zones may request a quote."],
    ["Lateness, cancellations and missed appointments", "Final arrangements should be provided with your booking confirmation. Contact the business as soon as possible if plans change; any charge will be clearly disclosed and applied fairly."],
    ["Groups and bridal bookings", "Group timing and logistics are agreed individually. Bridal bookings may require a separate written agreement, which will be shared and accepted before any commitment."],
    ["Business cancellations", "If LG Beauty Academy must cancel, you will be offered an appropriate alternative or refund where required by the agreed terms and applicable law."],
  ],
  refund: [
    ["How requests are considered", "Refund requests are assessed against the booking terms agreed with you and applicable South African law. Deposits are not automatically treated as non-refundable."],
    ["If a refund is due", "Where a refund is due, it will be returned through the original payment method where reasonably possible and within the applicable timeframe."],
    ["Changes or cancellation", "Contact LG Beauty Academy with your booking reference and a short description of your request. The business will review the circumstances and respond with the next steps."],
    ["Payment provider timing", "Your bank or payment provider may require additional processing time after a refund is issued. The business will share confirmation when available."],
  ],
};