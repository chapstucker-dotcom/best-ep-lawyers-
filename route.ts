import { NextResponse } from "next/server";

export function GET() {
  return new NextResponse(
`User-agent: *
Allow: /
Sitemap: https://besteplawyers.example/sitemap.xml
`, { headers: { "Content-Type": "text/plain" } }
  );
}
