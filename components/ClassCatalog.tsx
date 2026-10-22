"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { classCatalog, formatZar } from "@/lib/content";

type Course = { id: string; name: string; description: string; learning_outcomes: string; duration_text: string; price_cents: number | null };
type Session = { id: string; course_id: string; starts_at: string; price_cents: number | null; seats_remaining: number };
const money = (cents: number | null) => cents == null ? "Price on request" : formatZar(cents);

export default function ClassCatalog() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  useEffect(() => {
    fetch("/api/class-options").then(async (response) => {
      const data = await response.json();
      if (response.ok) { setCourses(data.courses || []); setSessions(data.sessions || []); }
    }).catch(() => undefined);
  }, []);
  const visible = courses?.length
    ? courses.map((course) => {
      const confirmed = classCatalog.find((catalogCourse) => catalogCourse.name === course.name);
      return {
        ...course,
        duration_text: confirmed?.duration ?? course.duration_text,
        price_cents: confirmed?.priceCents ?? course.price_cents,
      };
    })
    : classCatalog.map((course) => ({ ...course, id: "", learning_outcomes: course.outcomes || "", duration_text: course.duration, price_cents: course.priceCents }));
  return <div className="catalog-list">{visible.map((course) => {
    const available = sessions.filter((session) => session.course_id === course.id);
    return <article className="catalog-item" key={course.name}>
      <h2>{course.name}</h2><p>{course.description}</p><p><strong>Learning outcomes:</strong> {course.learning_outcomes}</p>
      <div className="catalog-details"><span>{course.duration_text}</span><span>{money(course.price_cents)}</span></div>
      <p className="class-inclusion">Goodie bag included</p>
      {available.length > 0 && <div className="class-date-list"><strong>Available dates</strong>{available.map((session) => <div key={session.id}>{new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Johannesburg" }).format(new Date(session.starts_at))} · {money(session.price_cents ?? course.price_cents)} · {session.seats_remaining} places</div>)}</div>}
      {courses?.length ? <p style={{ marginTop: 12 }}><Link className="text-link" href="/classes#register">Register your interest ↗</Link></p> : <p style={{ marginTop: 12 }}><span className="eyebrow">DATES TO BE CONFIRMED</span></p>}
    </article>;
  })}</div>;
}