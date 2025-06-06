
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for different categories and difficulties
const categoryData = [
  { name: 'Array', solved: 45, total: 60, easy: 20, medium: 20, hard: 5 },
  { name: 'String', solved: 32, total: 45, easy: 15, medium: 12, hard: 5 },
  { name: 'Hash Table', solved: 28, total: 35, easy: 12, medium: 13, hard: 3 },
  {
    name: 'Dynamic Programming',
    solved: 18,
    total: 40,
    easy: 5,
    medium: 10,
    hard: 3,
  },
  { name: 'Tree', solved: 25, total: 35, easy: 10, medium: 12, hard: 3 },
  { name: 'Graph', solved: 15, total: 30, easy: 3, medium: 8, hard: 4 },
  {
    name: 'Binary Search',
    solved: 22,
    total: 25,
    easy: 8,
    medium: 12,
    hard: 2,
  },
  { name: 'Two Pointers', solved: 20, total: 25, easy: 12, medium: 7, hard: 1 },
  {
    name: 'Sliding Window',
    solved: 16,
    total: 20,
    easy: 6,
    medium: 8,
    hard: 2,
  },
  { name: 'Backtracking', solved: 12, total: 25, easy: 2, medium: 7, hard: 3 },
];

const difficultyData = {
  easy: { solved: 89, total: 880, color: 'bg-green-500' },
  medium: { solved: 127, total: 1852, color: 'bg-yellow-500' },
  hard: { solved: 31, total: 839, color: 'bg-red-500' },
};

const totalSolved = 247;
const totalProblems = 3571;

