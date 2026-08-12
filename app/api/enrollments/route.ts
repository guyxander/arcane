import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { calculatePrice, type AgeRange, type Course, type Package } from "@/lib/pricing";
import { notifyAdmins } from "@/lib/push";

export async function POST(request: Request) {
  const start = Date.now();
  console.log(JSON.stringify({ level: "info", msg: "start", route: "/api/enrollments", requestId: request.headers.get("x-vercel-id") }));
  try {
    const body = await request.json();
    const { course, packageType, ageRange, location, name, whatsapp, preferredSlots, slotId, consent } = body as { course: Course; packageType: Package; ageRange: AgeRange; location: string; name: string; whatsapp: string; preferredSlots: string[]; slotId?: string|null; consent: boolean };
    if (!course || !packageType || !name?.trim() || !whatsapp?.trim() || !consent) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    const supabase = createPublicClient();
    if (!supabase) return NextResponse.json({ error: "Enrollment service is being configured" }, { status: 503 });
    const { data: catalog } = await supabase.rpc("get_catalog");
    const configuredBase = catalog?.prices?.find((price: { course: string; package_type: string; available: boolean; amount: number | null }) => price.course === course && price.package_type === packageType && price.available)?.amount;
    const computed = calculatePrice(course, packageType, ageRange, location, configuredBase);
    if (computed.kind === "unavailable") return NextResponse.json({ error: "Package unavailable" }, { status: 400 });
    const reference = `ARC-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const { error } = await supabase.rpc("submit_enrollment", { p_reference: reference, p_name: name.trim(), p_whatsapp: whatsapp.trim(), p_location: location, p_age_range: ageRange, p_course: course, p_package_type: packageType, p_preferred_slots: preferredSlots || [], p_quoted_amount: computed.kind === "price" ? computed.amount : null, p_price_status: computed.kind, p_slot_id: slotId || null });
    if (error) throw error;
    await notifyAdmins(supabase, "New enrollment application", "A new applicant is ready for review.");
    console.log(JSON.stringify({ level: "info", msg: "done", route: "/api/enrollments", ms: Date.now() - start, reference }));
    return NextResponse.json({ reference }, { status: 201 });
  } catch (error) {
    console.error(JSON.stringify({ level: "error", msg: "failed", route: "/api/enrollments", error: error instanceof Error ? error.message : String(error), ms: Date.now() - start }));
    return NextResponse.json({ error: "Unable to submit" }, { status: 500 });
  }
}
