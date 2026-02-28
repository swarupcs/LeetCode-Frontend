import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Zap,
  Users,
  BookOpen,
  Trophy,
  BarChart3,
  Terminal,
  Braces,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: Terminal,
    title: 'Interactive Code Editor',
    description:
      'Write, run, and test your solutions in Python, JavaScript, and Java with real-time feedback.',
  },
  {
    icon: BookOpen,
    title: 'Curated Problem Sheets',
    description:
      'Follow structured DSA sheets designed to take you from beginner to interview-ready.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description:
      'Visualize your journey with heatmaps, streaks, and detailed performance analytics.',
  },
  {
    icon: Users,
    title: 'Community Discussions',
    description:
      'Share solutions, discuss approaches, and learn from fellow developers.',
  },
  {
    icon: Trophy,
    title: 'Leaderboard',
    description:
      'Compete with peers and climb the rankings as you solve more problems.',
  },
  {
    icon: Zap,
    title: 'Instant Submissions',
    description:
      'Get immediate feedback on your solutions with comprehensive test case evaluation.',
  },
];

const stats = [
  { value: '500+', label: 'Problems' },
  { value: '50+', label: 'Topics' },
  { value: '10K+', label: 'Submissions' },
  { value: '3', label: 'Languages' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const Index = () => {
  return (
    <div className='relative overflow-hidden'>
      {/* Background effects */}
      <div className='absolute inset-0 dot-pattern opacity-30' />
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-primary/8 via-transparent to-transparent' />

      {/* Hero Section */}
      <section className='relative py-24 sm:py-32 lg:py-40'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className='text-center max-w-4xl mx-auto'
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8'
            >
              <Zap className='h-3.5 w-3.5' />
              Master DSA the right way
              <ChevronRight className='h-3.5 w-3.5' />
            </motion.div>

            <h1 className='text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6'>
              Sharpen your <span className='gradient-text'>algorithms</span>
              <br />
              one drill at a time
            </h1>

            <p className='text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed'>
              Practice coding problems, track your progress, and prepare for
              technical interviews with our curated collection of DSA
              challenges.
            </p>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Link to='/problems'>
                <Button
                  size='lg'
                  className='bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12 text-base glow-emerald'
                >
                  Start Solving
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
              <Link to='/sheets'>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-border/50 text-foreground hover:bg-muted/50 px-8 h-12 text-base'
                >
                  <BookOpen className='mr-2 h-4 w-4' />
                  Browse Sheets
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Code preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className='mt-20 max-w-3xl mx-auto'
          >
            <div className='glass-card overflow-hidden glow-border'>
              <div className='flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-surface-2/50'>
                <div className='flex gap-1.5'>
                  <div className='w-3 h-3 rounded-full bg-destructive/60' />
                  <div className='w-3 h-3 rounded-full bg-amber/60' />
                  <div className='w-3 h-3 rounded-full bg-primary/60' />
                </div>
                <span className='text-xs text-muted-foreground font-mono ml-2'>
                  two_sum.py
                </span>
              </div>
              <div className='p-6 font-mono text-sm leading-relaxed'>
                <div>
                  <span className='text-primary'>def</span>{' '}
                  <span className='text-accent'>two_sum</span>
                  <span className='text-muted-foreground'>(</span>
                  <span className='text-amber'>nums</span>
                  <span className='text-muted-foreground'>,</span>{' '}
                  <span className='text-amber'>target</span>
                  <span className='text-muted-foreground'>):</span>
                </div>
                <div className='pl-6'>
                  <span className='text-muted-foreground'>seen = {'{}'}</span>
                </div>
                <div className='pl-6'>
                  <span className='text-primary'>for</span>{' '}
                  <span className='text-foreground'>i, num</span>{' '}
                  <span className='text-primary'>in</span>{' '}
                  <span className='text-accent'>enumerate</span>
                  <span className='text-muted-foreground'>(</span>
                  <span className='text-amber'>nums</span>
                  <span className='text-muted-foreground'>):</span>
                </div>
                <div className='pl-12'>
                  <span className='text-foreground'>complement</span>{' '}
                  <span className='text-muted-foreground'>=</span>{' '}
                  <span className='text-amber'>target</span>{' '}
                  <span className='text-muted-foreground'>-</span>{' '}
                  <span className='text-foreground'>num</span>
                </div>
                <div className='pl-12'>
                  <span className='text-primary'>if</span>{' '}
                  <span className='text-foreground'>complement</span>{' '}
                  <span className='text-primary'>in</span>{' '}
                  <span className='text-foreground'>seen</span>
                  <span className='text-muted-foreground'>:</span>
                </div>
                <div className='pl-16'>
                  <span className='text-primary'>return</span>{' '}
                  <span className='text-muted-foreground'>[</span>
                  <span className='text-foreground'>seen</span>
                  <span className='text-muted-foreground'>[</span>
                  <span className='text-foreground'>complement</span>
                  <span className='text-muted-foreground'>],</span>{' '}
                  <span className='text-foreground'>i</span>
                  <span className='text-muted-foreground'>]</span>
                </div>
                <div className='pl-12'>
                  <span className='text-foreground'>seen</span>
                  <span className='text-muted-foreground'>[</span>
                  <span className='text-foreground'>num</span>
                  <span className='text-muted-foreground'>]</span>{' '}
                  <span className='text-muted-foreground'>=</span>{' '}
                  <span className='text-foreground'>i</span>
                </div>
                <div className='mt-3 flex items-center gap-2'>
                  <span className='text-primary/80'>✓</span>
                  <span className='text-primary/80 text-xs'>
                    All test cases passed
                  </span>
                  <span className='text-muted-foreground text-xs ml-auto'>
                    Runtime: 4ms · Memory: 15.2MB
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className='relative py-16 border-y border-border/30'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            variants={container}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true }}
            className='grid grid-cols-2 md:grid-cols-4 gap-8'
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={item} className='text-center'>
                <div className='text-3xl sm:text-4xl font-bold gradient-text mb-1'>
                  {stat.value}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className='relative py-24 sm:py-32'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2 className='text-3xl sm:text-4xl font-bold mb-4'>
              Everything you need to{' '}
              <span className='gradient-text'>level up</span>
            </h2>
            <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
              A complete platform designed to make your DSA preparation
              structured, trackable, and enjoyable.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial='hidden'
            whileInView='show'
            viewport={{ once: true }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={item}
                className='glass-card p-6 group hover:border-primary/30 transition-all duration-300'
              >
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-4 group-hover:glow-emerald transition-all duration-300'>
                  <feature.icon className='h-5 w-5 text-primary' />
                </div>
                <h3 className='text-lg font-semibold mb-2'>{feature.title}</h3>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className='relative py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='glass-card p-12 sm:p-16 text-center glow-border'
          >
            <Braces className='h-12 w-12 text-primary mx-auto mb-6' />
            <h2 className='text-3xl sm:text-4xl font-bold mb-4'>
              Ready to start drilling?
            </h2>
            <p className='text-muted-foreground text-lg max-w-xl mx-auto mb-8'>
              Join thousands of developers sharpening their skills. Your next
              interview is waiting.
            </p>
            <Link to='/signup'>
              <Button
                size='lg'
                className='bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 h-12 text-base glow-emerald'
              >
                Create Free Account
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
