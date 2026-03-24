export default function sitemap() {
  const base = "https://besteplawyers.example";
  const staticRoutes = ["", "/admin"].map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  // No demo/sample firm routes in production
  return staticRoutes;
}
