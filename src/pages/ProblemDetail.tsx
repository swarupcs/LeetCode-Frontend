// src/pages/ProblemDetailPage.tsx
import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  ArrowLeft,
  Play,
  Send,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Clock,
  BarChart3,
  BookOpen,
  Terminal,
  FileCode,
  TestTube2,
  CheckCircle2,
  XCircle,
  Timer,
  Cpu,
  Hash,
  Loader2,
  Palette,
} from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import {
  editorThemes,
  type EditorThemeId,
} from '@/components/editor/editorThemes';
import AIAssistantPanel from '@/components/ai/AIAssistantPanel';
import { useProblem } from '@/hooks/problems/useGetIndividualProblemDetails';
import { useExecuteProblem } from '@/hooks/problems/useRunProblem';
import { useSubmitCode } from '@/hooks/problems/useSubmitProblem';
import { useUserSubmissionSpecificProblem } from '@/hooks/problems/useUserSubmissionSpecificProblem';
import type {
  TestCaseResult,
  SubmitData,
  ProblemSubmission,
} from '@/types/code.types';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { toast } from 'sonner';

// ─── Constants ────────────────────────────────────────────────────────────────

const languageIdMap: Record<string, number> = {
  python: 71,
  javascript: 63,
  java: 62,
};

const difficultyConfig: Record<string, { class: string; label: string }> = {
  EASY: { class: 'difficulty-easy', label: 'Easy' },
  MEDIUM: { class: 'difficulty-medium', label: 'Medium' },
  HARD: { class: 'difficulty-hard', label: 'Hard' },
};

// ─── Skeleton primitives ──────────────────────────────────────────────────────

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

// ─── Full split-pane skeleton ─────────────────────────────────────────────────

