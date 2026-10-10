import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const template = readFileSync(join(root, 'dist/index.html'), 'utf8');
const site = 'https://www.elpasosbestlawyers.com';
const pages = [
  {
    path: '/el-paso-motorcycle-accident-lawyers',
    source: 'src/pages/MotorcycleAccident.tsx',
    mode: 'pageData',
  },
  {
    path: '/el-paso-personal-injury-lawyers',
    source: 'src/pages/PersonalInjury.tsx',
    mode: 'runtime',
  },
  {
    path: '/el-paso-car-accident-lawyers',
    source: 'src/pages/CarAccidentLawyers.tsx',
    mode: 'runtime',
  },
  {
    path: '/el-paso-truck-accident-lawyers',
    source: 'src/pages/TruckAccidentLawyers.tsx',
    mode: 'runtime',
  },
];

const escapeHtml = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function extract(source, pattern, label) {
  const match = source.match(pattern);
  if (!match) throw new Error(`Cannot locate ${label}`);
  return match[1];
}

function replaceOne(html, pattern, replacement, label) {
  const matches = [...html.matchAll(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`))];
  if (matches.length !== 1) throw new Error(`${label}: expected exactly one match, got ${matches.length}`);
  return html.replace(pattern, () => replacement);
}

for (const page of pages) {
  const source = readFileSync(join(root, page.source), 'utf8');
  let title;
  let description;
  if (page.mode === 'pageData') {
    const sourcePath = extract(source, /\bpath:\s*"([^"\r\n]+)"/, `${page.source} path`);
    if (sourcePath !== page.path) throw new Error(`Unexpected path in ${page.source}: ${sourcePath}`);
    title = `${extract(source, /\btitle:\s*"([^"\r\n]+)"/, `${page.source} title`)} | El Paso's Best Lawyers`;
    description = extract(source, /\bmetaDescription:\s*"([^"\r\n]+)"/, `${page.source} metaDescription`);
  } else {
    title = extract(source, /const title\s*=\s*"([^"\r\n]+)"/, `${page.source} runtime title`);
    description = extract(source, /const description\s*=\s*"([^"\r\n]+)"/, `${page.source} runtime description`);
    const runtimeCanonical = extract(source, /const canonical(?:Url)?\s*=\s*"([^"\r\n]+)"/, `${page.source} canonical`);
    if (runtimeCanonical !== `${site}${page.path}/`) {
      throw new Error(`${page.source} canonical must end in / and match ${page.path}/; found ${runtimeCanonical}`);
    }
  }
  const canonical = `${site}${page.path}/`;
  let html = template;
  html = replaceOne(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`, `${page.path} title`);
  html = replaceOne(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s, `<meta name="description" content="${escapeHtml(description)}" />`, `${page.path} description`);
  html = replaceOne(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/s, `<link rel="canonical" href="${canonical}" />`, `${page.path} canonical`);
  for (const [property, value] of [['og:url', canonical], ['og:title', title], ['og:description', description]]) {
    const rx = new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]*"\\s*\\/>`, 's');
    html = replaceOne(html, rx, `<meta property="${property}" content="${escapeHtml(value)}" />`, `${page.path} ${property}`);
  }
  for (const [name, value] of [['twitter:title', title], ['twitter:description', description]]) {
    const rx = new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*\\/>`, 's');
    html = replaceOne(html, rx, `<meta name="${name}" content="${escapeHtml(value)}" />`, `${page.path} ${name}`);
  }
  const targetDir = join(root, 'dist', page.path.slice(1));
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(join(targetDir, 'index.html'), html, 'utf8');
  console.log('SEO initial HTML generated:', `${page.path}/`);
}
