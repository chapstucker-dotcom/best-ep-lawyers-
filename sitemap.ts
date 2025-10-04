import { SAMPLE_FIRMS } from "@/lib/sampleData";

export default function sitemap() {
  const base = "https://besteplawyers.example";
  const staticRoutes = ["", "/admin"].map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  const firmRoutes = SAMPLE_FIRMS.map((f) => ({
    url: `${base}/firms/${f.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...firmRoutes];
}
