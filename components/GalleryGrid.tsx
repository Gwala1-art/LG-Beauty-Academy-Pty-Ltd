"use client";

import { useState } from "react";
import Image from "next/image";
import { galleryImages } from "@/lib/content";

export default function GalleryGrid() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", ...new Set(galleryImages.map((image) => image.category))];
  const items = filter === "All" ? galleryImages : galleryImages.filter((image) => image.category === filter);
  return <>
    <div className="gallery-filters" aria-label="Filter gallery">
      {filters.map((value) => <button type="button" key={value} className="filter-chip" aria-pressed={filter === value} onClick={() => setFilter(value)}>{value}</button>)}
    </div>
    <div className="gallery-grid" aria-live="polite">{items.map((image) => <figure className="gallery-item" key={image.label}><Image src={image.src} alt={image.alt} fill sizes="(max-width: 400px) 84vw, (max-width: 760px) 42vw, 27vw" /><span>{image.label}</span></figure>)}</div>
    <p className="notice-box" style={{ marginTop: 25 }}>These photos were provided by LG Beauty Academy. Contact the academy for details about the services shown.</p>
  </>;
}