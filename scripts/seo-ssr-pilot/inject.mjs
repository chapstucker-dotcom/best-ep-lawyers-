import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const bundle = join(process.cwd(), ".seo-ssr-test", "entry.js");
const bundleSource = readFileSync(bundle, "utf8");

if (!bundleSource.includes("Personal Injury SSR:")) {
  throw new Error("SSR bundle validation failed");
}

const { renderPersonalInjury, renderMotorcycle, renderCarAccident, renderTruckAccident, renderFamilyViolence, renderLandlordTenant, renderPrenuptialAgreement, renderSexDiscrimination, renderSideswipeAccident, renderTBoneAccident, renderUninsuredMotorist, renderWrongWayAccident } = await import(
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
  { slug: "el-paso-family-violence-lawyers", marker: "family-violence", render: renderFamilyViolence },
  { slug: "el-paso-landlord-tenant-lawyers", marker: "landlord-tenant", render: renderLandlordTenant },
  { slug: "el-paso-prenuptial-agreement-lawyers", marker: "prenuptial-agreement", render: renderPrenuptialAgreement },
  { slug: "el-paso-sex-discrimination-lawyers", marker: "sex-discrimination", render: renderSexDiscrimination },
  { slug: "el-paso-sideswipe-accident-lawyers", marker: "sideswipe-accident", render: renderSideswipeAccident },
  { slug: "el-paso-t-bone-accident-lawyers", marker: "t-bone-accident", render: renderTBoneAccident },
  { slug: "el-paso-uninsured-motorist-lawyers", marker: "uninsured-motorist", render: renderUninsuredMotorist },
  { slug: "el-paso-wrong-way-accident-lawyers", marker: "wrong-way-accident", render: renderWrongWayAccident },
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
