import { Heart, MessageSquare, Share2, Award } from 'lucide-react';

export default function ProblemDescription({ problemDetails }) {
  console.log("problemDetails", problemDetails);
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold text-zinc-100'>
        {problemDetails.title}
      </h1>

      <div className='mt-4 flex flex-wrap gap-2'>
        <div className='rounded-full bg-emerald-900/30 px-3 py-1 text-sm font-medium text-emerald-400'>
          Medium
        </div>
        <button className='flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-sm font-medium text-zinc-300 hover:bg-zinc-700'>
          <span>Topics</span>
        </button>
        <button className='flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-sm font-medium text-zinc-300 hover:bg-zinc-700'>
          <span>Companies</span>
        </button>
      </div>

      <div className='mt-6 space-y-4 text-zinc-300'>
        <p>{problemDetails.description}</p>

        <p>
          Return{' '}
          <span className='italic'>
            the single element that appears only once
          </span>
          .
        </p>

        <p>
          Your solution must run in{' '}
          <code className='rounded bg-zinc-800 px-1 py-0.5 text-emerald-400'>
            O(log n)
          </code>{' '}
          time and{' '}
          <code className='rounded bg-zinc-800 px-1 py-0.5 text-emerald-400'>
            O(1)
          </code>{' '}
          space.
        </p>
      </div>

      <div className='mt-8'>
        <h2 className='text-lg font-semibold text-zinc-100'>Example 1:</h2>
        <div className='mt-2 rounded-md bg-zinc-900 p-4 font-mono'>
          <div>
            <span className='text-emerald-400'>Input:</span> nums =
            [1,1,2,3,3,4,4,8,8]
          </div>
          <div>
            <span className='text-emerald-400'>Output:</span> 2
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <h2 className='text-lg font-semibold text-zinc-100'>Example 2:</h2>
        <div className='mt-2 rounded-md bg-zinc-900 p-4 font-mono'>
          <div>
            <span className='text-emerald-400'>Input:</span> nums =
            [3,3,7,7,10,11,11]
          </div>
          <div>
            <span className='text-emerald-400'>Output:</span> 10
          </div>
        </div>
      </div>

      <div className='mt-4'>
        <h2 className='text-lg font-semibold text-zinc-100'>Constraints:</h2>
        <p className='mt-1'>{problemDetails.constraints}</p>
      </div>

      <div className='mt-8 flex items-center gap-4'>
        <button className='flex items-center gap-1 text-zinc-400 hover:text-zinc-200'>
          <Heart size={16} />
          <span>12K</span>
        </button>
        <button className='flex items-center gap-1 text-zinc-400 hover:text-zinc-200'>
          <MessageSquare size={16} />
          <span>157</span>
        </button>
        <button className='flex items-center gap-1 text-zinc-400 hover:text-zinc-200'>
          <Share2 size={16} />
        </button>
        <div className='flex items-center gap-1 text-emerald-400'>
          <Award size={16} />
          <span className='text-sm'>92 Online</span>
        </div>
      </div>
    </div>
  );
}
