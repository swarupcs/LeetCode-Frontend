import { Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
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
  );
}
