import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ListChecks,
  BookOpen,
  Map,
  Settings,
  ShieldCheck,
  ChevronLeft,
  Users,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Problems',
    href: '/admin/problems',
    icon: ListChecks,
  },
  {
    label: 'Sheets',
    href: '/admin/sheets',
    icon: BookOpen,
  },
  {
    label: 'Roadmaps',
    href: '/admin/roadmaps',
    icon: Map,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
  },
];

export function AdminLayout() {
  const location = useLocation();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <div className='min-h-[calc(100vh-4rem)] flex'>
      {/* Sidebar */}
      <aside className='hidden md:flex w-60 flex-col border-r border-border/50 bg-surface-1/50'>
        {/* Sidebar header */}
        <div className='p-4 border-b border-border/50'>
          <div className='flex items-center gap-2.5'>
            <div className='p-1.5 rounded-lg bg-primary/10 border border-primary/20'>
              <ShieldCheck className='h-5 w-5 text-primary' />
            </div>
            <div>
              <h2 className='text-sm font-bold text-foreground'>Admin Panel</h2>
              <p className='text-[10px] text-muted-foreground'>
                Platform management
              </p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className='flex-1 p-3 space-y-1'>
          {sidebarItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-2',
                )}
              >
                <item.icon className='h-4 w-4' />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className='p-3 border-t border-border/50'>
          <Link
            to='/'
            className='flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors'
          >
            <ChevronLeft className='h-3.5 w-3.5' />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/95 backdrop-blur-xl'>
        <div className='flex items-center justify-around py-2'>
          {sidebarItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-[10px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <item.icon className='h-4 w-4' />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className='flex-1 overflow-y-auto pb-20 md:pb-0'>
        <Outlet />
      </main>
    </div>
  );
}
