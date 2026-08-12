import Link from "next/link";
import { EnrollmentFlow } from "./EnrollmentFlow";

export const metadata = { title: "Enroll | Arcane Academy", description: "Choose your Arcane Academy course, learning package and preferred schedule." };

export default function EnrollPage() {
  return <main className="portal-page"><header className="portal-nav"><Link href="/" className="portal-brand">ARCANE <span>ACADEMY</span></Link><Link href="/">← Back to academy</Link></header><EnrollmentFlow /></main>;
}
