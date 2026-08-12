import { createPublicClient } from "@/lib/supabase/public";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function Verify({ params }: { params: Promise<{ verification: string }> }) {
  const { verification } = await params;
  const db = createPublicClient();
  if (!db) notFound();
  const { data } = await db.rpc("verify_certificate", { p_verification: verification });
  const certificate = data?.[0];
  if (!certificate) notFound();
  return <main className="portal-page certificate-page"><section className="certificate-card"><span className="verified-mark">✓</span><span className="flow-kicker">VERIFIED CERTIFICATE</span><h1>{certificate.learner_name}</h1><p>successfully completed</p><h2>{certificate.course}</h2><dl><div><dt>Verification number</dt><dd>{certificate.verification_number}</dd></div><div><dt>Issued</dt><dd>{new Date(certificate.issued_at).toLocaleDateString("en-NG", { dateStyle: "long" })}</dd></div></dl><strong>ARCANE ACADEMY MANAGEMENT</strong></section></main>;
}
