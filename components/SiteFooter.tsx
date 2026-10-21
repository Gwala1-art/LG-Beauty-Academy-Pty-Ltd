import Link from "next/link";

const policies = [
  ["Booking policy", "/booking-policy"],
  ["Refund policy", "/refund-policy"],
  ["Privacy", "/privacy-policy"],
  ["Terms", "/terms"],
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div><Link className="footer-brand" href="/">LG<span>.</span></Link><p>Beauty, brought closer.<br />Your beauty. Your comfort. Your moment to shine.</p></div>
        <div className="footer-links"><span className="eyebrow">INFORMATION</span>{policies.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</div>
        <div className="footer-links"><span className="eyebrow">SAY HELLO</span><Link href="/contact">Contact the studio</Link><Link href="/booking">Request an appointment</Link><Link href="/classes">Explore classes</Link></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} LG Beauty Academy Pty Ltd</span><span>Mobile beauty • South Africa</span></div>
    </footer>
  );
}