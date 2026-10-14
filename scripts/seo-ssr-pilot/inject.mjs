import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const target = join(
  process.cwd(),
  "dist",
  "el-paso-personal-injury-lawyers",
  "index.html"
);

const bundle = join(process.cwd(), ".seo-ssr-test", "entry.js");

const html = readFileSync(target, "utf8");
const bundleSource = readFileSync(bundle, "utf8");

if (!bundleSource.includes("Personal Injury SSR:")) {
  throw new Error("SSR bundle validation failed");
}

const { renderPersonalInjury } = await import(pathToFileURL(bundle).href);
const rendered = renderPersonalInjury();

const emptyRoot = '<div id="root"></div>';

if (html.split(emptyRoot).length !== 2) {
  throw new Error("Expected exactly one empty React root");
}

if ((rendered.match(/<h1\b/g) ?? []).length !== 1) {
  throw new Error("Personal Injury SSR must contain exactly one H1");
}

const output = html.replace(
  emptyRoot,
  `<div id="root" data-ssr="personal-injury">${rendered}</div>`
);

writeFileSync(target, output, "utf8");

console.log(
  `Personal Injury HTML injected successfully: ${rendered.length} characters`
);
