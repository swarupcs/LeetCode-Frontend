import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeExample } from './CodeExample';
import { Link } from 'react-router-dom';


export function HeroSection() {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-radial from-premium-blue/20 to-transparent opacity-30'></div>
      <div className='container px-4 md:px-6 relative z-10'>
        <div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]'>
          <div className='flex flex-col justify-center space-y-4'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
                <span className='premium-text-gradient'>
                  Master Coding Challenges.
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
              <Link to={'/problem-set'}>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-premium-blue/50 bg-premium-darker text-white hover:bg-premium-blue/20 hover:text-premium-cyan'
                >
                  Explore Challenges
                </Button>
              </Link>
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
            <CodeExample />
          </div>
        </div>
      </div>
    </section>
  );
}
