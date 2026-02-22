import { useState, useMemo, useCallback, useEffect } from 'react';
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
  Check,
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
  Sparkles,
} from 'lucide-react';
import { problems, getProblemWithDefaults } from '@/data/problems';
import CodeEditor, {
  editorThemes,
  type EditorThemeId,
} from '@/components/CodeEditor';
import AIAssistantPanel from '@/components/ai/AIAssistantPanel';
import { Palette } from 'lucide-react';

const languageLabels: Record<string, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
};

// ─── Submission types ────────────────────────────────────────────

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

function generateMockSubmission(lang: string, totalCases: number): Submission {
  const statuses: Submission['status'][] = [
    'Accepted',
    'Wrong Answer',
    'Time Limit Exceeded',
    'Accepted',
  ];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const passed =
    status === 'Accepted' ? totalCases : Math.floor(Math.random() * totalCases);
  const runtime = `${Math.floor(Math.random() * 80) + 2} ms`;
  const memory = `${(Math.random() * 20 + 10).toFixed(1)} MB`;

  return {
    id: crypto.randomUUID(),
    status,
    language: lang,
    runtime,
    runtimePercentile: `${(Math.random() * 40 + 55).toFixed(1)}%`,
    memory,
    memoryPercentile: `${(Math.random() * 40 + 50).toFixed(1)}%`,
    testCasesPassed: passed,
    totalTestCases: totalCases,
    timestamp: new Date(),
  };
}

