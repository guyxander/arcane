"use client";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function Login(){const [error,setError]=useState("");async function signIn(){const db=createClient();if(!db){setError("Admin authentication has not been connected yet.");return;}const {error}=await db.auth.signInWithOAuth({provider:"google",options:{redirectTo:`${location.origin}/auth/callback?next=/admin`}});if(error)setError(error.message);}return <main className="portal-page auth-page"><div className="auth-card"><span className="flow-kicker">ARCANE ACADEMY CRM</span><h1>Staff access</h1><p>Use your approved Arcane Academy Google account. New staff accounts remain pending until an administrator approves them.</p><button className="google-button" onClick={signIn}>Continue with Google</button>{error&&<p className="form-error">{error}</p>}<Link href="/">← Return to website</Link></div></main>}
