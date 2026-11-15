import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const sitemapPath = path.join(dist, 'sitemap.xml');
const origin = 'https://www.elpasosbestlawyers.com';

if (!fs.existsSync(sitemapPath)) {
  throw new Error('Missing dist/sitemap.xml. Run npm run build first.');
}

const xml = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)]
  .map(m => m[1].trim().replace(/&amp;/g, '&'));

if (!urls.length) throw new Error('Sitemap contains no URLs.');

const findings = [];
const titles = new Map();
const descriptions = new Map();
const seen = new Set();

function report(severity, url, code, detail) {
  findings.push({ severity, url, code, detail });
}

function tags(html, name) {
  const pattern = new RegExp('<' + name + '\\b[^>]*>', 'gi');
  return [...html.matchAll(pattern)].map(match => match[0]);
}

function attr(tag, name) {
  const pattern = new RegExp('\\b' + name + '\\s*=\\s*["\\x27]([^"\\x27]*)["\\x27]', 'i');
  return tag.match(pattern)?.[1] ?? null;
}
function meta(html, name) {
  return tags(html, 'meta')
    .filter(tag => attr(tag, 'name')?.toLowerCase() === name.toLowerCase())
    .map(tag => attr(tag, 'content'));
}

function canonicalTags(html) {
  return tags(html, 'link')
    .filter(tag => attr(tag, 'rel')?.toLowerCase().split(/\s+/).includes('canonical'))
    .map(tag => attr(tag, 'href'));
}

function decode(value) {
  return value.replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

for (const url of urls) {
  if (seen.has(url)) {
    report('ERROR', url, 'DUPLICATE_URL', 'Duplicate sitemap entry');
    continue;
  }
  seen.add(url);

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    report('ERROR', url, 'INVALID_URL', 'Invalid sitemap URL');
    continue;
  }

  if (parsed.origin !== origin || parsed.search || parsed.hash) {
    report('ERROR', url, 'INVALID_SITEMAP_LOCATION', 'Unexpected host, query, or fragment');
    continue;
  }

  const segments = parsed.pathname.split('/').filter(Boolean);

  if (segments.some(segment => segment === '.' || segment === '..')) {
    report('ERROR', url, 'INVALID_PATH', 'Unsafe path segment');
    continue;
  }

  const file = path.join(dist, ...segments, 'index.html');

  if (!fs.existsSync(file)) {
    report('ERROR', url, 'MISSING_HTML', `No generated HTML: ${path.relative(root, file)}`);
    continue;
  }

  const html = fs.readFileSync(file, 'utf8');
  const title = decode(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '');
  const desc = meta(html, 'description');
  const canonicals = canonicalTags(html);
  const robots = meta(html, 'robots');

  if (!title) {
    report('ERROR', url, 'MISSING_TITLE', 'Missing HTML title');
  } else {
    const previous = titles.get(title);
    if (previous) report('WARNING', url, 'DUPLICATE_TITLE', `Also used by ${previous}`);
    else titles.set(title, url);
  }

  if (!desc.length || !desc[0]?.trim()) {
    report('WARNING', url, 'MISSING_DESCRIPTION', 'Missing meta description');
  } else {
    const description = decode(desc[0].trim());
    const previous = descriptions.get(description);
    if (previous) report('WARNING', url, 'DUPLICATE_DESCRIPTION', `Also used by ${previous}`);
    else descriptions.set(description, url);
  }

  if (canonicals.length !== 1 || !canonicals[0]) {
    report('ERROR', url, 'CANONICAL_COUNT', `Found ${canonicals.length} canonical tags`);
  } else {
    const expected = url.replace(/\/$/, '') || origin;
    const actual = canonicals[0].replace(/\/$/, '');
    if (actual !== expected) {
      report('WARNING', url, 'CANONICAL_MISMATCH', `Canonical: ${canonicals[0]}`);
    }
  }

  if (robots.some(value => /\bnoindex\b/i.test(value ?? ''))) {
    report('ERROR', url, 'NOINDEX', 'Sitemap page contains noindex');
  }

  if (robots.length > 1) {
    report('WARNING', url, 'MULTIPLE_ROBOTS_TAGS', `Found ${robots.length} robots meta tags`);
  }
}

const totals = {
  urls: urls.length,
  errors: findings.filter(f => f.severity === 'ERROR').length,
  warnings: findings.filter(f => f.severity === 'WARNING').length
};

const result = {
  generatedAt: new Date().toISOString(),
  scope: 'Local dist HTML only; no live HTTP checks',
  totals,
  findings
};

const output = path.join(dist, 'seo-audit-report.json');
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');

console.log('\n=== EPBL TECHNICAL SEO AUDIT ===');
console.log(`Sitemap URLs: ${totals.urls}`);
console.log(`Errors: ${totals.errors}`);
console.log(`Warnings: ${totals.warnings}`);
console.log(`Report: ${output}`);

const counts = new Map();
for (const finding of findings) {
  counts.set(finding.code, (counts.get(finding.code) ?? 0) + 1);
}

for (const [code, count] of [...counts].sort((a, b) => b[1] - a[1])) {
  console.log(`${code}: ${count}`);
}

console.log('\nAudit completed. No website files modified.');
