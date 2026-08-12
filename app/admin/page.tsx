import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function Admin() {
  const db = await createClient();
  if (!db) return <main className="portal-page"><div className="auth-card"><h1>CRM setup required</h1><p>Connect Supabase to activate the Arcane CRM.</p></div></main>;
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await db.from("staff_profiles").select("*").eq("user_id", user.id).single();
  if (!profile || profile.status !== "approved") return <main className="portal-page"><div className="auth-card"><span className="flow-kicker">ACCESS REQUEST RECEIVED</span><h1>Approval pending</h1><p>Your staff request is waiting for an Arcane Academy administrator. Requests expire after one month.</p></div></main>;
  const [enrollments, visits, slots, staff] = await Promise.all([
    db.from("enrollments").select("*").order("created_at", { ascending: false }).limit(100),
    db.from("visitor_events").select("visited_at,device_type,browser,os").order("visited_at", { ascending: false }).limit(10000),
    db.from("availability_slots").select("*").order("starts_at"),
    db.from("staff_profiles").select("user_id,name,email,role,status,created_at").order("created_at", { ascending: false }),
  ]);
  return <AdminDashboard profile={profile} leads={enrollments.data || []} visits={visits.data || []} slots={slots.data || []} staff={staff.data || []}/>;
}
