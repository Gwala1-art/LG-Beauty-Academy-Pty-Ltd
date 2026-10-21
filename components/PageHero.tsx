export default function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="page-hero"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></section>;
}