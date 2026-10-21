"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  ["About", "/about"],
  ["Services", "/services"],
  ["Bridal", "/bridal"],
  ["Hair", "/hair-styling"],
  ["Classes", "/classes"],
  ["Gallery", "/gallery"],
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="LG Beauty Academy home" onClick={() => setOpen(false)}>
        <span className="wordmark-monogram">LG</span>
        <span className="wordmark-copy"><strong>LG BEAUTY</strong><small>ACADEMY PTY LTD</small></span>
      </Link>
      <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav className={open ? "primary-nav is-open" : "primary-nav"} aria-label="Main navigation">
        {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link className="nav-cta" href="/booking" onClick={() => setOpen(false)}>Book now <span aria-hidden="true">↗</span></Link>
      </nav>
    </header>
  );
}