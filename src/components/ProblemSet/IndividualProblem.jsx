import { useGetIndividualProblem } from '@/hooks/apis/getIndividualProblem/useGetIndividualProblem';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useState, useRef } from 'react';
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
import CodeEditor from './CodeEditor';
import ProblemDescription from './ProblemDescription';
import TestResult from './TestResult';
import { getJudge0LanguageId } from '@/lib/judge0LanguageId/languageUtils';
import { useExecuteProblem } from '@/hooks/apis/runCode/useExecuteCode';
import TestCase from './TestCase';

export const IndividualProblem = () => {
  const { isLoading, isSuccess, error, getIndividualProblemMutation } =
    useGetIndividualProblem();

  const {
    isPending,
    isSuccess: runSuccess,
    error: runError,
    runProblemMutation,
  } = useExecuteProblem();
  const [problemDetails, setProblemDetails] = useState({
    problemId: '',
    title: '',
    problemNumber: '',
    description: '',
    constraints: '',
    examples: [],
    codeSnippets: {},
    testcases: [],
  });
  const problemId = useParams().problemId;

  const [language, setLanguage] = useState('javascript');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [testPanelHeight, setTestPanelHeight] = useState(400);
  const [isResizing, setIsResizing] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  // const [resultRunCode, setResultRunCode] = useState([]);
  const [resultTestCases, setResultTestCases] = useState([]);
  const startY = useRef(0);
  const [code, setCode] = useState('');

  // Test cases state
  const [testcases, setTestcases] = useState([
    { input: '100 200', output: '300' },
    { input: '-500 -600', output: '-1100' },
    { input: '0 0', output: '0' },
  ]);

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
      });

      // Set initial code for current language
      const initialCode =
        response.problem.codeSnippets[language.toLowerCase()] || '';
      setCode(initialCode);
    } catch (error) {
      console.error('Error fetching individual problem:', error);
    }
  };

  useEffect(() => {
    getIndividualProblem(problemId);
  }, [problemId]);

  const handleCodeChange = (value) => {
    if (value !== undefined) {
      console.log("value", value);
      setCode(value);
    }
  };

  // Handle mouse down on the resize handle
  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
    startY.current = e.clientY;
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

      const delta = startY.current - e.clientY;
      const newHeight = Math.max(100, Math.min(600, testPanelHeight + delta));
      setTestPanelHeight(newHeight);
      startY.current = e.clientY;
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
  }, [isResizing, testPanelHeight]);

  const handleLanguageChange = (value) => {
    setLanguage(value);
    // The code will be updated by the CodeEditor component, which will call handleCodeChange
    // with the appropriate snippet for the new language
  };

  const executeCode = async () => {
    const source_code = code;
    const language_id = getJudge0LanguageId(language);
    const stdin = problemDetails.testcases.map((testcase) => testcase.input);
    const expected_outputs = problemDetails.testcases.map(
      (testcase) => testcase.output
    );
    const problemId = problemDetails.problemId;

    try {
      setIsRunning(true);
      const response = await runProblemMutation({
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });
      console.log("run", response)
      setResultTestCases(response.results);
      // setResultRunCode(response);
      setIsRunning(false);
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
          <div className='flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-white'>
            <Zap size={18} />
          </div>
          <Button
            variant='ghost'
            size='sm'
            className='text-zinc-300'
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronLeft size={16} className='mr-1' /> Problem List
          </Button>
          <div className='flex gap-1 text-zinc-500'>
            <Button variant='ghost' size='icon' className='h-7 w-7'>
              <ChevronLeft size={16} />
            </Button>
            <Button variant='ghost' size='icon' className='h-7 w-7'>
              <ChevronRight size={16} />
            </Button>
            <Button variant='ghost' size='icon' className='h-7 w-7'>
              <ExternalLink size={14} />
            </Button>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {!isRunning ? (
            <>
              <Button
                variant='outline'
                size='sm'
                className='gap-2 border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 mr-2'
                onClick={executeCode}
              >
                <Play size={14} />
                Run
              </Button>
              <Button
                size='sm'
                className='gap-2 bg-emerald-600 text-white hover:bg-emerald-700'
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
            {/* <div className='flex items-center gap-1 px-2'>
              <Zap size={16} className='text-amber-500' />
              <span className='text-sm text-amber-500'>0</span>
            </div> */}
          </div>
          {/* <Button
            variant='ghost'
            size='sm'
            className='bg-amber-600/20 text-amber-500'
          >
            Premium
          </Button> */}
        </div>
      </header>

      {/* Main Content */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Problem List Sidebar */}
        {/* {sidebarOpen && (
          <div className='w-80 flex-shrink-0 border-r border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col'>
            <ProblemList />
          </div>
        )} */}

        {/* Left Panel */}
        <div className='flex w-1/2 flex-col border-r border-zinc-800'>
          <Tabs defaultValue='description' className='flex h-full flex-col'>
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
              Submissions content goes here
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
                      <SelectItem value='cpp'>C++</SelectItem>
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
                  key={language} // Add a key to force re-render on language change
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
                  {/* <TabsTrigger
                    value='result'
                    className='data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100'
                  >
                    <div className='flex items-center gap-1.5'>
                      <div className='h-3.5 w-3.5 rounded-sm bg-emerald-600'></div>
                      <span>Test Result</span>
                    </div>
                  </TabsTrigger> */}
                </TabsList>
              </div>
              <TabsContent
                value='testcase'
                className='flex-1 overflow-auto p-0'
              >
                <TestCase
                  testcases={problemDetails.testcases}
                  runSuccess={runSuccess}
                  // resultRunCode={resultRunCode}
                  resultTestCases={resultTestCases}
                  onChange={handleTestCaseChange}
                  onRemove={handleTestCaseRemove}
                  onRun={executeCode}
                  isRunning={isRunning}
                />
              </TabsContent>
              {/* <TabsContent value='result' className='flex-1 overflow-auto p-0'>

              </TabsContent> */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
