import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  Send,
  Clock,
  Settings,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import ProblemList from './ProblemList';

import ProblemDescription from './ProblemDescription';
import TestCase from './TestCase';
import { SubmissionResult } from './SubmissionResult';
import { useGetIndividualProblem } from '@/hooks/apis/getIndividualProblem/useGetIndividualProblem';
import { getJudge0LanguageId } from '@/lib/judge0LanguageId/languageUtils';
import { useExecuteProblem } from '@/hooks/apis/runCode/useExecuteCode';
import { useSubmitCode } from '@/hooks/apis/submitCode/useSubmitCode';
import { CodeEditor } from './CodeEditor';
import { useUserSubmissionSpecificProblem } from '@/hooks/apis/userSubmissionDetails/useUserSubmissionSpecificProblem';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export const IndividualProblem = () => {
  const { isLoading, isSuccess, error, getIndividualProblemMutation } =
    useGetIndividualProblem();

  const {
    isPending,
    isSuccess: runSuccess,
    error: runError,
    runProblemMutation,
  } = useExecuteProblem();

  const {
    isPending: submitPending,
    isSuccess: submitSuccess,
    error: submitError,
    submitProblemMutation,
  } = useSubmitCode();

  const problemId = useParams().problemId;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Use TanStack Query to fetch submission history
  const {
    data: submissionHistoryData,
    isPending: isUserSubmissionPending,
    isSuccess: isUserSubmissionSuccess,
    error: isUserSubmissionError,
    refetch,
  } = useUserSubmissionSpecificProblem(problemId, isAuthenticated);

    // console.log('submissionHistoryData', submissionHistoryData); 

  // Get query client for cache invalidation
  const queryClient = useQueryClient();

  const [problemDetails, setProblemDetails] = useState({
    problemId: '',
    title: '',
    problemNumber: '',
    description: '',
    constraints: '',
    examples: [],
    codeSnippets: {},
    testcases: [],
    companyTags: [],
    difficulty: '',
    tags: [],
  });

  const [activeTab, setActiveTab] = useState('description');
  const [language, setLanguage] = useState('javascript');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [testPanelHeight, setTestPanelHeight] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [resultTestCases, setResultTestCases] = useState([]);
  const [startY, setStartY] = useState(0);
  const [code, setCode] = useState('');
  const [submissionDetails, setSubmissionDetails] = useState(null);

  const navigate = useNavigate();

  // Test cases state
  const [testcases, setTestcases] = useState([
    { input: '100 200', output: '300' },
    { input: '-500 -600', output: '-1100' },
    { input: '0 0', output: '0' },
  ]);

  // console.log("isAuthenticated", isAuthenticated);
  

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem(`problem_${problemId}_language`);
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, [problemId]);

  const getIndividualProblem = async (problemId) => {
    try {
      const response = await getIndividualProblemMutation(problemId);
      setProblemDetails({
        problemId: response.problem.id || '',
        title: response.problem.title || '',
        problemNumber: response.problem.problemNumber || '',
        description: response.problem.description || '',
        constraints: response.problem.constraints || '',
        examples: response.problem.examples || [],
        codeSnippets: response.problem.codeSnippets || {},
        testcases: response.problem.testCases || [],
        difficulty: response.problem.difficulty || '',
        companyTags: response.problem.companyTags || [],
        tags: response.problem.tags || [],
      });

      // Check if there's saved code for this problem and language
      const storageKey = `editor_code_${problemId}_${language.toLowerCase()}`;
      const savedCode = localStorage.getItem(storageKey);

      if (savedCode) {
        setCode(savedCode);
      } else {
        // Set initial code for current language if no saved code exists
        const initialCode =
          response.problem.codeSnippets[language.toLowerCase()] || '';
        setCode(initialCode);

        // Save initial code to localStorage
        if (initialCode) {
          localStorage.setItem(storageKey, initialCode);
        }
      }
    } catch (error) {
      console.error('Error fetching individual problem:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'submissions' && problemId && isAuthenticated) {
      refetch();
    }
  }, [activeTab, problemId, isAuthenticated, refetch]);

  useEffect(() => {
    getIndividualProblem(problemId);
  }, [problemId]);

  const handleCodeChange = (value) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  // Handle mouse down on the resize handle
  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setStartY(e.clientY);
  };

  // Handle test case changes
  const handleTestCaseChange = (index, field, value) => {
    const updatedTestcases = [...testcases];

    // Create a new test case if it doesn't exist
    if (!updatedTestcases[index]) {
      updatedTestcases[index] = { input: '', output: '' };
    }

    // Update the field
    updatedTestcases[index][field] = value;
    setTestcases(updatedTestcases);
  };

  // Handle test case removal
  const handleTestCaseRemove = (index) => {
    const updatedTestcases = testcases.filter((_, i) => i !== index);
    setTestcases(updatedTestcases);
  };

  // Handle mouse move for resizing
  useEffect(() => {
    const handleResize = (e) => {
      if (!isResizing) return;

      const delta = startY - e.clientY;
      const newHeight = Math.max(100, Math.min(600, testPanelHeight + delta));
      setTestPanelHeight(newHeight);
      setStartY(e.clientY);
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, testPanelHeight, startY]);

  const handleLanguageChange = (value) => {
    setLanguage(value);
    localStorage.setItem(`problem_${problemId}_language`, value);

    // The code will be loaded by the CodeEditor component
  };

  const handleRunCode = async () => {
    if(!isAuthenticated) {
      toast.warning('Please login to run the code');
      return ;
    }

    const source_code = code;
    const language_id = getJudge0LanguageId(language);
    const problemId = problemDetails.problemId;

    try {
      setIsRunning(true);
      const response = await runProblemMutation({
        source_code,
        language_id,
        problemId,
      });
      setResultTestCases(response.results);
      setIsRunning(false);
    } catch (error) {
      console.error('Error executing code:', error);
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!isAuthenticated) {
      toast.warning('Please login to submit the code');
      return;
    }
    const source_code = code;
    const language_id = getJudge0LanguageId(language);
    const problemId = problemDetails.problemId;

    try {
      setIsRunning(true);
      const response = await submitProblemMutation({
        source_code,
        language_id,
        problemId,
      });
      console.log('run', response);
      setSubmissionDetails(response.submission);
      setIsRunning(false);
      setActiveTab('submissions');

      queryClient.invalidateQueries(['submissionDetails', problemId]);
    } catch (error) {
      console.error('Error executing code:', error);
      setIsRunning(false);
    }
  };

  return (
    <div className='flex h-screen flex-col bg-zinc-950 text-zinc-100'>
      {/* Header */}
      <header className='flex items-center justify-between border-b border-zinc-800 px-4 py-2'>
        <div className='flex items-center gap-4'>

          <Button
            variant='ghost'
            size='sm'
            className='text-zinc-300'
            onClick={() => navigate('/problem-set')}
          >
            <ChevronLeft size={16} className='mr-1' /> Problem List
          </Button>
          {/* <div className='flex gap-1 text-zinc-500'>
            <Button variant='ghost' size='icon' className='h-7 w-7'>
              <ChevronLeft size={16} />
            </Button>
            <Button variant='ghost' size='icon' className='h-7 w-7'>
              <ChevronRight size={16} />
            </Button>
            <Button variant='ghost' size='icon' className='h-7 w-7'>
              <ExternalLink size={14} />
            </Button>
          </div> */}
        </div>

        <div className='flex items-center gap-2'>
          {!isRunning ? (
            <>
              <Button
                variant='outline'
                size='sm'
                className='gap-2 border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 mr-2'
                onClick={handleRunCode}
              >
                <Play size={14} />
                Run
              </Button>
              <Button
                size='sm'
                className='gap-2 bg-emerald-600 text-white hover:bg-emerald-700'
                onClick={handleSubmitCode}
              >
                <Send size={14} />
                Submit
              </Button>
            </>
          ) : (
            <button
              type='button'
              disabled
              className='flex items-center gap-2 bg-emerald-600 text-white text-sm px-4 py-2 rounded-md hover:bg-emerald-700 cursor-not-allowed opacity-80'
            >
              <svg
                className='animate-spin h-4 w-4 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
              </svg>
              Pending...
            </button>
          )}

          <div className='flex gap-1 text-zinc-500'>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <Clock size={16} />
            </Button>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <Settings size={16} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Left Panel */}
        <div className='flex w-1/2 flex-col border-r border-zinc-800'>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='flex h-full flex-col'
          >
            <TabsList className='h-10 justify-start rounded-none border-b border-zinc-800 bg-zinc-950 px-2'>
              <TabsTrigger
                value='description'
                className='data-[state=active]:bg-zinc-800 text-white'
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value='editorial'
                className='data-[state=active]:bg-zinc-800 text-white'
              >
                Editorial
              </TabsTrigger>
              <TabsTrigger
                value='solutions'
                className='data-[state=active]:bg-zinc-800 text-white'
              >
                Solutions
              </TabsTrigger>
              <TabsTrigger
                value='submissions'
                className='data-[state=active]:bg-zinc-800 text-white'
              >
                Submissions
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value='description'
              className='flex-1 overflow-auto p-0'
            >
              <ProblemDescription problemDetails={problemDetails} />
            </TabsContent>
            <TabsContent value='editorial' className='flex-1 overflow-auto p-4'>
              Editorial content goes here
            </TabsContent>
            <TabsContent value='solutions' className='flex-1 overflow-auto p-4'>
              Solutions content goes here
            </TabsContent>
            <TabsContent
              value='submissions'
              className='flex-1 overflow-auto p-4'
            >
              <SubmissionResult
                submissionDetails={submissionDetails}
                submissionInProgress={submitPending}
                submissionHistory={submissionHistoryData?.submissions || []}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel */}
        <div className='flex w-1/2 flex-col'>
          {/* Code Editor */}
          <div
            className='flex flex-col'
            style={{ height: `calc(100% - ${testPanelHeight}px)` }}
          >
            <Tabs defaultValue='code' className='flex h-full flex-col'>
              <TabsList className='h-10 justify-start rounded-none border-b border-zinc-800 bg-zinc-950 px-2'>
                <TabsTrigger
                  value='code'
                  className='data-[state=active]:bg-zinc-800'
                >
                  Code
                </TabsTrigger>
              </TabsList>
              <TabsContent value='code' className='flex-1 overflow-hidden p-0'>
                <div className='flex h-10 items-center justify-between border-b border-zinc-800 px-4'>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className='h-7 w-40 border-zinc-700 bg-zinc-800 text-sm'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='javascript'>JavaScript</SelectItem>
                      <SelectItem value='python'>Python</SelectItem>
                      <SelectItem value='java'>Java</SelectItem>
                      {/* <SelectItem value='cpp'>C++</SelectItem> */}
                    </SelectContent>
                  </Select>
                  <div className='flex gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-7 w-7 text-zinc-400'
                    >
                      <Settings size={14} />
                    </Button>
                  </div>
                </div>
                <CodeEditor
                  language={language}
                  codeSnippets={problemDetails.codeSnippets}
                  onChange={handleCodeChange}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Resize Handle */}
          <div
            className={`h-2 bg-zinc-800 hover:bg-emerald-600 cursor-ns-resize flex items-center justify-center ${
              isResizing ? 'bg-emerald-600' : ''
            }`}
            onMouseDown={handleResizeStart}
          >
            <div className='w-10 h-1 bg-zinc-600 rounded-full'></div>
          </div>

          {/* Test Cases */}
          <div
            className='border-t border-zinc-800 flex flex-col'
            style={{ height: `${testPanelHeight}px` }}
          >
            <Tabs defaultValue='testcase' className='flex flex-col h-full'>
              <div className='flex items-center justify-between border-b border-zinc-800 bg-zinc-950'>
                <TabsList className='h-10 justify-start rounded-none border-b-0 bg-transparent px-2'>
                  <TabsTrigger
                    value='testcase'
                    className='data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100'
                  >
                    <div className='flex items-center gap-1.5'>
                      <div className='h-3.5 w-3.5 rounded-sm bg-emerald-600'></div>
                      <span>Testcase </span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent
                value='testcase'
                className='flex-1 overflow-auto p-0'
              >
                <TestCase
                  testcases={problemDetails.testcases}
                  runSuccess={runSuccess}
                  resultTestCases={resultTestCases}
                  onChange={handleTestCaseChange}
                  onRemove={handleTestCaseRemove}
                  onRun={handleRunCode}
                  isRunning={isRunning}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
