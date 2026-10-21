"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryImages } from "@/lib/content";

const filters = ["All", "Soft glam", "Full glam", "Bridal makeup", "Hairstyling", "Classes"];

export default function GalleryGrid() {
  const [filter, setFilter] = useState("All");
  const items = filter === "All" ? galleryImages : galleryImages.filter((image) => image.category === filter);
  return <>
    <div className="gallery-filters" aria-label="Filter gallery">
      {filters.map((value) => <button type="button" key={value} className="filter-chip" aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}
    </div>
    <div className="gallery-grid" aria-live="polite">{items.map((image) => <figure className="gallery-item" key={image.label}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 400px) 84vw, (max-width: 760px) 42vw, 27vw" /><span>{image.label} · Inspiration image</span></figure>)}</div>
    <p className="notice-box" style={{ marginTop: 25 }}>These licensed Unsplash images are editorial placeholders for visual direction only. They do not depict LG Beauty Academy clients or completed services. Replace image entries in <code>lib/content.ts</code> with your own approved portfolio photographs.</p>
  </>;
}