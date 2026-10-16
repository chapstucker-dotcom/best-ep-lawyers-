import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

let html = readFileSync("dist/index.html", "utf8");
const title = "Create Firm Account | El Paso's Best Lawyers";
const description = "Create a law firm account on El Paso's Best Lawyers to manage your firm profile, attorneys, and directory visibility.";
const canonical = "https://www.elpasosbestlawyers.com/signup";

function replaceOne(pattern, replacement, label) {
  const matches = [...html.matchAll(new RegExp(pattern.source, "gs"))];
  if (matches.length !== 1) throw new Error(`${label}: expected one match, found ${matches.length}`);
  html = html.replace(pattern, () => replacement);
}

replaceOne(/<title>[^<]*<\/title>/, `<title>${title}</title>`, "title");
replaceOne(/<meta\b(?=[^>]*name="description")[^>]*>/, `<meta name="description" content="${description}" />`, "description");
replaceOne(/<meta\b(?=[^>]*name="robots")[^>]*>/, '<meta name="robots" content="noindex, nofollow" />', "robots");
replaceOne(/<link\b(?=[^>]*rel="canonical")[^>]*>/, `<link rel="canonical" href="${canonical}" />`, "canonical");

for (const [name, value] of [["og:url", canonical], ["og:title", title], ["og:description", description]]) {
  replaceOne(new RegExp(`<meta\\b(?=[^>]*property="${name}")[^>]*>`), `<meta property="${name}" content="${value}" />`, name);
}
for (const [name, value] of [["twitter:title", title], ["twitter:description", description]]) {
  replaceOne(new RegExp(`<meta\\b(?=[^>]*name="${name}")[^>]*>`), `<meta name="${name}" content="${value}" />`, name);
}

replaceOne(/<script type="application\/ld\+json">\s*\{[^<]*"@type": "WebSite"[\s\S]*?<\/script>/, "", "WebSite structured data");
replaceOne(/<script type="application\/ld\+json">\s*\{[^<]*"@type": "Organization"[\s\S]*?<\/script>/, "", "Organization structured data");

if (!html.includes('id="root"') || !html.includes('src="/assets/')) {
  throw new Error("Compiled React application missing");
}

mkdirSync(join("dist", "signup"), { recursive: true });
writeFileSync(join("dist", "signup", "index.html"), html, "utf8");
console.log("Signup HTML generated successfully");
