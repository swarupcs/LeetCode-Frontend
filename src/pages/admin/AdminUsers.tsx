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
import { C, ACCENTS } from './adminTokens';

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
    <div className='p-6 lg:p-8 max-w-7xl'>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <p
          className='text-[11px] font-bold tracking-[0.17em] uppercase mb-1'
          style={{ color: C.blue }}
        >
          Admin Console
        </p>
        <h1 className='text-3xl font-extrabold tracking-tight text-foreground'>
          Users
        </h1>
        <p className='text-sm text-muted-foreground mt-1'>
          Platform members · activity · role management
        </p>
      </motion.div>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {isError && (
        <div className='mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-destructive border border-destructive/30 bg-destructive/5'>
          <AlertCircle className='h-4 w-4 shrink-0' />
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
        className='grid grid-cols-2 md:grid-cols-4 gap-3 mb-6'
      >
        <StatCard
          label='Total Users'
          value={stats?.total}
          accent='blue'
          loading={isPending}
        />
        <StatCard
          label='Admins'
          value={adminCount}
          accent='amber'
          loading={isPending}
        />
        <StatCard
          label='Regular Users'
          value={userCount}
          accent='teal'
          loading={isPending}
        />
        <StatCard
          label='Total Solved'
          value={stats?.totalSolved}
          accent='green'
          loading={isPending}
        />
      </motion.div>

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='flex flex-col sm:flex-row gap-3 mb-4'
      >
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none' />
          <input
            placeholder='Search by name, username, or email…'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full h-10 pl-9 pr-4 rounded-xl text-sm outline-none bg-card border border-border text-foreground placeholder:text-muted-foreground focus:border-primary transition-colors'
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className='w-[136px] h-10 rounded-xl bg-card border-border text-sm'>
            <ShieldCheck className='h-3.5 w-3.5 mr-2 text-muted-foreground' />
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
        className='glass-card overflow-hidden'
      >
        <Table>
          <TableHeader>
            <TableRow className='border-border/50 hover:bg-transparent'>
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
                  className={`text-[11px] font-bold tracking-[0.06em] uppercase text-muted-foreground px-4 py-3 ${
                    i === 3
                      ? 'hidden sm:table-cell'
                      : i === 4 || i === 5
                        ? 'hidden md:table-cell'
                        : i === 6
                          ? 'hidden lg:table-cell'
                          : ''
                  }`}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className='border-border/30'>
                  <TableCell className='px-4 py-3'>
                    <div className='flex items-center gap-3'>
                      <div className='h-8 w-8 rounded-xl bg-surface-3 animate-pulse shrink-0' />
                      <div className='space-y-1.5'>
                        <div className='h-2.5 w-28 rounded bg-surface-3 animate-pulse' />
                        <div
                          className='h-2 w-20 rounded bg-surface-3 animate-pulse'
                          style={{ animationDelay: '80ms' }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  {[12, 8, 10, 20, 8, 20].map((w, j) => (
                    <TableCell
                      key={j}
                      className={`px-4 py-3 ${j === 2 ? 'hidden sm:table-cell' : j === 3 || j === 4 ? 'hidden md:table-cell' : j === 5 ? 'hidden lg:table-cell' : ''}`}
                    >
                      <div
                        className={`h-2.5 w-${w} rounded bg-surface-3 animate-pulse`}
                        style={{ animationDelay: `${j * 60}ms` }}
                      />
                    </TableCell>
                  ))}
                  <TableCell />
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
                    className='border-border/30 hover:bg-surface-2/60 transition-colors group'
                  >
                    {/* User */}
                    <TableCell className='px-4 py-3'>
                      <Link
                        to={`/admin/users/${user.id}`}
                        className='flex items-center gap-3 min-w-0'
                      >
                        <Avatar
                          image={user.image}
                          initials={user.initials}
                          size={34}
                        />
                        <div className='min-w-0'>
                          <p className='text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate'>
                            {user.displayName}
                          </p>
                          <p className='text-[11px] text-muted-foreground font-mono truncate'>
                            @{user.username}
                          </p>
                        </div>
                      </Link>
                    </TableCell>

                    {/* Role */}
                    <TableCell className='px-4 py-3'>
                      {user.role === 'ADMIN' ? (
                        <span
                          className='text-[10px] font-bold px-2 py-0.5 rounded-md'
                          style={{
                            background: `color-mix(in oklch, ${C.amber} 12%, transparent)`,
                            color: C.amber,
                            border: `1px solid color-mix(in oklch, ${C.amber} 25%, transparent)`,
                          }}
                        >
                          Admin
                        </span>
                      ) : (
                        <span className='text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface-3 text-muted-foreground border border-border/50'>
                          User
                        </span>
                      )}
                    </TableCell>

                    {/* Solved */}
                    <TableCell className='px-4 py-3 text-center'>
                      <span className='text-sm font-bold text-foreground tabular-nums'>
                        {user.totalSolved}
                      </span>
                    </TableCell>

                    {/* Streak */}
                    <TableCell className='px-4 py-3 text-center hidden sm:table-cell'>
                      <div className='flex items-center justify-center gap-1'>
                        <Flame
                          className='h-3.5 w-3.5'
                          style={{
                            color:
                              user.currentStreak > 0
                                ? C.amber
                                : 'var(--border)',
                          }}
                        />
                        <span
                          className='text-sm tabular-nums'
                          style={{
                            color:
                              user.currentStreak > 0
                                ? 'var(--foreground)'
                                : 'var(--muted-foreground)',
                          }}
                        >
                          {user.currentStreak}d
                        </span>
                      </div>
                    </TableCell>

                    {/* Acceptance */}
                    <TableCell className='px-4 py-3 hidden md:table-cell'>
                      <div className='flex items-center gap-2'>
                        <div className='flex-1 max-w-[56px] h-1 rounded-full overflow-hidden bg-surface-3'>
                          <div
                            className='h-full rounded-full'
                            style={{
                              width: `${user.acceptanceRate}%`,
                              background: `linear-gradient(90deg, ${C.blue} 0%, ${C.teal} 100%)`,
                            }}
                          />
                        </div>
                        <span className='text-xs text-muted-foreground tabular-nums'>
                          {user.acceptanceRate}%
                        </span>
                      </div>
                    </TableCell>

                    {/* Rank */}
                    <TableCell className='px-4 py-3 text-center hidden md:table-cell'>
                      <span className='text-xs font-mono text-muted-foreground'>
                        #{user.rank}
                      </span>
                    </TableCell>

                    {/* Last Active */}
                    <TableCell className='px-4 py-3 hidden lg:table-cell'>
                      <span className='text-xs text-muted-foreground'>
                        {user.lastActive ?? '—'}
                      </span>
                    </TableCell>

                    {/* View */}
                    <TableCell className='px-4 py-3'>
                      <Link
                        to={`/admin/users/${user.id}`}
                        className='inline-flex items-center justify-center h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors'
                      >
                        <Eye className='h-3.5 w-3.5' />
                      </Link>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>

        {!isPending && filteredUsers.length === 0 && (
          <div className='text-center py-12'>
            <Users className='h-9 w-9 text-muted-foreground/20 mx-auto mb-3' />
            <p className='text-sm text-muted-foreground'>
              {searchQuery || roleFilter !== 'all'
                ? 'No users match your filters.'
                : 'No users found.'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Avatar with onError → initials fallback */
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

  const InitialDiv = (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        flexShrink: 0,
        background: `color-mix(in oklch, ${C.blue} 10%, transparent)`,
        border: `1px solid color-mix(in oklch, ${C.blue} 22%, transparent)`,
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

  if (!image) return InitialDiv;

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
          border: `1px solid color-mix(in oklch, ${C.blue} 22%, transparent)`,
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

import type { AccentKey } from './adminTokens';

function StatCard({
  label,
  value,
  accent,
  loading,
}: {
  label: string;
  value: number | undefined;
  accent: AccentKey;
  loading?: boolean;
}) {
  const a = ACCENTS[accent];
  return (
    <div
      className='glass-card p-4 relative overflow-hidden'
      style={{ borderColor: a.ring, boxShadow: `0 0 16px ${a.glow}` }}
    >
      <div
        aria-hidden
        className='absolute top-0 right-0 w-14 h-14 pointer-events-none'
        style={{
          background: `radial-gradient(circle at top right, ${a.glow} 0%, transparent 70%)`,
        }}
      />
      {loading ? (
        <div className='space-y-2'>
          <div className='h-2.5 w-12 rounded bg-surface-3 animate-pulse' />
          <div className='h-6 w-10 rounded bg-surface-3 animate-pulse' />
        </div>
      ) : (
        <>
          <p className='text-[11px] text-muted-foreground font-medium mb-1'>
            {label}
          </p>
          <p
            className='text-2xl font-extrabold tabular-nums'
            style={{ color: a.color }}
          >
            {value?.toLocaleString() ?? '—'}
          </p>
        </>
      )}
    </div>
  );
}
