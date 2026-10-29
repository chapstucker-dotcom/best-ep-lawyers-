import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';

const cwd = process.cwd();
const dist = join(cwd, 'dist');
const ids = ['bill-d-hicks','carter-law-firm','cesar-ornelas-injury-law','labinoti-law-firm','lozano-meza-law-firm','scherr-legate-pllc'];
const bundle = join(cwd, '.seo-firm-pages-temp.mjs');
const base = 'https://www.elpasosbestlawyers.com';
const escapeHtml = value => String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const meta = (html, selector, replacement, label) => {
  const matches = html.match(selector) ?? [];
  if (matches.length !== 1) throw new Error(`Expected exactly one ${label}; found ${matches.length}`);
  return html.replace(selector, replacement);
};
try {
  await build({ entryPoints:[join(cwd,'src/data/exclusiveShowcases.ts')], bundle:true, platform:'node', format:'esm', outfile:bundle, logLevel:'silent', external:[] });
  const { getLocalExclusiveShowcase } = await import(pathToFileURL(bundle).href + `?v=${Date.now()}`);
  const template = readFileSync(join(dist,'index.html'),'utf8');
  for (const id of ids) {
    const showcase = getLocalExclusiveShowcase(id);
    if (!showcase || showcase.id !== id) throw new Error(`Showcase missing or mismatched: ${id}`);
    const firm = showcase.firm;
    if (typeof firm.name !== 'string' || !firm.name.trim() || typeof firm.description !== 'string' || !firm.description.trim()) throw new Error(`Missing firm name/description: ${id}`);
    const name = firm.name.trim();
    const description = firm.description.trim().replace(/\s+/g,' ').slice(0,300);
    const title = `${name} | El Paso's Best Lawyers`;
    const canonical = `${base}/firm/${id}`;
    const categories = Array.isArray(firm.categories) ? firm.categories.filter(v=>typeof v==='string') : [];
    const specialties = Array.isArray(firm.specialties) ? firm.specialties.filter(v=>typeof v==='string') : [];
    const address = [firm.address,firm.city,firm.state,firm.zip_code].filter(v=>typeof v==='string' && v.trim()).join(', ');
    let html = template;
    html = meta(html, /<title>[\s\S]*?<\/title>/gi, `<title>${escapeHtml(title)}</title>`, 'title');
    html = meta(html, /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/gi, `<meta name="description" content="${escapeHtml(description)}" />`, 'description');
    html = meta(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/gi, `<link rel="canonical" href="${escapeHtml(canonical)}" />`, 'canonical');
    for (const [property,value] of [['og:url',canonical],['og:title',title],['og:description',description]]) {
      html = meta(html, new RegExp(`<meta\\s+property="${property}"\\s+content="[\\s\\S]*?"\\s*\\/>`,'gi'), `<meta property="${property}" content="${escapeHtml(value)}" />`,property);
    }
    for (const [property,value] of [['twitter:title',title],['twitter:description',description]]) {
      html = meta(html, new RegExp(`<meta\\s+name="${property}"\\s+content="[\\s\\S]*?"\\s*\\/>`,'gi'), `<meta name="${property}" content="${escapeHtml(value)}" />`,property);
    }
    const content = `<main data-firm-seo="${escapeHtml(id)}"><h1>${escapeHtml(name)}</h1><p>${escapeHtml(firm.description)}</p>${address?`<p>${escapeHtml(address)}</p>`:''}${categories.length?`<h2>Practice areas</h2><p>${escapeHtml(categories.join(', '))}</p>`:''}${specialties.length?`<h2>Legal services</h2><p>${escapeHtml(specialties.join(', '))}</p>`:''}</main>`;
    html = meta(html, /<div id="root">[\s\S]*?<\/div>(?=\s*<script|\s*<\/body>)/g, `<div id="root">${content}</div>`, 'root');
    const outdir = join(dist,'firm',id);
    mkdirSync(outdir,{recursive:true});
    writeFileSync(join(outdir,'index.html'),html);
    console.log(`Firm SEO: ${id}`);
  }
} finally { rmSync(bundle,{force:true}); }