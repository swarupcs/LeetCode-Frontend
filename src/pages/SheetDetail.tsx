import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

// ── constants ──────────────────────────────────────────────────────────────────

const DIFFICULTY_CLASS: Record<string, string> = {
  EASY: 'difficulty-easy',
  MEDIUM: 'difficulty-medium',
  HARD: 'difficulty-hard',
};

const DIFFICULTY_ORDER = ['EASY', 'MEDIUM', 'HARD'];

const DIFFICULTY_COLOR: Record<string, string> = {
  EASY: 'text-[hsl(var(--emerald))]',
  MEDIUM: 'text-[hsl(var(--amber))]',
  HARD: 'text-[hsl(var(--rose))]',
};

// ── helpers ────────────────────────────────────────────────────────────────────

const formatDifficulty = (d: string) => d.charAt(0) + d.slice(1).toLowerCase();

// ── sub-components ─────────────────────────────────────────────────────────────

function ProblemRow({ problem }: { problem: SheetProblem }) {
  return (
    <Link
      to={`/problem/${problem.id}`}
      className='flex items-center gap-3 px-4 py-3 hover:bg-surface-2/40 transition-colors group border-b border-border/20 last:border-b-0'
    >
      {/* Solve status */}
      <div className='flex-shrink-0'>
        {problem.isSolved ? (
          <CheckCircle2 className='h-4 w-4 text-primary' />
        ) : (
          <Circle className='h-4 w-4 text-muted-foreground/30' />
        )}
      </div>

      {/* Problem number */}
      <span className='text-xs text-muted-foreground font-mono w-8 flex-shrink-0'>
        #{problem.problemNumber}
      </span>

      {/* Title */}
      <span className='flex-1 text-sm group-hover:text-primary transition-colors truncate'>
        {problem.title}
      </span>

      {/* Tags (desktop) */}
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

      {/* Difficulty badge */}
      <Badge
        variant='outline'
        className={`text-[10px] px-1.5 py-0 border ${DIFFICULTY_CLASS[problem.difficulty]}`}
      >
        {formatDifficulty(problem.difficulty)}
      </Badge>

      <ChevronRight className='h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0' />
    </Link>
  );
}

// ── main page ──────────────────────────────────────────────────────────────────

