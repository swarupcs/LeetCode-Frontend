// src/pages/admin/AdminSheetsPage.tsx
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
  BookOpen,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllSheetDetails } from '@/hooks/sheets/useGetAllSheetDetails';
import { useDeleteSheet } from '@/hooks/sheets/useDeleteSheet';
import type { Sheet } from '@/types/sheet.types';

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

function AdminSheetsSkeleton() {
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
            <Bone w='w-20' h='h-7' rounded='rounded-lg' />
            <Bone w='w-80' h='h-4' delay={40} />
          </div>
          <Bone w='w-32' h='h-10' rounded='rounded-lg' delay={60} />
        </div>
      </motion.div>

      {/* 5 stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-8'
      >
        {[0, 60, 120, 180, 240].map((d, i) => (
          <div
            key={i}
            className={`glass-card p-4 text-center ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}
          >
            <Bone w='w-10 mx-auto' h='h-7' rounded='rounded-lg' delay={d} />
            <Bone w='w-20 mx-auto' h='h-2.5' delay={d + 30} className='mt-2' />
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className='mb-6'
      >
        <Bone w='w-full' h='h-10' rounded='rounded-xl' delay={260} />
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
                'Name',
                'Tags',
                'Difficulties',
                'Problems',
                'Created by',
                '',
              ].map((h, i) => (
                <TableHead
                  key={i}
                  className={`text-muted-foreground text-xs font-semibold ${i === 1 || i === 2 || i === 4 ? 'hidden md:table-cell' : ''} ${i === 3 ? 'w-[100px] text-center hidden sm:table-cell' : ''} ${i === 5 ? 'w-[50px]' : ''}`}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.25 + i * 0.04 }}
                className='border-border/30'
              >
                {/* Name + description */}
                <TableCell>
                  <Bone
                    w={
                      [
                        'w-48',
                        'w-36',
                        'w-52',
                        'w-40',
                        'w-44',
                        'w-32',
                        'w-48',
                        'w-40',
                      ][i]!
                    }
                    h='h-3.5'
                    delay={i * 45}
                  />
                  <Bone
                    w={['w-64', 'w-56', 'w-72', 'w-60'][i % 4]!}
                    h='h-2.5'
                    delay={i * 45 + 15}
                    className='mt-1.5'
                  />
                </TableCell>
                {/* Tags */}
                <TableCell className='hidden md:table-cell'>
                  <div className='flex gap-1'>
                    <Bone
                      w='w-12'
                      h='h-4'
                      rounded='rounded'
                      delay={i * 45 + 20}
                    />
                    <Bone
                      w='w-16'
                      h='h-4'
                      rounded='rounded'
                      delay={i * 45 + 32}
                    />
                    <Bone
                      w='w-10'
                      h='h-4'
                      rounded='rounded'
                      delay={i * 45 + 44}
                    />
                  </div>
                </TableCell>
                {/* Difficulties */}
                <TableCell className='hidden md:table-cell'>
                  <div className='flex gap-1'>
                    <Bone
                      w='w-10'
                      h='h-5'
                      rounded='rounded-full'
                      delay={i * 45 + 25}
                    />
                    <Bone
                      w='w-14'
                      h='h-5'
                      rounded='rounded-full'
                      delay={i * 45 + 38}
                    />
                  </div>
                </TableCell>
                {/* Problems count */}
                <TableCell className='hidden sm:table-cell text-center'>
                  <Bone w='w-8 mx-auto' h='h-3.5' delay={i * 45 + 30} />
                </TableCell>
                {/* Created by */}
                <TableCell className='hidden md:table-cell'>
                  <div className='flex items-center gap-2'>
                    <Bone
                      w='w-5'
                      h='h-5'
                      rounded='rounded-full'
                      delay={i * 45 + 35}
                    />
                    <Bone w='w-20' h='h-3' delay={i * 45 + 48} />
                  </div>
                </TableCell>
                {/* Actions */}
                <TableCell className='w-[50px]'>
                  <Bone
                    w='w-7'
                    h='h-7'
                    rounded='rounded-md'
                    delay={i * 45 + 40}
                  />
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSheetsPage() {
  const {
    sheets,
    isPending: isLoading,
    isError,
    error,
  } = useGetAllSheetDetails();
  const { deleteSheetMutation, isPending: isDeleting } = useDeleteSheet();

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Sheet | null>(null);

  const filteredSheets = useMemo(
    () =>
      sheets.filter(
        (s) =>
          s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.allTags?.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      ),
    [searchQuery, sheets],
  );

  const stats = useMemo(
    () => ({
      total: sheets.length,
      totalProblems: sheets.reduce((acc, s) => acc + s.totalProblems, 0),
      easy: sheets.filter((s) => s.allDifficulties?.includes('EASY')).length,
      medium: sheets.filter((s) => s.allDifficulties?.includes('MEDIUM'))
        .length,
      hard: sheets.filter((s) => s.allDifficulties?.includes('HARD')).length,
    }),
    [sheets],
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSheetMutation(deleteTarget.id);
      toast.success('Sheet deleted', {
        description: `"${deleteTarget.name}" has been removed.`,
      });
    } catch (err: unknown) {
      const e = err as { message?: string };
      toast.error('Failed to delete sheet', {
        description: e?.message ?? 'Something went wrong.',
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) return <AdminSheetsSkeleton />;

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-destructive text-sm'>
          {error?.message ?? 'Failed to load sheets.'}
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
            <h1 className='text-2xl font-bold'>Sheets</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Create and manage problem sheets, organize topics, and assign
              problems
            </p>
          </div>
          <Link to='/admin/sheets/create'>
            <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10 gap-2'>
              <Plus className='h-4 w-4' />
              Create Sheet
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-8'
      >
        {[
          {
            value: stats.total,
            label: 'Total Sheets',
            color: 'text-foreground',
          },
          {
            value: stats.totalProblems,
            label: 'Total Problems',
            color: 'text-primary',
          },
          {
            value: stats.easy,
            label: 'Has Easy',
            color: 'text-[hsl(var(--emerald))]',
          },
          {
            value: stats.medium,
            label: 'Has Medium',
            color: 'text-[hsl(var(--amber))]',
          },
          {
            value: stats.hard,
            label: 'Has Hard',
            color: 'text-destructive',
            colSpan: true,
          },
        ].map(({ value, label, color, colSpan }) => (
          <div
            key={label}
            className={`glass-card p-4 text-center ${colSpan ? 'col-span-2 md:col-span-1' : ''}`}
          >
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className='text-xs text-muted-foreground mt-1'>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className='mb-6'
      >
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search by name, description, or tag...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 bg-surface-1 border-border/50 h-10'
          />
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
              <TableHead className='text-muted-foreground text-xs font-semibold'>
                Name
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold hidden md:table-cell'>
                Tags
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold hidden md:table-cell'>
                Difficulties
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[100px] text-center hidden sm:table-cell'>
                Problems
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold hidden md:table-cell'>
                Created by
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[50px]' />
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredSheets.map((sheet) => (
                <motion.tr
                  key={sheet.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='border-border/30 hover:bg-surface-2/50 transition-colors group'
                >
                  <TableCell>
                    <span className='font-medium text-sm text-foreground group-hover:text-primary transition-colors'>
                      {sheet.name}
                    </span>
                    {sheet.description && (
                      <p className='text-xs text-muted-foreground/70 line-clamp-1 mt-0.5'>
                        {sheet.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <div className='flex flex-wrap gap-1'>
                      {sheet.allTags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className='text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground'
                        >
                          {tag}
                        </span>
                      ))}
                      {(sheet.allTags?.length ?? 0) > 3 && (
                        <span className='text-[10px] text-muted-foreground/60'>
                          +{sheet.allTags.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <div className='flex flex-wrap gap-1'>
                      {sheet.allDifficulties?.map((d) => (
                        <Badge
                          key={d}
                          variant='outline'
                          className={`text-[10px] font-medium border ${d === 'EASY' ? 'difficulty-easy' : d === 'MEDIUM' ? 'difficulty-medium' : 'difficulty-hard'}`}
                        >
                          {d.charAt(0) + d.slice(1).toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className='text-center text-sm text-muted-foreground hidden sm:table-cell'>
                    {sheet.totalProblems}
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <div className='flex items-center gap-2'>
                      {sheet.user?.image && (
                        <img
                          src={sheet.user.image}
                          alt={sheet.user.name ?? ''}
                          className='h-5 w-5 rounded-full object-cover'
                        />
                      )}
                      <span className='text-xs text-muted-foreground'>
                        {sheet.user?.name ?? sheet.user?.username ?? 'Unknown'}
                      </span>
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
                            to={`/sheets/${sheet.id}`}
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
                            to={`/admin/sheets/edit/${sheet.id}`}
                            className='flex items-center gap-2'
                          >
                            <Pencil className='h-3.5 w-3.5' />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className='text-sm text-destructive cursor-pointer flex items-center gap-2'
                          onClick={() => setDeleteTarget(sheet)}
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
        {filteredSheets.length === 0 && (
          <div className='text-center py-12'>
            <BookOpen className='h-10 w-10 text-muted-foreground/30 mx-auto mb-3' />
            <p className='text-muted-foreground text-sm'>No sheets found.</p>
          </div>
        )}
      </motion.div>

      {/* Delete dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
      >
        <AlertDialogContent className='bg-card border-border/50'>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sheet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <span className='font-semibold text-foreground'>
                "{deleteTarget?.name}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='border-border/50'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className='bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2'
            >
              {isDeleting && <Loader2 className='h-3.5 w-3.5 animate-spin' />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
