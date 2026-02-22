import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SolutionData {
  code: Record<string, string>;
  timeComplexity: string;
  spaceComplexity: string;
  approach: string;
  explanation: string;
}

interface SolutionEditorProps {
  solution: SolutionData;
  onChange: (solution: SolutionData) => void;
}

const languages = [
  { id: 'python', label: 'Python', icon: '🐍' },
  { id: 'javascript', label: 'JavaScript', icon: '⚡' },
  { id: 'java', label: 'Java', icon: '☕' },
];

const complexityOptions = [
  'O(1)',
  'O(log n)',
  'O(n)',
  'O(n log n)',
  'O(n²)',
  'O(n³)',
  'O(2ⁿ)',
  'O(n!)',
];

const approachOptions = [
  'Brute Force',
  'Two Pointers',
  'Sliding Window',
  'Hash Map',
  'Binary Search',
  'Dynamic Programming',
  'DFS',
  'BFS',
  'Greedy',
  'Divide and Conquer',
  'Backtracking',
  'Stack',
  'Queue',
  'Heap / Priority Queue',
  'Union Find',
  'Trie',
  'Other',
];

export function SolutionEditor({ solution, onChange }: SolutionEditorProps) {
  const [activeTab, setActiveTab] = useState('python');

  const updateCode = (lang: string, value: string) => {
    onChange({ ...solution, code: { ...solution.code, [lang]: value } });
  };

  const updateField = (
    field: keyof Omit<SolutionData, 'code'>,
    value: string,
  ) => {
    onChange({ ...solution, [field]: value });
  };

  const hasCode = Object.values(solution.code).some((c) => c.trim().length > 0);

  return (
    <div className='space-y-6'>
      {/* Approach & Complexity */}
      <div>
        <Label className='text-sm font-semibold text-foreground mb-3 block'>
          Solution Metadata
        </Label>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <Label className='text-xs text-muted-foreground mb-1 block'>
              Approach
            </Label>
            <Select
              value={solution.approach}
              onValueChange={(v) => updateField('approach', v)}
            >
              <SelectTrigger className='bg-surface-1 border-border/50 h-9 text-sm'>
                <SelectValue placeholder='Select approach...' />
              </SelectTrigger>
              <SelectContent>
                {approachOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className='text-xs text-muted-foreground mb-1 block'>
              Time Complexity
            </Label>
            <Select
              value={solution.timeComplexity}
              onValueChange={(v) => updateField('timeComplexity', v)}
            >
              <SelectTrigger className='bg-surface-1 border-border/50 h-9 text-sm font-mono'>
                <SelectValue placeholder='Select...' />
              </SelectTrigger>
              <SelectContent>
                {complexityOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    <span className='font-mono'>{opt}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className='text-xs text-muted-foreground mb-1 block'>
              Space Complexity
            </Label>
            <Select
              value={solution.spaceComplexity}
              onValueChange={(v) => updateField('spaceComplexity', v)}
            >
              <SelectTrigger className='bg-surface-1 border-border/50 h-9 text-sm font-mono'>
                <SelectValue placeholder='Select...' />
              </SelectTrigger>
              <SelectContent>
                {complexityOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    <span className='font-mono'>{opt}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary badges */}
        {(solution.approach ||
          solution.timeComplexity ||
          solution.spaceComplexity) && (
          <div className='flex flex-wrap gap-2 mt-3'>
            {solution.approach && (
              <Badge
                variant='outline'
                className='text-[10px] border-primary/20 text-primary'
              >
                {solution.approach}
              </Badge>
            )}
            {solution.timeComplexity && (
              <Badge
                variant='outline'
                className='text-[10px] border-border/50 text-muted-foreground font-mono'
              >
                Time: {solution.timeComplexity}
              </Badge>
            )}
            {solution.spaceComplexity && (
              <Badge
                variant='outline'
                className='text-[10px] border-border/50 text-muted-foreground font-mono'
              >
                Space: {solution.spaceComplexity}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Explanation */}
      <div>
        <Label className='text-sm font-semibold text-foreground mb-2 block'>
          Solution Explanation
        </Label>
        <p className='text-[11px] text-muted-foreground/60 mb-2'>
          Explain the approach step-by-step. Supports basic markdown.
        </p>
        <Textarea
          value={solution.explanation}
          onChange={(e) => updateField('explanation', e.target.value)}
          placeholder={`1. Create a hash map to store values and their indices.\n2. Iterate through the array...\n3. For each element, check if target - current exists in the map...`}
          className='bg-surface-1 border-border/50 min-h-[150px] text-sm resize-y'
          spellCheck={false}
        />
      </div>

      {/* Solution Code */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <Label className='text-sm font-semibold text-foreground'>
            Solution Code
          </Label>
          {hasCode && (
            <Badge
              variant='outline'
              className='text-[10px] border-primary/20 text-primary'
            >
              Code provided
            </Badge>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='bg-surface-2 border border-border/50 h-9'>
            {languages.map((lang) => (
              <TabsTrigger
                key={lang.id}
                value={lang.id}
                className='data-[state=active]:bg-surface-3 data-[state=active]:text-foreground text-muted-foreground text-xs gap-1.5 px-3 h-7'
              >
                <span>{lang.icon}</span>
                {lang.label}
                {solution.code[lang.id]?.trim() && (
                  <span className='h-1.5 w-1.5 rounded-full bg-primary ml-1' />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {languages.map((lang) => (
            <TabsContent key={lang.id} value={lang.id} className='mt-3'>
              <Textarea
                value={solution.code[lang.id] || ''}
                onChange={(e) => updateCode(lang.id, e.target.value)}
                placeholder={`Write the complete ${lang.label} solution here...`}
                className='bg-surface-1 border-border/50 font-mono text-sm min-h-[250px] resize-y'
                spellCheck={false}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
