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
  Filter,
  Flame,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { platformUsers } from '@/data/users';

const statusConfig = {
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

const roleConfig = {
  admin: {
    label: 'Admin',
    className:
      'bg-[hsl(var(--amber)/0.1)] text-[hsl(var(--amber))] border-[hsl(var(--amber)/0.2)]',
  },
  user: {
    label: 'User',
    className: 'bg-surface-3/60 text-muted-foreground border-border/50',
  },
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    return platformUsers.filter((u) => {
      const matchesSearch =
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [searchQuery, statusFilter, roleFilter]);

  const stats = useMemo(() => {
    const active = platformUsers.filter((u) => u.status === 'active').length;
    const inactive = platformUsers.filter(
      (u) => u.status === 'inactive',
    ).length;
    const banned = platformUsers.filter((u) => u.status === 'banned').length;
    const totalSolved = platformUsers.reduce((s, u) => s + u.totalSolved, 0);
    return {
      total: platformUsers.length,
      active,
      inactive,
      banned,
      totalSolved,
    };
  }, []);

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

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='grid grid-cols-2 md:grid-cols-5 gap-4 mb-8'
      >
        <div className='glass-card p-4 text-center'>
          <div className='text-2xl font-bold text-foreground'>
            {stats.total}
          </div>
          <div className='text-xs text-muted-foreground mt-1'>Total Users</div>
        </div>
        <div className='glass-card p-4 text-center'>
          <div className='text-2xl font-bold text-primary'>{stats.active}</div>
          <div className='text-xs text-muted-foreground mt-1'>Active</div>
        </div>
        <div className='glass-card p-4 text-center'>
          <div className='text-2xl font-bold text-muted-foreground'>
            {stats.inactive}
          </div>
          <div className='text-xs text-muted-foreground mt-1'>Inactive</div>
        </div>
        <div className='glass-card p-4 text-center'>
          <div className='text-2xl font-bold text-destructive'>
            {stats.banned}
          </div>
          <div className='text-xs text-muted-foreground mt-1'>Banned</div>
        </div>
        <div className='glass-card p-4 text-center'>
          <div className='text-2xl font-bold text-[hsl(var(--emerald))]'>
            {stats.totalSolved}
          </div>
          <div className='text-xs text-muted-foreground mt-1'>Total Solved</div>
        </div>
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
        <div className='flex gap-3'>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-[130px] bg-surface-1 border-border/50 h-10'>
              <Filter className='h-3.5 w-3.5 mr-2 text-muted-foreground' />
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='active'>Active</SelectItem>
              <SelectItem value='inactive'>Inactive</SelectItem>
              <SelectItem value='banned'>Banned</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className='w-[120px] bg-surface-1 border-border/50 h-10'>
              <ShieldCheck className='h-3.5 w-3.5 mr-2 text-muted-foreground' />
              <SelectValue placeholder='Role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Roles</SelectItem>
              <SelectItem value='admin'>Admin</SelectItem>
              <SelectItem value='user'>User</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
              <TableHead className='text-muted-foreground text-xs font-semibold w-[90px]'>
                Status
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
            <AnimatePresence>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='border-border/30 hover:bg-surface-2/50 transition-colors group'
                >
                  <TableCell>
                    <Link
                      to={`/admin/users/${user.id}`}
                      className='flex items-center gap-3 min-w-0'
                    >
                      <div className='h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center shrink-0'>
                        <span className='text-xs font-bold text-primary'>
                          {user.initials}
                        </span>
                      </div>
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
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={`text-[10px] font-medium border ${roleConfig[user.role].className}`}
                    >
                      {roleConfig[user.role].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={`text-[10px] font-medium border ${statusConfig[user.status].className}`}
                    >
                      {statusConfig[user.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center'>
                    <span className='text-sm font-semibold text-foreground tabular-nums'>
                      {user.totalSolved}
                    </span>
                  </TableCell>
                  <TableCell className='text-center hidden sm:table-cell'>
                    <div className='flex items-center justify-center gap-1'>
                      <Flame
                        className={`h-3.5 w-3.5 ${user.currentStreak > 0 ? 'text-[hsl(var(--amber))]' : 'text-muted-foreground/30'}`}
                      />
                      <span className='text-sm tabular-nums'>
                        {user.currentStreak}d
                      </span>
                    </div>
                  </TableCell>
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
                  <TableCell className='text-center hidden md:table-cell'>
                    <span className='text-sm font-mono text-muted-foreground'>
                      #{user.rank}
                    </span>
                  </TableCell>
                  <TableCell className='hidden lg:table-cell'>
                    <span className='text-xs text-muted-foreground'>
                      {user.lastActive}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/admin/users/${user.id}`}
                      className='inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors'
                    >
                      <Eye className='h-4 w-4' />
                    </Link>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>

        {filteredUsers.length === 0 && (
          <div className='text-center py-12'>
            <Users className='h-10 w-10 text-muted-foreground/30 mx-auto mb-3' />
            <p className='text-muted-foreground text-sm'>
              No users match your filters.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
