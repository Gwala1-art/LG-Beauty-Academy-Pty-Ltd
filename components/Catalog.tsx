"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatZar } from "@/lib/content";

type Entry = { id: string; name: string; description: string; duration: string; duration_minutes: number | null; price_cents: number | null };
const money = (cents: number | null) => cents == null ? "Price on request" : formatZar(cents);

export default function Catalog({ items }: { items: { name: string; description: string; duration: string; priceCents?: number }[] }) {
  const [configured, setConfigured] = useState<Entry[] | null>(null);
  useEffect(() => {
    fetch("/api/booking-options").then(async (response) => {
      const data = await response.json();
      if (response.ok) setConfigured(data.services || []);
    }).catch(() => undefined);
  }, []);
  const visible = configured?.length
    ? configured.map((item) => ({
      ...item,
      price_cents: items.find((catalogItem) => catalogItem.name === item.name)?.priceCents ?? item.price_cents,
    }))
    : items.map((item) => ({ ...item, id: "", duration_minutes: null, price_cents: item.priceCents ?? null }));
  return <div className="catalog-list">{visible.map((item) => <article className="catalog-item" key={item.name}>
    <h2>{item.name}</h2>
    <p>{item.description}</p>
    <div className="catalog-details"><span>{item.duration_minutes ? `Allow ${item.duration_minutes} minutes` : item.duration || "Duration to be confirmed"}</span><span>{money(item.price_cents)}</span></div>
    <p style={{ marginTop: 12 }}><Link className="text-link" href={`/booking?service=${encodeURIComponent(item.name)}`}>Request this service ↗</Link></p>
  </article>)}</div>;
}