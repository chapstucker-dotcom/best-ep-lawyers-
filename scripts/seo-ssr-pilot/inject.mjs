import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const bundle = join(process.cwd(), ".seo-ssr-test", "entry.js");
const bundleSource = readFileSync(bundle, "utf8");

if (!bundleSource.includes("Personal Injury SSR:")) {
  throw new Error("SSR bundle validation failed");
}

const { renderPersonalInjury, renderMotorcycle, renderCarAccident, renderTruckAccident } = await import(
  pathToFileURL(bundle).href
);

const pages = [
  {
    slug: "el-paso-personal-injury-lawyers",
    marker: "personal-injury",
    render: renderPersonalInjury,
  },
  {
    slug: "el-paso-motorcycle-accident-lawyers",
    marker: "motorcycle",
    render: renderMotorcycle,
  },  {
    slug: "el-paso-car-accident-lawyers",
    marker: "car-accident",
    render: renderCarAccident,
  },
  {
    slug: "el-paso-truck-accident-lawyers",
    marker: "truck-accident",
    render: renderTruckAccident,
  },
];

const outputs = [];

for (const page of pages) {
  if (typeof page.render !== "function") {
    throw new Error(`Missing SSR renderer for ${page.slug}`);
  }

  const target = join(process.cwd(), "dist", page.slug, "index.html");
  const html = readFileSync(target, "utf8");
  const rendered = page.render();
  const emptyRoot = '<div id="root"></div>';

  if (html.split(emptyRoot).length !== 2) {
    throw new Error(`${page.slug}: expected exactly one empty React root`);
  }

  if ((rendered.match(/<h1\b/g) ?? []).length !== 1) {
    throw new Error(`${page.slug}: SSR must contain exactly one H1`);
  }

  const output = html.replace(
    emptyRoot,
    `<div id="root" data-ssr="${page.marker}">${rendered}</div>`
  );

  outputs.push({ target, output, slug: page.slug, length: rendered.length });
}

for (const item of outputs) {
  writeFileSync(item.target, item.output, "utf8");
  console.log(`${item.slug}: ${item.length} SSR characters injected`);
}
