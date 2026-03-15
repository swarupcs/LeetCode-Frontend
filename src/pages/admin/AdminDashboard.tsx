// src/pages/admin/AdminDashboard.tsx
import { useState, useMemo } from 'react';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ListChecks,
  BookOpen,
  Plus,
  ArrowRight,
  Users,
  Activity,
  UserPlus,
  BarChart3,
  ArrowUpRight,
  CalendarIcon,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAdminDashboard } from '@/hooks/admin/useAdminDashboard';
import type { DateRange } from 'react-day-picker';

// ─── Design tokens ─────────────────────────────────────────────────────────────

const C = {
  // Chart strokes
  blue: 'hsl(210 100% 65%)',
  teal: 'hsl(168 78% 52%)',
  green: 'hsl(142 68% 50%)',
  amber: 'hsl(45 90% 56%)',
  red: 'hsl(4 75% 58%)',
  violet: 'hsl(258 82% 70%)',

  // Surfaces
  bg: 'hsl(222 32% 7%)',
  card: 'hsl(222 30% 9% / 0.75)',
  cardBdr: 'hsl(222 25% 16%)',
  grid: 'hsl(222 25% 12%)',
  axisTick: 'hsl(220 15% 38%)',

  // Text
  t1: 'hsl(220 18% 85%)',
  t2: 'hsl(220 15% 52%)',
  t3: 'hsl(220 15% 34%)',

  // Tooltip
  ttBg: 'hsl(222 35% 9%)',
  ttBdr: 'hsl(222 30% 20%)',
  ttTxt: 'hsl(220 18% 75%)',
} as const;

const TT = {
  backgroundColor: C.ttBg,
  border: `1px solid ${C.ttBdr}`,
  borderRadius: '10px',
  fontSize: '12px',
  color: C.ttTxt,
};

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS = [
  { label: '7d', days: 7 },
  { label: '14d', days: 14 },
  { label: '30d', days: 30 },
  { label: '60d', days: 60 },
  { label: '90d', days: 90 },
];

// ─── Accent definitions ───────────────────────────────────────────────────────

type AccentKey = 'blue' | 'teal' | 'violet' | 'amber' | 'green';

const ACCENTS: Record<
  AccentKey,
  { color: string; glow: string; ring: string }
