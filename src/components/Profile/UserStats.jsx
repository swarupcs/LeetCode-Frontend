import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { subDays, format, set } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip } from 'react-tooltip';
import { useGetUserHeatMapData } from '@/hooks/apis/userStats/useGetUSerHeatMapData';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProblemProgressChart } from './ProblemProgressChart';
import { useGetUserProgressData } from '@/hooks/apis/userStats/useGetUserSubmissionProgress';

// Mock data - in a real app, this would come from your backend
const dailyProgress = [
  { day: 'Mon', problems: 5, hours: 2.5 },
  { day: 'Tue', problems: 3, hours: 1.5 },
  { day: 'Wed', problems: 7, hours: 3.2 },
  { day: 'Thu', problems: 2, hours: 1.0 },
  { day: 'Fri', problems: 6, hours: 2.8 },
  { day: 'Sat', problems: 4, hours: 2.0 },
  { day: 'Sun', problems: 8, hours: 4.5 },
];

const weeklyStats = {
  totalProblems: 35,
  totalHours: 17.5,
  averageProblemsPerDay: 5,
  averageHoursPerDay: 2.5,
  streak: 7,
  mostProductiveDay: 'Wednesday',
};

// Generate mock data for different time periods
function generateWeeklyData(weekOffset = 0) {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - weekOffset * 7);

  const weekData = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - (6 - i));

    weekData.push({
      day: days[i],
      date: date.toISOString().split('T')[0],
      problems: Math.floor(Math.random() * 10) + 1,
      hours: Number.parseFloat((Math.random() * 4 + 0.5).toFixed(1)),
    });
  }

  return weekData;
}

function generateMonthlyData(monthOffset = 0) {
  const baseDate = new Date();
  baseDate.setMonth(baseDate.getMonth() - monthOffset);
  baseDate.setDate(1);

  const monthData = [];
  const daysInMonth = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + 1,
    0
  ).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), i);
    monthData.push({
      day: i.toString(),
      date: date.toISOString().split('T')[0],
      problems: Math.floor(Math.random() * 8) + 1,
      hours: Number.parseFloat((Math.random() * 3 + 0.5).toFixed(1)),
    });
  }

  return monthData;
}

