import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Article } from '../data/types';
import { BookOpen } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

export default function ArticleCard({ article, onClick }: ArticleCardProps) {
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer hover:border-[#1FA8A1]"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#0F2A43] to-[#1FA8A1] rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-[#0F2A43]">{article.title}</h3>
            <Badge variant="secondary" className="text-xs">{article.topic}</Badge>
          </div>
          <p className="text-sm text-gray-600 mb-3">{article.summary}</p>
          <p className="text-xs text-gray-500">
            Updated {new Date(article.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Card>
  );
}


