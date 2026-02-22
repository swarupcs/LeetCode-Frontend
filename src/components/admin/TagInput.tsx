import { useState, type KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const suggestedTags = [
  'Array',
  'String',
  'Hash Table',
  'Math',
  'DP',
  'Sorting',
  'Greedy',
  'Binary Search',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Queue',
  'Linked List',
  'Tree',
  'Graph',
  'DFS',
  'BFS',
  'Heap',
  'Recursion',
  'Backtracking',
  'Bit Manipulation',
  'Trie',
  'Union Find',
  'Design',
];

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const availableSuggestions = suggestedTags.filter(
    (s) => !tags.includes(s) && s.toLowerCase().includes(input.toLowerCase()),
  );

  return (
    <div className='space-y-2'>
      <Label className='text-sm font-semibold text-foreground'>Tags</Label>

      {/* Selected tags */}
      <div className='flex flex-wrap gap-1.5 min-h-[32px]'>
        {tags.map((tag) => (
          <span
            key={tag}
            className='inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20'
          >
            {tag}
            <button
              type='button'
              onClick={() => removeTag(tag)}
              className='hover:text-destructive transition-colors'
            >
              <X className='h-3 w-3' />
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Type a tag and press Enter...'
        className='bg-surface-1 border-border/50 h-9 text-sm'
      />

      {/* Suggestions */}
      {input && availableSuggestions.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {availableSuggestions.slice(0, 8).map((s) => (
            <button
              key={s}
              type='button'
              onClick={() => addTag(s)}
              className='text-[10px] px-2 py-0.5 rounded bg-surface-3 text-muted-foreground hover:text-foreground hover:bg-surface-4 transition-colors border border-border/30'
            >
              + {s}
            </button>
          ))}
        </div>
      )}

      {!input && tags.length === 0 && (
        <div className='flex flex-wrap gap-1'>
          <span className='text-[10px] text-muted-foreground/60 mr-1'>
            Suggestions:
          </span>
          {suggestedTags.slice(0, 10).map((s) => (
            <button
              key={s}
              type='button'
              onClick={() => addTag(s)}
              className='text-[10px] px-2 py-0.5 rounded bg-surface-3 text-muted-foreground hover:text-foreground hover:bg-surface-4 transition-colors border border-border/30'
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