> = {
  blue: {
    color: C.blue,
    glow: 'hsl(210 100% 50% / 0.10)',
    ring: 'hsl(210 100% 65% / 0.20)',
  },
  teal: {
    color: C.teal,
    glow: 'hsl(168 78% 40% / 0.10)',
    ring: 'hsl(168 78% 52% / 0.20)',
  },
  violet: {
    color: C.violet,
    glow: 'hsl(258 82% 50% / 0.10)',
    ring: 'hsl(258 82% 70% / 0.20)',
  },
  amber: {
    color: C.amber,
    glow: 'hsl(45 90% 45% / 0.10)',
    ring: 'hsl(45 90% 56% / 0.20)',
  },
  green: {
    color: C.green,
    glow: 'hsl(142 68% 40% / 0.10)',
    ring: 'hsl(142 68% 50% / 0.20)',
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(today, 29),
    to: today,
  });
  const [activePreset, setActivePreset] = useState<number>(30);

  const {
    analytics,
    summary,
    problemStats,
    sheets,
    isPending,
    isFetching,
    isError,
    error,
  } = useAdminDashboard(
    dateRange.from,
    dateRange.to,
    Boolean(dateRange.from && dateRange.to),
  );

  const handlePreset = (days: number) => {
    setActivePreset(days);
    setDateRange({ from: subDays(today, days - 1), to: today });
  };

  const handleRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
      setActivePreset(0);
    }
  };

  const xInterval = Math.max(1, Math.floor(analytics.length / 8));
  const summaryDays = summary?.days ?? activePreset;
  const dateLabel =
    dateRange.from && dateRange.to
      ? `${format(dateRange.from, 'MMM d')} – ${format(dateRange.to, 'MMM d, yyyy')}`
      : 'Custom range';

  return (
    <div className='relative'>
      {/* Ambient background glows */}
      <div
        aria-hidden
        className='pointer-events-none fixed inset-0 overflow-hidden'
        style={{ zIndex: 0 }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-8%',
            left: '-4%',
            width: '50%',
            height: '45%',
            background:
              'radial-gradient(ellipse, hsl(210 100% 50% / 0.055) 0%, transparent 65%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '38%',
            height: '38%',
            background:
              'radial-gradient(ellipse at 80% 20%, hsl(168 78% 45% / 0.045) 0%, transparent 65%)',
            filter: 'blur(55px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '30%',
            width: '40%',
            height: '30%',
            background:
              'radial-gradient(ellipse, hsl(258 82% 55% / 0.035) 0%, transparent 65%)',
            filter: 'blur(70px)',
          }}
        />
      </div>

      <div className='relative p-6 lg:p-8 max-w-7xl' style={{ zIndex: 1 }}>
        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5'>
            <div>
              <p
                style={{
                  color: C.blue,
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.17em',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Admin Console
              </p>
              <div className='flex items-center gap-2.5'>
                <h1
                  style={{
                    fontSize: '28px',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    background: `linear-gradient(125deg, ${C.t1} 0%, hsl(220 15% 58%) 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Dashboard
                </h1>
                {isFetching && !isPending && (
                  <Loader2
                    className='h-4 w-4 animate-spin'
                    style={{ color: C.blue, marginTop: '3px' }}
                  />
                )}
              </div>
              <p style={{ color: C.t3, fontSize: '13px', marginTop: '3px' }}>
                {summaryDays}-day window · Platform overview
              </p>
            </div>

            {/* Range picker */}
            <div className='flex items-center gap-1.5 flex-wrap'>
              {PRESETS.map((p) => {
                const active = activePreset === p.days;
                return (
                  <button
                    key={p.days}
                    onClick={() => handlePreset(p.days)}
                    style={{
                      height: '32px',
                      padding: '0 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      background: active
                        ? 'hsl(210 100% 65% / 0.13)'
                        : 'transparent',
                      color: active ? C.blue : C.t3,
                      border: active
                        ? `1px solid hsl(210 100% 65% / 0.32)`
                        : `1px solid ${C.cardBdr}`,
                      boxShadow: active
                        ? `0 0 14px hsl(210 100% 50% / 0.14)`
                        : 'none',
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    style={{
                      height: '32px',
                      padding: '0 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background:
                        activePreset === 0
                          ? 'hsl(210 100% 65% / 0.13)'
                          : 'transparent',
                      color: activePreset === 0 ? C.blue : C.t3,
                      border:
                        activePreset === 0
                          ? `1px solid hsl(210 100% 65% / 0.32)`
                          : `1px solid ${C.cardBdr}`,
                      transition: 'all 0.15s',
                    }}
                  >
                    <CalendarIcon style={{ width: '12px', height: '12px' }} />
                    {activePreset === 0 ? dateLabel : 'Custom'}
                  </button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='end'>
                  <Calendar
                    mode='range'
                    selected={dateRange}
                    onSelect={handleRangeChange}
                    numberOfMonths={2}
                    disabled={(d) => d > today}
                    initialFocus
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </motion.div>

        {/* ── Error ─────────────────────────────────────────────────────────── */}
        {isError && (
          <div
            style={{
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '13px',
              border: `1px solid hsl(4 75% 50% / 0.28)`,
              background: 'hsl(4 75% 50% / 0.07)',
              color: 'hsl(4 75% 65%)',
            }}
          >
            <AlertCircle
              style={{ width: '15px', height: '15px', flexShrink: 0 }}
            />
            <span>
              {(error as { message?: string })?.message ??
                'Failed to load dashboard data.'}
            </span>
          </div>
        )}

        {/* ── Metric cards ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className='grid grid-cols-2 lg:grid-cols-6 gap-3 mb-5'
        >
          <MetricCard
            icon={<Users className='h-4 w-4' />}
            label='Total Users'
            value={summary?.totalUsers}
            accent='blue'
            loading={isPending}
          />
          <MetricCard
            icon={<UserPlus className='h-4 w-4' />}
            label={`New · ${summaryDays}d`}
            value={summary?.newUsersInRange}
            accent='blue'
            loading={isPending}
            trend={summary ? `+${summary.userGrowthPct}%` : undefined}
          />
          <MetricCard
            icon={<Activity className='h-4 w-4' />}
            label='Avg Daily Active'
            value={summary?.avgDailyActive}
            accent='teal'
            loading={isPending}
          />
          <MetricCard
            icon={<BarChart3 className='h-4 w-4' />}
            label='Submissions'
            value={summary?.totalSubmissions}
            accent='violet'
            loading={isPending}
          />
          <MetricCard
            icon={<ListChecks className='h-4 w-4' />}
            label='Problems'
            value={problemStats?.total}
            accent='amber'
            loading={isPending}
          />
          <MetricCard
            icon={<BookOpen className='h-4 w-4' />}
            label='Sheets'
            value={isPending ? undefined : sheets.length}
            accent='green'
            loading={isPending}
          />
        </motion.div>

        {/* ── Charts ────────────────────────────────────────────────────────── */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5'>
          {/* Signups */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Panel
              label='New Signups'
              sub='Daily registrations'
              iconColor={C.blue}
              icon={<UserPlus className='h-3.5 w-3.5' />}
            >
              <div style={{ height: '190px' }}>
                {isPending ? (
                  <ChartSkeleton />
                ) : (
                  <ResponsiveContainer width='100%' height='100%'>
                    <AreaChart
                      data={analytics}
                      margin={{ top: 4, right: 2, left: -26, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id='gSignup'
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop
                            offset='5%'
                            stopColor={C.blue}
                            stopOpacity={0.22}
                          />
                          <stop
                            offset='95%'
                            stopColor={C.blue}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray='2 4' stroke={C.grid} />
                      <XAxis
                        dataKey='date'
                        tick={{ fontSize: 10, fill: C.axisTick }}
                        tickLine={false}
                        axisLine={false}
                        interval={xInterval}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: C.axisTick }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={TT}
                        cursor={{
                          stroke: C.blue,
                          strokeWidth: 1,
                          strokeOpacity: 0.35,
                        }}
                      />
                      <Area
                        type='monotone'
                        dataKey='signups'
                        stroke={C.blue}
                        strokeWidth={2}
                        fill='url(#gSignup)'
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Panel>
          </motion.div>

          {/* Daily Active */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
          >
            <Panel
              label='Daily Active Users'
              sub='Unique users per day'
              iconColor={C.teal}
              icon={<Activity className='h-3.5 w-3.5' />}
            >
              <div style={{ height: '190px' }}>
                {isPending ? (
                  <ChartSkeleton />
                ) : (
                  <ResponsiveContainer width='100%' height='100%'>
                    <AreaChart
                      data={analytics}
                      margin={{ top: 4, right: 2, left: -26, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id='gActive'
                          x1='0'
                          y1='0'
                          x2='0'
                          y2='1'
                        >
                          <stop
                            offset='5%'
                            stopColor={C.teal}
                            stopOpacity={0.22}
                          />
                          <stop
                            offset='95%'
                            stopColor={C.teal}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray='2 4' stroke={C.grid} />
                      <XAxis
                        dataKey='date'
                        tick={{ fontSize: 10, fill: C.axisTick }}
                        tickLine={false}
                        axisLine={false}
                        interval={xInterval}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: C.axisTick }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={TT}
                        cursor={{
                          stroke: C.teal,
                          strokeWidth: 1,
                          strokeOpacity: 0.35,
                        }}
                      />
                      <Area
                        type='monotone'
                        dataKey='active'
                        stroke={C.teal}
                        strokeWidth={2}
                        fill='url(#gActive)'
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Panel>
          </motion.div>

          {/* Submissions – full width */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className='lg:col-span-2'
          >
            <Panel
              label='Submission Trends'
              sub='Accepted vs rejected per day'
              iconColor={C.amber}
              icon={<BarChart3 className='h-3.5 w-3.5' />}
              extra={
                <div className='flex items-center gap-3'>
                  <Dot color={C.green} label='Accepted' />
                  <Dot color={C.red} label='Rejected' />
                </div>
              }
            >
              <div style={{ height: '210px' }}>
                {isPending ? (
                  <ChartSkeleton />
                ) : (
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={analytics}
                      margin={{ top: 4, right: 2, left: -26, bottom: 0 }}
                      barCategoryGap='36%'
                    >
                      <CartesianGrid strokeDasharray='2 4' stroke={C.grid} />
                      <XAxis
                        dataKey='date'
                        tick={{ fontSize: 10, fill: C.axisTick }}
                        tickLine={false}
                        axisLine={false}
                        interval={Math.max(
                          1,
                          Math.floor(analytics.length / 12),
                        )}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: C.axisTick }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={TT}
                        cursor={{ fill: 'hsl(222 25% 12%)' }}
                      />
                      <Bar
                        dataKey='accepted'
                        stackId='s'
                        fill={C.green}
                        fillOpacity={0.82}
                        radius={[0, 0, 0, 0]}
                        name='Accepted'
                      />
                      <Bar
                        dataKey='rejected'
                        stackId='s'
                        fill={C.red}
                        fillOpacity={0.72}
                        radius={[3, 3, 0, 0]}
                        name='Rejected'
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Panel>
          </motion.div>
        </div>

        {/* ── Quick Actions ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.19 }}
          className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-5'
        >
          <ActionCard
            to='/admin/problems/create'
            label='Create Problem'
            desc='Add a new coding challenge with test cases'
            color={C.blue}
          />
          <ActionCard
            to='/admin/sheets/create'
            label='Create Sheet'
            desc='Organize problems into a structured practice sheet'
            color={C.teal}
          />
        </motion.div>

        {/* ── Content rows ──────────────────────────────────────────────────── */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {/* Problems */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <Panel
              label='Problems'
              sub={problemStats ? `${problemStats.total} total` : undefined}
              iconColor={C.blue}
              icon={<ListChecks className='h-3.5 w-3.5' />}
              extra={
                <Link
                  to='/admin/problems'
                  style={{
                    color: C.blue,
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  View all{' '}
                  <ArrowRight style={{ width: '11px', height: '11px' }} />
                </Link>
              }
            >
              {isPending ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {['Easy', 'Medium', 'Hard'].map((l) => (
                    <div
                      key={l}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span
                        style={{ fontSize: '12px', color: C.t3, width: '52px' }}
                      >
                        {l}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: '6px',
                          borderRadius: '4px',
                          background: C.grid,
                          animation: 'pulse 2s infinite',
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <DiffBar
                    label='Easy'
                    count={problemStats?.easy ?? 0}
                    total={problemStats?.total ?? 0}
                    color={C.green}
                  />
                  <DiffBar
                    label='Medium'
                    count={problemStats?.medium ?? 0}
                    total={problemStats?.total ?? 0}
                    color={C.amber}
                  />
                  <DiffBar
                    label='Hard'
                    count={problemStats?.hard ?? 0}
                    total={problemStats?.total ?? 0}
                    color={C.red}
                  />
                </div>
              )}
            </Panel>
          </motion.div>

          {/* Sheets */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Panel
              label='Sheets'
              sub={sheets.length ? `${sheets.length} total` : undefined}
              iconColor={C.teal}
              icon={<BookOpen className='h-3.5 w-3.5' />}
              extra={
                <Link
                  to='/admin/sheets'
                  style={{
                    color: C.teal,
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  View all{' '}
                  <ArrowRight style={{ width: '11px', height: '11px' }} />
                </Link>
              }
            >
              {isPending ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        height: '34px',
                        borderRadius: '8px',
                        background: C.grid,
                        animation: 'pulse 2s infinite',
                        animationDelay: `${i * 80}ms`,
                      }}
                    />
                  ))}
                </div>
              ) : sheets.length === 0 ? (
                <p
                  style={{
                    textAlign: 'center',
                    color: C.t3,
                    fontSize: '13px',
                    padding: '20px 0',
                  }}
                >
                  No sheets yet
                </p>
              ) : (
                <div>
                  {sheets.slice(0, 5).map((sheet) => (
                    <SheetRow key={sheet.id} sheet={sheet} />
                  ))}
                  {sheets.length > 5 && (
                    <p
                      style={{
                        textAlign: 'center',
                        color: C.t3,
                        fontSize: '11px',
                        paddingTop: '8px',
                      }}
                    >
                      +{sheets.length - 5} more
                    </p>
                  )}
                </div>
              )}
            </Panel>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Panel({
  children,
  label,
  sub,
  icon,
  iconColor,
  extra,
}: {
  children: React.ReactNode;
  label: string;
  sub?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: '18px',
        padding: '20px',
        background: C.card,
        border: `1px solid ${C.cardBdr}`,
        backdropFilter: 'blur(14px)',
        boxShadow: '0 1px 0 hsl(222 25% 20% / 0.4) inset',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon && iconColor && (
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${iconColor.replace('hsl(', 'hsl(').replace(')', ' / 0.12)')}`,
                border: `1px solid ${iconColor.replace('hsl(', 'hsl(').replace(')', ' / 0.22)')}`,
                color: iconColor,
                flexShrink: 0,
              }}
            >
              {icon}
            </div>
          )}
          <div>
            <p
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: C.t1,
                margin: 0,
              }}
            >
              {label}
            </p>
            {sub && (
              <p style={{ fontSize: '11px', color: C.t3, margin: '1px 0 0' }}>
                {sub}
              </p>
            )}
          </div>
        </div>
        {extra}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  accent,
  trend,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | undefined;
  accent: AccentKey;
  trend?: string;
  loading?: boolean;
}) {
  const a = ACCENTS[accent];
  return (
    <div
      style={{
        borderRadius: '16px',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        background: C.card,
        border: `1px solid ${a.ring}`,
        backdropFilter: 'blur(14px)',
        boxShadow: `0 0 22px ${a.glow}, 0 1px 0 hsl(222 25% 20% / 0.4) inset`,
      }}
    >
      {/* corner glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '56px',
          height: '56px',
          background: `radial-gradient(circle at top right, ${a.glow.replace('0.10)', '0.5)')} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              height: '10px',
              width: '60px',
              borderRadius: '5px',
              background: C.grid,
              animation: 'pulse 2s infinite',
            }}
          />
          <div
            style={{
              height: '26px',
              width: '48px',
              borderRadius: '6px',
              background: C.grid,
              animation: 'pulse 2s infinite',
            }}
          />
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <span style={{ color: a.color, opacity: 0.7 }}>{icon}</span>
            {trend && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: C.green,
                }}
              >
                <ArrowUpRight style={{ width: '11px', height: '11px' }} />
                {trend}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: a.color,
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {value?.toLocaleString() ?? '—'}
          </p>
          <p style={{ fontSize: '11px', color: C.t3, margin: '3px 0 0' }}>
            {label}
          </p>
        </>
      )}
    </div>
  );
}

function ActionCard({
  to,
  label,
  desc,
  color,
}: {
  to: string;
  label: string;
  desc: string;
  color: string;
}) {
  const ringColor = color.replace(')', ' / 0.28)').replace('hsl(', 'hsl(');
  const bgColor = color.replace(')', ' / 0.10)').replace('hsl(', 'hsl(');

  return (
    <Link to={to} className='group block'>
      <div
        style={{
          borderRadius: '16px',
          padding: '18px 20px',
          background: C.card,
          border: `1px solid ${C.cardBdr}`,
          backdropFilter: 'blur(14px)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          transition: 'border-color 0.18s, box-shadow 0.18s',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = ringColor;
          el.style.boxShadow = `0 0 28px ${bgColor}`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = C.cardBdr;
          el.style.boxShadow = 'none';
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: bgColor,
            border: `1px solid ${ringColor}`,
            color,
            transition: 'background 0.18s',
          }}
        >
          <Plus style={{ width: '18px', height: '18px' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: C.t1,
              margin: 0,
            }}
          >
            {label}
          </p>
          <p style={{ fontSize: '12px', color: C.t3, margin: '2px 0 0' }}>
            {desc}
          </p>
        </div>
        <ArrowRight
          style={{
            width: '15px',
            height: '15px',
            flexShrink: 0,
            color: C.t3,
            transition: 'transform 0.18s, color 0.18s',
          }}
          className='group-hover:translate-x-1'
        />
      </div>
    </Link>
  );
}

function DiffBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span
        style={{
          fontSize: '12px',
          fontWeight: 500,
          color: C.t2,
          width: '52px',
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: '6px',
          borderRadius: '99px',
          overflow: 'hidden',
          background: C.grid,
        }}
      >
        <motion.div
          style={{
            height: '100%',
            borderRadius: '99px',
            background: `linear-gradient(90deg, ${color} 0%, ${color.replace(')', ' / 0.65)').replace('hsl(', 'hsl(')} 100%)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        />
      </div>
      <span
        style={{
          fontSize: '12px',
          fontWeight: 600,
          fontFamily: 'monospace',
          color: C.t2,
          width: '28px',
          textAlign: 'right',
        }}
      >
        {count}
      </span>
    </div>
  );
}

function SheetRow({
  sheet,
}: {
  sheet: { id: string; name: string; totalProblems: number };
}) {
  return (
    <Link
      to={`/admin/sheets/edit/${sheet.id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 10px',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'background 0.12s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background =
          'hsl(222 25% 12%)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'hsl(168 78% 52% / 0.55)',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: C.t1,
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {sheet.name}
      </span>
      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: C.t3 }}>
        {sheet.totalProblems}p
      </span>
    </Link>
  );
}

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        color: C.t3,
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '3px',
          background: color,
          display: 'inline-block',
        }}
      />
      {label}
    </span>
  );
}

function ChartSkeleton() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '3px',
        paddingBottom: '4px',
      }}
    >
      {Array.from({ length: 22 }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            borderRadius: '3px 3px 0 0',
            height: `${20 + ((i * 43) % 60)}%`,
            background: C.grid,
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: `${i * 40}ms`,
          }}
        />
      ))}
    </div>
  );
}