function ProblemDetailSkeleton() {
  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col'>
      {/* ── Top bar skeleton ──────────────────────────────────────────────── */}
      <div className='flex items-center justify-between px-4 py-2 border-b border-border/50 bg-surface-1/50 backdrop-blur-sm shrink-0'>
        {/* Left: back arrow + title */}
        <div className='flex items-center gap-3'>
          <Bone w='w-4' h='h-4' rounded='rounded' />
          <Bone w='w-5' h='h-3.5' rounded='rounded' delay={30} />
          <Bone w='w-48' h='h-4' rounded='rounded-md' delay={50} />
          <Bone w='w-12' h='h-5' rounded='rounded-full' delay={80} />
        </div>
        {/* Right: nav + run + submit */}
        <div className='flex items-center gap-2'>
          <div className='hidden sm:flex items-center gap-1'>
            <Bone w='w-7' h='h-7' rounded='rounded-md' delay={60} />
            <Bone w='w-8' h='h-3' rounded='rounded' delay={80} />
            <Bone w='w-7' h='h-7' rounded='rounded-md' delay={100} />
          </div>
          <div className='w-px h-5 bg-border/40 hidden sm:block' />
          <Bone w='w-16' h='h-7' rounded='rounded-lg' delay={120} />
          <Bone w='w-20' h='h-7' rounded='rounded-lg' delay={140} />
        </div>
      </div>

      {/* ── Split pane ────────────────────────────────────────────────────── */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Left panel — description skeleton */}
        <div className='w-[45%] flex flex-col border-r border-border/30 overflow-hidden'>
          {/* Tab bar */}
          <div className='border-b border-border/50 px-4 h-10 flex items-center gap-2 shrink-0'>
            <Bone w='w-24' h='h-6' rounded='rounded-md' delay={80} />
            <Bone w='w-24' h='h-6' rounded='rounded-md' delay={110} />
          </div>

          {/* Content */}
          <div className='flex-1 overflow-hidden p-6 space-y-5'>
            {/* Tags row */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className='flex flex-wrap gap-1.5'
            >
              {[48, 64, 56, 40, 72].map((w, i) => (
                <Bone
                  key={i}
                  w={`w-[${w}px]`}
                  h='h-5'
                  rounded='rounded-md'
                  delay={160 + i * 30}
                />
              ))}
            </motion.div>

            {/* Description lines */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className='space-y-2.5'
            >
              {[
                'w-full',
                'w-[92%]',
                'w-[85%]',
                'w-full',
                'w-[78%]',
                'w-[88%]',
                'w-[60%]',
              ].map((w, i) => (
                <Bone key={i} w={w} h='h-3.5' delay={200 + i * 25} />
              ))}
            </motion.div>

            {/* Example block */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className='rounded-lg border border-border/40 overflow-hidden'
            >
              <div className='px-4 py-2 bg-surface-2/50 border-b border-border/30'>
                <Bone w='w-20' h='h-3' delay={300} />
              </div>
              <div className='p-4 space-y-2.5'>
                <div className='flex gap-3'>
                  <Bone w='w-12' h='h-3' delay={320} />
                  <Bone w='w-32' h='h-3' delay={340} />
                </div>
                <div className='flex gap-3'>
                  <Bone w='w-14' h='h-3' delay={360} />
                  <Bone w='w-16' h='h-3' delay={380} />
                </div>
                <div className='pt-1 border-t border-border/20 flex gap-3'>
                  <Bone w='w-24' h='h-3' delay={400} />
                  <Bone w='w-48' h='h-3' delay={420} />
                </div>
              </div>
            </motion.div>

            {/* Second example block */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className='rounded-lg border border-border/40 overflow-hidden'
            >
              <div className='px-4 py-2 bg-surface-2/50 border-b border-border/30'>
                <Bone w='w-20' h='h-3' delay={420} />
              </div>
              <div className='p-4 space-y-2.5'>
                <div className='flex gap-3'>
                  <Bone w='w-12' h='h-3' delay={440} />
                  <Bone w='w-40' h='h-3' delay={460} />
                </div>
                <div className='flex gap-3'>
                  <Bone w='w-14' h='h-3' delay={480} />
                  <Bone w='w-20' h='h-3' delay={500} />
                </div>
              </div>
            </motion.div>

            {/* Constraints */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48 }}
              className='space-y-2'
            >
              <Bone w='w-24' h='h-4' rounded='rounded' delay={460} />
              {['w-48', 'w-56', 'w-40'].map((w, i) => (
                <div key={i} className='flex items-center gap-2'>
                  <Bone
                    w='w-1.5'
                    h='h-1.5'
                    rounded='rounded-full'
                    delay={480 + i * 20}
                  />
                  <Bone w={w} h='h-5' rounded='rounded' delay={490 + i * 20} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Resize handle */}
        <div className='w-px bg-border/30' />

        {/* Right panel — editor skeleton */}
        <div className='flex-1 flex flex-col overflow-hidden'>
          {/* Editor header */}
          <div className='flex items-center justify-between px-4 py-2 border-b border-border/50 shrink-0'>
            <div className='flex items-center gap-2'>
              <Bone w='w-3.5' h='h-3.5' rounded='rounded' delay={100} />
              <Bone w='w-28' h='h-7' rounded='rounded-md' delay={120} />
              <div className='w-px h-4 bg-border/40' />
              <Bone w='w-3.5' h='h-3.5' rounded='rounded' delay={140} />
              <Bone w='w-32' h='h-7' rounded='rounded-md' delay={160} />
            </div>
            <Bone w='w-16' h='h-7' rounded='rounded-md' delay={180} />
          </div>

          {/* Code editor area */}
          <div
            className='flex-1 flex flex-col overflow-hidden'
            style={{ flex: '0 0 60%' }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='flex-1 p-4 space-y-2 overflow-hidden'
            >
              {/* Simulated code lines — indentation pattern mimics real code */}
              {[
                { indent: 0, w: 'w-32', delay: 200 },
                { indent: 1, w: 'w-48', delay: 220 },
                { indent: 1, w: 'w-64', delay: 240 },
                { indent: 2, w: 'w-52', delay: 260 },
                { indent: 2, w: 'w-40', delay: 280 },
                { indent: 1, w: 'w-36', delay: 300 },
                { indent: 0, w: 'w-8', delay: 320 },
                { indent: 0, w: 'w-0', delay: 340 }, // blank line
                { indent: 0, w: 'w-44', delay: 360 },
                { indent: 1, w: 'w-56', delay: 380 },
                { indent: 1, w: 'w-72', delay: 400 },
                { indent: 2, w: 'w-60', delay: 420 },
                { indent: 2, w: 'w-48', delay: 440 },
                { indent: 1, w: 'w-16', delay: 460 },
                { indent: 0, w: 'w-8', delay: 480 },
              ].map(({ indent, w, delay }, i) => (
                <div key={i} className='flex items-center gap-3'>
                  {/* Line number */}
                  <Bone
                    w='w-5'
                    h='h-3'
                    rounded='rounded'
                    delay={delay}
                    className='shrink-0 opacity-40'
                  />
                  {/* Indentation spacer */}
                  {indent > 0 && (
                    <div style={{ width: indent * 24 }} className='shrink-0' />
                  )}
                  {/* Code line */}
                  {w !== 'w-0' && (
                    <Bone w={w} h='h-3' rounded='rounded' delay={delay} />
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Resize handle between editor + output */}
          <div className='h-px bg-border/30' />

          {/* Output/testcase panel */}
          <div
            className='flex flex-col overflow-hidden'
            style={{ flex: '0 0 40%' }}
          >
            {/* Tab bar */}
            <div className='flex items-center gap-1 px-4 h-10 border-b border-border/50 shrink-0'>
              <Bone w='w-24' h='h-6' rounded='rounded-md' delay={150} />
              <Bone w='w-20' h='h-6' rounded='rounded-md' delay={180} />
            </div>

            {/* Testcase content */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className='p-4 space-y-4'
            >
              {/* Case tabs */}
              <div className='flex gap-2'>
                {[1, 2, 3].map((n) => (
                  <Bone
                    key={n}
                    w='w-16'
                    h='h-7'
                    rounded='rounded-md'
                    delay={350 + n * 30}
                  />
                ))}
              </div>
              {/* Input label + value */}
              <div className='space-y-1.5'>
                <Bone w='w-10' h='h-3' delay={420} />
                <Bone
                  w='full'
                  h='h-9'
                  rounded='rounded-md'
                  delay={440}
                  className='w-full'
                />
              </div>
              {/* Expected output label + value */}
              <div className='space-y-1.5'>
                <Bone w='w-28' h='h-3' delay={460} />
                <Bone
                  w='full'
                  h='h-9'
                  rounded='rounded-md'
                  delay={480}
                  className='w-full'
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Types & helpers ──────────────────────────────────────────────────────────

interface Submission {
  id: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  language: string;
  runtime: string;
  runtimePercentile: string;
  memory: string;
  memoryPercentile: string;
  testCasesPassed: number;
  totalTestCases: number;
  timestamp: Date;
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TestCaseResultCard({
  result,
  index,
}: {
  result: TestCaseResult;
  index: number;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${result.passed ? 'border-primary/30 bg-primary/5' : 'border-destructive/30 bg-destructive/5'}`}
    >
      <div className='flex items-center justify-between mb-2'>
        <span className='text-xs font-medium text-muted-foreground'>
          Case {index + 1}
        </span>
        <div className='flex items-center gap-1'>
          {result.passed ? (
            <CheckCircle2 className='h-3 w-3 text-primary' />
          ) : (
            <XCircle className='h-3 w-3 text-destructive' />
          )}
          <span
            className={`text-xs font-medium ${result.passed ? 'text-primary' : 'text-destructive'}`}
          >
            {result.passed ? 'Passed' : 'Failed'}
          </span>
        </div>
      </div>
      <div className='font-mono text-xs space-y-1.5'>
        <div className='flex gap-2'>
          <span className='text-muted-foreground shrink-0'>Expected:</span>
          <span className='text-foreground/80'>{result.expected}</span>
        </div>
        <div className='flex gap-2'>
          <span className='text-muted-foreground shrink-0'>Output:</span>
          <span className={result.passed ? 'text-primary' : 'text-destructive'}>
            {result.stdout}
          </span>
        </div>
        {result.stderr && (
          <div className='flex gap-2'>
            <span className='text-muted-foreground shrink-0'>Error:</span>
            <span className='text-destructive'>{result.stderr}</span>
          </div>
        )}
        {result.compile_output && (
          <div className='flex gap-2'>
            <span className='text-muted-foreground shrink-0'>Compile:</span>
            <span className='text-destructive'>{result.compile_output}</span>
          </div>
        )}
      </div>
      {(result.time || result.memory) && (
        <div className='flex gap-3 mt-2 pt-2 border-t border-border/20'>
          {result.time && (
            <span className='text-[10px] text-muted-foreground flex items-center gap-1'>
              <Timer className='h-2.5 w-2.5' />
              {result.time}
            </span>
          )}
          {result.memory && (
            <span className='text-[10px] text-muted-foreground flex items-center gap-1'>
              <Cpu className='h-2.5 w-2.5' />
              {result.memory}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function ResultsPanel({
  results,
  allPassed,
  label,
}: {
  results: TestCaseResult[];
  allPassed: boolean;
  label: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-3'
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {allPassed ? (
            <CheckCircle2 className='h-4 w-4 text-primary' />
          ) : (
            <XCircle className='h-4 w-4 text-destructive' />
          )}
          <span
            className={`text-sm font-semibold ${allPassed ? 'text-primary' : 'text-destructive'}`}
          >
            {label}
          </span>
        </div>
        <span className='text-xs text-muted-foreground'>
          {results.filter((r) => r.passed).length}/{results.length} passed
        </span>
      </div>
      {results.map((result, index) => (
        <TestCaseResultCard key={index} result={result} index={index} />
      ))}
    </motion.div>
  );
}

// ─── Editor state ─────────────────────────────────────────────────────────────

type SupportedLanguage = 'python' | 'javascript' | 'java';

interface EditorPanelState {
  language: SupportedLanguage;
  code: string;
  outputTab: string;
  hasRun: boolean;
  submitData: SubmitData | null;
  activeSubmission: Submission | null;
  activeCase: number;
  newSubmissions: Submission[];
}

const DEFAULT_EDITOR_STATE: EditorPanelState = {
  language: 'python',
  code: '',
  outputTab: 'testcases',
  hasRun: false,
  submitData: null,
  activeSubmission: null,
  activeCase: 0,
  newSubmissions: [],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { problem, isPending, isError } = useProblem(id ?? '');

  const {
    mutateAsync: runProblemMutation,
    isPending: isExecuting,
    runData,
  } = useExecuteProblem();
  const { submitProblem, isPending: isSubmitting } = useSubmitCode();

  const [editorState, setEditorState] =
    useState<EditorPanelState>(DEFAULT_EDITOR_STATE);
  const [editorTheme, setEditorTheme] = useState<EditorThemeId>('algodrill');
  const [activeTab, setActiveTab] = useState('description');

  const user = useSelector((state: RootState) => state.auth);
  const isLoggedIn = user.isAuthenticated;

  const {
    language,
    code,
    outputTab,
    hasRun,
    submitData,
    activeSubmission,
    activeCase,
    newSubmissions,
  } = editorState;

  const set = useCallback(
    (patch: Partial<EditorPanelState>) =>
      setEditorState((prev) => ({ ...prev, ...patch })),
    [],
  );

  const [prevId, setPrevId] = useState<string | undefined>(undefined);
  if (prevId !== id) {
    setPrevId(id);
    setEditorState(DEFAULT_EDITOR_STATE);
    setActiveTab('description');
  }

  const problemId = problem?.id;
  const { submissions: fetchedSubmissions, isPending: isLoadingSubmissions } =
    useUserSubmissionSpecificProblem(problemId ?? '', isLoggedIn);

  const persistedSubmissions = useMemo<Submission[]>(() => {
    return fetchedSubmissions.map((s: ProblemSubmission) => ({
      id: s.id,
      status: s.status as Submission['status'],
      language: s.language,
      runtime: s.runtime,
      runtimePercentile: '—',
      memory: s.memory,
      memoryPercentile: '—',
      testCasesPassed: 0,
      totalTestCases: 0,
      timestamp: new Date(s.date),
    }));
  }, [fetchedSubmissions]);

  const submissions = useMemo<Submission[]>(() => {
    const ids = new Set(persistedSubmissions.map((s) => s.id));
    const fresh = newSubmissions.filter((s) => !ids.has(s.id));
    return [...persistedSubmissions, ...fresh];
  }, [persistedSubmissions, newSubmissions]);

  const currentCode = useMemo(() => {
    if (code) return code;
    return problem?.codeSnippets?.[language] ?? '';
  }, [problem, language, code]);

  const handleLanguageChange = useCallback(
    (lang: string) => {
      set({
        language: lang as SupportedLanguage,
        code: '',
        hasRun: false,
        submitData: null,
      });
    },
    [set],
  );

  const handleRun = useCallback(async () => {
    if (!isLoggedIn) {
      toast.error('You must be logged in to run code.');
      return;
    }
    if (!problemId) return;
    set({ hasRun: true, submitData: null, outputTab: 'output' });
    await runProblemMutation({
      source_code: currentCode,
      language_id: languageIdMap[language] ?? 71,
      problemId,
    });
  }, [isLoggedIn, problemId, currentCode, language, runProblemMutation, set]);

  const handleSubmit = useCallback(async () => {
    if (!isLoggedIn) {
      toast.error('You must be logged in to submit code.');
      return;
    }
    if (!problemId) return;
    set({ hasRun: true, outputTab: 'output', submitData: null });

    const response = await submitProblem({
      source_code: currentCode,
      language_id: languageIdMap[language] ?? 71,
      problemId,
    });

    const sd = response.data;
    if (!sd) return;

    const [passed, total] = (sd.submission.testCasesPassed ?? '0/0')
      .split('/')
      .map(Number);

    const newSubmission: Submission = {
      id: crypto.randomUUID(),
      status: sd.submission.status as Submission['status'],
      language: sd.submission.language,
      runtime: sd.submission.performance.totalTime,
      runtimePercentile: '—',
      memory: sd.submission.performance.totalMemory,
      memoryPercentile: '—',
      testCasesPassed: passed ?? 0,
      totalTestCases: total ?? 0,
      timestamp: new Date(),
    };

    set({
      submitData: sd,
      activeSubmission: newSubmission,
      newSubmissions: [...newSubmissions, newSubmission],
    });
    setActiveTab('submissions');
  }, [
    isLoggedIn,
    problemId,
    currentCode,
    language,
    submitProblem,
    set,
    newSubmissions,
  ]);

  const handleReset = useCallback(() => {
    set({ code: '', hasRun: false, submitData: null, activeSubmission: null });
  }, [set]);

  // ── Loading state — full skeleton ─────────────────────────────────────────
  if (isPending) return <ProblemDetailSkeleton />;

  // ── Error state ───────────────────────────────────────────────────────────
  if (isError || !problem) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-2'>Problem not found</h2>
          <p className='text-muted-foreground mb-4'>
            The problem you're looking for doesn't exist.
          </p>
          <Link to='/problems'>
            <Button variant='outline'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Problems
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const diffClass =
    difficultyConfig[problem.difficulty]?.class ?? 'difficulty-medium';
  const diffLabel =
    difficultyConfig[problem.difficulty]?.label ?? problem.difficulty;

  // ── Loaded ────────────────────────────────────────────────────────────────
  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col'>
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div className='flex items-center justify-between px-4 py-2 border-b border-border/50 bg-surface-1/50 backdrop-blur-sm shrink-0'>
        <div className='flex items-center gap-3'>
          <Link
            to='/problems'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            <ArrowLeft className='h-4 w-4' />
          </Link>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-mono text-muted-foreground'>
              {problem.problemNumber}.
            </span>
            <h1 className='text-sm font-semibold truncate max-w-[200px] sm:max-w-none'>
              {problem.title}
            </h1>
            <Badge
              variant='outline'
              className={`text-[10px] font-medium border ${diffClass} hidden sm:inline-flex`}
            >
              {diffLabel}
            </Badge>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <div className='hidden sm:flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 text-muted-foreground/30'
              disabled
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <span className='text-xs text-muted-foreground tabular-nums'>
              #{problem.problemNumber}
            </span>
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7 text-muted-foreground/30'
              disabled
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
          <div className='w-px h-5 bg-border/50 hidden sm:block' />
          <Button
            variant='ghost'
            size='sm'
            onClick={handleRun}
            disabled={isExecuting || isSubmitting}
            className='text-muted-foreground hover:text-foreground gap-1.5 h-7 text-xs cursor-pointer'
          >
            {isExecuting ? (
              <Loader2 className='h-3 w-3 animate-spin' />
            ) : (
              <Play className='h-3 w-3' />
            )}
            {isExecuting ? 'Running...' : 'Run'}
          </Button>
          <Button
            size='sm'
            onClick={handleSubmit}
            disabled={isSubmitting || isExecuting}
            className='bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 h-7 text-xs font-medium cursor-pointer'
          >
            {isSubmitting ? (
              <Loader2 className='h-3 w-3 animate-spin' />
            ) : (
              <Send className='h-3 w-3' />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>

      {/* ── Main Split Pane ──────────────────────────────────────────────────── */}
      <ResizablePanelGroup className='flex-1'>
        {/* Left panel */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <div className='h-full flex flex-col bg-background overflow-hidden'>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='flex-1 flex flex-col min-h-0'
            >
              <div className='border-b border-border/50 px-4 shrink-0'>
                <TabsList className='bg-transparent h-10 gap-1 p-0'>
                  <TabsTrigger
                    value='description'
                    className='data-[state=active]:bg-surface-2 data-[state=active]:text-foreground text-muted-foreground rounded-md px-3 h-7 text-xs gap-1.5'
                  >
                    <BookOpen className='h-3 w-3' />
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value='submissions'
                    className='data-[state=active]:bg-surface-2 data-[state=active]:text-foreground text-muted-foreground rounded-md px-3 h-7 text-xs gap-1.5'
                  >
                    <Clock className='h-3 w-3' />
                    Submissions
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Description */}
              <TabsContent
                value='description'
                className='flex-1 min-h-0 overflow-auto m-0 p-0'
              >
                <div className='p-6 space-y-6'>
                  <div className='flex flex-wrap gap-1.5'>
                    {(problem.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className='text-[11px] px-2 py-0.5 rounded-md bg-surface-3 text-muted-foreground border border-border/30'
                      >
                        {tag}
                      </span>
                    ))}
                    {(problem as { acceptance?: number }).acceptance !=
                      null && (
                      <span className='text-[11px] px-2 py-0.5 rounded-md bg-surface-3 text-muted-foreground border border-border/30 flex items-center gap-1'>
                        <BarChart3 className='h-3 w-3' />
                        {(problem as { acceptance?: number }).acceptance}%
                        acceptance
                      </span>
                    )}
                  </div>

                  <div className='prose prose-invert prose-sm max-w-none'>
                    {problem.description?.split('\n').map((line, i) => {
                      if (!line.trim()) return <br key={i} />;
                      const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
                      return (
                        <p
                          key={i}
                          className='text-sm text-foreground/90 leading-relaxed mb-3'
                        >
                          {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**'))
                              return (
                                <strong
                                  key={j}
                                  className='text-foreground font-semibold'
                                >
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            if (part.startsWith('`') && part.endsWith('`'))
                              return (
                                <code
                                  key={j}
                                  className='text-xs font-mono bg-surface-3 text-accent px-1.5 py-0.5 rounded'
                                >
                                  {part.slice(1, -1)}
                                </code>
                              );
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>

                  {(problem.examples ?? []).length > 0 && (
                    <div className='space-y-4'>
                      {(problem.examples ?? []).map((example, i) => (
                        <div
                          key={i}
                          className='rounded-lg border border-border/40 overflow-hidden'
                        >
                          <div className='px-4 py-2 bg-surface-2/50 border-b border-border/30'>
                            <span className='text-xs font-semibold text-muted-foreground'>
                              Example {i + 1}
                            </span>
                          </div>
                          <div className='p-4 bg-surface-1/30 space-y-2 font-mono text-sm'>
                            <div className='flex gap-2'>
                              <span className='text-muted-foreground shrink-0'>
                                Input:
                              </span>
                              <span className='text-foreground/90'>
                                {example.input}
                              </span>
                            </div>
                            <div className='flex gap-2'>
                              <span className='text-muted-foreground shrink-0'>
                                Output:
                              </span>
                              <span className='text-primary'>
                                {example.output}
                              </span>
                            </div>
                            {example.explanation && (
                              <div className='flex gap-2 pt-1 border-t border-border/20'>
                                <span className='text-muted-foreground shrink-0'>
                                  Explanation:
                                </span>
                                <span className='text-foreground/70 font-sans text-xs'>
                                  {example.explanation}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {problem.constraints && (
                    <div>
                      <h3 className='text-sm font-semibold mb-3 text-foreground'>
                        Constraints
                      </h3>
                      <ul className='space-y-1.5'>
                        {(Array.isArray(problem.constraints)
                          ? problem.constraints
                          : problem.constraints.split('\n').filter(Boolean)
                        ).map((c, i) => (
                          <li
                            key={i}
                            className='flex items-start gap-2 text-sm text-foreground/80'
                          >
                            <span className='text-primary mt-1.5 text-[6px]'>
                              ●
                            </span>
                            <code className='text-xs font-mono bg-surface-3 text-accent px-1.5 py-0.5 rounded'>
                              {c}
                            </code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Hints */}
              <TabsContent
                value='hints'
                className='flex-1 overflow-auto m-0 p-0'
              >
                <div className='p-6'>
                  <div className='glass-card p-6 text-center'>
                    <Lightbulb className='h-8 w-8 text-amber mx-auto mb-3' />
                    <h3 className='font-semibold mb-1'>Need a hint?</h3>
                    <p className='text-sm text-muted-foreground mb-4'>
                      Try solving it yourself first.
                    </p>
                    <div className='space-y-3'>
                      {[1, 2].map((n) => (
                        <button
                          key={n}
                          className='w-full text-left p-3 rounded-lg border border-border/40 bg-surface-2/30 hover:bg-surface-2/60 transition-colors group'
                        >
                          <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium'>
                              Hint {n}
                            </span>
                            <span className='text-xs text-muted-foreground group-hover:text-primary transition-colors'>
                              Click to reveal
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Submissions */}
              <TabsContent
                value='submissions'
                className='flex-1 overflow-auto m-0 p-0'
              >
                <div className='p-6 space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Hash className='h-3.5 w-3.5 text-muted-foreground' />
                      <span className='text-xs font-medium text-muted-foreground'>
                        {submissions.length} submission
                        {submissions.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {submissions.some((s) => s.status === 'Accepted') && (
                      <div className='flex items-center gap-1.5'>
                        <CheckCircle2 className='h-3.5 w-3.5 text-primary' />
                        <span className='text-xs font-medium text-primary'>
                          Solved
                        </span>
                      </div>
                    )}
                  </div>

                  {isLoadingSubmissions ? (
                    // ── Submissions skeleton ───────────────────────────────
                    <div className='space-y-2'>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className='rounded-lg border border-border/40 p-3 space-y-2'
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <Bone
                                w='w-3.5'
                                h='h-3.5'
                                rounded='rounded-full'
                                delay={i * 60}
                              />
                              <Bone w='w-20' h='h-3.5' delay={i * 60 + 20} />
                            </div>
                            <Bone w='w-12' h='h-3' delay={i * 60 + 40} />
                          </div>
                          <div className='grid grid-cols-3 gap-3'>
                            {[0, 1, 2].map((j) => (
                              <div key={j} className='space-y-1'>
                                <Bone
                                  w='w-12'
                                  h='h-2.5'
                                  delay={i * 60 + j * 20 + 60}
                                />
                                <Bone
                                  w='w-16'
                                  h='h-3'
                                  delay={i * 60 + j * 20 + 80}
                                />
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : submissions.length === 0 ? (
                    <div className='text-center py-12'>
                      <Clock className='h-8 w-8 text-muted-foreground mx-auto mb-3' />
                      <p className='text-sm text-muted-foreground'>
                        No submissions yet
                      </p>
                      <p className='text-xs text-muted-foreground/70 mt-1'>
                        Submit your solution to see results here
                      </p>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      <AnimatePresence initial={false}>
                        {[...submissions].reverse().map((sub, idx) => {
                          const isAccepted = sub.status === 'Accepted';
                          const isActive = activeSubmission?.id === sub.id;
                          const statusColor = isAccepted
                            ? 'text-primary'
                            : sub.status === 'Wrong Answer'
                              ? 'text-destructive'
                              : 'text-amber';
                          const StatusIcon = isAccepted
                            ? CheckCircle2
                            : XCircle;

                          return (
                            <motion.div
                              key={sub.id}
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.25,
                                delay: idx === 0 ? 0.1 : 0,
                              }}
                              onClick={() =>
                                set({ activeSubmission: isActive ? null : sub })
                              }
                              className={`rounded-lg border p-3 cursor-pointer transition-all ${isActive ? 'border-primary/40 bg-primary/5' : 'border-border/40 bg-surface-1/30 hover:bg-surface-2/40 hover:border-border/60'}`}
                            >
                              <div className='flex items-center justify-between mb-1'>
                                <div className='flex items-center gap-2'>
                                  <StatusIcon
                                    className={`h-3.5 w-3.5 ${statusColor}`}
                                  />
                                  <span
                                    className={`text-xs font-semibold ${statusColor}`}
                                  >
                                    {sub.status}
                                  </span>
                                </div>
                                <span className='text-[10px] text-muted-foreground'>
                                  {formatTimeAgo(sub.timestamp)}
                                </span>
                              </div>
                              <div className='grid grid-cols-3 gap-3 text-[11px] mt-2'>
                                {[
                                  { label: 'Language', value: sub.language },
                                  { label: 'Runtime', value: sub.runtime },
                                  { label: 'Memory', value: sub.memory },
                                ].map(({ label, value }) => (
                                  <div key={label}>
                                    <span className='text-muted-foreground block'>
                                      {label}
                                    </span>
                                    <span className='text-foreground font-medium'>
                                      {value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <AnimatePresence>
                                {isActive && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className='overflow-hidden'
                                  >
                                    <div className='mt-3 pt-3 border-t border-border/30 space-y-3'>
                                      <div className='grid grid-cols-2 gap-3'>
                                        {[
                                          {
                                            icon: Timer,
                                            label: 'Runtime',
                                            value: sub.runtime,
                                            percentile: sub.runtimePercentile,
                                            barColor: 'bg-primary',
                                          },
                                          {
                                            icon: Cpu,
                                            label: 'Memory',
                                            value: sub.memory,
                                            percentile: sub.memoryPercentile,
                                            barColor: 'bg-accent',
                                          },
                                        ].map(
                                          ({
                                            icon: Icon,
                                            label,
                                            value,
                                            percentile,
                                            barColor,
                                          }) => (
                                            <div
                                              key={label}
                                              className='rounded-lg border border-border/30 p-2.5 bg-surface-2/20'
                                            >
                                              <div className='flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5'>
                                                <Icon className='h-3 w-3' />
                                                {label}
                                              </div>
                                              <div className='text-sm font-semibold text-foreground'>
                                                {value}
                                              </div>
                                              {percentile !== '—' && (
                                                <>
                                                  <div className='text-[10px] text-muted-foreground'>
                                                    Beats {percentile}
                                                  </div>
                                                  <div className='mt-1.5 h-1 bg-surface-3 rounded-full overflow-hidden'>
                                                    <div
                                                      className={`h-full ${barColor} rounded-full transition-all`}
                                                      style={{
                                                        width: percentile,
                                                      }}
                                                    />
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          ),
                                        )}
                                      </div>
                                      {sub.totalTestCases > 0 && (
                                        <>
                                          <div className='flex items-center justify-between text-[11px]'>
                                            <span className='text-muted-foreground'>
                                              Test cases
                                            </span>
                                            <span
                                              className={
                                                isAccepted
                                                  ? 'text-primary font-medium'
                                                  : 'text-destructive font-medium'
                                              }
                                            >
                                              {sub.testCasesPassed}/
                                              {sub.totalTestCases} passed
                                            </span>
                                          </div>
                                          <div className='flex gap-1'>
                                            {Array.from({
                                              length: sub.totalTestCases,
                                            }).map((_, i) => (
                                              <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full ${i < sub.testCasesPassed ? 'bg-primary' : 'bg-destructive/60'}`}
                                              />
                                            ))}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* AI */}
              <TabsContent
                value='ai'
                className='flex-1 overflow-hidden m-0 p-0'
              >
                <AIAssistantPanel
                  problemTitle={problem.title}
                  code={currentCode}
                  language={language}
                />
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className='bg-border/30 hover:bg-primary/30 transition-colors'
        />

        {/* Right panel */}
        <ResizablePanel defaultSize={55} minSize={35}>
          <div className='h-full flex flex-col bg-surface-1/30 overflow-hidden'>
            {/* Editor Header */}
            <div className='flex items-center justify-between px-4 py-2 border-b border-border/50 shrink-0'>
              <div className='flex items-center gap-2'>
                <FileCode className='h-3.5 w-3.5 text-muted-foreground' />
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className='h-7 w-32 bg-surface-2 border-border/40 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='python'>Python</SelectItem>
                    <SelectItem value='javascript'>JavaScript</SelectItem>
                    <SelectItem value='java'>Java</SelectItem>
                  </SelectContent>
                </Select>
                <div className='w-px h-4 bg-border/40' />
                <Palette className='h-3.5 w-3.5 text-muted-foreground' />
                <Select
                  value={editorTheme}
                  onValueChange={(v) => setEditorTheme(v as EditorThemeId)}
                >
                  <SelectTrigger className='h-7 w-36 bg-surface-2 border-border/40 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {editorThemes.map((th) => (
                      <SelectItem key={th.id} value={th.id}>
                        <span className='flex items-center gap-2'>
                          <span
                            className={`w-2 h-2 rounded-full ${th.dark ? 'bg-muted-foreground' : 'bg-amber'}`}
                          />
                          {th.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleReset}
                className='h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5'
              >
                <RotateCcw className='h-3 w-3' />
                Reset
              </Button>
            </div>

            <ResizablePanelGroup className='flex-1 min-h-0'>
              {/* Code editor */}
              <ResizablePanel defaultSize={60} minSize={30}>
                <div className='h-full w-full overflow-hidden'>
                  <CodeEditor
                    value={currentCode}
                    onChange={(val) => set({ code: val })}
                    language={language}
                    editorTheme={editorTheme}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle
                withHandle
                className='bg-border/30 hover:bg-primary/30 transition-colors'
              />

              {/* Output panel */}
              <ResizablePanel defaultSize={40} minSize={15}>
                <div className='h-full flex flex-col bg-background'>
                  <div className='flex items-center gap-1 px-4 h-10 border-b border-border/50 shrink-0'>
                    {[
                      { key: 'testcases', icon: TestTube2, label: 'Testcases' },
                      { key: 'output', icon: Terminal, label: 'Output' },
                    ].map(({ key, icon: Icon, label }) => (
                      <button
                        key={key}
                        onClick={() => set({ outputTab: key })}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${outputTab === key ? 'bg-surface-2 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        <Icon className='h-3 w-3' />
                        {label}
                        {key === 'output' && hasRun && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${submitData ? 'bg-primary' : 'bg-amber'}`}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className='flex-1 overflow-auto p-4'>
                    {outputTab === 'testcases' && (
                      <div className='space-y-4'>
                        <div className='flex items-center gap-2'>
                          {(problem.testCases ?? []).map((_, i) => (
                            <button
                              key={i}
                              onClick={() => set({ activeCase: i })}
                              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeCase === i ? 'bg-primary text-primary-foreground' : 'bg-surface-2 text-muted-foreground hover:text-foreground'}`}
                            >
                              Case {i + 1}
                            </button>
                          ))}
                        </div>
                        {(problem.testCases ?? [])[activeCase] && (
                          <div className='space-y-3'>
                            {[
                              {
                                label: 'Input',
                                value: (problem.testCases ?? [])[activeCase]!
                                  .input,
                              },
                              {
                                label: 'Expected Output',
                                value: (problem.testCases ?? [])[activeCase]!
                                  .expected,
                              },
                            ].map(({ label, value }) => (
                              <div key={label}>
                                <label className='text-xs font-semibold text-foreground mb-1.5 block'>
                                  {label}
                                </label>
                                <div className='w-full rounded-md border border-border/40 bg-surface-2/40 px-3 py-2 font-mono text-xs text-foreground/90 min-h-[36px] whitespace-pre-wrap'>
                                  {value}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {outputTab === 'output' && (
                      <div>
                        {!hasRun ? (
                          <div className='text-center py-8'>
                            <Terminal className='h-6 w-6 text-muted-foreground mx-auto mb-2' />
                            <p className='text-xs text-muted-foreground'>
                              Run your code to see output
                            </p>
                          </div>
                        ) : isExecuting || isSubmitting ? (
                          <div className='flex flex-col items-center justify-center py-8 gap-2'>
                            <Loader2 className='h-5 w-5 animate-spin text-primary' />
                            <p className='text-xs text-muted-foreground'>
                              {isSubmitting ? 'Submitting...' : 'Executing...'}
                            </p>
                          </div>
                        ) : submitData ? (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='space-y-3'
                          >
                            <div
                              className={`rounded-lg border p-4 ${submitData.allPassed ? 'border-primary/30 bg-primary/5' : 'border-destructive/30 bg-destructive/5'}`}
                            >
                              <div className='flex items-center justify-between mb-3'>
                                <div className='flex items-center gap-2'>
                                  {submitData.allPassed ? (
                                    <CheckCircle2 className='h-5 w-5 text-primary' />
                                  ) : (
                                    <XCircle className='h-5 w-5 text-destructive' />
                                  )}
                                  <span
                                    className={`text-sm font-semibold ${submitData.allPassed ? 'text-primary' : 'text-destructive'}`}
                                  >
                                    {submitData.submission.status}
                                  </span>
                                </div>
                                <span className='text-xs text-muted-foreground'>
                                  {submitData.submission.testCasesPassed} passed
                                </span>
                              </div>
                              <div className='grid grid-cols-2 gap-3'>
                                {[
                                  {
                                    icon: Timer,
                                    label: 'Runtime',
                                    value:
                                      submitData.submission.performance
                                        .totalTime,
                                  },
                                  {
                                    icon: Cpu,
                                    label: 'Memory',
                                    value:
                                      submitData.submission.performance
                                        .totalMemory,
                                  },
                                ].map(({ icon: Icon, label, value }) => (
                                  <div
                                    key={label}
                                    className='rounded-md bg-surface-2/40 px-3 py-2'
                                  >
                                    <div className='flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1'>
                                      <Icon className='h-3 w-3' />
                                      {label}
                                    </div>
                                    <div className='text-sm font-semibold text-foreground'>
                                      {value}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ) : runData ? (
                          <ResultsPanel
                            results={runData.results}
                            allPassed={runData.allPassed}
                            label={
                              runData.allPassed
                                ? 'All Tests Passed'
                                : 'Some Tests Failed'
                            }
                          />
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
