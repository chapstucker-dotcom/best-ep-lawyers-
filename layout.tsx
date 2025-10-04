import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://besteplawyers.example"),
  title: "Best EP Lawyers — Find Top Attorneys in El Paso, Texas",
  description:
    "Find El Paso lawyers by name or category. Educational Texas-law resources. Free listings with optional upgrades for more exposure.",
  keywords: [
    "El Paso lawyers",
    "Texas attorneys",
    "law firms El Paso",
    "personal injury lawyer El Paso",
    "immigration attorney El Paso",
    "family law El Paso",
    "criminal defense El Paso",
    "Best EP Lawyers",
  ],
  openGraph: {
    title: "Best EP Lawyers",
    description:
      "Search trusted El Paso law firms, compare plans, and learn how Texas law works.",
    type: "website",
    locale: "en_US",
    url: "https://besteplawyers.example",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">{children}</body>
    </html>
  );
}
