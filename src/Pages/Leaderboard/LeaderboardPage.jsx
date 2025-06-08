import Leaderboard from '@/components/Leaderboard/Leaderboard';
import React from 'react'

export const LeaderboardPage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4'>
      <div className='container mx-auto'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2'>
            AlgoDrill Platform
          </h1>
          <p className='text-slate-600 dark:text-slate-400'>
            Compete with developers worldwide and climb the leaderboard!
          </p>
        </div>

        <Leaderboard/>
      </div>
    </div>
  );
}
