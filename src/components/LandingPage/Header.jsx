import { Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function Header() {
  return (
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
              className='mr-2 border-premium-blue/50 bg-premium-darker premium-blue text-white hover:bg-premium-blue/20 hover:text-premium-cyan'
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
  );
}
