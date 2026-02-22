import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

export interface ExampleItem {
  input: string;
  output: string;
  explanation?: string;
}

interface ExampleEditorProps {
  examples: ExampleItem[];
  onChange: (examples: ExampleItem[]) => void;
}

export function ExampleEditor({ examples, onChange }: ExampleEditorProps) {
  const addExample = () => {
    onChange([...examples, { input: '', output: '', explanation: '' }]);
  };

  const removeExample = (index: number) => {
    onChange(examples.filter((_, i) => i !== index));
  };

  const updateExample = (
    index: number,
    field: keyof ExampleItem,
    value: string,
  ) => {
    const updated = examples.map((ex, i) =>
      i === index ? { ...ex, [field]: value } : ex,
    );
    onChange(updated);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Label className='text-sm font-semibold text-foreground'>
          Examples
        </Label>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={addExample}
          className='text-primary hover:text-primary/80 gap-1.5 h-7 text-xs'
        >
          <Plus className='h-3.5 w-3.5' />
          Add Example
        </Button>
      </div>

      {examples.length === 0 && (
        <p className='text-sm text-muted-foreground text-center py-4 rounded-lg border border-dashed border-border/50'>
          No examples added yet. Click "Add Example" to begin.
        </p>
      )}

      {examples.map((example, i) => (
        <div
          key={i}
          className='rounded-lg border border-border/40 bg-surface-1/30 overflow-hidden'
        >
          <div className='flex items-center justify-between px-4 py-2 bg-surface-2/50 border-b border-border/30'>
            <span className='text-xs font-semibold text-muted-foreground'>
              Example {i + 1}
            </span>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='h-6 w-6 text-muted-foreground hover:text-destructive'
              onClick={() => removeExample(i)}
            >
              <Trash2 className='h-3 w-3' />
            </Button>
          </div>
          <div className='p-4 space-y-3'>
            <div>
              <Label className='text-xs text-muted-foreground mb-1 block'>
                Input
              </Label>
              <Input
                value={example.input}
                onChange={(e) => updateExample(i, 'input', e.target.value)}
                placeholder='nums = [2,7,11,15], target = 9'
                className='bg-surface-2 border-border/50 font-mono text-sm h-9'
              />
            </div>
            <div>
              <Label className='text-xs text-muted-foreground mb-1 block'>
                Output
              </Label>
              <Input
                value={example.output}
                onChange={(e) => updateExample(i, 'output', e.target.value)}
                placeholder='[0,1]'
                className='bg-surface-2 border-border/50 font-mono text-sm h-9'
              />
            </div>
            <div>
              <Label className='text-xs text-muted-foreground mb-1 block'>
                Explanation{' '}
                <span className='text-muted-foreground/60'>(optional)</span>
              </Label>
              <Input
                value={example.explanation || ''}
                onChange={(e) =>
                  updateExample(i, 'explanation', e.target.value)
                }
                placeholder='Because nums[0] + nums[1] == 9...'
                className='bg-surface-2 border-border/50 text-sm h-9'
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
