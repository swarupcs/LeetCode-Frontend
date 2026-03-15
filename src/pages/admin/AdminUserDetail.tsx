// src/pages/admin/AdminUserDetailPage.tsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ChevronLeft,
  CheckCircle,
  Flame,
  Target,
  TrendingUp,
  Code2,
  Calendar,
  Mail,
  ShieldCheck,
  Clock,
  MoreVertical,
  ShieldAlert,
  ShieldOff,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useAdminUserDetail,
  useUpdateUserRole,
} from '@/hooks/admin/useAdminUserDetail';

// ─── Config ───────────────────────────────────────────────────────────────────

const difficultyConfig = [
  {
    level: 'Easy',
    key: 'easySolved' as const,
    color: 'bg-[hsl(var(--emerald))]',
    textColor: 'text-[hsl(var(--emerald))]',
    ringColor: 'hsl(var(--emerald))',
  },
  {
    level: 'Medium',
    key: 'mediumSolved' as const,
    color: 'bg-[hsl(var(--amber))]',
    textColor: 'text-[hsl(var(--amber))]',
    ringColor: 'hsl(var(--amber))',
  },
  {
    level: 'Hard',
    key: 'hardSolved' as const,
    color: 'bg-[hsl(var(--rose))]',
    textColor: 'text-[hsl(var(--rose))]',
    ringColor: 'hsl(var(--rose))',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type ActionType = 'promote' | 'demote';

interface ConfirmAction {
  type: ActionType;
  title: string;
  description: string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminUserDetailPage() {
  const { id: userId = '' } = useParams<{ id: string }>();

  const { user, isPending, isError, error } = useAdminUserDetail(userId);
  const { mutateAsync: updateRole, isPending: isUpdatingRole } =
    useUpdateUserRole(userId);

  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleConfirmAction = async () => {
    if (!confirmAction || !user) return;
    try {
      const newRole = confirmAction.type === 'promote' ? 'ADMIN' : 'USER';
      await updateRole(newRole);
      toast.success(
        confirmAction.type === 'promote'
          ? 'User promoted to admin'
          : 'Admin role removed',
        { description: `${user.displayName} role updated successfully.` },
      );
    } catch (err) {
      const msg =
        (err as { message?: string })?.message ?? 'Failed to update role';
      toast.error('Action failed', { description: msg });
    } finally {
      setConfirmAction(null);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────

  if (isPending) {
    return (
      <div className='p-6 lg:p-8 max-w-7xl'>
        <div className='flex items-center gap-1.5 text-sm text-muted-foreground mb-6'>
          <ChevronLeft className='h-4 w-4' />
          Back to Users
        </div>
        <div className='glass-card p-6 mb-8 animate-pulse'>
          <div className='flex items-start gap-5'>
            <div className='h-16 w-16 rounded-xl bg-surface-3 shrink-0' />
            <div className='flex-1 space-y-3'>
              <div className='h-6 w-40 bg-surface-3 rounded' />
              <div className='h-4 w-28 bg-surface-3 rounded' />
              <div className='h-3 w-64 bg-surface-3 rounded' />
            </div>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-border/30'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='h-14 bg-surface-3 rounded-lg' />
            ))}
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`glass-card h-64 animate-pulse bg-surface-2/40 ${i === 1 || i === 3 ? 'lg:col-span-2' : ''}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Error / not found ─────────────────────────────────────────────────────

  if (isError || !user) {
    return (
      <div className='p-6 lg:p-8 max-w-7xl'>
        <Link
          to='/admin/users'
          className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6'
        >
          <ChevronLeft className='h-4 w-4' />
          Back to Users
        </Link>
        <div className='flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive mb-6'>
          <AlertCircle className='h-4 w-4 shrink-0' />
          <span>
            {(error as { message?: string })?.message ?? 'User not found.'}
          </span>
        </div>
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────

  const breakdown = difficultyConfig.map((d) => ({
    ...d,
    solved: user[d.key],
    total:
      d.level === 'Easy'
        ? user.difficultyTotals.easy
        : d.level === 'Medium'
          ? user.difficultyTotals.medium
          : user.difficultyTotals.hard,
  }));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className='p-6 lg:p-8 max-w-7xl'>
      {/* Back link */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link
          to='/admin/users'
          className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6'
        >
          <ChevronLeft className='h-4 w-4' />
          Back to Users
        </Link>
      </motion.div>

      {/* User Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='glass-card p-6 glow-border mb-8'
      >
        <div className='flex flex-col sm:flex-row items-start gap-5'>
          {/* Avatar */}
          {user.image ? (
            <img
              src={user.image}
              alt={user.displayName}
              className='h-16 w-16 rounded-xl object-cover shrink-0'
            />
          ) : (
            <div className='h-16 w-16 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 border-2 border-primary/30 flex items-center justify-center shrink-0'>
              <span className='text-xl font-bold gradient-text'>
                {user.initials}
              </span>
            </div>
          )}

          {/* Info */}
          <div className='flex-1 min-w-0'>
            <div className='flex flex-wrap items-center gap-2 mb-1'>
              <h1 className='text-xl font-bold'>{user.displayName}</h1>
              {user.role === 'ADMIN' && (
                <Badge
                  variant='outline'
                  className='text-[10px] font-medium border bg-[hsl(var(--amber)/0.1)] text-[hsl(var(--amber))] border-[hsl(var(--amber)/0.2)]'
                >
                  <ShieldCheck className='h-3 w-3 mr-1' />
                  Admin
                </Badge>
              )}
            </div>
            <p className='text-sm text-muted-foreground font-mono mb-3'>
              @{user.username}
            </p>
            <div className='flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground'>
              <span className='flex items-center gap-1.5'>
                <Mail className='h-3.5 w-3.5' />
                {user.email}
              </span>
              <span className='flex items-center gap-1.5'>
                <Calendar className='h-3.5 w-3.5' />
                Joined {user.joinDate}
              </span>
              {user.lastActive && (
                <span className='flex items-center gap-1.5'>
                  <Clock className='h-3.5 w-3.5' />
                  Last active {user.lastActive}
                </span>
              )}
            </div>
          </div>

          {/* Admin Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                disabled={isUpdatingRole}
                className='border-border/50 text-muted-foreground hover:text-foreground shrink-0 gap-1.5'
              >
                {isUpdatingRole ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <MoreVertical className='h-4 w-4' />
                )}
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-48 bg-card border-border/50'
            >
              {/* Role toggle */}
              {user.role === 'USER' ? (
                <DropdownMenuItem
                  className='text-sm cursor-pointer flex items-center gap-2'
                  onClick={() =>
                    setConfirmAction({
                      type: 'promote',
                      title: 'Promote to Admin',
                      description: `Are you sure you want to make "${user.displayName}" an admin? They will have full platform management access.`,
                    })
                  }
                >
                  <ShieldAlert className='h-3.5 w-3.5' />
                  Promote to Admin
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className='text-sm cursor-pointer flex items-center gap-2'
                  onClick={() =>
                    setConfirmAction({
                      type: 'demote',
                      title: 'Remove Admin Role',
                      description: `Are you sure you want to remove admin privileges from "${user.displayName}"?`,
                    })
                  }
                >
                  <ShieldOff className='h-3.5 w-3.5' />
                  Remove Admin Role
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='text-xs text-muted-foreground cursor-default'
                disabled
              >
                Ban/unban coming soon
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-border/30'>
          {[
            {
              label: 'Solved',
              value: user.totalSolved,
              icon: CheckCircle,
              accent: 'text-primary',
            },
            {
              label: 'Streak',
              value: `${user.currentStreak}d`,
              icon: Flame,
              accent: 'text-[hsl(var(--amber))]',
            },
            {
              label: 'Submissions',
              value: user.totalSubmissions,
              icon: Target,
              accent: 'text-accent',
            },
            {
              label: 'Acceptance',
              value: `${user.acceptanceRate}%`,
              icon: TrendingUp,
              accent: 'text-[hsl(var(--emerald))]',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className='flex items-center gap-3 p-3 rounded-lg bg-surface-2/30'
            >
              <stat.icon className={`h-5 w-5 ${stat.accent} shrink-0`} />
              <div>
                <div className='text-lg font-bold'>{stat.value}</div>
                <div className='text-[11px] text-muted-foreground'>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Content Grid */}
      <motion.div
        variants={container}
        initial='hidden'
        animate='show'
        className='grid grid-cols-1 lg:grid-cols-3 gap-6'
      >
        {/* Solved by Difficulty — donut + bars */}
        <motion.div variants={item} className='lg:col-span-1'>
          <Card className='glass-card border-border/50 h-full'>
            <CardHeader>
              <CardTitle className='text-base'>Solved Problems</CardTitle>
              <CardDescription className='text-xs'>
                By difficulty
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col items-center'>
              {/* Donut */}
              <div className='relative w-32 h-32 mb-5'>
                <svg
                  className='w-32 h-32 transform -rotate-90'
                  viewBox='0 0 128 128'
                >
                  <circle
                    cx='64'
                    cy='64'
                    r='50'
                    stroke='hsl(var(--surface-3))'
                    strokeWidth='10'
                    fill='transparent'
                  />
                  {user.totalSolved > 0 &&
                    breakdown.reduce<{
                      elements: React.ReactElement[];
                      offset: number;
                    }>(
                      (acc, d, i) => {
                        const circumference = 2 * Math.PI * 50;
                        const segmentLength =
                          (d.solved / user.totalSolved) * circumference;
                        if (d.solved > 0) {
                          acc.elements.push(
                            <circle
                              key={i}
                              cx='64'
                              cy='64'
                              r='50'
                              stroke={d.ringColor}
                              strokeWidth='10'
                              fill='transparent'
                              strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                              strokeDashoffset={-acc.offset}
                              strokeLinecap='round'
                              className='transition-all duration-700'
                            />,
                          );
                        }
                        acc.offset += segmentLength;
                        return acc;
                      },
                      { elements: [], offset: 0 },
                    ).elements}
                </svg>
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <span className='text-xl font-bold'>{user.totalSolved}</span>
                  <span className='text-[10px] text-muted-foreground'>
                    solved
                  </span>
                </div>
              </div>

              {/* Breakdown bars */}
              <div className='w-full space-y-3'>
                {breakdown.map((d) => (
                  <div key={d.level}>
                    <div className='flex justify-between text-xs mb-1.5'>
                      <span className={`${d.textColor} font-medium`}>
                        {d.level}
                      </span>
                      <span className='text-muted-foreground tabular-nums'>
                        {d.solved}/{d.total}
                      </span>
                    </div>
                    <div className='h-1.5 bg-surface-3 rounded-full overflow-hidden'>
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

        {/* Skills by Topic */}
        <motion.div variants={item} className='lg:col-span-2'>
          <Card className='glass-card border-border/50 h-full'>
            <CardHeader>
              <CardTitle className='text-base'>Skills by Topic</CardTitle>
              <CardDescription className='text-xs'>
                Progress across categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.topTopics.length > 0 ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
                  {user.topTopics.map((topic) => {
                    const pct =
                      topic.total > 0 ? (topic.solved / topic.total) * 100 : 0;
                    return (
                      <div key={topic.topic}>
                        <div className='flex justify-between text-xs mb-1.5'>
                          <span className='text-foreground/90 font-medium'>
                            {topic.topic}
                          </span>
                          <span className='text-muted-foreground tabular-nums'>
                            {topic.solved}/{topic.total}
                          </span>
                        </div>
                        <div className='h-2 bg-surface-3 rounded-full overflow-hidden'>
                          <div
                            className='h-full rounded-full transition-all duration-700 bg-gradient-to-r from-primary to-accent'
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  No topic data available.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Extra Stats */}
        <motion.div variants={item} className='lg:col-span-1'>
          <Card className='glass-card border-border/50 h-full'>
            <CardHeader>
              <CardTitle className='text-base'>Stats</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {[
                { label: 'Max Streak', value: `${user.maxStreak} days` },
                {
                  label: 'Current Streak',
                  value: `${user.currentStreak} days`,
                },
                { label: 'Global Rank', value: `#${user.rank}`, mono: true },
                { label: 'Total Submissions', value: user.totalSubmissions },
                { label: 'Acceptance Rate', value: `${user.acceptanceRate}%` },
              ].map(({ label, value, mono }) => (
                <div key={label} className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>{label}</span>
                  <span
                    className={`text-sm font-semibold ${mono ? 'font-mono' : ''}`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Submissions */}
        <motion.div variants={item} className='lg:col-span-2'>
          <Card className='glass-card border-border/50 h-full'>
            <CardHeader>
              <CardTitle className='text-base'>Recent Submissions</CardTitle>
              <CardDescription className='text-xs'>
                Latest activity from this user
              </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
              {user.recentSubmissions.length === 0 ? (
                <div className='text-center py-8'>
                  <p className='text-sm text-muted-foreground'>
                    No submissions yet.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className='border-border/50 hover:bg-transparent'>
                      <TableHead className='text-muted-foreground text-xs font-semibold'>
                        Problem
                      </TableHead>
                      <TableHead className='text-muted-foreground text-xs font-semibold w-[100px]'>
                        Status
                      </TableHead>
                      <TableHead className='text-muted-foreground text-xs font-semibold w-[80px] hidden sm:table-cell'>
                        Lang
                      </TableHead>
                      <TableHead className='text-muted-foreground text-xs font-semibold w-[70px] hidden sm:table-cell'>
                        Runtime
                      </TableHead>
                      <TableHead className='text-muted-foreground text-xs font-semibold w-[80px]'>
                        Time
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.recentSubmissions.map((sub, i) => (
                      <TableRow
                        key={i}
                        className='border-border/30 hover:bg-surface-2/50'
                      >
                        <TableCell>
                          <Link
                            to={`/problem/${sub.problemId}`}
                            className='text-sm font-medium text-foreground hover:text-primary transition-colors'
                          >
                            {sub.problem}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-1.5'>
                            {sub.status === 'Accepted' ? (
                              <CheckCircle className='h-3.5 w-3.5 text-primary shrink-0' />
                            ) : (
                              <Code2 className='h-3.5 w-3.5 text-destructive shrink-0' />
                            )}
                            <span
                              className={`text-xs font-medium ${sub.status === 'Accepted' ? 'text-primary' : 'text-destructive'}`}
                            >
                              {sub.status === 'Accepted'
                                ? 'AC'
                                : sub.status === 'Wrong Answer'
                                  ? 'WA'
                                  : sub.status === 'Time Limit Exceeded'
                                    ? 'TLE'
                                    : 'RE'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          <span className='text-xs text-muted-foreground'>
                            {sub.language}
                          </span>
                        </TableCell>
                        <TableCell className='hidden sm:table-cell'>
                          <span className='text-xs text-muted-foreground font-mono'>
                            {sub.runtime}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className='text-xs text-muted-foreground'>
                            {sub.date}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
      >
        <AlertDialogContent className='bg-card border-border/50'>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='border-border/50'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleConfirmAction()}
              disabled={isUpdatingRole}
              className={
                confirmAction?.type === 'demote'
                  ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              }
            >
              {isUpdatingRole && (
                <Loader2 className='h-3.5 w-3.5 animate-spin mr-1.5' />
              )}
              {confirmAction?.type === 'promote' ? 'Promote' : 'Remove Admin'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
