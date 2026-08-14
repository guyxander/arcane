import { notFound } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { money } from "@/lib/pricing";
import { formatWAT } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function Receipt({
  params,
}: {
  params: Promise<{ receipt: string }>;
}) {
  const { receipt } = await params;
  const db = createPublicClient();
  if (!db) notFound();
  const { data } = await db.rpc("public_receipt", { p_receipt: receipt });
  const record = data?.[0];
  if (!record) notFound();
  return (
    <main className="portal-page receipt-page">
      <article className="receipt-card">
        <header>
          <span className="portal-brand">
            ARCANE <small>ACADEMY</small>
          </span>
          <b>PAYMENT RECEIPT</b>
        </header>
        <h1>{money.format(record.amount)}</h1>
        <p className="paid-stamp">PAYMENT VERIFIED</p>
        <dl>
          <div>
            <dt>Received from</dt>
            <dd>{record.learner_name}</dd>
          </div>
          <div>
            <dt>Course</dt>
            <dd>
              {record.course} · {record.package_type}
            </dd>
          </div>
          <div>
            <dt>Enrollment</dt>
            <dd>{record.reference}</dd>
          </div>
          <div>
            <dt>Receipt</dt>
            <dd>{record.receipt_number}</dd>
          </div>
          <div>
            <dt>Issued</dt>
            <dd>{formatWAT(record.issued_at)}</dd>
          </div>
        </dl>
        <p className="print-note">
          Use your browser’s Print command to save this receipt as PDF.
        </p>
      </article>
    </main>
  );
}
