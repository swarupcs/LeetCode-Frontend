import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Eye, EyeOff, Copy } from 'lucide-react';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  explanation?: string;
}

interface TestCaseEditorProps {
  testCases: TestCase[];
  onChange: (testCases: TestCase[]) => void;
}

export function TestCaseEditor({ testCases, onChange }: TestCaseEditorProps) {
  const addTestCase = () => {
    onChange([
      ...testCases,
      {
        id: crypto.randomUUID(),
        input: '',
        expectedOutput: '',
        isHidden: false,
        explanation: '',
      },
    ]);
  };

  const removeTestCase = (id: string) => {
    onChange(testCases.filter((tc) => tc.id !== id));
  };

  const updateTestCase = (
    id: string,
    field: keyof TestCase,
    value: string | boolean,
  ) => {
    onChange(
      testCases.map((tc) => (tc.id === id ? { ...tc, [field]: value } : tc)),
    );
  };

  const duplicateTestCase = (tc: TestCase) => {
    onChange([...testCases, { ...tc, id: crypto.randomUUID() }]);
  };

  const visibleCount = testCases.filter((tc) => !tc.isHidden).length;
  const hiddenCount = testCases.filter((tc) => tc.isHidden).length;

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <Label className='text-sm font-semibold text-foreground'>
            Test Cases
          </Label>
          <p className='text-[11px] text-muted-foreground/60 mt-0.5'>
            Define input/output pairs to validate submissions. Hidden cases
            won't be visible to users.
          </p>
        </div>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={addTestCase}
          className='text-primary hover:text-primary/80 gap-1.5 h-7 text-xs'
        >
          <Plus className='h-3.5 w-3.5' />
          Add Test Case
        </Button>
      </div>

      {testCases.length > 0 && (
        <div className='flex gap-2'>
          <Badge
            variant='outline'
            className='text-[10px] border-border/50 text-muted-foreground gap-1'
          >
            <Eye className='h-3 w-3' />
            {visibleCount} visible
          </Badge>
          <Badge
            variant='outline'
            className='text-[10px] border-border/50 text-muted-foreground gap-1'
          >
            <EyeOff className='h-3 w-3' />
            {hiddenCount} hidden
          </Badge>
        </div>
      )}

      {testCases.length === 0 && (
        <div className='text-center py-8 rounded-lg border border-dashed border-border/50'>
          <p className='text-sm text-muted-foreground mb-2'>
            No test cases defined yet.
          </p>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addTestCase}
            className='border-border/50 gap-1.5'
          >
            <Plus className='h-3.5 w-3.5' />
            Add First Test Case
          </Button>
        </div>
      )}

      {testCases.map((tc, i) => (
        <div
          key={tc.id}
          className={`rounded-lg border overflow-hidden ${
            tc.isHidden
              ? 'border-[hsl(var(--amber)/0.3)] bg-[hsl(var(--amber)/0.03)]'
              : 'border-border/40 bg-surface-1/30'
          }`}
        >
          {/* Header */}
          <div className='flex items-center justify-between px-4 py-2 bg-surface-2/50 border-b border-border/30'>
            <div className='flex items-center gap-2'>
              <span className='text-xs font-semibold text-muted-foreground'>
                Test Case {i + 1}
              </span>
              {tc.isHidden && (
                <Badge
                  variant='outline'
                  className='text-[9px] border-[hsl(var(--amber)/0.3)] text-[hsl(var(--amber))] px-1.5 py-0'
                >
                  Hidden
                </Badge>
              )}
            </div>
            <div className='flex items-center gap-1.5'>
              <div className='flex items-center gap-1.5 mr-2'>
                <Label className='text-[10px] text-muted-foreground'>
                  Hidden
                </Label>
                <Switch
                  checked={tc.isHidden}
                  onCheckedChange={(v) => updateTestCase(tc.id, 'isHidden', v)}
                  className='scale-75'
                />
              </div>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-6 w-6 text-muted-foreground hover:text-foreground'
                onClick={() => duplicateTestCase(tc)}
                title='Duplicate'
              >
                <Copy className='h-3 w-3' />
              </Button>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-6 w-6 text-muted-foreground hover:text-destructive'
                onClick={() => removeTestCase(tc.id)}
              >
                <Trash2 className='h-3 w-3' />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className='p-4 space-y-3'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div>
                <Label className='text-xs text-muted-foreground mb-1 block'>
                  Input
                </Label>
                <Textarea
                  value={tc.input}
                  onChange={(e) =>
                    updateTestCase(tc.id, 'input', e.target.value)
                  }
                  placeholder={'nums = [2,7,11,15]\ntarget = 9'}
                  className='bg-surface-2 border-border/50 font-mono text-sm min-h-[80px] resize-y'
                  spellCheck={false}
                />
              </div>
              <div>
                <Label className='text-xs text-muted-foreground mb-1 block'>
                  Expected Output
                </Label>
                <Textarea
                  value={tc.expectedOutput}
                  onChange={(e) =>
                    updateTestCase(tc.id, 'expectedOutput', e.target.value)
                  }
                  placeholder='[0, 1]'
                  className='bg-surface-2 border-border/50 font-mono text-sm min-h-[80px] resize-y'
                  spellCheck={false}
                />
              </div>
            </div>
            <div>
              <Label className='text-xs text-muted-foreground mb-1 block'>
                Explanation{' '}
                <span className='text-muted-foreground/60'>
                  (optional, only shown for visible cases)
                </span>
              </Label>
              <Input
                value={tc.explanation || ''}
                onChange={(e) =>
                  updateTestCase(tc.id, 'explanation', e.target.value)
                }
                placeholder='Why this output is correct...'
                className='bg-surface-2 border-border/50 text-sm h-9'
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
