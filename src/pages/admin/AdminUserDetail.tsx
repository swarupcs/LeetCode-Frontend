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

// ─── Design tokens (matches AdminDashboard + AdminUsersPage) ──────────────────

const C = {
  blue: 'hsl(210 100% 65%)',
  teal: 'hsl(168 78% 52%)',
  green: 'hsl(142 68% 50%)',
  amber: 'hsl(45 90% 56%)',
  red: 'hsl(4 75% 58%)',
  violet: 'hsl(258 82% 70%)',

  card: 'hsl(222 30% 9% / 0.75)',
  cardBdr: 'hsl(222 25% 16%)',
  surface: 'hsl(222 25% 12%)',
  skl: 'hsl(222 25% 12%)',

  t1: 'hsl(220 18% 85%)',
  t2: 'hsl(220 15% 52%)',
  t3: 'hsl(220 15% 34%)',
} as const;

// ─── Animation variants ───────────────────────────────────────────────────────

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
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
      <div className='relative p-6 lg:p-8 max-w-7xl'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: C.t3,
            fontSize: '13px',
            marginBottom: '24px',
          }}
        >
          <ChevronLeft style={{ width: '14px', height: '14px' }} />
          Back to Users
        </div>
        {/* Header skeleton */}
        <div
          style={{
            borderRadius: '18px',
            padding: '24px',
            marginBottom: '24px',
            background: C.card,
            border: `1px solid ${C.cardBdr}`,
            animation: 'pulse 2s infinite',
          }}
        >
          <div
            style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: C.skl,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '180px',
                  height: '22px',
                  borderRadius: '6px',
                  background: C.skl,
                }}
              />
              <div
                style={{
                  width: '120px',
                  height: '13px',
                  borderRadius: '5px',
                  background: C.skl,
                }}
              />
              <div
                style={{
                  width: '260px',
                  height: '11px',
                  borderRadius: '5px',
                  background: C.skl,
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: `1px solid ${C.cardBdr}`,
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '56px',
                  borderRadius: '12px',
                  background: C.skl,
                }}
              />
            ))}
          </div>
        </div>
        {/* Grid skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '16px',
          }}
        >
          {[false, true, false, true].map((wide, i) => (
            <div
              key={i}
              style={{
                gridColumn: wide ? 'span 1' : 'span 1',
                height: '240px',
                borderRadius: '18px',
                background: C.card,
                border: `1px solid ${C.cardBdr}`,
                animation: 'pulse 2s infinite',
                animationDelay: `${i * 80}ms`,
              }}
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
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: C.t3,
            fontSize: '13px',
            marginBottom: '20px',
            textDecoration: 'none',
            transition: 'color 0.12s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = C.t1;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = C.t3;
          }}
        >
          <ChevronLeft style={{ width: '14px', height: '14px' }} />
          Back to Users
        </Link>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '13px',
            border: '1px solid hsl(4 75% 50% / 0.28)',
            background: 'hsl(4 75% 50% / 0.07)',
            color: 'hsl(4 75% 65%)',
          }}
        >
          <AlertCircle
            style={{ width: '15px', height: '15px', flexShrink: 0 }}
          />
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
    <div className='relative'>
      {/* Ambient glows */}
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
              'radial-gradient(ellipse, hsl(210 100% 50% / 0.05) 0%, transparent 65%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '35%',
            height: '35%',
            background:
              'radial-gradient(ellipse, hsl(258 82% 55% / 0.04) 0%, transparent 65%)',
            filter: 'blur(55px)',
          }}
        />
      </div>

      <div className='relative p-6 lg:p-8 max-w-7xl' style={{ zIndex: 1 }}>
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link
            to='/admin/users'
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: C.t3,
              fontSize: '13px',
              marginBottom: '24px',
              textDecoration: 'none',
              transition: 'color 0.12s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = C.t1;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = C.t3;
            }}
          >
            <ChevronLeft style={{ width: '14px', height: '14px' }} />
            Back to Users
          </Link>
        </motion.div>

        {/* ── Profile header card ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            borderRadius: '20px',
            padding: '24px',
            background: C.card,
            border: `1px solid ${C.cardBdr}`,
            backdropFilter: 'blur(14px)',
            boxShadow: `0 0 30px hsl(210 100% 50% / 0.06), 0 1px 0 hsl(222 25% 20% / 0.4) inset`,
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            {/* Avatar */}
            {user.image ? (
              <div
                style={{
                  position: 'relative',
                  width: '64px',
                  height: '64px',
                  flexShrink: 0,
                }}
              >
                <img
                  src={user.image}
                  alt={user.displayName}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      'none';
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
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'hsl(210 100% 65% / 0.1)',
                    border: '2px solid hsl(210 100% 65% / 0.22)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{ fontSize: '20px', fontWeight: 800, color: C.blue }}
                  >
                    {user.initials}
                  </span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  flexShrink: 0,
                  background: 'hsl(210 100% 65% / 0.1)',
                  border: '2px solid hsl(210 100% 65% / 0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{ fontSize: '20px', fontWeight: 800, color: C.blue }}
                >
                  {user.initials}
                </span>
              </div>
            )}

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  marginBottom: '4px',
                }}
              >
                <h1
                  style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: C.t1,
                    margin: 0,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {user.displayName}
                </h1>
                {user.role === 'ADMIN' && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'hsl(45 90% 56% / 0.12)',
                      color: C.amber,
                      border: '1px solid hsl(45 90% 56% / 0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <ShieldCheck style={{ width: '10px', height: '10px' }} />
                    Admin
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: '13px',
                  color: C.t3,
                  margin: '0 0 12px',
                  fontFamily: 'monospace',
                }}
              >
                @{user.username}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {[
                  { icon: Mail, text: user.email },
                  { icon: Calendar, text: `Joined ${user.joinDate}` },
                  ...(user.lastActive
                    ? [{ icon: Clock, text: `Active ${user.lastActive}` }]
                    : []),
                ].map(({ icon: Icon, text }, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      color: C.t2,
                    }}
                  >
                    <Icon
                      style={{
                        width: '13px',
                        height: '13px',
                        color: C.t3,
                        flexShrink: 0,
                      }}
                    />
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    height: '34px',
                    padding: '0 14px',
                    borderRadius: '10px',
                    background: 'hsl(222 25% 13%)',
                    border: `1px solid ${C.cardBdr}`,
                    color: C.t2,
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'border-color 0.12s, color 0.12s',
                  }}
                >
                  {isUpdatingRole ? (
                    <Loader2
                      style={{
                        width: '14px',
                        height: '14px',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                  ) : (
                    <MoreVertical style={{ width: '14px', height: '14px' }} />
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
                    className='text-sm cursor-pointer flex items-center gap-2'
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
                    className='text-sm cursor-pointer flex items-center gap-2'
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

          {/* Quick stats row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              marginTop: '20px',
              paddingTop: '18px',
              borderTop: `1px solid hsl(222 25% 14%)`,
            }}
            className='grid-cols-2 sm:grid-cols-4'
          >
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'hsl(222 25% 11%)',
                  border: `1px solid hsl(222 25% 15%)`,
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    flexShrink: 0,
                    background: color
                      .replace(')', ' / 0.1)')
                      .replace('hsl(', 'hsl('),
                    border: `1px solid ${color.replace(')', ' / 0.2)').replace('hsl(', 'hsl(')}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon style={{ width: '14px', height: '14px', color }} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '16px',
                      fontWeight: 800,
                      color: C.t1,
                      margin: 0,
                      lineHeight: 1.1,
                    }}
                  >
                    {value}
                  </p>
                  <p
                    style={{ fontSize: '11px', color: C.t3, margin: '2px 0 0' }}
                  >
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Content grid ────────────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial='hidden'
          animate='show'
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '16px',
          }}
          className='grid-cols-1 lg:grid-cols-3'
        >
          {/* Donut + difficulty bars */}
          <motion.div variants={fadeUp}>
            <InfoPanel title='Solved Problems' sub='By difficulty'>
              {/* Donut */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '128px',
                    height: '128px',
                  }}
                >
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
                      stroke='hsl(222 25% 13%)'
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
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{ fontSize: '22px', fontWeight: 800, color: C.t1 }}
                    >
                      {user.totalSolved}
                    </span>
                    <span style={{ fontSize: '10px', color: C.t3 }}>
                      solved
                    </span>
                  </div>
                </div>
              </div>
              {/* Bars */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {diffBreakdown.map((d) => {
                  const pct = d.total > 0 ? (d.solved / d.total) * 100 : 0;
                  return (
                    <div key={d.label}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '6px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: d.color,
                          }}
                        >
                          {d.label}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            color: C.t3,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {d.solved}/{d.total}
                        </span>
                      </div>
                      <div
                        style={{
                          height: '5px',
                          borderRadius: '99px',
                          background: C.skl,
                          overflow: 'hidden',
                        }}
                      >
                        <motion.div
                          style={{
                            height: '100%',
                            borderRadius: '99px',
                            background: d.color,
                          }}
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
          <motion.div variants={fadeUp}>
            <InfoPanel title='Skills by Topic' sub='Progress across categories'>
              {user.topTopics.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px 28px',
                  }}
                  className='grid-cols-1 sm:grid-cols-2'
                >
                  {user.topTopics.map((topic) => {
                    const pct =
                      topic.total > 0 ? (topic.solved / topic.total) * 100 : 0;
                    return (
                      <div key={topic.topic}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '5px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 500,
                              color: C.t1,
                            }}
                          >
                            {topic.topic}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              color: C.t3,
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {topic.solved}/{topic.total}
                          </span>
                        </div>
                        <div
                          style={{
                            height: '5px',
                            borderRadius: '99px',
                            background: C.skl,
                            overflow: 'hidden',
                          }}
                        >
                          <motion.div
                            style={{
                              height: '100%',
                              borderRadius: '99px',
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
                <p style={{ fontSize: '13px', color: C.t3 }}>
                  No topic data available.
                </p>
              )}
            </InfoPanel>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp}>
            <InfoPanel title='Statistics' sub='Full breakdown'>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '0' }}
              >
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
                  {
                    label: 'Acceptance Rate',
                    value: `${user.acceptanceRate}%`,
                  },
                ].map(({ label, value, mono }, i, arr) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom:
                        i < arr.length - 1
                          ? `1px solid hsl(222 25% 13%)`
                          : 'none',
                    }}
                  >
                    <span style={{ fontSize: '13px', color: C.t2 }}>
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: C.t1,
                        fontFamily: mono ? 'monospace' : undefined,
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </InfoPanel>
          </motion.div>

          {/* Recent submissions */}
          <motion.div variants={fadeUp}>
            <InfoPanel title='Recent Submissions' sub='Latest activity'>
              {user.recentSubmissions.length === 0 ? (
                <p
                  style={{
                    fontSize: '13px',
                    color: C.t3,
                    textAlign: 'center',
                    padding: '24px 0',
                  }}
                >
                  No submissions yet.
                </p>
              ) : (
                <div style={{ margin: '-8px -4px' }}>
                  <Table>
                    <TableHeader>
                      <TableRow
                        style={{ borderColor: 'hsl(222 25% 12%)' }}
                        className='hover:bg-transparent'
                      >
                        {[
                          ['Problem', ''],
                          ['Status', '96px'],
                          ['Lang', '80px'],
                          ['Runtime', '72px'],
                          ['Date', '88px'],
                        ].map(([h, w], i) => (
                          <TableHead
                            key={i}
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase',
                              color: C.t3,
                              padding: '8px 12px',
                              width: w || undefined,
                            }}
                            className={
                              i === 2 || i === 3 ? 'hidden sm:table-cell' : ''
                            }
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.recentSubmissions.map((sub, i) => {
                        const accepted = sub.status === 'Accepted';
                        const statusLabel = accepted
                          ? 'AC'
                          : sub.status === 'Wrong Answer'
                            ? 'WA'
                            : sub.status === 'Time Limit Exceeded'
                              ? 'TLE'
                              : 'RE';
                        return (
                          <TableRow
                            key={i}
                            style={{
                              borderColor: 'hsl(222 25% 11%)',
                              transition: 'background 0.1s',
                            }}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLTableRowElement
                              ).style.background = 'hsl(222 25% 11%)';
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLTableRowElement
                              ).style.background = 'transparent';
                            }}
                          >
                            <TableCell style={{ padding: '9px 12px' }}>
                              <Link
                                to={`/problem/${sub.problemId}`}
                                style={{
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  color: C.t1,
                                  textDecoration: 'none',
                                  transition: 'color 0.12s',
                                }}
                                onMouseEnter={(e) => {
                                  (
                                    e.currentTarget as HTMLAnchorElement
                                  ).style.color = C.blue;
                                }}
                                onMouseLeave={(e) => {
                                  (
                                    e.currentTarget as HTMLAnchorElement
                                  ).style.color = C.t1;
                                }}
                              >
                                {sub.problem}
                              </Link>
                            </TableCell>
                            <TableCell style={{ padding: '9px 12px' }}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                {accepted ? (
                                  <CheckCircle
                                    style={{
                                      width: '13px',
                                      height: '13px',
                                      color: C.green,
                                      flexShrink: 0,
                                    }}
                                  />
                                ) : (
                                  <Code2
                                    style={{
                                      width: '13px',
                                      height: '13px',
                                      color: C.red,
                                      flexShrink: 0,
                                    }}
                                  />
                                )}
                                <span
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: accepted ? C.green : C.red,
                                  }}
                                >
                                  {statusLabel}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell
                              style={{ padding: '9px 12px' }}
                              className='hidden sm:table-cell'
                            >
                              <span style={{ fontSize: '12px', color: C.t3 }}>
                                {sub.language}
                              </span>
                            </TableCell>
                            <TableCell
                              style={{ padding: '9px 12px' }}
                              className='hidden sm:table-cell'
                            >
                              <span
                                style={{
                                  fontSize: '12px',
                                  color: C.t3,
                                  fontFamily: 'monospace',
                                }}
                              >
                                {sub.runtime}
                              </span>
                            </TableCell>
                            <TableCell style={{ padding: '9px 12px' }}>
                              <span style={{ fontSize: '12px', color: C.t3 }}>
                                {sub.date}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </InfoPanel>
          </motion.div>
        </motion.div>

        {/* ── Confirm dialog ──────────────────────────────────────────────── */}
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
      <div>
        <p
          style={{ fontSize: '13px', fontWeight: 700, color: C.t1, margin: 0 }}
        >
          {title}
        </p>
        {sub && (
          <p style={{ fontSize: '11px', color: C.t3, margin: '2px 0 0' }}>
            {sub}
          </p>
        )}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
