
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CheckCircle,
  Clock,
  Eye,
  FileText,
  MessageSquare,
  ChevronLeft,
  HardDrive,
} from 'lucide-react';

export function SubmissionResult() {
  const [activeTab, setActiveTab] = useState('submissions');

  return (
    <div className='flex flex-col min-h-screen bg-black text-gray-200'>
      {/* Navigation and Main Content */}
      <div className='border-b border-gray-800'>
        <div className='container mx-auto px-4'>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >


            {/* Main Content */}
            <TabsContent value='submissions' className='mt-0 pb-6'>
              <div className='space-y-6'>
                {/* Current Submission */}
                <div className='flex justify-between items-center'>
                  <h2 className='text-xl font-medium'>Current submission</h2>
                  <Button
                    variant='outline'
                    className='bg-transparent border-orange-600 text-orange-500 hover:bg-orange-950 hover:text-orange-400'
                  >
                    View Advance Analysis
                  </Button>
                </div>

                {/* Submission Status Card */}
                <div className='border border-green-800 rounded-lg bg-green-950/20 p-6'>
                  <div className='flex justify-between items-start mb-6'>
                    <div className='flex items-center'>
                      <span className='text-green-500 font-medium text-lg'>
                        Accepted
                      </span>
                      <CheckCircle className='ml-2 h-5 w-5 text-green-500' />
                    </div>
                    <div className='text-gray-400 text-sm'>
                      Evaluated on 05/16/2025, 10:27:43 PM
                    </div>
                  </div>

                  <div className='grid grid-cols-3 gap-4'>
                    <div>
                      <div className='flex items-center text-gray-400 mb-1'>
                        <span>Test cases passed</span>
                        <FileText className='ml-2 h-4 w-4' />
                      </div>
                      <div className='text-green-500 text-xl font-medium'>
                        109/109
                      </div>
                    </div>
                    <div>
                      <div className='flex items-center text-gray-400 mb-1'>
                        <span>Time Taken</span>
                        <Clock className='ml-2 h-4 w-4' />
                      </div>
                      <div className='text-xl font-medium'>279ms</div>
                    </div>
                    <div>
                      <div className='flex items-center text-gray-400 mb-1'>
                        <span>Memory Used</span>
                        <HardDrive className='ml-2 h-4 w-4' />
                      </div>
                      <div className='text-xl font-medium'>83.52MB</div>
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                <div className='space-y-4'>
                  {/* Compilation Check */}
                  <div className='border border-gray-800 rounded-lg bg-gray-900 p-4'>
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center'>
                        <CheckCircle className='h-5 w-5 text-green-500 mr-2' />
                        <span className='font-medium'>Compilation check</span>
                      </div>
                      <span className='px-3 py-1 bg-green-900/30 text-green-500 rounded-full text-sm'>
                        Passed
                      </span>
                    </div>
                    <div className='mt-2 ml-7 text-gray-400'>
                      Code compiled successfully!
                    </div>
                  </div>

                  {/* Test Cases (small) */}
                  <div className='border border-gray-800 rounded-lg bg-gray-900 p-4'>
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center'>
                        <CheckCircle className='h-5 w-5 text-green-500 mr-2' />
                        <span className='font-medium'>Test Cases (small)</span>
                      </div>
                      <span className='px-3 py-1 bg-green-900/30 text-green-500 rounded-full text-sm'>
                        Passed
                      </span>
                    </div>
                    <div className='mt-2 ml-7 text-gray-400'>
                      Code Passed for the given test case
                    </div>
                  </div>

                  {/* Test Cases (Large) */}
                  <div className='border border-gray-800 rounded-lg bg-gray-900 p-4'>
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center'>
                        <CheckCircle className='h-5 w-5 text-green-500 mr-2' />
                        <span className='font-medium'>Test Cases (Large)</span>
                      </div>
                      <span className='px-3 py-1 bg-green-900/30 text-green-500 rounded-full text-sm'>
                        Passed
                      </span>
                    </div>
                    <div className='mt-2 ml-7 text-gray-400'>
                      Large Testcases Passed Successfully
                    </div>
                  </div>
                </div>

                {/* My Submissions */}
                <div className='mt-8'>
                  <h2 className='text-xl font-medium mb-4'>My submissions</h2>
                  <div className='border border-gray-800 rounded-lg overflow-hidden'>
                    <Table>
                      <TableHeader className='bg-gray-900'>
                        <TableRow className='border-gray-800'>
                          <TableHead className='text-gray-400 font-medium'>
                            Status
                          </TableHead>
                          <TableHead className='text-gray-400 font-medium'>
                            Language
                          </TableHead>
                          <TableHead className='text-gray-400 font-medium'>
                            Code
                          </TableHead>
                          <TableHead className='text-gray-400 font-medium'>
                            Advance Analysis
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow className='border-gray-800'>
                          <TableCell>
                            <div>
                              <span className='text-green-500'>Accepted</span>
                              <div className='text-xs text-gray-500'>
                                0 seconds ago
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>Java</TableCell>
                          <TableCell>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-gray-400'
                            >
                              <Eye className='h-5 w-5' />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <span className='text-blue-500'>View</span>
                          </TableCell>
                        </TableRow>
                        <TableRow className='border-gray-800'>
                          <TableCell>
                            <div>
                              <span className='text-green-500'>Accepted</span>
                              <div className='text-xs text-gray-500'>
                                Sep 3, 2024
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>Java</TableCell>
                          <TableCell>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-gray-400'
                            >
                              <Eye className='h-5 w-5' />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <span className='text-blue-500'>View</span>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </TabsContent>







          </Tabs>
        </div>
      </div>
    </div>
  );
}
