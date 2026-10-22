import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const bundle = join(process.cwd(), ".seo-ssr-test", "entry.js");
const bundleSource = readFileSync(bundle, "utf8");

if (!bundleSource.includes("Personal Injury SSR:")) {
  throw new Error("SSR bundle validation failed");
}

const { renderPersonalInjury, renderMotorcycle, renderCarAccident, renderTruckAccident, renderFamilyViolence, renderProtectiveOrder, renderLandlordTenant, renderPrenuptialAgreement, renderSexDiscrimination, renderSideswipeAccident, renderTBoneAccident, renderUninsuredMotorist, renderWrongWayAccident, renderWageHour, renderSexualHarassment, renderCriminalDefense, renderImmigration, renderFamilyLaw, renderEmploymentLaw, renderWrongfulTermination, renderWrongfulDeath, renderMedicalMalpractice, renderSlipAndFall, renderEstatePlanning, renderRetaliation, renderDWI, renderUninsuredDriverGuide, renderTrafficTicket, renderWorkersCompensation } = await import(
  pathToFileURL(bundle).href
);

const pages = [
  { slug: "el-paso-traffic-ticket-lawyers", marker: "traffic-ticket", render: renderTrafficTicket },
  { slug: "el-paso-workers-compensation-lawyers", marker: "workers-compensation", render: renderWorkersCompensation },
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
  { slug: "el-paso-protective-order-lawyers", marker: "protective-order", render: renderProtectiveOrder },
  { slug: "el-paso-landlord-tenant-lawyers", marker: "landlord-tenant", render: renderLandlordTenant },
  { slug: "el-paso-prenuptial-agreement-lawyers", marker: "prenuptial-agreement", render: renderPrenuptialAgreement },
  { slug: "el-paso-sex-discrimination-lawyers", marker: "sex-discrimination", render: renderSexDiscrimination },
  { slug: "el-paso-sideswipe-accident-lawyers", marker: "sideswipe-accident", render: renderSideswipeAccident },
  { slug: "el-paso-t-bone-accident-lawyers", marker: "t-bone-accident", render: renderTBoneAccident },
  { slug: "el-paso-uninsured-motorist-lawyers", marker: "uninsured-motorist", render: renderUninsuredMotorist },
  { slug: "el-paso-wrong-way-accident-lawyers", marker: "wrong-way-accident", render: renderWrongWayAccident },
  { slug: "el-paso-wage-hour-lawyers", marker: "wage-hour", render: renderWageHour },
  { slug: "el-paso-sexual-harassment-lawyers", marker: "sexual-harassment", render: renderSexualHarassment },
  { slug: "el-paso-criminal-defense-lawyers", marker: "criminal-defense", render: renderCriminalDefense },
  { slug: "el-paso-immigration-lawyers", marker: "immigration", render: renderImmigration },
  { slug: "el-paso-family-lawyers", marker: "family", render: renderFamilyLaw },
  { slug: "el-paso-employment-lawyers", marker: "employment", render: renderEmploymentLaw },
  { slug: "el-paso-wrongful-termination-lawyers", marker: "wrongful-termination", render: renderWrongfulTermination },
  { slug: "el-paso-wrongful-death-lawyers", marker: "wrongful-death", render: renderWrongfulDeath },
  { slug: "el-paso-medical-malpractice-lawyers", marker: "medical-malpractice", render: renderMedicalMalpractice },
  { slug: "el-paso-slip-and-fall-lawyers", marker: "slip-and-fall", render: renderSlipAndFall },
  { slug: "el-paso-estate-planning-lawyers", marker: "estate-planning", render: renderEstatePlanning },
  { slug: "el-paso-retaliation-lawyers", marker: "retaliation", render: renderRetaliation },
  { slug: "el-paso-dwi-lawyers", marker: "dwi", render: renderDWI },
  { slug: "guides/uninsured-driver-accident-texas", marker: "uninsured-driver-guide", render: renderUninsuredDriverGuide },
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
