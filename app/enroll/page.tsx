import Link from "next/link";
import { EnrollmentFlow } from "./EnrollmentFlow";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata = { title: "Enroll | Arcane Academy", description: "Choose your Arcane Academy course, learning package and preferred schedule." };
export const dynamic = "force-dynamic";

export default async function EnrollPage() {
  const db = createPublicClient();
  const { data } = db ? await db.rpc("get_catalog") : { data: null };
  return <main className="portal-page"><header className="portal-nav"><Link href="/" className="portal-brand">ARCANE <span>ACADEMY</span></Link><Link href="/">← Back to academy</Link></header><EnrollmentFlow catalog={data || { prices: [], slots: [] }}/></main>;
}
