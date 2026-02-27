import { useState, useEffect } from 'react';
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
import {
  ArrowLeft,
  Save,
  Eye,
  BookOpen,
  Settings2,
  Code2,
  Lightbulb,
  TestTube2,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import {
  ExampleEditor,
  type ExampleItem,
} from '@/components/admin/ExampleEditor';
import { StarterCodeEditor } from '@/components/admin/StarterCodeEditor';
import { TagInput } from '@/components/admin/TagInput';
import { ConstraintEditor } from '@/components/admin/ConstraintEditor';
import {
  TestCaseEditor,
  type TestCase,
} from '@/components/admin/TestCaseEditor';
import {
  SolutionEditor,
  type SolutionData,
} from '@/components/admin/SolutionEditor';
import { SolutionPreview } from '@/components/admin/SolutionPreview';
import { toast } from 'sonner';
import { useCreateProblem } from '@/hooks/problems/useCreateProblem';
import { useUpdateProblem } from '@/hooks/problems/useUpdateProblem';
import { useProblem } from '@/hooks/problems/useGetIndividualProblemDetails';

// ─── helpers ────────────────────────────────────────────────────────────────

const DEFAULT_TEST_CASE: TestCase = {
  id: crypto.randomUUID(),
  input: '',
  expectedOutput: '',
  isHidden: false,
  explanation: '',
  code: { python: '', javascript: '', java: '' },
};

const DEFAULT_SOLUTION: SolutionData = {
  code: { python: '', javascript: '', java: '' },
  timeComplexity: '',
  spaceComplexity: '',
  approach: '',
  explanation: '',
};

const DEFAULT_STARTER_CODE = { python: '', javascript: '', java: '' };

export default function CreateProblemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditing = !!id;

  // ─── hooks ────────────────────────────────────────────────────────────────
  const { createProblemMutation, isPending: isCreating } = useCreateProblem();
  const { updateProblemMutation, isPending: isUpdating } = useUpdateProblem();
  const { problem: existingProblem, isLoading: isProblemLoading } = useProblem(
    isEditing ? id : '',
  );

  const isPending = isCreating || isUpdating;

  // ─── form state ───────────────────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState<number>(1);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD'>(
    'EASY',
  );
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [constraints, setConstraints] = useState<string[]>([]);
  const [hints, setHints] = useState('');
  const [editorial, setEditorial] = useState('');
  const [companyTags, setCompanyTags] = useState<string[]>([]);
  const [examples, setExamples] = useState<ExampleItem[]>([
    { input: '', output: '', explanation: '' },
  ]);
  const [starterCode, setStarterCode] =
    useState<Record<string, string>>(DEFAULT_STARTER_CODE);

  const [referenceSolutions, setReferenceSolutions] = useState<
    Record<string, string>
  >({
    python: '',
    javascript: '',
    java: '',
  });

  const [testCases, setTestCases] = useState<TestCase[]>([DEFAULT_TEST_CASE]);
  const [solution, setSolution] = useState<SolutionData>(DEFAULT_SOLUTION);
  const [activeSection, setActiveSection] = useState('basics');
  const [solutionView, setSolutionView] = useState<'edit' | 'preview'>('edit');

  // ─── populate form when editing ───────────────────────────────────────────
  useEffect(() => {
    if (isEditing && existingProblem) {
      setTitle(existingProblem.title ?? '');
      setNumber(existingProblem.problemNumber ?? 1);
      setDifficulty(existingProblem.difficulty ?? 'EASY');
      setTags(existingProblem.tags ?? []);
      setDescription(existingProblem.description ?? '');
      setConstraints(
        existingProblem.constraints
          ? existingProblem.constraints.split('\n').filter(Boolean)
          : [],
      );
      setHints(existingProblem.hints ?? '');
      setEditorial(existingProblem.editorial ?? '');
      setCompanyTags(existingProblem.companyTags ?? []);
      setExamples(
        Array.isArray(existingProblem.examples) &&
          existingProblem.examples.length > 0
          ? (existingProblem.examples as ExampleItem[])
          : [{ input: '', output: '', explanation: '' }],
      );
      setStarterCode(
        (existingProblem.codeSnippets as Record<string, string>) ??
          DEFAULT_STARTER_CODE,
      );
      setReferenceSolutions(
        (existingProblem.referenceSolutions as Record<string, string>) ?? {
          python: '',
          javascript: '',
          java: '',
        },
      );
      if (
        Array.isArray(existingProblem.testCases) &&
        existingProblem.testCases.length > 0
      ) {
        setTestCases(
          existingProblem.testCases.map((tc) => ({
            id: crypto.randomUUID(),
            input: tc.input,
            expectedOutput: tc.expected,
            isHidden: false,
            explanation: '',
            code: { python: '', javascript: '', java: '' },
          })),
        );
      }
    }
  }, [isEditing, existingProblem]);

  // ─── derived ──────────────────────────────────────────────────────────────
  const canSave = title.trim() && number > 0 && tags.length > 0 && !isPending;

  const difficultyClass =
    difficulty === 'EASY'
      ? 'difficulty-easy'
      : difficulty === 'MEDIUM'
        ? 'difficulty-medium'
        : 'difficulty-hard';

  // ─── handlers ─────────────────────────────────────────────────────────────
  const buildPayload = () => ({
    problemNumber: number,
    problem: {
      title,
      description,
      difficulty,
      constraints: constraints.join('\n'),
      tags,
      hints: hints || undefined,
      editorial: editorial || undefined,
      companyTags,
      examples,
      codeSnippets: starterCode,
      referenceSolutions,
    },
    testCases: testCases.map((tc) => ({
      input: tc.input,
      expected: tc.expectedOutput,
    })),
  });

  const handleSave = async () => {
    if (!canSave) {
      toast.error('Missing fields', {
        description: 'Please fill in the title, number, and at least one tag.',
      });
      return;
    }

    try {
      if (isEditing && id) {
        await updateProblemMutation({ problemId: id, ...buildPayload() });
        toast.success('Problem updated', {
          description: `"${title}" has been updated successfully.`,
        });
      } else {
        await createProblemMutation(buildPayload());
        toast.success('Problem created', {
          description: `"${title}" has been created successfully.`,
        });
      }
      navigate('/admin/problems');
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(
        isEditing ? 'Failed to update problem' : 'Failed to create problem',
        {
          description:
            error?.message ?? 'Something went wrong. Please try again.',
        },
      );
    }
  };

  const handlePreview = () => {
    if (isEditing && id) {
      window.open(`/problem/${id}`, '_blank');
    } else {
      toast.warning('Save first', {
        description: 'Save the problem before previewing.',
      });
    }
  };

  // ─── loading state ────────────────────────────────────────────────────────
  if (isEditing && isProblemLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  // ─── render ───────────────────────────────────────────────────────────────
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
                to='/admin/problems'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <ArrowLeft className='h-5 w-5' />
              </Link>
              <div>
                <h1 className='text-2xl font-bold'>
                  {isEditing ? 'Edit Problem' : 'Create New Problem'}
                </h1>
                <p className='text-sm text-muted-foreground'>
                  {isEditing
                    ? `Editing problem #${existingProblem?.problemNumber}`
                    : 'Fill in all details to add a new problem'}
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
                    : 'Create Problem'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Live preview banner */}
        {title && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className='mb-6 glass-card p-4 flex items-center gap-3'
          >
            <span className='font-mono text-sm text-muted-foreground'>
              #{number}
            </span>
            <span className='font-semibold text-foreground'>{title}</span>
            <Badge
              variant='outline'
              className={`text-[10px] font-medium border ${difficultyClass}`}
            >
              {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
            </Badge>
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

        {/* Section Tabs */}
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
                value='description'
                className='data-[state=active]:bg-surface-3 data-[state=active]:text-foreground text-muted-foreground text-xs gap-1.5 px-4 h-8'
              >
                <BookOpen className='h-3.5 w-3.5' />
                Description
              </TabsTrigger>
              <TabsTrigger
                value='examples'
                className='data-[state=active]:bg-surface-3 data-[state=active]:text-foreground text-muted-foreground text-xs gap-1.5 px-4 h-8'
              >
                <Lightbulb className='h-3.5 w-3.5' />
                Examples
              </TabsTrigger>
              <TabsTrigger
                value='code'
                className='data-[state=active]:bg-surface-3 data-[state=active]:text-foreground text-muted-foreground text-xs gap-1.5 px-4 h-8'
              >
                <Code2 className='h-3.5 w-3.5' />
                Starter Code
              </TabsTrigger>
              <TabsTrigger
                value='testcases'
                className='data-[state=active]:bg-surface-3 data-[state=active]:text-foreground text-muted-foreground text-xs gap-1.5 px-4 h-8'
              >
                <TestTube2 className='h-3.5 w-3.5' />
                Test Cases
              </TabsTrigger>
              <TabsTrigger
                value='solution'
                className='data-[state=active]:bg-surface-3 data-[state=active]:text-foreground text-muted-foreground text-xs gap-1.5 px-4 h-8'
              >
                <CheckCircle2 className='h-3.5 w-3.5' />
                Solution
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Basics */}
          <TabsContent value='basics'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className='glass-card p-6 space-y-6'
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Title */}
                <div className='md:col-span-2'>
                  <Label
                    htmlFor='title'
                    className='text-sm font-semibold mb-2 block'
                  >
                    Problem Title <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='e.g., Two Sum'
                    className='bg-surface-1 border-border/50 h-11 text-base'
                    maxLength={100}
                  />
                  <p className='text-[11px] text-muted-foreground/60 mt-1'>
                    {title.length}/100 characters
                  </p>
                </div>

                {/* Number */}
                <div>
                  <Label
                    htmlFor='number'
                    className='text-sm font-semibold mb-2 block'
                  >
                    Problem Number <span className='text-destructive'>*</span>
                  </Label>
                  <Input
                    id='number'
                    type='number'
                    value={number}
                    onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
                    min={1}
                    className='bg-surface-1 border-border/50 h-11'
                  />
                </div>

                {/* Difficulty */}
                <div>
                  <Label className='text-sm font-semibold mb-2 block'>
                    Difficulty <span className='text-destructive'>*</span>
                  </Label>
                  <Select
                    value={difficulty}
                    onValueChange={(v) =>
                      setDifficulty(v as 'EASY' | 'MEDIUM' | 'HARD')
                    }
                  >
                    <SelectTrigger className='bg-surface-1 border-border/50 h-11'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='EASY'>
                        <span className='flex items-center gap-2'>
                          <span className='h-2 w-2 rounded-full bg-[hsl(var(--emerald))]' />
                          Easy
                        </span>
                      </SelectItem>
                      <SelectItem value='MEDIUM'>
                        <span className='flex items-center gap-2'>
                          <span className='h-2 w-2 rounded-full bg-[hsl(var(--amber))]' />
                          Medium
                        </span>
                      </SelectItem>
                      <SelectItem value='HARD'>
                        <span className='flex items-center gap-2'>
                          <span className='h-2 w-2 rounded-full bg-destructive' />
                          Hard
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Tags */}
                <div className='md:col-span-2'>
                  <TagInput
                    tags={companyTags}
                    onChange={setCompanyTags}
                    label='Company Tags'
                    placeholder='Add company (e.g. Google, Amazon)...'
                  />
                </div>
              </div>

              {/* Tags */}
              <TagInput tags={tags} onChange={setTags} />
            </motion.div>
          </TabsContent>

          {/* Description */}
          <TabsContent value='description'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className='glass-card p-6 space-y-6'
            >
              <div>
                <Label className='text-sm font-semibold mb-2 block'>
                  Problem Description
                </Label>
                <p className='text-[11px] text-muted-foreground/60 mb-3'>
                  Supports basic markdown: **bold**, `code`, newlines for
                  paragraphs.
                </p>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Given an array of integers...'
                  className='bg-surface-1 border-border/50 min-h-[300px] text-sm resize-y'
                  spellCheck={false}
                />
                <p className='text-[11px] text-muted-foreground/60 mt-1'>
                  {description.length} characters
                </p>
              </div>

              {/* Hints */}
              <div>
                <Label className='text-sm font-semibold mb-2 block'>
                  Hints
                  <span className='text-muted-foreground font-normal ml-1'>
                    (optional)
                  </span>
                </Label>
                <Textarea
                  value={hints}
                  onChange={(e) => setHints(e.target.value)}
                  placeholder='Add hints to help users...'
                  className='bg-surface-1 border-border/50 min-h-[100px] text-sm resize-y'
                  spellCheck={false}
                />
              </div>

              {/* Constraints */}
              <ConstraintEditor
                constraints={constraints}
                onChange={setConstraints}
              />
            </motion.div>
          </TabsContent>

          {/* Examples */}
          <TabsContent value='examples'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className='glass-card p-6'
            >
              <ExampleEditor examples={examples} onChange={setExamples} />
            </motion.div>
          </TabsContent>

          {/* Starter Code */}
          <TabsContent value='code'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className='glass-card p-6'
            >
              <StarterCodeEditor
                starterCode={starterCode}
                onChange={setStarterCode}
              />
            </motion.div>
          </TabsContent>

          {/* Test Cases */}
          <TabsContent value='testcases'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className='glass-card p-6'
            >
              <TestCaseEditor testCases={testCases} onChange={setTestCases} />
            </motion.div>
          </TabsContent>

          {/* Solution */}
          <TabsContent value='solution'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className='glass-card p-6'
            >
              <div className='flex items-center gap-2 mb-6'>
                <div className='bg-surface-2 border border-border/50 rounded-lg p-0.5 flex'>
                  <button
                    onClick={() => setSolutionView('edit')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      solutionView === 'edit'
                        ? 'bg-surface-3 text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => setSolutionView('preview')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      solutionView === 'preview'
                        ? 'bg-surface-3 text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Eye className='h-3 w-3 inline mr-1' />
                    Preview
                  </button>
                </div>
              </div>

              {solutionView === 'edit' ? (
                <SolutionEditor solution={solution} onChange={setSolution} />
              ) : (
                <SolutionPreview solution={solution} />
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
          <Link to='/admin/problems'>
            <Button variant='ghost' className='text-muted-foreground'>
              Cancel
            </Button>
          </Link>
          <div className='flex items-center gap-3'>
            <div className='text-xs text-muted-foreground hidden sm:block'>
              {!canSave && !isPending && 'Fill required fields to save'}
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
                  : 'Create Problem'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