// Build seed history for problems that are already solved
function buildSeedSubmissions(solved: boolean): Submission[] {
  if (!solved) return [];
  return [
    {
      id: 'seed-2',
      status: 'Wrong Answer',
      language: 'Python',
      runtime: '12 ms',
      runtimePercentile: '62.3%',
      memory: '16.8 MB',
      memoryPercentile: '58.1%',
      testCasesPassed: 14,
      totalTestCases: 20,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'seed-1',
      status: 'Accepted',
      language: 'Python',
      runtime: '4 ms',
      runtimePercentile: '95.2%',
      memory: '15.2 MB',
      memoryPercentile: '87.6%',
      testCasesPassed: 20,
      totalTestCases: 20,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const problemId = parseInt(id || '1', 10);

  const rawProblem = problems.find((p) => p.id === problemId);
  const problem = rawProblem ? getProblemWithDefaults(rawProblem) : null;

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [outputTab, setOutputTab] = useState('testcases');
  const [hasRun, setHasRun] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [editorTheme, setEditorTheme] = useState<EditorThemeId>('algodrill');
  const [submissions, setSubmissions] = useState<Submission[]>(() =>
    buildSeedSubmissions(problem?.solved ?? false),
  );
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(
    null,
  );

  // Reset state when navigating to a different problem
  useEffect(() => {
    setLanguage('python');
    setCode('');
    setActiveTab('description');
    setOutputTab('testcases');
    setHasRun(false);
    setHasSubmitted(false);
    setSubmissions(buildSeedSubmissions(problem?.solved ?? false));
    setActiveSubmission(null);
  }, [problemId]);

  // Set initial code when problem/language changes
  const currentCode = useMemo(() => {
    if (code) return code;
    return problem?.starterCode?.[language] || '';
  }, [problem, language, code]);

  const totalTestCases = problem?.examples?.length || 3;

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode('');
    setHasRun(false);
    setHasSubmitted(false);
  };

  const handleRun = () => {
    setHasRun(true);
    setHasSubmitted(false);
    setOutputTab('output');
  };

  const handleSubmit = useCallback(() => {
    const newSubmission = generateMockSubmission(
      languageLabels[language] || language,
      totalTestCases,
    );
    setSubmissions((prev) => [...prev, newSubmission]);
    setActiveSubmission(newSubmission);
    setHasSubmitted(true);
    setHasRun(true);
    setOutputTab('output');
    setActiveTab('submissions');
  }, [language, totalTestCases]);

  const handleReset = () => {
    setCode('');
    setHasRun(false);
    setHasSubmitted(false);
  };

  // Navigation
  const currentIndex = problems.findIndex((p) => p.id === problemId);
  const prevProblem = currentIndex > 0 ? problems[currentIndex - 1] : null;
  const nextProblem =
    currentIndex < problems.length - 1 ? problems[currentIndex + 1] : null;

  if (!problem) {
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

  const difficultyClass =
    problem.difficulty === 'Easy'
      ? 'difficulty-easy'
      : problem.difficulty === 'Medium'
        ? 'difficulty-medium'
        : 'difficulty-hard';

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col'>
      {/* Top Bar */}
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
              {problem.number}.
            </span>
            <h1 className='text-sm font-semibold truncate max-w-[200px] sm:max-w-none'>
              {problem.title}
            </h1>
            <Badge
              variant='outline'
              className={`text-[10px] font-medium border ${difficultyClass} hidden sm:inline-flex`}
            >
              {problem.difficulty}
            </Badge>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {/* Problem navigation */}
          <div className='hidden sm:flex items-center gap-1'>
            {prevProblem ? (
              <Link to={`/problem/${prevProblem.id}`}>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-7 w-7 text-muted-foreground hover:text-foreground'
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
              </Link>
            ) : (
              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7 text-muted-foreground/30'
                disabled
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>
            )}
            <span className='text-xs text-muted-foreground tabular-nums'>
              {currentIndex + 1}/{problems.length}
            </span>
            {nextProblem ? (
              <Link to={`/problem/${nextProblem.id}`}>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-7 w-7 text-muted-foreground hover:text-foreground'
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </Link>
            ) : (
              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7 text-muted-foreground/30'
                disabled
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            )}
          </div>

          <div className='w-px h-5 bg-border/50 hidden sm:block' />

          {/* Actions */}
          <Button
            variant='ghost'
            size='sm'
            onClick={handleRun}
            className='text-muted-foreground hover:text-foreground gap-1.5 h-7 text-xs'
          >
            <Play className='h-3 w-3' />
            Run
          </Button>
          <Button
            size='sm'
            onClick={handleSubmit}
            className='bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 h-7 text-xs font-medium'
          >
            <Send className='h-3 w-3' />
            Submit
          </Button>
        </div>
      </div>

      {/* Main Split Pane */}
      <ResizablePanelGroup direction='horizontal' className='flex-1'>
        {/* Left Panel - Problem Description */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <div className='h-full flex flex-col bg-background'>
            {/* Description Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='flex-1 flex flex-col'
            >
              <div className='border-b border-border/50 px-4'>
                <TabsList className='bg-transparent h-10 gap-1 p-0'>
                  <TabsTrigger
                    value='description'
                    className='data-[state=active]:bg-surface-2 data-[state=active]:text-foreground text-muted-foreground rounded-md px-3 h-7 text-xs gap-1.5'
                  >
                    <BookOpen className='h-3 w-3' />
                    Description
                  </TabsTrigger>
                  <TabsTrigger
                    value='hints'
                    className='data-[state=active]:bg-surface-2 data-[state=active]:text-foreground text-muted-foreground rounded-md px-3 h-7 text-xs gap-1.5'
                  >
                    <Lightbulb className='h-3 w-3' />
                    Hints
                  </TabsTrigger>
                  <TabsTrigger
                    value='submissions'
                    className='data-[state=active]:bg-surface-2 data-[state=active]:text-foreground text-muted-foreground rounded-md px-3 h-7 text-xs gap-1.5'
                  >
                    <Clock className='h-3 w-3' />
                    Submissions
                  </TabsTrigger>
                  <TabsTrigger
                    value='ai'
                    className='data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-muted-foreground rounded-md px-3 h-7 text-xs gap-1.5'
                  >
                    <Sparkles className='h-3 w-3' />
                    AI
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value='description'
                className='flex-1 overflow-auto m-0 p-0'
              >
                <div className='p-6 space-y-6'>
                  {/* Tags */}
                  <div className='flex flex-wrap gap-1.5'>
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className='text-[11px] px-2 py-0.5 rounded-md bg-surface-3 text-muted-foreground border border-border/30'
                      >
                        {tag}
                      </span>
                    ))}
                    <span className='text-[11px] px-2 py-0.5 rounded-md bg-surface-3 text-muted-foreground border border-border/30 flex items-center gap-1'>
                      <BarChart3 className='h-3 w-3' />
                      {problem.acceptance}% acceptance
                    </span>
                  </div>

                  {/* Description */}
                  <div className='prose prose-invert prose-sm max-w-none'>
                    {problem.description?.split('\n').map((line, i) => {
                      if (!line.trim()) return <br key={i} />;
                      // Simple markdown bold
                      const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
                      return (
                        <p
                          key={i}
                          className='text-sm text-foreground/90 leading-relaxed mb-3'
                        >
                          {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <strong
                                  key={j}
                                  className='text-foreground font-semibold'
                                >
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            if (part.startsWith('`') && part.endsWith('`')) {
                              return (
                                <code
                                  key={j}
                                  className='text-xs font-mono bg-surface-3 text-accent px-1.5 py-0.5 rounded'
                                >
                                  {part.slice(1, -1)}
                                </code>
                              );
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>

                  {/* Examples */}
                  <div className='space-y-4'>
                    {problem.examples?.map((example, i) => (
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

                  {/* Constraints */}
                  {problem.constraints && problem.constraints.length > 0 && (
                    <div>
                      <h3 className='text-sm font-semibold mb-3 text-foreground'>
                        Constraints
                      </h3>
                      <ul className='space-y-1.5'>
                        {problem.constraints.map((c, i) => (
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

              <TabsContent
                value='hints'
                className='flex-1 overflow-auto m-0 p-0'
              >
                <div className='p-6'>
                  <div className='glass-card p-6 text-center'>
                    <Lightbulb className='h-8 w-8 text-amber mx-auto mb-3' />
                    <h3 className='font-semibold mb-1'>Need a hint?</h3>
                    <p className='text-sm text-muted-foreground mb-4'>
                      Try solving it yourself first. Hints will guide you
                      without giving away the solution.
                    </p>
                    <div className='space-y-3'>
                      <button className='w-full text-left p-3 rounded-lg border border-border/40 bg-surface-2/30 hover:bg-surface-2/60 transition-colors group'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>Hint 1</span>
                          <span className='text-xs text-muted-foreground group-hover:text-primary transition-colors'>
                            Click to reveal
                          </span>
                        </div>
                      </button>
                      <button className='w-full text-left p-3 rounded-lg border border-border/40 bg-surface-2/30 hover:bg-surface-2/60 transition-colors group'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>Hint 2</span>
                          <span className='text-xs text-muted-foreground group-hover:text-primary transition-colors'>
                            Click to reveal
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value='submissions'
                className='flex-1 overflow-auto m-0 p-0'
              >
                <div className='p-6 space-y-4'>
                  {/* Submission count */}
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

                  {submissions.length === 0 ? (
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
                                setActiveSubmission(isActive ? null : sub)
                              }
                              className={`rounded-lg border p-3 cursor-pointer transition-all ${
                                isActive
                                  ? 'border-primary/40 bg-primary/5'
                                  : 'border-border/40 bg-surface-1/30 hover:bg-surface-2/40 hover:border-border/60'
                              }`}
                            >
                              {/* Submission row */}
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
                                <div>
                                  <span className='text-muted-foreground block'>
                                    Language
                                  </span>
                                  <span className='text-foreground font-medium'>
                                    {sub.language}
                                  </span>
                                </div>
                                <div>
                                  <span className='text-muted-foreground block'>
                                    Runtime
                                  </span>
                                  <span className='text-foreground font-medium'>
                                    {sub.runtime}
                                  </span>
                                </div>
                                <div>
                                  <span className='text-muted-foreground block'>
                                    Memory
                                  </span>
                                  <span className='text-foreground font-medium'>
                                    {sub.memory}
                                  </span>
                                </div>
                              </div>

                              {/* Expanded details */}
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
                                      {/* Performance bars */}
                                      <div className='grid grid-cols-2 gap-3'>
                                        <div className='rounded-lg border border-border/30 p-2.5 bg-surface-2/20'>
                                          <div className='flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5'>
                                            <Timer className='h-3 w-3' />
                                            Runtime
                                          </div>
                                          <div className='text-sm font-semibold text-foreground'>
                                            {sub.runtime}
                                          </div>
                                          <div className='text-[10px] text-muted-foreground'>
                                            Beats {sub.runtimePercentile}
                                          </div>
                                          <div className='mt-1.5 h-1 bg-surface-3 rounded-full overflow-hidden'>
                                            <div
                                              className='h-full bg-primary rounded-full transition-all'
                                              style={{
                                                width: sub.runtimePercentile,
                                              }}
                                            />
                                          </div>
                                        </div>
                                        <div className='rounded-lg border border-border/30 p-2.5 bg-surface-2/20'>
                                          <div className='flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1.5'>
                                            <Cpu className='h-3 w-3' />
                                            Memory
                                          </div>
                                          <div className='text-sm font-semibold text-foreground'>
                                            {sub.memory}
                                          </div>
                                          <div className='text-[10px] text-muted-foreground'>
                                            Beats {sub.memoryPercentile}
                                          </div>
                                          <div className='mt-1.5 h-1 bg-surface-3 rounded-full overflow-hidden'>
                                            <div
                                              className='h-full bg-accent rounded-full transition-all'
                                              style={{
                                                width: sub.memoryPercentile,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Test cases */}
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
                                            className={`h-1.5 flex-1 rounded-full ${
                                              i < sub.testCasesPassed
                                                ? 'bg-primary'
                                                : 'bg-destructive/60'
                                            }`}
                                          />
                                        ))}
                                      </div>
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

        {/* Right Panel - Code Editor */}
        <ResizablePanel defaultSize={55} minSize={35}>
          <div className='h-full flex flex-col bg-surface-1/30'>
            {/* Editor Header */}
            <div className='flex items-center justify-between px-4 py-2 border-b border-border/50'>
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

            {/* Code Area */}
            <ResizablePanelGroup direction='vertical'>
              <ResizablePanel defaultSize={65} minSize={30}>
                <div className='h-full overflow-hidden'>
                  <CodeEditor
                    value={currentCode}
                    onChange={(val) => setCode(val)}
                    language={language}
                    editorTheme={editorTheme}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle
                withHandle
                className='bg-border/30 hover:bg-primary/30 transition-colors'
              />

              {/* Output Panel */}
              <ResizablePanel defaultSize={35} minSize={15}>
                <div className='h-full flex flex-col'>
                  <div className='border-b border-border/50 px-4'>
                    <div className='flex items-center gap-1 h-9'>
                      <button
                        onClick={() => setOutputTab('testcases')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          outputTab === 'testcases'
                            ? 'bg-surface-2 text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <TestTube2 className='h-3 w-3' />
                        Testcases
                      </button>
                      <button
                        onClick={() => setOutputTab('output')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          outputTab === 'output'
                            ? 'bg-surface-2 text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Terminal className='h-3 w-3' />
                        Output
                        {hasRun && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${hasSubmitted ? 'bg-primary' : 'bg-amber'}`}
                          />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className='flex-1 overflow-auto p-4'>
                    {outputTab === 'testcases' && (
                      <div className='space-y-3'>
                        {problem.examples?.map((example, i) => (
                          <div
                            key={i}
                            className='rounded-lg border border-border/30 p-3 bg-surface-2/20'
                          >
                            <div className='text-xs font-medium text-muted-foreground mb-2'>
                              Case {i + 1}
                            </div>
                            <div className='font-mono text-xs space-y-1'>
                              <div className='text-foreground/80'>
                                {example.input}
                              </div>
                            </div>
                          </div>
                        ))}
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
                        ) : hasSubmitted && activeSubmission ? (
                          <motion.div
                            key={activeSubmission.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='space-y-4'
                          >
                            <div className='flex items-center gap-2'>
                              {activeSubmission.status === 'Accepted' ? (
                                <CheckCircle2 className='h-5 w-5 text-primary' />
                              ) : (
                                <XCircle className='h-5 w-5 text-destructive' />
                              )}
                              <span
                                className={`text-sm font-semibold ${
                                  activeSubmission.status === 'Accepted'
                                    ? 'text-primary'
                                    : 'text-destructive'
                                }`}
                              >
                                {activeSubmission.status}
                              </span>
                            </div>
                            <div className='grid grid-cols-2 gap-3'>
                              <div className='rounded-lg border border-border/30 p-3 bg-surface-2/20'>
                                <div className='flex items-center gap-1.5 text-xs text-muted-foreground mb-1'>
                                  <Timer className='h-3 w-3' />
                                  Runtime
                                </div>
                                <div className='text-sm font-semibold text-foreground'>
                                  {activeSubmission.runtime}
                                </div>
                                <div className='text-[10px] text-muted-foreground'>
                                  Beats {activeSubmission.runtimePercentile}
                                </div>
                              </div>
                              <div className='rounded-lg border border-border/30 p-3 bg-surface-2/20'>
                                <div className='flex items-center gap-1.5 text-xs text-muted-foreground mb-1'>
                                  <Cpu className='h-3 w-3' />
                                  Memory
                                </div>
                                <div className='text-sm font-semibold text-foreground'>
                                  {activeSubmission.memory}
                                </div>
                                <div className='text-[10px] text-muted-foreground'>
                                  Beats {activeSubmission.memoryPercentile}
                                </div>
                              </div>
                            </div>
                            <div className='text-xs text-muted-foreground'>
                              {activeSubmission.testCasesPassed}/
                              {activeSubmission.totalTestCases} test cases
                              passed
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='space-y-3'
                          >
                            {problem.examples?.map((example, i) => (
                              <div
                                key={i}
                                className='rounded-lg border border-border/30 p-3 bg-surface-2/20'
                              >
                                <div className='flex items-center justify-between mb-2'>
                                  <span className='text-xs font-medium text-muted-foreground'>
                                    Case {i + 1}
                                  </span>
                                  <div className='flex items-center gap-1'>
                                    <Check className='h-3 w-3 text-primary' />
                                    <span className='text-xs text-primary'>
                                      Passed
                                    </span>
                                  </div>
                                </div>
                                <div className='font-mono text-xs space-y-1'>
                                  <div>
                                    <span className='text-muted-foreground'>
                                      Output:{' '}
                                    </span>
                                    <span className='text-primary'>
                                      {example.output}
                                    </span>
                                  </div>
                                  <div>
                                    <span className='text-muted-foreground'>
                                      Expected:{' '}
                                    </span>
                                    <span className='text-foreground/80'>
                                      {example.output}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
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
