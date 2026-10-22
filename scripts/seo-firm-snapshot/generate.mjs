import { readFileSync, writeFileSync } from "node:fs";
import { transform } from "esbuild";

const source = readFileSync("src/data/firms.ts", "utf8");
const compiled = await transform(source, {
  loader: "ts",
  format: "esm",
  target: "es2022"
});

const encoded = Buffer.from(compiled.code).toString("base64");
const module = await import(`data:text/javascript;base64,${encoded}`);

if (!Array.isArray(module.firms)) {
  throw new Error("Expected exported firms array");
}

const publicFields = [
  "id", "name", "category", "categories", "specialties",
  "description", "bio", "phone", "email", "website",
  "address", "city", "state", "zip_code", "logo_url",
  "plan", "plan_key", "featured", "exclusive", "verified"
];

const snapshot = module.firms.map((firm) => {
  if (!firm.id || !firm.name) {
    throw new Error("Firm missing canonical ID or name");
  }

  return Object.fromEntries(
    publicFields
      .filter((key) => firm[key] !== undefined)
      .map((key) => [key, firm[key]])
  );
});

const output = "src/data/seoFirmSnapshot.json";
writeFileSync(output, JSON.stringify(snapshot, null, 2) + "\n", "utf8");

console.log(`Generated ${snapshot.length} public firm records`);
