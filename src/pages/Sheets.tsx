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
import { BookOpen, Search, Target, ArrowRight } from 'lucide-react';
import { sheets, getSheetStats } from '@/data/sheets';

export default function SheetsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const publishedSheets = useMemo(
    () => sheets.filter((s) => s.isPublished),
    [],
  );

  const sheetsWithStats = useMemo(
    () => publishedSheets.map((s) => ({ ...s, stats: getSheetStats(s) })),
    [publishedSheets],
  );

  const filteredSheets = useMemo(() => {
    return sheetsWithStats.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  }, [searchQuery, sheetsWithStats]);

  const totalProblems = sheetsWithStats.reduce((a, b) => a + b.stats.total, 0);
  const totalSolved = sheetsWithStats.reduce((a, b) => a + b.stats.solved, 0);

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
            {totalSolved} of {totalProblems} problems solved across{' '}
            {publishedSheets.length} sheets
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
              {publishedSheets.length}
            </div>
            <div className='text-xs text-muted-foreground mt-1'>
              Total Sheets
            </div>
          </div>
          <div className='glass-card p-4 text-center'>
            <div className='text-2xl font-bold text-primary'>
              {totalProblems}
            </div>
            <div className='text-xs text-muted-foreground mt-1'>
              Total Problems
            </div>
          </div>
          <div className='glass-card p-4 text-center col-span-2 md:col-span-1'>
            <div className='text-2xl font-bold text-[hsl(var(--emerald))]'>
              {totalProblems > 0
                ? Math.round((totalSolved / totalProblems) * 100)
                : 0}
              %
            </div>
            <div className='text-xs text-muted-foreground mt-1'>Completion</div>
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
              placeholder='Search sheets by title, description, or tag...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 bg-surface-1 border-border/50 h-10'
            />
          </div>
        </motion.div>

        {/* Sheets Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredSheets.map((sheet, i) => {
            const progress =
              sheet.stats.total > 0
                ? Math.round((sheet.stats.solved / sheet.stats.total) * 100)
                : 0;
            return (
              <motion.div
                key={sheet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <Link to={`/sheets/${sheet.id}`} className='block h-full'>
                  <Card className='glass-card border-border/50 group hover:border-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col'>
                    <CardHeader className='pb-3'>
                      <div className='flex items-start justify-between'>
                        <div className='p-2 rounded-lg bg-primary/10 border border-primary/20'>
                          <Target className='h-5 w-5 text-primary' />
                        </div>
                        <Badge
                          variant='outline'
                          className='text-xs border-border/50 text-muted-foreground'
                        >
                          {sheet.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className='text-lg mt-3 group-hover:text-primary transition-colors'>
                        {sheet.name}
                      </CardTitle>
                      <CardDescription className='text-sm line-clamp-2'>
                        {sheet.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='mt-auto'>
                      <div className='flex flex-wrap gap-1 mb-4'>
                        {sheet.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className='text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-muted-foreground'>
                            {sheet.stats.solved}/{sheet.stats.total} solved
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
