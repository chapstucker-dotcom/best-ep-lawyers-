import fs from 'node:fs';
import path from 'node:path';

const origin = 'https://www.elpasosbestlawyers.com';
const sitemapUrl = `${origin}/sitemap.xml`;
const timeoutMs = 15000;
const delayMs = 350;

const findings = [];
const results = [];

function report(severity, url, code, detail) {
  findings.push({ severity, url, code, detail });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      'User-Agent': 'EPBL-SEO-Monitor/1.0'
    }
  });

  return {
    status: response.status,
    finalUrl: response.url,
    contentType: response.headers.get('content-type') ?? '',
    robotsHeader: response.headers.get('x-robots-tag') ?? '',
    body: await response.text()
  };
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
    .filter(tag => attr(tag, 'name')?.toLowerCase() === name)
    .map(tag => attr(tag, 'content'));
}

function canonical(html) {
  return tags(html, 'link')
    .filter(tag => attr(tag, 'rel')?.toLowerCase().split(/\s+/).includes('canonical'))
    .map(tag => attr(tag, 'href'));
}

function normalize(url) {
  return url.replace(/\/$/, '');
}

console.log('Fetching live sitemap...');
const sitemap = await request(sitemapUrl);

if (sitemap.status !== 200) {
  throw new Error(`Sitemap returned HTTP ${sitemap.status}`);
}

const urls = [...sitemap.body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)]
  .map(match => match[1].trim().replace(/&amp;/g, '&'));

if (!urls.length) {
  throw new Error('Live sitemap contains no URLs.');
}

console.log(`Checking ${urls.length} live URLs...`);

for (let index = 0; index < urls.length; index++) {
  const url = urls[index];

  try {
    const parsed = new URL(url);

    if (parsed.origin !== origin) {
      report('ERROR', url, 'EXTERNAL_URL', 'Unexpected sitemap origin');
      continue;
    }

    const page = await request(url);

    results.push({
      url,
      status: page.status,
      finalUrl: page.finalUrl
    });

    if (page.status !== 200) {
      report('ERROR', url, 'HTTP_STATUS', `HTTP ${page.status}`);
    }

    if (normalize(page.finalUrl) !== normalize(url)) {
      report('WARNING', url, 'REDIRECT', `Final URL: ${page.finalUrl}`);
    }

    if (!page.contentType.toLowerCase().includes('text/html')) {
      report('ERROR', url, 'CONTENT_TYPE', page.contentType);
      continue;
    }

    const title = page.body.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
    const descriptions = meta(page.body, 'description');
    const canonicals = canonical(page.body);
    const robots = meta(page.body, 'robots');

    if (!title) {
      report('ERROR', url, 'MISSING_TITLE', 'Missing title');
    }

    if (!descriptions.length || !descriptions[0]?.trim()) {
      report('WARNING', url, 'MISSING_DESCRIPTION', 'Missing meta description');
    }

    if (canonicals.length !== 1) {
      report('ERROR', url, 'CANONICAL_COUNT', `Found ${canonicals.length} canonical tags`);
    } else if (normalize(canonicals[0]) !== normalize(url)) {
      report('ERROR', url, 'CANONICAL_MISMATCH', canonicals[0]);
    }

    if (
      robots.some(value => /\bnoindex\b/i.test(value ?? '')) ||
      /\bnoindex\b/i.test(page.robotsHeader)
    ) {
      report('ERROR', url, 'NOINDEX', 'Indexing blocked by robots directive');
    }
  } catch (error) {
    report('ERROR', url, 'REQUEST_FAILED', error.message);
  }

  if ((index + 1) % 20 === 0 || index + 1 === urls.length) {
    console.log(`Checked ${index + 1}/${urls.length}`);
  }

  await delay(delayMs);
}

const summary = {
  checked: urls.length,
  errors: findings.filter(item => item.severity === 'ERROR').length,
  warnings: findings.filter(item => item.severity === 'WARNING').length
};

const output = {
  generatedAt: new Date().toISOString(),
  sitemapUrl,
  summary,
  findings,
  results
};

const outputPath = path.resolve('seo-live-report.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2) + '\n');

console.log('\n=== EPBL LIVE SEO REPORT ===');
console.log(summary);
console.log(`Report: ${outputPath}`);

if (summary.errors > 0) { process.exitCode = 1; }

const counts = new Map();
for (const finding of findings) {
  counts.set(finding.code, (counts.get(finding.code) ?? 0) + 1);
}

for (const [code, count] of [...counts].sort((a, b) => b[1] - a[1])) {
  console.log(`${code}: ${count}`);
}
