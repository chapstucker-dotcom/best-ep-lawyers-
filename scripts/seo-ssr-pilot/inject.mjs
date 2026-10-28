import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const routes = JSON.parse(readFileSync(join(root, "scripts/seo-114-routes.json"), "utf8"));
const bundle = join(root, ".seo-ssr-test/entry.js");
if (!existsSync(bundle)) throw new Error("Missing SSR bundle");
const { renderRoute } = await import(pathToFileURL(bundle).href);
if (typeof renderRoute !== "function") throw new Error("SSR bundle missing renderRoute");
for (const path of ["/", ...routes]) {
  const file = join(root, "dist", path.slice(1), "index.html");
  if (!existsSync(file)) throw new Error(`Missing generated HTML for ${path}`);
  const source = readFileSync(file, "utf8");
  const rootRx = /<div id="root"><\/div>/g;
  if ([...source.matchAll(rootRx)].length !== 1) throw new Error(`${path}: expected one empty root`);
  const rendered = renderRoute(path);
  const output = source.replace(rootRx, `<div id="root">${rendered}</div>`);
  if ((output.match(/<h1\b/gi) ?? []).length !== 1) throw new Error(`${path}: invalid final H1`);
  writeFileSync(file, output);
  console.log(`SSR: ${path}`);
}
