import { useState, type KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X, GripVertical } from 'lucide-react';

interface ConstraintEditorProps {
  constraints: string[];
  onChange: (constraints: string[]) => void;
}

export function ConstraintEditor({
  constraints,
  onChange,
}: ConstraintEditorProps) {
  const [input, setInput] = useState('');

  const addConstraint = () => {
    const trimmed = input.trim();
    if (trimmed) {
      onChange([...constraints, trimmed]);
      setInput('');
    }
  };

  const removeConstraint = (index: number) => {
    onChange(constraints.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addConstraint();
    }
  };

  return (
    <div className='space-y-3'>
      <Label className='text-sm font-semibold text-foreground'>
        Constraints
      </Label>

      {/* Constraint list */}
      <div className='space-y-1.5'>
        {constraints.map((c, i) => (
          <div
            key={i}
            className='flex items-center gap-2 group px-3 py-2 rounded-lg bg-surface-1/50 border border-border/30'
          >
            <GripVertical className='h-3.5 w-3.5 text-muted-foreground/30' />
            <code className='flex-1 text-xs font-mono text-foreground/80'>
              {c}
            </code>
            <button
              type='button'
              onClick={() => removeConstraint(i)}
              className='opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all'
            >
              <X className='h-3.5 w-3.5' />
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className='flex gap-2'>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='e.g., 2 <= nums.length <= 10⁴'
          className='bg-surface-1 border-border/50 h-9 text-sm font-mono flex-1'
        />
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={addConstraint}
          disabled={!input.trim()}
          className='border-border/50 h-9 gap-1.5'
        >
          <Plus className='h-3.5 w-3.5' />
          Add
        </Button>
      </div>
    </div>
  );
}
