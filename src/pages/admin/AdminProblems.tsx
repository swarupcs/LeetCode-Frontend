// src/pages/admin/AdminProblemsPage.tsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  ListChecks,
  Code2,
  Filter,
  Globe,
  EyeOff,
} from 'lucide-react';
import { usePagination } from '@/hooks/use-pagination';
import { toast } from 'sonner';
import { useProblems } from '@/hooks/problems/useGetAllProblems';

// ─── Skeleton primitive ───────────────────────────────────────────────────────

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

// ─── Full page skeleton ───────────────────────────────────────────────────────

function AdminProblemsSkeleton() {
  return (
    <div className='p-6 lg:p-8 max-w-7xl'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <Bone w='w-28' h='h-7' rounded='rounded-lg' />
            <Bone w='w-72' h='h-4' delay={40} />
          </div>
          <Bone w='w-36' h='h-10' rounded='rounded-lg' delay={60} />
        </div>
      </motion.div>

      {/* 6 stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='grid grid-cols-2 md:grid-cols-6 gap-4 mb-8'
      >
        {[0, 60, 120, 180, 240, 300].map((d, i) => (
          <div key={i} className='glass-card p-4 text-center'>
            <Bone w='w-10 mx-auto' h='h-7' rounded='rounded-lg' delay={d} />
            <Bone w='w-16 mx-auto' h='h-2.5' delay={d + 30} className='mt-2' />
          </div>
        ))}
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className='flex flex-col sm:flex-row gap-3 mb-6'
      >
        <Bone w='flex-1 w-full' h='h-10' rounded='rounded-xl' delay={320} />
        <div className='flex gap-3'>
          <Bone w='w-[140px]' h='h-10' rounded='rounded-xl' delay={340} />
          <Bone w='w-[140px]' h='h-10' rounded='rounded-xl' delay={360} />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='glass-card overflow-hidden'
      >
        <Table>
          <TableHeader>
            <TableRow className='border-border/50 hover:bg-transparent'>
              {[
                '#',
                'Title',
                'Difficulty',
                'Status',
                'Tags',
                'Details',
                '',
              ].map((h, i) => (
                <TableHead
                  key={i}
                  className={`text-muted-foreground text-xs font-semibold ${i === 0 ? 'w-[60px]' : i === 2 ? 'w-[100px]' : i === 3 ? 'w-[110px]' : i === 4 ? 'hidden md:table-cell' : i === 5 ? 'w-[80px] text-center' : i === 6 ? 'w-[50px]' : ''}`}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.25 + i * 0.035 }}
                className='border-border/30'
              >
                {/* Render as plain tds since SkeletonRow already uses TableRow */}
                <TableCell className='w-[60px]'>
                  <Bone w='w-8' h='h-3' rounded='rounded' delay={i * 50} />
                </TableCell>
                <TableCell>
                  <Bone
                    w={
                      [
                        'w-48',
                        'w-56',
                        'w-40',
                        'w-52',
                        'w-44',
                        'w-36',
                        'w-48',
                        'w-52',
                        'w-44',
                        'w-40',
                      ][i]!
                    }
                    h='h-3.5'
                    delay={i * 50 + 15}
                  />
                </TableCell>
                <TableCell className='w-[100px]'>
                  <Bone
                    w='w-14'
                    h='h-5'
                    rounded='rounded-full'
                    delay={i * 50 + 25}
                  />
                </TableCell>
                <TableCell className='w-[110px]'>
                  <Bone
                    w='w-20'
                    h='h-5'
                    rounded='rounded-full'
                    delay={i * 50 + 35}
                  />
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  <div className='flex gap-1'>
                    <Bone
                      w='w-12'
                      h='h-4'
                      rounded='rounded'
                      delay={i * 50 + 40}
                    />
                    <Bone
                      w='w-16'
                      h='h-4'
                      rounded='rounded'
                      delay={i * 50 + 52}
                    />
                    <Bone
                      w='w-10'
                      h='h-4'
                      rounded='rounded'
                      delay={i * 50 + 64}
                    />
                  </div>
                </TableCell>
                <TableCell className='w-[80px] text-center'>
                  <div className='flex items-center justify-center gap-1'>
                    <Bone
                      w='w-3.5'
                      h='h-3.5'
                      rounded='rounded'
                      delay={i * 50 + 45}
                    />
                    <Bone
                      w='w-3.5'
                      h='h-3.5'
                      rounded='rounded'
                      delay={i * 50 + 58}
                    />
                  </div>
                </TableCell>
                <TableCell className='w-[50px]'>
                  <Bone
                    w='w-7'
                    h='h-7'
                    rounded='rounded-md'
                    delay={i * 50 + 50}
                  />
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      {/* Pagination placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className='mt-6 flex items-center justify-between'
      >
        <Bone w='w-48' h='h-4' delay={540} />
        <div className='flex items-center gap-1.5'>
          {[0, 1, 2, 3, 4].map((i) => (
            <Bone
              key={i}
              w='w-9'
              h='h-9'
              rounded='rounded-lg'
              delay={555 + i * 20}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminProblemsPage() {
  const { problems, isLoading, isError } = useProblems();

  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<(typeof problems)[0] | null>(
    null,
  );

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.problemNumber?.toString().includes(searchQuery) ||
        p.tags?.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      const matchesDifficulty =
        difficultyFilter === 'all' ||
        p.difficulty?.toLowerCase() === difficultyFilter.toLowerCase();
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && p.isPublished) ||
        (statusFilter === 'draft' && !p.isPublished);
      return matchesSearch && matchesDifficulty && matchesStatus;
    });
  }, [problems, searchQuery, difficultyFilter, statusFilter]);

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

  const stats = useMemo(() => {
    const easy = problems.filter(
      (p) => p.difficulty?.toUpperCase() === 'EASY',
    ).length;
    const medium = problems.filter(
      (p) => p.difficulty?.toUpperCase() === 'MEDIUM',
    ).length;
    const hard = problems.filter(
      (p) => p.difficulty?.toUpperCase() === 'HARD',
    ).length;
    const published = problems.filter((p) => p.isPublished).length;
    const draft = problems.length - published;
    return { total: problems.length, easy, medium, hard, published, draft };
  }, [problems]);

  const getDifficultyBadge = (difficulty: string) => {
    const upper = difficulty?.toUpperCase();
    const cls =
      upper === 'EASY'
        ? 'difficulty-easy'
        : upper === 'MEDIUM'
          ? 'difficulty-medium'
          : 'difficulty-hard';
    return (
      <Badge
        variant='outline'
        className={`text-[10px] font-medium border ${cls}`}
      >
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()}
      </Badge>
    );
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) return <AdminProblemsSkeleton />;

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-destructive text-sm'>
          Failed to load problems. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className='p-6 lg:p-8 max-w-7xl'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>Problems</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Manage problems, create new challenges, and maintain the platform
            </p>
          </div>
          <Link to='/admin/problems/create'>
            <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10 gap-2'>
              <Plus className='h-4 w-4' />
              Create Problem
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='grid grid-cols-2 md:grid-cols-6 gap-4 mb-8'
      >
        {[
          { label: 'Total', value: stats.total, cls: 'text-foreground' },
          { label: 'Published', value: stats.published, cls: 'text-primary' },
          { label: 'Drafts', value: stats.draft, cls: 'text-muted-foreground' },
          {
            label: 'Easy',
            value: stats.easy,
            cls: 'text-[hsl(var(--emerald))]',
          },
          {
            label: 'Medium',
            value: stats.medium,
            cls: 'text-[hsl(var(--amber))]',
          },
          { label: 'Hard', value: stats.hard, cls: 'text-destructive' },
        ].map(({ label, value, cls }) => (
          <div key={label} className='glass-card p-4 text-center'>
            <div className={`text-2xl font-bold ${cls}`}>{value}</div>
            <div className='text-xs text-muted-foreground mt-1'>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className='flex flex-col sm:flex-row gap-3 mb-6'
      >
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search by title, number, or tag...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 bg-surface-1 border-border/50 h-10'
          />
        </div>
        <div className='flex gap-3'>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className='w-[140px] bg-surface-1 border-border/50 h-10'>
              <Filter className='h-3.5 w-3.5 mr-2 text-muted-foreground' />
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
            <SelectTrigger className='w-[140px] bg-surface-1 border-border/50 h-10'>
              <Globe className='h-3.5 w-3.5 mr-2 text-muted-foreground' />
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='published'>Published</SelectItem>
              <SelectItem value='draft'>Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='glass-card overflow-hidden'
      >
        <Table>
          <TableHeader>
            <TableRow className='border-border/50 hover:bg-transparent'>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[60px]'>
                #
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold'>
                Title
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[100px]'>
                Difficulty
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[110px]'>
                Status
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold hidden md:table-cell'>
                Tags
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[80px] text-center'>
                Details
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[50px]' />
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {paginatedProblems.map((problem) => (
                <motion.tr
                  key={problem.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='border-border/30 hover:bg-surface-2/50 transition-colors group'
                >
                  <TableCell className='font-mono text-sm text-muted-foreground'>
                    {problem.problemNumber}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <span className='font-medium text-sm text-foreground group-hover:text-primary transition-colors'>
                        {problem.title}
                      </span>
                      {!problem.isPublished && (
                        <EyeOff className='h-3.5 w-3.5 text-muted-foreground/50 shrink-0' />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getDifficultyBadge(problem.difficulty)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={`text-[10px] font-medium border ${problem.isPublished ? 'bg-primary/10 text-primary border-primary/20' : 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse'}`}
                    >
                      {problem.isPublished ? (
                        <span className='flex items-center gap-1'>
                          <Globe className='h-3 w-3' />
                          Published
                        </span>
                      ) : (
                        <span className='flex items-center gap-1'>
                          <EyeOff className='h-3 w-3' />
                          Draft
                        </span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <div className='flex flex-wrap gap-1'>
                      {problem.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className='text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground'
                        >
                          {tag}
                        </span>
                      ))}
                      {(problem.tags?.length ?? 0) > 3 && (
                        <span className='text-[10px] text-muted-foreground/60'>
                          +{problem.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className='flex items-center justify-center gap-1'>
                      <Code2
                        className={`h-3.5 w-3.5 ${problem.description ? 'text-primary' : 'text-muted-foreground/30'}`}
                      />
                      <ListChecks
                        className={`h-3.5 w-3.5 ${problem.codeSnippets ? 'text-primary' : 'text-muted-foreground/30'}`}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-7 w-7 text-muted-foreground hover:text-foreground'
                        >
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align='end'
                        className='w-44 bg-card border-border/50'
                      >
                        <DropdownMenuItem
                          asChild
                          className='text-sm cursor-pointer'
                        >
                          <Link
                            to={`/problem/${problem.id}`}
                            className='flex items-center gap-2'
                          >
                            <Eye className='h-3.5 w-3.5' />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          asChild
                          className='text-sm cursor-pointer'
                        >
                          <Link
                            to={`/admin/problems/edit/${problem.id}`}
                            className='flex items-center gap-2'
                          >
                            <Pencil className='h-3.5 w-3.5' />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-sm text-destructive cursor-pointer flex items-center gap-2'
                          onClick={() => setDeleteTarget(problem)}
                        >
                          <Trash2 className='h-3.5 w-3.5' />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>

        {filteredProblems.length === 0 && (
          <div className='text-center py-12'>
            <ListChecks className='h-10 w-10 text-muted-foreground/30 mx-auto mb-3' />
            <p className='text-muted-foreground text-sm'>
              No problems match your filters.
            </p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='mt-6 flex items-center justify-between'
        >
          <p className='text-sm text-muted-foreground'>
            Showing {startIndex + 1}–{endIndex} of {filteredProblems.length}{' '}
            problems
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
                      onClick={() => setPage(page)}
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

      {/* Delete dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent className='bg-card border-border/50'>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Problem</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className='font-semibold text-foreground'>
                "{deleteTarget?.title}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='border-border/50'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.success('Problem deleted', {
                  description: `"${deleteTarget?.title}" has been removed.`,
                });
                setDeleteTarget(null);
              }}
              className='bg-destructive hover:bg-destructive/90 text-destructive-foreground'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
