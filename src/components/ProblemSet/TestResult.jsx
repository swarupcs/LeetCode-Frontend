import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function TestResult() {
  const [activeCase, setActiveCase] = useState(1);
  const [testResults, setTestResults] = useState([
    {
      id: 1,
      status: 'Accepted',
      runtime: '0 ms',
      input: '[1,1,2,3,3,4,4,8,8]',
      output: '2',
      expected: '2',
    },
    {
      id: 2,
      status: 'Accepted',
      runtime: '0 ms',
      input: '[3,3,7,7,10,11,11]',
      output: '10',
      expected: '10',
    },
  ]);

  return (
    <div className='flex flex-col h-full p-4 overflow-auto'>
      <div className='flex items-center gap-2 mb-4'>
        <div className='text-emerald-500 font-medium flex items-center gap-1.5'>
          <Check size={16} />
          <span>Accepted</span>
        </div>
        <div className='text-zinc-400 text-sm'>
          Runtime: {testResults.find((r) => r.id === activeCase)?.runtime}
        </div>
      </div>

      <div className='flex flex-wrap gap-2 mb-4'>
        {testResults.map((result) => (
          <Button
            key={result.id}
            variant={activeCase === result.id ? 'outline' : 'ghost'}
            size='sm'
            className={`h-8 ${
              activeCase === result.id
                ? 'border-zinc-700 bg-zinc-800 text-zinc-300'
                : 'text-zinc-400'
            }`}
            onClick={() => setActiveCase(result.id)}
          >
            <div className='h-2 w-2 rounded-full bg-emerald-500 mr-2'></div>
            Case {result.id}
          </Button>
        ))}
      </div>

      <div className='space-y-4 flex-1'>
        <div>
          <div className='text-sm text-zinc-500 mb-1'>Input</div>
          <div className='rounded bg-zinc-900 p-3 font-mono text-sm'>
            <div className='text-zinc-500'>nums =</div>
            <div className='text-zinc-300'>
              {testResults.find((r) => r.id === activeCase)?.input}
            </div>
          </div>
        </div>

        <div>
          <div className='text-sm text-zinc-500 mb-1'>Output</div>
          <div className='rounded bg-zinc-900 p-3 font-mono text-sm text-zinc-300'>
            {testResults.find((r) => r.id === activeCase)?.output}
          </div>
        </div>

        <div>
          <div className='text-sm text-zinc-500 mb-1'>Expected</div>
          <div className='rounded bg-zinc-900 p-3 font-mono text-sm text-zinc-300'>
            {testResults.find((r) => r.id === activeCase)?.expected}
          </div>
        </div>
      </div>
    </div>
  );
}
