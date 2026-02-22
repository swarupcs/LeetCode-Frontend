import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  CheckCircle,
  Flame,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Code2,
  Clock,
  Zap,
  BarChart3,
  PieChart,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ContributionGraph from '@/components/ContributionGraph';

// Mock data
const difficultyData = [
  {
    level: 'Easy',
    solved: 45,
    total: 80,
    color: 'bg-[hsl(var(--emerald))]',
    textColor: 'text-[hsl(var(--emerald))]',
  },
  {
    level: 'Medium',
    solved: 32,
    total: 120,
    color: 'bg-[hsl(var(--amber))]',
    textColor: 'text-[hsl(var(--amber))]',
  },
  {
    level: 'Hard',
    solved: 8,
    total: 50,
    color: 'bg-[hsl(var(--rose))]',
    textColor: 'text-[hsl(var(--rose))]',
  },
];

const weeklyData = [
  { day: 'Mon', count: 3 },
  { day: 'Tue', count: 5 },
  { day: 'Wed', count: 2 },
  { day: 'Thu', count: 7 },
  { day: 'Fri', count: 4 },
  { day: 'Sat', count: 6 },
  { day: 'Sun', count: 1 },
];

const recentSubmissions = [
  {
    problem: 'Two Sum',
    status: 'Accepted',
    language: 'Python',
    time: '4ms',
    memory: '14.2 MB',
    date: '2h ago',
    difficulty: 'Easy',
  },
  {
    problem: 'Add Two Numbers',
    status: 'Accepted',
    language: 'JavaScript',
    time: '12ms',
    memory: '42.1 MB',
    date: '5h ago',
    difficulty: 'Medium',
  },
  {
    problem: '3Sum',
    status: 'Wrong Answer',
    language: 'Python',
    time: '-',
    memory: '-',
    date: '1d ago',
    difficulty: 'Medium',
  },
  {
    problem: 'Valid Parentheses',
    status: 'Accepted',
    language: 'Java',
    time: '1ms',
    memory: '39.8 MB',
    date: '1d ago',
    difficulty: 'Easy',
  },
  {
    problem: 'Merge Two Sorted Lists',
    status: 'Time Limit Exceeded',
    language: 'Python',
    time: '-',
    memory: '-',
    date: '2d ago',
    difficulty: 'Easy',
  },
  {
    problem: 'LRU Cache',
    status: 'Accepted',
    language: 'Python',
    time: '89ms',
    memory: '23.4 MB',
    date: '3d ago',
    difficulty: 'Hard',
  },
];

// Topic progress data
const topicProgress = [
  { topic: 'Arrays & Hashing', solved: 18, total: 25, percentage: 72 },
  { topic: 'Two Pointers', solved: 12, total: 15, percentage: 80 },
  { topic: 'Sliding Window', solved: 8, total: 12, percentage: 67 },
  { topic: 'Stack', solved: 10, total: 14, percentage: 71 },
  { topic: 'Binary Search', solved: 7, total: 18, percentage: 39 },
  { topic: 'Linked List', solved: 9, total: 11, percentage: 82 },
  { topic: 'Trees', solved: 6, total: 20, percentage: 30 },
  { topic: 'Graphs', solved: 4, total: 22, percentage: 18 },
  { topic: 'Dynamic Programming', solved: 5, total: 30, percentage: 17 },
  { topic: 'Backtracking', solved: 3, total: 12, percentage: 25 },
];

// Language distribution
const languageStats = [
  {
    language: 'Python',
    count: 48,
    percentage: 56,
    color: 'bg-[hsl(var(--cyan))]',
  },
  {
    language: 'JavaScript',
    count: 22,
    percentage: 26,
    color: 'bg-[hsl(var(--amber))]',
  },
  {
    language: 'Java',
    count: 10,
    percentage: 12,
    color: 'bg-[hsl(var(--rose))]',
  },
  {
    language: 'C++',
    count: 5,
    percentage: 6,
    color: 'bg-[hsl(var(--emerald-light))]',
  },
];

