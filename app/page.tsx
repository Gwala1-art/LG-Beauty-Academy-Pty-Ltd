import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { serviceCatalog, classCatalog, galleryImages, formatZar } from "@/lib/content";
import bridalImage from "../img/1.jpg";

export const metadata = {
  title: "Mobile Beauty Services & Makeup Classes",
  description: "Discover personal mobile makeup artistry, bridal beauty, hairstyling and makeup classes from LG Beauty Academy in South Africa.",
};

export default function HomePage() {
  return <>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">MOBILE BEAUTY • SOUTH AFRICA</span>
        <h1>Luxury Beauty,<br /><em>Delivered to You.</em></h1>
        <span className="gold-rule" />
        <p>Your Beauty. Your Comfort. Your Moment to Shine. Professional beauty, thoughtfully brought to your home or chosen location, subject to availability and travel coverage.</p>
        <div className="hero-actions"><Link href="/booking" className="button">Book Your Appointment <ArrowUpRight size={15} /></Link><Link href="/classes" className="button button-outline">Explore Our Courses</Link><Link href="/services" className="button button-outline">View Our Services</Link></div>
      </div>
      <div className="hero-image"><Image src={bridalImage} alt="Bridal updo styled with pearl hair accessories" fill priority quality={90} sizes="(max-width: 760px) 100vw, 50vw" /><span className="hero-caption">Beauty, in your own moment.</span></div>
    </section>

    <section className="intro-band">
      <blockquote>“Your Beauty. Your Comfort. Your Moment to Shine.”<span className="gold-rule" /></blockquote>
      <div className="body-copy"><span className="eyebrow">WELCOME TO LG BEAUTY ACADEMY</span><p>Welcome to LG Beauty Academy Pty Ltd, where beauty meets confidence, convenience and elegance. We bring professional makeup artistry and beauty services directly to you, in the comfort of your own home or chosen location.</p><p>Whether you&apos;re preparing for a special occasion, walking down the aisle, celebrating a milestone or learning new makeup skills, we are here to help you look beautiful and feel confident.</p><p>From soft glam and full glam to bridal beauty, hairstyling and makeup classes, your beauty experience is all about you.</p><p>Relax, enjoy your moment and let LG Beauty Academy help you shine.</p><Link className="text-link" href="/about">A little more about us ↗</Link></div>
    </section>

    <section className="service-strip"><div className="section-heading-row"><div><span className="eyebrow">THE BEAUTY MENU</span><h2 className="section-title">A look for your moment.</h2></div><p className="body-copy">Every appointment is personal. Share your occasion and preferred location; we’ll confirm availability, price and travel details with you.</p></div><div className="service-grid">{serviceCatalog.slice(0, 3).map((service, index) => <article className="service-card" key={service.name}><span className="service-number">0{index + 1}</span><h3>{service.name}</h3><p>{service.description}</p><div className="service-meta"><span>{service.duration}</span><strong>{service.priceCents ? formatZar(service.priceCents) : "Price on request"}</strong></div></article>)}</div><p style={{ textAlign: "right", marginTop: 22 }}><Link className="text-link" href="/services">View our services ↗</Link></p></section>

    <section className="feature-band"><div className="feature-photo"><Image src={galleryImages[1].src} alt={galleryImages[1].alt} fill quality={90} sizes="(max-width: 760px) 100vw, 50vw" /></div><div className="feature-copy"><span className="eyebrow">FOR YOUR FOREVER PHOTOGRAPHS</span><h2 className="section-title">A bridal look that still feels like you.</h2><p>Make space for a calm, considered beauty experience on your wedding day. Bridal services are discussed in advance, including location, timing, party size and any travel requirements.</p><Link href="/bridal" className="button button-dark">Discover Bridal Beauty <ArrowUpRight size={15} /></Link></div></section>

    <section className="home-gallery"><div className="home-gallery-heading"><div><span className="eyebrow">THE BEAUTY EDIT</span><h2 className="section-title">A little inspiration.</h2></div><Link className="text-link" href="/gallery">Explore the gallery ↗</Link></div><div className="home-gallery-grid">{galleryImages.map((image) => <Link className="home-gallery-link" href="/gallery" key={image.label} aria-label={`View ${image.label} in the LG Beauty Academy gallery`}><Image src={image.src} alt={image.alt} fill quality={90} sizes="(max-width: 400px) 86vw, (max-width: 760px) 40vw, 28vw" /><span>{image.label}</span></Link>)}</div><p className="home-gallery-note">Photos provided by LG Beauty Academy. Visit the gallery to see more.</p></section>

    <section className="class-preview"><div className="section-heading-row"><div><span className="eyebrow">LEARN WITH LG</span><h2 className="section-title">Beauty knowledge, made personal.</h2></div><Link className="text-link" href="/classes">Explore all classes ↗</Link></div><div className="class-grid">{classCatalog.slice(0, 3).map((course) => <article className="class-tile" key={course.name}><span className="eyebrow">MAKEUP EDUCATION</span><h3>{course.name}</h3><p>{course.description}</p><p className="class-preview-price">2 days · {formatZar(course.priceCents)} · Goodie bag included</p></article>)}</div></section>

    <section className="closing-cta"><span className="eyebrow">YOUR MOMENT STARTS HERE</span><h2 className="section-title">Let’s create something beautiful.</h2><p>Appointments and class dates are confirmed personally, based on availability.</p><Link href="/booking" className="button">Book Your Appointment <ArrowUpRight size={15} /></Link><div style={{ marginTop: 14 }}><Link className="text-link" href="/services">View Our Services ↗</Link></div></section>
  </>;
}