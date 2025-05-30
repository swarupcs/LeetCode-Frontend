import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, RefreshCw, Check, X, Clock, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TestCase({
  testcases = [],
  resultTestCases = [], // use this prop for result data
  runSuccess,
  onChange,
  onRemove,
  onRun,
  isRunning = false,
  results = [],
}) {
  const [activeCase, setActiveCase] = useState(0);
  const [showResults, setShowResults] = useState(false);
  // Cache the initial number of test cases on first mount
  const initialTestCaseCount = useRef(testcases.length);

  console.log('resultTestCases', resultTestCases);

  // Reset active case when testcases change
  useEffect(() => {
    if (testcases && testcases.length > 0) {
      if (activeCase >= testcases.length) {
        setActiveCase(0);
      }
    } else {
      setActiveCase(0);
    }
  }, [testcases, activeCase]);

  // Show results when they become available
  useEffect(() => {
    setShowResults(runSuccess && resultTestCases && resultTestCases.length > 0);
  }, [runSuccess, resultTestCases]);

  const handleRunCode = () => {
    if (onRun) {
      onRun();
    }
  };

  const addNewCase = () => {
    if (!testcases) return;

    const newIndex = testcases.length;
    if (onChange) {
      onChange(newIndex, 'input', '');
      onChange(newIndex, 'output', '');
      setActiveCase(newIndex);
    }
  };

  // Safely get the active test case with fallback to empty object
  const activeTestCase =
    testcases && testcases.length > 0 && activeCase < testcases.length
      ? testcases[activeCase]
      : { input: '', output: '' };

  // Get the active result from resultTestCases
  const getActiveResult = () => {
    if (!showResults || !resultTestCases || resultTestCases.length === 0) {
      return null;
    }

    // Locate the result that matches the current active case (assuming testCase numbers are 1-indexed)
    const testCase = resultTestCases.find(
      (tc) => tc.testCase === activeCase + 1
    );

    if (!testCase) return null;

    return {
      status: testCase.passed ? 'accepted' : 'wrong',
      output: testCase.stdout || '',
      runtime: testCase.time || '',
      memory: testCase.memory || '',
      expected: testCase.expected || '',
    };
  };

  const activeResult = getActiveResult();

  const getStatusColor = (status) => {
    if (!status) return '';
    return status === 'accepted' ? 'text-emerald-500' : 'text-red-500';
  };

  // Get status badge using resultTestCases
  const getTestCaseStatus = (index) => {
    if (!showResults || !resultTestCases || resultTestCases.length === 0) {
      return null;
    }
    const testCase = resultTestCases.find((tc) => tc.testCase === index + 1);
    if (!testCase) return null;
    return testCase.passed ? 'accepted' : 'wrong';
  };

  // Determine if the active test case is a user-added (new) case
  const isUserAdded = activeCase >= initialTestCaseCount.current;

  if (!testcases || testcases.length === 0) {
    return (
      <div className='flex flex-col h-full bg-premium-darker text-white'>
        <div className='p-4 flex flex-col h-full'>
          <Card className='bg-premium-darker border border-premium-blue shadow-lg premium-border-gradient flex-1'>
            <CardContent className='p-4 flex items-center justify-center'>
              <div className='text-center'>
                <p className='text-zinc-400 mb-4'>No test cases available</p>
                <Button
                  variant='outline'
                  onClick={() => {
                    if (onChange) {
                      onChange(0, 'input', '');
                      onChange(0, 'output', '');
                    }
                  }}
                  className='border-premium-blue text-premium-blue hover:bg-premium-blue/10'
                >
                  Add Test Case
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full bg-premium-darker text-white'>
      <div className='p-4 flex flex-col h-full'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-1 text-zinc-400'>
              <div className='h-5 w-5 min-w-5 flex items-center justify-center'>
                {showResults &&
                  activeResult &&
                  activeResult.status === 'wrong' && (
                    <X size={16} className='text-red-500' />
                  )}
                {showResults &&
                  activeResult &&
                  activeResult.status === 'accepted' && (
                    <Check size={16} className='text-emerald-500' />
                  )}
              </div>
              <span>Test Case</span>
            </div>
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-zinc-400 hover:text-white'
            onClick={handleRunCode}
            disabled={isRunning}
          >
            <RefreshCw size={16} className={isRunning ? 'animate-spin' : ''} />
          </Button>
        </div>

        <div className='flex gap-2 mb-4 overflow-x-auto pb-1'>
          {testcases.map((testcase, index) => {
            const status = getTestCaseStatus(index);
            const hasIcon = showResults && status;

            return (
              <Button
                key={index}
                variant={activeCase === index ? 'default' : 'outline'}
                size='sm'
                className={cn(
                  'h-8 relative premium-button',
                  activeCase === index
                    ? 'bg-premium-blue text-white border-premium-blue'
                    : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-premium-blue',
                  hasIcon ? 'pr-6' : ''
                )}
                onClick={() => setActiveCase(index)}
              >
                <span>Case {index + 1}</span>
                {hasIcon && (
                  <div
                    className={cn(
                      'absolute right-1 top-1 flex items-center justify-center',
                      'h-4 w-4'
                    )}
                  >
                    {status === 'wrong' && (
                      <X size={14} className='text-red-500' />
                    )}
                    {status === 'accepted' && (
                      <Check size={14} className='text-emerald-500' />
                    )}
                  </div>
                )}
              </Button>
            );
          })}
          {/* <Button
            variant='ghost'
            size='sm'
            className='h-8 text-zinc-400 hover:text-white'
            onClick={addNewCase}
          >
            +
          </Button> */}
        </div>

        <Card className='bg-premium-darker border border-premium-blue shadow-lg border-gray-700 flex-1 overflow-auto'>
          <CardContent className='p-4 space-y-4'>
            {showResults && activeResult && activeResult.status && (
              <div className='flex items-center justify-between mb-2'>
                <div
                  className={cn(
                    'text-lg font-medium',
                    getStatusColor(activeResult.status)
                  )}
                >
                  {activeResult.status === 'wrong'
                    ? 'Wrong Answer'
                    : 'Accepted'}
                </div>
                {activeResult.runtime && (
                  <div className='flex items-center gap-4 text-sm text-zinc-400'>
                    <div className='flex items-center gap-1'>
                      <Clock size={14} />
                      <span>{activeResult.runtime}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Database size={14} />
                      <span>{activeResult.memory}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-amber-100'>
                Input
              </label>
              <Input
                value={activeTestCase.input || ''}
                onChange={(e) =>
                  onChange && onChange(activeCase, 'input', e.target.value)
                }
                placeholder='Enter test case input'
                className='bg-zinc-900 border-zinc-700 text-white'
              />
            </div>

            <div className='space-y-2 text-amber-100'>
              <label className='block text-sm font-medium'>
                Expected Output
              </label>
              <Input
                value={activeTestCase.expected || ''}
                onChange={(e) =>
                  onChange && onChange(activeCase, 'output', e.target.value)
                }
                placeholder='Enter expected output'
                className='bg-zinc-900 border-zinc-700 text-white'
              />
            </div>

            {showResults && activeResult && activeResult.status === 'wrong' && (
              <div className='grid grid-cols-2 gap-4 mt-4'>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium text-amber-100'>
                    Your Output
                  </label>
                  <div className='rounded bg-zinc-900 p-3 font-mono text-sm text-zinc-300 border border-zinc-800'>
                    {activeResult.output || 'No output'}
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='block text-sm font-medium'>
                    Expected Output
                  </label>
                  <div className='rounded bg-zinc-900 p-3 font-mono text-sm text-zinc-300 border border-zinc-800'>
                    {activeResult.expected ||
                      activeTestCase.output ||
                      'No expected output'}
                  </div>
                </div>
              </div>
            )}

            {showResults &&
              activeResult &&
              activeResult.status === 'accepted' && (
                <div className='space-y-2 mt-4'>
                  <label className='block text-sm font-medium text-amber-100'>
                    Output
                  </label>
                  <div className='rounded bg-zinc-900 p-3 font-mono text-sm text-zinc-300 border border-zinc-800'>
                    {activeResult.output || 'No output'}
                  </div>
                </div>
              )}

            {/* {onRemove && (
              <div className='flex justify-end mt-4'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    onRemove(activeCase);
                    setActiveCase(Math.max(0, activeCase - 1));
                  }}
                  disabled={!isUserAdded}
                  className='h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10'
                >
                  <Trash2 size={16} className='mr-1' />
                  Remove Test Case
                </Button>
              </div>
            )} */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
