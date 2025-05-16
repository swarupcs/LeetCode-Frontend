import { useGetIndividualProblem } from '@/hooks/apis/getIndividualProblem/useGetIndividualProblem';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useState, useRef} from 'react';
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
import TestCase from '../CreateProblem/TestCase';
import CodeEditor from './CodeEditor';
import ProblemDescription from './ProblemDescription';
import TestResult from './TestResult';

export const IndividualProblem = () => {

  const { isLoading, isSuccess, error, getIndividualProblemMutation } = useGetIndividualProblem();

  const [problemDetails, setProblemDetails] = useState({
    problemId: '',
    title: '',
    description: '',
    constraints: '',
    examples: [],
    codeSnippets: {},
    testcases: [],
  });
  const problemId = useParams().problemId ;
  console.log('Problem ID:', problemId);

  const getIndividualProblem = async (problemId) => {
    try {
      const response = await getIndividualProblemMutation(problemId);
      console.log('Individual Problem:', response.problem);
      setProblemDetails({
        problemId: response.problem.id || '',
        title: response.problem.title || '',
        description: response.problem.description || '',
        constraints: response.problem.constraints || '',
        examples: response.problem.examples || [],
        codeSnippets: response.problem.codeSnippets || {},
        testcases: response.problem.testcases || [],
      });

      // console.log('response.problem.id', response.problem.id);
      // console.log('response.problem.title', response.problem.title);
      // console.log('response.problem.description', response.problem.description);
    } catch (error) {
      console.error('Error fetching individual problem:', error);
    }
  }

  useEffect(() => {
    getIndividualProblem(problemId);
  }, []);

  const [language, setLanguage] = useState('javascript');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [testPanelHeight, setTestPanelHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const startY = useRef(0);

  // Handle mouse down on the resize handle
  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
    startY.current = e.clientY;
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
          <Button
            variant='outline'
            size='sm'
            className='gap-2 border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
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
          <div className='flex gap-1 text-zinc-500'>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <Clock size={16} />
            </Button>
            <Button variant='ghost' size='icon' className='h-8 w-8'>
              <Settings size={16} />
            </Button>
            <div className='flex items-center gap-1 px-2'>
              <Zap size={16} className='text-amber-500' />
              <span className='text-sm text-amber-500'>0</span>
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
            className='bg-amber-600/20 text-amber-500'
          >
            Premium
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className='flex flex-1 overflow-hidden'>
        {/* Problem List Sidebar */}
        {sidebarOpen && (
          <div className='w-80 flex-shrink-0 border-r border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col'>
            <ProblemList />
          </div>
        )}

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
              {/* {console.log("problemDetails1", problemDetails)} */}
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
                  <Select value={language} onValueChange={setLanguage}>
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
                <CodeEditor language={language} codeSnippets={problemDetails.codeSnippets} />
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
                      <span>Testcase</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value='result'
                    className='data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100'
                  >
                    <div className='flex items-center gap-1.5'>
                      <div className='h-3.5 w-3.5 rounded-sm bg-emerald-600'></div>
                      <span>Test Result</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent
                value='testcase'
                className='flex-1 overflow-auto p-0'
              >
                <TestCase testcases={problemDetails.testcases} />
              </TabsContent>
              <TabsContent value='result' className='flex-1 overflow-auto p-0'>
                {/* <TestResult /> */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
