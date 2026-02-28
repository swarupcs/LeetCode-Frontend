import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
import { Search, Check, ChevronRight, Code2 } from 'lucide-react';
import { usePagination } from '@/hooks/use-pagination';
import { useAppSelector } from '@/hooks/redux'; // ← typed selector hook
import { useProblems } from '@/hooks/problems/useGetAllProblems';

const difficultyConfig = {
  EASY: { class: 'difficulty-easy', label: 'Easy' },
  MEDIUM: { class: 'difficulty-medium', label: 'Medium' },
  HARD: { class: 'difficulty-hard', label: 'Hard' },
};

export default function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // ✅ Fix 1: use typed selector — state is now RootState, not unknown
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

  if (isPending) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-muted-foreground'>Loading problems...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-destructive'>
          Failed to load problems. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <h1 className='text-3xl font-bold mb-2'>Problem Set</h1>
          <p className='text-muted-foreground'>
            {solvedCount} of {publishedProblems.length} problems solved
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'
        >
          <div className='glass-card p-4 text-center'>
            <div className='text-2xl font-bold text-foreground'>
              {publishedProblems.length}
            </div>
            <div className='text-xs text-muted-foreground mt-1'>Total</div>
          </div>
          <div className='glass-card p-4 text-center'>
            <div className='text-2xl font-bold text-[hsl(var(--emerald))]'>
              {easyCount}
            </div>
            <div className='text-xs text-muted-foreground mt-1'>Easy</div>
          </div>
          <div className='glass-card p-4 text-center'>
            <div className='text-2xl font-bold text-[hsl(var(--amber))]'>
              {medCount}
            </div>
            <div className='text-xs text-muted-foreground mt-1'>Medium</div>
          </div>
          <div className='glass-card p-4 text-center'>
            <div className='text-2xl font-bold text-[hsl(var(--rose))]'>
              {hardCount}
            </div>
            <div className='text-xs text-muted-foreground mt-1'>Hard</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className='w-full sm:w-36 bg-surface-1 border-border/50 h-10'>
              <SelectValue placeholder='Difficulty' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Levels</SelectItem>
              <SelectItem value='easy'>Easy</SelectItem>
              <SelectItem value='medium'>Medium</SelectItem>
              <SelectItem value='hard'>Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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

        {/* Problem Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='glass-card overflow-hidden'
        >
          {/* Table Header */}
          <div className='hidden sm:grid grid-cols-[40px_1fr_100px_80px] gap-4 px-6 py-3 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider'>
            <div />
            <div>Problem</div>
            <div>Difficulty</div>
            <div />
          </div>

          {/* Problem Rows */}
          <div className='divide-y divide-border/30'>
            {paginatedProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  to={`/problem/${problem.id}`}
                  className='grid grid-cols-1 sm:grid-cols-[40px_1fr_100px_80px] gap-2 sm:gap-4 items-center px-6 py-4 hover:bg-surface-2/50 transition-colors group'
                >
                  {/* Status */}
                  <div className='hidden sm:flex items-center justify-center'>
                    {problem.isSolved ? (
                      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/20'>
                        <Check className='h-3 w-3 text-primary' />
                      </div>
                    ) : (
                      <div className='h-5 w-5 rounded-full border border-border/50' />
                    )}
                  </div>

                  {/* Title & Tags */}
                  <div className='flex items-start gap-3'>
                    <span className='text-muted-foreground text-sm font-mono w-8 shrink-0'>
                      {problem.problemNumber}.
                    </span>
                    <div className='min-w-0'>
                      <div className='text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate'>
                        {problem.title}
                      </div>
                      <div className='flex flex-wrap gap-1 mt-1'>
                        {problem.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className='text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground'
                          >
                            {tag}
                          </span>
                        ))}
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
                    <ChevronRight className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredProblems.length === 0 && (
            <div className='text-center py-16'>
              <Code2 className='h-10 w-10 text-muted-foreground mx-auto mb-3' />
              <p className='text-muted-foreground'>
                No problems match your filters
              </p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className='mt-6 flex items-center justify-between'
          >
            <p className='text-sm text-muted-foreground'>
              Showing {startIndex + 1}–
              {Math.min(endIndex, filteredProblems.length)} of{' '}
              {filteredProblems.length} problems
            </p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={prevPage}
                    className={
                      isFirstPage
                        ? 'pointer-events-none opacity-50'
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
                        ? 'pointer-events-none opacity-50'
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
