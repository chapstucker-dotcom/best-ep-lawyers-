import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import Footer from '@/components/Footer';
import { articles, getArticleBySlug } from '@/data/articles';
import { useSeo } from '../hooks/use-seo';

export default function GuideArticle() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  const accidentTopics = [
    "Car Accidents",
    "Personal Injury",
    "Truck Accidents",
    "Wrongful Death",
    "Uber & Lyft Accidents",
  ];

  const relatedArticles = article
    ? articles
        .filter((candidate) =>
          candidate.slug !== article.slug &&
          (
            candidate.topic === article.topic ||
            (
              accidentTopics.includes(article.topic) &&
              accidentTopics.includes(candidate.topic)
            )
          )
        )
        .sort((a, b) =>
          Number(b.topic === article.topic) -
          Number(a.topic === article.topic)
        )
        .slice(0, 3)
    : [];

  useSeo({
    title: article
      ? `${article.title} | El Paso's Best Lawyers`
      : "Guide Not Found | El Paso's Best Lawyers",
    description: article
      ? article.metaDescription
      : "The requested legal guide could not be found on El Paso's Best Lawyers.",
    path: article
      ? `/guides/${article.slug}/`
      : slug
        ? `/guides/${slug}`
        : '/guides',
    robots: article ? 'index, follow' : 'noindex, nofollow',
    canonical: Boolean(article),
  });

  useEffect(() => {
    if (!article) return;

    const canonicalUrl =
      `https://www.elpasosbestlawyers.com/guides/${article.slug}/`;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'guide-article-schema';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.metaDescription,
      dateModified: article.updatedAt,
      datePublished: article.updatedAt,
      author: {
        '@type': 'Organization',
        name: "El Paso's Best Lawyers",
      },
      publisher: {
        '@type': 'Organization',
        name: "El Paso's Best Lawyers",
        url: 'https://www.elpasosbestlawyers.com/',
      },
      mainEntityOfPage: canonicalUrl,
    });

    document.getElementById('guide-article-schema')?.remove();
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 p-10 text-center">
        <h1 className="text-3xl font-bold text-[#0F2A43]">
          Guide not found
        </h1>

        <Link
          to="/guides/"
          className="mt-6 inline-block font-semibold text-[#1FA8A1]"
        >
          Browse all guides
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-bold text-[#0F2A43]">
            El Paso&apos;s Best Lawyers
          </Link>

          <Link
            to="/guides/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F2A43] hover:text-[#1FA8A1]"
          >
            <ArrowLeft className="h-4 w-4" />
            All Guides
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <nav className="mb-8 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#1FA8A1]">
            Home
          </Link>

          <span className="mx-2">/</span>

          <Link to="/guides/" className="hover:text-[#1FA8A1]">
            Guides
          </Link>

          <span className="mx-2">/</span>

          {article.topic}
        </nav>

        <article className="rounded-2xl bg-white p-7 shadow-sm md:p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#1FA8A1]">
            {article.topic} · {article.readTime}
          </p>

          <h1 className="text-4xl font-bold leading-tight text-[#0F2A43] md:text-5xl">
            {article.title}
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            {article.summary}
          </p>

          <p className="mt-3 text-sm text-gray-500">
            Updated{' '}
            {new Date(
              `${article.updatedAt}T12:00:00`
            ).toLocaleDateString('en-US')}
          </p>

          <div className="my-8 rounded-xl border-l-4 border-[#F5B800] bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            <strong>Important:</strong> This guide provides general
            educational information, not legal advice. Deadlines and legal
            outcomes depend on the facts.
          </div>

          <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-xl font-bold text-[#0F2A43]">
              Find legal help in El Paso
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Explore local attorney profiles, compare relevant experience,
              and learn how to prepare for a consultation.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to={`${article.relatedPracticeArea.path.replace(/\/+$/, "")}/`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#F5B800] px-5 py-3 font-bold text-[#0F2A43] hover:brightness-95"
              >
                {article.relatedPracticeArea.label}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="/guides/#consultation-preparation"
                className="inline-flex items-center rounded-lg border border-[#0F2A43] px-5 py-3 font-semibold text-[#0F2A43] hover:bg-white"
              >
                Prepare for a consultation
              </a>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-600">
              El Paso&apos;s Best Lawyers is a legal directory, not a law firm.
              Confirm fees, availability and representation directly with
              the attorney.
            </p>
          </div>

          <div className="space-y-9">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-4 text-2xl font-bold text-[#0F2A43]">
                  {section.heading}
                </h2>

                <div className="space-y-4 text-base leading-8 text-gray-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {section.bullets && (
                  <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-gray-700">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="my-10 rounded-xl bg-[#0F2A43] p-7 text-white">
            <h2 className="text-2xl font-bold">
              Need to compare lawyers for this issue?
            </h2>

            <p className="mt-2 text-gray-200">
              Browse El Paso attorneys and law firms in the related practice
              area.
            </p>

            <Link
              to={`${article.relatedPracticeArea.path.replace(/\/+$/, "")}/`}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#F5B800] px-5 py-3 font-bold text-[#0F2A43] hover:brightness-95"
            >
              {article.relatedPracticeArea.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {article.faqs.length > 0 && (
            <section>
              <h2 className="mb-5 text-2xl font-bold text-[#0F2A43]">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {article.faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-xl border border-gray-200 p-5"
                  >
                    <h3 className="font-bold text-[#0F2A43]">
                      {faq.question}
                    </h3>

                    <p className="mt-2 leading-7 text-gray-700">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {relatedArticles.length > 0 && (
            <section
              aria-labelledby="related-guides-heading"
              className="mt-10 border-t pt-7"
            >
              <h2
                id="related-guides-heading"
                className="mb-4 text-2xl font-bold text-[#0F2A43]"
              >
                Related Texas legal guides
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/guides/${related.slug}/`}
                    className="rounded-xl border border-slate-200 p-5 hover:border-teal-600"
                  >
                    <p className="text-xs font-semibold text-teal-700">
                      {related.topic}
                    </p>
                    <h3 className="mt-2 font-bold text-[#0F2A43]">
                      {related.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {related.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-10 border-t pt-7">
            <h2 className="mb-4 text-xl font-bold text-[#0F2A43]">
              Primary sources
            </h2>

            <ul className="space-y-3 text-sm">
              {article.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-[#116d69] hover:underline"
                  >
                    {source.name}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}