import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CheckCircle2,
  Clock,
  Code2,
  FileText,
  HardDrive,
  XCircle,
  ArrowLeft,
  Eye,
  BarChart3,
  Calendar,
} from 'lucide-react';

export function SubmissionResult({
  submissionDetails = null,
  submissionInProgress = false,
  submissionHistory,
}) {
  const [showResults, setShowResults] = useState(false);
  console.log('submissionDetails', submissionDetails);
  console.log('submissionHistory', submissionHistory);
  // console.log("{}", {} == submissionDetails)
  // console.log("type of submissionDetails", typeof submissionDetails);

  // When submissionDetails changes and is not null, show the results
  useEffect(() => {
    if (submissionDetails != null) {
      setShowResults(true);
    }
  }, [submissionDetails]);

  console.log('showResults', showResults);

  // Default submission history data
  const previousSubmissions = Array.isArray(submissionHistory)
    ? submissionHistory.map((submission) => ({
        status: submission.status || 'Pending',
        date: submission.date || 'Unknown',
        language: submission.language || 'N/A',
        statusColor:
          submission.status === 'Accepted'
            ? 'text-green-600'
            : submission.status === 'Wrong Answer'
            ? 'text-red-600'
            : submission.status === 'Time Limit Exceeded'
            ? 'text-amber-600'
            : 'text-gray-600',
        runtime: submission.runtime || '-',
        memory: submission.memory || '-',
      }))
    : [];


  // Only process additional data if we have submission details
  let statusInfo = {
    icon: null,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    badgeColor: 'bg-gray-100 text-gray-800',
    progressColor: 'bg-gray-500',
  };
  let passPercentage = 0;
  let formattedDate = '';

  if (submissionDetails) {
    // Function to determine status info based on submission status
    const getStatusInfo = (status) => {
      if (status === 'Accepted') {
        return {
          icon: <CheckCircle2 className='h-5 w-5' />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          badgeColor: 'bg-green-100 text-green-800 hover:bg-green-100',
          progressColor: 'bg-green-500',
        };
      } else {
        return {
          icon: <XCircle className='h-5 w-5' />,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          badgeColor: 'bg-red-100 text-red-800 hover:bg-red-100',
          progressColor: 'bg-red-500',
        };
      }
    };

    statusInfo = getStatusInfo(submissionDetails?.status);

    // Format date
    const currentDate = new Date();
    formattedDate =
      currentDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }) +
      ' at ' +
      currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

    // Parse test cases passed
    const [passed, total] = submissionDetails?.testCasesPassed
      ?.split('/')
      .map(Number) || [0, 0];
    passPercentage = total > 0 ? (passed / total) * 100 : 0;
  }

  // Test cases data
  const testCases = [
    {
      name: 'Compilation check',
      status: 'Passed',
      message: 'Code compiled successfully!',
    },
    {
      name: 'Test Cases',
      status: 'Passed',
      message: 'Testcases Passed Successfully',
    },
    // {
    //   name: 'Test Cases (small)',
    //   status: 'Passed',
    //   message: 'Code Passed for the given test case',
    // },
    // {
    //   name: 'Test Cases (Large)',
    //   status: 'Passed',
    //   message: 'Large Testcases Passed Successfully',
    // },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Main Content */}
      <main className='container mx-auto px-4 py-8 space-y-6'>
        {/* Only show these cards if we have submission details */}
        {showResults && (
          <>
            <div className='flex justify-between items-center mb-6'>
              <div className='flex items-center space-x-2'>
                <Badge variant='outline' className='flex items-center gap-1'>
                  <Calendar className='h-3.5 w-3.5' />
                  {formattedDate}
                </Badge>
                <Badge variant='outline' className='flex items-center gap-1'>
                  <Code2 className='h-3.5 w-3.5' />
                  {submissionDetails?.language}
                </Badge>
              </div>
            </div>

            {/* Status Card */}
            <Card className={`${statusInfo.bgColor} border-none shadow-sm`}>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <div className='flex items-center'>
                    <div className={`${statusInfo.color} mr-2`}>
                      {statusInfo.icon}
                    </div>
                    <h2 className={`text-2xl font-bold ${statusInfo.color}`}>
                      {submissionDetails?.status}
                    </h2>
                  </div>
                  <Button variant='outline' size='sm' className='gap-1'>
                    <Eye className='h-4 w-4' />
                    View Code
                  </Button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  {/* Test Cases */}
                  <Card className='bg-white shadow-sm'>
                    <CardHeader className='pb-2'>
                      <div className='flex items-center text-sm text-gray-500'>
                        <FileText className='h-4 w-4 mr-1' />
                        Test Cases Passed
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className='flex flex-col'>
                        <div className='flex justify-between items-center mb-2'>
                          <span className='text-2xl font-bold'>
                            {submissionDetails?.testCasesPassed}
                          </span>
                          <Badge
                            variant='outline'
                            className={statusInfo.badgeColor}
                          >
                            {Math.round(passPercentage)}%
                          </Badge>
                        </div>
                        <Progress
                          value={passPercentage}
                          className='h-2'
                          indicatorClassName={statusInfo.progressColor}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Time */}
                  <Card className='bg-white shadow-sm'>
                    <CardHeader className='pb-2'>
                      <div className='flex items-center text-sm text-gray-500'>
                        <Clock className='h-4 w-4 mr-1' />
                        Time Taken
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className='flex items-end justify-between'>
                        <span className='text-2xl font-bold'>
                          {submissionDetails?.performance?.totalTime}
                        </span>
                        <span className='text-sm text-gray-500'>
                          Faster than 85% of submissions
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Memory */}
                  <Card className='bg-white shadow-sm'>
                    <CardHeader className='pb-2'>
                      <div className='flex items-center text-sm text-gray-500'>
                        <HardDrive className='h-4 w-4 mr-1' />
                        Memory Used
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className='flex items-end justify-between'>
                        <span className='text-2xl font-bold'>
                          {submissionDetails?.performance?.totalMemory}
                        </span>
                        <span className='text-sm text-gray-500'>
                          Better than 72% of submissions
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Test Cases Details */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Test Results</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                {testCases.map((test, index) => (
                  <div
                    key={index}
                    className='border rounded-lg p-4 transition-all hover:bg-gray-50'
                  >
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center'>
                        {test.status === 'Passed' ? (
                          <CheckCircle2 className='h-5 w-5 text-green-600 mr-2' />
                        ) : (
                          <XCircle className='h-5 w-5 text-red-600 mr-2' />
                        )}
                        <span className='font-medium'>{test.name}</span>
                      </div>
                      <Badge
                        variant={
                          test.status === 'Passed' ? 'success' : 'destructive'
                        }
                      >
                        {test.status}
                      </Badge>
                    </div>
                    <div className='mt-2 ml-7 text-sm text-gray-600'>
                      {test.message}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* Always show submission history */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-lg'>Submission History</CardTitle>
            {submissionInProgress && (
              <Badge variant='outline' className='bg-blue-100 text-blue-800'>
                Submission in progress...
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Runtime</TableHead>
                  <TableHead>Memory</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previousSubmissions.map((submission, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className='flex items-center'>
                        {submission.status === 'Accepted' ? (
                          <CheckCircle2 className='h-4 w-4 text-green-600 mr-2' />
                        ) : submission.status === 'Wrong Answer' ? (
                          <XCircle className='h-4 w-4 text-red-600 mr-2' />
                        ) : submission.status === 'Time Limit Exceeded' ? (
                          <Clock className='h-4 w-4 text-amber-600 mr-2' />
                        ) : (
                          <Clock className='h-4 w-4 text-gray-400 mr-2 animate-spin' />
                        )}
                        <span className={submission.statusColor}>
                          {submission.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{submission.date}</TableCell>
                    <TableCell>{submission.language}</TableCell>
                    <TableCell>{submission.runtime}</TableCell>
                    <TableCell>{submission.memory}</TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          disabled={!submissionDetails && index === 0}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                          disabled={!submissionDetails && index === 0}
                        >
                          <BarChart3 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
