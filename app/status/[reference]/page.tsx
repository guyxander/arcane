import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { money } from "@/lib/pricing";
export const dynamic = "force-dynamic";
export default async function Status({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params,
    db = createPublicClient();
  if (!db) notFound();
  const { data } = await db.rpc("public_enrollment_status", {
    p_reference: reference,
  });
  const e = data?.[0];
  if (!e) notFound();
  const labels: Record<string, string> = {
    new: "Application received",
    assigned: "Assigned to our team",
    contacted: "We’ve contacted you",
    schedule_review: "Schedule under review",
    awaiting_payment: "Schedule approved — awaiting payment",
    paid: "Payment verified",
    learning: "Course in progress",
    project_submitted: "Project under review",
    completed: "Course completed",
    archived: "Application closed",
  };
  return (
    <main className="portal-page status-page">
      <section className="success-card">
        <span className="flow-kicker">APPLICATION STATUS</span>
        <h1>{labels[e.status] || e.status}</h1>
        <p>
          Reference: <strong>{e.reference}</strong>
        </p>
        <div className="status-detail">
          <span>
            {e.course} · {e.package_type}
          </span>
          <strong>
            {e.quoted_amount ? money.format(e.quoted_amount) : "Bespoke quote"}
          </strong>
        </div>
        <p>
          Questions? Contact{" "}
          <a href="https://wa.me/2349029840305">Arcane Academy on WhatsApp</a>.
        </p>
      </section>
    </main>
  );
}
