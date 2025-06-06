
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

import { Tooltip } from 'react-tooltip';
import { useGetUserHeatMapData } from '@/hooks/apis/userStats/useGetUSerHeatMapData';
import { useEffect, useState } from 'react';

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

export function UserStats() {
  // Calculate the maximum value for scaling the chart

  const [heatMapData, setHeatMapData] = useState([]);

  const {
    data,
    isPending,
    isSuccess,
    error,
    refetch,
  } = useGetUserHeatMapData();

  // console.log("data", heatmapData);

  useEffect(() => {
    if (data) {
      setHeatMapData(data.heatmap);
    }
  }, [data]);

  

  // console.log("isPending", isPending);
  // console.log("isSuccess", isSuccess);
  // console.log("error", error);
  // console.log("refetch", refetch);






  // const heatmapData = generateHeatmapValues();
  const maxProblems = Math.max(...dailyProgress.map((day) => day.problems));
  
  if (isPending) return <div>Loading...</div>;

  return (
    <div className='grid gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>Daily Progress</CardTitle>
          <CardDescription>
            Your problem-solving activity over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='problems'>
            <TabsList className='mb-4'>
              <TabsTrigger value='problems'>Problems Solved</TabsTrigger>
              <TabsTrigger value='hours'>Hours Spent</TabsTrigger>
            </TabsList>
            <TabsContent value='problems'>
              <div className='h-[200px] flex items-end justify-between gap-2'>
                {dailyProgress.map((day) => (
                  <div
                    key={day.day}
                    className='flex flex-col items-center gap-2'
                  >
                    <div
                      className='bg-primary/90 w-12 rounded-t-md transition-all duration-500 ease-in-out hover:bg-primary'
                      style={{
                        height: `${(day.problems / maxProblems) * 150}px`,
                      }}
                    ></div>
                    <div className='text-xs font-medium'>{day.day}</div>
                    <div className='text-sm font-bold'>{day.problems}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value='hours'>
              <div className='h-[200px] flex items-end justify-between gap-2'>
                {dailyProgress.map((day) => (
                  <div
                    key={day.day}
                    className='flex flex-col items-center gap-2'
                  >
                    <div
                      className='bg-secondary/90 w-12 rounded-t-md transition-all duration-500 ease-in-out hover:bg-secondary'
                      style={{
                        height: `${
                          (day.hours /
                            Math.max(...dailyProgress.map((d) => d.hours))) *
                          150
                        }px`,
                      }}
                    ></div>
                    <div className='text-xs font-medium'>{day.day}</div>
                    <div className='text-sm font-bold'>{day.hours}h</div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
            <CardDescription>Your performance this week</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <dt className='font-medium text-muted-foreground'>
                  Total Problems
                </dt>
                <dd className='text-2xl font-bold'>
                  {weeklyStats.totalProblems}
                </dd>
              </div>
              <div>
                <dt className='font-medium text-muted-foreground'>
                  Total Hours
                </dt>
                <dd className='text-2xl font-bold'>
                  {weeklyStats.totalHours}h
                </dd>
              </div>
              <div>
                <dt className='font-medium text-muted-foreground'>
                  Daily Average
                </dt>
                <dd className='text-2xl font-bold'>
                  {weeklyStats.averageProblemsPerDay}
                </dd>
              </div>
              <div>
                <dt className='font-medium text-muted-foreground'>
                  Current Streak
                </dt>
                <dd className='text-2xl font-bold'>
                  {weeklyStats.streak} days
                </dd>
              </div>
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
                  <span className='font-medium'>Problem Solver (35/50)</span>
                  <span className='text-muted-foreground'>70%</span>
                </div>
                <div className='h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='bg-primary h-full rounded-full'
                    style={{ width: '70%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className='flex justify-between text-sm mb-1'>
                  <span className='font-medium'>Consistency King (7/10)</span>
                  <span className='text-muted-foreground'>70%</span>
                </div>
                <div className='h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='bg-primary h-full rounded-full'
                    style={{ width: '70%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className='flex justify-between text-sm mb-1'>
                  <span className='font-medium'>Algorithm Master (12/20)</span>
                  <span className='text-muted-foreground'>60%</span>
                </div>
                <div className='h-2 bg-muted rounded-full overflow-hidden'>
                  <div
                    className='bg-primary h-full rounded-full'
                    style={{ width: '60%' }}
                  ></div>
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
    </div>
  );
}
