import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function TestCase() {
  const [activeCase, setActiveCase] = useState(1);
  const [testCases, setTestCases] = useState([
    { id: 1, value: '[1,1,2,3,3,4,4,8,8]' },
    { id: 2, value: '[3,3,7,7,10,11,11]' },
  ]);

  const addNewCase = () => {
    const newId = Math.max(...testCases.map((c) => c.id), 0) + 1;
    setTestCases([...testCases, { id: newId, value: '[]' }]);
    setActiveCase(newId);
  };

  const updateTestCase = (value) => {
    setTestCases(
      testCases.map((c) => (c.id === activeCase ? { ...c, value } : c))
    );
  };

  return (
    <div className='flex flex-col h-full p-4'>
      <div className='flex flex-wrap gap-2 mb-4'>
        {testCases.map((testCase) => (
          <Button
            key={testCase.id}
            variant={activeCase === testCase.id ? 'outline' : 'ghost'}
            size='sm'
            className={`h-8 ${
              activeCase === testCase.id
                ? 'border-zinc-700 bg-zinc-800 text-zinc-300'
                : 'text-zinc-400'
            }`}
            onClick={() => setActiveCase(testCase.id)}
          >
            Case {testCase.id}
          </Button>
        ))}
        <Button
          variant='ghost'
          size='sm'
          className='h-8 text-zinc-400'
          onClick={addNewCase}
        >
          +
        </Button>
      </div>

      <div className='text-sm text-zinc-500 mb-1'>nums =</div>
      <div className='relative flex-1'>
        <Textarea
          value={testCases.find((c) => c.id === activeCase)?.value || ''}
          onChange={(e) => updateTestCase(e.target.value)}
          className='h-full w-full resize-none border-zinc-700 bg-zinc-900 font-mono text-sm text-zinc-300'
        />
      </div>
    </div>
  );
}
