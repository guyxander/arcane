import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ua = request.headers.get("user-agent") || "";
    const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Other";
    const os = /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Other";
    const db = createPublicClient();
    if (db) await db.rpc("record_visit", { p_path: String(body.path || "/"), p_device_type: String(body.device || "unknown"), p_browser: browser, p_os: os, p_referrer_domain: request.headers.get("referer") ? new URL(request.headers.get("referer")!).hostname : null });
    return new NextResponse(null, { status: 204 });
  } catch { return new NextResponse(null, { status: 204 }); }
}
