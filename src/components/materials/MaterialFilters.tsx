import React from 'react';
import { Button } from '@/components/ui/button';

interface MaterialFiltersProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export const MaterialFilters: React.FC<MaterialFiltersProps> = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto py-1 w-full md:w-auto">
      {categories.map(cat => (
        <Button
          key={cat}
          variant={selected === cat ? 'default' : 'outline'}
          className={`whitespace-nowrap px-4 py-2 rounded-full transition-all duration-200 ${selected === cat ? 'font-bold' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}; 