export function UserStats() {
  // Calculate the maximum value for scaling the chart

  const [heatMapData, setHeatMapData] = useState([]);

  const [viewType, setViewType] = useState('week');

  const [selectedPeriod, setSelectedPeriod] = useState(0); // 0 = current, 1 = previous, etc.

  const [userProgressDetails, setUserProgressDetails] = useState([]);

  // const maxProblems = Math.max(...dailyProgress.map((day) => day.problems));
  // const currentData =
  //   viewType === 'week'
  //     ? generateWeeklyData(selectedPeriod)
  //     : generateMonthlyData(selectedPeriod);
  // const maxHours = Math.max(...currentData.map((day) => day.hours));

  const { data, isPending, isSuccess, error, refetch } =
    useGetUserHeatMapData();

  const {
    data: userProgressData,
    isPending: isProgressPending,
    isSuccess: isProgressSuccess,
    error: progressError,
    refetch: refetchProgress,
  } = useGetUserProgressData();

  // console.log("data", heatmapData);

  useEffect(() => {
    if (data) {
      setHeatMapData(data.heatmap);
    }
  }, [data]);

  useEffect(() => {
    if (userProgressData) {
      setUserProgressDetails(userProgressData.data);
    }
  }, [userProgressData]);

  // console.log("isPending", isPending);
  // console.log("isSuccess", isSuccess);
  // console.log("error", error);
  // console.log("refetch", refetch);

  // const heatmapData = generateHeatmapValues();

  // Calculate stats for current period
  // const totalProblems = currentData.reduce((sum, day) => sum + day.problems, 0);
  // const totalHours = Number.parseFloat(
  //   currentData.reduce((sum, day) => sum + day.hours, 0).toFixed(1)
  // );
  // const avgProblems =
  //   Math.round((totalProblems / currentData.length) * 10) / 10;
  // const avgHours = Number.parseFloat(
  //   (totalHours / currentData.length).toFixed(1)
  // );

  // debugger;

  console.log('userProgressDetails', userProgressDetails);
  const daysPerPage = viewType === 'week' ? 7 : 30;
  const startIndex = selectedPeriod * daysPerPage;
  const endIndex = startIndex + daysPerPage;
  const currentData = userProgressDetails.slice(startIndex, endIndex);


  // Stats
  const totalProblems = currentData.reduce((acc, d) => acc + d.problems, 0);
  const avgProblems =
    currentData.length > 0 ? Math.round(totalProblems / currentData.length) : 0;
  const maxProblems = Math.max(...currentData.map((d) => d.problems), 0);
  const activeDays = currentData.filter((d) => d.problems > 0).length;


  console.log("isProgressPending", isProgressPending);

  const getPeriodLabel = () => {
    const baseDate = new Date();
    if (viewType === 'week') {
      baseDate.setDate(baseDate.getDate() - selectedPeriod * 7);
      const startOfWeek = new Date(baseDate);
      startOfWeek.setDate(baseDate.getDate() - baseDate.getDay() + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return `${startOfWeek.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${endOfWeek.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`;
    } else {
      baseDate.setMonth(baseDate.getMonth() - selectedPeriod);
      return baseDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    }
  };

  if (isPending || isProgressPending) return <div>Loading...</div>;

  return (
    <div className='grid gap-6'>
      {!isProgressPending ? (
        <Card>
          <CardHeader>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
              <div>
                <CardTitle>Daily Progress</CardTitle>
                <CardDescription>
                  Your problem-solving activity over time
                </CardDescription>
              </div>

              {/* Period Selection Controls */}
              <div className='flex items-center gap-2'>
                <Select
                  value={viewType}
                  onValueChange={(value) => {
                    setViewType(value);
                    setSelectedPeriod(0);
                  }}
                >
                  <SelectTrigger className='w-[100px]'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='week'>Week</SelectItem>
                    <SelectItem value='month'>Month</SelectItem>
                  </SelectContent>
                </Select>

                <div className='flex items-center gap-1'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setSelectedPeriod((prev) => prev + 1)}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>

                  <div className='px-3 py-1 text-sm font-medium min-w-[140px] text-center'>
                    {getPeriodLabel()}
                  </div>

                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setSelectedPeriod((prev) => Math.max(0, prev - 1))
                    }
                    disabled={selectedPeriod === 0}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='problems'>
              <TabsList className='mb-4'>
                <TabsTrigger value='problems'>Problems Solved</TabsTrigger>
                {/* <TabsTrigger value='hours'>Hours Spent</TabsTrigger> */}
              </TabsList>
              <TabsContent value='problems'>
                <div className='h-[250px] flex items-end justify-between gap-1'>
                  {[...currentData].reverse().map((day, index) => (
                    <div
                      key={index}
                      className='flex flex-col items-center gap-2 flex-1 min-w-0'
                    >
                      <div className='text-xs font-medium text-center'>
                        {day.problems}
                      </div>
                      <div
                        className='bg-primary/90 w-full max-w-[40px] rounded-t-md transition-all duration-500 ease-in-out hover:bg-primary cursor-pointer'
                        style={{
                          height: `${
                            maxProblems === 0
                              ? 0
                              : (day.problems / maxProblems) * 180
                          }px`,
                        }}
                        title={`${day.problems} problems on ${day.date}`}
                      ></div>
                      <div className='text-xs font-medium text-center'>
                        {viewType === 'week' ? day.day : day.date}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Problems Stats */}
                <div className='mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-primary'>
                      {totalProblems}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Total Problems
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-green-600'>
                      {avgProblems}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Daily Average
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {maxProblems}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Best Day
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-purple-600'>
                      {activeDays}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Active Days
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <div>Loading user progress...</div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>
              {viewType === 'week' ? 'Weekly' : 'Monthly'} Summary
            </CardTitle>
            <CardDescription>
              Your performance for {getPeriodLabel()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <dt className='font-medium text-muted-foreground'>
                  Total Problems
                </dt>
                <dd className='text-2xl font-bold'>{totalProblems}</dd>
              </div>
              {/* <div>
                <dt className='font-medium text-muted-foreground'>
                  Total Hours
                </dt>
                <dd className='text-2xl font-bold'>{totalHours.toFixed(1)}h</dd>
              </div> */}
              <div>
                <dt className='font-medium text-muted-foreground'>
                  Daily Average
                </dt>
                <dd className='text-2xl font-bold'>{avgProblems}</dd>
              </div>
              {/* <div>
                <dt className='font-medium text-muted-foreground'>
                  Efficiency
                </dt>
                <dd className='text-2xl font-bold'>
                  {(totalProblems / totalHours).toFixed(1)}
                </dd>
              </div> */}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievement Progress</CardTitle>
            <CardDescription>Your journey to mastery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <div className='flex justify-between text-sm mb-1'>
                  <span className='font-medium'>
                    Problem Solver ({totalProblems}/50)
                  </span>
                  <span className='text-muted-foreground'>
                    {Math.min(100, Math.round((totalProblems / 50) * 100))}%
                  </span>
                </div>
                <div className='h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='bg-primary h-full rounded-full'
                    style={{
                      width: `${Math.min(100, (totalProblems / 50) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                {/* <div className='flex justify-between text-sm mb-1'>
                  <span className='font-medium'>
                    Time Master ({totalHours}h/100h)
                  </span>
                  <span className='text-muted-foreground'>
                    {Math.min(100, Math.round((totalHours / 100) * 100))}%
                  </span>
                </div> */}
                {/* <div className='h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='bg-primary h-full rounded-full'
                    style={{
                      width: `${Math.min(100, (totalHours / 100) * 100)}%`,
                    }}
                  ></div>
                </div> */}
              </div>
              <div>
                <div className='flex justify-between text-sm mb-1'>
                  <span className='font-medium'>
                    Consistency (
                    {currentData.filter((d) => d.problems > 0).length}/
                    {currentData.length})
                  </span>
                  <span className='text-muted-foreground'>
                    {Math.round(
                      (currentData.filter((d) => d.problems > 0).length /
                        currentData.length) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className='h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='bg-primary h-full rounded-full'
                    style={{
                      width: `${
                        (currentData.filter((d) => d.problems > 0).length /
                          currentData.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Problem Solving Overview</CardTitle>
            <CardDescription>
              Your progress across all problems, categories, and difficulties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Overall Progress Donut Chart */}
              <div className='flex flex-col items-center'>
                <div className='relative w-40 h-40 mb-4'>
                  <svg
                    className='w-40 h-40 transform -rotate-90'
                    viewBox='0 0 160 160'
                  >
                    <circle
                      cx='80'
                      cy='80'
                      r='60'
                      stroke='currentColor'
                      strokeWidth='12'
                      fill='transparent'
                      className='text-muted'
                    />
                    <circle
                      cx='80'
                      cy='80'
                      r='60'
                      stroke='currentColor'
                      strokeWidth='12'
                      fill='transparent'
                      strokeDasharray={`${(247 / 3571) * 377} 377`}
                      className='text-primary transition-all duration-1000'
                    />
                  </svg>
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <span className='text-3xl font-bold'>247</span>
                    <span className='text-sm text-muted-foreground'>/3571</span>
                    <span className='text-xs text-muted-foreground'>
                      Solved
                    </span>
                  </div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-primary'>
                    {((247 / 3571) * 100).toFixed(1)}%
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Overall Progress
                  </div>
                </div>
              </div>

              {/* Category and Difficulty Stats */}
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold mb-3'>By Difficulty</h4>
                  <div className='space-y-3'>
                    <div>
                      <div className='flex justify-between text-sm mb-1'>
                        <span className='text-green-600'>Easy</span>
                        <span className='font-medium'>89/880</span>
                      </div>
                      <div className='h-2 bg-muted rounded-full overflow-hidden'>
                        <div
                          className='bg-green-500 h-full rounded-full'
                          style={{ width: `${(89 / 880) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className='flex justify-between text-sm mb-1'>
                        <span className='text-yellow-600'>Medium</span>
                        <span className='font-medium'>127/1852</span>
                      </div>
                      <div className='h-2 bg-muted rounded-full overflow-hidden'>
                        <div
                          className='bg-yellow-500 h-full rounded-full'
                          style={{ width: `${(127 / 1852) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className='flex justify-between text-sm mb-1'>
                        <span className='text-red-600'>Hard</span>
                        <span className='font-medium'>31/839</span>
                      </div>
                      <div className='h-2 bg-muted rounded-full overflow-hidden'>
                        <div
                          className='bg-red-500 h-full rounded-full'
                          style={{ width: `${(31 / 839) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className='font-semibold mb-3'>Top Categories</h4>
                  <div className='space-y-2'>
                    {[
                      {
                        name: 'Array',
                        solved: 45,
                        total: 60,
                        color: 'bg-blue-500',
                      },
                      {
                        name: 'String',
                        solved: 32,
                        total: 45,
                        color: 'bg-purple-500',
                      },
                      {
                        name: 'Hash Table',
                        solved: 28,
                        total: 35,
                        color: 'bg-indigo-500',
                      },
                      {
                        name: 'Tree',
                        solved: 25,
                        total: 35,
                        color: 'bg-green-500',
                      },
                      {
                        name: 'Dynamic Programming',
                        solved: 18,
                        total: 40,
                        color: 'bg-orange-500',
                      },
                    ].map((category) => (
                      <div
                        key={category.name}
                        className='flex items-center gap-3'
                      >
                        <div className='w-16 text-xs font-medium truncate'>
                          {category.name}
                        </div>
                        <div className='flex-1 h-4 bg-muted rounded-full overflow-hidden'>
                          <div
                            className={`${category.color} h-full rounded-full transition-all duration-500`}
                            style={{
                              width: `${
                                (category.solved / category.total) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className='text-xs font-medium w-12 text-right'>
                          {category.solved}/{category.total}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contribution Heatmap</CardTitle>
          <CardDescription>Daily activity (past 1 year)</CardDescription>
        </CardHeader>
        <CardContent>
          <CalendarHeatmap
            startDate={subDays(new Date(), 364)}
            endDate={new Date()}
            values={heatMapData}
            classForValue={(value) => {
              if (!value || value.count === 0) return 'color-empty';
              if (value.count >= 5) return 'color-github-4';
              if (value.count >= 3) return 'color-github-3';
              if (value.count >= 2) return 'color-github-2';
              return 'color-github-1';
            }}
            tooltipDataAttrs={(value) =>
              value.date
                ? {
                    'data-tooltip-id': 'heatmap-tooltip',
                    'data-tooltip-content': `${value.date}: ${value.count} problems`,
                  }
                : {}
            }
            showWeekdayLabels
          />
          <Tooltip id='heatmap-tooltip' />
        </CardContent>
      </Card>

      <ProblemProgressChart />
    </div>
  );
}
