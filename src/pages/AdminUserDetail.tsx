import { useState, useMemo } from 'react';
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
  Ban,
  UserCheck,
  ShieldAlert,
  ShieldOff,
} from 'lucide-react';
import { platformUsers, type PlatformUser } from '@/data/users';
import { toast } from 'sonner';


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

const difficultyTotals = { Easy: 80, Medium: 120, Hard: 50 };

const statusConfig: Record<string, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-muted/50 text-muted-foreground border-border/50',
  },
  banned: {
    label: 'Banned',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();

  const baseUser = platformUsers.find((u) => u.id === id);

  const [userOverrides, setUserOverrides] = useState<{
    status?: PlatformUser['status'];
    role?: PlatformUser['role'];
  }>({});

  const [confirmAction, setConfirmAction] = useState<{
    type: 'ban' | 'unban' | 'promote' | 'demote';
    title: string;
    description: string;
  } | null>(null);

  const user = useMemo(() => {
    if (!baseUser) return null;
    return { ...baseUser, ...userOverrides };
  }, [baseUser, userOverrides]);

  const breakdown = useMemo(() => {
    if (!user) return [];
    return difficultyConfig.map((d) => ({
      ...d,
      solved: user[d.key],
      total: difficultyTotals[d.level as keyof typeof difficultyTotals],
    }));
  }, [user]);

  const handleConfirmAction = () => {
    if (!confirmAction || !user) return;

    switch (confirmAction.type) {
      case 'ban':
        setUserOverrides((prev) => ({ ...prev, status: 'banned' }));
        toast.success('User banned', {
          description: `${user.displayName} has been banned from the platform.`,
        });
        break;
      case 'unban':
        setUserOverrides((prev) => ({ ...prev, status: 'active' }));
        toast.success('User unbanned', {
          description: `${user.displayName} has been restored to active status.`,
        });
        break;
      case 'promote':
        setUserOverrides((prev) => ({ ...prev, role: 'admin' }));
        toast.success('Role updated', {
          description: `${user.displayName} is now an admin.`,
        });
        break;
      case 'demote':
        setUserOverrides((prev) => ({ ...prev, role: 'user' }));
        toast.success('Role updated', {
          description: `${user.displayName} is now a regular user.`,
        });
        break;
    }
    setConfirmAction(null);
  };

  if (!user) {
    return (
      <div className='p-6 lg:p-8 max-w-7xl'>
        <Link
          to='/admin/users'
          className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6'
        >
          <ChevronLeft className='h-4 w-4' />
          Back to Users
        </Link>
        <div className='text-center py-20'>
          <p className='text-muted-foreground'>User not found.</p>
        </div>
      </div>
    );
  }

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

      {/* User Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='glass-card p-6 glow-border mb-8'
      >
        <div className='flex flex-col sm:flex-row items-start gap-5'>
          <div className='h-16 w-16 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 border-2 border-primary/30 flex items-center justify-center shrink-0'>
            <span className='text-xl font-bold gradient-text'>
              {user.initials}
            </span>
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex flex-wrap items-center gap-2 mb-1'>
              <h1 className='text-xl font-bold'>{user.displayName}</h1>
              <Badge
                variant='outline'
                className={`text-[10px] font-medium border ${statusConfig[user.status].className}`}
              >
                {statusConfig[user.status].label}
              </Badge>
              {user.role === 'admin' && (
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
              <span className='flex items-center gap-1.5'>
                <Clock className='h-3.5 w-3.5' />
                Last active {user.lastActive}
              </span>
            </div>
          </div>

          {/* Admin Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='border-border/50 text-muted-foreground hover:text-foreground shrink-0 gap-1.5'
              >
                <MoreVertical className='h-4 w-4' />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-48 bg-card border-border/50'
            >
              {/* Role actions */}
              {user.role === 'user' ? (
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

              {/* Ban/Unban actions */}
              {user.status === 'banned' ? (
                <DropdownMenuItem
                  className='text-sm cursor-pointer flex items-center gap-2 text-primary'
                  onClick={() =>
                    setConfirmAction({
                      type: 'unban',
                      title: 'Unban User',
                      description: `Are you sure you want to unban "${user.displayName}"? They will regain access to the platform.`,
                    })
                  }
                >
                  <UserCheck className='h-3.5 w-3.5' />
                  Unban User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className='text-sm cursor-pointer flex items-center gap-2 text-destructive'
                  onClick={() =>
                    setConfirmAction({
                      type: 'ban',
                      title: 'Ban User',
                      description: `Are you sure you want to ban "${user.displayName}"? They will lose access to the platform.`,
                    })
                  }
                >
                  <Ban className='h-3.5 w-3.5' />
                  Ban User
                </DropdownMenuItem>
              )}
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
              accent: 'text-[hsl(var(--emerald-light))]',
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
        {/* Solved Problems Chart */}
        <motion.div variants={item} className='lg:col-span-1'>
          <Card className='glass-card border-border/50 h-full'>
            <CardHeader>
              <CardTitle className='text-base'>Solved Problems</CardTitle>
              <CardDescription className='text-xs'>
                By difficulty
              </CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col items-center'>
              {/* Donut chart */}
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
                        style={{ width: `${(d.solved / d.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Topics Progress */}
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
                    const pct = (topic.solved / topic.total) * 100;
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
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Max Streak
                </span>
                <span className='text-sm font-semibold'>
                  {user.maxStreak} days
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Current Streak
                </span>
                <span className='text-sm font-semibold'>
                  {user.currentStreak} days
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Global Rank
                </span>
                <span className='text-sm font-semibold font-mono'>
                  #{user.rank}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Total Submissions
                </span>
                <span className='text-sm font-semibold'>
                  {user.totalSubmissions}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Acceptance Rate
                </span>
                <span className='text-sm font-semibold'>
                  {user.acceptanceRate}%
                </span>
              </div>
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
                            className={`text-xs font-medium ${
                              sub.status === 'Accepted'
                                ? 'text-primary'
                                : 'text-destructive'
                            }`}
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
              {user.recentSubmissions.length === 0 && (
                <div className='text-center py-8'>
                  <p className='text-sm text-muted-foreground'>
                    No submissions yet.
                  </p>
                </div>
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
              onClick={handleConfirmAction}
              className={
                confirmAction?.type === 'ban'
                  ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              }
            >
              {confirmAction?.type === 'ban'
                ? 'Ban User'
                : confirmAction?.type === 'unban'
                  ? 'Unban User'
                  : confirmAction?.type === 'promote'
                    ? 'Promote'
                    : 'Remove Admin'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
