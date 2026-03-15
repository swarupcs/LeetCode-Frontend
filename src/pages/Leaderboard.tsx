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
  Star,
  Users,
  Crown,
} from 'lucide-react';
import type { LeaderboardEntry } from '@/types/leaderboard.types';
import { useGetLeaderboard } from '@/hooks/leaderboard/useGetLeaderboard';

// ─── Skeleton primitive ───────────────────────────────────────────────────────

function Bone({
  w,
  h = 'h-3',
  rounded = 'rounded-md',
  delay = 0,
  className = '',
}: {
  w: string;
  h?: string;
  rounded?: string;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`${w} ${h} ${rounded} bg-surface-3 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

// ─── Skeleton sections ────────────────────────────────────────────────────────

/** Three stat cards — matches the real StatCard grid */
function SkeletonStatCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className='grid grid-cols-3 gap-3 mb-8'
    >
      {[0, 80, 160].map((delay) => (
        <Card
          key={delay}
          className='glass-card border-border/50 p-4 flex items-center gap-4'
        >
          <div className='p-2.5 rounded-xl bg-surface-2 shrink-0'>
            <Bone w='w-5' h='h-5' rounded='rounded' delay={delay} />
          </div>
          <div className='space-y-1.5'>
            <Bone w='w-12' h='h-5' rounded='rounded' delay={delay + 30} />
            <Bone w='w-20' h='h-2.5' delay={delay + 50} />
          </div>
        </Card>
      ))}
    </motion.div>
  );
}

/** Podium — 3 cards in 2-1-3 order, heights matching real bars */
function SkeletonPodium() {
  // [rank, barHeight, avatarSize, showCrown]
  const slots: [number, string, string, boolean][] = [
    [2, 'h-20', 'h-11 w-11', false],
    [1, 'h-28', 'h-14 w-14', true],
    [3, 'h-16', 'h-11 w-11', false],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className='grid grid-cols-3 gap-3 mb-10 items-end'
    >
      {slots.map(([rank, barH, avatarSz, crown], i) => (
        <motion.div
          key={rank}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 + i * 0.06 }}
          className='flex flex-col items-center gap-2'
        >
          {/* Crown placeholder */}
          {crown && (
            <div
              className='h-6 w-6 rounded bg-surface-3 animate-pulse mb-1'
              style={{ animationDelay: '200ms' }}
            />
          )}

          {/* Avatar circle */}
          <div
            className={`${avatarSz} rounded-full bg-surface-3 animate-pulse ring-2 ring-surface-4 ring-offset-2 ring-offset-background`}
            style={{ animationDelay: `${100 + i * 40}ms` }}
          />

          {/* Name + score */}
          <div className='flex flex-col items-center gap-1.5'>
            <Bone w='w-16' h='h-3.5' rounded='rounded' delay={140 + i * 30} />
            <Bone w='w-12' h='h-3' rounded='rounded' delay={170 + i * 30} />
          </div>

          {/* Podium bar */}
          <div
            className={`w-full ${barH} rounded-t-xl bg-surface-3 animate-pulse flex flex-col items-center justify-center gap-1`}
            style={{ animationDelay: `${200 + i * 50}ms` }}
          >
            <Bone w='w-6' h='h-6' rounded='rounded' delay={220 + i * 50} />
            <Bone w='w-12' h='h-2.5' delay={240 + i * 50} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/** Search bar placeholder */
function SkeletonSearch() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className='mb-4'
    >
      <Bone w='w-full' h='h-10' rounded='rounded-xl' delay={200} />
    </motion.div>
  );
}

/** One leaderboard table row skeleton */
function SkeletonRow({ index }: { index: number }) {
  const base = index * 55;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.28 + index * 0.04 }}
      className='grid grid-cols-1 sm:grid-cols-[56px_1fr_100px_90px_90px_100px] gap-2 sm:gap-4 items-center px-6 py-3.5 border-b border-border/30 last:border-0 border-l-2 border-l-transparent'
    >
      {/* Rank */}
      <div className='flex items-center'>
        <Bone w='w-5' h='h-5' rounded='rounded' delay={base} />
      </div>

      {/* User */}
      <div className='flex items-center gap-3'>
        <div
          className='h-8 w-8 rounded-full bg-surface-3 animate-pulse shrink-0'
          style={{ animationDelay: `${base + 20}ms` }}
        />
        <div className='space-y-1.5 min-w-0'>
          <Bone
            w={['w-24', 'w-32', 'w-20', 'w-28', 'w-24'][index % 5]!}
            h='h-3.5'
            delay={base + 30}
          />
          {index % 3 !== 0 && <Bone w='w-16' h='h-2.5' delay={base + 50} />}
        </div>
      </div>

      {/* Solved */}
      <div className='flex items-center justify-center gap-1.5'>
        <Bone w='w-3.5' h='h-3.5' rounded='rounded' delay={base + 20} />
        <Bone w='w-8' h='h-3.5' rounded='rounded' delay={base + 35} />
      </div>

      {/* Streak */}
      <div className='flex items-center justify-center gap-1.5'>
        <Bone w='w-3.5' h='h-3.5' rounded='rounded' delay={base + 25} />
        <Bone w='w-8' h='h-3.5' rounded='rounded' delay={base + 40} />
      </div>

      {/* Score badge */}
      <div className='flex justify-end'>
        <Bone w='w-16' h='h-5' rounded='rounded-full' delay={base + 30} />
      </div>

      {/* Empty last col */}
      <div />
    </motion.div>
  );
}

/** Full page skeleton */
function LeaderboardSkeleton() {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8 space-y-2'
        >
          <div className='flex items-center gap-3'>
            <Bone w='w-8' h='h-8' rounded='rounded-lg' />
            <Bone w='w-40' h='h-8' rounded='rounded-lg' delay={40} />
          </div>
          <Bone w='w-52' h='h-4' delay={80} />
        </motion.div>

        <SkeletonStatCards />
        <SkeletonPodium />
        <SkeletonSearch />

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.26 }}
        >
          <Card className='glass-card border-border/50 overflow-hidden'>
            {/* Column headers */}
            <div className='hidden sm:grid grid-cols-[56px_1fr_100px_90px_90px_100px] gap-4 px-6 py-3 border-b border-border/50'>
              {[14, 10, 16, 14, 12, 0].map((w, i) =>
                w > 0 ? (
                  <Bone key={i} w={`w-${w}`} h='h-2.5' delay={260 + i * 20} />
                ) : (
                  <div key={i} />
                ),
              )}
            </div>

            {/* Rows */}
            <div>
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonRow key={i} index={i} />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Score formula note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className='flex justify-center mt-6'
        >
          <Bone w='w-72' h='h-3' delay={600} />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Rank helpers ─────────────────────────────────────────────────────────────

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

const getInitials = (entry: LeaderboardEntry) => {
  const name = entry.name || entry.username || '?';
  return name.slice(0, 2).toUpperCase();
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

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
          u.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [leaderboard, searchQuery],
  );

  const top3 = leaderboard.slice(0, 3);
  const totalUsers = leaderboard.length;
  const topScore = leaderboard[0]?.score ?? 0;
  const topStreak =
    leaderboard.length > 0 ? Math.max(...leaderboard.map((u) => u.streak)) : 0;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) return <LeaderboardSkeleton />;

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-2'>
          <Trophy className='h-10 w-10 text-destructive/30 mx-auto' />
          <p className='text-muted-foreground text-sm'>
            Failed to load leaderboard. Please try again.
          </p>
        </div>
      </div>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────
  if (leaderboard.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center space-y-3'>
          <Trophy className='h-12 w-12 mx-auto opacity-20' />
          <p className='text-sm text-muted-foreground'>
            No data yet. Be the first to solve a problem!
          </p>
        </div>
      </div>
    );
  }

  // ── Loaded ────────────────────────────────────────────────────────────────
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

        {/* Stats */}
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

        {/* Podium */}
        {!searchQuery && top3.length === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='grid grid-cols-3 gap-3 mb-10 items-end'
          >
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
                      className={`grid grid-cols-1 sm:grid-cols-[56px_1fr_100px_90px_90px_100px] gap-2 sm:gap-4 items-center px-6 py-3.5 hover:bg-surface-2/40 transition-colors ${getRankRowClass(user.rank)}`}
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

                      {/* Mobile rank */}
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
      </div>
    </div>
  );
}
