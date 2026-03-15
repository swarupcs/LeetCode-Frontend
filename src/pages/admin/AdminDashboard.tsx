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
import { C, TT, ACCENTS, type AccentKey } from './adminTokens';
import type { DateRange } from 'react-day-picker';

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS = [
  { label: '7d', days: 7 },
  { label: '14d', days: 14 },
  { label: '30d', days: 30 },
  { label: '60d', days: 60 },
  { label: '90d', days: 90 },
];

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
    <div className='relative p-6 lg:p-8 max-w-7xl'>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5'>
          <div>
            <p
              className='text-[11px] font-bold tracking-[0.17em] uppercase mb-1'
              style={{ color: C.blue }}
            >
              Admin Console
            </p>
            <div className='flex items-center gap-2.5'>
              <h1 className='text-3xl font-extrabold tracking-tight text-foreground'>
                Dashboard
              </h1>
              {isFetching && !isPending && (
                <Loader2
                  className='h-4 w-4 animate-spin mt-1'
                  style={{ color: C.blue }}
                />
              )}
            </div>
            <p className='text-sm text-muted-foreground mt-1'>
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
                  className='h-8 px-3 rounded-lg text-xs font-semibold transition-all duration-150'
                  style={{
                    background: active
                      ? `color-mix(in oklch, ${C.blue} 12%, transparent)`
                      : 'transparent',
                    color: active ? C.blue : 'var(--muted-foreground)',
                    border: active
                      ? `1px solid color-mix(in oklch, ${C.blue} 30%, transparent)`
                      : '1px solid var(--border)',
                  }}
                >
                  {p.label}
                </button>
              );
            })}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className='h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-150'
                  style={{
                    background:
                      activePreset === 0
                        ? `color-mix(in oklch, ${C.blue} 12%, transparent)`
                        : 'transparent',
                    color:
                      activePreset === 0 ? C.blue : 'var(--muted-foreground)',
                    border:
                      activePreset === 0
                        ? `1px solid color-mix(in oklch, ${C.blue} 30%, transparent)`
                        : '1px solid var(--border)',
                  }}
                >
                  <CalendarIcon className='h-3 w-3' />
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
        <div className='mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-destructive border border-destructive/30 bg-destructive/5'>
          <AlertCircle className='h-4 w-4 shrink-0' />
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
            <div className='h-[190px]'>
              {isPending ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={analytics}
                    margin={{ top: 4, right: 2, left: -26, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id='gSignup' x1='0' y1='0' x2='0' y2='1'>
                        <stop
                          offset='5%'
                          stopColor={C.blue}
                          stopOpacity={0.2}
                        />
                        <stop offset='95%' stopColor={C.blue} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='2 4'
                      stroke='var(--border)'
                      strokeOpacity={0.6}
                    />
                    <XAxis
                      dataKey='date'
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                      tickLine={false}
                      axisLine={false}
                      interval={xInterval}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={TT}
                      cursor={{
                        stroke: C.blue,
                        strokeWidth: 1,
                        strokeOpacity: 0.4,
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
            <div className='h-[190px]'>
              {isPending ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={analytics}
                    margin={{ top: 4, right: 2, left: -26, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id='gActive' x1='0' y1='0' x2='0' y2='1'>
                        <stop
                          offset='5%'
                          stopColor={C.teal}
                          stopOpacity={0.2}
                        />
                        <stop offset='95%' stopColor={C.teal} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='2 4'
                      stroke='var(--border)'
                      strokeOpacity={0.6}
                    />
                    <XAxis
                      dataKey='date'
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                      tickLine={false}
                      axisLine={false}
                      interval={xInterval}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={TT}
                      cursor={{
                        stroke: C.teal,
                        strokeWidth: 1,
                        strokeOpacity: 0.4,
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
            <div className='h-[210px]'>
              {isPending ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={analytics}
                    margin={{ top: 4, right: 2, left: -26, bottom: 0 }}
                    barCategoryGap='36%'
                  >
                    <CartesianGrid
                      strokeDasharray='2 4'
                      stroke='var(--border)'
                      strokeOpacity={0.6}
                    />
                    <XAxis
                      dataKey='date'
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                      tickLine={false}
                      axisLine={false}
                      interval={Math.max(1, Math.floor(analytics.length / 12))}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={TT}
                      cursor={{
                        fill: 'color-mix(in oklch, var(--muted) 40%, transparent)',
                      }}
                    />
                    <Bar
                      dataKey='accepted'
                      stackId='s'
                      fill={C.green}
                      fillOpacity={0.85}
                      radius={[0, 0, 0, 0]}
                      name='Accepted'
                    />
                    <Bar
                      dataKey='rejected'
                      stackId='s'
                      fill={C.red}
                      fillOpacity={0.75}
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
                className='text-[11px] font-semibold flex items-center gap-0.5 hover:opacity-70 transition-opacity'
                style={{ color: C.blue }}
              >
                View all <ArrowRight className='h-2.5 w-2.5' />
              </Link>
            }
          >
            {isPending ? (
              <div className='space-y-3'>
                {['Easy', 'Medium', 'Hard'].map((l) => (
                  <div key={l} className='flex items-center gap-3'>
                    <span className='text-xs text-muted-foreground w-14'>
                      {l}
                    </span>
                    <div className='flex-1 h-1.5 rounded-full bg-surface-3 animate-pulse' />
                  </div>
                ))}
              </div>
            ) : (
              <div className='space-y-3'>
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
                className='text-[11px] font-semibold flex items-center gap-0.5 hover:opacity-70 transition-opacity'
                style={{ color: C.teal }}
              >
                View all <ArrowRight className='h-2.5 w-2.5' />
              </Link>
            }
          >
            {isPending ? (
              <div className='space-y-1.5'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className='h-9 rounded-lg bg-surface-3 animate-pulse'
                    style={{ animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            ) : sheets.length === 0 ? (
              <p className='text-xs text-muted-foreground text-center py-5'>
                No sheets yet
              </p>
            ) : (
              <div>
                {sheets.slice(0, 5).map((sheet) => (
                  <Link
                    key={sheet.id}
                    to={`/admin/sheets/edit/${sheet.id}`}
                    className='flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-surface-2 transition-colors group'
                  >
                    <span
                      className='w-1.5 h-1.5 rounded-full shrink-0'
                      style={{ background: C.teal, opacity: 0.6 }}
                    />
                    <span className='text-sm font-medium text-foreground group-hover:text-primary transition-colors flex-1 truncate'>
                      {sheet.name}
                    </span>
                    <span className='text-[10px] font-mono text-muted-foreground'>
                      {sheet.totalProblems}p
                    </span>
                  </Link>
                ))}
                {sheets.length > 5 && (
                  <p className='text-[11px] text-muted-foreground/60 text-center pt-2'>
                    +{sheets.length - 5} more
                  </p>
                )}
              </div>
            )}
          </Panel>
        </motion.div>
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
    <div className='glass-card p-5 h-full flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2.5'>
          {icon && iconColor && (
            <div
              className='h-7 w-7 rounded-lg flex items-center justify-center shrink-0'
              style={{
                background: `color-mix(in oklch, ${iconColor} 12%, transparent)`,
                border: `1px solid color-mix(in oklch, ${iconColor} 22%, transparent)`,
                color: iconColor,
              }}
            >
              {icon}
            </div>
          )}
          <div>
            <p className='text-sm font-semibold text-foreground'>{label}</p>
            {sub && (
              <p className='text-[11px] text-muted-foreground mt-0.5'>{sub}</p>
            )}
          </div>
        </div>
        {extra}
      </div>
      <div className='flex-1'>{children}</div>
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
      className='glass-card p-4 relative overflow-hidden'
      style={{ borderColor: a.ring, boxShadow: `0 0 20px ${a.glow}` }}
    >
      {/* corner glow */}
      <div
        aria-hidden
        className='absolute top-0 right-0 w-14 h-14 pointer-events-none'
        style={{
          background: `radial-gradient(circle at top right, ${a.glow} 0%, transparent 70%)`,
        }}
      />

      {loading ? (
        <div className='space-y-2'>
          <div className='h-2.5 w-14 rounded bg-surface-3 animate-pulse' />
          <div className='h-7 w-12 rounded bg-surface-3 animate-pulse' />
        </div>
      ) : (
        <>
          <div className='flex items-center justify-between mb-1.5'>
            <span style={{ color: a.color, opacity: 0.75 }}>{icon}</span>
            {trend && (
              <span
                className='flex items-center gap-0.5 text-[10px] font-bold'
                style={{ color: C.green }}
              >
                <ArrowUpRight className='h-3 w-3' />
                {trend}
              </span>
            )}
          </div>
          <p
            className='text-2xl font-extrabold tabular-nums'
            style={{ color: a.color }}
          >
            {value?.toLocaleString() ?? '—'}
          </p>
          <p className='text-[11px] text-muted-foreground mt-0.5'>{label}</p>
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
  return (
    <Link to={to} className='group block'>
      <div
        className='glass-card p-5 flex items-center gap-4 transition-all duration-200 hover:border-primary/30'
        style={{ transition: 'border-color 0.18s' }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            `color-mix(in oklch, ${color} 30%, transparent)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '';
        }}
      >
        <div
          className='h-10 w-10 rounded-xl flex items-center justify-center shrink-0'
          style={{
            background: `color-mix(in oklch, ${color} 10%, transparent)`,
            border: `1px solid color-mix(in oklch, ${color} 22%, transparent)`,
            color,
          }}
        >
          <Plus className='h-5 w-5' />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-semibold text-foreground'>{label}</p>
          <p className='text-xs text-muted-foreground mt-0.5'>{desc}</p>
        </div>
        <ArrowRight className='h-4 w-4 text-muted-foreground/40 group-hover:translate-x-1 transition-transform' />
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
    <div className='flex items-center gap-3'>
      <span className='text-xs font-medium text-muted-foreground w-14'>
        {label}
      </span>
      <div className='flex-1 h-1.5 rounded-full overflow-hidden bg-surface-3'>
        <motion.div
          className='h-full rounded-full'
          style={{
            background: `linear-gradient(90deg, ${color} 0%, color-mix(in oklch, ${color} 65%, transparent) 100%)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        />
      </div>
      <span className='text-xs font-semibold font-mono text-muted-foreground w-7 text-right'>
        {count}
      </span>
    </div>
  );
}

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <span className='flex items-center gap-1.5 text-[11px] text-muted-foreground'>
      <span className='h-2 w-2 rounded-sm' style={{ background: color }} />
      {label}
    </span>
  );
}

function ChartSkeleton() {
  return (
    <div className='h-full flex items-end gap-1 pb-1'>
      {Array.from({ length: 22 }).map((_, i) => (
        <div
          key={i}
          className='flex-1 rounded-sm bg-surface-3 animate-pulse'
          style={{
            height: `${22 + ((i * 43) % 60)}%`,
            animationDelay: `${i * 40}ms`,
          }}
        />
      ))}
    </div>
  );
}
