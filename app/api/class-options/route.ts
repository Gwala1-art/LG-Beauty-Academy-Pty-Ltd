import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getSupabase();
    const { data: courses, error } = await db.from("courses").select("id,name,description,learning_outcomes,duration_text,price_cents").eq("is_active", true).order("name");
    if (error) throw new Error("Could not load class listings.");
    const ids = (courses || []).map((course) => course.id);
    const { data: sessions, error: sessionError } = ids.length
      ? await db.from("class_sessions").select("id,course_id,starts_at,ends_at,price_cents,seats_remaining").in("course_id", ids).eq("is_active", true).gt("seats_remaining", 0).gt("starts_at", new Date().toISOString()).order("starts_at")
      : { data: [], error: null };
    if (sessionError) throw new Error("Could not load class dates.");
    return Response.json({ courses: courses || [], sessions: sessions || [] }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Class listings are unavailable." }, { status: 503 });
  }
}