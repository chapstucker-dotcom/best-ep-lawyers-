import { Card } from './ui/card';
import { Category } from '../data/types';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-all cursor-pointer hover:border-[#1FA8A1] group"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-[#0F2A43] to-[#1FA8A1] p-1 group-hover:scale-110 transition-transform">
          <img 
            src={category.icon} 
            alt={category.title}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <h3 className="text-lg font-bold text-[#0F2A43] mb-2">{category.title}</h3>
        <p className="text-sm text-gray-600">{category.description}</p>
      </div>
    </Card>
  );
}
