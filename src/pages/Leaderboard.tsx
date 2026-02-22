import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trophy, Medal, Award, Search, TrendingUp, Flame } from 'lucide-react';

const mockLeaderboard = [
  { rank: 1, name: 'AlgoMaster', solved: 245, streak: 45, score: 4820 },
  { rank: 2, name: 'CodeNinja', solved: 231, streak: 38, score: 4650 },
  { rank: 3, name: 'ByteWizard', solved: 218, streak: 32, score: 4410 },
  { rank: 4, name: 'DevDriller', solved: 205, streak: 28, score: 4200 },
  { rank: 5, name: 'StackSolver', solved: 198, streak: 25, score: 4050 },
  { rank: 6, name: 'DataDragon', solved: 187, streak: 22, score: 3890 },
  { rank: 7, name: 'RecursionKing', solved: 176, streak: 20, score: 3720 },
  { rank: 8, name: 'TreeTraverser', solved: 165, streak: 18, score: 3550 },
  { rank: 9, name: 'GraphGuru', solved: 154, streak: 15, score: 3380 },
  { rank: 10, name: 'HeapHero', solved: 143, streak: 12, score: 3210 },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className='h-5 w-5 text-[hsl(38,92%,50%)]' />;
  if (rank === 2) return <Medal className='h-5 w-5 text-[hsl(210,10%,70%)]' />;
  if (rank === 3) return <Award className='h-5 w-5 text-[hsl(25,80%,55%)]' />;
  return null;
};

const getRankBg = (rank: number) => {
  if (rank === 1)
    return 'bg-[hsl(38,92%,50%)/0.08] border-[hsl(38,92%,50%)/0.2]';
  if (rank === 2)
    return 'bg-[hsl(210,10%,70%)/0.08] border-[hsl(210,10%,70%)/0.15]';
  if (rank === 3)
    return 'bg-[hsl(25,80%,55%)/0.08] border-[hsl(25,80%,55%)/0.15]';
  return 'border-border/30';
};

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockLeaderboard.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <h1 className='text-3xl font-bold mb-2 flex items-center gap-3'>
            <Trophy className='h-8 w-8 text-primary' />
            Leaderboard
          </h1>
          <p className='text-muted-foreground'>Top performers this month</p>
        </motion.div>

        {/* Top 3 podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-3 gap-4 mb-8'
        >
          {[mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]].map(
            (user, i) => {
              const order = [2, 1, 3][i];
              const height =
                order === 1 ? 'h-32' : order === 2 ? 'h-24' : 'h-20';
              return (
                <div key={user.rank} className='flex flex-col items-center'>
                  <Avatar className='h-12 w-12 mb-2 border-2 border-primary/30'>
                    <AvatarFallback className='bg-surface-3 text-foreground font-bold'>
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className='text-sm font-semibold mb-1'>{user.name}</div>
                  <div className='text-xs text-muted-foreground mb-2'>
                    {user.score} pts
                  </div>
                  <div
                    className={`w-full ${height} rounded-t-lg bg-gradient-to-t from-primary/20 to-primary/5 border border-primary/20 border-b-0 flex items-center justify-center`}
                  >
                    <span className='text-2xl font-bold text-primary'>
                      #{user.rank}
                    </span>
                  </div>
                </div>
              );
            },
          )}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='mb-6'
        >
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search users...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 bg-surface-1 border-border/50 h-10'
            />
          </div>
        </motion.div>

        {/* Full list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className='glass-card border-border/50 overflow-hidden'>
            <div className='hidden sm:grid grid-cols-[60px_1fr_100px_80px_100px] gap-4 px-6 py-3 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider'>
              <div>Rank</div>
              <div>User</div>
              <div>Solved</div>
              <div>Streak</div>
              <div className='text-right'>Score</div>
            </div>
            <div className='divide-y divide-border/30'>
              {filtered.map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`grid grid-cols-1 sm:grid-cols-[60px_1fr_100px_80px_100px] gap-2 sm:gap-4 items-center px-6 py-4 hover:bg-surface-2/30 transition-colors border ${getRankBg(user.rank)}`}
                >
                  <div className='flex items-center gap-2'>
                    {getRankIcon(user.rank) || (
                      <span className='text-sm font-mono text-muted-foreground w-5 text-center'>
                        {user.rank}
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-8 w-8'>
                      <AvatarFallback className='bg-surface-3 text-xs font-bold'>
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className='font-medium text-sm'>{user.name}</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <TrendingUp className='h-3.5 w-3.5 text-primary' />
                    <span className='text-sm'>{user.solved}</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Flame className='h-3.5 w-3.5 text-[hsl(var(--amber))]' />
                    <span className='text-sm'>{user.streak}d</span>
                  </div>
                  <div className='text-right'>
                    <Badge
                      variant='outline'
                      className='text-xs font-mono border-primary/20 text-primary'
                    >
                      {user.score}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
