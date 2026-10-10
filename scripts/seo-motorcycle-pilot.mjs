import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const source = readFileSync(join(root, 'src/pages/MotorcycleAccident.tsx'), 'utf8');
const template = readFileSync(join(root, 'dist/index.html'), 'utf8');
const path = '/el-paso-motorcycle-accident-lawyers';
const site = 'https://www.elpasosbestlawyers.com';
const get = (key) => {
  const m = source.match(new RegExp('\\b' + key + ':\\s*"([^"\\r\\n]+)"'));
  if (!m) throw new Error('Missing motorcycle metadata: ' + key);
  return m[1];
};
if (get('path') !== path) throw new Error('Unexpected motorcycle canonical path');
const title = get('title') + " | El Paso's Best Lawyers";
const description = get('metaDescription');
const canonical = site + path;
const esc = (v) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let html = template;
function replaceOne(pattern, replacement, name) {
  const matches = [...html.matchAll(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'))];
  if (matches.length !== 1) throw new Error(`${name}: expected exactly one match, got ${matches.length}`);
  html = html.replace(pattern, () => replacement);
}
replaceOne(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`, 'title');
replaceOne(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${esc(description)}" />`, 'description');
replaceOne(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/s, `<link rel="canonical" href="${canonical}" />`, 'canonical');
for (const [property, value] of [['og:url', canonical], ['og:title', title], ['og:description', description]]) {
  const rx = new RegExp('<meta\\s+property="' + property.replace(':', '\\:') + '"\\s+content="[^"]*"\\s*\\/>', 's');
  replaceOne(rx, `<meta property="${property}" content="${esc(value)}" />`, property);
}
for (const [name, value] of [['twitter:title', title], ['twitter:description', description]]) {
  const rx = new RegExp('<meta\\s+name="' + name.replace(':', '\\:') + '"\\s+content="[^"]*"\\s*\\/>', 's');
  replaceOne(rx, `<meta name="${name}" content="${esc(value)}" />`, name);
}
const targetDir = join(root, 'dist', path.slice(1));
mkdirSync(targetDir, { recursive: true });
writeFileSync(join(targetDir, 'index.html'), html, 'utf8');
console.log('SEO pilot HTML generated:', path);
