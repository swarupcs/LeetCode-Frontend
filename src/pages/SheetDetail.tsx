import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Circle,
  ChevronRight,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { useGetSheetById } from '@/hooks/sheets/useGetSheetById';
import type { SheetProblem, SheetProblemInSheet } from '@/types/sheet.types';

const difficultyClass: Record<string, string> = {
  EASY: 'difficulty-easy',
  MEDIUM: 'difficulty-medium',
  HARD: 'difficulty-hard',
};

const difficultyOrder = ['EASY', 'MEDIUM', 'HARD'];

export default function SheetDetail() {
  const { id } = useParams<{ id: string }>();
  const { sheet, isLoading, isError, error } = useGetSheetById(id);

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(difficultyOrder),
  );

  useEffect(() => {
    if (sheet) {
      setExpandedGroups(new Set(difficultyOrder));
    }
  }, [sheet]);

  const stats = useMemo(() => {
    if (!sheet) return { total: 0, solved: 0, easy: 0, medium: 0, hard: 0 };
    const problems = sheet.problems.map((p) => p.problem);
    return {
      total: problems.length,
      solved: problems.filter((p) => p.isSolved).length,
      easy: problems.filter((p) => p.difficulty === 'EASY').length,
      medium: problems.filter((p) => p.difficulty === 'MEDIUM').length,
      hard: problems.filter((p) => p.difficulty === 'HARD').length,
    };
  }, [sheet]);

  const progress =
    stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;

  // Group by difficulty, unwrapping p.problem
  const groupedByDifficulty = useMemo(() => {
    if (!sheet) return [];
    return difficultyOrder
      .map((diff) => ({
        difficulty: diff,
        items: sheet.problems.filter((p) => p.problem.difficulty === diff),
      }))
      .filter((g) => g.items.length > 0);
  }, [sheet]);

  const filterItem = (item: SheetProblemInSheet) => {
    const p = item.problem;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty =
      difficultyFilter === 'All' || p.difficulty === difficultyFilter;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Solved' && p.isSolved) ||
      (statusFilter === 'Unsolved' && !p.isSolved);
    return matchesSearch && matchesDifficulty && matchesStatus;
  };

  const filteredGroups = groupedByDifficulty
    .map((g) => ({ ...g, items: g.items.filter(filterItem) }))
    .filter((g) => g.items.length > 0);

  const toggleGroup = (diff: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(diff) ? next.delete(diff) : next.add(diff);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (isError || !sheet) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold mb-2'>
            {isError
              ? (error?.message ?? 'Failed to load sheet.')
              : 'Sheet not found'}
          </h2>
          <Link to='/sheets' className='text-primary hover:underline text-sm'>
            ← Back to Sheets
          </Link>
        </div>
      </div>
    );
  }

  const difficulties = ['All', 'EASY', 'MEDIUM', 'HARD'];
  const statuses = ['All', 'Solved', 'Unsolved'];

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8'>
        <Link
          to='/sheets'
          className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Sheets
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <div className='flex items-start gap-4 mb-4'>
            <div className='p-3 rounded-xl bg-primary/10 border border-primary/20'>
              <BookOpen className='h-6 w-6 text-primary' />
            </div>
            <div className='flex-1 min-w-0'>
              <h1 className='text-2xl sm:text-3xl font-bold mb-1'>
                {sheet.name}
              </h1>
              <p className='text-muted-foreground text-sm'>
                {sheet.description || 'No description provided.'}
              </p>
              <p className='text-xs text-muted-foreground/60 mt-1'>
                by {sheet.user.name} · @{sheet.user.username}
              </p>
            </div>
          </div>

          {/* Tags */}
          {sheet.allTags.length > 0 && (
            <div className='flex flex-wrap gap-1.5 mb-6'>
              {sheet.allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant='outline'
                  className='text-xs border-border/50 text-muted-foreground'
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Stats bar */}
          <div className='glass-card p-5'>
            <div className='grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4'>
              <div className='text-center'>
                <div className='text-xl font-bold'>{stats.total}</div>
                <div className='text-[11px] text-muted-foreground'>Total</div>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold text-primary'>
                  {stats.solved}
                </div>
                <div className='text-[11px] text-muted-foreground'>Solved</div>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold text-[hsl(var(--emerald))]'>
                  {stats.easy}
                </div>
                <div className='text-[11px] text-muted-foreground'>Easy</div>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold text-[hsl(var(--amber))]'>
                  {stats.medium}
                </div>
                <div className='text-[11px] text-muted-foreground'>Medium</div>
              </div>
              <div className='text-center col-span-2 sm:col-span-1'>
                <div className='text-xl font-bold text-[hsl(var(--rose))]'>
                  {stats.hard}
                </div>
                <div className='text-[11px] text-muted-foreground'>Hard</div>
              </div>
            </div>
            <div className='space-y-1.5'>
              <div className='flex justify-between text-xs'>
                <span className='text-muted-foreground'>
                  {stats.solved}/{stats.total} completed
                </span>
                <span className='text-primary font-medium'>{progress}%</span>
              </div>
              <div className='h-2 bg-surface-3 rounded-full overflow-hidden'>
                <motion.div
                  className='h-full bg-primary rounded-full'
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='flex flex-col sm:flex-row gap-3 mb-6'
        >
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search problems...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 bg-surface-1 border-border/50 h-9 text-sm'
            />
          </div>
          <div className='flex gap-2 flex-wrap'>
            <div className='flex items-center gap-1 bg-surface-1 border border-border/50 rounded-lg px-1'>
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    difficultyFilter === d
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {d === 'All' ? 'All' : d.charAt(0) + d.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <div className='flex items-center gap-1 bg-surface-1 border border-border/50 rounded-lg px-1'>
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                    statusFilter === s
                      ? 'bg-primary/20 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Problem groups */}
        <div className='space-y-3'>
          {filteredGroups.map((group, i) => {
            const isExpanded = expandedGroups.has(group.difficulty);
            const groupSolved = group.items.filter(
              (item) => item.problem.isSolved,
            ).length;
            return (
              <motion.div
                key={group.difficulty}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.03 }}
                className='glass-card overflow-hidden'
              >
                <button
                  onClick={() => toggleGroup(group.difficulty)}
                  className='w-full flex items-center justify-between p-4 hover:bg-surface-2/50 transition-colors'
                >
                  <div className='flex items-center gap-3'>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className='h-4 w-4 text-muted-foreground' />
                    </motion.div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded border ${difficultyClass[group.difficulty]}`}
                    >
                      {group.difficulty.charAt(0) +
                        group.difficulty.slice(1).toLowerCase()}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {groupSolved}/{group.items.length} solved
                    </span>
                  </div>
                  <div className='w-20 h-1.5 bg-surface-3 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-primary rounded-full transition-all'
                      style={{
                        width: `${
                          group.items.length > 0
                            ? (groupSolved / group.items.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className='overflow-hidden'
                    >
                      <div className='border-t border-border/30'>
                        {group.items.map((item) => (
                          <ProblemRow key={item.id} problem={item.problem} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {filteredGroups.length === 0 && (
          <div className='text-center py-16 text-muted-foreground text-sm'>
            No problems match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

function ProblemRow({ problem }: { problem: SheetProblem }) {
  return (
    <Link
      to={`/problem/${problem.id}`}
      className='flex items-center gap-3 px-4 py-3 hover:bg-surface-2/40 transition-colors group border-b border-border/20 last:border-b-0'
    >
      <div className='flex-shrink-0'>
        {problem.isSolved ? (
          <CheckCircle2 className='h-4 w-4 text-primary' />
        ) : (
          <Circle className='h-4 w-4 text-muted-foreground/40' />
        )}
      </div>

      <span className='text-xs text-muted-foreground font-mono w-8 flex-shrink-0'>
        #{problem.problemNumber}
      </span>

      <span className='flex-1 text-sm group-hover:text-primary transition-colors truncate'>
        {problem.title}
      </span>

      <div className='hidden sm:flex items-center gap-1'>
        {problem.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className='text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground'
          >
            {tag}
          </span>
        ))}
      </div>

      <Badge
        variant='outline'
        className={`text-[10px] px-1.5 py-0 border ${difficultyClass[problem.difficulty]}`}
      >
        {problem.difficulty.charAt(0) +
          problem.difficulty.slice(1).toLowerCase()}
      </Badge>

      <ChevronRight className='h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0' />
    </Link>
  );
}
