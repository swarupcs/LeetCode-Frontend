import { useMemo, useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Trophy,
  Brain,
  BarChart2,
  Layers,
  ArrowRight,
  Lock,
  Activity,
  Hash,
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
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  primary: '#22c55e',
  accent: '#a78bfa',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  cyan: '#06b6d4',
  track: 'rgba(255,255,255,0.07)',
} as const;

const LANG_COLOR: Record<string, string> = {
  python: C.cyan,
  javascript: C.amber,
  java: C.rose,
  'c++': C.emerald,
  typescript: C.primary,
};

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({
  value,
  suffix = '',
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);
  useEffect(
    () => spring.on('change', (v) => setDisplay(Math.round(v))),
    [spring],
  );
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

// ─── Glowing progress bar ─────────────────────────────────────────────────────
function GlowBar({
  pct,
  color,
  height = 5,
  glow = true,
}: {
  pct: number;
  color: string;
  height?: number;
  glow?: boolean;
}) {
  return (
    <div
      style={{
        width: '100%',
        height,
        borderRadius: 9999,
        backgroundColor: C.track,
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        viewport={{ once: true }}
        style={{
          height: '100%',
          borderRadius: 9999,
          backgroundColor: color,
          boxShadow: glow ? `0 0 8px ${color}80` : 'none',
        }}
      />
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  sub: string;
  progress: number;
  suffix?: string;
}
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
  progress,
  suffix = '',
}: StatCardProps) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Card className='glass-card border-border/40 h-full overflow-hidden relative'>
        <div
          className='absolute top-0 left-0 right-0 h-[2px]'
          style={{
            backgroundColor: color,
            opacity: 0.7,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
        <CardContent className='p-4 flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <div
              className='p-1.5 rounded-md'
              style={{
                backgroundColor: `${color}18`,
                border: `1px solid ${color}30`,
              }}
            >
              <Icon className='h-3.5 w-3.5' style={{ color }} />
            </div>
            <span className='text-[10px] text-muted-foreground font-mono'>
              {sub}
            </span>
          </div>
          <div className='text-2xl font-black tabular-nums' style={{ color }}>
            <AnimatedNumber value={value} suffix={suffix} />
          </div>
          <div className='text-[11px] text-muted-foreground'>{label}</div>
          <GlowBar pct={progress} color={color} height={3} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({
  icon: Icon,
  title,
  sub,
  color = C.primary,
}: {
  icon: React.ElementType;
  title: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className='flex items-center gap-3 mb-5'>
      <div
        className='p-2 rounded-xl'
        style={{
          backgroundColor: `${color}15`,
          border: `1px solid ${color}25`,
        }}
      >
        <Icon className='h-4 w-4' style={{ color }} />
      </div>
      <div>
        <h2 className='text-sm font-bold'>{title}</h2>
        {sub && <p className='text-[11px] text-muted-foreground'>{sub}</p>}
      </div>
    </div>
  );
}

// ─── Guest Dashboard ──────────────────────────────────────────────────────────
function GuestDashboard() {
  const features = [
    {
      icon: BarChart2,
      color: C.primary,
      title: 'Live Progress Tracking',
      desc: 'Difficulty breakdowns, acceptance rates, and streaks mapped in real time.',
    },
    {
      icon: Brain,
      color: C.accent,
      title: 'Topic Mastery Radar',
      desc: 'Pinpoint weak spots across Arrays, DP, Graphs, Trees and 20+ categories.',
    },
    {
      icon: Flame,
      color: C.amber,
      title: 'Streak Engine',
      desc: 'Daily streak counter with a GitHub-style heatmap to build consistency.',
    },
    {
      icon: Trophy,
      color: C.rose,
      title: 'Badges & Leaderboard',
      desc: 'Earn milestone badges and climb the global leaderboard.',
    },
    {
      icon: Layers,
      color: C.cyan,
      title: 'Language Breakdown',
      desc: 'Python vs JS vs Java split across all your submissions.',
    },
    {
      icon: Activity,
      color: C.emerald,
      title: 'Submission Analytics',
      desc: 'Runtime percentiles, memory usage, and trend lines per problem.',
    },
  ];

  const mockBars = [45, 80, 30, 95, 60, 75, 20];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const mockStats = [
    { label: 'Solved', val: 247, color: C.primary, pct: 62 },
    { label: 'Streak', val: 23, color: C.amber, pct: 77 },
    { label: 'Accept', val: 81, color: C.emerald, pct: 81 },
    { label: 'Hard', val: 34, color: C.rose, pct: 34 },
  ];

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* Ambient blobs */}
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div
          className='absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full opacity-[0.05]'
          style={{
            background: `radial-gradient(circle, ${C.primary}, transparent 70%)`,
          }}
        />
        <div
          className='absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full opacity-[0.04]'
          style={{
            background: `radial-gradient(circle, ${C.accent}, transparent 70%)`,
          }}
        />
        {/* Dot grid */}
        <div
          className='absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage: `radial-gradient(circle, ${C.primary} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14'>
        {/* ── Hero split layout ─────────────────────────────────────────── */}
        <div className='grid lg:grid-cols-2 gap-14 items-center mb-24'>
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono mb-7'
              style={{
                borderColor: `${C.primary}40`,
                backgroundColor: `${C.primary}08`,
                color: C.primary,
              }}
            >
              <span
                className='w-1.5 h-1.5 rounded-full animate-pulse'
                style={{ backgroundColor: C.primary }}
              />
              DASHBOARD LOCKED — SIGN IN TO ACCESS
            </motion.div>

            <h1 className='text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-5'>
              Your coding
              <br />
              <span
                style={{
                  background: `linear-gradient(130deg, ${C.primary} 0%, ${C.cyan} 50%, ${C.accent} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                command room.
              </span>
            </h1>

            <p className='text-muted-foreground leading-relaxed mb-9 max-w-md'>
              Every rep tracked. Every weak spot exposed. Every streak
              celebrated. Sign in and see your real numbers.
            </p>
          </motion.div>

          {/* Right: blurred preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className='relative'
          >
            {/* Lock overlay */}
            <div
              className='absolute inset-0 z-20 rounded-2xl flex flex-col items-center justify-center'
              style={{
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(3px)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.8, repeat: Infinity }}
                className='p-4 rounded-2xl mb-3'
                style={{
                  backgroundColor: `${C.primary}15`,
                  border: `1px solid ${C.primary}35`,
                  boxShadow: `0 0 32px ${C.primary}25`,
                }}
              >
                <Lock className='h-7 w-7' style={{ color: C.primary }} />
              </motion.div>
              <p className='text-sm font-bold'>Sign in to unlock live stats</p>
              <p className='text-xs text-muted-foreground mt-1'>
                Your real numbers are waiting
              </p>
            </div>

            {/* Blurred mock */}
            <div
              className='blur-sm opacity-50 pointer-events-none select-none rounded-2xl p-5 border border-border/15'
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className='grid grid-cols-2 gap-3 mb-4'>
                {mockStats.map((s, i) => (
                  <div
                    key={i}
                    className='rounded-xl p-3'
                    style={{
                      backgroundColor: `${s.color}10`,
                      border: `1px solid ${s.color}20`,
                    }}
                  >
                    <div
                      className='text-2xl font-black'
                      style={{ color: s.color }}
                    >
                      {s.val}
                    </div>
                    <div className='text-[10px] text-muted-foreground mb-2'>
                      {s.label}
                    </div>
                    <div
                      className='h-1 rounded-full overflow-hidden'
                      style={{ backgroundColor: C.track }}
                    >
                      <div
                        className='h-full rounded-full'
                        style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                className='rounded-xl p-4'
                style={{
                  backgroundColor: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className='text-[10px] text-muted-foreground font-mono mb-3 uppercase tracking-widest'>
                  Weekly Activity
                </div>
                <div className='flex items-end gap-2 h-24'>
                  {mockBars.map((h, i) => (
                    <div
                      key={i}
                      className='flex-1 flex flex-col items-center gap-1.5'
                    >
                      <div
                        className='w-full rounded-t'
                        style={{
                          height: `${h}%`,
                          backgroundColor: C.primary,
                          opacity: 0.65,
                        }}
                      />
                      <span className='text-[9px] text-muted-foreground font-mono'>
                        {days[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Feature grid ─────────────────────────────────────────────────── */}
        <div className='mb-20'>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-10'
          >
            <h2 className='text-2xl font-black mb-2'>
              Six tools. One dashboard.
            </h2>
            <p className='text-muted-foreground text-sm'>
              Everything you need to go from random grinding to deliberate
              growth.
            </p>
          </motion.div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div
                  className='h-full rounded-xl p-5 border cursor-default transition-all duration-300'
                  style={{
                    borderColor: 'rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = `${f.color}30`;
                    el.style.background = `${f.color}06`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = 'rgba(255,255,255,0.06)';
                    el.style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <div className='flex gap-4 items-start'>
                    <div
                      className='p-2.5 rounded-xl shrink-0 mt-0.5'
                      style={{
                        backgroundColor: `${f.color}15`,
                        border: `1px solid ${f.color}25`,
                      }}
                    >
                      <f.icon className='h-5 w-5' style={{ color: f.color }} />
                    </div>
                    <div>
                      <h3 className='text-sm font-bold mb-1.5'>{f.title}</h3>
                      <p className='text-xs text-muted-foreground leading-relaxed'>
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='relative rounded-2xl overflow-hidden p-12 text-center'
          style={{
            border: `1px solid ${C.primary}25`,
            background: `linear-gradient(135deg, ${C.primary}08, ${C.accent}05, ${C.cyan}05)`,
          }}
        >
          <div
            className='absolute inset-0 pointer-events-none'
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${C.primary}14, transparent 65%)`,
            }}
          />
          <div className='relative'>
            <div className='text-5xl mb-5'>🏆</div>
            <h2 className='text-3xl font-black mb-3'>Ready to dominate?</h2>
            <p className='text-muted-foreground mb-8 max-w-sm mx-auto'>
              Join engineers who track every rep, celebrate every streak, and
              crush every weak spot.
            </p>
            <Link to='/signup'>
              <Button
                size='lg'
                className='gap-2 font-black px-12 text-base'
                style={{
                  background: `linear-gradient(135deg, ${C.primary}, ${C.emerald})`,
                  color: '#000',
                  border: 'none',
                  boxShadow: `0 0 40px ${C.primary}55`,
                }}
              >
                Get Started Free <ArrowRight className='h-5 w-5' />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Authenticated Dashboard ──────────────────────────────────────────────────
function AuthenticatedDashboard() {
  const { heatMapData, isLoading: l1 } = useGetUserHeatMapData();
  const { solvedStats, isLoading: l2 } = useGetUserSolvedStats();
  const { progressData, isLoading: l3 } = useGetUserProgressData();

  const weeklyData = progressData?.weeklyData ?? [];

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

  if (l1 || l2 || l3)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className='h-8 w-8' style={{ color: C.primary }} />
          </motion.div>
          <p className='text-xs text-muted-foreground font-mono tracking-wider'>
            LOADING STATS…
          </p>
        </div>
      </div>
    );

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
  const totalSubs = solvedStats?.totalSubmissions ?? 0;
  const acceptRate = solvedStats?.acceptanceRate ?? 0;
  const overallPct =
    totalAvailable > 0 ? Math.round((totalSolved / totalAvailable) * 100) : 0;
  const circumference = 2 * Math.PI * 65;

  const statCards = [
    {
      label: 'Problems Solved',
      value: totalSolved,
      color: C.primary,
      icon: CheckCircle,
      sub: `of ${totalAvailable}`,
      progress: totalAvailable > 0 ? (totalSolved / totalAvailable) * 100 : 0,
    },
    {
      label: 'Current Streak',
      value: currentStreak,
      color: C.amber,
      icon: Flame,
      sub: 'days active',
      progress: maxStreak > 0 ? (currentStreak / maxStreak) * 100 : 0,
      suffix: 'd',
    },
    {
      label: 'Max Streak',
      value: maxStreak,
      color: C.accent,
      icon: Award,
      sub: 'personal best',
      progress: 100,
      suffix: 'd',
    },
    {
      label: 'Acceptance Rate',
      value: acceptRate,
      color: C.emerald,
      icon: Target,
      sub: `${totalSubs} submissions`,
      progress: acceptRate,
      suffix: '%',
    },
    {
      label: 'Easy Solved',
      value: easySolved,
      color: C.emerald,
      icon: TrendingUp,
      sub: `of ${easyTotal}`,
      progress: easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0,
    },
    {
      label: 'Hard Solved',
      value: hardSolved,
      color: C.rose,
      icon: Zap,
      sub: `of ${hardTotal}`,
      progress: hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0,
    },
  ];

  const difficultyData = [
    { level: 'Easy', solved: easySolved, total: easyTotal, color: C.emerald },
    {
      level: 'Medium',
      solved: mediumSolved,
      total: mediumTotal,
      color: C.amber,
    },
    { level: 'Hard', solved: hardSolved, total: hardTotal, color: C.rose },
  ];

  const monthlyTrend = progressData?.monthlyTrend ?? [];
  const recentSubmissions = progressData?.recentSubmissions ?? [];
  const languageStats = (progressData?.languageStats ?? []).map((l) => ({
    ...l,
    color: LANG_COLOR[l.language.toLowerCase()] ?? C.primary,
  }));

  return (
    <div className='min-h-screen relative'>
      {/* Top ambient glow */}
      <div
        className='pointer-events-none absolute top-0 left-0 right-0 h-80 opacity-[0.04]'
        style={{
          background: `radial-gradient(ellipse at 50% -20%, ${C.primary}, transparent 70%)`,
        }}
      />
      {/* Dot grid */}
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.02]'
        style={{
          backgroundImage: `radial-gradient(circle, ${C.primary} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex items-end justify-between mb-8'
        >
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <span
                className='w-2 h-2 rounded-full animate-pulse'
                style={{
                  backgroundColor: C.primary,
                  boxShadow: `0 0 6px ${C.primary}`,
                }}
              />
              <span className='text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]'>
                Live Dashboard
              </span>
            </div>
            <h1 className='text-4xl font-black tracking-tight'>
              Command Centre
            </h1>
          </div>
          <div className='hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground font-mono'>
            <Hash className='h-3 w-3' />
            {totalSubs.toLocaleString()} submissions
          </div>
        </motion.div>

        {/* ── Stat cards ─────────────────────────────────────────────────── */}
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6'>
          {statCards.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <StatCard {...c} />
            </motion.div>
          ))}
        </div>

        {/* ── Row 1: Ring + Activity ──────────────────────────────────────── */}
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-5 mb-5'>
          {/* Ring card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className='lg:col-span-2'
          >
            <Card className='glass-card border-border/40 h-full'>
              <CardContent className='p-6 flex flex-col items-center'>
                <SectionHeading
                  icon={Target}
                  title='Overall Progress'
                  sub='All difficulties combined'
                />
                <div className='relative w-44 h-44 mb-6'>
                  <svg className='w-44 h-44 -rotate-90' viewBox='0 0 160 160'>
                    <circle
                      cx='80'
                      cy='80'
                      r='65'
                      stroke='rgba(255,255,255,0.06)'
                      strokeWidth='10'
                      fill='transparent'
                    />
                    <motion.circle
                      cx='80'
                      cy='80'
                      r='65'
                      stroke={C.primary}
                      strokeWidth='10'
                      fill='transparent'
                      strokeLinecap='round'
                      initial={{ strokeDasharray: `0 ${circumference}` }}
                      animate={{
                        strokeDasharray: `${(overallPct / 100) * circumference} ${circumference}`,
                      }}
                      transition={{
                        duration: 1.5,
                        ease: 'easeOut',
                        delay: 0.3,
                      }}
                      style={{ filter: `drop-shadow(0 0 8px ${C.primary}90)` }}
                    />
                  </svg>
                  <div className='absolute inset-0 flex flex-col items-center justify-center'>
                    <span
                      className='text-4xl font-black'
                      style={{ color: C.primary }}
                    >
                      <AnimatedNumber value={overallPct} suffix='%' />
                    </span>
                    <span className='text-xs text-muted-foreground font-mono'>
                      {totalSolved}/{totalAvailable}
                    </span>
                  </div>
                </div>
                <div className='w-full space-y-3'>
                  {difficultyData.map((d) => (
                    <div key={d.level}>
                      <div className='flex justify-between text-xs mb-1.5'>
                        <span className='font-bold' style={{ color: d.color }}>
                          {d.level}
                        </span>
                        <span className='text-muted-foreground font-mono tabular-nums'>
                          {d.solved}/{d.total}
                        </span>
                      </div>
                      <GlowBar
                        pct={d.total > 0 ? (d.solved / d.total) * 100 : 0}
                        color={d.color}
                        height={6}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className='lg:col-span-3'
          >
            <Card className='glass-card border-border/40 h-full'>
              <CardContent className='p-6 h-full flex flex-col'>
                <SectionHeading
                  icon={Activity}
                  title='Activity Overview'
                  sub='Submissions & trends'
                />
                <Tabs defaultValue='weekly' className='flex-1 flex flex-col'>
                  <TabsList className='bg-surface-2/50 border border-border/30 mb-5 w-fit'>
                    <TabsTrigger
                      value='weekly'
                      className='text-xs data-[state=active]:text-primary'
                    >
                      This Week
                    </TabsTrigger>
                    <TabsTrigger
                      value='monthly'
                      className='text-xs data-[state=active]:text-primary'
                    >
                      Monthly
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value='weekly'
                    className='flex-1 flex flex-col m-0'
                  >
                    {weeklyData.length > 0 ? (
                      <>
                        <div className='flex items-end justify-between gap-2 h-[140px] mb-5'>
                          {weeklyData.map((day, i) => {
                            const maxC = Math.max(
                              ...weeklyData.map((d) => d.problems),
                            );
                            const h =
                              maxC > 0 ? (day.problems / maxC) * 110 : 0;
                            return (
                              <div
                                key={i}
                                className='flex-1 flex flex-col items-center gap-2 group'
                              >
                                <span className='text-[10px] font-mono text-muted-foreground group-hover:text-primary transition-colors'>
                                  {day.problems}
                                </span>
                                <motion.div
                                  className='w-full max-w-[36px] rounded-t-md'
                                  initial={{ height: 0 }}
                                  animate={{ height: `${Math.max(h, 3)}px` }}
                                  transition={{
                                    delay: 0.3 + i * 0.06,
                                    duration: 0.5,
                                  }}
                                  whileHover={{
                                    boxShadow: `0 0 14px ${C.primary}70`,
                                    opacity: 1,
                                  }}
                                  style={{
                                    backgroundColor: C.primary,
                                    opacity: 0.65,
                                  }}
                                />
                                <span className='text-[10px] text-muted-foreground font-mono'>
                                  {day.day}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className='grid grid-cols-4 gap-3 pt-4 border-t border-border/20 mt-auto'>
                          {[
                            ['This Week', weeklyStats.total],
                            ['Daily Avg', weeklyStats.avg],
                            ['Best Day', weeklyStats.best],
                            ['Active Days', weeklyStats.activeDays],
                          ].map(([l, v]) => (
                            <div key={String(l)} className='text-center'>
                              <div
                                className='text-lg font-black tabular-nums'
                                style={{ color: C.primary }}
                              >
                                {v}
                              </div>
                              <div className='text-[10px] text-muted-foreground'>
                                {l}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className='flex-1 flex items-center justify-center text-sm text-muted-foreground'>
                        No activity this week.
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent
                    value='monthly'
                    className='flex-1 flex flex-col m-0'
                  >
                    {monthlyTrend.length > 0 ? (
                      <>
                        <div className='flex items-end justify-between gap-2 h-[140px] mb-5'>
                          {monthlyTrend.map((m, i) => {
                            const maxS = Math.max(
                              ...monthlyTrend.map((d) => d.submissions),
                            );
                            return (
                              <div
                                key={i}
                                className='flex-1 flex flex-col items-center gap-2'
                              >
                                <span className='text-[10px] font-mono text-muted-foreground'>
                                  {m.solved}
                                </span>
                                <div
                                  className='w-full max-w-[36px] relative rounded-t overflow-hidden'
                                  style={{
                                    height: `${maxS > 0 ? (m.submissions / maxS) * 110 : 3}px`,
                                    backgroundColor: 'rgba(255,255,255,0.06)',
                                  }}
                                >
                                  <motion.div
                                    className='absolute bottom-0 w-full'
                                    initial={{ height: 0 }}
                                    animate={{
                                      height: `${maxS > 0 ? (m.solved / maxS) * 100 : 0}%`,
                                    }}
                                    transition={{
                                      delay: 0.3 + i * 0.04,
                                      duration: 0.5,
                                    }}
                                    style={{
                                      backgroundColor: C.primary,
                                      opacity: 0.8,
                                    }}
                                  />
                                </div>
                                <span className='text-[10px] text-muted-foreground font-mono'>
                                  {m.month}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className='flex gap-5 pt-4 border-t border-border/20 mt-auto text-xs text-muted-foreground'>
                          <div className='flex items-center gap-1.5'>
                            <div
                              className='w-3 h-2 rounded'
                              style={{ backgroundColor: C.primary }}
                            />
                            <span>Solved</span>
                          </div>
                          <div className='flex items-center gap-1.5'>
                            <div
                              className='w-3 h-2 rounded'
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                              }}
                            />
                            <span>Submissions</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className='flex-1 flex items-center justify-center text-sm text-muted-foreground'>
                        No monthly data.
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── Row 2: Topics + Languages ───────────────────────────────────── */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='lg:col-span-2'
          >
            <Card className='glass-card border-border/40 h-full'>
              <CardContent className='p-6'>
                <SectionHeading
                  icon={BookOpen}
                  title='Topic Mastery'
                  sub='Progress across all categories'
                  color={C.accent}
                />
                {topicProgress.length > 0 ? (
                  <TooltipProvider delayDuration={150}>
                    <div className='space-y-2'>
                      {topicProgress.map((t) => {
                        const bar =
                          t.pct >= 70
                            ? C.emerald
                            : t.pct >= 40
                              ? C.amber
                              : C.rose;
                        return (
                          <Tooltip key={t.topic}>
                            <TooltipTrigger asChild>
                              <div className='group cursor-pointer rounded-lg px-3 py-2 -mx-3 hover:bg-surface-2/40 transition-colors'>
                                <div className='flex justify-between text-xs mb-1.5'>
                                  <span className='font-semibold capitalize'>
                                    {t.topic}
                                  </span>
                                  <span className='font-mono text-muted-foreground tabular-nums'>
                                    {t.solved}/{t.total}{' '}
                                    <span
                                      className='font-bold'
                                      style={{ color: bar }}
                                    >
                                      {t.pct}%
                                    </span>
                                  </span>
                                </div>
                                <GlowBar
                                  pct={t.pct}
                                  color={bar}
                                  height={5}
                                  glow={t.pct >= 70}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side='left'
                              className='text-xs space-y-1'
                            >
                              <p className='font-bold capitalize'>{t.topic}</p>
                              <p className='text-muted-foreground'>
                                {t.total - t.solved} remaining
                              </p>
                              <p>
                                {t.pct >= 70
                                  ? '🎉 Crushing it'
                                  : t.pct >= 40
                                    ? '💪 Keep going'
                                    : '🎯 Needs focus'}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </TooltipProvider>
                ) : (
                  <p className='text-sm text-muted-foreground text-center py-8'>
                    Solve problems to see topic progress.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className='glass-card border-border/40 h-full'>
              <CardContent className='p-6'>
                <SectionHeading
                  icon={PieChart}
                  title='Languages'
                  color={C.cyan}
                />
                {languageStats.length > 0 ? (
                  <>
                    <div className='flex h-2.5 rounded-full overflow-hidden mb-5 gap-0.5'>
                      {languageStats.map((l) => (
                        <motion.div
                          key={l.language}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${l.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9 }}
                          style={{
                            backgroundColor: l.color,
                            boxShadow: `0 0 6px ${l.color}70`,
                          }}
                        />
                      ))}
                    </div>
                    <div className='space-y-3'>
                      {languageStats.map((l) => (
                        <div
                          key={l.language}
                          className='flex items-center justify-between'
                        >
                          <div className='flex items-center gap-2.5'>
                            <div
                              className='w-2 h-2 rounded-full'
                              style={{
                                backgroundColor: l.color,
                                boxShadow: `0 0 5px ${l.color}`,
                              }}
                            />
                            <span className='text-sm font-medium'>
                              {l.language}
                            </span>
                          </div>
                          <div>
                            <span
                              className='text-xs font-mono font-bold'
                              style={{ color: l.color }}
                            >
                              {l.percentage}%
                            </span>
                            <span className='text-[10px] text-muted-foreground font-mono ml-2'>
                              {l.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className='text-sm text-muted-foreground text-center py-8'>
                    No data yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── Heatmap ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='mb-5'
        >
          <Card className='glass-card border-border/40'>
            <CardContent className='p-6'>
              <SectionHeading
                icon={Calendar}
                title='Contribution Heatmap'
                sub='Coding activity over the past year'
              />
              <ContributionGraph data={heatMapData} />
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Recent Submissions ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className='glass-card border-border/40'>
            <CardContent className='p-6'>
              <SectionHeading
                icon={Code2}
                title='Recent Submissions'
                sub='Latest problem attempts'
                color={C.accent}
              />
              {recentSubmissions.length > 0 ? (
                <>
                  <div className='hidden sm:grid grid-cols-[1fr_120px_90px_80px_80px_80px] gap-3 px-3 py-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-b border-border/20 mb-1'>
                    <span>Problem</span>
                    <span>Status</span>
                    <span>Lang</span>
                    <span>Runtime</span>
                    <span>Memory</span>
                    <span className='text-right'>When</span>
                  </div>
                  <div className='divide-y divide-border/15'>
                    {recentSubmissions.map((sub, i) => {
                      const ok = sub.status === 'Accepted';
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.04 }}
                          className='sm:grid sm:grid-cols-[1fr_120px_90px_80px_80px_80px] gap-3 items-center px-3 py-3 rounded-lg hover:bg-surface-2/30 transition-colors flex flex-col'
                        >
                          <div className='flex items-center gap-2.5'>
                            <div
                              className='p-1 rounded shrink-0'
                              style={{
                                backgroundColor: ok
                                  ? `${C.primary}15`
                                  : `${C.rose}15`,
                              }}
                            >
                              {ok ? (
                                <CheckCircle
                                  className='h-3.5 w-3.5'
                                  style={{ color: C.primary }}
                                />
                              ) : (
                                <Code2
                                  className='h-3.5 w-3.5'
                                  style={{ color: C.rose }}
                                />
                              )}
                            </div>
                            <div>
                              <span className='text-sm font-medium'>
                                {sub.problem}
                              </span>
                              <span
                                className={`ml-2 text-[10px] px-1.5 py-0.5 rounded font-mono ${sub.difficulty === 'Easy' ? 'difficulty-easy' : sub.difficulty === 'Medium' ? 'difficulty-medium' : 'difficulty-hard'}`}
                              >
                                {sub.difficulty}
                              </span>
                            </div>
                          </div>
                          <div
                            className='text-xs font-bold font-mono'
                            style={{ color: ok ? C.primary : C.rose }}
                          >
                            {sub.status}
                          </div>
                          <div className='text-xs text-muted-foreground font-mono'>
                            {sub.language}
                          </div>
                          <div className='text-xs text-muted-foreground font-mono'>
                            {sub.time}
                          </div>
                          <div className='text-xs text-muted-foreground font-mono'>
                            {sub.memory}
                          </div>
                          <div className='text-xs text-muted-foreground font-mono text-right'>
                            {sub.date}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className='text-center py-14'>
                  <div className='text-4xl mb-4'>⚡</div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    No submissions yet.
                  </p>
                  <p className='text-xs text-muted-foreground/60 mt-1'>
                    Start solving to see your history here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <AuthenticatedDashboard /> : <GuestDashboard />;
}
