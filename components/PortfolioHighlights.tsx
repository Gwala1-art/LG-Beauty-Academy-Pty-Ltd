import Image from "next/image";

type PortfolioImage = {
  label: string;
  alt: string;
  src: Parameters<typeof Image>[0]["src"];
};

export default function PortfolioHighlights({
  eyebrow,
  title,
  images,
}: {
  eyebrow: string;
  title: string;
  images: PortfolioImage[];
}) {
  return (
    <section className="portfolio-highlights">
      <div className="home-gallery-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="section-title">{title}</h2>
        </div>
      </div>
      <div className="portfolio-highlights-grid">
        {images.map((image) => (
          <figure className="portfolio-highlight" key={image.label}>
            <Image src={image.src} alt={image.alt} fill quality={90} sizes="(max-width: 760px) 90vw, 30vw" />
            <figcaption>{image.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
