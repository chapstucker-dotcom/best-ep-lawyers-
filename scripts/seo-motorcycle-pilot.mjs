import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const template = readFileSync(join(root, 'dist/index.html'), 'utf8');
const site = 'https://www.elpasosbestlawyers.com';
const pages = [
  { path: '/el-paso-motorcycle-accident-lawyers', source: 'src/pages/MotorcycleAccident.tsx', mode: 'pageData' },
  { path: '/el-paso-personal-injury-lawyers', source: 'src/pages/PersonalInjury.tsx', mode: 'runtime' },
  { path: '/el-paso-car-accident-lawyers', source: 'src/pages/CarAccidentLawyers.tsx', mode: 'runtime' },
  { path: '/el-paso-truck-accident-lawyers', source: 'src/pages/TruckAccidentLawyers.tsx', mode: 'runtime' },
  { path: '/el-paso-family-violence-lawyers', source: 'src/data/practiceAreaPages.ts', mode: 'shared' },
  { path: '/el-paso-landlord-tenant-lawyers', source: 'src/data/practiceAreaPages.ts', mode: 'shared' },
  { path: '/el-paso-prenuptial-agreement-lawyers', source: 'src/data/practiceAreaPages.ts', mode: 'shared' },
  { path: '/el-paso-sex-discrimination-lawyers', source: 'src/pages/SexDiscrimination.tsx', mode: 'useSeo' },
  { path: '/el-paso-sideswipe-accident-lawyers', source: 'src/pages/SideswipeAccident.tsx', mode: 'useSeo' },
  { path: '/el-paso-t-bone-accident-lawyers', source: 'src/pages/TBoneAccident.tsx', mode: 'pageData' },
  { path: '/el-paso-uninsured-motorist-lawyers', source: 'src/pages/UninsuredMotorist.tsx', mode: 'pageData' },
  { path: '/el-paso-wrong-way-accident-lawyers', source: 'src/pages/WrongWayAccident.tsx', mode: 'pageData' },
  { path: '/el-paso-wage-hour-lawyers', source: 'src/pages/WageHour.tsx', mode: 'useSeo' },
  { path: '/el-paso-sexual-harassment-lawyers', source: 'src/data/practiceAreaPages.ts', mode: 'shared' },
];

const escapeHtml = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function extract(source, pattern, label) {
  const matches = [...source.matchAll(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`))];
  if (matches.length !== 1) throw new Error(`${label}: expected one match, got ${matches.length}`);
  return matches[0][1];
}
function field(source, name, label) {
  return extract(source, new RegExp(`\\b${name}:\\s*"([^"\\r\\n]+)"`), label);
}
function replaceMeta(html, kind, key, value, label) {
  const rx = new RegExp(`<meta\\b(?=[^>]*\\b${kind}="${key}")[^>]*>`, 'gs');
  return replaceOne(html, rx, `<meta ${kind}="${key}" content="${escapeHtml(value)}" />`, label);
}
function replaceOne(html, pattern, replacement, label) {
  const matches = [...html.matchAll(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`))];
  if (matches.length !== 1) throw new Error(`${label}: expected exactly one match, got ${matches.length}`);
  return html.replace(pattern, () => replacement);
}
for (const page of pages) {
  const source = readFileSync(join(root, page.source), 'utf8');
  let title, description;
  if (page.mode === 'runtime') {
    title = extract(source, /const title\s*=\s*"([^"\r\n]+)"/, `${page.source} title`);
    description = extract(source, /const description\s*=\s*"([^"\r\n]+)"/, `${page.source} description`);
    const canonical = extract(source, /const canonical(?:Url)?\s*=\s*"([^"\r\n]+)"/, `${page.source} canonical`);
    if (canonical !== `${site}${page.path}/`) throw new Error(`Unexpected runtime canonical: ${canonical}`);
  } else {
    let scope = source;
    if (page.mode === 'shared') {
      const escaped = page.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matches = [...source.matchAll(new RegExp(`^\\s{4,6}path:\\s*"${escaped}"`, 'gm'))];
      if (matches.length !== 1) throw new Error(`${page.path}: expected one primary path, got ${matches.length}`);
      scope = source.slice(matches[0].index, source.indexOf('\n  },', matches[0].index) + 5);
      if (!scope || !scope.includes('metaDescription:')) throw new Error(`${page.path}: missing metadata block`);
    }
    const sourcePath = page.path;
    if (sourcePath !== page.path) throw new Error(`${page.source}: path mismatch ${sourcePath}`);
    title = field(page.mode === 'shared' ? scope.slice(0, 500) : scope, 'title', `${page.source} title`);
    description = page.mode === 'shared' ? scope.match(/\bmetaDescription:\s*"([^"\r\n]+)"/)?.[1] : field(scope, page.mode === 'useSeo' ? 'description' : 'metaDescription', `${page.source} description`);
    if (page.mode !== 'useSeo') title += ` | El Paso's Best Lawyers`;
  }
  const canonical = `${site}${page.path}/`;
  let html = template;
  html = replaceOne(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`, `${page.path} title`);
  html = replaceMeta(html, 'name', 'description', description, `${page.path} description`);
  html = replaceOne(html, /<link\b(?=[^>]*\brel="canonical")[^>]*>/gs, `<link rel="canonical" href="${canonical}" />`, `${page.path} canonical`);
  for (const [key, value] of [['og:url', canonical], ['og:title', title], ['og:description', description]]) html = replaceMeta(html, 'property', key, value, `${page.path} ${key}`);
  for (const [key, value] of [['twitter:title', title], ['twitter:description', description]]) html = replaceMeta(html, 'name', key, value, `${page.path} ${key}`);
  const target = join(root, 'dist', page.path.slice(1));
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, 'index.html'), html, 'utf8');
  console.log('SEO initial HTML generated:', `${page.path}/`);
}
