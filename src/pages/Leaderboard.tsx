// src/pages/LeaderboardPage.tsx
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Trophy,
  Medal,
  Award,
  Search,
  TrendingUp,
  Flame,
  Loader2,
  Star,
  Users,
  Crown,
} from 'lucide-react';
import type { LeaderboardEntry } from '@/types/leaderboard.types';
import { useGetLeaderboard } from '@/hooks/leaderboard/useGetLeaderboard';

// ── rank helpers ──────────────────────────────────────────────────────────────

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className='h-5 w-5 text-[hsl(38,92%,50%)]' />;
  if (rank === 2) return <Medal className='h-5 w-5 text-[hsl(210,10%,70%)]' />;
  if (rank === 3) return <Award className='h-5 w-5 text-[hsl(25,80%,55%)]' />;
  return null;
};

const getRankRowClass = (rank: number) => {
  if (rank === 1)
    return 'border-l-2 border-l-[hsl(38,92%,50%)] bg-[hsl(38,92%,50%/0.04)]';
  if (rank === 2)
    return 'border-l-2 border-l-[hsl(210,10%,70%)] bg-[hsl(210,10%,70%/0.03)]';
  if (rank === 3)
    return 'border-l-2 border-l-[hsl(25,80%,55%)] bg-[hsl(25,80%,55%/0.03)]';
  return 'border-l-2 border-l-transparent';
};

const getPodiumColor = (rank: number) => {
  if (rank === 1)
    return {
      ring: 'ring-[hsl(38,92%,50%)]',
      bar: 'from-[hsl(38,92%,50%/0.25)] to-[hsl(38,92%,50%/0.05)]',
      text: 'text-[hsl(38,92%,50%)]',
      border: 'border-[hsl(38,92%,50%/0.3)]',
    };
  if (rank === 2)
    return {
      ring: 'ring-[hsl(210,10%,70%)]',
      bar: 'from-[hsl(210,10%,70%/0.2)] to-[hsl(210,10%,70%/0.03)]',
      text: 'text-[hsl(210,10%,70%)]',
      border: 'border-[hsl(210,10%,70%/0.25)]',
    };
  return {
    ring: 'ring-[hsl(25,80%,55%)]',
    bar: 'from-[hsl(25,80%,55%/0.2)] to-[hsl(25,80%,55%/0.03)]',
    text: 'text-[hsl(25,80%,55%)]',
    border: 'border-[hsl(25,80%,55%/0.25)]',
  };
};

// Backend guarantees these are non-null ('Unknown' fallback), but keep a local guard
const getInitials = (entry: LeaderboardEntry) => {
  const name = entry.name || entry.username || '?';
  return name.slice(0, 2).toUpperCase();
};

// ── stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card className='glass-card border-border/50 p-4 flex items-center gap-4'>
      <div className={`p-2.5 rounded-xl bg-surface-2 ${color}`}>
        <Icon className='h-5 w-5' />
      </div>
      <div>
        <div className='text-xl font-bold tabular-nums'>{value}</div>
        <div className='text-xs text-muted-foreground'>{label}</div>
      </div>
    </Card>
  );
}

// ── podium card ───────────────────────────────────────────────────────────────

