import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import type { Article } from '../data/articles';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      to={`/guides/${article.slug}`}
      className="block rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#1FA8A1] hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0F2A43] to-[#1FA8A1]">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1FA8A1]">{article.topic}</p>
          <h3 className="mb-2 text-lg font-bold leading-snug text-[#0F2A43]">{article.title}</h3>
          <p className="mb-4 text-sm leading-6 text-gray-600">{article.summary}</p>
          <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
            <span>{article.readTime}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#0F2A43]">Read guide <ArrowRight className="h-3.5 w-3.5" /></span>
          </div>
        </div>
      </div>
    </Link>
  );
}
