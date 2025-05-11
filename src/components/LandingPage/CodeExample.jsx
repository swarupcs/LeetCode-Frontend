import React from 'react';

export function CodeExample() {
  return (
    <div className='premium-border-gradient w-full h-[420px] overflow-hidden rounded-lg bg-premium-dark p-2 code-glow relative'>
      <div className='absolute top-0 left-0 right-0 h-10 bg-premium-dark flex items-center px-4 gap-1 border-b border-gray-700'>
        <div className='w-3 h-3 rounded-full bg-red-500'></div>
        <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
        <div className='w-3 h-3 rounded-full bg-green-500'></div>
        <div className='ml-4 text-xs text-gray-400'>Problem: Two Sum</div>
      </div>
      <div className='h-full p-4 pt-12 text-xs font-mono overflow-y-auto'>
        <pre className='text-sm'>
          <code className='text-gray-300'>
            {`function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      
      if (map.has(complement)) {
        return [map.get(complement), i];
      }
      map.set(nums[i], i);
    }
    return null;
  }`}
          </code>
        </pre>
        <div className='mt-4 p-2 bg-premium-blue/20 rounded-md'>
          <p className='text-green-400'>✓ All test cases passed!</p>
          <p className='text-xs text-gray-400 mt-1'>
            Runtime: 76ms (faster than 92% of submissions)
          </p>
        </div>
      </div>
    </div>
  );
}

export default CodeExample;
