import { Link } from 'react-router-dom';
import { Code2, 
  // Github, 
  // Twitter 
} from 'lucide-react';

export function Footer() {
  return (
    <footer className='border-t border-border/50 bg-surface-1/50 mt-auto'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='col-span-1 md:col-span-3'>
            <Link to='/' className='flex items-center gap-2.5 mb-4'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20'>
                <Code2 className='h-4 w-4 text-primary' />
              </div>
              <span className='text-lg font-bold'>
                <span className='gradient-text'>Algo</span>
                <span className='text-foreground'>Drill</span>
              </span>
            </Link>
            <p className='text-sm text-muted-foreground max-w-sm'>
              Master algorithms and data structures through interactive coding
              challenges. Level up your problem-solving skills.
            </p>
          </div>

          <div>
            <h4 className='text-sm font-semibold mb-4 text-foreground'>
              Platform
            </h4>
            <ul className='space-y-2.5'>
              {['Problems', 'Sheets', 
              // 'Discussions', 
              // 'Leaderboard'
            ].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to={`/${item.toLowerCase()}`}
                      className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* <div>
            <h4 className='text-sm font-semibold mb-4 text-foreground'>
              Connect
            </h4>
            <div className='flex gap-3'>
              <a
                href='#'
                className='p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all'
              >
                <Github className='h-4 w-4' />
              </a>
              <a
                href='#'
                className='p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all'
              >
                <Twitter className='h-4 w-4' />
              </a>
            </div>
          </div> */}
        </div>

        <div className='mt-10 pt-6 border-t border-border/30 text-center'>
          <p className='text-xs text-muted-foreground'>
            © {new Date().getFullYear()} AlgoDrill. Built for passionate coders.
          </p>
        </div>
      </div>
    </footer>
  );
}
