import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';

import { Button } from '@/components/ui/button';
import {
  Code2,
  LayoutDashboard,
  ListChecks,
  // MessageSquare,
  Trophy,
  BookOpen,
  // Map,
  Menu,
  X,
  LogIn,
  User,
  Settings,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { logout } from '@/features/auth/authSlice';
import { useTheme } from '../ThemeContext';

const navItems = [
  { label: 'Problems', href: '/problems', icon: ListChecks },
  { label: 'Sheets', href: '/sheets', icon: BookOpen },
  // { label: 'Roadmaps', href: '/roadmaps', icon: Map },
  // { label: 'Discussions', href: '/discussions', icon: MessageSquare },
  { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const { isAuthenticated, username, email, role } = useSelector(
    (state: RootState) => state.auth,
  );
  const isAdmin = role === 'ADMIN';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setMobileOpen(false);
  };

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
  const themeLabel =
    theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'System';

  // Initials for avatar
  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : email
      ? email.slice(0, 2).toUpperCase()
      : 'U';

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

        {/* Right side */}
        <div className='hidden md:flex items-center gap-3'>
          {/* Theme toggle */}
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 rounded-full text-muted-foreground hover:text-foreground'
            onClick={cycleTheme}
            title={`Theme: ${themeLabel}`}
          >
            <ThemeIcon className='h-4 w-4' />
          </Button>

          {!isAuthenticated ? (
            /* ── Guest ── */
            <>
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
            </>
          ) : (
            /* ── Authenticated (user or admin) ── */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'>
                  <Avatar className='h-8 w-8 border border-border/50 hover:border-primary/30 transition-all'>
                    <AvatarFallback className='bg-primary/10 text-primary text-xs font-semibold'>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='w-52 bg-card border-border/50'
              >
                {/* User info header */}
                <div className='px-2 py-2 border-b border-border/30 mb-1'>
                  <p className='text-sm font-medium text-foreground truncate'>
                    {username}
                  </p>
                  <p className='text-xs text-muted-foreground truncate'>
                    {email}
                  </p>
                  {isAdmin && (
                    <span className='inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full'>
                      <ShieldCheck className='h-2.5 w-2.5' />
                      Admin
                    </span>
                  )}
                </div>

                <DropdownMenuItem asChild className='text-sm cursor-pointer'>
                  <Link to='/profile' className='flex items-center gap-2'>
                    <User className='h-3.5 w-3.5' />
                    Profile
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild className='text-sm cursor-pointer'>
                  <Link to='/settings' className='flex items-center gap-2'>
                    <Settings className='h-3.5 w-3.5' />
                    Settings
                  </Link>
                </DropdownMenuItem> */}

                {/* Admin-only link */}
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator className='bg-border/30' />
                    <DropdownMenuItem
                      asChild
                      className='text-sm cursor-pointer'
                    >
                      <Link to='/admin' className='flex items-center gap-2'>
                        <ShieldCheck className='h-3.5 w-3.5 text-primary' />
                        <span className='text-primary font-medium'>
                          Admin Panel
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator className='bg-border/30' />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className='text-sm text-destructive cursor-pointer flex items-center gap-2'
                >
                  <LogOut className='h-3.5 w-3.5' />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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

            <div className='pt-3 border-t border-border/50 space-y-2'>
              {/* Theme */}
              <Button
                variant='outline'
                size='sm'
                className='w-full flex items-center gap-2'
                onClick={cycleTheme}
              >
                <ThemeIcon className='h-4 w-4' />
                {themeLabel} theme
              </Button>

              {!isAuthenticated ? (
                /* ── Guest mobile ── */
                <div className='flex gap-2'>
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
              ) : (
                /* ── Authenticated mobile ── */
                <div className='space-y-1'>
                  {/* User info */}
                  <div className='flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-1'>
                    <Avatar className='h-8 w-8 border border-border/50'>
                      <AvatarFallback className='bg-primary/10 text-primary text-xs font-semibold'>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className='min-w-0'>
                      <p className='text-sm font-medium text-foreground truncate'>
                        {username}
                      </p>
                      <p className='text-xs text-muted-foreground truncate'>
                        {email}
                      </p>
                    </div>
                    {isAdmin && (
                      <span className='ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full shrink-0'>
                        <ShieldCheck className='h-2.5 w-2.5' />
                        Admin
                      </span>
                    )}
                  </div>

                  <Link
                    to='/profile'
                    onClick={() => setMobileOpen(false)}
                    className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all'
                  >
                    <User className='h-4 w-4' />
                    Profile
                  </Link>
                  <Link
                    to='/settings'
                    onClick={() => setMobileOpen(false)}
                    className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all'
                  >
                    <Settings className='h-4 w-4' />
                    Settings
                  </Link>

                  {isAdmin && (
                    <Link
                      to='/admin'
                      onClick={() => setMobileOpen(false)}
                      className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-primary font-medium hover:bg-primary/10 transition-all'
                    >
                      <ShieldCheck className='h-4 w-4' />
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-all'
                  >
                    <LogOut className='h-4 w-4' />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
