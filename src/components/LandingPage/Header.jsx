import { Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  // Function to handle scroll to section
  const scrollToSection = (sectionId) => (e) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Offset to account for header height
        behavior: 'smooth',
      });
    }
  };

  // Handle hash links when page loads
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth',
          });
        }, 100);
      }
    }
  }, []);

  return (
    <header className='sticky top-0 z-40 w-full border-b border-premium-blue/20 bg-premium-darker/95 backdrop-blur supports-[backdrop-filter]:bg-premium-darker/60'>
      <div className='container flex h-16 items-center sm:justify-between'>
        {isAuthPage ? (
          // Centered logo for login/signup pages
          <div className='flex justify-center items-center w-full'>
            <Link to='/' className='flex gap-2 items-center text-xl font-bold'>
              <Code className='h-6 w-6 text-premium-cyan' />
              <span className='premium-text-gradient'>algodrill</span>
            </Link>
          </div>
        ) : (
          // Original header layout for other pages
          <>
            <div className='flex gap-2 items-center text-xl font-bold'>
              <Code className='h-6 w-6 text-premium-cyan' />
              <span className='premium-text-gradient'>algodrill</span>
            </div>
            <div className='flex flex-1 items-center justify-end space-x-4'>
              <nav className='flex items-center space-x-4'>
                <a
                  href='#features'
                  onClick={scrollToSection('features')}
                  className='hidden text-sm font-medium text-gray-400 transition-colors hover:text-premium-cyan sm:block cursor-pointer'
                >
                  Features
                </a>
                <a
                  href='#how-it-works'
                  onClick={scrollToSection('how-it-works')}
                  className='hidden text-sm font-medium text-gray-400 transition-colors hover:text-premium-cyan sm:block cursor-pointer'
                >
                  How It Works
                </a>
                <a
                  href='#pricing'
                  onClick={scrollToSection('pricing')}
                  className='hidden text-sm font-medium text-gray-400 transition-colors hover:text-premium-cyan sm:block cursor-pointer'
                >
                  Pricing
                </a>
                <Link to={'/login'}>
                  <Button
                    variant='outline'
                    size='sm'
                    className='mr-2 border-premium-blue/50 bg-premium-darker premium-blue text-white hover:bg-premium-blue/20 hover:text-premium-cyan'
                  >
                    Log In
                  </Button>
                </Link>
                <Link to={'/signup'}>
                  <Button
                    size='sm'
                    className='bg-premium-purple hover:bg-premium-highlight text-white'
                  >
                    Sign Up
                  </Button>
                </Link>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
