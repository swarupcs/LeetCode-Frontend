// src/pages/ProblemsPage.tsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Search,
  Check,
  ChevronRight,
  Code2,
  SlidersHorizontal,
} from 'lucide-react';
import { usePagination } from '@/hooks/use-pagination';
import { useAppSelector } from '@/hooks/redux';
import { useProblems } from '@/hooks/problems/useGetAllProblems';

// ─── Config ───────────────────────────────────────────────────────────────────

const difficultyConfig = {
  EASY: { class: 'difficulty-easy', label: 'Easy' },
  MEDIUM: { class: 'difficulty-medium', label: 'Medium' },
  HARD: { class: 'difficulty-hard', label: 'Hard' },
};

// ─── Skeleton primitives ─────────────────────────────────────────────────────

/** Single pulsing bar — the atomic skeleton unit */
function Bone({
  w,
  h = 'h-3',
  rounded = 'rounded-md',
  delay = 0,
  className = '',
}: {
  w: string;
  h?: string;
  rounded?: string;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`${w} ${h} ${rounded} bg-surface-3 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

/** One skeleton problem row — mirrors the real row layout exactly */
function SkeletonRow({ index }: { index: number }) {
  const base = index * 60;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className='grid grid-cols-1 sm:grid-cols-[40px_1fr_100px_80px] gap-2 sm:gap-4 items-center px-6 py-4 border-b border-border/30 last:border-0'
    >
      {/* Status circle */}
      <div className='hidden sm:flex items-center justify-center'>
        <div
          className='h-5 w-5 rounded-full bg-surface-3 animate-pulse'
          style={{ animationDelay: `${base}ms` }}
        />
      </div>

      {/* Title + tags */}
      <div className='flex items-start gap-3'>
        <Bone
          w='w-7'
          h='h-3.5'
          rounded='rounded'
          delay={base + 30}
          className='mt-0.5 shrink-0'
        />
        <div className='flex-1 min-w-0 space-y-2'>
          {/* Title bar — varying width creates organic feel */}
          <Bone
            w={['w-3/5', 'w-2/3', 'w-4/5', 'w-1/2', 'w-3/4'][index % 5]!}
            h='h-3.5'
            delay={base + 50}
          />
          {/* Tag chips */}
          <div className='flex gap-1.5'>
            <Bone w='w-12' h='h-4' rounded='rounded' delay={base + 80} />
            <Bone w='w-16' h='h-4' rounded='rounded' delay={base + 100} />
            {index % 3 !== 0 && (
              <Bone w='w-10' h='h-4' rounded='rounded' delay={base + 120} />
            )}
          </div>
        </div>
      </div>

      {/* Difficulty badge */}
      <div>
        <Bone w='w-14' h='h-5' rounded='rounded-full' delay={base + 60} />
      </div>

      {/* Arrow */}
      <div className='hidden sm:flex justify-end'>
        <Bone w='w-4' h='h-4' rounded='rounded' delay={base + 70} />
      </div>
    </motion.div>
  );
}

/** Skeleton for the stat cards */
function SkeletonStatCard({ delay }: { delay: number }) {
  return (
    <div className='glass-card p-4 text-center space-y-2'>
      <Bone w='w-10 mx-auto' h='h-7' rounded='rounded-lg' delay={delay} />
      <Bone w='w-8 mx-auto' h='h-2.5' delay={delay + 40} />
    </div>
  );
}

/** Full skeleton state for the page */
function PageSkeleton() {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8 space-y-2'
        >
          <Bone w='w-44' h='h-8' rounded='rounded-lg' />
          <Bone w='w-52' h='h-4' delay={60} />
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'
        >
          {[0, 80, 160, 240].map((d) => (
            <SkeletonStatCard key={d} delay={d} />
          ))}
        </motion.div>

        {/* Filter bar skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className='flex flex-col sm:flex-row gap-3 mb-6'
        >
          <Bone w='flex-1' h='h-10' rounded='rounded-xl' delay={80} />
          <Bone w='w-full sm:w-36' h='h-10' rounded='rounded-xl' delay={120} />
          <Bone w='w-full sm:w-36' h='h-10' rounded='rounded-xl' delay={160} />
        </motion.div>

        {/* Table skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='glass-card overflow-hidden'
        >
          {/* Column header */}
          <div className='hidden sm:grid grid-cols-[40px_1fr_100px_80px] gap-4 px-6 py-3 border-b border-border/50'>
            <div />
            <Bone w='w-16' h='h-2.5' delay={200} />
            <Bone w='w-16' h='h-2.5' delay={230} />
            <div />
          </div>

          {/* Rows */}
          <div>
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonRow key={i} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Pagination placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='mt-6 flex items-center justify-between'
        >
          <Bone w='w-40' h='h-4' delay={400} />
          <div className='flex items-center gap-1.5'>
            {[0, 1, 2, 3, 4].map((i) => (
              <Bone
                key={i}
                w='w-9'
                h='h-9'
                rounded='rounded-lg'
                delay={420 + i * 30}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const user = useAppSelector((state) => state.auth);
  const { problems, isPending, isError } = useProblems(user?.id ?? undefined);

  const publishedProblems = useMemo(() => problems ?? [], [problems]);

  const filteredProblems = useMemo(() => {
    return publishedProblems.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.problemNumber ?? '').includes(searchQuery) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDifficulty =
        difficultyFilter === 'all' ||
        p.difficulty === difficultyFilter.toUpperCase();
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'solved' && p.isSolved) ||
        (statusFilter === 'unsolved' && !p.isSolved);
      return matchesSearch && matchesDifficulty && matchesStatus;
    });
  }, [searchQuery, difficultyFilter, statusFilter, publishedProblems]);

  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    pageNumbers,
    setPage,
    nextPage,
    prevPage,
    isFirstPage,
    isLastPage,
  } = usePagination({ totalItems: filteredProblems.length, itemsPerPage: 15 });

  const paginatedProblems = useMemo(
    () => filteredProblems.slice(startIndex, endIndex),
    [filteredProblems, startIndex, endIndex],
  );

  const solvedCount = publishedProblems.filter((p) => p.isSolved).length;
  const easyCount = publishedProblems.filter(
    (p) => p.difficulty === 'EASY',
  ).length;
  const medCount = publishedProblems.filter(
    (p) => p.difficulty === 'MEDIUM',
  ).length;
  const hardCount = publishedProblems.filter(
    (p) => p.difficulty === 'HARD',
  ).length;

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isPending) return <PageSkeleton />;

  // ── Error state ───────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-3'>
          <Code2 className='h-10 w-10 text-destructive/40 mx-auto' />
          <p className='text-destructive font-medium'>
            Failed to load problems.
          </p>
          <p className='text-sm text-muted-foreground'>
            Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  // ── Loaded state ──────────────────────────────────────────────────────────
  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <h1 className='text-3xl font-bold mb-1.5'>Problem Set</h1>
          <p className='text-muted-foreground text-sm'>
            {solvedCount > 0 ? (
              <>
                <span className='text-primary font-semibold'>
                  {solvedCount}
                </span>{' '}
                of {publishedProblems.length} problems solved
              </>
            ) : (
              `${publishedProblems.length} problems available`
            )}
          </p>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'
        >
          {[
            {
              label: 'Total',
              value: publishedProblems.length,
              color: 'text-foreground',
            },
            {
              label: 'Easy',
              value: easyCount,
              color: 'text-[hsl(var(--emerald))]',
            },
            {
              label: 'Medium',
              value: medCount,
              color: 'text-[hsl(var(--amber))]',
            },
            {
              label: 'Hard',
              value: hardCount,
              color: 'text-[hsl(var(--rose))]',
            },
          ].map(({ label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.35 }}
              className='glass-card p-4 text-center'
            >
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className='text-xs text-muted-foreground mt-1'>{label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className='flex flex-col sm:flex-row gap-3 mb-6'
        >
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search by title, number, or tag...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 bg-surface-1 border-border/50 focus:border-primary/50 h-10'
            />
          </div>
          <Select
            value={difficultyFilter}
            onValueChange={(v) => {
              setDifficultyFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className='w-full sm:w-36 bg-surface-1 border-border/50 h-10'>
              <SlidersHorizontal className='h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0' />
              <SelectValue placeholder='Difficulty' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Levels</SelectItem>
              <SelectItem value='easy'>Easy</SelectItem>
              <SelectItem value='medium'>Medium</SelectItem>
              <SelectItem value='hard'>Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className='w-full sm:w-36 bg-surface-1 border-border/50 h-10'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='solved'>Solved</SelectItem>
              <SelectItem value='unsolved'>Unsolved</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Problem table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.26 }}
          className='glass-card overflow-hidden'
        >
          {/* Column header */}
          <div className='hidden sm:grid grid-cols-[40px_1fr_100px_80px] gap-4 px-6 py-3 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
            <div />
            <div>Problem</div>
            <div>Difficulty</div>
            <div />
          </div>

          {/* Rows */}
          <AnimatePresence mode='wait'>
            <motion.div
              key={`${searchQuery}-${difficultyFilter}-${statusFilter}-${currentPage}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className='divide-y divide-border/30'
            >
              {paginatedProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: index * 0.025 }}
                >
                  <Link
                    to={`/problem/${problem.id}`}
                    className='grid grid-cols-1 sm:grid-cols-[40px_1fr_100px_80px] gap-2 sm:gap-4 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors group'
                  >
                    {/* Status indicator */}
                    <div className='hidden sm:flex items-center justify-center'>
                      {problem.isSolved ? (
                        <div className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/30'>
                          <Check className='h-3 w-3 text-primary' />
                        </div>
                      ) : (
                        <div className='h-5 w-5 rounded-full border border-border/60 group-hover:border-border transition-colors' />
                      )}
                    </div>

                    {/* Title + tags */}
                    <div className='flex items-start gap-3'>
                      <span className='text-muted-foreground text-sm font-mono w-8 shrink-0 pt-0.5'>
                        {problem.problemNumber}.
                      </span>
                      <div className='min-w-0'>
                        <div className='text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate'>
                          {problem.title}
                        </div>
                        <div className='flex flex-wrap gap-1 mt-1.5'>
                          {problem.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className='text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground border border-border/30'
                            >
                              {tag}
                            </span>
                          ))}
                          {problem.tags.length > 3 && (
                            <span className='text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground/60'>
                              +{problem.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <Badge
                        variant='outline'
                        className={`text-xs font-medium border ${difficultyConfig[problem.difficulty]?.class}`}
                      >
                        {difficultyConfig[problem.difficulty]?.label ??
                          problem.difficulty}
                      </Badge>
                    </div>

                    {/* Arrow */}
                    <div className='hidden sm:flex justify-end'>
                      <ChevronRight className='h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all' />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty state */}
          {filteredProblems.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className='text-center py-16 space-y-3'
            >
              <Code2 className='h-10 w-10 text-muted-foreground/25 mx-auto' />
              <p className='text-muted-foreground font-medium'>
                No problems match your filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDifficultyFilter('all');
                  setStatusFilter('all');
                }}
                className='text-xs text-primary hover:underline'
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className='mt-6 flex flex-col sm:flex-row items-center justify-between gap-3'
          >
            <p className='text-sm text-muted-foreground order-2 sm:order-1'>
              Showing{' '}
              <span className='font-medium text-foreground'>
                {startIndex + 1}
              </span>
              –
              <span className='font-medium text-foreground'>
                {Math.min(endIndex, filteredProblems.length)}
              </span>{' '}
              of{' '}
              <span className='font-medium text-foreground'>
                {filteredProblems.length}
              </span>{' '}
              problems
            </p>
            <Pagination className='order-1 sm:order-2'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={prevPage}
                    className={
                      isFirstPage
                        ? 'pointer-events-none opacity-40'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
                {pageNumbers.map((page, i) =>
                  page === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => setPage(page as number)}
                        className='cursor-pointer'
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={nextPage}
                    className={
                      isLastPage
                        ? 'pointer-events-none opacity-40'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </motion.div>
        )}
      </div>
    </div>
  );
}
