import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requested = searchParams.get("next");
  const next = requested?.startsWith("/") ? requested : "/admin";
  if (code) {
    const db = await createClient();
    const { error } = db ? await db.auth.exchangeCodeForSession(code) : { error: new Error("Not configured") };
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/admin/login?error=auth`);
}
