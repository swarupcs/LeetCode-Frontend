// src/pages/admin/AdminRoadmapsPage.tsx
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
  EyeOff,
  Map,
  Globe,
  Layers,
  Loader2,
} from 'lucide-react';
import { getRoadmapStats } from '@/data/roadmaps';
import { toast } from 'sonner';
import { useGetAllRoadmapsAdmin } from '@/hooks/roadmaps/useGetAllRoadmapsAdmin';
import { useDeleteRoadmap } from '@/hooks/roadmaps/useDeleteRoadmap';
import { useToggleRoadmapPublish } from '@/hooks/roadmaps/useToggleRoadmapPublish';
import type { Roadmap } from '@/types/roadmap.types';

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

function AdminRoadmapsSkeleton() {
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
            <Bone w='w-80' h='h-4' delay={40} />
          </div>
          <Bone w='w-36' h='h-10' rounded='rounded-lg' delay={60} />
        </div>
      </motion.div>

      {/* 3 stat cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='grid grid-cols-3 gap-4 mb-8'
      >
        {[0, 70, 140].map((d) => (
          <div key={d} className='glass-card p-4 text-center'>
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
        <Bone w='flex-1 w-full' h='h-10' rounded='rounded-xl' delay={160} />
        <Bone w='w-[140px]' h='h-10' rounded='rounded-xl' delay={180} />
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
              <TableHead className='text-muted-foreground text-xs font-semibold w-[100px]'>
                Status
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[80px] text-center'>
                Sections
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[80px] text-center'>
                Topics
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[50px]' />
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
                        'w-44',
                        'w-52',
                        'w-36',
                        'w-48',
                        'w-40',
                        'w-32',
                        'w-56',
                        'w-44',
                      ][i]!
                    }
                    h='h-3.5'
                    delay={i * 45}
                  />
                  <Bone
                    w={
                      [
                        'w-64',
                        'w-72',
                        'w-56',
                        'w-68',
                        'w-60',
                        'w-52',
                        'w-76',
                        'w-64',
                      ][i]!
                    }
                    h='h-2.5'
                    delay={i * 45 + 18}
                    className='mt-1.5'
                  />
                </TableCell>
                {/* Status badge */}
                <TableCell className='w-[100px]'>
                  <Bone
                    w='w-16'
                    h='h-5'
                    rounded='rounded-full'
                    delay={i * 45 + 25}
                  />
                </TableCell>
                {/* Sections */}
                <TableCell className='w-[80px] text-center'>
                  <div className='flex items-center justify-center gap-1'>
                    <Bone
                      w='w-3.5'
                      h='h-3.5'
                      rounded='rounded'
                      delay={i * 45 + 30}
                    />
                    <Bone w='w-5' h='h-3.5' delay={i * 45 + 42} />
                  </div>
                </TableCell>
                {/* Topics */}
                <TableCell className='w-[80px] text-center'>
                  <Bone w='w-6 mx-auto' h='h-3.5' delay={i * 45 + 35} />
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

export default function AdminRoadmapsPage() {
  const {
    roadmaps: list,
    isPending: isLoading,
    isError,
  } = useGetAllRoadmapsAdmin();
  const { deleteRoadmapMutation, isPending: isDeleting } = useDeleteRoadmap();
  const { togglePublishMutation, isPending: isToggling } =
    useToggleRoadmapPublish();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Roadmap | null>(null);

  const filtered = useMemo(
    () =>
      list.filter((r) => {
        const matchSearch =
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus =
          statusFilter === 'all' ||
          (statusFilter === 'published' && r.isPublished) ||
          (statusFilter === 'draft' && !r.isPublished);
        return matchSearch && matchStatus;
      }),
    [list, searchQuery, statusFilter],
  );

  const stats = useMemo(() => {
    const published = list.filter((r) => r.isPublished).length;
    return { total: list.length, published, draft: list.length - published };
  }, [list]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRoadmapMutation(deleteTarget.id);
      toast.success('Roadmap deleted', {
        description: `"${deleteTarget.name}" has been removed.`,
      });
    } catch {
      toast.error('Failed to delete roadmap. Please try again.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleTogglePublish = async (roadmap: Roadmap) => {
    try {
      await togglePublishMutation(roadmap.id);
      toast.success(
        roadmap.isPublished ? 'Roadmap unpublished' : 'Roadmap published',
        {
          description: `"${roadmap.name}" is now ${roadmap.isPublished ? 'a draft' : 'live'}.`,
        },
      );
    } catch {
      toast.error('Failed to update roadmap. Please try again.');
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) return <AdminRoadmapsSkeleton />;

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className='p-6 lg:p-8 max-w-7xl'>
        <div className='text-center py-16'>
          <Map className='h-10 w-10 text-muted-foreground/30 mx-auto mb-3' />
          <p className='text-muted-foreground text-sm'>
            Failed to load roadmaps.
          </p>
        </div>
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
            <h1 className='text-2xl font-bold'>Roadmaps</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Create and manage learning roadmaps with topics and resources
            </p>
          </div>
          <Link to='/admin/roadmaps/create'>
            <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10 gap-2'>
              <Plus className='h-4 w-4' />
              Create Roadmap
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='grid grid-cols-3 gap-4 mb-8'
      >
        {[
          { value: stats.total, label: 'Total', color: 'text-foreground' },
          { value: stats.published, label: 'Published', color: 'text-primary' },
          {
            value: stats.draft,
            label: 'Drafts',
            color: 'text-muted-foreground',
          },
        ].map(({ value, label, color }) => (
          <div key={label} className='glass-card p-4 text-center'>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
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
            placeholder='Search roadmaps...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 bg-surface-1 border-border/50 h-10'
          />
        </div>
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
              <TableHead className='text-muted-foreground text-xs font-semibold w-[100px]'>
                Status
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[80px] text-center'>
                Sections
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[80px] text-center'>
                Topics
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[50px]' />
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filtered.map((roadmap: Roadmap) => {
                const s = getRoadmapStats(roadmap);
                return (
                  <motion.tr
                    key={roadmap.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='border-border/30 hover:bg-surface-2/50 transition-colors group'
                  >
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <div>
                          <span className='font-medium text-sm text-foreground group-hover:text-primary transition-colors'>
                            {roadmap.name}
                          </span>
                          <p className='text-xs text-muted-foreground/70 line-clamp-1 mt-0.5'>
                            {roadmap.description}
                          </p>
                        </div>
                        {!roadmap.isPublished && (
                          <EyeOff className='h-3.5 w-3.5 text-muted-foreground/50 shrink-0' />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={`text-[10px] font-medium border cursor-pointer transition-colors ${roadmap.isPublished ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' : 'bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted'}`}
                        onClick={() =>
                          !isToggling && void handleTogglePublish(roadmap)
                        }
                      >
                        {roadmap.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='flex items-center justify-center gap-1 text-sm text-muted-foreground'>
                        <Layers className='h-3.5 w-3.5' />
                        {s.totalSections}
                      </div>
                    </TableCell>
                    <TableCell className='text-center text-sm text-muted-foreground'>
                      {s.totalTopics}
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
                              to={`/roadmaps/${roadmap.slug}`}
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
                              to={`/admin/roadmaps/edit/${roadmap.id}`}
                              className='flex items-center gap-2'
                            >
                              <Pencil className='h-3.5 w-3.5' />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className='text-sm cursor-pointer flex items-center gap-2'
                            onClick={() =>
                              !isToggling && void handleTogglePublish(roadmap)
                            }
                          >
                            {roadmap.isPublished ? (
                              <>
                                <EyeOff className='h-3.5 w-3.5' />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Globe className='h-3.5 w-3.5' />
                                Publish
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className='text-sm text-destructive cursor-pointer flex items-center gap-2'
                            onClick={() => setDeleteTarget(roadmap)}
                          >
                            <Trash2 className='h-3.5 w-3.5' />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>

        {filtered.length === 0 && (
          <div className='text-center py-12'>
            <Map className='h-10 w-10 text-muted-foreground/30 mx-auto mb-3' />
            <p className='text-muted-foreground text-sm'>
              No roadmaps match your search.
            </p>
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
            <AlertDialogTitle>Delete Roadmap</AlertDialogTitle>
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
              onClick={() => void handleDelete()}
              disabled={isDeleting}
              className='bg-destructive hover:bg-destructive/90 text-destructive-foreground'
            >
              {isDeleting ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
