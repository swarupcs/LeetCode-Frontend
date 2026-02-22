import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MapPin,
  LinkIcon,
  Github,
  Twitter,
  Calendar,
  CheckCircle,
  Code2,
  Flame,
  Award,
  TrendingUp,
  Clock,
  Target,
  Edit3,
  ExternalLink,
  BookOpen,
  Zap,
} from 'lucide-react';
import { problems } from '@/data/problems';
import ContributionGraph from '@/components/ContributionGraph';

// Mock profile data
const profile = {
  username: 'alex_coder',
  displayName: 'Alex Johnson',
  avatar: null,
  initials: 'AJ',
  bio: 'Full-stack developer passionate about algorithms and data structures. Currently preparing for FAANG interviews. Love contributing to open source.',
  location: 'San Francisco, CA',
  website: 'https://alexjohnson.dev',
  github: 'alexjohnson',
  twitter: 'alex_codes',
  joinDate: 'Jan 2025',
  rank: 127,
  totalSolved: 85,
  totalAvailable: 250,
  currentStreak: 12,
  maxStreak: 23,
  totalSubmissions: 234,
  acceptanceRate: 72.4,
};

const difficultyBreakdown = [
  {
    level: 'Easy',
    solved: 45,
    total: 80,
    color: 'bg-[hsl(var(--emerald))]',
    textColor: 'text-[hsl(var(--emerald))]',
    ringColor: 'hsl(var(--emerald))',
  },
  {
    level: 'Medium',
    solved: 32,
    total: 120,
    color: 'bg-[hsl(var(--amber))]',
    textColor: 'text-[hsl(var(--amber))]',
    ringColor: 'hsl(var(--amber))',
  },
  {
    level: 'Hard',
    solved: 8,
    total: 50,
    color: 'bg-[hsl(var(--rose))]',
    textColor: 'text-[hsl(var(--rose))]',
    ringColor: 'hsl(var(--rose))',
  },
];

const recentSubmissions = [
  {
    problem: 'Two Sum',
    problemId: 1,
    status: 'Accepted',
    language: 'Python',
    runtime: '4ms',
    memory: '15.2MB',
    date: '2h ago',
  },
  {
    problem: 'Add Two Numbers',
    problemId: 2,
    status: 'Accepted',
    language: 'JavaScript',
    runtime: '12ms',
    memory: '42.1MB',
    date: '5h ago',
  },
  {
    problem: '3Sum',
    problemId: 8,
    status: 'Wrong Answer',
    language: 'Python',
    runtime: '-',
    memory: '-',
    date: '1d ago',
  },
  {
    problem: 'Valid Parentheses',
    problemId: 9,
    status: 'Accepted',
    language: 'Java',
    runtime: '1ms',
    memory: '38.5MB',
    date: '1d ago',
  },
  {
    problem: 'Merge Two Sorted Lists',
    problemId: 10,
    status: 'Time Limit Exceeded',
    language: 'Python',
    runtime: '-',
    memory: '-',
    date: '2d ago',
  },
  {
    problem: 'Group Anagrams',
    problemId: 13,
    status: 'Accepted',
    language: 'Python',
    runtime: '8ms',
    memory: '16.7MB',
    date: '3d ago',
  },
  {
    problem: 'Maximum Subarray',
    problemId: 14,
    status: 'Accepted',
    language: 'Python',
    runtime: '3ms',
    memory: '14.8MB',
    date: '4d ago',
  },
  {
    problem: 'Climbing Stairs',
    problemId: 15,
    status: 'Accepted',
    language: 'JavaScript',
    runtime: '0ms',
    memory: '12.1MB',
    date: '5d ago',
  },
];

const solvedByTopic = [
  { topic: 'Array', solved: 18, total: 40 },
  { topic: 'String', solved: 12, total: 30 },
  { topic: 'Hash Table', solved: 10, total: 25 },
  { topic: 'Dynamic Programming', solved: 8, total: 35 },
  { topic: 'Two Pointers', solved: 7, total: 20 },
  { topic: 'Stack', solved: 6, total: 15 },
  { topic: 'Linked List', solved: 5, total: 18 },
  { topic: 'Binary Search', solved: 4, total: 20 },
  { topic: 'Graph', solved: 3, total: 22 },
  { topic: 'Tree', solved: 3, total: 25 },
];

