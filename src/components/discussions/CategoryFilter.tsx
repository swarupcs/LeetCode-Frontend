import { cn } from '@/lib/utils';
import { getCategoryStyle, getCategoryIcon } from '@/data/discussions';

const categories = [
  { value: 'all', label: 'All', icon: '📋' },
  { value: 'solution', label: 'Solutions', icon: getCategoryIcon('solution') },
  { value: 'question', label: 'Questions', icon: getCategoryIcon('question') },
  {
    value: 'discussion',
    label: 'Discussions',
    icon: getCategoryIcon('discussion'),
  },
  { value: 'tip', label: 'Tips', icon: getCategoryIcon('tip') },
];

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className='flex flex-wrap gap-2'>
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={cn(
            'text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium',
            selected === cat.value
              ? cat.value === 'all'
                ? 'bg-foreground text-background border-foreground'
                : getCategoryStyle(cat.value) + ' border-current/30'
              : 'bg-surface-2 text-muted-foreground border-border/30 hover:bg-surface-3 hover:text-foreground',
          )}
        >
          <span className='mr-1'>{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}
