'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilters({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFiltersProps) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
      {categories.map((category) => (
        <Badge
          key={category}
          onClick={() => onSelectCategory(category)}
          className={cn(
            'cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all hover:opacity-100',
            selectedCategory === category
              ? 'bg-blue-700 text-white shadow-md'
              : 'bg-gray-300 text-secondary-foreground opacity-80'
          )}
          variant={selectedCategory === category ? 'default' : 'secondary'}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
}