const badges = [
  {
    name: 'First Blood',
    description: 'Solve your first problem',
    icon: '🎯',
    earned: true,
  },
  {
    name: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    earned: true,
  },
  {
    name: 'Century',
    description: 'Solve 100 problems',
    icon: '💯',
    earned: false,
  },
  {
    name: 'Speed Demon',
    description: 'Beat 99% in runtime',
    icon: '⚡',
    earned: true,
  },
  {
    name: 'Polyglot',
    description: 'Submit in 3 languages',
    icon: '🌍',
    earned: true,
  },
  {
    name: 'Hard Hitter',
    description: 'Solve 10 Hard problems',
    icon: '💎',
    earned: false,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const solvedPercentage = (profile.totalSolved / profile.totalAvailable) * 100;

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <div className='glass-card p-6 sm:p-8 glow-border'>
            <div className='flex flex-col sm:flex-row items-start gap-6'>
              {/* Avatar */}
              <div className='relative shrink-0'>
                <div className='h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 border-2 border-primary/30 flex items-center justify-center'>
                  <span className='text-3xl sm:text-4xl font-bold gradient-text'>
                    {profile.initials}
                  </span>
                </div>
                <div className='absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary border-2 border-background flex items-center justify-center'>
                  <Check className='h-3 w-3 text-primary-foreground' />
                </div>
              </div>

              {/* Info */}
              <div className='flex-1 min-w-0'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2'>
                  <h1 className='text-2xl sm:text-3xl font-bold truncate'>
                    {profile.displayName}
                  </h1>
                  <Badge
                    variant='outline'
                    className='w-fit text-xs border-primary/30 text-primary bg-primary/5'
                  >
                    #{profile.rank} Global
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground mb-1 font-mono'>
                  @{profile.username}
                </p>
                <p className='text-sm text-foreground/80 leading-relaxed mb-4 max-w-2xl'>
                  {profile.bio}
                </p>

                <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground'>
                  <span className='flex items-center gap-1.5'>
                    <MapPin className='h-3.5 w-3.5' />
                    {profile.location}
                  </span>
                  <a
                    href={profile.website}
                    className='flex items-center gap-1.5 hover:text-primary transition-colors'
                  >
                    <LinkIcon className='h-3.5 w-3.5' />
                    alexjohnson.dev
                  </a>
                  <a
                    href={`https://github.com/${profile.github}`}
                    className='flex items-center gap-1.5 hover:text-foreground transition-colors'
                  >
                    <Github className='h-3.5 w-3.5' />
                    {profile.github}
                  </a>
                  <a
                    href={`https://twitter.com/${profile.twitter}`}
                    className='flex items-center gap-1.5 hover:text-foreground transition-colors'
                  >
                    <Twitter className='h-3.5 w-3.5' />
                    {profile.twitter}
                  </a>
                  <span className='flex items-center gap-1.5'>
                    <Calendar className='h-3.5 w-3.5' />
                    Joined {profile.joinDate}
                  </span>
                </div>
              </div>

              {/* Edit button */}
              <Button
                variant='outline'
                size='sm'
                className='border-border/50 text-muted-foreground hover:text-foreground shrink-0 gap-1.5'
              >
                <Edit3 className='h-3.5 w-3.5' />
                Edit Profile
              </Button>
            </div>

            {/* Quick Stats */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/30'>
              {[
                {
                  label: 'Solved',
                  value: profile.totalSolved,
                  icon: CheckCircle,
                  accent: 'text-primary',
                },
                {
                  label: 'Streak',
                  value: `${profile.currentStreak}d`,
                  icon: Flame,
                  accent: 'text-[hsl(var(--amber))]',
                },
                {
                  label: 'Submissions',
                  value: profile.totalSubmissions,
                  icon: Target,
                  accent: 'text-accent',
                },
                {
                  label: 'Acceptance',
                  value: `${profile.acceptanceRate}%`,
                  icon: TrendingUp,
                  accent: 'text-[hsl(var(--emerald-light))]',
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className='flex items-center gap-3 p-3 rounded-lg bg-surface-2/30'
                >
                  <stat.icon className={`h-5 w-5 ${stat.accent} shrink-0`} />
                  <div>
                    <div className='text-lg sm:text-xl font-bold'>
                      {stat.value}
                    </div>
                    <div className='text-[11px] text-muted-foreground'>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <TabsList className='bg-surface-1 border border-border/50 h-10 p-1 gap-1 mb-6'>
              <TabsTrigger
                value='overview'
                className='data-[state=active]:bg-surface-3 text-xs gap-1.5 px-3'
              >
                <Target className='h-3.5 w-3.5' />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value='submissions'
                className='data-[state=active]:bg-surface-3 text-xs gap-1.5 px-3'
              >
                <Clock className='h-3.5 w-3.5' />
                Submissions
              </TabsTrigger>
              <TabsTrigger
                value='badges'
                className='data-[state=active]:bg-surface-3 text-xs gap-1.5 px-3'
              >
                <Award className='h-3.5 w-3.5' />
                Badges
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Overview Tab */}
          <TabsContent value='overview' className='mt-0'>
            <div className='space-y-6'>
              {/* Contribution Graph */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className='glass-card border-border/50'>
                  <CardHeader>
                    <CardTitle className='text-base flex items-center gap-2'>
                      <Flame className='h-4 w-4 text-primary' />
                      Submission Activity
                    </CardTitle>
                    <CardDescription className='text-xs'>
                      Your coding activity over the past year
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContributionGraph />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={container}
                initial='hidden'
                animate='show'
                className='grid grid-cols-1 lg:grid-cols-3 gap-6'
              >
                {/* Solved Problems Chart */}
                <motion.div variants={item} className='lg:col-span-1'>
                  <Card className='glass-card border-border/50 h-full'>
                    <CardHeader>
                      <CardTitle className='text-base'>
                        Solved Problems
                      </CardTitle>
                      <CardDescription className='text-xs'>
                        By difficulty
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center'>
                      {/* Donut chart */}
                      <div className='relative w-36 h-36 mb-6'>
                        <svg
                          className='w-36 h-36 transform -rotate-90'
                          viewBox='0 0 144 144'
                        >
                          <circle
                            cx='72'
                            cy='72'
                            r='58'
                            stroke='hsl(var(--surface-3))'
                            strokeWidth='12'
                            fill='transparent'
                          />
                          {
                            difficultyBreakdown.reduce<{
                              elements: JSX.Element[];
                              offset: number;
                            }>(
                              (acc, d, i) => {
                                const circumference = 2 * Math.PI * 58;
                                const segmentLength =
                                  (d.solved / profile.totalSolved) *
                                  circumference;
                                acc.elements.push(
                                  <circle
                                    key={i}
                                    cx='72'
                                    cy='72'
                                    r='58'
                                    stroke={d.ringColor}
                                    strokeWidth='12'
                                    fill='transparent'
                                    strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                                    strokeDashoffset={-acc.offset}
                                    strokeLinecap='round'
                                    className='transition-all duration-700'
                                  />,
                                );
                                acc.offset += segmentLength;
                                return acc;
                              },
                              { elements: [], offset: 0 },
                            ).elements
                          }
                        </svg>
                        <div className='absolute inset-0 flex flex-col items-center justify-center'>
                          <span className='text-2xl font-bold'>
                            {profile.totalSolved}
                          </span>
                          <span className='text-[10px] text-muted-foreground'>
                            solved
                          </span>
                        </div>
                      </div>

                      {/* Breakdown bars */}
                      <div className='w-full space-y-3'>
                        {difficultyBreakdown.map((d) => (
                          <div key={d.level}>
                            <div className='flex justify-between text-xs mb-1.5'>
                              <span className={`${d.textColor} font-medium`}>
                                {d.level}
                              </span>
                              <span className='text-muted-foreground tabular-nums'>
                                {d.solved}/{d.total}
                              </span>
                            </div>
                            <div className='h-1.5 bg-surface-3 rounded-full overflow-hidden'>
                              <div
                                className={`${d.color} h-full rounded-full transition-all duration-700`}
                                style={{
                                  width: `${(d.solved / d.total) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Topics Progress */}
                <motion.div variants={item} className='lg:col-span-2'>
                  <Card className='glass-card border-border/50 h-full'>
                    <CardHeader>
                      <CardTitle className='text-base'>
                        Skills by Topic
                      </CardTitle>
                      <CardDescription className='text-xs'>
                        Progress across different categories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
                        {solvedByTopic.map((topic) => {
                          const pct = (topic.solved / topic.total) * 100;
                          return (
                            <div key={topic.topic}>
                              <div className='flex justify-between text-xs mb-1.5'>
                                <span className='text-foreground/90 font-medium'>
                                  {topic.topic}
                                </span>
                                <span className='text-muted-foreground tabular-nums'>
                                  {topic.solved}/{topic.total}
                                </span>
                              </div>
                              <div className='h-2 bg-surface-3 rounded-full overflow-hidden'>
                                <div
                                  className='h-full rounded-full transition-all duration-700 bg-gradient-to-r from-primary to-accent'
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={item} className='lg:col-span-3'>
                  <Card className='glass-card border-border/50'>
                    <CardHeader className='flex flex-row items-center justify-between'>
                      <div>
                        <CardTitle className='text-base'>
                          Recent Activity
                        </CardTitle>
                        <CardDescription className='text-xs'>
                          Latest submissions
                        </CardDescription>
                      </div>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setActiveTab('submissions')}
                        className='text-xs text-muted-foreground hover:text-foreground gap-1'
                      >
                        View all
                        <ExternalLink className='h-3 w-3' />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className='divide-y divide-border/30'>
                        {recentSubmissions.slice(0, 5).map((sub, i) => (
                          <div
                            key={i}
                            className='flex items-center justify-between py-3 first:pt-0 last:pb-0'
                          >
                            <div className='flex items-center gap-3 min-w-0'>
                              <div
                                className={`p-1.5 rounded-md shrink-0 ${
                                  sub.status === 'Accepted'
                                    ? 'bg-primary/10'
                                    : 'bg-destructive/10'
                                }`}
                              >
                                {sub.status === 'Accepted' ? (
                                  <CheckCircle className='h-4 w-4 text-primary' />
                                ) : (
                                  <Code2 className='h-4 w-4 text-destructive' />
                                )}
                              </div>
                              <div className='min-w-0'>
                                <Link
                                  to={`/problem/${sub.problemId}`}
                                  className='text-sm font-medium hover:text-primary transition-colors truncate block'
                                >
                                  {sub.problem}
                                </Link>
                                <div className='text-[11px] text-muted-foreground'>
                                  {sub.language} · {sub.date}
                                </div>
                              </div>
                            </div>
                            <div className='text-right shrink-0 ml-4'>
                              <div
                                className={`text-xs font-medium ${
                                  sub.status === 'Accepted'
                                    ? 'text-primary'
                                    : 'text-destructive'
                                }`}
                              >
                                {sub.status}
                              </div>
                              {sub.runtime !== '-' && (
                                <div className='text-[10px] text-muted-foreground'>
                                  {sub.runtime} · {sub.memory}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value='submissions' className='mt-0'>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className='glass-card border-border/50'>
                <CardHeader>
                  <CardTitle className='text-base'>All Submissions</CardTitle>
                  <CardDescription className='text-xs'>
                    {recentSubmissions.length} total submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Table header */}
                  <div className='hidden sm:grid grid-cols-[1fr_120px_100px_80px_80px_80px] gap-3 px-3 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider border-b border-border/30 mb-1'>
                    <div>Problem</div>
                    <div>Status</div>
                    <div>Language</div>
                    <div>Runtime</div>
                    <div>Memory</div>
                    <div>When</div>
                  </div>

                  <div className='divide-y divide-border/20'>
                    {recentSubmissions.map((sub, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className='grid grid-cols-1 sm:grid-cols-[1fr_120px_100px_80px_80px_80px] gap-2 sm:gap-3 items-center px-3 py-3 hover:bg-surface-2/30 rounded-lg transition-colors'
                      >
                        <Link
                          to={`/problem/${sub.problemId}`}
                          className='text-sm font-medium hover:text-primary transition-colors'
                        >
                          {sub.problem}
                        </Link>
                        <div
                          className={`text-xs font-medium ${
                            sub.status === 'Accepted'
                              ? 'text-primary'
                              : 'text-destructive'
                          }`}
                        >
                          {sub.status}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {sub.language}
                        </div>
                        <div className='text-xs text-muted-foreground font-mono'>
                          {sub.runtime}
                        </div>
                        <div className='text-xs text-muted-foreground font-mono'>
                          {sub.memory}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {sub.date}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value='badges' className='mt-0'>
            <motion.div variants={container} initial='hidden' animate='show'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {badges.map((badge, i) => (
                  <motion.div key={i} variants={item}>
                    <Card
                      className={`glass-card border-border/50 transition-all duration-300 ${
                        badge.earned
                          ? 'hover:border-primary/30'
                          : 'opacity-50 grayscale'
                      }`}
                    >
                      <CardContent className='p-5 flex items-center gap-4'>
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                            badge.earned
                              ? 'bg-primary/10 border border-primary/20'
                              : 'bg-surface-3 border border-border/30'
                          }`}
                        >
                          {badge.icon}
                        </div>
                        <div className='min-w-0'>
                          <div className='text-sm font-semibold flex items-center gap-2'>
                            {badge.name}
                            {badge.earned && (
                              <CheckCircle className='h-3.5 w-3.5 text-primary shrink-0' />
                            )}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {badge.description}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Check(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='3'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <polyline points='20 6 9 17 4 12' />
    </svg>
  );
}
