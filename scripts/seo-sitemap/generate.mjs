import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const source = join(root, 'public', 'sitemap.xml');
const dist = join(root, 'dist');
const firmDir = join(dist, 'firm');
const target = join(dist, 'sitemap.xml');
const origin = 'https://www.elpasosbestlawyers.com';

if (![source, dist, firmDir].every(existsSync)) {
  throw new Error('Missing sitemap or generated firm pages. Run the production build first.');
}

const original = readFileSync(source, 'utf8');

if (!/<urlset\b[^>]*>/.test(original) || !/<\/urlset>\s*$/.test(original)) {
  throw new Error('Invalid or unexpected sitemap structure.');
}

const existing = new Set(
  [...original.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)]
    .map(match => match[1].trim().replace(/&amp;/g, '&'))
);

if (existing.size === 0) {
  throw new Error('Source sitemap is empty.');
}

const additions = [];

for (const id of readdirSync(firmDir).sort()) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    throw new Error(`Unexpected firm directory: ${id}`);
  }

  const file = join(firmDir, id, 'index.html');
  if (!existsSync(file)) continue;

  const html = readFileSync(file, 'utf8');
  const tags = [...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)];

  if (tags.length !== 1) {
    throw new Error(`Invalid canonical count for ${id}`);
  }

  const canonical = tags[0][0].match(/\bhref=["']([^"']+)["']/i)?.[1];
  const expected = `${origin}/firm/${id}`;

  if (canonical !== expected) {
    throw new Error(`Canonical mismatch for ${id}: ${canonical}`);
  }

  if (!html.includes(`data-firm-seo="${id}"`)) {
    throw new Error(`Missing generated SEO content for ${id}`);
  }

  if (/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) {
    throw new Error(`Noindex firm cannot enter sitemap: ${id}`);
  }

  if (!existing.has(expected)) {
    existing.add(expected);
    additions.push(expected);
  }
}

const entries = additions.map(url =>
  `  <url>\n    <loc>${url}</loc>\n  </url>`
).join('\n');

const updated = additions.length
  ? original.replace(/\s*<\/urlset>\s*$/, `\n${entries}\n</urlset>\n`)
  : original;

writeFileSync(target, updated, 'utf8');

console.log(`Sitemap: ${existing.size} total URLs`);
console.log(`Added ${additions.length} generated firm pages`);
for (const url of additions) console.log(`+ ${url}`);
console.log('Original public/sitemap.xml preserved.');
