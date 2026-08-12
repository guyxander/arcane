import Link from "next/link";
export const metadata = { title: "Privacy Notice | Arcane Academy" };
export default function Privacy() {
  return (
    <main className="legal-page">
      <article>
        <span className="flow-kicker">ARCANE ACADEMY</span>
        <h1>Privacy notice</h1>
        <p>Last updated: August 12, 2026</p>
        <h2>Information we collect</h2>
        <p>
          We collect the name, phone number, WhatsApp number, age range, location, course
          preference, schedule preference and enrollment activity you submit. We
          also record aggregate page visits, device category, browser and
          operating system. We do not store raw visitor IP addresses or create
          persistent device fingerprints.
        </p>
        <h2>How we use it</h2>
        <p>
          We use this information to calculate offers, contact applicants,
          schedule classes, confirm payments, support learners, issue receipts
          and certificates, improve the website and operate the Arcane Academy
          CRM.
        </p>
        <h2>Who can access it</h2>
        <p>
          Approved Arcane staff only receive the access needed for their
          assigned work. Service providers such as Supabase and Vercel process
          information to host the service.
        </p>
        <h2>Retention and your choices</h2>
        <p>
          Unsuccessful leads are reviewed for deletion or anonymisation after 12
          months. Financial and certificate records may be retained where
          operational or legal requirements apply. You may request access,
          correction or deletion by emailing okosaanthony@gmail.com.
        </p>
        <h2>Public certificates</h2>
        <p>
          If you complete a course, your full name, course, completion date and
          verification number will be publicly visible on the certificate
          verification page.
        </p>
        <p>
          <Link href="/enroll">Return to enrollment</Link>
        </p>
      </article>
    </main>
  );
}
