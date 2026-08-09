import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import Footer from '@/components/Footer';
import { articles } from '@/data/articles';

export default function Guides() {
  useEffect(() => {
    document.title = "Texas Law Guides for El Paso | El Paso's Best Lawyers";
    const description = 'Plain-English Texas legal guides for El Paso residents covering car accidents, personal injury, DWI, family law, wrongful death, insurance, and more.';
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-bold text-[#0F2A43]">El Paso&apos;s Best Lawyers</Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F2A43] hover:text-[#1FA8A1]"><ArrowLeft className="h-4 w-4" /> Home</Link>
        </div>
      </header>

      <main>
        <section className="bg-[#0F2A43] px-6 py-16 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <BookOpen className="mx-auto mb-5 h-12 w-12 text-[#F5B800]" />
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#F5B800]">El Paso Legal Resources</p>
            <h1 className="text-4xl font-bold md:text-5xl">Texas Law Guides for El Paso Residents</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-200">Practical, plain-English information connected to the lawyer categories people search for most in El Paso.</p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
          </div>
          <div className="mt-12 rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-900">
            <strong>Educational information only.</strong> These guides are not legal advice and do not create an attorney-client relationship. Laws, procedures, deadlines, and agency practices can change. Consult a licensed attorney about a specific matter.
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
