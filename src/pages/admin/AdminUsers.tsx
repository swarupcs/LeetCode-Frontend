// src/pages/admin/AdminUsersPage.tsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

// ─── Badge config ─────────────────────────────────────────────────────────────

const roleConfig: Record<string, { label: string; className: string }> = {
  ADMIN: {
    label: 'Admin',
    className:
      'bg-[hsl(var(--amber)/0.1)] text-[hsl(var(--amber))] border-[hsl(var(--amber)/0.2)]',
  },
  USER: {
    label: 'User',
    className: 'bg-surface-3/60 text-muted-foreground border-border/50',
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { users, stats, isPending, isError, error } = useAdminUsers();

  // ── Client-side filtering (search + role) ─────────────────────────────────
  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        u.displayName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className='p-6 lg:p-8 max-w-7xl'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='mb-8'
      >
        <h1 className='text-2xl font-bold'>Users</h1>
        <p className='text-sm text-muted-foreground mt-1'>
          View platform users and their progress
        </p>
      </motion.div>

      {/* Error banner */}
      {isError && (
        <div className='mb-6 flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive'>
          <AlertCircle className='h-4 w-4 shrink-0' />
          <span>
            {(error as { message?: string })?.message ??
              'Failed to load users. Please try again.'}
          </span>
        </div>
      )}

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'
      >
        <StatCard
          label='Total Users'
          value={stats?.total}
          className='text-foreground'
          loading={isPending}
        />
        <StatCard
          label='Admins'
          value={
            isPending
              ? undefined
              : users.filter((u) => u.role === 'ADMIN').length
          }
          className='text-[hsl(var(--amber))]'
          loading={isPending}
        />
        <StatCard
          label='Regular Users'
          value={
            isPending
              ? undefined
              : users.filter((u) => u.role === 'USER').length
          }
          className='text-primary'
          loading={isPending}
        />
        <StatCard
          label='Total Solved'
          value={stats?.totalSolved}
          className='text-[hsl(var(--emerald))]'
          loading={isPending}
        />
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className='flex flex-col sm:flex-row gap-3 mb-6'
      >
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search by name, username, or email...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 bg-surface-1 border-border/50 h-10'
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className='w-[130px] bg-surface-1 border-border/50 h-10'>
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

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='glass-card overflow-hidden'
      >
        <Table>
          <TableHeader>
            <TableRow className='border-border/50 hover:bg-transparent'>
              <TableHead className='text-muted-foreground text-xs font-semibold'>
                User
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[80px]'>
                Role
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[80px] text-center'>
                Solved
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[80px] text-center hidden sm:table-cell'>
                Streak
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[100px] hidden md:table-cell'>
                Acceptance
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[80px] text-center hidden md:table-cell'>
                Rank
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[100px] hidden lg:table-cell'>
                Last Active
              </TableHead>
              <TableHead className='text-muted-foreground text-xs font-semibold w-[50px]' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              // ── Skeleton rows ───────────────────────────────────────────────
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i} className='border-border/30'>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <div className='h-8 w-8 rounded-lg bg-surface-3 animate-pulse shrink-0' />
                      <div className='space-y-1.5'>
                        <div className='h-3 w-28 bg-surface-3 rounded animate-pulse' />
                        <div className='h-2.5 w-20 bg-surface-3 rounded animate-pulse' />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='h-5 w-12 bg-surface-3 rounded animate-pulse' />
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className='h-4 w-8 bg-surface-3 rounded animate-pulse mx-auto' />
                  </TableCell>
                  <TableCell className='text-center hidden sm:table-cell'>
                    <div className='h-4 w-10 bg-surface-3 rounded animate-pulse mx-auto' />
                  </TableCell>
                  <TableCell className='hidden md:table-cell'>
                    <div className='h-3 w-20 bg-surface-3 rounded animate-pulse' />
                  </TableCell>
                  <TableCell className='text-center hidden md:table-cell'>
                    <div className='h-4 w-8 bg-surface-3 rounded animate-pulse mx-auto' />
                  </TableCell>
                  <TableCell className='hidden lg:table-cell'>
                    <div className='h-3 w-20 bg-surface-3 rounded animate-pulse' />
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))
            ) : (
              <AnimatePresence>
                {filteredUsers.map((user) => {
                  const roleCfg = roleConfig[user.role] ?? roleConfig['USER']!;
                  return (
                    <motion.tr
                      key={user.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='border-border/30 hover:bg-surface-2/50 transition-colors group'
                    >
                      {/* User */}
                      <TableCell>
                        <Link
                          to={`/admin/users/${user.id}`}
                          className='flex items-center gap-3 min-w-0'
                        >
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.displayName}
                              className='h-8 w-8 rounded-lg object-cover shrink-0'
                            />
                          ) : (
                            <div className='h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center shrink-0'>
                              <span className='text-xs font-bold text-primary'>
                                {user.initials}
                              </span>
                            </div>
                          )}
                          <div className='min-w-0'>
                            <div className='text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate'>
                              {user.displayName}
                            </div>
                            <div className='text-[11px] text-muted-foreground font-mono truncate'>
                              @{user.username}
                            </div>
                          </div>
                        </Link>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        <Badge
                          variant='outline'
                          className={`text-[10px] font-medium border ${roleCfg.className}`}
                        >
                          {roleCfg.label}
                        </Badge>
                      </TableCell>

                      {/* Solved */}
                      <TableCell className='text-center'>
                        <span className='text-sm font-semibold text-foreground tabular-nums'>
                          {user.totalSolved}
                        </span>
                      </TableCell>

                      {/* Streak */}
                      <TableCell className='text-center hidden sm:table-cell'>
                        <div className='flex items-center justify-center gap-1'>
                          <Flame
                            className={`h-3.5 w-3.5 ${
                              user.currentStreak > 0
                                ? 'text-[hsl(var(--amber))]'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                          <span className='text-sm tabular-nums'>
                            {user.currentStreak}d
                          </span>
                        </div>
                      </TableCell>

                      {/* Acceptance */}
                      <TableCell className='hidden md:table-cell'>
                        <div className='flex items-center gap-2'>
                          <div className='flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden max-w-[60px]'>
                            <div
                              className='h-full rounded-full bg-primary'
                              style={{ width: `${user.acceptanceRate}%` }}
                            />
                          </div>
                          <span className='text-xs text-muted-foreground tabular-nums'>
                            {user.acceptanceRate}%
                          </span>
                        </div>
                      </TableCell>

                      {/* Rank */}
                      <TableCell className='text-center hidden md:table-cell'>
                        <span className='text-sm font-mono text-muted-foreground'>
                          #{user.rank}
                        </span>
                      </TableCell>

                      {/* Last Active */}
                      <TableCell className='hidden lg:table-cell'>
                        <span className='text-xs text-muted-foreground'>
                          {user.lastActive ?? '—'}
                        </span>
                      </TableCell>

                      {/* View */}
                      <TableCell>
                        <Link
                          to={`/admin/users/${user.id}`}
                          className='inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors'
                        >
                          <Eye className='h-4 w-4' />
                        </Link>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>

        {!isPending && filteredUsers.length === 0 && (
          <div className='text-center py-12'>
            <Users className='h-10 w-10 text-muted-foreground/30 mx-auto mb-3' />
            <p className='text-muted-foreground text-sm'>
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

function StatCard({
  label,
  value,
  className,
  loading,
}: {
  label: string;
  value: number | undefined;
  className?: string;
  loading?: boolean;
}) {
  return (
    <div className='glass-card p-4 text-center'>
      {loading ? (
        <div className='h-8 w-12 bg-surface-3 rounded animate-pulse mx-auto mb-1' />
      ) : (
        <div className={`text-2xl font-bold ${className ?? 'text-foreground'}`}>
          {value ?? '—'}
        </div>
      )}
      <div className='text-xs text-muted-foreground mt-1'>{label}</div>
    </div>
  );
}
