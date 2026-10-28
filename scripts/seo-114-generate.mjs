import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
const root=process.cwd(),site="https://www.elpasosbestlawyers.com";
const routes=JSON.parse(readFileSync(join(root,"scripts/seo-114-routes.json"),"utf8"));
const manifest=JSON.parse(readFileSync(join(root,"scripts/seo-114-manifest.json"),"utf8"));
const template=readFileSync(join(root,"dist/index.html"),"utf8");
const escape=v=>v.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const one=(s,re,label)=>{const a=[...s.matchAll(new RegExp(re.source,re.flags.includes("g")?re.flags:re.flags+"g"))];if(a.length!==1)throw Error(`${label}: expected one match, got ${a.length}`);return a[0][1]};
const val=(s,key)=>{const m=s.match(new RegExp(`\\b${key}\\s*:\\s*["']([^"'\\r\\n]+)["']`));return m?.[1]};
function metadata(route){
 const src=readFileSync(join(root,"src",route.source_file),"utf8");
 let title,description;
 if(route.source_type==="shared-practice-area"){
   const blocks=[...src.matchAll(/^ {2,6}path:\s*["']([^"']+)["'],?\s*$/gm)].filter(m=>m[1]===route.path);
   if(blocks.length!==1)throw Error(`${route.path}: shared data path not unique`);
   const block=src.slice(blocks[0].index,src.indexOf("\n  },",blocks[0].index));
   title=val(block,"title");description=val(block,"metaDescription");
   if(title)title+=` | El Paso's Best Lawyers`;
 }else if(route.source_type==="guide-article"){
   const slug=route.path.split("/").pop();
   const blocks=[...src.matchAll(/\bslug:\s*["']([^"']+)["']/g)].filter(m=>m[1]===slug);
   if(blocks.length!==1)throw Error(`${route.path}: article slug not unique`);
   const block=src.slice(blocks[0].index,src.indexOf("\n  },",blocks[0].index));
   title=val(block,"title");description=val(block,"metaDescription");
   if(title)title+=` | El Paso's Best Lawyers`;
 }else if(route.source_type==="component"){
  title=val(src,"title") ?? src.match(/\bconst\s+pageTitle\s*=\s*["']([^"']+)["']/)?.[1];
  description=val(src,"description") ?? val(src,"metaDescription") ?? src.match(/\bconst\s+description\s*=\s*["']([^"']+)["']/)?.[1];
 }
 if(!title||!description)throw Error(`${route.path}: cannot verify source title/description; do not publish fallback metadata`);
 return {title,description};
}
function replace(s,re,value,label){const matches=[...s.matchAll(new RegExp(re.source,re.flags.includes("g")?re.flags:re.flags+"g"))];if(matches.length!==1)throw Error(`${label}: expected one tag, got ${matches.length}`);return s.replace(re,()=>value)}
for(const path of routes){
 const file=join(root,"dist",path.slice(1),"index.html");
 if(existsSync(file))continue; // preserve all pre-existing 33 pages byte-for-byte
 const route=manifest.find(r=>r.path===path);
 if(!route)throw Error(`${path}: absent from manifest`);
 const {title,description}=metadata(route),canonical=`${site}${path}/`;
 let html=template;
 html=replace(html,/<title>[^<]*<\/title>/,`<title>${escape(title)}</title>`,`${path} title`);
 html=replace(html,/<meta\b(?=[^>]*\bname="description")[^>]*>/gs,`<meta name="description" content="${escape(description)}" />`,`${path} description`);
 html=replace(html,/<link\b(?=[^>]*\brel="canonical")[^>]*>/gs,`<link rel="canonical" href="${canonical}" />`,`${path} canonical`);
 for(const [key,value] of [["og:url",canonical],["og:title",title],["og:description",description]])html=replace(html,new RegExp(`<meta\\b(?=[^>]*\\bproperty="${key}")[^>]*>`,"gs"),`<meta property="${key}" content="${escape(value)}" />`,`${path} ${key}`);
 for(const [key,value] of [["twitter:title",title],["twitter:description",description]])html=replace(html,new RegExp(`<meta\\b(?=[^>]*\\bname="${key}")[^>]*>`,"gs"),`<meta name="${key}" content="${escape(value)}" />`,`${path} ${key}`);
 mkdirSync(join(root,"dist",path.slice(1)),{recursive:true});writeFileSync(file,html);console.log(`HTML: ${path}`);
}