// Monthly trend data
const monthlyTrend = [
  { month: 'Sep', solved: 8, submissions: 15 },
  { month: 'Oct', solved: 12, submissions: 22 },
  { month: 'Nov', solved: 15, submissions: 28 },
  { month: 'Dec', solved: 10, submissions: 18 },
  { month: 'Jan', solved: 18, submissions: 30 },
  { month: 'Feb', solved: 22, submissions: 35 },
];

// Skill ratings
const skillRatings = [
  { skill: 'Problem Solving', rating: 72, trend: 'up' as const },
  { skill: 'Time Complexity', rating: 65, trend: 'up' as const },
  { skill: 'Space Optimization', rating: 58, trend: 'stable' as const },
  { skill: 'Code Quality', rating: 80, trend: 'up' as const },
  { skill: 'Edge Cases', rating: 45, trend: 'down' as const },
];

const totalSolved = 85;
const totalAvailable = 250;
const currentStreak = 12;
const maxStreak = 23;
const totalSubmissions = 148;
const acceptanceRate = 68;

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const trendIcon = (trend: string) => {
    if (trend === 'up')
      return (
        <ArrowUpRight className='h-3.5 w-3.5 text-[hsl(var(--emerald))]' />
      );
    if (trend === 'down')
      return <ArrowDownRight className='h-3.5 w-3.5 text-[hsl(var(--rose))]' />;
    return <Minus className='h-3.5 w-3.5 text-muted-foreground' />;
  };

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <h1 className='text-3xl font-bold mb-2'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Track your progress and stay consistent
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={stagger}
          initial='hidden'
          animate='show'
          className='grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8'
        >
          {[
            {
              label: 'Problems Solved',
              value: totalSolved,
              icon: CheckCircle,
              color: 'text-primary',
              sub: `of ${totalAvailable}`,
            },
            {
              label: 'Current Streak',
              value: `${currentStreak}d`,
              icon: Flame,
              color: 'text-[hsl(var(--amber))]',
              sub: 'Keep going!',
            },
            {
              label: 'Max Streak',
              value: `${maxStreak}d`,
              icon: Award,
              color: 'text-accent',
              sub: 'Personal best',
            },
            {
              label: 'Acceptance Rate',
              value: `${acceptanceRate}%`,
              icon: Target,
              color: 'text-[hsl(var(--emerald))]',
              sub: `${totalSubmissions} total`,
            },
            {
              label: 'Rank',
              value: '#127',
              icon: TrendingUp,
              color: 'text-[hsl(var(--emerald-light))]',
              sub: 'Top 15%',
            },
            {
              label: 'Avg Runtime',
              value: '24ms',
              icon: Zap,
              color: 'text-[hsl(var(--cyan))]',
              sub: 'Faster than 72%',
            },
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className='glass-card border-border/50 h-full'>
                <CardContent className='p-5'>
                  <div className='flex items-start justify-between mb-3'>
                    <div className='p-2 rounded-lg bg-surface-2'>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </div>
                  <div className='text-2xl font-bold'>{stat.value}</div>
                  <div className='text-xs text-muted-foreground mt-0.5'>
                    {stat.label}
                  </div>
                  <div className='text-[10px] text-muted-foreground/70 mt-1'>
                    {stat.sub}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          {/* Progress Ring + Difficulty */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className='glass-card border-border/50 h-full'>
              <CardHeader>
                <CardTitle className='text-lg'>Overall Progress</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col items-center'>
                <div className='relative w-36 h-36 mb-5'>
                  <svg
                    className='w-36 h-36 transform -rotate-90'
                    viewBox='0 0 160 160'
                  >
                    <circle
                      cx='80'
                      cy='80'
                      r='65'
                      stroke='hsl(var(--surface-3))'
                      strokeWidth='10'
                      fill='transparent'
                    />
                    <circle
                      cx='80'
                      cy='80'
                      r='65'
                      stroke='hsl(var(--primary))'
                      strokeWidth='10'
                      fill='transparent'
                      strokeDasharray={`${(totalSolved / totalAvailable) * 408.4} 408.4`}
                      strokeLinecap='round'
                      className='transition-all duration-1000'
                    />
                  </svg>
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <span className='text-3xl font-bold'>
                      {Math.round((totalSolved / totalAvailable) * 100)}%
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {totalSolved}/{totalAvailable}
                    </span>
                  </div>
                </div>

                <div className='w-full space-y-3'>
                  {difficultyData.map((d) => (
                    <div key={d.level}>
                      <div className='flex justify-between text-sm mb-1.5'>
                        <span className={`${d.textColor} font-medium`}>
                          {d.level}
                        </span>
                        <span className='text-muted-foreground'>
                          {d.solved}/{d.total}
                        </span>
                      </div>
                      <div className='h-2 bg-surface-3 rounded-full overflow-hidden'>
                        <div
                          className={`${d.color} h-full rounded-full transition-all duration-700`}
                          style={{ width: `${(d.solved / d.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='lg:col-span-2'
          >
            <Card className='glass-card border-border/50 h-full'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg'>Activity Overview</CardTitle>
                    <CardDescription>
                      Submissions & progress trends
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue='weekly' className='w-full'>
                  <TabsList className='mb-4'>
                    <TabsTrigger value='weekly'>This Week</TabsTrigger>
                    <TabsTrigger value='monthly'>Monthly</TabsTrigger>
                  </TabsList>

                  <TabsContent value='weekly'>
                    <div className='flex items-end justify-between gap-2 h-[180px] mb-4'>
                      {weeklyData.map((day, i) => {
                        const maxCount = Math.max(
                          ...weeklyData.map((d) => d.count),
                        );
                        const height =
                          maxCount > 0 ? (day.count / maxCount) * 150 : 0;
                        return (
                          <div
                            key={i}
                            className='flex-1 flex flex-col items-center gap-2'
                          >
                            <span className='text-xs font-medium text-muted-foreground'>
                              {day.count}
                            </span>
                            <div
                              className='w-full max-w-[40px] bg-primary/80 rounded-t-md hover:bg-primary transition-all duration-300 cursor-pointer'
                              style={{ height: `${height}px` }}
                            />
                            <span className='text-xs font-medium text-muted-foreground'>
                              {day.day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/30'>
                      {[
                        {
                          label: 'This Week',
                          value: weeklyData.reduce((a, b) => a + b.count, 0),
                        },
                        {
                          label: 'Daily Avg',
                          value: (
                            weeklyData.reduce((a, b) => a + b.count, 0) / 7
                          ).toFixed(1),
                        },
                        {
                          label: 'Best Day',
                          value: Math.max(...weeklyData.map((d) => d.count)),
                        },
                        {
                          label: 'Active Days',
                          value: weeklyData.filter((d) => d.count > 0).length,
                        },
                      ].map((s, i) => (
                        <div key={i} className='text-center'>
                          <div className='text-xl font-bold text-primary'>
                            {s.value}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {s.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value='monthly'>
                    <div className='flex items-end justify-between gap-3 h-[180px] mb-4'>
                      {monthlyTrend.map((m, i) => {
                        const maxSub = Math.max(
                          ...monthlyTrend.map((d) => d.submissions),
                        );
                        const subH =
                          maxSub > 0 ? (m.submissions / maxSub) * 150 : 0;
                        const solvedH =
                          maxSub > 0 ? (m.solved / maxSub) * 150 : 0;
                        return (
                          <div
                            key={i}
                            className='flex-1 flex flex-col items-center gap-2'
                          >
                            <span className='text-xs font-medium text-muted-foreground'>
                              {m.solved}
                            </span>
                            <div className='w-full max-w-[48px] relative'>
                              <div
                                className='w-full bg-surface-3 rounded-t-md'
                                style={{ height: `${subH}px` }}
                              >
                                <div
                                  className='absolute bottom-0 w-full bg-primary/80 rounded-t-md'
                                  style={{ height: `${solvedH}px` }}
                                />
                              </div>
                            </div>
                            <span className='text-xs font-medium text-muted-foreground'>
                              {m.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className='flex items-center gap-4 pt-4 border-t border-border/30 text-xs text-muted-foreground'>
                      <div className='flex items-center gap-1.5'>
                        <div className='w-3 h-3 rounded-sm bg-primary/80' />
                        <span>Solved</span>
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <div className='w-3 h-3 rounded-sm bg-surface-3' />
                        <span>Total Submissions</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Topic Progress + Language + Skills */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          {/* Topic Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className='lg:col-span-2'
          >
            <Card className='glass-card border-border/50 h-full'>
              <CardHeader>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <BookOpen className='h-5 w-5 text-primary' />
                  Topic Progress
                </CardTitle>
                <CardDescription>
                  Your progress across different problem categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TooltipProvider delayDuration={200}>
                  <div className='space-y-3'>
                    {topicProgress.map((t) => (
                      <Tooltip key={t.topic}>
                        <TooltipTrigger asChild>
                          <div className='group cursor-pointer rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-surface-2'>
                            <div className='flex items-center justify-between text-sm mb-1'>
                              <span className='font-medium text-foreground/90'>
                                {t.topic}
                              </span>
                              <span className='text-muted-foreground text-xs'>
                                {t.solved}/{t.total}
                                <span className='ml-1.5 font-semibold text-foreground/70'>
                                  {t.percentage}%
                                </span>
                              </span>
                            </div>
                            <div className='h-2 bg-surface-3 rounded-full overflow-hidden'>
                              <div
                                className={`h-full rounded-full transition-all duration-700 group-hover:brightness-110 ${
                                  t.percentage >= 70
                                    ? 'bg-[hsl(var(--emerald))]'
                                    : t.percentage >= 40
                                      ? 'bg-[hsl(var(--amber))]'
                                      : 'bg-[hsl(var(--rose))]'
                                }`}
                                style={{ width: `${t.percentage}%` }}
                              />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side='left'
                          className='text-xs space-y-1 max-w-[200px]'
                        >
                          <p className='font-semibold'>{t.topic}</p>
                          <p>
                            {t.solved} solved out of {t.total} problems
                          </p>
                          <p>{t.total - t.solved} remaining to complete</p>
                          <p className='text-muted-foreground'>
                            {t.percentage >= 70
                              ? 'Great progress! 🎉'
                              : t.percentage >= 40
                                ? 'Keep practicing! 💪'
                                : 'Needs more focus 🎯'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>
          </motion.div>

          {/* Language + Skills sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='space-y-6'
          >
            {/* Language Distribution */}
            <Card className='glass-card border-border/50'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <PieChart className='h-5 w-5 text-accent' />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Stacked bar */}
                <div className='flex h-3 rounded-full overflow-hidden mb-4'>
                  {languageStats.map((l) => (
                    <div
                      key={l.language}
                      className={`${l.color} transition-all`}
                      style={{ width: `${l.percentage}%` }}
                    />
                  ))}
                </div>
                <div className='space-y-2'>
                  {languageStats.map((l) => (
                    <div
                      key={l.language}
                      className='flex items-center justify-between text-sm'
                    >
                      <div className='flex items-center gap-2'>
                        <div className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                        <span className='text-foreground/80'>{l.language}</span>
                      </div>
                      <span className='text-muted-foreground text-xs font-mono'>
                        {l.count} ({l.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skill Ratings */}
            <Card className='glass-card border-border/50'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5 text-[hsl(var(--amber))]' />
                  Skill Ratings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TooltipProvider delayDuration={200}>
                  <div className='space-y-3'>
                    {skillRatings.map((s) => (
                      <Tooltip key={s.skill}>
                        <TooltipTrigger asChild>
                          <div className='cursor-pointer rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-surface-2 group'>
                            <div className='flex items-center justify-between text-sm mb-1'>
                              <span className='text-foreground/80 text-xs'>
                                {s.skill}
                              </span>
                              <div className='flex items-center gap-1'>
                                {trendIcon(s.trend)}
                                <span className='text-xs font-mono text-muted-foreground'>
                                  {s.rating}
                                </span>
                              </div>
                            </div>
                            <div className='h-1.5 bg-surface-3 rounded-full overflow-hidden'>
                              <div
                                className='h-full rounded-full bg-primary/70 transition-all duration-700 group-hover:bg-primary'
                                style={{ width: `${s.rating}%` }}
                              />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side='left'
                          className='text-xs space-y-1 max-w-[200px]'
                        >
                          <p className='font-semibold'>{s.skill}</p>
                          <p>Rating: {s.rating}/100</p>
                          <p>
                            Trend:{' '}
                            {s.trend === 'up'
                              ? '📈 Improving'
                              : s.trend === 'down'
                                ? '📉 Declining'
                                : '➡️ Stable'}
                          </p>
                          <p className='text-muted-foreground'>
                            {s.rating >= 70
                              ? 'Strong skill area'
                              : s.rating >= 50
                                ? 'Room for improvement'
                                : 'Focus area recommended'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contribution Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className='mb-8'
        >
          <Card className='glass-card border-border/50'>
            <CardHeader>
              <CardTitle className='text-lg flex items-center gap-2'>
                <Calendar className='h-5 w-5 text-primary' />
                Contribution Heatmap
              </CardTitle>
              <CardDescription>
                Your coding activity over the past year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContributionGraph />
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className='glass-card border-border/50'>
            <CardHeader>
              <CardTitle className='text-lg'>Recent Submissions</CardTitle>
              <CardDescription>Your latest problem attempts</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Header row */}
              <div className='hidden sm:grid sm:grid-cols-[1fr_100px_80px_80px_80px_80px] gap-2 text-xs text-muted-foreground font-medium pb-2 border-b border-border/30 mb-1'>
                <span>Problem</span>
                <span>Status</span>
                <span>Language</span>
                <span>Runtime</span>
                <span>Memory</span>
                <span className='text-right'>When</span>
              </div>
              <div className='divide-y divide-border/30'>
                {recentSubmissions.map((sub, i) => (
                  <div
                    key={i}
                    className='py-3 sm:grid sm:grid-cols-[1fr_100px_80px_80px_80px_80px] sm:gap-2 sm:items-center flex flex-col gap-1.5'
                  >
                    <div className='flex items-center gap-2.5'>
                      <div
                        className={`p-1 rounded-md ${sub.status === 'Accepted' ? 'bg-primary/10' : 'bg-destructive/10'}`}
                      >
                        {sub.status === 'Accepted' ? (
                          <CheckCircle className='h-3.5 w-3.5 text-primary' />
                        ) : (
                          <Code2 className='h-3.5 w-3.5 text-destructive' />
                        )}
                      </div>
                      <div>
                        <span className='text-sm font-medium'>
                          {sub.problem}
                        </span>
                        <span
                          className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                            sub.difficulty === 'Easy'
                              ? 'difficulty-easy'
                              : sub.difficulty === 'Medium'
                                ? 'difficulty-medium'
                                : 'difficulty-hard'
                          }`}
                        >
                          {sub.difficulty}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`text-xs font-medium ${sub.status === 'Accepted' ? 'text-primary' : 'text-destructive'}`}
                    >
                      {sub.status}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {sub.language}
                    </div>
                    <div className='text-xs text-muted-foreground font-mono'>
                      {sub.time}
                    </div>
                    <div className='text-xs text-muted-foreground font-mono'>
                      {sub.memory}
                    </div>
                    <div className='text-xs text-muted-foreground text-right'>
                      {sub.date}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
