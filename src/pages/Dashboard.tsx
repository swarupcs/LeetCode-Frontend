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
  Zap,
  BarChart3,
  PieChart,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ContributionGraph from '@/components/ContributionGraph';
import { useGetUserHeatMapData } from '@/hooks/user-stats/useGetUserHeatMapData';
import { useGetUserSolvedStats } from '@/hooks/user-stats/useGetUserSolvedStats';
import { useGetUserProgressData } from '@/hooks/user-stats/useGetUserProgressData';


const LANGUAGE_COLORS: Record<string, string> = {
  python: 'bg-[hsl(var(--cyan))]',
  javascript: 'bg-[hsl(var(--amber))]',
  java: 'bg-[hsl(var(--rose))]',
  'c++': 'bg-[hsl(var(--emerald))]',
  typescript: 'bg-[hsl(var(--primary))]',
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { heatMapData, isLoading: isHeatMapLoading } = useGetUserHeatMapData();
  const { solvedStats, isLoading: isSolvedLoading } = useGetUserSolvedStats();
  const { progressData, isLoading: isProgressLoading } =
    useGetUserProgressData();

  const isLoading = isHeatMapLoading || isSolvedLoading || isProgressLoading;

  // ── solved stats ─────────────────────────────────────────────────────────
  const easySolved = solvedStats?.difficultyStats.EASY ?? 0;
  const mediumSolved = solvedStats?.difficultyStats.MEDIUM ?? 0;
  const hardSolved = solvedStats?.difficultyStats.HARD ?? 0;
  const easyTotal = solvedStats?.totalDifficultyCounts.EASY ?? 0;
  const mediumTotal = solvedStats?.totalDifficultyCounts.MEDIUM ?? 0;
  const hardTotal = solvedStats?.totalDifficultyCounts.HARD ?? 0;
  const totalSolved = easySolved + mediumSolved + hardSolved;
  const totalAvailable = easyTotal + mediumTotal + hardTotal;
  const currentStreak = solvedStats?.currentStreak ?? 0;
  const maxStreak = solvedStats?.maxStreak ?? 0;
  const totalSubmissions = solvedStats?.totalSubmissions ?? 0;
  const acceptanceRate = solvedStats?.acceptanceRate ?? 0;

  const difficultyData = useMemo(
    () => [
      {
        level: 'Easy',
        solved: easySolved,
        total: easyTotal,
        color: 'bg-[hsl(var(--emerald))]',
        textColor: 'text-[hsl(var(--emerald))]',
      },
      {
        level: 'Medium',
        solved: mediumSolved,
        total: mediumTotal,
        color: 'bg-[hsl(var(--amber))]',
        textColor: 'text-[hsl(var(--amber))]',
      },
      {
        level: 'Hard',
        solved: hardSolved,
        total: hardTotal,
        color: 'bg-[hsl(var(--rose))]',
        textColor: 'text-[hsl(var(--rose))]',
      },
    ],
    [easySolved, mediumSolved, hardSolved, easyTotal, mediumTotal, hardTotal],
  );

  // ── topic progress from tagStats ─────────────────────────────────────────
  const topicProgress = useMemo(() => {
    if (!solvedStats) return [];
    return Object.entries(solvedStats.tagStats)
      .map(([tag, solved]) => {
        const total = solvedStats.totalTagCounts[tag] ?? solved;
        const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
        return { topic: tag, solved, total, percentage };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [solvedStats]);

  // ── progress data ─────────────────────────────────────────────────────────
  const weeklyData = progressData?.weeklyData ?? [];
  const monthlyTrend = progressData?.monthlyTrend ?? [];
  const recentSubmissions = progressData?.recentSubmissions ?? [];
  const languageStats = (progressData?.languageStats ?? []).map((l) => ({
    ...l,
    color: LANGUAGE_COLORS[l.language.toLowerCase()] ?? 'bg-primary/70',
  }));

  // ── weekly summary ────────────────────────────────────────────────────────
  const weeklyStats = useMemo(() => {
    if (!weeklyData.length)
      return { total: 0, avg: '0.0', best: 0, activeDays: 0 };
    const total = weeklyData.reduce((a, b) => a + b.problems, 0);
    return {
      total,
      avg: (total / weeklyData.length).toFixed(1),
      best: Math.max(...weeklyData.map((d) => d.problems)),
      activeDays: weeklyData.filter((d) => d.problems > 0).length,
    };
  }, [weeklyData]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

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
              sub: `${totalSubmissions} submissions`,
            },
            {
              label: 'Easy Solved',
              value: easySolved,
              icon: TrendingUp,
              color: 'text-[hsl(var(--emerald))]',
              sub: `of ${easyTotal}`,
            },
            {
              label: 'Hard Solved',
              value: hardSolved,
              icon: Zap,
              color: 'text-[hsl(var(--rose))]',
              sub: `of ${hardTotal}`,
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
          {/* Progress Ring */}
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
                      strokeDasharray={`${totalAvailable > 0 ? (totalSolved / totalAvailable) * 408.4 : 0} 408.4`}
                      strokeLinecap='round'
                      className='transition-all duration-1000'
                    />
                  </svg>
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <span className='text-3xl font-bold'>
                      {totalAvailable > 0
                        ? Math.round((totalSolved / totalAvailable) * 100)
                        : 0}
                      %
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
                          style={{
                            width: `${d.total > 0 ? (d.solved / d.total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='lg:col-span-2'
          >
            <Card className='glass-card border-border/50 h-full'>
              <CardHeader>
                <CardTitle className='text-lg'>Activity Overview</CardTitle>
                <CardDescription>Submissions & progress trends</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue='weekly' className='w-full'>
                  <TabsList className='mb-4'>
                    <TabsTrigger value='weekly'>This Week</TabsTrigger>
                    <TabsTrigger value='monthly'>Monthly</TabsTrigger>
                  </TabsList>

                  <TabsContent value='weekly'>
                    {weeklyData.length > 0 ? (
                      <>
                        <div className='flex items-end justify-between gap-2 h-[180px] mb-4'>
                          {weeklyData.map((day, i) => {
                            const maxCount = Math.max(
                              ...weeklyData.map((d) => d.problems),
                            );
                            const height =
                              maxCount > 0
                                ? (day.problems / maxCount) * 150
                                : 0;
                            return (
                              <div
                                key={i}
                                className='flex-1 flex flex-col items-center gap-2'
                              >
                                <span className='text-xs font-medium text-muted-foreground'>
                                  {day.problems}
                                </span>
                                <div
                                  className='w-full max-w-[40px] bg-primary/80 rounded-t-md hover:bg-primary transition-all duration-300 cursor-pointer'
                                  style={{ height: `${Math.max(height, 4)}px` }}
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
                            { label: 'This Week', value: weeklyStats.total },
                            { label: 'Daily Avg', value: weeklyStats.avg },
                            { label: 'Best Day', value: weeklyStats.best },
                            {
                              label: 'Active Days',
                              value: weeklyStats.activeDays,
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
                      </>
                    ) : (
                      <div className='flex items-center justify-center h-[180px] text-muted-foreground text-sm'>
                        No activity this week.
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value='monthly'>
                    {monthlyTrend.length > 0 ? (
                      <>
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
                      </>
                    ) : (
                      <div className='flex items-center justify-center h-[180px] text-muted-foreground text-sm'>
                        No monthly data available.
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Topic Progress + Language sidebar */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
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
                {topicProgress.length > 0 ? (
                  <TooltipProvider delayDuration={200}>
                    <div className='space-y-3'>
                      {topicProgress.map((t) => (
                        <Tooltip key={t.topic}>
                          <TooltipTrigger asChild>
                            <div className='group cursor-pointer rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-surface-2'>
                              <div className='flex items-center justify-between text-sm mb-1'>
                                <span className='font-medium text-foreground/90 capitalize'>
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
                            <p className='font-semibold capitalize'>
                              {t.topic}
                            </p>
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
                ) : (
                  <p className='text-sm text-muted-foreground text-center py-8'>
                    Solve some problems to see topic progress.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Language Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className='glass-card border-border/50 h-full'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <PieChart className='h-5 w-5 text-accent' />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {languageStats.length > 0 ? (
                  <>
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
                            <div
                              className={`w-2.5 h-2.5 rounded-sm ${l.color}`}
                            />
                            <span className='text-foreground/80'>
                              {l.language}
                            </span>
                          </div>
                          <span className='text-muted-foreground text-xs font-mono'>
                            {l.count} ({l.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className='text-sm text-muted-foreground text-center py-8'>
                    No submission data yet.
                  </p>
                )}
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
              <ContributionGraph data={heatMapData} />
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
              <div className='hidden sm:grid sm:grid-cols-[1fr_120px_90px_80px_80px_80px] gap-2 text-xs text-muted-foreground font-medium pb-2 border-b border-border/30 mb-1'>
                <span>Problem</span>
                <span>Status</span>
                <span>Language</span>
                <span>Runtime</span>
                <span>Memory</span>
                <span className='text-right'>When</span>
              </div>
              {recentSubmissions.length > 0 ? (
                <div className='divide-y divide-border/30'>
                  {recentSubmissions.map((sub, i) => (
                    <div
                      key={i}
                      className='py-3 sm:grid sm:grid-cols-[1fr_120px_90px_80px_80px_80px] sm:gap-2 sm:items-center flex flex-col gap-1.5'
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
              ) : (
                <p className='text-sm text-muted-foreground text-center py-8'>
                  No submissions yet. Start solving problems!
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
