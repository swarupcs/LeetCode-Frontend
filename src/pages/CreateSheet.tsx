// src/pages/admin/CreateSheetPage.tsx  (also used for Edit via useParams id)
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Eye, Settings2, Layers, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { TagInput } from '@/components/admin/TagInput';
import { TopicEditor } from '@/components/admin/TopicEditor';
import type { SheetTopic } from '@/types/sheet.types';
import type { Problem } from '@/types/problem.types';
import { useCreateSheet } from '@/hooks/sheets/useCreateSheet';
import { useUpdateSheet } from '@/hooks/sheets/useUpdateSheet';
import { useGetSheetById } from '@/hooks/sheets/useGetSheetById';
import { useProblems } from '@/hooks/problems/useGetAllProblems';

type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Mixed';

export default function CreateSheetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { createSheetMutation, isPending: isCreating } = useCreateSheet();
  const { updateSheetMutation, isPending: isUpdating } = useUpdateSheet();
  // useProblems returns data.data (Problem[]) via the hook's unwrap
  const { problems, isPending: isProblemsLoading } = useProblems();
  const { sheet: existingSheet, isPending: isSheetLoading } = useGetSheetById(
    isEditing ? id : undefined
  );

  const isPending = isCreating || isUpdating;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [tags, setTags] = useState<string[]>([]);
  const [topics, setTopics] = useState<SheetTopic[]>(() => {
    if (existingSheet?.problems?.length) {
      return [
        {
          name: 'Problems',
          problemIds: existingSheet.problems.map((p) => p.problemId),
        },
      ];
    }
    return [{ name: '', problemIds: [] }];
  });
  const [activeSection, setActiveSection] = useState('basics');



  const totalProblems = useMemo(
    () => new Set(topics.flatMap((t) => t.problemIds)).size,
    [topics]
  );

  const canSave =
    !!name.trim() && topics.some((t) => t.name.trim()) && !isPending;

  const handleSave = async () => {
    if (!canSave) {
      toast.error('Missing fields', {
        description: 'Please provide a name and at least one named topic.',
      });
      return;
    }

    try {
      if (isEditing && id) {
        await updateSheetMutation({
          sheetId: id,
          payload: { name, description, topics },
        });
        toast.success('Sheet updated', {
          description: `"${name}" has been updated successfully.`,
        });
      } else {
        await createSheetMutation({ name, description, topics });
        toast.success('Sheet created', {
          description: `"${name}" has been created successfully.`,
        });
      }
      navigate('/admin/sheets');
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(
        isEditing ? 'Failed to update sheet' : 'Failed to create sheet',
        {
          description:
            error?.message ?? 'Something went wrong. Please try again.',
        }
      );
    }
  };

  const handlePreview = () => {
    if (isEditing && id) {
      window.open(`/sheets/${id}`, '_blank');
    } else {
      toast.warning('Save first', {
        description: 'Save the sheet before previewing.',
      });
    }
  };

  const difficultyClass =
    difficulty === 'Easy'
      ? 'difficulty-easy'
      : difficulty === 'Medium'
        ? 'difficulty-medium'
        : difficulty === 'Hard'
          ? 'difficulty-hard'
          : 'border-primary/30 text-primary';

  if (isEditing && isSheetLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Link
                to='/admin/sheets'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <ArrowLeft className='h-5 w-5' />
              </Link>
              <div>
                <h1 className='text-2xl font-bold'>
                  {isEditing ? 'Edit Sheet' : 'Create New Sheet'}
                </h1>
                <p className='text-sm text-muted-foreground'>
                  {isEditing
                    ? `Editing "${existingSheet?.name ?? ''}"`
                    : 'Organize problems into a structured practice sheet'}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              {isEditing && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handlePreview}
                  className='border-border/50 gap-1.5'
                >
                  <Eye className='h-3.5 w-3.5' />
                  Preview
                </Button>
              )}
              <Button
                size='sm'
                onClick={handleSave}
                disabled={!canSave || isPending}
                className='bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-medium'
              >
                {isPending ? (
                  <Loader2 className='h-3.5 w-3.5 animate-spin' />
                ) : (
                  <Save className='h-3.5 w-3.5' />
                )}
                {isPending
                  ? 'Saving...'
                  : isEditing
                    ? 'Save Changes'
                    : 'Create Sheet'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Live preview banner */}
        {name && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className='mb-6 glass-card p-4 flex items-center gap-3'
          >
            <span className='font-semibold text-foreground'>{name}</span>
            <Badge
              variant='outline'
              className={`text-[10px] font-medium border ${difficultyClass}`}
            >
              {difficulty}
            </Badge>
            <span className='text-xs text-muted-foreground'>
              {topics.filter((t) => t.name.trim()).length} topics ·{' '}
              {totalProblems} problems
            </span>
            {tags.length > 0 && (
              <div className='hidden sm:flex gap-1 ml-2'>
                {tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className='text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TabsList className='bg-surface-1 border border-border/50 h-10 mb-6'>
              <TabsTrigger
                value='basics'
                className='data-[state=active]:bg-surface-3 data-[state=active]:text-foreground text-muted-foreground text-xs gap-1.5 px-4 h-8'
              >
                <Settings2 className='h-3.5 w-3.5' />
                Basics
              </TabsTrigger>
              <TabsTrigger
                value='topics'
                className='data-[state=active]:bg-surface-3 data-[state=active]:text-foreground text-muted-foreground text-xs gap-1.5 px-4 h-8'
              >
                <Layers className='h-3.5 w-3.5' />
                Topics & Problems
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Basics Tab */}
          <TabsContent value='basics'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className='glass-card p-6 space-y-6'
            >
              <div>
                <Label
                  htmlFor='name'
                  className='text-sm font-semibold mb-2 block'
                >
                  Sheet Name <span className='text-destructive'>*</span>
                </Label>
                <Input
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Striver's SDE Sheet"
                  className='bg-surface-1 border-border/50 h-11 text-base'
                  maxLength={100}
                />
                <p className='text-[11px] text-muted-foreground/60 mt-1'>
                  {name.length}/100 characters
                </p>
              </div>

              <div>
                <Label
                  htmlFor='desc'
                  className='text-sm font-semibold mb-2 block'
                >
                  Description
                </Label>
                <Textarea
                  id='desc'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='A brief description of the sheet and its purpose...'
                  className='bg-surface-1 border-border/50 min-h-[100px] text-sm resize-y'
                  maxLength={500}
                />
                <p className='text-[11px] text-muted-foreground/60 mt-1'>
                  {description.length}/500 characters
                </p>
              </div>

              <div>
                <Label className='text-sm font-semibold mb-2 block'>
                  Difficulty Level
                </Label>
                <Select
                  value={difficulty}
                  onValueChange={(v) => setDifficulty(v as Difficulty)}
                >
                  <SelectTrigger className='bg-surface-1 border-border/50 h-11 w-full max-w-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['Easy', 'Medium', 'Hard', 'Mixed'] as const).map((d) => (
                      <SelectItem key={d} value={d}>
                        <span className='flex items-center gap-2'>
                          <span
                            className={`h-2 w-2 rounded-full ${
                              d === 'Easy'
                                ? 'bg-[hsl(var(--emerald))]'
                                : d === 'Medium'
                                  ? 'bg-[hsl(var(--amber))]'
                                  : d === 'Hard'
                                    ? 'bg-destructive'
                                    : 'bg-primary'
                            }`}
                          />
                          {d}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <TagInput tags={tags} onChange={setTags} />
            </motion.div>
          </TabsContent>

          {/* Topics & Problems Tab */}
          <TabsContent value='topics'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className='glass-card p-6'
            >
              {isProblemsLoading ? (
                <div className='flex items-center justify-center py-16'>
                  <Loader2 className='h-6 w-6 animate-spin text-primary' />
                </div>
              ) : (
                <TopicEditor
                  topics={topics}
                  onChange={setTopics}
                  problems={problems as Problem[]}
                />
              )}
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Bottom action bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className='mt-6 flex items-center justify-between'
        >
          <Link to='/admin/sheets'>
            <Button variant='ghost' className='text-muted-foreground'>
              Cancel
            </Button>
          </Link>
          <div className='flex items-center gap-3'>
            <div className='text-xs text-muted-foreground hidden sm:block'>
              {!canSave &&
                !isPending &&
                'Add a name and at least one topic to save'}
            </div>
            <Button
              onClick={handleSave}
              disabled={!canSave || isPending}
              className='bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-medium'
            >
              {isPending ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Save className='h-4 w-4' />
              )}
              {isPending
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Create Sheet'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
