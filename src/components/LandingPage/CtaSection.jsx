import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
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
  );
}
