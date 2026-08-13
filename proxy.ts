import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const legacyHosts = new Set([
  "arcaneacademy.vercel.app",
  "arcane-academy-mauve.vercel.app",
  "www.arcaneacademy.xyz",
]);

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  if (!host || !legacyHosts.has(host)) return NextResponse.next();
  const destination = request.nextUrl.clone();
  destination.protocol = "https";
  destination.host = "arcaneacademy.xyz";
  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
