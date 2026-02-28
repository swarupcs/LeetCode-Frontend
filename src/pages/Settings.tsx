import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  User,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  Camera,
  Globe,
  Github,
  Twitter,
  MapPin,
  Mail,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <h1 className='text-3xl font-bold mb-2'>Settings</h1>
          <p className='text-muted-foreground text-sm'>
            Manage your account, security, and preferences
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TabsList className='bg-surface-1 border border-border/50 h-10 p-1 gap-1 mb-8'>
              <TabsTrigger
                value='profile'
                className='data-[state=active]:bg-surface-3 text-xs gap-1.5 px-3'
              >
                <User className='h-3.5 w-3.5' />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value='security'
                className='data-[state=active]:bg-surface-3 text-xs gap-1.5 px-3'
              >
                <Lock className='h-3.5 w-3.5' />
                Security
              </TabsTrigger>
              <TabsTrigger
                value='notifications'
                className='data-[state=active]:bg-surface-3 text-xs gap-1.5 px-3'
              >
                <Bell className='h-3.5 w-3.5' />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value='account'
                className='data-[state=active]:bg-surface-3 text-xs gap-1.5 px-3'
              >
                <Shield className='h-3.5 w-3.5' />
                Account
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value='profile' className='mt-0'>
            <ProfileSettings />
          </TabsContent>
          <TabsContent value='security' className='mt-0'>
            <SecuritySettings />
          </TabsContent>
          <TabsContent value='notifications' className='mt-0'>
            <NotificationSettings />
          </TabsContent>
          <TabsContent value='account' className='mt-0'>
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ─── Profile Settings ─── */
function ProfileSettings() {
  const [displayName, setDisplayName] = useState('Alex Johnson');
  const [username, setUsername] = useState('alex_coder');
  const [email, setEmail] = useState('alex@example.com');
  const [bio, setBio] = useState(
    'Full-stack developer passionate about algorithms and data structures. Currently preparing for FAANG interviews.',
  );
  const [location, setLocation] = useState('San Francisco, CA');
  const [website, setWebsite] = useState('https://alexjohnson.dev');
  const [github, setGithub] = useState('alexjohnson');
  const [twitter, setTwitter] = useState('alex_codes');

  const handleSave = () => {
    toast.success('Profile updated', {
      description: 'Your profile has been saved successfully.',
    });
  };

  return (
    <motion.div
      variants={container}
      initial='hidden'
      animate='show'
      className='space-y-6'
    >
      {/* Avatar */}
      <motion.div variants={item}>
        <Card className='glass-card border-border/50'>
          <CardHeader>
            <CardTitle className='text-base'>Avatar</CardTitle>
            <CardDescription className='text-xs'>
              Your profile picture visible to other users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-6'>
              <div className='relative group'>
                <div className='h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 border-2 border-primary/30 flex items-center justify-center'>
                  <span className='text-2xl font-bold gradient-text'>AJ</span>
                </div>
                <button className='absolute inset-0 rounded-2xl bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                  <Camera className='h-5 w-5 text-foreground' />
                </button>
              </div>
              <div className='space-y-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='border-border/50 text-xs gap-1.5'
                >
                  <Camera className='h-3.5 w-3.5' />
                  Upload Photo
                </Button>
                <p className='text-[11px] text-muted-foreground'>
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Info */}
      <motion.div variants={item}>
        <Card className='glass-card border-border/50'>
          <CardHeader>
            <CardTitle className='text-base'>Personal Information</CardTitle>
            <CardDescription className='text-xs'>
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-5'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              <div className='space-y-2'>
                <Label htmlFor='displayName' className='text-xs font-medium'>
                  Display Name
                </Label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                  <Input
                    id='displayName'
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className='pl-9 bg-surface-2 border-border/50 focus:border-primary/50 h-10 text-sm'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='username' className='text-xs font-medium'>
                  Username
                </Label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'>
                    @
                  </span>
                  <Input
                    id='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='pl-8 bg-surface-2 border-border/50 focus:border-primary/50 h-10 text-sm'
                  />
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email' className='text-xs font-medium'>
                Email Address
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='pl-9 bg-surface-2 border-border/50 focus:border-primary/50 h-10 text-sm'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='bio' className='text-xs font-medium'>
                Bio
              </Label>
              <Textarea
                id='bio'
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder='Tell us about yourself...'
                className='bg-surface-2 border-border/50 focus:border-primary/50 text-sm min-h-[100px] resize-none'
                maxLength={280}
              />
              <p className='text-[11px] text-muted-foreground text-right'>
                {bio.length}/280
              </p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='location' className='text-xs font-medium'>
                Location
              </Label>
              <div className='relative'>
                <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                <Input
                  id='location'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder='City, Country'
                  className='pl-9 bg-surface-2 border-border/50 focus:border-primary/50 h-10 text-sm'
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Social Links */}
      <motion.div variants={item}>
        <Card className='glass-card border-border/50'>
          <CardHeader>
            <CardTitle className='text-base'>Social Links</CardTitle>
            <CardDescription className='text-xs'>
              Connect your online presence
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label className='text-xs font-medium'>Website</Label>
              <div className='relative'>
                <Globe className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                <Input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder='https://yoursite.com'
                  className='pl-9 bg-surface-2 border-border/50 focus:border-primary/50 h-10 text-sm'
                />
              </div>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label className='text-xs font-medium'>GitHub</Label>
                <div className='relative'>
                  <Github className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                  <Input
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder='username'
                    className='pl-9 bg-surface-2 border-border/50 focus:border-primary/50 h-10 text-sm'
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label className='text-xs font-medium'>Twitter</Label>
                <div className='relative'>
                  <Twitter className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                  <Input
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder='handle'
                    className='pl-9 bg-surface-2 border-border/50 focus:border-primary/50 h-10 text-sm'
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save */}
      <motion.div variants={item} className='flex justify-end'>
        <Button
          onClick={handleSave}
          className='bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5'
        >
          <Save className='h-4 w-4' />
          Save Changes
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Security Settings ─── */
function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Missing fields', {
        description: 'Please fill in all password fields.',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: 'New password and confirmation must match.',
      });
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password too short', {
        description: 'Password must be at least 8 characters.',
      });
      return;
    }
    toast.success('Password updated', {
      description: 'Your password has been changed successfully.',
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Password strength indicator
  const getStrength = (pw: string) => {
    if (!pw) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1)
      return { label: 'Weak', color: 'bg-destructive', width: '20%' };
    if (score <= 2)
      return { label: 'Fair', color: 'bg-[hsl(var(--amber))]', width: '40%' };
    if (score <= 3)
      return { label: 'Good', color: 'bg-[hsl(var(--amber))]', width: '60%' };
    if (score <= 4)
      return { label: 'Strong', color: 'bg-primary', width: '80%' };
    return { label: 'Very Strong', color: 'bg-primary', width: '100%' };
  };

  const strength = getStrength(newPassword);

  return (
    <motion.div
      variants={container}
      initial='hidden'
      animate='show'
      className='space-y-6'
    >
      {/* Change Password */}
      <motion.div variants={item}>
        <Card className='glass-card border-border/50'>
          <CardHeader>
            <CardTitle className='text-base'>Change Password</CardTitle>
            <CardDescription className='text-xs'>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-5'>
            <div className='space-y-2'>
              <Label className='text-xs font-medium'>Current Password</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder='Enter current password'
                  className='pl-9 pr-10 bg-surface-2 border-border/50 focus:border-primary/50 h-10 text-sm'
                />
                <button
                  type='button'
                  onClick={() => setShowCurrent(!showCurrent)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                >
                  {showCurrent ? (
                    <EyeOff className='h-3.5 w-3.5' />
                  ) : (
                    <Eye className='h-3.5 w-3.5' />
                  )}
                </button>
              </div>
            </div>

            <Separator className='bg-border/30' />

            <div className='space-y-2'>
              <Label className='text-xs font-medium'>New Password</Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                <Input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Enter new password'
                  className='pl-9 pr-10 bg-surface-2 border-border/50 focus:border-primary/50 h-10 text-sm'
                />
                <button
                  type='button'
                  onClick={() => setShowNew(!showNew)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                >
                  {showNew ? (
                    <EyeOff className='h-3.5 w-3.5' />
                  ) : (
                    <Eye className='h-3.5 w-3.5' />
                  )}
                </button>
              </div>
              {newPassword && (
                <div className='space-y-1.5'>
                  <div className='h-1.5 bg-surface-3 rounded-full overflow-hidden'>
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className='text-[11px] text-muted-foreground'>
                    Strength:{' '}
                    <span className='font-medium text-foreground/80'>
                      {strength.label}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className='space-y-2'>
              <Label className='text-xs font-medium'>
                Confirm New Password
              </Label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm new password'
                  className='pl-9 pr-10 bg-surface-2 border-border/50 focus:border-primary/50 h-10 text-sm'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirm(!showConfirm)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                >
                  {showConfirm ? (
                    <EyeOff className='h-3.5 w-3.5' />
                  ) : (
                    <Eye className='h-3.5 w-3.5' />
                  )}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className='text-[11px] text-destructive'>
                  Passwords do not match
                </p>
              )}
            </div>

            <div className='flex justify-end'>
              <Button
                onClick={handlePasswordChange}
                className='bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5 text-sm'
              >
                <Lock className='h-3.5 w-3.5' />
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two-Factor */}
      <motion.div variants={item}>
        <Card className='glass-card border-border/50'>
          <CardHeader>
            <CardTitle className='text-base'>
              Two-Factor Authentication
            </CardTitle>
            <CardDescription className='text-xs'>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center justify-between p-4 rounded-lg bg-surface-2/30 border border-border/30'>
              <div className='flex items-center gap-3'>
                <div className='p-2 rounded-lg bg-primary/10'>
                  <Shield className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <p className='text-sm font-medium'>Authenticator App</p>
                  <p className='text-xs text-muted-foreground'>
                    {twoFactor
                      ? 'Enabled — your account has extra protection'
                      : 'Use an authenticator app for verification'}
                  </p>
                </div>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Sessions */}
      <motion.div variants={item}>
        <Card className='glass-card border-border/50'>
          <CardHeader>
            <CardTitle className='text-base'>Active Sessions</CardTitle>
            <CardDescription className='text-xs'>
              Manage your logged-in devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {[
                {
                  device: 'Chrome on macOS',
                  location: 'San Francisco, US',
                  current: true,
                  lastActive: 'Now',
                },
                {
                  device: 'Safari on iPhone',
                  location: 'San Francisco, US',
                  current: false,
                  lastActive: '2h ago',
                },
              ].map((session, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between p-3 rounded-lg bg-surface-2/20 border border-border/20'
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-2 h-2 rounded-full ${session.current ? 'bg-primary' : 'bg-muted-foreground/40'}`}
                    />
                    <div>
                      <p className='text-sm font-medium'>
                        {session.device}
                        {session.current && (
                          <span className='ml-2 text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded'>
                            Current
                          </span>
                        )}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {session.location} · {session.lastActive}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-xs text-destructive hover:text-destructive hover:bg-destructive/10 h-7'
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ─── Notification Settings ─── */
function NotificationSettings() {
  const [emailDigest, setEmailDigest] = useState(true);
  const [streakReminder, setStreakReminder] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [discussionReplies, setDiscussionReplies] = useState(true);
  const [problemSuggestions, setProblemSuggestions] = useState(true);
  const [leaderboardUpdates, setLeaderboardUpdates] = useState(false);
  const [newFeatures, setNewFeatures] = useState(true);
  const [contestAlerts, setContestAlerts] = useState(true);
  const [digestFrequency, setDigestFrequency] = useState('daily');

  const handleSave = () => {
    toast.success('Preferences saved', {
      description: 'Your notification preferences have been updated.',
    });
  };

  const notificationGroups = [
    {
      title: 'Activity',
      description: 'Stay updated on your coding progress',
      items: [
        {
          label: 'Streak Reminders',
          description: 'Get reminded to maintain your daily streak',
          checked: streakReminder,
          onChange: setStreakReminder,
        },
        {
          label: 'Problem Suggestions',
          description: 'Personalized problem recommendations',
          checked: problemSuggestions,
          onChange: setProblemSuggestions,
        },
        {
          label: 'Contest Alerts',
          description: 'Upcoming contests and competitions',
          checked: contestAlerts,
          onChange: setContestAlerts,
        },
      ],
    },
    {
      title: 'Social',
      description: 'Notifications from the community',
      items: [
        {
          label: 'Discussion Replies',
          description: 'When someone replies to your discussions',
          checked: discussionReplies,
          onChange: setDiscussionReplies,
        },
        {
          label: 'Leaderboard Updates',
          description: 'Changes in your ranking position',
          checked: leaderboardUpdates,
          onChange: setLeaderboardUpdates,
        },
      ],
    },
    {
      title: 'Email',
      description: 'Control what gets sent to your inbox',
      items: [
        {
          label: 'Email Digest',
          description: 'Summary of your activity and progress',
          checked: emailDigest,
          onChange: setEmailDigest,
        },
        {
          label: 'Weekly Report',
          description: 'Detailed weekly performance report',
          checked: weeklyReport,
          onChange: setWeeklyReport,
        },
        {
          label: 'New Features & Updates',
          description: 'Product updates and new features',
          checked: newFeatures,
          onChange: setNewFeatures,
        },
      ],
    },
  ];

  return (
    <motion.div
      variants={container}
      initial='hidden'
      animate='show'
      className='space-y-6'
    >
      {notificationGroups.map((group, gi) => (
        <motion.div key={gi} variants={item}>
          <Card className='glass-card border-border/50'>
            <CardHeader>
              <CardTitle className='text-base'>{group.title}</CardTitle>
              <CardDescription className='text-xs'>
                {group.description}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-1'>
              {group.items.map((notif, ni) => (
                <div key={ni}>
                  <div className='flex items-center justify-between py-3'>
                    <div>
                      <p className='text-sm font-medium'>{notif.label}</p>
                      <p className='text-xs text-muted-foreground'>
                        {notif.description}
                      </p>
                    </div>
                    <Switch
                      checked={notif.checked}
                      onCheckedChange={notif.onChange}
                    />
                  </div>
                  {ni < group.items.length - 1 && (
                    <Separator className='bg-border/20' />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Digest frequency */}
      <motion.div variants={item}>
        <Card className='glass-card border-border/50'>
          <CardHeader>
            <CardTitle className='text-base'>Digest Frequency</CardTitle>
            <CardDescription className='text-xs'>
              How often you receive email digests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={digestFrequency} onValueChange={setDigestFrequency}>
              <SelectTrigger className='w-full sm:w-48 bg-surface-2 border-border/50 h-10 text-sm'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='realtime'>Real-time</SelectItem>
                <SelectItem value='daily'>Daily</SelectItem>
                <SelectItem value='weekly'>Weekly</SelectItem>
                <SelectItem value='never'>Never</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </motion.div>

      {/* Save */}
      <motion.div variants={item} className='flex justify-end'>
        <Button
          onClick={handleSave}
          className='bg-primary hover:bg-primary/90 text-primary-foreground font-medium gap-1.5'
        >
          <Save className='h-4 w-4' />
          Save Preferences
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ─── Account Settings ─── */
function AccountSettings() {
  const [language, setLanguage] = useState('python');
  const [theme, setTheme] = useState('dark');
  const [editorFontSize, setEditorFontSize] = useState('14');

  return (
    <motion.div
      variants={container}
      initial='hidden'
      animate='show'
      className='space-y-6'
    >
      {/* Coding Preferences */}
      <motion.div variants={item}>
        <Card className='glass-card border-border/50'>
          <CardHeader>
            <CardTitle className='text-base'>Coding Preferences</CardTitle>
            <CardDescription className='text-xs'>
              Customize your coding experience
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-5'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
              <div className='space-y-2'>
                <Label className='text-xs font-medium'>Default Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className='bg-surface-2 border-border/50 h-10 text-sm'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='python'>Python</SelectItem>
                    <SelectItem value='javascript'>JavaScript</SelectItem>
                    <SelectItem value='java'>Java</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label className='text-xs font-medium'>Editor Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className='bg-surface-2 border-border/50 h-10 text-sm'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='dark'>Dark</SelectItem>
                    <SelectItem value='light'>Light</SelectItem>
                    <SelectItem value='monokai'>Monokai</SelectItem>
                    <SelectItem value='dracula'>Dracula</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label className='text-xs font-medium'>Font Size</Label>
                <Select
                  value={editorFontSize}
                  onValueChange={setEditorFontSize}
                >
                  <SelectTrigger className='bg-surface-2 border-border/50 h-10 text-sm'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='12'>12px</SelectItem>
                    <SelectItem value='14'>14px</SelectItem>
                    <SelectItem value='16'>16px</SelectItem>
                    <SelectItem value='18'>18px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Export */}
      <motion.div variants={item}>
        <Card className='glass-card border-border/50'>
          <CardHeader>
            <CardTitle className='text-base'>Data & Privacy</CardTitle>
            <CardDescription className='text-xs'>
              Export or manage your data
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between p-4 rounded-lg bg-surface-2/20 border border-border/20'>
              <div>
                <p className='text-sm font-medium'>Export Your Data</p>
                <p className='text-xs text-muted-foreground'>
                  Download all your submissions, progress, and profile data
                </p>
              </div>
              <Button
                variant='outline'
                size='sm'
                className='border-border/50 text-xs'
              >
                Export
              </Button>
            </div>
            <div className='flex items-center justify-between p-4 rounded-lg bg-surface-2/20 border border-border/20'>
              <div>
                <p className='text-sm font-medium'>Profile Visibility</p>
                <p className='text-xs text-muted-foreground'>
                  Control who can see your profile and activity
                </p>
              </div>
              <Select defaultValue='public'>
                <SelectTrigger className='w-28 bg-surface-2 border-border/50 h-8 text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='public'>Public</SelectItem>
                  <SelectItem value='friends'>Friends</SelectItem>
                  <SelectItem value='private'>Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={item}>
        <Card className='glass-card border-destructive/30'>
          <CardHeader>
            <CardTitle className='text-base text-destructive flex items-center gap-2'>
              <AlertTriangle className='h-4 w-4' />
              Danger Zone
            </CardTitle>
            <CardDescription className='text-xs'>
              Irreversible actions
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20'>
              <div>
                <p className='text-sm font-medium'>Delete Account</p>
                <p className='text-xs text-muted-foreground'>
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button
                variant='outline'
                size='sm'
                className='border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive text-xs gap-1.5'
              >
                <Trash2 className='h-3.5 w-3.5' />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
