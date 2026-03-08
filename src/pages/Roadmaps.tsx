import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Binary,
  Monitor,
  Server,
  Network,
  GraduationCap,
  ArrowRight,
  Map,
  Trophy,
  Flame,
  Target,
  Minus,
  Plus,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRoadmapStats } from '@/data/roadmaps';
import { useLearningStreak } from '@/hooks/use-learning-streak';
import { TopicSearch } from '@/components/roadmaps/TopicSearch';
import { StudyPlanner } from '@/components/roadmaps/StudyPlanner';
import { useGetRoadmaps } from '@/hooks/roadmaps/useGetRoadmaps';
import { useAppSelector } from '@/hooks/redux';

const STORAGE_KEY = 'roadmap-progress';

function getLocalProgress(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const iconMap: Record<string, React.ElementType> = {
  Binary,
  Monitor,
  Server,
  Network,
  GraduationCap,
};

const colorMap: Record<string, string> = {
  emerald: 'hsl(var(--emerald))',
  cyan: 'hsl(var(--cyan))',
  amber: 'hsl(var(--amber))',
  rose: 'hsl(var(--rose))',
};

const colorBgMap: Record<string, string> = {
  emerald: 'bg-[hsl(var(--emerald)/0.1)] border-[hsl(var(--emerald)/0.2)]',
  cyan: 'bg-[hsl(var(--cyan)/0.1)] border-[hsl(var(--cyan)/0.2)]',
  amber: 'bg-[hsl(var(--amber)/0.1)] border-[hsl(var(--amber)/0.2)]',
  rose: 'bg-[hsl(var(--rose)/0.1)] border-[hsl(var(--rose)/0.2)]',
};

const colorTextMap: Record<string, string> = {
  emerald: 'text-[hsl(var(--emerald))]',
  cyan: 'text-[hsl(var(--cyan))]',
  amber: 'text-[hsl(var(--amber))]',
  rose: 'text-[hsl(var(--rose))]',
};

export default function RoadmapsPage() {
  const currentUserId = useAppSelector((state) => state.auth.id);
  const { roadmaps: published, isLoading, isError } = useGetRoadmaps();
  const {
    currentStreak,
    longestStreak,
    todayCompleted,
    dailyGoal,
    setDailyGoal,
    goalProgress,
    goalReached,
    weekActivity,
  } = useLearningStreak();

  // Progress: logged-in users → from API (completedTopicIds on each roadmap)
  //           anonymous       → from localStorage
  const localProgress = useMemo(() => (currentUserId ? {} : getLocalProgress()), [currentUserId]);

  const totalTopics = useMemo(
    () => published.reduce((a, r) => a + getRoadmapStats(r).totalTopics, 0),
    [published],
  );

  const totalCompleted = useMemo(
    () =>
      published.reduce((a, r) => {
        const completedIds = currentUserId
          ? (r.completedTopicIds ?? [])
          : (localProgress[r.id] ?? []);
        const allTopicIds = r.sections.flatMap((s) => s.topics.map((t) => t.id));
        return a + completedIds.filter((id) => allTopicIds.includes(id)).length;
      }, 0),
    [published, currentUserId, localProgress],
  );

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-10 w-10 animate-spin text-primary' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Map className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <p className='text-muted-foreground'>Failed to load roadmaps. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <h1 className='text-3xl font-bold mb-2 flex items-center gap-3'>
            <Map className='h-8 w-8 text-primary' />
            Learning Roadmaps
          </h1>
          <p className='text-muted-foreground'>
            Structured learning paths to master key engineering domains —{' '}
            {totalCompleted} of {totalTopics} topics completed
          </p>
          <div className='mt-4 max-w-xl'>
            <TopicSearch />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'
        >
          <div className='glass-card p-4 text-center'>
            <div className='text-2xl font-bold text-foreground'>{published.length}</div>
            <div className='text-xs text-muted-foreground mt-1'>Roadmaps</div>
          </div>
          <div className='glass-card p-4 text-center'>
            <div className='text-2xl font-bold text-primary'>{totalTopics}</div>
            <div className='text-xs text-muted-foreground mt-1'>Total Topics</div>
          </div>
          <div className='glass-card p-4 text-center col-span-2 md:col-span-1'>
            <div className='text-2xl font-bold text-[hsl(var(--emerald))]'>
              {totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0}%
            </div>
            <div className='text-xs text-muted-foreground mt-1'>Completion</div>
          </div>
        </motion.div>

        {/* Streak & Daily Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'
        >
          {/* Streak Card */}
          <div className='glass-card p-5'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 rounded-lg bg-[hsl(var(--amber)/0.1)] border border-[hsl(var(--amber)/0.2)]'>
                <Flame className='h-5 w-5 text-[hsl(var(--amber))]' />
              </div>
              <div>
                <h3 className='text-sm font-semibold text-foreground'>Learning Streak</h3>
                <p className='text-xs text-muted-foreground'>Keep the momentum going!</p>
              </div>
              <div className='ml-auto text-right'>
                <div className='text-2xl font-bold text-[hsl(var(--amber))]'>
                  {currentStreak > 0 && (
                    <span className='mr-1'>
                      {currentStreak >= 30
                        ? '👑'
                        : currentStreak >= 14
                          ? '⚡'
                          : currentStreak >= 7
                            ? '🔥'
                            : currentStreak >= 3
                              ? '✨'
                              : '🌱'}
                    </span>
                  )}
                  {currentStreak}
                </div>
                <div className='text-[10px] text-muted-foreground'>
                  {currentStreak === 0
                    ? 'Start today!'
                    : currentStreak >= 30
                      ? 'Legendary!'
                      : currentStreak >= 14
                        ? 'Unstoppable!'
                        : currentStreak >= 7
                          ? 'On fire!'
                          : currentStreak >= 3
                            ? 'Keep it up!'
                            : `day${currentStreak !== 1 ? 's' : ''}`}
                </div>
              </div>
            </div>
            <div className='flex items-center justify-between gap-1'>
              {weekActivity.map((day) => (
                <div key={day.date} className='flex flex-col items-center gap-1 flex-1'>
                  <div
                    className={`h-6 w-full max-w-[2rem] rounded transition-colors ${
                      day.count > 0
                        ? day.count >= dailyGoal
                          ? 'bg-[hsl(var(--emerald))]'
                          : 'bg-[hsl(var(--amber)/0.5)]'
                        : 'bg-surface-3'
                    }`}
                    title={`${day.date}: ${day.count} topic${day.count !== 1 ? 's' : ''}`}
                  />
                  <span className='text-[9px] text-muted-foreground'>{day.label}</span>
                </div>
              ))}
            </div>
            {longestStreak > 0 && (
              <div className='text-[10px] text-muted-foreground mt-2 text-right'>
                Longest streak: {longestStreak} day{longestStreak !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Daily Goal Card */}
          <div className='glass-card p-5'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='p-2 rounded-lg bg-[hsl(var(--cyan)/0.1)] border border-[hsl(var(--cyan)/0.2)]'>
                <Target className='h-5 w-5 text-[hsl(var(--cyan))]' />
              </div>
              <div>
                <h3 className='text-sm font-semibold text-foreground'>Daily Goal</h3>
                <p className='text-xs text-muted-foreground'>
                  {todayCompleted}/{dailyGoal} topics today
                </p>
              </div>
              {goalReached && (
                <Badge className='ml-auto text-[10px] bg-[hsl(var(--emerald)/0.1)] text-[hsl(var(--emerald))] border-[hsl(var(--emerald)/0.2)] gap-1'>
                  <Check className='h-2.5 w-2.5' />
                  Done!
                </Badge>
              )}
            </div>
            <div className='h-2 bg-surface-3 rounded-full overflow-hidden mb-3'>
              <div
                className='h-full rounded-full transition-all duration-500'
                style={{
                  width: `${goalProgress}%`,
                  backgroundColor: goalReached ? 'hsl(var(--emerald))' : 'hsl(var(--cyan))',
                }}
              />
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-xs text-muted-foreground'>Topics per day</span>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-6 w-6'
                  onClick={() => setDailyGoal(Math.max(1, dailyGoal - 1))}
                  disabled={dailyGoal <= 1}
                >
                  <Minus className='h-3 w-3' />
                </Button>
                <span className='text-sm font-semibold w-6 text-center'>{dailyGoal}</span>
                <Button
                  variant='outline'
                  size='icon'
                  className='h-6 w-6'
                  onClick={() => setDailyGoal(Math.min(20, dailyGoal + 1))}
                  disabled={dailyGoal >= 20}
                >
                  <Plus className='h-3 w-3' />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Study Planner */}
        <div className='mb-8'>
          <StudyPlanner />
        </div>

        {/* Roadmap Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {published.map((roadmap, i) => {
            const stats = getRoadmapStats(roadmap);
            const completedIds = currentUserId
              ? (roadmap.completedTopicIds ?? [])
              : (localProgress[roadmap.id] ?? []);
            const allTopicIds = roadmap.sections.flatMap((s) => s.topics.map((t) => t.id));
            const userCompleted = completedIds.filter((id) => allTopicIds.includes(id)).length;
            const progress =
              stats.totalTopics > 0 ? Math.round((userCompleted / stats.totalTopics) * 100) : 0;
            const Icon = iconMap[roadmap.icon] || Binary;

            return (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <Link to={`/roadmaps/${roadmap.slug}`} className='block h-full'>
                  <Card className='glass-card border-border/50 group hover:border-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col'>
                    <CardHeader className='pb-3'>
                      <div className='flex items-start justify-between'>
                        <div
                          className={`p-2.5 rounded-lg border ${colorBgMap[roadmap.color]} relative`}
                        >
                          <Icon className={`h-5 w-5 ${colorTextMap[roadmap.color]}`} />
                          {progress === 100 && (
                            <div className='absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground rounded-full p-0.5'>
                              <Trophy className='h-2.5 w-2.5' />
                            </div>
                          )}
                        </div>
                        <div className='flex items-center gap-1.5'>
                          {progress === 100 && (
                            <Badge className='text-[10px] bg-primary/10 text-primary border-primary/20 gap-1'>
                              <Trophy className='h-2.5 w-2.5' />
                              Completed
                            </Badge>
                          )}
                          <Badge
                            variant='outline'
                            className='text-xs border-border/50 text-muted-foreground'
                          >
                            {stats.totalSections} sections
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className='text-lg mt-3 group-hover:text-primary transition-colors'>
                        {roadmap.name}
                      </CardTitle>
                      <CardDescription className='text-sm line-clamp-2'>
                        {roadmap.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='mt-auto'>
                      <div className='space-y-3'>
                        <div className='flex flex-wrap gap-1'>
                          {roadmap.sections.map((s) => (
                            <span
                              key={s.id}
                              className='text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground'
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                        <div className='space-y-1.5'>
                          <div className='flex justify-between text-sm'>
                            <span className='text-muted-foreground'>
                              {userCompleted}/{stats.totalTopics} topics
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              ~{Math.round(stats.totalMinutes / 60)}h
                            </span>
                            <span className='text-primary font-medium'>{progress}%</span>
                          </div>
                          <div className='h-1.5 bg-surface-3 rounded-full overflow-hidden'>
                            <div
                              className='h-full rounded-full transition-all duration-500'
                              style={{
                                width: `${progress}%`,
                                backgroundColor: colorMap[roadmap.color],
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center justify-end mt-4 text-xs text-primary font-medium group-hover:gap-2 transition-all'>
                        <span>Explore</span>
                        <ArrowRight className='h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform' />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
