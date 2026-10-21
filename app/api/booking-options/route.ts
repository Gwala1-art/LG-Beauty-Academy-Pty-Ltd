import { NextRequest } from "next/server";
import { getSupabase, isUuid } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const db = getSupabase();
    const [servicesResult, addOnsResult, zonesResult] = await Promise.all([
      db.from("services").select("id,name,description,price_cents,deposit_cents,duration_minutes").eq("is_active", true).order("name"),
      db.from("service_addons").select("id,name,price_cents").eq("is_active", true).order("name"),
      db.from("travel_zones").select("id,name,fee_cents").eq("is_active", true).order("name"),
    ]);
    const firstError = servicesResult.error || addOnsResult.error || zonesResult.error;
    if (firstError) throw new Error("Could not load booking options.");
    const response: { services: unknown[]; addOns: unknown[]; zones: unknown[]; slots?: unknown[] } = {
      services: servicesResult.data || [], addOns: addOnsResult.data || [], zones: zonesResult.data || [],
    };
    const date = request.nextUrl.searchParams.get("date");
    const serviceId = request.nextUrl.searchParams.get("serviceId");
    if (date || serviceId) {
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !isUuid(serviceId)) return Response.json({ error: "Choose a valid date and service." }, { status: 400 });
      const [year, month, day] = date.split("-").map(Number);
      if (new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10) !== date) return Response.json({ error: "Choose a valid date." }, { status: 400 });
      const start = new Date(`${date}T00:00:00+02:00`);
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      const cleanup = await db.rpc("release_expired_payment_holds");
      if (cleanup.error) throw new Error("Could not refresh appointment availability.");
      const slotResult = await db.from("availability_slots").select("id,starts_at,ends_at").eq("is_available", true).gte("starts_at", start.toISOString()).lt("starts_at", end.toISOString()).or(`service_id.is.null,service_id.eq.${serviceId}`).order("starts_at");
      if (slotResult.error) throw new Error("Could not load appointment availability.");
      response.slots = slotResult.data || [];
    }
    return Response.json(response, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Booking options are unavailable.";
    return Response.json({ error: message }, { status: 503 });
  }
}