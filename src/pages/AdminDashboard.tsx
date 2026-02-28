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
  Legend,
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { problems } from '@/data/problems';
import { sheets, getSheetStats } from '@/data/sheets';
import {
  allAnalyticsData,
  filterByDateRange,
  computeSummary,
} from '@/data/analytics';
import type { DateRange } from 'react-day-picker';

const chartTooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'hsl(var(--foreground))',
};

const presets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 14 days', days: 14 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 60 days', days: 60 },
  { label: 'Last 90 days', days: 90 },
];

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

  const filteredData = useMemo(
    () => filterByDateRange(allAnalyticsData, dateRange.from, dateRange.to),
    [dateRange],
  );

  const summary = useMemo(() => computeSummary(filteredData), [filteredData]);

  const handlePreset = (days: number) => {
    setActivePreset(days);
    setDateRange({ from: subDays(today, days - 1), to: today });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange(range);
      setActivePreset(0);
    }
  };

  const problemStats = useMemo(() => {
    const easy = problems.filter((p) => p.difficulty === 'Easy').length;
    const medium = problems.filter((p) => p.difficulty === 'Medium').length;
    const hard = problems.filter((p) => p.difficulty === 'Hard').length;
    return { total: problems.length, easy, medium, hard };
  }, []);

  const sheetStats = useMemo(() => {
    const totalProblems = new Set(
      sheets.flatMap((s) => s.topics.flatMap((t) => t.problemIds)),
    ).size;
    const totalTopics = sheets.reduce((a, s) => a + s.topics.length, 0);
    return { total: sheets.length, totalProblems, totalTopics };
  }, []);

  // Compute dynamic x-axis interval based on data length
  const xInterval = Math.max(1, Math.floor(filteredData.length / 8));

  const dateLabel =
    dateRange.from && dateRange.to
      ? `${format(dateRange.from, 'MMM d')} – ${format(dateRange.to, 'MMM d, yyyy')}`
      : dateRange.from
        ? `From ${format(dateRange.from, 'MMM d, yyyy')}`
        : 'Select dates';

  return (
    <div className='p-6 lg:p-8 max-w-7xl'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold text-foreground'>Dashboard</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Platform analytics, content overview, and quick actions
            </p>
          </div>

          {/* Date Range Picker */}
          <div className='flex items-center gap-2 flex-wrap'>
            {presets.map((p) => (
              <Button
                key={p.days}
                variant={activePreset === p.days ? 'default' : 'outline'}
                size='sm'
                className={cn(
                  'text-xs h-8 px-3',
                  activePreset === p.days
                    ? 'bg-primary text-primary-foreground'
                    : 'border-border/50 text-muted-foreground hover:text-foreground',
                )}
                onClick={() => handlePreset(p.days)}
              >
                {p.label}
              </Button>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className={cn(
                    'text-xs h-8 gap-1.5 border-border/50',
                    activePreset === 0
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <CalendarIcon className='h-3.5 w-3.5' />
                  {activePreset === 0 ? dateLabel : 'Custom'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='end'>
                <Calendar
                  mode='range'
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  disabled={(date) => date > today}
                  initialFocus
                  className={cn('p-3 pointer-events-auto')}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </motion.div>

      {/* Top Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className='grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8'
      >
        <StatCard label='Total Users' value={summary.totalUsers} icon={Users} />
        <StatCard
          label={`New (${summary.days}d)`}
          value={summary.newUsersInRange}
          icon={UserPlus}
          trend={`+${summary.userGrowthPct}%`}
        />
        <StatCard
          label='Avg Daily Active'
          value={summary.avgDailyActive}
          icon={Activity}
        />
        <StatCard
          label={`Submissions (${summary.days}d)`}
          value={summary.totalSubmissions}
          icon={BarChart3}
        />
        <StatCard
          label='Total Problems'
          value={problemStats.total}
          icon={ListChecks}
        />
        <StatCard
          label='Total Sheets'
          value={sheetStats.total}
          icon={BookOpen}
        />
      </motion.div>

      {/* Analytics Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        {/* Signups Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className='glass-card border-border/50'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-semibold flex items-center gap-2'>
                <UserPlus className='h-4 w-4 text-primary' />
                New Signups
              </CardTitle>
              <CardDescription className='text-xs'>
                Daily new user registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-[200px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={filteredData}
                    margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id='signupGradient'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='5%'
                          stopColor='hsl(var(--primary))'
                          stopOpacity={0.3}
                        />
                        <stop
                          offset='95%'
                          stopColor='hsl(var(--primary))'
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke='hsl(var(--border))'
                      strokeOpacity={0.4}
                    />
                    <XAxis
                      dataKey='date'
                      tick={{
                        fontSize: 10,
                        fill: 'hsl(var(--muted-foreground))',
                      }}
                      tickLine={false}
                      axisLine={false}
                      interval={xInterval}
                    />
                    <YAxis
                      tick={{
                        fontSize: 10,
                        fill: 'hsl(var(--muted-foreground))',
                      }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Area
                      type='monotone'
                      dataKey='signups'
                      stroke='hsl(var(--primary))'
                      strokeWidth={2}
                      fill='url(#signupGradient)'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Users Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className='glass-card border-border/50'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-semibold flex items-center gap-2'>
                <Activity className='h-4 w-4 text-[hsl(var(--cyan))]' />
                Daily Active Users
              </CardTitle>
              <CardDescription className='text-xs'>
                Unique active users per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-[200px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={filteredData}
                    margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id='activeGradient'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='5%'
                          stopColor='hsl(var(--cyan))'
                          stopOpacity={0.3}
                        />
                        <stop
                          offset='95%'
                          stopColor='hsl(var(--cyan))'
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke='hsl(var(--border))'
                      strokeOpacity={0.4}
                    />
                    <XAxis
                      dataKey='date'
                      tick={{
                        fontSize: 10,
                        fill: 'hsl(var(--muted-foreground))',
                      }}
                      tickLine={false}
                      axisLine={false}
                      interval={xInterval}
                    />
                    <YAxis
                      tick={{
                        fontSize: 10,
                        fill: 'hsl(var(--muted-foreground))',
                      }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Area
                      type='monotone'
                      dataKey='active'
                      stroke='hsl(var(--cyan))'
                      strokeWidth={2}
                      fill='url(#activeGradient)'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Submissions Chart - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='lg:col-span-2'
        >
          <Card className='glass-card border-border/50'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-semibold flex items-center gap-2'>
                <BarChart3 className='h-4 w-4 text-[hsl(var(--amber))]' />
                Submission Trends
              </CardTitle>
              <CardDescription className='text-xs'>
                Accepted vs rejected submissions per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='h-[220px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={filteredData}
                    margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray='3 3'
                      stroke='hsl(var(--border))'
                      strokeOpacity={0.4}
                    />
                    <XAxis
                      dataKey='date'
                      tick={{
                        fontSize: 10,
                        fill: 'hsl(var(--muted-foreground))',
                      }}
                      tickLine={false}
                      axisLine={false}
                      interval={Math.max(
                        1,
                        Math.floor(filteredData.length / 12),
                      )}
                    />
                    <YAxis
                      tick={{
                        fontSize: 10,
                        fill: 'hsl(var(--muted-foreground))',
                      }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Legend
                      wrapperStyle={{
                        fontSize: '11px',
                        color: 'hsl(var(--muted-foreground))',
                      }}
                      iconSize={8}
                    />
                    <Bar
                      dataKey='accepted'
                      stackId='submissions'
                      fill='hsl(var(--primary))'
                      radius={[0, 0, 0, 0]}
                      name='Accepted'
                    />
                    <Bar
                      dataKey='rejected'
                      stackId='submissions'
                      fill='hsl(var(--rose))'
                      radius={[2, 2, 0, 0]}
                      name='Rejected'
                      fillOpacity={0.7}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'
      >
        <Link to='/admin/problems/create' className='group'>
          <div className='glass-card p-5 flex items-center gap-4 hover:border-primary/30 transition-all duration-300'>
            <div className='p-2.5 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors'>
              <Plus className='h-5 w-5 text-primary' />
            </div>
            <div className='flex-1'>
              <h3 className='text-sm font-semibold text-foreground'>
                Create Problem
              </h3>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Add a new coding challenge with test cases
              </p>
            </div>
            <ArrowRight className='h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all' />
          </div>
        </Link>
        <Link to='/admin/sheets/create' className='group'>
          <div className='glass-card p-5 flex items-center gap-4 hover:border-primary/30 transition-all duration-300'>
            <div className='p-2.5 rounded-xl bg-[hsl(var(--cyan))]/10 border border-[hsl(var(--cyan))]/20 group-hover:bg-[hsl(var(--cyan))]/20 transition-colors'>
              <Plus className='h-5 w-5 text-[hsl(var(--cyan))]' />
            </div>
            <div className='flex-1'>
              <h3 className='text-sm font-semibold text-foreground'>
                Create Sheet
              </h3>
              <p className='text-xs text-muted-foreground mt-0.5'>
                Organize problems into a structured practice sheet
              </p>
            </div>
            <ArrowRight className='h-4 w-4 text-muted-foreground/40 group-hover:text-[hsl(var(--cyan))] group-hover:translate-x-1 transition-all' />
          </div>
        </Link>
      </motion.div>

      {/* Content Sections */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='glass-card p-5'
        >
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-sm font-semibold text-foreground flex items-center gap-2'>
              <ListChecks className='h-4 w-4 text-primary' />
              Problems
            </h3>
            <Link
              to='/admin/problems'
              className='text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1'
            >
              View all <ArrowRight className='h-3 w-3' />
            </Link>
          </div>
          <div className='space-y-3'>
            <DifficultyBar
              label='Easy'
              count={problemStats.easy}
              total={problemStats.total}
              color='hsl(var(--emerald))'
            />
            <DifficultyBar
              label='Medium'
              count={problemStats.medium}
              total={problemStats.total}
              color='hsl(var(--amber))'
            />
            <DifficultyBar
              label='Hard'
              count={problemStats.hard}
              total={problemStats.total}
              color='hsl(var(--rose))'
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className='glass-card p-5'
        >
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-sm font-semibold text-foreground flex items-center gap-2'>
              <BookOpen className='h-4 w-4 text-[hsl(var(--cyan))]' />
              Sheets
            </h3>
            <Link
              to='/admin/sheets'
              className='text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1'
            >
              View all <ArrowRight className='h-3 w-3' />
            </Link>
          </div>
          <div className='space-y-2'>
            {sheets.slice(0, 5).map((sheet) => {
              const stats = getSheetStats(sheet);
              return (
                <Link
                  key={sheet.id}
                  to={`/admin/sheets/edit/${sheet.id}`}
                  className='flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-2/50 transition-colors group'
                >
                  <span className='text-sm text-foreground group-hover:text-primary transition-colors flex-1 truncate'>
                    {sheet.name}
                  </span>
                  <span className='text-[10px] text-muted-foreground font-mono'>
                    {stats.total} problems
                  </span>
                </Link>
              );
            })}
            {sheets.length > 5 && (
              <p className='text-[11px] text-muted-foreground/60 text-center pt-1'>
                +{sheets.length - 5} more sheets
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  trend?: string;
}) {
  return (
    <div className='glass-card p-4'>
      <div className='flex items-center justify-between mb-2'>
        <Icon className='h-4 w-4 text-muted-foreground' />
        {trend && (
          <span className='flex items-center gap-0.5 text-[10px] font-medium text-[hsl(var(--emerald))]'>
            <ArrowUpRight className='h-3 w-3' />
            {trend}
          </span>
        )}
      </div>
      <div className='text-2xl font-bold text-foreground'>{value}</div>
      <div className='text-[11px] text-muted-foreground mt-0.5'>{label}</div>
    </div>
  );
}

function DifficultyBar({
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
      <span className='text-xs text-muted-foreground w-14'>{label}</span>
      <div className='flex-1 h-2 bg-surface-3 rounded-full overflow-hidden'>
        <motion.div
          className='h-full rounded-full'
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className='text-xs font-mono text-muted-foreground w-8 text-right'>
        {count}
      </span>
    </div>
  );
}