export default function SheetDetail() {
  const { id } = useParams<{ id: string }>();
  const { sheet, isLoading, isError, error } = useGetSheetById(id);

  console.log("sheet", sheet)

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(DIFFICULTY_ORDER),
  );

  // Re-expand all groups whenever a new sheet loads
  useEffect(() => {
    if (sheet) setExpandedGroups(new Set(DIFFICULTY_ORDER));
  }, [sheet?.id]);

  // ── derived stats ────────────────────────────────────────────────────────────
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

  // ── grouped + filtered problems ──────────────────────────────────────────────
  const groupedByDifficulty = useMemo(() => {
    if (!sheet) return [];
    return DIFFICULTY_ORDER.map((diff) => ({
      difficulty: diff,
      items: sheet.problems.filter((p) => p.problem.difficulty === diff),
    })).filter((g) => g.items.length > 0);
  }, [sheet]);

  const filterItem = (item: SheetProblemInSheet): boolean => {
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

  // ── loading / error states ───────────────────────────────────────────────────
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
        <div className='text-center space-y-2'>
          <h2 className='text-xl font-semibold'>
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

  const DIFFICULTIES = ['All', 'EASY', 'MEDIUM', 'HARD'];
  const STATUSES = ['All', 'Solved', 'Unsolved'];

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Back link */}
        <Link
          to='/sheets'
          className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Sheets
        </Link>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          {/* Title row */}
          <div className='flex items-start gap-4 mb-4'>
            <div className='p-3 rounded-xl bg-primary/10 border border-primary/20 shrink-0'>
              <BookOpen className='h-6 w-6 text-primary' />
            </div>
            <div className='flex-1 min-w-0'>
              <h1 className='text-2xl sm:text-3xl font-bold mb-1 truncate'>
                {sheet.name}
              </h1>
              {sheet.description && (
                <p className='text-muted-foreground text-sm mb-1'>
                  {sheet.description}
                </p>
              )}
              {/* Author */}
              <div className='flex items-center gap-2 mt-1.5'>
                <Avatar className='h-5 w-5'>
                  <AvatarImage src={sheet.user.image ?? undefined} />
                  <AvatarFallback className='text-[10px] bg-surface-3'>
                    {(sheet.user.name ??
                      sheet.user.username ??
                      '?')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className='text-xs text-muted-foreground/70'>
                  by{' '}
                  <span className='text-muted-foreground font-medium'>
                    {sheet.user.name}
                  </span>
                  {sheet.user.username && <> · @{sheet.user.username}</>}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {sheet.allTags.length > 0 && (
            <div className='flex flex-wrap gap-1.5 mb-5'>
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

          {/* Stats card */}
          <div className='glass-card p-5'>
            <div className='grid grid-cols-5 gap-4 mb-4'>
              {[
                {
                  label: 'Total',
                  value: stats.total,
                  color: 'text-foreground',
                },
                { label: 'Solved', value: stats.solved, color: 'text-primary' },
                {
                  label: 'Easy',
                  value: stats.easy,
                  color: DIFFICULTY_COLOR.EASY,
                },
                {
                  label: 'Medium',
                  value: stats.medium,
                  color: DIFFICULTY_COLOR.MEDIUM,
                },
                {
                  label: 'Hard',
                  value: stats.hard,
                  color: DIFFICULTY_COLOR.HARD,
                },
              ].map(({ label, value, color }) => (
                <div key={label} className='text-center'>
                  <div className={`text-xl font-bold ${color}`}>{value}</div>
                  <div className='text-[11px] text-muted-foreground'>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
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

        {/* ── Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='flex flex-col sm:flex-row gap-3 mb-6'
        >
          {/* Search */}
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search by title or tag...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 bg-surface-1 border-border/50 h-9 text-sm'
            />
          </div>

          {/* Difficulty filter */}
          <div className='flex items-center gap-1 bg-surface-1 border border-border/50 rounded-lg px-1'>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficultyFilter(d)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                  difficultyFilter === d
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {d === 'All' ? 'All' : formatDifficulty(d)}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className='flex items-center gap-1 bg-surface-1 border border-border/50 rounded-lg px-1'>
            {STATUSES.map((s) => (
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
        </motion.div>

        {/* ── Problem groups ── */}
        <div className='space-y-3'>
          {filteredGroups.map((group, i) => {
            const isExpanded = expandedGroups.has(group.difficulty);
            const groupSolved = group.items.filter(
              (item) => item.problem.isSolved,
            ).length;
            const groupPct =
              group.items.length > 0
                ? (groupSolved / group.items.length) * 100
                : 0;

            return (
              <motion.div
                key={group.difficulty}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                className='glass-card overflow-hidden'
              >
                {/* Group header */}
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
                      className={`text-xs font-semibold px-2 py-0.5 rounded border ${DIFFICULTY_CLASS[group.difficulty]}`}
                    >
                      {formatDifficulty(group.difficulty)}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {groupSolved}/{group.items.length} solved
                    </span>
                  </div>
                  <div className='w-20 h-1.5 bg-surface-3 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-primary rounded-full transition-all duration-500'
                      style={{ width: `${groupPct}%` }}
                    />
                  </div>
                </button>

                {/* Problem rows */}
                <AnimatePresence initial={false}>
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

        {/* Empty state */}
        {filteredGroups.length === 0 && (
          <div className='text-center py-16 text-muted-foreground text-sm'>
            {searchQuery || difficultyFilter !== 'All' || statusFilter !== 'All'
              ? 'No problems match your filters.'
              : 'This sheet has no problems yet.'}
          </div>
        )}
      </div>
    </div>
  );
}
