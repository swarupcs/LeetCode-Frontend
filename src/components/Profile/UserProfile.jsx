import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserDetails } from './UserDetails';
import { UserStats } from './UserStats';
import { SolvedProblems } from './SolvedProblems';

export function UserProfile({
  userSubmissionDetails,
  usersDetails,
  userProblemStats,
}) {
  const [activeTab, setActiveTab] = useState('details');

  // console.log("userProblemStats", userProblemStats);

  return (
    <Tabs
      defaultValue='details'
      className='w-full'
      onValueChange={setActiveTab}
    >
      <TabsList className='grid w-full grid-cols-3 bg-emerald-500'>
        <TabsTrigger
          value='details'
          className={
            activeTab === 'details'
              ? 'custom-active-tab'
              : 'bg-emerald-300 text-gray-700'
          }
        >
          Profile Details
        </TabsTrigger>
        <TabsTrigger
          value='stats'
          className={
            activeTab === 'stats'
              ? 'custom-active-tab'
              : 'bg-emerald-300 text-gray-700'
          }
        >
          Stats & Progress
        </TabsTrigger>
        <TabsTrigger
          value='problems'
          className={
            activeTab === 'problems'
              ? 'custom-active-tab'
              : 'bg-emerald-300 text-gray-700'
          }
        >
          Solved Problems
        </TabsTrigger>
      </TabsList>
      <TabsContent value='details' className='mt-6'>
        <UserDetails usersDetails={usersDetails} />
      </TabsContent>
      <TabsContent value='stats' className='mt-6'>
        <UserStats userProblemStats={userProblemStats} />
      </TabsContent>
      <TabsContent value='problems' className='mt-6'>
        <SolvedProblems userSubmissions={userSubmissionDetails} />
      </TabsContent>
    </Tabs>
  );
}
