
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserDetails } from './UserDetails';
import { UserStats } from './UserStats';
import { SolvedProblems } from './SolvedProblems';


export function UserProfile({ userSubmissionDetails, usersDetails }) {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <Tabs
      defaultValue='details'
      className='w-full'
      onValueChange={setActiveTab}
    >
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='details'>Profile Details</TabsTrigger>
        {/* <TabsTrigger value='stats'>Stats & Progress</TabsTrigger> */}
        <TabsTrigger value='problems'>Solved Problems</TabsTrigger>
      </TabsList>
      <TabsContent value='details' className='mt-6'>
        <UserDetails usersDetails={usersDetails} />
      </TabsContent>
      {/* <TabsContent value='stats' className='mt-6'>
        <UserStats />
      </TabsContent> */}
      <TabsContent value='problems' className='mt-6'>
        <SolvedProblems userSubmissions={userSubmissionDetails} />
      </TabsContent>
    </Tabs>
  );
}
