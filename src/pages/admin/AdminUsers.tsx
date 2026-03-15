// src/pages/admin/AdminUsersPage.tsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Users,
  Flame,
  Eye,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useAdminUsers } from '@/hooks/admin/useAdminUsers';

// ─── Design tokens (matches AdminDashboard) ───────────────────────────────────

const C = {
  blue: 'hsl(210 100% 65%)',
  teal: 'hsl(168 78% 52%)',
  green: 'hsl(142 68% 50%)',
  amber: 'hsl(45 90% 56%)',
  red: 'hsl(4 75% 58%)',
  violet: 'hsl(258 82% 70%)',

  bg: 'hsl(222 32% 7%)',
  card: 'hsl(222 30% 9% / 0.75)',
  cardBdr: 'hsl(222 25% 16%)',

  t1: 'hsl(220 18% 85%)',
  t2: 'hsl(220 15% 52%)',
  t3: 'hsl(220 15% 34%)',
  skl: 'hsl(222 25% 12%)',
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { users, stats, isPending, isError, error } = useAdminUsers();

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter((u) => {
      const matchSearch =
        u.displayName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      return matchSearch && (roleFilter === 'all' || u.role === roleFilter);
    });
  }, [users, searchQuery, roleFilter]);

  const adminCount = isPending
    ? 0
    : users.filter((u) => u.role === 'ADMIN').length;
  const userCount = isPending
    ? 0
    : users.filter((u) => u.role === 'USER').length;

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
            bottom: '15%',
            right: '5%',
            width: '35%',
            height: '35%',
            background:
              'radial-gradient(ellipse, hsl(168 78% 45% / 0.04) 0%, transparent 65%)',
            filter: 'blur(55px)',
          }}
        />
      </div>

      <div className='relative p-6 lg:p-8 max-w-7xl' style={{ zIndex: 1 }}>
        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
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
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: `linear-gradient(125deg, ${C.t1} 0%, hsl(220 15% 58%) 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
            }}
          >
            Users
          </h1>
          <p style={{ color: C.t3, fontSize: '13px', marginTop: '4px' }}>
            Platform members · activity · role management
          </p>
        </motion.div>

        {/* ── Error ─────────────────────────────────────────────────────────── */}
        {isError && (
          <div
            style={{
              marginBottom: '20px',
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
              {(error as { message?: string })?.message ??
                'Failed to load users.'}
            </span>
          </div>
        )}

        {/* ── Stat cards ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            marginBottom: '20px',
          }}
          className='grid-cols-2 sm:grid-cols-4'
        >
          <StatCard
            label='Total Users'
            value={stats?.total}
            color={C.blue}
            loading={isPending}
          />
          <StatCard
            label='Admins'
            value={adminCount}
            color={C.amber}
            loading={isPending}
          />
          <StatCard
            label='Regular Users'
            value={userCount}
            color={C.teal}
            loading={isPending}
          />
          <StatCard
            label='Total Solved'
            value={stats?.totalSolved}
            color={C.green}
            loading={isPending}
          />
        </motion.div>

        {/* ── Toolbar ───────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '14px',
                height: '14px',
                color: C.t3,
                pointerEvents: 'none',
              }}
            />
            <input
              placeholder='Search by name, username, or email…'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '10px',
                paddingLeft: '36px',
                paddingRight: '14px',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                background: C.card,
                border: `1px solid ${C.cardBdr}`,
                color: C.t1,
                caretColor: C.blue,
              }}
            />
          </div>
          {/* Role filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger
              style={{
                width: '136px',
                height: '38px',
                borderRadius: '10px',
                background: C.card,
                border: `1px solid ${C.cardBdr}`,
                fontSize: '13px',
                color: C.t2,
                gap: '6px',
              }}
            >
              <ShieldCheck
                style={{
                  width: '13px',
                  height: '13px',
                  color: C.t3,
                  flexShrink: 0,
                }}
              />
              <SelectValue placeholder='Role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Roles</SelectItem>
              <SelectItem value='ADMIN'>Admin</SelectItem>
              <SelectItem value='USER'>User</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* ── Table ─────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            borderRadius: '18px',
            overflow: 'hidden',
            border: `1px solid ${C.cardBdr}`,
            background: C.card,
            backdropFilter: 'blur(14px)',
          }}
        >
          <Table>
            <TableHeader>
              <TableRow
                style={{ borderColor: 'hsl(222 25% 14%)' }}
                className='hover:bg-transparent'
              >
                {[
                  'User',
                  'Role',
                  'Solved',
                  'Streak',
                  'Acceptance',
                  'Rank',
                  'Last Active',
                  '',
                ].map((h, i) => (
                  <TableHead
                    key={i}
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: C.t3,
                      padding: '12px 16px',
                    }}
                    className={
                      i === 3
                        ? 'hidden sm:table-cell'
                        : i === 4 || i === 5
                          ? 'hidden md:table-cell'
                          : i === 6
                            ? 'hidden lg:table-cell'
                            : ''
                    }
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i} style={{ borderColor: 'hsl(222 25% 11%)' }}>
                    <TableCell style={{ padding: '12px 16px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '10px',
                            background: C.skl,
                            flexShrink: 0,
                            animation: 'pulse 2s infinite',
                          }}
                        />
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          <div
                            style={{
                              width: '110px',
                              height: '11px',
                              borderRadius: '5px',
                              background: C.skl,
                              animation: 'pulse 2s infinite',
                            }}
                          />
                          <div
                            style={{
                              width: '80px',
                              height: '9px',
                              borderRadius: '5px',
                              background: C.skl,
                              animation: 'pulse 2s infinite',
                              animationDelay: '80ms',
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    {[48, 32, 40, 80, 32, 80].map((w, j) => (
                      <TableCell
                        key={j}
                        style={{ padding: '12px 16px' }}
                        className={
                          j === 2
                            ? 'hidden sm:table-cell'
                            : j === 3 || j === 4
                              ? 'hidden md:table-cell'
                              : j === 5
                                ? 'hidden lg:table-cell'
                                : ''
                        }
                      >
                        <div
                          style={{
                            width: `${w}px`,
                            height: '10px',
                            borderRadius: '5px',
                            background: C.skl,
                            animation: 'pulse 2s infinite',
                            animationDelay: `${j * 60}ms`,
                          }}
                        />
                      </TableCell>
                    ))}
                    <TableCell style={{ padding: '12px 16px' }} />
                  </TableRow>
                ))
              ) : (
                <AnimatePresence>
                  {filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        borderColor: 'hsl(222 25% 11%)',
                        transition: 'background 0.12s',
                      }}
                      className='group'
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
                      {/* User cell */}
                      <TableCell style={{ padding: '11px 16px' }}>
                        <Link
                          to={`/admin/users/${user.id}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            textDecoration: 'none',
                          }}
                        >
                          {user.image ? (
                            <div
                              style={{
                                position: 'relative',
                                width: '34px',
                                height: '34px',
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={user.image}
                                alt={user.displayName}
                                style={{
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: '10px',
                                  objectFit: 'cover',
                                  display: 'block',
                                }}
                                onError={(e) => {
                                  (
                                    e.currentTarget as HTMLImageElement
                                  ).style.display = 'none';
                                  const fb = (
                                    e.currentTarget as HTMLImageElement
                                  ).nextElementSibling as HTMLElement | null;
                                  if (fb) fb.style.display = 'flex';
                                }}
                              />
                              <div
                                style={{
                                  display: 'none',
                                  position: 'absolute',
                                  inset: 0,
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: '10px',
                                  background: 'hsl(210 100% 65% / 0.1)',
                                  border: '1px solid hsl(210 100% 65% / 0.2)',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    color: C.blue,
                                  }}
                                >
                                  {user.initials}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '10px',
                                flexShrink: 0,
                                background: 'hsl(210 100% 65% / 0.1)',
                                border: '1px solid hsl(210 100% 65% / 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 800,
                                  color: C.blue,
                                }}
                              >
                                {user.initials}
                              </span>
                            </div>
                          )}
                          <div style={{ minWidth: 0 }}>
                            <p
                              style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: C.t1,
                                margin: 0,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                transition: 'color 0.12s',
                              }}
                              className='group-hover:text-[hsl(210_100%_65%)]'
                            >
                              {user.displayName}
                            </p>
                            <p
                              style={{
                                fontSize: '11px',
                                color: C.t3,
                                margin: '2px 0 0',
                                fontFamily: 'monospace',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              @{user.username}
                            </p>
                          </div>
                        </Link>
                      </TableCell>

                      {/* Role */}
                      <TableCell style={{ padding: '11px 16px' }}>
                        {user.role === 'ADMIN' ? (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: 'hsl(45 90% 56% / 0.12)',
                              color: C.amber,
                              border: '1px solid hsl(45 90% 56% / 0.25)',
                            }}
                          >
                            Admin
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: 'hsl(222 25% 13%)',
                              color: C.t3,
                              border: `1px solid ${C.cardBdr}`,
                            }}
                          >
                            User
                          </span>
                        )}
                      </TableCell>

                      {/* Solved */}
                      <TableCell
                        style={{ padding: '11px 16px', textAlign: 'center' }}
                      >
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: C.t1,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {user.totalSolved}
                        </span>
                      </TableCell>

                      {/* Streak */}
                      <TableCell
                        style={{ padding: '11px 16px', textAlign: 'center' }}
                        className='hidden sm:table-cell'
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                          }}
                        >
                          <Flame
                            style={{
                              width: '13px',
                              height: '13px',
                              color:
                                user.currentStreak > 0
                                  ? C.amber
                                  : 'hsl(220 15% 22%)',
                            }}
                          />
                          <span
                            style={{
                              fontSize: '13px',
                              color: user.currentStreak > 0 ? C.t1 : C.t3,
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {user.currentStreak}d
                          </span>
                        </div>
                      </TableCell>

                      {/* Acceptance */}
                      <TableCell
                        style={{ padding: '11px 16px' }}
                        className='hidden md:table-cell'
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              maxWidth: '56px',
                              height: '4px',
                              borderRadius: '99px',
                              background: C.skl,
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                borderRadius: '99px',
                                width: `${user.acceptanceRate}%`,
                                background: `linear-gradient(90deg, ${C.blue} 0%, ${C.teal} 100%)`,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: '11px',
                              color: C.t2,
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {user.acceptanceRate}%
                          </span>
                        </div>
                      </TableCell>

                      {/* Rank */}
                      <TableCell
                        style={{ padding: '11px 16px', textAlign: 'center' }}
                        className='hidden md:table-cell'
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            color: C.t3,
                          }}
                        >
                          #{user.rank}
                        </span>
                      </TableCell>

                      {/* Last Active */}
                      <TableCell
                        style={{ padding: '11px 16px' }}
                        className='hidden lg:table-cell'
                      >
                        <span style={{ fontSize: '12px', color: C.t3 }}>
                          {user.lastActive ?? '—'}
                        </span>
                      </TableCell>

                      {/* View */}
                      <TableCell style={{ padding: '11px 16px' }}>
                        <Link
                          to={`/admin/users/${user.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30px',
                            height: '30px',
                            borderRadius: '8px',
                            color: C.t3,
                            transition: 'all 0.12s',
                            textDecoration: 'none',
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLAnchorElement
                            ).style.background = 'hsl(210 100% 65% / 0.1)';
                            (e.currentTarget as HTMLAnchorElement).style.color =
                              C.blue;
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLAnchorElement
                            ).style.background = 'transparent';
                            (e.currentTarget as HTMLAnchorElement).style.color =
                              C.t3;
                          }}
                        >
                          <Eye style={{ width: '14px', height: '14px' }} />
                        </Link>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>

          {!isPending && filteredUsers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <Users
                style={{
                  width: '36px',
                  height: '36px',
                  color: 'hsl(220 15% 20%)',
                  margin: '0 auto 12px',
                }}
              />
              <p style={{ color: C.t3, fontSize: '13px' }}>
                {searchQuery || roleFilter !== 'all'
                  ? 'No users match your filters.'
                  : 'No users found.'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  color,
  loading,
}: {
  label: string;
  value: number | undefined;
  color: string;
  loading?: boolean;
}) {
  const ring = color.replace(')', ' / 0.22)').replace('hsl(', 'hsl(');
  const glow = color.replace(')', ' / 0.08)').replace('hsl(', 'hsl(');
  const bg = color.replace(')', ' / 0.10)').replace('hsl(', 'hsl(');

  return (
    <div
      style={{
        borderRadius: '16px',
        padding: '16px 18px',
        position: 'relative',
        overflow: 'hidden',
        background: C.card,
        border: `1px solid ${ring}`,
        backdropFilter: 'blur(14px)',
        boxShadow: `0 0 20px ${glow}, 0 1px 0 hsl(222 25% 20% / 0.4) inset`,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60px',
          height: '60px',
          background: `radial-gradient(circle at top right, ${bg} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              height: '10px',
              width: '56px',
              borderRadius: '5px',
              background: C.skl,
              animation: 'pulse 2s infinite',
            }}
          />
          <div
            style={{
              height: '24px',
              width: '44px',
              borderRadius: '6px',
              background: C.skl,
              animation: 'pulse 2s infinite',
            }}
          />
        </div>
      ) : (
        <>
          <p
            style={{
              fontSize: '11px',
              color: C.t3,
              margin: '0 0 5px',
              fontWeight: 500,
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color,
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {value?.toLocaleString() ?? '—'}
          </p>
        </>
      )}
    </div>
  );
}
