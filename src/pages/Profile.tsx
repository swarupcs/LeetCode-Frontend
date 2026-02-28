import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
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
  X,
  Save,
} from 'lucide-react';
import ContributionGraph from '@/components/ContributionGraph';

import { useGetUserSolvedStats } from '@/hooks/user-stats/useGetUserSolvedStats';
import { useGetUserProgressData } from '@/hooks/user-stats/useGetUserProgressData';
import { useGetUserHeatMapData } from '@/hooks/user-stats/useGetUserHeatMapData';
import type { UpdateProfilePayload } from '@/types/auth.types';
import { useUpdateUserProfile } from '@/hooks/auth/useUpdateUserProfile';
import { useGetUserProfile } from '@/hooks/auth/useGetUserProfile';

// ─── Colour tokens ─────────────────────────────────────────────────────────────
const C = {
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  primary: '#22c55e',
  accent: '#a78bfa',
  track: 'rgba(255,255,255,0.08)',
} as const;

// ─── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({
  pct,
  color,
  height = 6,
}: {
  pct: number;
  color: string;
  height?: number;
}) {
  return (
    <div
      style={{
        height,
        width: '100%',
        borderRadius: 9999,
        backgroundColor: C.track,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${Math.min(100, Math.max(0, pct))}%`,
          borderRadius: 9999,
          backgroundColor: color,
          transition: 'width 0.7s ease-out',
        }}
      />
    </div>
  );
}

// ─── Static badges ─────────────────────────────────────────────────────────────
const BADGES = [
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

// ─── Animation variants ────────────────────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── Edit Profile form state ───────────────────────────────────────────────────
// Matches the shape we pre-fill from the API response
interface EditModalInitial {
  displayName: string | null | undefined;
  bio: string | null | undefined;
  location: string | null | undefined;
  github: string | null | undefined; // username only (from API field `github`)
  twitter: string | null | undefined; // username only (from API field `twitter`)
  website: string | null | undefined;
}

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  initial: EditModalInitial;
}

function EditProfileModal({ open, onClose, initial }: EditModalProps) {
  const { updateProfile, isPending } = useUpdateUserProfile();

  // Normalise nulls → empty strings for controlled inputs
  const [form, setForm] = useState({
    name: initial.displayName ?? '',
    bio: initial.bio ?? '',
    location: initial.location ?? '',
    githubUrl: initial.github ?? '', // stored as username; API field name is githubUrl
    twitterUrl: initial.twitter ?? '', // stored as username; API field name is twitterUrl
    website: initial.website ?? '',
  });

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    // Only send fields that have actually changed
    const changed: UpdateProfilePayload = {};
    if (form.name !== (initial.displayName ?? '')) changed.name = form.name;
    if (form.bio !== (initial.bio ?? '')) changed.bio = form.bio;
    if (form.location !== (initial.location ?? ''))
      changed.location = form.location;
    if (form.githubUrl !== (initial.github ?? ''))
      changed.githubUrl = form.githubUrl;
    if (form.twitterUrl !== (initial.twitter ?? ''))
      changed.twitterUrl = form.twitterUrl;
    if (form.website !== (initial.website ?? ''))
      changed.website = form.website;

    if (Object.keys(changed).length === 0) {
      onClose();
      return;
    }

    await updateProfile(changed);
    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 z-40 bg-black/60 backdrop-blur-sm'
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
          >
            <div className='glass-card w-full max-w-lg p-6 rounded-2xl border border-border/50 shadow-2xl'>
              {/* Header */}
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-lg font-semibold'>Edit Profile</h2>
                <button
                  onClick={onClose}
                  className='text-muted-foreground hover:text-foreground transition-colors'
                >
                  <X className='h-5 w-5' />
                </button>
              </div>

              {/* Fields */}
              <div className='space-y-4'>
                <div>
                  <label className='text-xs font-medium text-muted-foreground mb-1.5 block'>
                    Display Name
                  </label>
                  <Input
                    value={form.name}
                    onChange={set('name')}
                    placeholder='Your name'
                    className='bg-surface-2 border-border/40 text-sm'
                  />
                </div>

                <div>
                  <label className='text-xs font-medium text-muted-foreground mb-1.5 block'>
                    Bio
                  </label>
                  <Textarea
                    value={form.bio}
                    onChange={set('bio')}
                    placeholder='Tell us about yourself…'
                    rows={3}
                    className='bg-surface-2 border-border/40 text-sm resize-none'
                  />
                </div>

                <div>
                  <label className='text-xs font-medium text-muted-foreground mb-1.5 block'>
                    Location
                  </label>
                  <Input
                    value={form.location}
                    onChange={set('location')}
                    placeholder='City, Country'
                    className='bg-surface-2 border-border/40 text-sm'
                  />
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='text-xs font-medium text-muted-foreground mb-1.5 block'>
                      GitHub username
                    </label>
                    <Input
                      value={form.githubUrl}
                      onChange={set('githubUrl')}
                      placeholder='username'
                      className='bg-surface-2 border-border/40 text-sm'
                    />
                  </div>
                  <div>
                    <label className='text-xs font-medium text-muted-foreground mb-1.5 block'>
                      Twitter username
                    </label>
                    <Input
                      value={form.twitterUrl}
                      onChange={set('twitterUrl')}
                      placeholder='username'
                      className='bg-surface-2 border-border/40 text-sm'
                    />
                  </div>
                </div>

                <div>
                  <label className='text-xs font-medium text-muted-foreground mb-1.5 block'>
                    Website
                  </label>
                  <Input
                    value={form.website}
                    onChange={set('website')}
                    placeholder='https://yoursite.com'
                    className='bg-surface-2 border-border/40 text-sm'
                  />
                </div>
              </div>

              {/* Actions */}
              <div className='flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border/30'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={onClose}
                  disabled={isPending}
                  className='text-muted-foreground'
                >
                  Cancel
                </Button>
                <Button
                  size='sm'
                  onClick={handleSave}
                  disabled={isPending}
                  className='bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5'
                >
                  {isPending ? (
                    <Loader2 className='h-3.5 w-3.5 animate-spin' />
                  ) : (
                    <Save className='h-3.5 w-3.5' />
                  )}
                  {isPending ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editModalOpen, setEditModalOpen] = useState(false);

  // ── Data hooks ──────────────────────────────────────────────────────────────
  const { user: profile, isLoading: loadingProfile } = useGetUserProfile();
  const { solvedStats, isLoading: loadingSolved } = useGetUserSolvedStats();
  const { progressData, isLoading: loadingProgress } = useGetUserProgressData();
  const { heatMapData, isLoading: loadingHeatMap } = useGetUserHeatMapData();

  // console.log("profile", profile)

  const isLoading =
    loadingProfile || loadingSolved || loadingProgress || loadingHeatMap;

  // ── Derived stats ───────────────────────────────────────────────────────────
  const easySolved = solvedStats?.difficultyStats.EASY ?? 0;
  const mediumSolved = solvedStats?.difficultyStats.MEDIUM ?? 0;
  const hardSolved = solvedStats?.difficultyStats.HARD ?? 0;
  const easyTotal = solvedStats?.totalDifficultyCounts.EASY ?? 0;
  const mediumTotal = solvedStats?.totalDifficultyCounts.MEDIUM ?? 0;
  const hardTotal = solvedStats?.totalDifficultyCounts.HARD ?? 0;
  const totalSolved = easySolved + mediumSolved + hardSolved;

  const difficultyBreakdown = useMemo(
    () => [
      { level: 'Easy', solved: easySolved, total: easyTotal, color: C.emerald },
      {
        level: 'Medium',
        solved: mediumSolved,
        total: mediumTotal,
        color: C.amber,
      },
      { level: 'Hard', solved: hardSolved, total: hardTotal, color: C.rose },
    ],
    [easySolved, mediumSolved, hardSolved, easyTotal, mediumTotal, hardTotal],
  );

  const topicProgress = useMemo(() => {
    if (!solvedStats) return [];
    return Object.entries(solvedStats.tagStats).map(([tag, solved]) => ({
      topic: tag,
      solved: solved as number,
      total: (solvedStats.totalTagCounts[tag] ?? solved) as number,
    }));
  }, [solvedStats]);

  const recentSubmissions = progressData?.recentSubmissions ?? [];

  // ── Avatar initials fallback ────────────────────────────────────────────────
  // e.g. "Swarup Das" → "SD"
  const initials = profile?.displayName
    ? profile.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : (profile?.username?.[0]?.toUpperCase() ?? '?');

  // ── Profile is truthy once loaded; check for missing optional fields ────────
  const hasSocialInfo = !!(
    profile?.bio ||
    profile?.location ||
    profile?.website ||
    profile?.github ||
    profile?.twitter
  );

  // ── Loading state ───────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      {/* Edit Profile Modal — pass API field names directly */}
      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initial={{
          displayName: profile?.displayName,
          bio: profile?.bio,
          location: profile?.location,
          github: profile?.github, // username, e.g. "swarupd1999"
          twitter: profile?.twitter, // username
          website: profile?.website,
        }}
      />

      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* ── Profile Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <div className='glass-card p-6 sm:p-8 glow-border'>
            <div className='flex flex-col sm:flex-row items-start gap-6'>
              {/* Avatar */}
              <div className='relative shrink-0'>
                <div className='h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 border-2 border-primary/30 flex items-center justify-center overflow-hidden'>
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.displayName ?? profile.username ?? 'User'}
                      className='w-full h-full object-cover'
                      referrerPolicy='no-referrer'
                    />
                  ) : (
                    <span className='text-3xl sm:text-4xl font-bold gradient-text'>
                      {initials}
                    </span>
                  )}
                </div>
                {/* Online / verified dot */}
                <div className='absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary border-2 border-background flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-3 w-3 text-primary-foreground'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                </div>
              </div>

              {/* Info */}
              <div className='flex-1 min-w-0'>
                {/* Name + rank */}
                <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1'>
                  <h1 className='text-2xl sm:text-3xl font-bold truncate'>
                    {/* API: displayName = "Swarup Das" */}
                    {profile?.displayName ?? profile?.username ?? '—'}
                  </h1>
                  {profile?.rank != null && (
                    <Badge
                      variant='outline'
                      className='w-fit text-xs border-primary/30 text-primary bg-primary/5'
                    >
                      #{profile.rank} Global
                    </Badge>
                  )}
                </div>

                {/* @username — API: username = "swarupd1999" */}
                <p className='text-sm text-muted-foreground mb-3 font-mono'>
                  @{profile?.username ?? '—'}
                </p>

                {/* Bio — API: bio (nullable) */}
                {profile?.bio && (
                  <p className='text-sm text-foreground/80 leading-relaxed mb-3 max-w-2xl'>
                    {profile.bio}
                  </p>
                )}

                {/* Social / meta row */}
                <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground'>
                  {/* API: location (nullable) */}
                  {profile?.location && (
                    <span className='flex items-center gap-1.5'>
                      <MapPin className='h-3.5 w-3.5' />
                      {profile.location}
                    </span>
                  )}

                  {/* API: website (nullable) */}
                  {profile?.website && (
                    <a
                      href={profile.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1.5 hover:text-primary transition-colors'
                    >
                      <LinkIcon className='h-3.5 w-3.5' />
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}

                  {/* API: github = username string (nullable), not a full URL */}
                  {profile?.github && (
                    <a
                      href={`https://github.com/${profile.github}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1.5 hover:text-foreground transition-colors'
                    >
                      <Github className='h-3.5 w-3.5' />
                      {profile.github}
                    </a>
                  )}

                  {/* API: twitter = username string (nullable), not a full URL */}
                  {profile?.twitter && (
                    <a
                      href={`https://twitter.com/${profile.twitter}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1.5 hover:text-foreground transition-colors'
                    >
                      <Twitter className='h-3.5 w-3.5' />
                      {profile.twitter}
                    </a>
                  )}

                  {/* API: joinDate = "Nov 2025" */}
                  {profile?.joinDate && (
                    <span className='flex items-center gap-1.5'>
                      <Calendar className='h-3.5 w-3.5' />
                      Joined {profile.joinDate}
                    </span>
                  )}

                  {/* Empty state prompt */}
                  {!hasSocialInfo && (
                    <span className='text-muted-foreground/50 italic'>
                      No bio yet — click Edit Profile to add one
                    </span>
                  )}
                </div>
              </div>

              {/* Edit button */}
              <Button
                variant='outline'
                size='sm'
                onClick={() => setEditModalOpen(true)}
                className='border-border/50 text-muted-foreground hover:text-foreground shrink-0 gap-1.5'
              >
                <Edit3 className='h-3.5 w-3.5' />
                Edit Profile
              </Button>
            </div>

            {/* Quick stats */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/30'>
              {(
                [
                  {
                    label: 'Solved',
                    value: totalSolved,
                    icon: CheckCircle,
                    color: C.primary,
                  },
                  {
                    label: 'Streak',
                    value: `${solvedStats?.currentStreak ?? 0}d`,
                    icon: Flame,
                    color: C.amber,
                  },
                  {
                    label: 'Submissions',
                    value: solvedStats?.totalSubmissions ?? 0,
                    icon: Target,
                    color: C.accent,
                  },
                  {
                    label: 'Acceptance',
                    value: `${solvedStats?.acceptanceRate ?? 0}%`,
                    icon: TrendingUp,
                    color: C.emerald,
                  },
                ] as const
              ).map((stat, i) => (
                <div
                  key={i}
                  className='flex items-center gap-3 p-3 rounded-lg bg-surface-2/30'
                >
                  <stat.icon
                    className='h-5 w-5 shrink-0'
                    style={{ color: stat.color }}
                  />
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

        {/* ── Tabs ───────────────────────────────────────────────────────────── */}
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
                <Target className='h-3.5 w-3.5' /> Overview
              </TabsTrigger>
              <TabsTrigger
                value='submissions'
                className='data-[state=active]:bg-surface-3 text-xs gap-1.5 px-3'
              >
                <Clock className='h-3.5 w-3.5' /> Submissions
              </TabsTrigger>
              <TabsTrigger
                value='badges'
                className='data-[state=active]:bg-surface-3 text-xs gap-1.5 px-3'
              >
                <Award className='h-3.5 w-3.5' /> Badges
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* ── Overview ───────────────────────────────────────────────────────── */}
          <TabsContent value='overview' className='mt-0'>
            <div className='space-y-6'>
              {/* Heatmap */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className='glass-card border-border/50'>
                  <CardHeader>
                    <CardTitle className='text-base flex items-center gap-2'>
                      <Flame className='h-4 w-4 text-primary' /> Submission
                      Activity
                    </CardTitle>
                    <CardDescription className='text-xs'>
                      Your coding activity over the past year
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContributionGraph data={heatMapData ?? []} />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={container}
                initial='hidden'
                animate='show'
                className='grid grid-cols-1 lg:grid-cols-3 gap-6'
              >
                {/* Solved donut */}
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
                      {/* Donut */}
                      <div className='relative w-36 h-36 mb-6'>
                        <svg
                          className='w-36 h-36 -rotate-90'
                          viewBox='0 0 144 144'
                        >
                          <circle
                            cx='72'
                            cy='72'
                            r='58'
                            stroke={C.track}
                            strokeWidth='12'
                            fill='transparent'
                          />
                          {totalSolved > 0 &&
                            difficultyBreakdown.reduce<{
                              els: React.ReactNode[];
                              offset: number;
                            }>(
                              (acc, d) => {
                                const circ = 2 * Math.PI * 58;
                                const seg = (d.solved / totalSolved) * circ;
                                acc.els.push(
                                  <circle
                                    key={d.level}
                                    cx='72'
                                    cy='72'
                                    r='58'
                                    stroke={d.color}
                                    strokeWidth='12'
                                    fill='transparent'
                                    strokeDasharray={`${seg} ${circ - seg}`}
                                    strokeDashoffset={-acc.offset}
                                    strokeLinecap='round'
                                    style={{
                                      transition:
                                        'stroke-dasharray 0.7s ease-out',
                                    }}
                                  />,
                                );
                                acc.offset += seg;
                                return acc;
                              },
                              { els: [], offset: 0 },
                            ).els}
                        </svg>
                        <div className='absolute inset-0 flex flex-col items-center justify-center'>
                          <span className='text-2xl font-bold'>
                            {totalSolved}
                          </span>
                          <span className='text-[10px] text-muted-foreground'>
                            solved
                          </span>
                        </div>
                      </div>

                      {/* Difficulty bars */}
                      <div className='w-full space-y-3'>
                        {difficultyBreakdown.map((d) => (
                          <div key={d.level}>
                            <div className='flex justify-between text-xs mb-1.5'>
                              <span
                                className='font-medium'
                                style={{ color: d.color }}
                              >
                                {d.level}
                              </span>
                              <span className='text-muted-foreground tabular-nums'>
                                {d.solved}/{d.total}
                              </span>
                            </div>
                            <ProgressBar
                              pct={d.total > 0 ? (d.solved / d.total) * 100 : 0}
                              color={d.color}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Topics */}
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
                      {topicProgress.length > 0 ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4'>
                          {topicProgress.map((t) => {
                            const pct =
                              t.total > 0 ? (t.solved / t.total) * 100 : 0;
                            return (
                              <div key={t.topic}>
                                <div className='flex justify-between text-xs mb-1.5'>
                                  <span className='text-foreground/90 font-medium capitalize'>
                                    {t.topic}
                                  </span>
                                  <span className='text-muted-foreground tabular-nums'>
                                    {t.solved}/{t.total}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    height: 8,
                                    width: '100%',
                                    borderRadius: 9999,
                                    backgroundColor: C.track,
                                  }}
                                >
                                  <div
                                    style={{
                                      height: '100%',
                                      width: `${pct}%`,
                                      borderRadius: 9999,
                                      background: `linear-gradient(to right, ${C.primary}, ${C.accent})`,
                                      transition: 'width 0.7s ease-out',
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className='text-sm text-muted-foreground text-center py-8'>
                          Solve some problems to see topic progress.
                        </p>
                      )}
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
                        View all <ExternalLink className='h-3 w-3' />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {recentSubmissions.length > 0 ? (
                        <div className='divide-y divide-border/30'>
                          {recentSubmissions.slice(0, 5).map((sub, i) => (
                            <div
                              key={i}
                              className='flex items-center justify-between py-3 first:pt-0 last:pb-0'
                            >
                              <div className='flex items-center gap-3 min-w-0'>
                                <div
                                  className={`p-1.5 rounded-md shrink-0 ${sub.status === 'Accepted' ? 'bg-primary/10' : 'bg-destructive/10'}`}
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
                                  className={`text-xs font-medium ${sub.status === 'Accepted' ? 'text-primary' : 'text-destructive'}`}
                                >
                                  {sub.status}
                                </div>
                                {sub.time && sub.time !== '-' && (
                                  <div className='text-[10px] text-muted-foreground'>
                                    {sub.time} · {sub.memory}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className='text-sm text-muted-foreground text-center py-8'>
                          No submissions yet.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </TabsContent>

          {/* ── Submissions Tab ─────────────────────────────────────────────────── */}
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
                    {recentSubmissions.length > 0 ? (
                      recentSubmissions.map((sub, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className='grid grid-cols-1 sm:grid-cols-[1fr_120px_100px_80px_80px_80px] gap-2 sm:gap-3 items-center px-3 py-3 hover:bg-surface-2/30 rounded-lg transition-colors'
                        >
                          <Link
                            to={`/problems/${sub.problem}`}
                            className='text-sm font-medium hover:text-primary transition-colors'
                          >
                            {sub.problem}
                          </Link>
                          <div
                            className={`text-xs font-medium ${sub.status === 'Accepted' ? 'text-primary' : 'text-destructive'}`}
                          >
                            {sub.status}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {sub.language}
                          </div>
                          <div className='text-xs text-muted-foreground font-mono'>
                            {sub.time ?? '—'}
                          </div>
                          <div className='text-xs text-muted-foreground font-mono'>
                            {sub.memory ?? '—'}
                          </div>
                          <div className='text-xs text-muted-foreground'>
                            {sub.date}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className='text-sm text-muted-foreground text-center py-12'>
                        No submissions yet.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ── Badges Tab ──────────────────────────────────────────────────────── */}
          <TabsContent value='badges' className='mt-0'>
            <motion.div variants={container} initial='hidden' animate='show'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {BADGES.map((badge, i) => (
                  <motion.div key={i} variants={item}>
                    <Card
                      className={`glass-card border-border/50 transition-all duration-300 ${badge.earned ? 'hover:border-primary/30' : 'opacity-50 grayscale'}`}
                    >
                      <CardContent className='p-5 flex items-center gap-4'>
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${badge.earned ? 'bg-primary/10 border border-primary/20' : 'bg-surface-3 border border-border/30'}`}
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
