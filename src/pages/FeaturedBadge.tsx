import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Copy, Check } from 'lucide-react';
import Footer from '@/components/Footer';

const badgeCode = `<a href="https://www.elpasosbestlawyers.com/" target="_blank" rel="noopener">Featured on El Paso's Best Lawyers</a>`;

export default function FeaturedBadge() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    document.title = "Featured on El Paso's Best Lawyers | Law Firm Badge";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = "Law firms listed on El Paso's Best Lawyers can add a Featured badge and link to the El Paso legal directory.";
  }, []);

  const copyCode = async () => {
    await navigator.clipboard.writeText(badgeCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5"><Link to="/" className="font-bold text-[#0F2A43]">El Paso&apos;s Best Lawyers</Link><Link to="/" className="text-sm font-semibold text-[#0F2A43]">Home</Link></div></header>
      <main className="mx-auto max-w-4xl px-6 py-14">
        <div className="rounded-2xl bg-white p-8 shadow-sm md:p-12">
          <Award className="mb-5 h-12 w-12 text-[#D4A62A]" />
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#1FA8A1]">For Listed Law Firms</p>
          <h1 className="mt-2 text-4xl font-bold text-[#0F2A43]">Featured on El Paso&apos;s Best Lawyers</h1>
          <p className="mt-5 text-lg leading-8 text-gray-600">If your firm is listed in the directory, you can link back from your firm website. The link helps visitors verify your directory presence and creates a relevant local connection between your website and El Paso&apos;s Best Lawyers.</p>

          <div className="my-9 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <div className="inline-flex items-center gap-3 rounded-lg bg-[#0F2A43] px-5 py-4 font-bold text-white"><Award className="h-5 w-5 text-[#F5B800]" /> Featured on El Paso&apos;s Best Lawyers</div>
          </div>

          <h2 className="text-2xl font-bold text-[#0F2A43]">Simple HTML link</h2>
          <p className="mt-2 leading-7 text-gray-600">Paste this into your website or give it to your webmaster. If you have a direct public profile URL, use that instead of the homepage URL.</p>
          <pre className="mt-5 overflow-x-auto rounded-xl bg-slate-950 p-5 text-sm text-slate-100"><code>{badgeCode}</code></pre>
          <button onClick={copyCode} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#F5B800] px-5 py-3 font-bold text-[#0F2A43]">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy HTML'}</button>

          <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900"><strong>Use links naturally.</strong> Do not buy, trade, or automate large numbers of low-quality links. A genuine link from a participating El Paso law firm to its directory listing or the directory homepage is the kind of relationship this badge is designed to support.</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
