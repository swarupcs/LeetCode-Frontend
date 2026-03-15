// src/pages/admin/AdminUserDetailPage.tsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
import { C } from './adminTokens';

// ─── Animations ───────────────────────────────────────────────────────────────

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

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

  const handleConfirm = async () => {
    if (!confirmAction || !user) return;
    try {
      await updateRole(confirmAction.type === 'promote' ? 'ADMIN' : 'USER');
      toast.success(
        confirmAction.type === 'promote'
          ? 'User promoted to admin'
          : 'Admin role removed',
        { description: `${user.displayName} role updated successfully.` },
      );
    } catch (err) {
      toast.error('Action failed', {
        description:
          (err as { message?: string })?.message ?? 'Failed to update role',
      });
    } finally {
      setConfirmAction(null);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────

  if (isPending) {
    return (
      <div className='p-6 lg:p-8 max-w-7xl'>
        <div className='flex items-center gap-1.5 text-sm text-muted-foreground mb-6'>
          <ChevronLeft className='h-4 w-4' />
          Back to Users
        </div>
        <div className='glass-card p-6 mb-6 animate-pulse'>
          <div className='flex items-start gap-5'>
            <div className='h-16 w-16 rounded-2xl bg-surface-3 shrink-0' />
            <div className='flex-1 space-y-3'>
              <div className='h-5 w-44 rounded bg-surface-3' />
              <div className='h-3.5 w-32 rounded bg-surface-3' />
              <div className='h-3 w-64 rounded bg-surface-3' />
            </div>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-border/30'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='h-14 rounded-xl bg-surface-3' />
            ))}
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          {[1, 2, 1, 2].map((span, i) => (
            <div
              key={i}
              className={`glass-card h-56 animate-pulse bg-surface-2/40 lg:col-span-${span}`}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────

  if (isError || !user) {
    return (
      <div className='p-6 lg:p-8 max-w-7xl'>
        <Link
          to='/admin/users'
          className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6'
        >
          <ChevronLeft className='h-4 w-4' />
          Back to Users
        </Link>
        <div className='flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-destructive border border-destructive/30 bg-destructive/5'>
          <AlertCircle className='h-4 w-4 shrink-0' />
          <span>
            {(error as { message?: string })?.message ?? 'User not found.'}
          </span>
        </div>
      </div>
    );
  }

  // ── Derived ───────────────────────────────────────────────────────────────

  const diffBreakdown = [
    {
      label: 'Easy',
      color: C.green,
      solved: user.easySolved,
      total: user.difficultyTotals.easy,
    },
    {
      label: 'Medium',
      color: C.amber,
      solved: user.mediumSolved,
      total: user.difficultyTotals.medium,
    },
    {
      label: 'Hard',
      color: C.red,
      solved: user.hardSolved,
      total: user.difficultyTotals.hard,
    },
  ];
  const circumference = 2 * Math.PI * 50;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className='p-6 lg:p-8 max-w-7xl'>
      {/* Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link
          to='/admin/users'
          className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6'
        >
          <ChevronLeft className='h-4 w-4' />
          Back to Users
        </Link>
      </motion.div>

      {/* ── Profile header ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className='glass-card p-6 glow-border mb-6'
      >
        <div className='flex flex-col sm:flex-row items-start gap-5'>
          {/* Avatar */}
          <Avatar image={user.image} initials={user.initials} size={64} />

          {/* Info */}
          <div className='flex-1 min-w-0'>
            <div className='flex flex-wrap items-center gap-2 mb-1'>
              <h1 className='text-xl font-extrabold text-foreground tracking-tight'>
                {user.displayName}
              </h1>
              {user.role === 'ADMIN' && (
                <span
                  className='inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md'
                  style={{
                    background: `color-mix(in oklch, ${C.amber} 12%, transparent)`,
                    color: C.amber,
                    border: `1px solid color-mix(in oklch, ${C.amber} 25%, transparent)`,
                  }}
                >
                  <ShieldCheck className='h-2.5 w-2.5' />
                  Admin
                </span>
              )}
            </div>
            <p className='text-sm text-muted-foreground font-mono mb-3'>
              @{user.username}
            </p>
            <div className='flex flex-wrap gap-x-4 gap-y-1.5'>
              {[
                { icon: Mail, text: user.email },
                { icon: Calendar, text: `Joined ${user.joinDate}` },
                ...(user.lastActive
                  ? [{ icon: Clock, text: `Active ${user.lastActive}` }]
                  : []),
              ].map(({ icon: Icon, text }, i) => (
                <span
                  key={i}
                  className='flex items-center gap-1.5 text-xs text-muted-foreground'
                >
                  <Icon className='h-3.5 w-3.5 shrink-0' />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                disabled={isUpdatingRole}
                className='flex items-center gap-1.5 h-8 px-3.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground bg-surface-2 border border-border hover:border-border/80 transition-all cursor-pointer disabled:opacity-50'
              >
                {isUpdatingRole ? (
                  <Loader2 className='h-3.5 w-3.5 animate-spin' />
                ) : (
                  <MoreVertical className='h-3.5 w-3.5' />
                )}
                Actions
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-48 bg-card border-border/50'
            >
              {user.role === 'USER' ? (
                <DropdownMenuItem
                  className='text-sm cursor-pointer gap-2'
                  onClick={() =>
                    setConfirmAction({
                      type: 'promote',
                      title: 'Promote to Admin',
                      description: `Make "${user.displayName}" an admin? They will have full platform access.`,
                    })
                  }
                >
                  <ShieldAlert className='h-3.5 w-3.5' />
                  Promote to Admin
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className='text-sm cursor-pointer gap-2'
                  onClick={() =>
                    setConfirmAction({
                      type: 'demote',
                      title: 'Remove Admin Role',
                      description: `Remove admin privileges from "${user.displayName}"?`,
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

        {/* Quick stats */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-border/30'>
          {[
            {
              label: 'Solved',
              value: user.totalSolved,
              icon: CheckCircle,
              color: C.blue,
            },
            {
              label: 'Streak',
              value: `${user.currentStreak}d`,
              icon: Flame,
              color: C.amber,
            },
            {
              label: 'Submissions',
              value: user.totalSubmissions,
              icon: Target,
              color: C.violet,
            },
            {
              label: 'Acceptance',
              value: `${user.acceptanceRate}%`,
              icon: TrendingUp,
              color: C.green,
            },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <div
              key={i}
              className='flex items-center gap-3 p-3 rounded-xl bg-surface-2/50'
            >
              <div
                className='h-8 w-8 rounded-lg shrink-0 flex items-center justify-center'
                style={{
                  background: `color-mix(in oklch, ${color} 10%, transparent)`,
                  border: `1px solid color-mix(in oklch, ${color} 20%, transparent)`,
                }}
              >
                <Icon className='h-3.5 w-3.5' style={{ color }} />
              </div>
              <div>
                <p className='text-base font-extrabold text-foreground leading-none'>
                  {value}
                </p>
                <p className='text-[11px] text-muted-foreground mt-0.5'>
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Content grid ────────────────────────────────────────────────────── */}
      <motion.div
        variants={stagger}
        initial='hidden'
        animate='show'
        className='grid grid-cols-1 lg:grid-cols-3 gap-4'
      >
        {/* Donut + difficulty */}
        <motion.div variants={fadeUp} className='lg:col-span-1'>
          <InfoPanel title='Solved Problems' sub='By difficulty'>
            <div className='flex justify-center mb-5'>
              <div className='relative w-32 h-32'>
                <svg
                  width='128'
                  height='128'
                  viewBox='0 0 128 128'
                  style={{ transform: 'rotate(-90deg)' }}
                >
                  <circle
                    cx='64'
                    cy='64'
                    r='50'
                    stroke='var(--surface-3)'
                    strokeWidth='10'
                    fill='transparent'
                  />
                  {user.totalSolved > 0 &&
                    diffBreakdown.reduce<{
                      els: React.ReactElement[];
                      offset: number;
                    }>(
                      (acc, d, i) => {
                        const segLen =
                          (d.solved / user.totalSolved) * circumference;
                        if (d.solved > 0)
                          acc.els.push(
                            <circle
                              key={i}
                              cx='64'
                              cy='64'
                              r='50'
                              stroke={d.color}
                              strokeWidth='10'
                              fill='transparent'
                              strokeDasharray={`${segLen} ${circumference - segLen}`}
                              strokeDashoffset={-acc.offset}
                              strokeLinecap='round'
                              style={{ transition: 'all 0.7s' }}
                            />,
                          );
                        acc.offset += segLen;
                        return acc;
                      },
                      { els: [], offset: 0 },
                    ).els}
                </svg>
                <div className='absolute inset-0 flex flex-col items-center justify-center'>
                  <span className='text-2xl font-extrabold text-foreground'>
                    {user.totalSolved}
                  </span>
                  <span className='text-[10px] text-muted-foreground'>
                    solved
                  </span>
                </div>
              </div>
            </div>
            <div className='space-y-3'>
              {diffBreakdown.map((d) => {
                const pct = d.total > 0 ? (d.solved / d.total) * 100 : 0;
                return (
                  <div key={d.label}>
                    <div className='flex justify-between text-xs mb-1.5'>
                      <span
                        className='font-semibold'
                        style={{ color: d.color }}
                      >
                        {d.label}
                      </span>
                      <span className='text-muted-foreground tabular-nums'>
                        {d.solved}/{d.total}
                      </span>
                    </div>
                    <div className='h-1.5 rounded-full overflow-hidden bg-surface-3'>
                      <motion.div
                        className='h-full rounded-full'
                        style={{ background: d.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.85, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </InfoPanel>
        </motion.div>

        {/* Topic skills */}
        <motion.div variants={fadeUp} className='lg:col-span-2'>
          <InfoPanel title='Skills by Topic' sub='Progress across categories'>
            {user.topTopics.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
                {user.topTopics.map((topic) => {
                  const pct =
                    topic.total > 0 ? (topic.solved / topic.total) * 100 : 0;
                  return (
                    <div key={topic.topic}>
                      <div className='flex justify-between text-xs mb-1.5'>
                        <span className='font-medium text-foreground'>
                          {topic.topic}
                        </span>
                        <span className='text-muted-foreground tabular-nums'>
                          {topic.solved}/{topic.total}
                        </span>
                      </div>
                      <div className='h-1.5 rounded-full overflow-hidden bg-surface-3'>
                        <motion.div
                          className='h-full rounded-full'
                          style={{
                            background: `linear-gradient(90deg, ${C.blue} 0%, ${C.teal} 100%)`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.75, ease: 'easeOut' }}
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
          </InfoPanel>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} className='lg:col-span-1'>
          <InfoPanel title='Statistics' sub='Full breakdown'>
            <div>
              {[
                { label: 'Max Streak', value: `${user.maxStreak} days` },
                {
                  label: 'Current Streak',
                  value: `${user.currentStreak} days`,
                },
                { label: 'Global Rank', value: `#${user.rank}`, mono: true },
                {
                  label: 'Total Submissions',
                  value: user.totalSubmissions.toLocaleString(),
                },
                { label: 'Acceptance Rate', value: `${user.acceptanceRate}%` },
              ].map(({ label, value, mono }, i, arr) => (
                <div
                  key={label}
                  className='flex justify-between items-center py-2.5'
                  style={{
                    borderBottom:
                      i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    opacity: 0.9,
                  }}
                >
                  <span className='text-sm text-muted-foreground'>{label}</span>
                  <span
                    className={`text-sm font-bold text-foreground ${mono ? 'font-mono' : ''}`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </InfoPanel>
        </motion.div>

        {/* Recent submissions */}
        <motion.div variants={fadeUp} className='lg:col-span-2'>
          <InfoPanel title='Recent Submissions' sub='Latest activity'>
            {user.recentSubmissions.length === 0 ? (
              <p className='text-sm text-muted-foreground text-center py-6'>
                No submissions yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className='border-border/50 hover:bg-transparent'>
                    {[
                      ['Problem', ''],
                      ['Status', '96px'],
                      ['Lang', '80px'],
                      ['Runtime', '72px'],
                      ['Date', '88px'],
                    ].map(([h, w], i) => (
                      <TableHead
                        key={i}
                        className={`text-[10px] font-bold tracking-[0.06em] uppercase text-muted-foreground px-3 py-2 ${i === 2 || i === 3 ? 'hidden sm:table-cell' : ''}`}
                        style={{ width: w || undefined }}
                      >
                        {h}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.recentSubmissions.map((sub, i) => {
                    const accepted = sub.status === 'Accepted';
                    const label = accepted
                      ? 'AC'
                      : sub.status === 'Wrong Answer'
                        ? 'WA'
                        : sub.status === 'Time Limit Exceeded'
                          ? 'TLE'
                          : 'RE';
                    return (
                      <TableRow
                        key={i}
                        className='border-border/30 hover:bg-surface-2/50 transition-colors'
                      >
                        <TableCell className='px-3 py-2.5'>
                          <Link
                            to={`/problem/${sub.problemId}`}
                            className='text-sm font-medium text-foreground hover:text-primary transition-colors'
                          >
                            {sub.problem}
                          </Link>
                        </TableCell>
                        <TableCell className='px-3 py-2.5'>
                          <div className='flex items-center gap-1.5'>
                            {accepted ? (
                              <CheckCircle
                                className='h-3 w-3 shrink-0'
                                style={{ color: C.green }}
                              />
                            ) : (
                              <Code2
                                className='h-3 w-3 shrink-0'
                                style={{ color: C.red }}
                              />
                            )}
                            <span
                              className='text-xs font-bold'
                              style={{ color: accepted ? C.green : C.red }}
                            >
                              {label}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='px-3 py-2.5 hidden sm:table-cell'>
                          <span className='text-xs text-muted-foreground'>
                            {sub.language}
                          </span>
                        </TableCell>
                        <TableCell className='px-3 py-2.5 hidden sm:table-cell'>
                          <span className='text-xs text-muted-foreground font-mono'>
                            {sub.runtime}
                          </span>
                        </TableCell>
                        <TableCell className='px-3 py-2.5'>
                          <span className='text-xs text-muted-foreground'>
                            {sub.date}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </InfoPanel>
        </motion.div>
      </motion.div>

      {/* ── Confirm dialog ──────────────────────────────────────────────────── */}
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
              onClick={() => void handleConfirm()}
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

// ─── Shared Avatar component ─────────────────────────────────────────────────

function Avatar({
  image,
  initials,
  size,
}: {
  image: string | null;
  initials: string;
  size: number;
}) {
  const radius = size > 40 ? 16 : 10;
  const fontSize = size > 40 ? 20 : 11;

  if (!image) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          flexShrink: 0,
          background: `color-mix(in oklch, ${C.blue} 10%, transparent)`,
          border: `2px solid color-mix(in oklch, ${C.blue} 22%, transparent)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize, fontWeight: 800, color: C.blue }}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
    >
      <img
        src={image}
        alt={initials}
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          objectFit: 'cover',
          display: 'block',
        }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
          const fb = (e.currentTarget as HTMLImageElement)
            .nextElementSibling as HTMLElement | null;
          if (fb) fb.style.display = 'flex';
        }}
      />
      <div
        style={{
          display: 'none',
          position: 'absolute',
          inset: 0,
          width: size,
          height: size,
          borderRadius: radius,
          background: `color-mix(in oklch, ${C.blue} 10%, transparent)`,
          border: `2px solid color-mix(in oklch, ${C.blue} 22%, transparent)`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize, fontWeight: 800, color: C.blue }}>
          {initials}
        </span>
      </div>
    </div>
  );
}

// ─── InfoPanel ─────────────────────────────────────────────────────────────────

function InfoPanel({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='glass-card p-5 h-full flex flex-col gap-4'>
      <div>
        <p className='text-sm font-bold text-foreground'>{title}</p>
        {sub && (
          <p className='text-[11px] text-muted-foreground mt-0.5'>{sub}</p>
        )}
      </div>
      <div className='flex-1'>{children}</div>
    </div>
  );
}
