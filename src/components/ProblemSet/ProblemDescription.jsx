import { Heart, MessageSquare, Share2, Award } from 'lucide-react';

export default function ProblemDescription({ problemDetails }) {
  console.log('problemDetails', problemDetails);
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold text-zinc-100'>
        {problemDetails.title}
      </h1>

      <div className='mt-4 flex flex-wrap gap-2'>
        <div className='rounded-full bg-emerald-900/30 px-3 py-1 text-sm font-medium text-emerald-400'>
          {problemDetails.difficulty}
        </div>
      </div>

      {/* Problem Tags Section */}
      {problemDetails.tags && problemDetails.tags.length > 0 && (
        <div className='mt-4'>
          <h3 className='text-sm font-medium text-zinc-400 mb-2'>Topics:</h3>
          <div className='flex flex-wrap gap-2'>
            {problemDetails.tags.map((tag, index) => (
              <span
                key={index}
                className='inline-flex items-center rounded-md bg-emerald-900/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-400/20'
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {problemDetails.companyTags && problemDetails.companyTags.length > 0 && (
        <div className='mt-4'>
          <h3 className='text-sm font-medium text-zinc-400 mb-2'>
            Asked by Companies:
          </h3>
          <div className='flex flex-wrap gap-2'>
            {problemDetails.companyTags.map((company, index) => (
              <span
                key={index}
                className='inline-flex items-center rounded-md bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20'
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* <div className='mt-6 space-y-4 text-zinc-300'>
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
      </div> */}

      <div className='mt-8'>
        {problemDetails.examples && problemDetails.examples.length > 0 ? (
          problemDetails.examples.map((example, idx) => (
            <div key={idx} className='mt-4'>
              <h3 className='text-md font-semibold text-zinc-100'>
                Example {idx + 1}:
              </h3>
              <div className='mt-1 rounded-md bg-zinc-900 p-4 font-mono'>
                <div>
                  <span className='text-emerald-400'>Input:</span>{' '}
                  {example.input}
                </div>
                <div>
                  <span className='text-emerald-400'>Output:</span>{' '}
                  {example.output}
                </div>
                <div>
                  <span className='text-emerald-400'>Explanation:</span>{' '}
                  {example.explanation}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='mt-2 text-zinc-400'>No examples available.</p>
        )}
      </div>

      <div className='mt-4'>
        <h2 className='text-lg font-semibold text-zinc-100'>Constraints:</h2>
        <div className='mt-1 rounded-md bg-zinc-800 p-4'>
          <p>{problemDetails.constraints}</p>
        </div>
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
