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
  BookOpen,
  Layers,
  Globe,
} from 'lucide-react';
import {
  sheets as initialSheets,
  getSheetStats,
  type Sheet,
} from '@/data/sheets';
import { toast } from 'sonner';

export default function AdminSheetsPage() {

  const [sheetList, setSheetList] = useState<Sheet[]>(initialSheets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<Sheet | null>(null);

  const sheetsWithStats = useMemo(
    () => sheetList.map((s) => ({ ...s, stats: getSheetStats(s) })),
    [sheetList],
  );

  const filteredSheets = useMemo(() => {
    return sheetsWithStats.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && s.isPublished) ||
        (statusFilter === 'draft' && !s.isPublished);
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, sheetsWithStats, statusFilter]);

  const stats = useMemo(() => {
    const published = sheetList.filter((s) => s.isPublished).length;
    const draft = sheetList.length - published;
    const easy = sheetList.filter((s) => s.difficulty === 'Easy').length;
    const medium = sheetList.filter((s) => s.difficulty === 'Medium').length;
    const hard = sheetList.filter((s) => s.difficulty === 'Hard').length;
    const mixed = sheetList.filter((s) => s.difficulty === 'Mixed').length;
    return {
      total: sheetList.length,
      published,
      draft,
      easy,
      medium,
      hard,
      mixed,
    };
  }, [sheetList]);

  const handleDelete = () => {
    if (!deleteTarget) return;
    setSheetList((prev) => prev.filter((s) => s.id !== deleteTarget.id));
toast.success('Sheet deleted', {
  description: `"${deleteTarget.name}" has been removed.`,
});
    setDeleteTarget(null);
  };

  const handleTogglePublish = (sheet: Sheet) => {
    setSheetList((prev) =>
      prev.map((s) =>
        s.id === sheet.id ? { ...s, isPublished: !s.isPublished } : s,
      ),
    );
    toast.success(sheet.isPublished ? 'Sheet unpublished' : 'Sheet published', {
      description: `"${sheet.name}" is now ${sheet.isPublished ? 'a draft' : 'live'}.`,
    });
  };

  const getDifficultyBadge = (difficulty: string) => {
    const cls =
      difficulty === 'Easy'
        ? 'difficulty-easy'
        : difficulty === 'Medium'
          ? 'difficulty-medium'
          : difficulty === 'Hard'
            ? 'difficulty-hard'
            : 'border-primary/30 text-primary';
    return (
      <Badge
        variant='outline'
        className={`text-[10px] font-medium border ${cls}`}
      >
        {difficulty}
      </Badge>
    );
  };

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

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-8'
      >
        <div className='glass-card p-4 text-center'>
          <div className='text-2xl font-bold text-foreground'>
            {stats.total}
          </div>
          <div className='text-xs text-muted-foreground mt-1'>Total Sheets</div>
        </div>
        <div className='glass-card p-4 text-center'>
          <div className='text-2xl font-bold text-primary'>
            {stats.published}
          </div>
          <div className='text-xs text-muted-foreground mt-1'>Published</div>
        </div>
        <div className='glass-card p-4 text-center'>
          <div className='text-2xl font-bold text-muted-foreground'>
            {stats.draft}
          </div>
          <div className='text-xs text-muted-foreground mt-1'>Drafts</div>
        </div>
        <div className='glass-card p-4 text-center'>
          <div className='text-2xl font-bold text-[hsl(var(--emerald))]'>
            {stats.mixed + stats.easy}
          </div>
          <div className='text-xs text-muted-foreground mt-1'>Easy/Mixed</div>
        </div>
        <div className='glass-card p-4 text-center col-span-2 md:col-span-1'>
          <div className='text-2xl font-bold text-destructive'>
            {stats.hard + stats.medium}
          </div>
          <div className='text-xs text-muted-foreground mt-1'>Med/Hard</div>
        </div>
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
            placeholder='Search by name, description, or tag...'
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

      {/* Sheets Table */}
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
                Difficulty
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[100px]'>
                Status
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold hidden md:table-cell'>
                Tags
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[80px] text-center'>
                Topics
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[100px] text-center hidden sm:table-cell'>
                Problems
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
                    <div className='flex items-center gap-2'>
                      <div>
                        <span className='font-medium text-sm text-foreground group-hover:text-primary transition-colors'>
                          {sheet.name}
                        </span>
                        <p className='text-xs text-muted-foreground/70 line-clamp-1 mt-0.5'>
                          {sheet.description}
                        </p>
                      </div>
                      {!sheet.isPublished && (
                        <EyeOff className='h-3.5 w-3.5 text-muted-foreground/50 shrink-0' />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getDifficultyBadge(sheet.difficulty)}</TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={`text-[10px] font-medium border cursor-pointer transition-colors ${
                        sheet.isPublished
                          ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                          : 'bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted'
                      }`}
                      onClick={() => handleTogglePublish(sheet)}
                    >
                      {sheet.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <div className='flex flex-wrap gap-1'>
                      {sheet.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className='text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground'
                        >
                          {tag}
                        </span>
                      ))}
                      {sheet.tags.length > 3 && (
                        <span className='text-[10px] text-muted-foreground/60'>
                          +{sheet.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className='flex items-center justify-center gap-1 text-sm text-muted-foreground'>
                      <Layers className='h-3.5 w-3.5' />
                      {sheet.topics.length}
                    </div>
                  </TableCell>
                  <TableCell className='text-center text-sm text-muted-foreground hidden sm:table-cell'>
                    {sheet.stats.total}
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
                          className='text-sm cursor-pointer flex items-center gap-2'
                          onClick={() => handleTogglePublish(sheet)}
                        >
                          {sheet.isPublished ? (
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
            <p className='text-muted-foreground text-sm'>
              No sheets match your search.
            </p>
          </div>
        )}
      </motion.div>

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
