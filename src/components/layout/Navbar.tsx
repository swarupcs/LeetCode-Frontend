import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Code2,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Trophy,
  BookOpen,
  Map,
  Menu,
  X,
  LogIn,
  User,
  Settings,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/ThemeProvider';

const navItems = [
  { label: 'Problems', href: '/problems', icon: ListChecks },
  { label: 'Sheets', href: '/sheets', icon: BookOpen },
  { label: 'Roadmaps', href: '/roadmaps', icon: Map },
  { label: 'Discussions', href: '/discussions', icon: MessageSquare },
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  const themeLabel =
    theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System';

  return (
    <nav className='sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2.5 group'>
          <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:glow-emerald transition-all duration-300'>
            <Code2 className='h-5 w-5 text-primary' />
          </div>
          <span className='text-xl font-bold tracking-tight'>
            <span className='gradient-text'>Algo</span>
            <span className='text-foreground'>Drill</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className='hidden md:flex items-center gap-1'>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <item.icon className='h-4 w-4' />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Auth & theme buttons */}
        <div className='hidden md:flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 rounded-full text-muted-foreground hover:text-foreground'
            onClick={cycleTheme}
            title={`Theme: ${themeLabel}`}
          >
            <ThemeIcon className='h-4 w-4' />
          </Button>
          <Link to='/login'>
            <Button
              variant='ghost'
              size='sm'
              className='text-muted-foreground hover:text-foreground'
            >
              <LogIn className='h-4 w-4 mr-2' />
              Sign In
            </Button>
          </Link>
          <Link to='/signup'>
            <Button
              size='sm'
              className='bg-primary hover:bg-primary/90 text-primary-foreground font-medium'
            >
              Get Started
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full bg-surface-2 border border-border/50 hover:border-primary/30 transition-all'
              >
                <User className='h-4 w-4 text-muted-foreground' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-44 bg-card border-border/50'
            >
              <DropdownMenuItem asChild className='text-sm cursor-pointer'>
                <Link to='/profile' className='flex items-center gap-2'>
                  <User className='h-3.5 w-3.5' />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className='text-sm cursor-pointer'>
                <Link to='/settings' className='flex items-center gap-2'>
                  <Settings className='h-3.5 w-3.5' />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className='text-sm cursor-pointer'>
                <Link to='/admin' className='flex items-center gap-2'>
                  <ListChecks className='h-3.5 w-3.5' />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className='bg-border/30' />
              <DropdownMenuItem className='text-sm text-destructive cursor-pointer'>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile toggle */}
        <button
          className='md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50'
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className='h-5 w-5' />
          ) : (
            <Menu className='h-5 w-5' />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className='md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl animate-fade-in'>
          <div className='px-4 py-4 space-y-1'>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <item.icon className='h-4 w-4' />
                  {item.label}
                </Link>
              );
            })}
            <div className='pt-3 border-t border-border/50 flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='flex items-center gap-2'
                onClick={cycleTheme}
              >
                <ThemeIcon className='h-4 w-4' />
                {themeLabel}
              </Button>
              <Link
                to='/login'
                className='flex-1'
                onClick={() => setMobileOpen(false)}
              >
                <Button variant='outline' size='sm' className='w-full'>
                  Sign In
                </Button>
              </Link>
              <Link
                to='/signup'
                className='flex-1'
                onClick={() => setMobileOpen(false)}
              >
                <Button
                  size='sm'
                  className='w-full bg-primary text-primary-foreground'
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
