import { useState } from 'react';
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
  FileCode,
  BookOpen,
  Settings2,
  Code2,
  Lightbulb,
  TestTube2,
  CheckCircle2,
} from 'lucide-react';

import { problems } from '@/data/problems';
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

export default function CreateProblemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditing = !!id;

  // Find existing problem for edit mode
  const existingProblem = isEditing
    ? problems.find((p) => p.id === parseInt(id, 10))
    : null;

  // Form state
  const [title, setTitle] = useState(existingProblem?.title || '');
  const [number, setNumber] = useState<number>(
    existingProblem?.number || problems.length + 1,
  );
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(
    existingProblem?.difficulty || 'Easy',
  );
  const [acceptance, setAcceptance] = useState<number>(
    existingProblem?.acceptance || 50,
  );
  const [tags, setTags] = useState<string[]>(existingProblem?.tags || []);
  const [description, setDescription] = useState(
    existingProblem?.description || '',
  );
  const [examples, setExamples] = useState<ExampleItem[]>(
    existingProblem?.examples || [{ input: '', output: '', explanation: '' }],
  );
  const [constraints, setConstraints] = useState<string[]>(
    existingProblem?.constraints || [],
  );
  const [starterCode, setStarterCode] = useState<Record<string, string>>(
    existingProblem?.starterCode || {
      python: '',
      javascript: '',
      java: '',
    },
  );
  const [testCases, setTestCases] = useState<TestCase[]>([
    {
      id: crypto.randomUUID(),
      input: '',
      expectedOutput: '',
      isHidden: false,
      explanation: '',
      code: { python: '', javascript: '', java: '' },
    },
  ]);
  const [solution, setSolution] = useState<SolutionData>({
    code: { python: '', javascript: '', java: '' },
    timeComplexity: '',
    spaceComplexity: '',
    approach: '',
    explanation: '',
  });

  const [activeSection, setActiveSection] = useState('basics');
  const [solutionView, setSolutionView] = useState<'edit' | 'preview'>('edit');

  const canSave = title.trim() && number > 0 && tags.length > 0;

  const handleSave = () => {
    if (!canSave) {
   toast.error('Missing fields', {
     description: 'Please fill in the title, number, and at least one tag.',
   });
      return;
    }

    toast({
      title: isEditing ? 'Problem updated' : 'Problem created',
      description: `"${title}" has been ${isEditing ? 'updated' : 'created'} successfully.`,
    });
    navigate('/admin/problems');
  };

  const handlePreview = () => {
    if (existingProblem) {
      window.open(`/problem/${existingProblem.id}`, '_blank');
    } else {
      toast.error('Save first', {
        description: 'Save the problem before previewing.',
      });
    }
  };

  const difficultyClass =
    difficulty === 'Easy'
      ? 'difficulty-easy'
      : difficulty === 'Medium'
        ? 'difficulty-medium'
        : 'difficulty-hard';

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
                    ? `Editing problem #${existingProblem?.number}`
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
                disabled={!canSave}
                className='bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-medium'
              >
                <Save className='h-3.5 w-3.5' />
                {isEditing ? 'Save Changes' : 'Create Problem'}
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
              {difficulty}
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
                      setDifficulty(v as 'Easy' | 'Medium' | 'Hard')
                    }
                  >
                    <SelectTrigger className='bg-surface-1 border-border/50 h-11'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Easy'>
                        <span className='flex items-center gap-2'>
                          <span className='h-2 w-2 rounded-full bg-[hsl(var(--emerald))]' />
                          Easy
                        </span>
                      </SelectItem>
                      <SelectItem value='Medium'>
                        <span className='flex items-center gap-2'>
                          <span className='h-2 w-2 rounded-full bg-[hsl(var(--amber))]' />
                          Medium
                        </span>
                      </SelectItem>
                      <SelectItem value='Hard'>
                        <span className='flex items-center gap-2'>
                          <span className='h-2 w-2 rounded-full bg-destructive' />
                          Hard
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Acceptance Rate */}
                <div>
                  <Label
                    htmlFor='acceptance'
                    className='text-sm font-semibold mb-2 block'
                  >
                    Acceptance Rate (%)
                  </Label>
                  <Input
                    id='acceptance'
                    type='number'
                    value={acceptance}
                    onChange={(e) =>
                      setAcceptance(
                        Math.min(
                          100,
                          Math.max(0, parseFloat(e.target.value) || 0),
                        ),
                      )
                    }
                    min={0}
                    max={100}
                    step={0.1}
                    className='bg-surface-1 border-border/50 h-11'
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
                  placeholder={`Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have **exactly one solution**...`}
                  className='bg-surface-1 border-border/50 min-h-[300px] text-sm resize-y'
                  spellCheck={false}
                />
                <p className='text-[11px] text-muted-foreground/60 mt-1'>
                  {description.length} characters
                </p>
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
              {/* Edit / Preview toggle */}
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
              {!canSave && 'Fill required fields to save'}
            </div>
            <Button
              onClick={handleSave}
              disabled={!canSave}
              className='bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-medium'
            >
              <Save className='h-4 w-4' />
              {isEditing ? 'Save Changes' : 'Create Problem'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
