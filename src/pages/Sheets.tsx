import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Target, ArrowRight, Loader2 } from 'lucide-react';

import type { Sheet } from '@/types/sheet.types';
import { useGetAllSheetDetails } from '@/hooks/sheets/useGetAllSheetDetails';

export default function SheetsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { sheets, isLoading, isError, error } = useGetAllSheetDetails();

  // console.log('sheets', sheets);

  const filteredSheets = useMemo(() => {
    return sheets.filter(
      (s) =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, sheets]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-destructive text-sm'>
          {error?.message ?? 'Failed to load sheets. Please try again.'}
        </p>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <h1 className='text-3xl font-bold mb-2 flex items-center gap-3'>
            <BookOpen className='h-8 w-8 text-primary' />
            Problem Sheets
          </h1>
          <p className='text-muted-foreground'>
            {sheets.length} sheets available
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'
        >
          <div className='glass-card p-4 text-center'>
            <div className='text-2xl font-bold text-foreground'>
              {sheets.length}
            </div>
            <div className='text-xs text-muted-foreground mt-1'>
              Total Sheets
            </div>
          </div>
          <div className='glass-card p-4 text-center'>
            <div className='text-2xl font-bold text-primary'>
              {sheets.reduce((acc, s) => acc + (s.totalProblems ?? 0), 0)}
            </div>
            <div className='text-xs text-muted-foreground mt-1'>
              Total Problems
            </div>
          </div>
          <div className='glass-card p-4 text-center col-span-2 md:col-span-1'>
            <div className='text-2xl font-bold text-[hsl(var(--emerald))]'>
              {sheets.reduce((acc, s) => acc + (s.solvedProblems ?? 0), 0)}
            </div>
            <div className='text-xs text-muted-foreground mt-1'>
              Total Solved
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className='mb-6'
        >
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search sheets by title or description...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 bg-surface-1 border-border/50 h-10'
            />
          </div>
        </motion.div>

        {/* Empty State */}
        {filteredSheets.length === 0 && (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <Search className='h-10 w-10 text-muted-foreground mb-3' />
            <p className='text-muted-foreground text-sm'>
              No sheets found matching{' '}
              <span className='text-foreground font-medium'>
                "{searchQuery}"
              </span>
            </p>
          </div>
        )}

        {/* Sheets Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredSheets.map((sheet: Sheet, i: number) => {
            const progress =
              sheet.totalProblems > 0
                ? Math.round((sheet.solvedProblems / sheet.totalProblems) * 100)
                : 0;

            return (
              <motion.div
                key={sheet._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <Link to={`/sheets/${sheet._id}`} className='block h-full'>
                  <Card className='glass-card border-border/50 group hover:border-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col'>
                    <CardHeader className='pb-3'>
                      <div className='flex items-start justify-between'>
                        <div className='p-2 rounded-lg bg-primary/10 border border-primary/20'>
                          <Target className='h-5 w-5 text-primary' />
                        </div>
                      </div>
                      <CardTitle className='text-lg mt-3 group-hover:text-primary transition-colors'>
                        {sheet.title}
                      </CardTitle>
                      <CardDescription className='text-sm line-clamp-2'>
                        {sheet.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='mt-auto'>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-muted-foreground'>
                            {sheet.solvedProblems}/{sheet.totalProblems} solved
                          </span>
                          <span className='text-primary font-medium'>
                            {progress}%
                          </span>
                        </div>
                        <div className='h-1.5 bg-surface-3 rounded-full overflow-hidden'>
                          <div
                            className='h-full bg-primary rounded-full transition-all duration-500'
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className='flex items-center justify-end mt-4 text-xs text-primary font-medium group-hover:gap-2 transition-all'>
                        <span>Continue</span>
                        <ArrowRight className='h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform' />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