function PodiumCard({
  entry,
  podiumRank,
}: {
  entry: LeaderboardEntry;
  podiumRank: 1 | 2 | 3;
}) {
  const colors = getPodiumColor(podiumRank);
  const barHeight =
    podiumRank === 1 ? 'h-28' : podiumRank === 2 ? 'h-20' : 'h-16';
  const avatarSize = podiumRank === 1 ? 'h-14 w-14' : 'h-11 w-11';

  return (
    <div className='flex flex-col items-center gap-2'>
      {podiumRank === 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <Crown className='h-6 w-6 text-[hsl(38,92%,50%)] mb-1' />
        </motion.div>
      )}
      <Avatar
        className={`${avatarSize} ring-2 ${colors.ring} ring-offset-2 ring-offset-background`}
      >
        <AvatarImage src={entry.image ?? undefined} />
        <AvatarFallback className='bg-surface-3 font-bold text-sm'>
          {getInitials(entry)}
        </AvatarFallback>
      </Avatar>
      <div className='text-center'>
        <div className='text-sm font-semibold leading-tight'>
          {entry.username}
        </div>
        <div className={`text-xs font-mono font-bold ${colors.text}`}>
          {entry.score.toLocaleString()} pts
        </div>
      </div>
      <div
        className={`w-full ${barHeight} rounded-t-xl bg-gradient-to-t ${colors.bar} border ${colors.border} border-b-0 flex flex-col items-center justify-center gap-1`}
      >
        <span className={`text-2xl font-black ${colors.text}`}>
          #{podiumRank}
        </span>
        <span className='text-[10px] text-muted-foreground'>
          {entry.solved} solved
        </span>
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { leaderboard, isPending: isLoading, isError } = useGetLeaderboard();

  const filtered = useMemo(
    () =>
      leaderboard.filter(
        (u) =>
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [leaderboard, searchQuery]
  );

  const top3 = leaderboard.slice(0, 3);

  const totalUsers = leaderboard.length;
  const topScore = leaderboard[0]?.score ?? 0;
  const topStreak =
    leaderboard.length > 0 ? Math.max(...leaderboard.map((u) => u.streak)) : 0;

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <h1 className='text-3xl font-bold mb-2 flex items-center gap-3'>
            <Trophy className='h-8 w-8 text-primary' />
            Leaderboard
          </h1>
          <p className='text-muted-foreground'>
            Top performers ranked by score
          </p>
        </motion.div>

        {/* Summary stats */}
        {!isLoading && leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className='grid grid-cols-3 gap-3 mb-8'
          >
            <StatCard
              icon={Users}
              label='Total Players'
              value={totalUsers}
              color='text-primary'
            />
            <StatCard
              icon={Star}
              label='Top Score'
              value={topScore.toLocaleString()}
              color='text-[hsl(var(--amber))]'
            />
            <StatCard
              icon={Flame}
              label='Longest Streak'
              value={`${topStreak}d`}
              color='text-[hsl(var(--rose))]'
            />
          </motion.div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className='flex items-center justify-center py-32'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className='text-center py-16 text-muted-foreground'>
            Failed to load leaderboard. Please try again.
          </div>
        )}

        {!isLoading && !isError && leaderboard.length > 0 && (
          <>
            {/* Podium */}
            {!searchQuery && top3.length === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className='grid grid-cols-3 gap-3 mb-10 items-end'
              >
                {/* Display order: 2nd – 1st – 3rd */}
                <PodiumCard entry={top3[1]!} podiumRank={2} />
                <PodiumCard entry={top3[0]!} podiumRank={1} />
                <PodiumCard entry={top3[2]!} podiumRank={3} />
              </motion.div>
            )}

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='mb-4'
            >
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search by username or name...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10 bg-surface-1 border-border/50 h-10'
                />
              </div>
            </motion.div>

            {/* Table */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <Card className='glass-card border-border/50 overflow-hidden'>
                <div className='hidden sm:grid grid-cols-[56px_1fr_100px_90px_90px_100px] gap-4 px-6 py-3 border-b border-border/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider'>
                  <div>Rank</div>
                  <div>User</div>
                  <div className='text-center'>Solved</div>
                  <div className='text-center'>Streak</div>
                  <div className='text-right'>Score</div>
                  <div />
                </div>

                <motion.div
                  variants={stagger}
                  initial='hidden'
                  animate='show'
                  className='divide-y divide-border/30'
                >
                  <AnimatePresence mode='popLayout'>
                    {filtered.length === 0 ? (
                      <div className='text-center py-12 text-muted-foreground text-sm'>
                        No users found for "{searchQuery}".
                      </div>
                    ) : (
                      filtered.map((user) => (
                        <motion.div
                          key={user.username}
                          variants={fadeUp}
                          layout
                          className={`
                            grid grid-cols-1 sm:grid-cols-[56px_1fr_100px_90px_90px_100px]
                            gap-2 sm:gap-4 items-center px-6 py-3.5
                            hover:bg-surface-2/40 transition-colors
                            ${getRankRowClass(user.rank)}
                          `}
                        >
                          {/* Rank */}
                          <div className='flex items-center gap-2'>
                            {getRankIcon(user.rank) ?? (
                              <span className='text-sm font-mono text-muted-foreground w-5 text-center'>
                                {user.rank}
                              </span>
                            )}
                          </div>

                          {/* User */}
                          <div className='flex items-center gap-3'>
                            <Avatar className='h-8 w-8 shrink-0'>
                              <AvatarImage src={user.image ?? undefined} />
                              <AvatarFallback className='bg-surface-3 text-xs font-bold'>
                                {getInitials(user)}
                              </AvatarFallback>
                            </Avatar>
                            <div className='min-w-0'>
                              <div className='text-sm font-medium truncate'>
                                {user.username}
                              </div>
                              {user.name !== user.username && (
                                <div className='text-[11px] text-muted-foreground truncate'>
                                  {user.name}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Solved */}
                          <div className='flex items-center justify-center gap-1.5'>
                            <TrendingUp className='h-3.5 w-3.5 text-primary shrink-0' />
                            <span className='text-sm tabular-nums'>
                              {user.solved}
                            </span>
                          </div>

                          {/* Streak */}
                          <div className='flex items-center justify-center gap-1.5'>
                            <Flame
                              className={`h-3.5 w-3.5 shrink-0 ${user.streak > 0 ? 'text-[hsl(var(--amber))]' : 'text-muted-foreground/40'}`}
                            />
                            <span className='text-sm tabular-nums'>
                              {user.streak}d
                            </span>
                          </div>

                          {/* Score */}
                          <div className='flex justify-end'>
                            <Badge
                              variant='outline'
                              className='text-xs font-mono border-primary/20 text-primary tabular-nums'
                            >
                              {user.score.toLocaleString()}
                            </Badge>
                          </div>

                          {/* Rank badge (mobile) */}
                          <div className='sm:hidden flex items-center gap-1 text-xs text-muted-foreground'>
                            <span>Rank #{user.rank}</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </motion.div>
              </Card>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className='text-center text-[11px] text-muted-foreground/50 mt-6'
            >
              Score = (problems solved × 50) + (streak days × 10)
            </motion.p>
          </>
        )}

        {/* Empty state */}
        {!isLoading && !isError && leaderboard.length === 0 && (
          <div className='text-center py-24 text-muted-foreground'>
            <Trophy className='h-12 w-12 mx-auto mb-4 opacity-20' />
            <p className='text-sm'>
              No data yet. Be the first to solve a problem!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