export function ProblemProgressChart() {
  return (
    <Card className='col-span-full'>
      <CardHeader>
        <CardTitle>Problem Solving Progress</CardTitle>
        <CardDescription>
          Comprehensive view of your progress across all categories and
          difficulties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='overview' className='w-full'>
          <TabsList className='mb-6'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='categories'>Categories</TabsTrigger>
            <TabsTrigger value='difficulties'>Difficulties</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Overall Progress Circle */}
              <div className='flex flex-col items-center justify-center'>
                <div className='relative w-48 h-48'>
                  <svg
                    className='w-48 h-48 transform -rotate-90'
                    viewBox='0 0 200 200'
                  >
                    <circle
                      cx='100'
                      cy='100'
                      r='80'
                      stroke='currentColor'
                      strokeWidth='16'
                      fill='transparent'
                      className='text-muted'
                    />
                    <circle
                      cx='100'
                      cy='100'
                      r='80'
                      stroke='currentColor'
                      strokeWidth='16'
                      fill='transparent'
                      strokeDasharray={`${
                        (totalSolved / totalProblems) * 502
                      } 502`}
                      className='text-primary transition-all duration-1000'
                      strokeLinecap='round'
                    />
                  </svg>
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <span className='text-4xl font-bold'>{totalSolved}</span>
                    <span className='text-lg text-muted-foreground'>
                      /{totalProblems}
                    </span>
                    <span className='text-sm text-muted-foreground'>
                      Problems Solved
                    </span>
                  </div>
                </div>
                <div className='mt-4 text-center'>
                  <div className='text-3xl font-bold text-primary'>
                    {((totalSolved / totalProblems) * 100).toFixed(1)}%
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Overall Progress
                  </div>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>By Difficulty</h3>
                {Object.entries(difficultyData).map(([difficulty, data]) => (
                  <div key={difficulty} className='space-y-2'>
                    <div className='flex justify-between items-center'>
                      <span className='capitalize font-medium'>
                        {difficulty}
                      </span>
                      <span className='text-sm font-semibold'>
                        {data.solved}/{data.total}
                      </span>
                    </div>
                    <div className='h-3 bg-muted rounded-full overflow-hidden'>
                      <div
                        className={`${data.color} h-full rounded-full transition-all duration-500`}
                        style={{
                          width: `${(data.solved / data.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {((data.solved / data.total) * 100).toFixed(1)}% completed
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Quick Stats</h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='text-center p-3 bg-muted/50 rounded-lg'>
                    <div className='text-2xl font-bold text-green-600'>
                      {difficultyData.easy.solved}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Easy Solved
                    </div>
                  </div>
                  <div className='text-center p-3 bg-muted/50 rounded-lg'>
                    <div className='text-2xl font-bold text-yellow-600'>
                      {difficultyData.medium.solved}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Medium Solved
                    </div>
                  </div>
                  <div className='text-center p-3 bg-muted/50 rounded-lg'>
                    <div className='text-2xl font-bold text-red-600'>
                      {difficultyData.hard.solved}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Hard Solved
                    </div>
                  </div>
                  <div className='text-center p-3 bg-muted/50 rounded-lg'>
                    <div className='text-2xl font-bold text-blue-600'>
                      {categoryData.length}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      Categories
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='categories' className='space-y-4'>
            <div className='grid gap-4'>
              {categoryData.map((category, index) => (
                <div key={category.name} className='p-4 border rounded-lg'>
                  <div className='flex justify-between items-center mb-3'>
                    <h4 className='font-semibold'>{category.name}</h4>
                    <span className='text-sm font-medium'>
                      {category.solved}/{category.total}
                    </span>
                  </div>

                  {/* Overall progress for category */}
                  <div className='mb-3'>
                    <div className='h-2 bg-muted rounded-full overflow-hidden'>
                      <div
                        className='bg-primary h-full rounded-full transition-all duration-500'
                        style={{
                          width: `${(category.solved / category.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className='text-xs text-muted-foreground mt-1'>
                      {((category.solved / category.total) * 100).toFixed(1)}%
                      completed
                    </div>
                  </div>

                  {/* Difficulty breakdown */}
                  <div className='grid grid-cols-3 gap-2 text-xs'>
                    <div className='text-center'>
                      <div className='text-green-600 font-medium'>
                        {category.easy}
                      </div>
                      <div className='text-muted-foreground'>Easy</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-yellow-600 font-medium'>
                        {category.medium}
                      </div>
                      <div className='text-muted-foreground'>Medium</div>
                    </div>
                    <div className='text-center'>
                      <div className='text-red-600 font-medium'>
                        {category.hard}
                      </div>
                      <div className='text-muted-foreground'>Hard</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value='difficulties' className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {Object.entries(difficultyData).map(([difficulty, data]) => (
                <Card key={difficulty}>
                  <CardHeader className='pb-3'>
                    <CardTitle className='capitalize'>{difficulty}</CardTitle>
                    <CardDescription>
                      {data.solved} out of {data.total} problems
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-col items-center'>
                      <div className='relative w-32 h-32 mb-4'>
                        <svg
                          className='w-32 h-32 transform -rotate-90'
                          viewBox='0 0 120 120'
                        >
                          <circle
                            cx='60'
                            cy='60'
                            r='45'
                            stroke='currentColor'
                            strokeWidth='8'
                            fill='transparent'
                            className='text-muted'
                          />
                          <circle
                            cx='60'
                            cy='60'
                            r='45'
                            stroke='currentColor'
                            strokeWidth='8'
                            fill='transparent'
                            strokeDasharray={`${
                              (data.solved / data.total) * 283
                            } 283`}
                            className={
                              difficulty === 'easy'
                                ? 'text-green-500'
                                : difficulty === 'medium'
                                ? 'text-yellow-500'
                                : 'text-red-500'
                            }
                            strokeLinecap='round'
                          />
                        </svg>
                        <div className='absolute inset-0 flex flex-col items-center justify-center'>
                          <span className='text-xl font-bold'>
                            {data.solved}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            /{data.total}
                          </span>
                        </div>
                      </div>
                      <div className='text-center'>
                        <div className='text-2xl font-bold'>
                          {((data.solved / data.total) * 100).toFixed(1)}%
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          Completed
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stacked Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Difficulty Distribution</CardTitle>
                <CardDescription>
                  Visual comparison of progress across all difficulty levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='h-12 bg-muted rounded-lg overflow-hidden flex'>
                    <div
                      className='bg-green-500 flex items-center justify-center text-white text-sm font-medium'
                      style={{
                        width: `${
                          (difficultyData.easy.solved / totalSolved) * 100
                        }%`,
                      }}
                    >
                      Easy: {difficultyData.easy.solved}
                    </div>
                    <div
                      className='bg-yellow-500 flex items-center justify-center text-white text-sm font-medium'
                      style={{
                        width: `${
                          (difficultyData.medium.solved / totalSolved) * 100
                        }%`,
                      }}
                    >
                      Medium: {difficultyData.medium.solved}
                    </div>
                    <div
                      className='bg-red-500 flex items-center justify-center text-white text-sm font-medium'
                      style={{
                        width: `${
                          (difficultyData.hard.solved / totalSolved) * 100
                        }%`,
                      }}
                    >
                      Hard: {difficultyData.hard.solved}
                    </div>
                  </div>
                  <div className='grid grid-cols-3 gap-4 text-center text-sm'>
                    <div>
                      <div className='font-medium text-green-600'>
                        {(
                          (difficultyData.easy.solved / totalSolved) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <div className='text-muted-foreground'>
                        of solved problems
                      </div>
                    </div>
                    <div>
                      <div className='font-medium text-yellow-600'>
                        {(
                          (difficultyData.medium.solved / totalSolved) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <div className='text-muted-foreground'>
                        of solved problems
                      </div>
                    </div>
                    <div>
                      <div className='font-medium text-red-600'>
                        {(
                          (difficultyData.hard.solved / totalSolved) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <div className='text-muted-foreground'>
                        of solved problems
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
