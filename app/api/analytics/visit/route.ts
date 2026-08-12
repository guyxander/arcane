import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ua = request.headers.get("user-agent") || "";
    if (/bot|crawler|spider|headless|lighthouse|pagespeed/i.test(ua)) return new NextResponse(null, { status: 204 });
    const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Other";
    const os = /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Other";
    const db = createPublicClient();
    let referrerDomain: string | null = null;
    try { referrerDomain = body.referrer ? new URL(String(body.referrer)).hostname : null; } catch { referrerDomain = null; }
    if (db) await db.rpc("record_visit", { p_path: String(body.path || "/").slice(0, 200), p_device_type: String(body.device || "unknown"), p_browser: browser, p_os: os, p_referrer_domain: referrerDomain });
    return new NextResponse(null, { status: 204 });
  } catch { return new NextResponse(null, { status: 204 }); }
}
