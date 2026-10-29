import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const routes = JSON.parse(readFileSync(join(root, "scripts/seo-114-routes.json"), "utf8"));
const bundle = join(root, ".seo-ssr-test/entry.js");
if (!existsSync(bundle)) throw new Error("Missing SSR bundle");
const { renderRoute } = await import(pathToFileURL(bundle).href);
if (typeof renderRoute !== "function") throw new Error("SSR bundle missing renderRoute");

const personalInjuryPath = "/el-paso-personal-injury-lawyers";
const canonicalUrl = "https://www.elpasosbestlawyers.com/el-paso-personal-injury-lawyers/";
const personalInjurySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: "Best Personal Injury Lawyers in El Paso, TX | El Paso's Best Lawyers",
      description: "Compare personal injury lawyers in El Paso, Texas for car accidents, truck crashes, slip and falls, dog bites, serious injuries, wrongful death, and insurance disputes.",
      isPartOf: {
        "@type": "WebSite",
        name: "El Paso's Best Lawyers",
        url: "https://www.elpasosbestlawyers.com/",
      },
      about: {
        "@type": "Thing",
        name: "Personal Injury Lawyers in El Paso, Texas",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.elpasosbestlawyers.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Personal Injury Lawyers",
          item: canonicalUrl,
        },
      ],
    },
  ],
};

for (const path of ["/", ...routes]) {
  const file = join(root, "dist", path.slice(1), "index.html");
  if (!existsSync(file)) throw new Error(`Missing generated HTML for ${path}`);
  const source = readFileSync(file, "utf8");
  const rootRx = /<div id="root"><\/div>/g;
  if ([...source.matchAll(rootRx)].length !== 1) throw new Error(`${path}: expected one empty root`);
  const rendered = renderRoute(path);
  let output = source.replace(rootRx, `<div id="root">${rendered}</div>`);
  if ((output.match(/<h1\b/gi) ?? []).length !== 1) throw new Error(`${path}: invalid final H1`);

  if (path === personalInjuryPath) {
    if ((output.match(/<\/head>/gi) ?? []).length !== 1) throw new Error(`${path}: expected one head closing tag`);
    if (output.includes('id="personal-injury-seo-schema"')) throw new Error(`${path}: duplicate personal injury schema`);
    if (output.includes('"BreadcrumbList"') || output.includes('"WebPage"')) throw new Error(`${path}: existing page-specific schema requires review`);
    const schemaJson = JSON.stringify(personalInjurySchema).replace(/</g, "\\u003c");
    output = output.replace("</head>", `<script id="personal-injury-seo-schema" type="application/ld+json">${schemaJson}</script></head>`);
  }

  writeFileSync(file, output);
  console.log(`SSR: ${path}`);
}
