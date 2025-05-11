
import {
  ArrowRight,
  Code,
  Users,
  Trophy,
  Zap,
  Github,
  CheckCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';


export default function Homepage() {
  return (
    <div className='flex min-h-screen flex-col bg-premium-darker text-white'>
      <header className='sticky top-0 z-40 w-full border-b border-premium-blue/20 bg-premium-darker/95 backdrop-blur supports-[backdrop-filter]:bg-premium-darker/60'>
        <div className='container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0'>
          <div className='flex gap-2 items-center text-xl font-bold'>
            <Code className='h-6 w-6 text-premium-cyan' />
            <span className='premium-text-gradient'>algodrill</span>
          </div>
          <div className='flex flex-1 items-center justify-end space-x-4'>
            <nav className='flex items-center space-x-4'>
              <Link
                to='/features'
                className='hidden text-sm font-medium text-gray-400 transition-colors hover:text-premium-cyan sm:block'
              >
                Features
              </Link>
              <Link
                to='/how-it-works'
                className='hidden text-sm font-medium text-gray-400 transition-colors hover:text-premium-cyan sm:block'
              >
                How It Works
              </Link>
              <Link
                to='/pricing'
                className='hidden text-sm font-medium text-gray-400 transition-colors hover:text-premium-cyan sm:block'
              >
                Pricing
              </Link>
              <Button
                variant='outline'
                size='sm'
                className='mr-2 border-premium-blue/50 bg-premium-darker text-white hover:bg-premium-blue/20 hover:text-premium-cyan'
              >
                Log In
              </Button>
              <Button
                size='sm'
                className='bg-premium-purple hover:bg-premium-highlight text-white'
              >
                Sign Up
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-radial from-premium-blue/20 to-transparent opacity-30'></div>
          <div className='container px-4 md:px-6 relative z-10'>
            <div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]'>
              <div className='flex flex-col justify-center space-y-4'>
                <div className='space-y-2'>
                  <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
                    <span className='premium-text-gradient'>
                      Master Coding Challenges
                    </span>{' '}
                    <br />
                    Ace Your Interviews.
                  </h1>
                  <p className='max-w-[600px] text-gray-400 md:text-xl'>
                    Practice with thousands of coding challenges, prepare for
                    technical interviews, and join a community of developers
                    improving their skills together.
                  </p>
                </div>
                <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                  <Button
                    size='lg'
                    className='gap-1 bg-premium-purple hover:bg-premium-highlight text-white'
                  >
                    Start Coding Now <ArrowRight className='h-4 w-4' />
                  </Button>
                  <Button
                    size='lg'
                    variant='outline'
                    className='border-premium-blue/50 bg-premium-darker text-white hover:bg-premium-blue/20 hover:text-premium-cyan'
                  >
                    Explore Challenges
                  </Button>
                </div>
                <div className='flex items-center space-x-4 text-sm'>
                  <div className='flex items-center gap-1'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>1000+ Problems</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>Daily Challenges</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>Multiple Languages</span>
                  </div>
                </div>
              </div>
              <div className='flex items-center justify-center'>
                <div className='premium-border-gradient w-full h-[350px] overflow-hidden rounded-lg bg-premium-dark p-2 code-glow'>
                  <div className='absolute top-0 left-0 right-0 h-10 bg-premium-dark flex items-center px-4 gap-1'>
                    <div className='w-3 h-3 rounded-full bg-red-500'></div>
                    <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
                    <div className='w-3 h-3 rounded-full bg-green-500'></div>
                    <div className='ml-4 text-xs text-gray-400'>
                      Problem: Two Sum
                    </div>
                  </div>
                  <div className='mt-10 p-4 text-xs font-mono'>
                    <pre className='text-sm'>
                      <code className='text-gray-300'>
                        {`function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
      if (map.has(complement)) {
        return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  return null;
}`}
                      </code>
                    </pre>
                    <div className='mt-4 p-2 bg-premium-blue/20 rounded-md'>
                      <p className='text-green-400'>✓ All test cases passed!</p>
                      <p className='text-xs text-gray-400 mt-1'>
                        Runtime: 76ms (faster than 92% of submissions)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id='features'
          className='w-full py-12 md:py-24 lg:py-32 bg-premium-dark relative'
        >
          <div className='absolute inset-0 bg-gradient-to-b from-premium-blue/5 to-transparent'></div>
          <div className='container px-4 md:px-6 relative z-10'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <div className='inline-block rounded-lg bg-premium-purple px-3 py-1 text-sm text-white'>
                  Features
                </div>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                  <span className='premium-text-gradient'>
                    Everything You Need to Excel
                  </span>
                </h2>
                <p className='max-w-[700px] text-gray-400 md:text-xl'>
                  Our platform provides all the tools and resources you need to
                  become a better programmer and ace your technical interviews.
                </p>
              </div>
            </div>
            <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3'>
              <div className='flex flex-col items-center space-y-2 rounded-lg border border-premium-blue/20 bg-premium-darker p-6 shadow-lg hover:border-premium-purple/50 transition-all duration-300'>
                <div className='rounded-full bg-premium-purple/10 p-3'>
                  <Code className='h-6 w-6 text-premium-cyan' />
                </div>
                <h3 className='text-xl font-bold'>1000+ Coding Problems</h3>
                <p className='text-center text-gray-400'>
                  Practice with a vast library of problems across different
                  difficulty levels and categories.
                </p>
              </div>
              <div className='flex flex-col items-center space-y-2 rounded-lg border border-premium-blue/20 bg-premium-darker p-6 shadow-lg hover:border-premium-purple/50 transition-all duration-300'>
                <div className='rounded-full bg-premium-purple/10 p-3'>
                  <Zap className='h-6 w-6 text-premium-cyan' />
                </div>
                <h3 className='text-xl font-bold'>
                  Interactive Coding Environment
                </h3>
                <p className='text-center text-gray-400'>
                  Code directly in your browser with support for multiple
                  programming languages and real-time feedback.
                </p>
              </div>
              <div className='flex flex-col items-center space-y-2 rounded-lg border border-premium-blue/20 bg-premium-darker p-6 shadow-lg hover:border-premium-purple/50 transition-all duration-300'>
                <div className='rounded-full bg-premium-purple/10 p-3'>
                  <Users className='h-6 w-6 text-premium-cyan' />
                </div>
                <h3 className='text-xl font-bold'>Community Discussions</h3>
                <p className='text-center text-gray-400'>
                  Learn from others by exploring different approaches and
                  explanations for each problem.
                </p>
              </div>
              <div className='flex flex-col items-center space-y-2 rounded-lg border border-premium-blue/20 bg-premium-darker p-6 shadow-lg hover:border-premium-purple/50 transition-all duration-300'>
                <div className='rounded-full bg-premium-purple/10 p-3'>
                  <Trophy className='h-6 w-6 text-premium-cyan' />
                </div>
                <h3 className='text-xl font-bold'>Contests & Leaderboards</h3>
                <p className='text-center text-gray-400'>
                  Participate in weekly coding contests and see how you rank
                  against other programmers.
                </p>
              </div>
              <div className='flex flex-col items-center space-y-2 rounded-lg border border-premium-blue/20 bg-premium-darker p-6 shadow-lg hover:border-premium-purple/50 transition-all duration-300'>
                <div className='rounded-full bg-premium-purple/10 p-3'>
                  <Github className='h-6 w-6 text-premium-cyan' />
                </div>
                <h3 className='text-xl font-bold'>Progress Tracking</h3>
                <p className='text-center text-gray-400'>
                  Track your progress over time with detailed statistics and
                  performance metrics.
                </p>
              </div>
              <div className='flex flex-col items-center space-y-2 rounded-lg border border-premium-blue/20 bg-premium-darker p-6 shadow-lg hover:border-premium-purple/50 transition-all duration-300'>
                <div className='rounded-full bg-premium-purple/10 p-3'>
                  <Users className='h-6 w-6 text-premium-cyan' />
                </div>
                <h3 className='text-xl font-bold'>Mock Interviews</h3>
                <p className='text-center text-gray-400'>
                  Prepare for technical interviews with realistic mock interview
                  sessions and feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id='how-it-works'
          className='w-full py-12 md:py-24 lg:py-32 bg-premium-darker relative'
        >
          <div className='absolute inset-0 bg-gradient-to-t from-premium-blue/5 to-transparent'></div>
          <div className='container px-4 md:px-6 relative z-10'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <div className='inline-block rounded-lg bg-premium-purple px-3 py-1 text-sm text-white'>
                  How It Works
                </div>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                  <span className='premium-text-gradient'>
                    Simple. Effective. Rewarding.
                  </span>
                </h2>
                <p className='max-w-[700px] text-gray-400 md:text-xl'>
                  Our platform is designed to make your coding practice
                  efficient and enjoyable.
                </p>
              </div>
            </div>
            <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3'>
              <div className='flex flex-col items-center space-y-4 rounded-lg p-6 relative'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-premium-purple text-xl font-bold text-white animate-glow'>
                  1
                </div>
                <div className='h-full w-px bg-gradient-to-b from-premium-purple to-transparent absolute -bottom-6 left-1/2 transform -translate-x-1/2 md:hidden'></div>
                <h3 className='text-xl font-bold'>Choose a Problem</h3>
                <p className='text-center text-gray-400'>
                  Browse our extensive library of coding challenges filtered by
                  difficulty, topic, or company.
                </p>
              </div>
              <div className='flex flex-col items-center space-y-4 rounded-lg p-6 relative'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-premium-purple text-xl font-bold text-white animate-glow'>
                  2
                </div>
                <div className='h-full w-px bg-gradient-to-b from-premium-purple to-transparent absolute -bottom-6 left-1/2 transform -translate-x-1/2 md:hidden'></div>
                <h3 className='text-xl font-bold'>Solve & Submit</h3>
                <p className='text-center text-gray-400'>
                  Write your solution in our interactive coding environment and
                  submit it to see if it passes all test cases.
                </p>
              </div>
              <div className='flex flex-col items-center space-y-4 rounded-lg p-6'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-premium-purple text-xl font-bold text-white animate-glow'>
                  3
                </div>
                <h3 className='text-xl font-bold'>Learn & Improve</h3>
                <p className='text-center text-gray-400'>
                  Review other solutions, participate in discussions, and track
                  your progress as you improve.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id='pricing'
          className='w-full py-12 md:py-24 lg:py-32 bg-premium-dark relative'
        >
          <div className='absolute inset-0 bg-gradient-to-b from-premium-blue/5 to-transparent'></div>
          <div className='container px-4 md:px-6 relative z-10'>
            <div className='flex flex-col items-center justify-center space-y-4 text-center'>
              <div className='space-y-2'>
                <div className='inline-block rounded-lg bg-premium-purple px-3 py-1 text-sm text-white'>
                  Pricing
                </div>
                <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                  <span className='premium-text-gradient'>
                    Simple, Transparent Pricing
                  </span>
                </h2>
                <p className='max-w-[700px] text-gray-400 md:text-xl'>
                  Choose the plan that's right for you and start improving your
                  coding skills today.
                </p>
              </div>
            </div>
            <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3'>
              <div className='flex flex-col rounded-lg border border-premium-blue/20 bg-premium-darker p-6 shadow-lg'>
                <div className='space-y-2'>
                  <h3 className='text-2xl font-bold'>Free</h3>
                  <p className='text-gray-400'>Perfect for getting started</p>
                </div>
                <div className='mt-4 space-y-2'>
                  <div className='text-4xl font-bold'>$0</div>
                  <p className='text-gray-400'>Forever free</p>
                </div>
                <ul className='mt-6 space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>100+ Basic Problems</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>Community Discussions</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>Basic Progress Tracking</span>
                  </li>
                </ul>
                <div className='mt-6'>
                  <Button className='w-full bg-premium-blue hover:bg-premium-purple text-white'>
                    Get Started
                  </Button>
                </div>
              </div>
              <div className='flex flex-col rounded-lg border border-premium-purple/50 bg-premium-darker p-6 shadow-lg relative'>
                <div className='absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-premium-purple px-3 py-1 text-xs font-medium text-white'>
                  Most Popular
                </div>
                <div className='space-y-2'>
                  <h3 className='text-2xl font-bold'>Pro</h3>
                  <p className='text-gray-400'>For serious programmers</p>
                </div>
                <div className='mt-4 space-y-2'>
                  <div className='text-4xl font-bold premium-text-gradient'>
                    $15
                  </div>
                  <p className='text-gray-400'>per month</p>
                </div>
                <ul className='mt-6 space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>All Free Features</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>1000+ Advanced Problems</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>Company-specific Questions</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>Advanced Analytics</span>
                  </li>
                </ul>
                <div className='mt-6'>
                  <Button className='w-full bg-premium-purple hover:bg-premium-highlight text-white'>
                    Subscribe
                  </Button>
                </div>
              </div>
              <div className='flex flex-col rounded-lg border border-premium-blue/20 bg-premium-darker p-6 shadow-lg'>
                <div className='space-y-2'>
                  <h3 className='text-2xl font-bold'>Enterprise</h3>
                  <p className='text-gray-400'>For teams and companies</p>
                </div>
                <div className='mt-4 space-y-2'>
                  <div className='text-4xl font-bold'>Custom</div>
                  <p className='text-gray-400'>Contact for pricing</p>
                </div>
                <ul className='mt-6 space-y-2 text-sm'>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>All Pro Features</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>Team Management</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>Custom Problem Sets</span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <CheckCircle className='h-4 w-4 text-premium-cyan' />
                    <span>Dedicated Support</span>
                  </li>
                </ul>
                <div className='mt-6'>
                  <Button className='w-full bg-premium-blue hover:bg-premium-purple text-white'>
                    Contact Sales
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='w-full py-12 md:py-24 lg:py-32 bg-premium-darker relative'>
          <div className='absolute inset-0 bg-gradient-to-t from-premium-blue/5 to-transparent'></div>
          <div className='container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10 relative z-10'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter md:text-4xl/tight'>
                <span className='premium-text-gradient'>
                  Ready to level up your coding skills?
                </span>
              </h2>
              <p className='max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Join thousands of developers who are improving their skills and
                landing their dream jobs.
              </p>
            </div>
            <div className='flex flex-col gap-2 min-[400px]:flex-row lg:justify-end'>
              <Button
                size='lg'
                className='gap-1 bg-premium-purple hover:bg-premium-highlight text-white'
              >
                Start Coding Now <ArrowRight className='h-4 w-4' />
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='border-premium-blue/50 bg-premium-darker text-white hover:bg-premium-blue/20 hover:text-premium-cyan'
              >
                View Demo
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className='w-full border-t border-premium-blue/20 py-6 md:py-0 bg-premium-dark'>
        <div className='container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row'>
          <div className='flex gap-2 items-center text-lg font-bold'>
            <Code className='h-5 w-5 text-premium-cyan' />
            <span className='premium-text-gradient'>algodrill</span>
          </div>
          <p className='text-center text-sm leading-loose text-gray-400 md:text-left'>
            © {new Date().getFullYear()} algodrill. All rights reserved.
          </p>
          <div className='flex gap-4'>
            <Link
              to='/'
              className='text-sm text-gray-400 underline-offset-4 hover:text-premium-cyan hover:underline'
            >
              Terms
            </Link>
            <Link
              to='/'
              className='text-sm text-gray-400 underline-offset-4 hover:text-premium-cyan hover:underline'
            >
              Privacy
            </Link>
            <Link
              to='/'
              className='text-sm text-gray-400 underline-offset-4 hover:text-premium-cyan hover:underline'
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
