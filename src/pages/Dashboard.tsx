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

// ─────────────────────────────────────────────────────────────────────────────
// Colour palette
// We store Tailwind utility classes for elements whose class name is STATIC
// (safe from JIT purging), and hex values for inline `style={}` fills where
// the class would be dynamic (and thus purged).
// ─────────────────────────────────────────────────────────────────────────────
const COLOR = {
  // hex values — always work in inline style
  primary: '#22c55e', // adjust to match your theme's --primary
  accent: '#a78bfa',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  cyan: '#06b6d4',
  track: 'rgba(255,255,255,0.10)', // progress bar track
} as const;

// Language → hex colour
const LANG_COLOR: Record<string, string> = {
  python: COLOR.cyan,
  javascript: COLOR.amber,
  java: COLOR.rose,
  'c++': COLOR.emerald,
  typescript: COLOR.primary,
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

// ─────────────────────────────────────────────────────────────────────────────
// Shared ProgressBar — plain div + CSS transition (no Framer, no dynamic class)
// ─────────────────────────────────────────────────────────────────────────────
function ProgressBar({
  pct,
  color,
  height = 6,
}: {
  pct: number;
  color: string;
  height?: number;
}) {
  const w = `${Math.min(100, Math.max(0, pct))}%`;
  return (
    <div
      style={{
        width: '100%',
        height,
        borderRadius: 9999,
        overflow: 'hidden',
        backgroundColor: COLOR.track,
      }}
    >
      <div
        style={{
          width: w,
          height: '100%',
          borderRadius: 9999,
          backgroundColor: color,
          transition: 'width 0.75s ease-out',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StatCard
// ─────────────────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string; // hex
  sub: string;
  progress: number; // 0-100
  barColor: string; // hex
}

function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  sub,
  progress,
  barColor,
}: StatCardProps) {
  return (
    <Card className='glass-card border-border/50 h-full'>
      <CardContent className='p-5 flex flex-col h-full'>
        <div className='mb-3'>
          <div className='p-2 rounded-lg bg-surface-2 w-fit'>
            <Icon className='h-4 w-4' style={{ color: iconColor }} />
          </div>
        </div>
        <div className='text-2xl font-bold'>{value}</div>
        <div className='text-xs text-muted-foreground mt-0.5'>{label}</div>
        <div className='text-[10px] text-muted-foreground/70 mt-1'>{sub}</div>
        <div className='mt-auto pt-3 space-y-1'>
          <ProgressBar pct={progress} color={barColor} height={6} />
          <div className='text-[10px] text-muted-foreground/60 text-right'>
            {Math.round(Math.min(100, Math.max(0, progress)))}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { heatMapData, isLoading: isHeatMapLoading } = useGetUserHeatMapData();
  const { solvedStats, isLoading: isSolvedLoading } = useGetUserSolvedStats();
  const { progressData, isLoading: isProgressLoading } =
    useGetUserProgressData();
  const isLoading = isHeatMapLoading || isSolvedLoading || isProgressLoading;

  // solved stats
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

  const statCards: StatCardProps[] = useMemo(
    () => [
      {
        label: 'Problems Solved',
        value: totalSolved,
        icon: CheckCircle,
        iconColor: COLOR.primary,
        sub: `of ${totalAvailable}`,
        progress: totalAvailable > 0 ? (totalSolved / totalAvailable) * 100 : 0,
        barColor: COLOR.primary,
      },
      {
        label: 'Current Streak',
        value: `${currentStreak}d`,
        icon: Flame,
        iconColor: COLOR.amber,
        sub: 'Keep going!',
        progress: maxStreak > 0 ? (currentStreak / maxStreak) * 100 : 0,
        barColor: COLOR.amber,
      },
      {
        label: 'Max Streak',
        value: `${maxStreak}d`,
        icon: Award,
        iconColor: COLOR.accent,
        sub: 'Personal best',
        progress: maxStreak > 0 ? 100 : 0,
        barColor: COLOR.accent,
      },
      {
        label: 'Acceptance Rate',
        value: `${acceptanceRate}%`,
        icon: Target,
        iconColor: COLOR.emerald,
        sub: `${totalSubmissions} submissions`,
        progress: acceptanceRate,
        barColor:
          acceptanceRate >= 70
            ? COLOR.emerald
            : acceptanceRate >= 40
              ? COLOR.amber
              : COLOR.rose,
      },
      {
        label: 'Easy Solved',
        value: easySolved,
        icon: TrendingUp,
        iconColor: COLOR.emerald,
        sub: `of ${easyTotal}`,
        progress: easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0,
        barColor: COLOR.emerald,
      },
      {
        label: 'Hard Solved',
        value: hardSolved,
        icon: Zap,
        iconColor: COLOR.rose,
        sub: `of ${hardTotal}`,
        progress: hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0,
        barColor: COLOR.rose,
      },
    ],
    [
      totalSolved,
      totalAvailable,
      currentStreak,
      maxStreak,
      acceptanceRate,
      totalSubmissions,
      easySolved,
      easyTotal,
      hardSolved,
      hardTotal,
    ],
  );

  const difficultyData = useMemo(
    () => [
      {
        level: 'Easy',
        solved: easySolved,
        total: easyTotal,
        color: COLOR.emerald,
      },
      {
        level: 'Medium',
        solved: mediumSolved,
        total: mediumTotal,
        color: COLOR.amber,
      },
      {
        level: 'Hard',
        solved: hardSolved,
        total: hardTotal,
        color: COLOR.rose,
      },
    ],
    [easySolved, mediumSolved, hardSolved, easyTotal, mediumTotal, hardTotal],
  );

  const topicProgress = useMemo(() => {
    if (!solvedStats) return [];
    return Object.entries(solvedStats.tagStats)
      .map(([tag, solved]) => {
        const total = solvedStats.totalTagCounts[tag] ?? solved;
        const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
        return { topic: tag, solved, total, pct };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [solvedStats]);

  const weeklyData = progressData?.weeklyData ?? [];
  const monthlyTrend = progressData?.monthlyTrend ?? [];
  const recentSubmissions = progressData?.recentSubmissions ?? [];
  const languageStats = (progressData?.languageStats ?? []).map((l) => ({
    ...l,
    color: LANG_COLOR[l.language.toLowerCase()] ?? COLOR.primary,
  }));

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

        {/* ── Stat Cards ──────────────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial='hidden'
          animate='show'
          className='grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8'
        >
          {statCards.map((card, i) => (
            <motion.div key={i} variants={fadeUp}>
              <StatCard {...card} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Overall Progress + Activity ──────────────────────────────────── */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
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
                {/* Ring */}
                <div className='relative w-36 h-36 mb-5'>
                  <svg className='w-36 h-36 -rotate-90' viewBox='0 0 160 160'>
                    <circle
                      cx='80'
                      cy='80'
                      r='65'
                      stroke='rgba(255,255,255,0.1)'
                      strokeWidth='10'
                      fill='transparent'
                    />
                    <circle
                      cx='80'
                      cy='80'
                      r='65'
                      stroke={COLOR.primary}
                      strokeWidth='10'
                      fill='transparent'
                      strokeDasharray={`${totalAvailable > 0 ? (totalSolved / totalAvailable) * 408.4 : 0} 408.4`}
                      strokeLinecap='round'
                      style={{ transition: 'stroke-dasharray 1s ease-out' }}
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

                {/* Difficulty bars */}
                <div className='w-full space-y-3'>
                  {difficultyData.map((d) => (
                    <div key={d.level}>
                      <div className='flex justify-between text-sm mb-1.5'>
                        <span
                          className='font-medium'
                          style={{ color: d.color }}
                        >
                          {d.level}
                        </span>
                        <span className='text-muted-foreground'>
                          {d.solved}/{d.total}
                        </span>
                      </div>
                      <ProgressBar
                        pct={d.total > 0 ? (d.solved / d.total) * 100 : 0}
                        color={d.color}
                        height={8}
                      />
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
                                  className='w-full max-w-[40px] rounded-t-md cursor-pointer transition-opacity hover:opacity-100'
                                  style={{
                                    height: `${Math.max(height, 4)}px`,
                                    backgroundColor: COLOR.primary,
                                    opacity: 0.75,
                                  }}
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
                                    className='w-full rounded-t-md'
                                    style={{
                                      height: `${subH}px`,
                                      backgroundColor: COLOR.track,
                                    }}
                                  >
                                    <div
                                      className='absolute bottom-0 w-full rounded-t-md'
                                      style={{
                                        height: `${solvedH}px`,
                                        backgroundColor: COLOR.primary,
                                        opacity: 0.8,
                                      }}
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
                            <div
                              className='w-3 h-3 rounded-sm'
                              style={{
                                backgroundColor: COLOR.primary,
                                opacity: 0.8,
                              }}
                            />
                            <span>Solved</span>
                          </div>
                          <div className='flex items-center gap-1.5'>
                            <div
                              className='w-3 h-3 rounded-sm'
                              style={{ backgroundColor: COLOR.track }}
                            />
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

        {/* ── Topic Progress + Language ────────────────────────────────────── */}
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
                      {topicProgress.map((t) => {
                        const barColor =
                          t.pct >= 70
                            ? COLOR.emerald
                            : t.pct >= 40
                              ? COLOR.amber
                              : COLOR.rose;
                        return (
                          <Tooltip key={t.topic}>
                            <TooltipTrigger asChild>
                              <div className='group cursor-pointer rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-surface-2'>
                                <div className='flex items-center justify-between text-sm mb-1.5'>
                                  <span className='font-medium text-foreground/90 capitalize'>
                                    {t.topic}
                                  </span>
                                  <span className='text-muted-foreground text-xs'>
                                    {t.solved}/{t.total}
                                    <span className='ml-1.5 font-semibold text-foreground/70'>
                                      {t.pct}%
                                    </span>
                                  </span>
                                </div>
                                <ProgressBar
                                  pct={t.pct}
                                  color={barColor}
                                  height={8}
                                />
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
                                {t.pct >= 70
                                  ? 'Great progress! 🎉'
                                  : t.pct >= 40
                                    ? 'Keep practicing! 💪'
                                    : 'Needs more focus 🎯'}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
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
                    <div
                      className='flex h-3 rounded-full overflow-hidden mb-4'
                      style={{ backgroundColor: COLOR.track }}
                    >
                      {languageStats.map((l) => (
                        <div
                          key={l.language}
                          style={{
                            width: `${l.percentage}%`,
                            backgroundColor: l.color,
                            transition: 'width 0.5s ease',
                          }}
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
                              className='w-2.5 h-2.5 rounded-sm'
                              style={{ backgroundColor: l.color }}
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

        {/* ── Contribution Heatmap ─────────────────────────────────────────── */}
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

        {/* ── Recent Submissions ───────────────────────────────────────────── */}
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
