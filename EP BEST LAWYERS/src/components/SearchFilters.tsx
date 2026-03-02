import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { categories } from '../data/categories';

interface SearchFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  featuredOnly: boolean;
  onFeaturedChange: (featured: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function SearchFilters({
  selectedCategory,
  onCategoryChange,
  featuredOnly,
  onFeaturedChange,
  sortBy,
  onSortChange
}: SearchFiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div>
        <Label className="mb-2 block">Filter by Category</Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.slug}>{cat.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="mb-2 block">Sort By</Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox 
          id="featured" 
          checked={featuredOnly}
          onCheckedChange={(checked) => onFeaturedChange(checked as boolean)}
        />
        <Label htmlFor="featured" className="text-sm cursor-pointer">
          Featured firms only
        </Label>
      </div>
    </div>
  );
}
