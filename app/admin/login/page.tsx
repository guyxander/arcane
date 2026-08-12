"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function signIn() {
    const db = createClient();
    if (!db) return setError("Admin authentication has not been connected yet.");
    setBusy(true);
    const { error: signInError } = await db.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${location.origin}/auth/callback?next=/admin` } });
    if (signInError) { setError(signInError.message); setBusy(false); }
  }
  return <main className="portal-page auth-page"><section className="auth-shell"><div className="auth-intro"><span className="flow-kicker">ARCANE ACADEMY · OPERATIONS</span><h1>Run every learner journey from one place.</h1><p>Manage applications, schedules, payments, tutors, projects and certificates in a secure workspace.</p><ul><li>Google-authenticated staff access</li><li>Role-based customer data</li><li>Complete activity history</li></ul></div><div className="auth-card"><div className="auth-mark">A</div><span className="flow-kicker">STAFF PORTAL</span><h2>Welcome back</h2><p>Continue with an approved Arcane Academy Google account.</p><button className="google-button" onClick={signIn} disabled={busy}><span>G</span>{busy ? "Connecting…" : "Continue with Google"}</button>{error && <p className="form-error" role="alert">{error}</p>}<small>New staff requests remain pending until an administrator approves them.</small><Link href="/">← Return to public website</Link></div></section></main>;
}
