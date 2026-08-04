import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  title: "Arcane Academy | Build Websites & Android Apps with AI",
  description: "Beginner-friendly live online AI website and Android app development classes for learners ages 10 and above. Build a real product in two weeks.",
  icons: { icon: "/arcane-logo.jpg", shortcut: "/arcane-logo.jpg" },
  openGraph: {
    title: "Arcane Academy | Don't Just Use Technology. Build It.",
    description: "Build a real AI-powered website or Android app in two beginner-friendly weeks.",
    images: [{ url: "/og.png", width: 1792, height: 896, alt: "Arcane Academy AI web and Android development classes" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
