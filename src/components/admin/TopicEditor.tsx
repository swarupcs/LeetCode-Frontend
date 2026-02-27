import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Plus,
  Trash2,
  Search,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from 'lucide-react';
import type { Problem } from '@/types/problem.types';
import type { SheetTopic } from '@/types/sheet.types';

interface TopicEditorProps {
  topics: SheetTopic[];
  onChange: (topics: SheetTopic[]) => void;
  problems: Problem[];
}

const difficultyClass: Record<string, string> = {
  EASY: 'difficulty-easy',
  MEDIUM: 'difficulty-medium',
  HARD: 'difficulty-hard',
};

export function TopicEditor({ topics, onChange, problems }: TopicEditorProps) {
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(
    new Set(topics.map((_, i) => i)),
  );

  const addTopic = () => {
    onChange([...topics, { name: '', problemIds: [] }]);
    setExpandedTopics((prev) => new Set([...prev, topics.length]));
  };

  const removeTopic = (index: number) => {
    onChange(topics.filter((_, i) => i !== index));
    setExpandedTopics((prev) => {
      const next = new Set<number>();
      prev.forEach((v) => {
        if (v < index) next.add(v);
        else if (v > index) next.add(v - 1);
      });
      return next;
    });
  };

  const updateTopicName = (index: number, name: string) => {
    const updated = [...topics];
    updated[index] = { ...updated[index], name };
    onChange(updated);
  };

  const toggleProblem = (topicIndex: number, problemId: string) => {
    const updated = [...topics];
    const ids = updated[topicIndex].problemIds;
    updated[topicIndex] = {
      ...updated[topicIndex],
      problemIds: ids.includes(problemId)
        ? ids.filter((id) => id !== problemId)
        : [...ids, problemId],
    };
    onChange(updated);
  };

  const toggleExpanded = (index: number) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <Label className='text-sm font-semibold text-foreground'>
            Topics
          </Label>
          <p className='text-[11px] text-muted-foreground/60 mt-0.5'>
            Organize problems into logical groups. Each topic contains a set of
            problems.
          </p>
        </div>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={addTopic}
          className='text-primary hover:text-primary/80 gap-1.5 h-7 text-xs'
        >
          <Plus className='h-3.5 w-3.5' />
          Add Topic
        </Button>
      </div>

      {/* Summary */}
      {topics.length > 0 && (
        <div className='flex gap-2'>
          <Badge
            variant='outline'
            className='text-[10px] border-border/50 text-muted-foreground'
          >
            {topics.filter((t) => t.name.trim()).length} topics
          </Badge>
          <Badge
            variant='outline'
            className='text-[10px] border-border/50 text-muted-foreground'
          >
            {new Set(topics.flatMap((t) => t.problemIds)).size} unique problems
          </Badge>
        </div>
      )}

      {topics.length === 0 && (
        <div className='text-center py-8 rounded-lg border border-dashed border-border/50'>
          <p className='text-sm text-muted-foreground mb-2'>
            No topics defined yet.
          </p>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addTopic}
            className='border-border/50 gap-1.5'
          >
            <Plus className='h-3.5 w-3.5' />
            Add First Topic
          </Button>
        </div>
      )}

      {topics.map((topic, i) => {
        const isExpanded = expandedTopics.has(i);
        return (
          <div
            key={i}
            className='rounded-lg border border-border/40 bg-surface-1/30 overflow-hidden'
          >
            {/* Topic header */}
            <div className='flex items-center gap-2 px-4 py-2.5 bg-surface-2/50 border-b border-border/30'>
              <button
                onClick={() => toggleExpanded(i)}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                {isExpanded ? (
                  <ChevronDown className='h-4 w-4' />
                ) : (
                  <ChevronRight className='h-4 w-4' />
                )}
              </button>
              <GripVertical className='h-3.5 w-3.5 text-muted-foreground/40' />
              <Input
                value={topic.name}
                onChange={(e) => updateTopicName(i, e.target.value)}
                placeholder={`Topic ${i + 1} name (e.g., Arrays & Hashing)`}
                className='bg-transparent border-none shadow-none h-8 text-sm font-medium px-1 focus-visible:ring-0'
              />
              <Badge
                variant='outline'
                className='text-[10px] border-border/50 text-muted-foreground whitespace-nowrap'
              >
                {topic.problemIds.length} problems
              </Badge>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0'
                onClick={() => removeTopic(i)}
              >
                <Trash2 className='h-3 w-3' />
              </Button>
            </div>

            {/* Problem selector */}
            {isExpanded && (
              <div className='p-4'>
                <ProblemSelector
                  selectedIds={topic.problemIds}
                  onToggle={(problemId) => toggleProblem(i, problemId)}
                  problems={problems}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProblemSelector({
  selectedIds,
  onToggle,
  problems,
}: {
  selectedIds: string[];
  onToggle: (id: string) => void;
  problems: Problem[];
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return problems;
    const q = search.toLowerCase();
    return problems.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.problemNumber.toString().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [search, problems]);

  const sorted = useMemo(() => {
    const selected = filtered.filter((p) => selectedIds.includes(p.id));
    const unselected = filtered.filter((p) => !selectedIds.includes(p.id));
    return [...selected, ...unselected];
  }, [filtered, selectedIds]);

  return (
    <div className='space-y-3'>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search problems by title, number, or tag...'
          className='pl-9 bg-surface-2 border-border/50 h-8 text-xs'
        />
      </div>

      <div className='max-h-[300px] overflow-y-auto space-y-0.5 rounded-lg border border-border/30 bg-surface-2/30'>
        {sorted.length === 0 && (
          <p className='text-xs text-muted-foreground text-center py-6'>
            No problems found.
          </p>
        )}
        {sorted.map((problem) => {
          const isSelected = selectedIds.includes(problem.id);
          return (
            <label
              key={problem.id}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors hover:bg-surface-2/80 ${
                isSelected ? 'bg-primary/5' : ''
              }`}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggle(problem.id)}
                className='h-3.5 w-3.5'
              />
              <span className='text-xs text-muted-foreground font-mono w-7 flex-shrink-0'>
                #{problem.problemNumber}
              </span>
              <span
                className={`text-sm flex-1 truncate ${
                  isSelected
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                {problem.title}
              </span>
              <div className='hidden sm:flex gap-1'>
                {problem.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className='text-[9px] px-1 py-0.5 rounded bg-surface-3 text-muted-foreground/70'
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Badge
                variant='outline'
                className={`text-[9px] px-1 py-0 border ${difficultyClass[problem.difficulty]}`}
              >
                {problem.difficulty}
              </Badge>
            </label>
          );
        })}
      </div>

      {selectedIds.length > 0 && (
        <p className='text-[11px] text-muted-foreground/60'>
          {selectedIds.length} problem{selectedIds.length > 1 ? 's' : ''}{' '}
          selected
        </p>
      )}
    </div>
  );
}
