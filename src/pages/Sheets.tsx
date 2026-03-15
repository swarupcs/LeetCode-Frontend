// src/pages/SheetsPage.tsx
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
import { BookOpen, Search, Target, ArrowRight } from 'lucide-react';
import type { Sheet } from '@/types/sheet.types';
import { useGetAllSheetDetails } from '@/hooks/sheets/useGetAllSheetDetails';

// ─── Skeleton primitive ───────────────────────────────────────────────────────

function Bone({
  w,
  h = 'h-3',
  rounded = 'rounded-md',
  delay = 0,
  className = '',
}: {
  w: string;
  h?: string;
  rounded?: string;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`${w} ${h} ${rounded} bg-surface-3 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

// ─── Sheet card skeleton ──────────────────────────────────────────────────────

function SkeletonSheetCard({ index }: { index: number }) {
  const base = index * 55;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.05 }}
    >
      <Card className='glass-card border-border/50 h-full flex flex-col'>
        <CardHeader className='pb-3'>
          {/* Icon + difficulty chips */}
          <div className='flex items-start justify-between'>
            <Bone w='w-9' h='h-9' rounded='rounded-lg' delay={base} />
            <div className='flex gap-1'>
              <Bone w='w-10' h='h-5' rounded='rounded' delay={base + 20} />
              <Bone w='w-14' h='h-5' rounded='rounded' delay={base + 35} />
            </div>
          </div>
          {/* Title */}
          <Bone
            w={
              ['w-3/4', 'w-2/3', 'w-4/5', 'w-3/5', 'w-3/4', 'w-2/3'][index % 6]!
            }
            h='h-5'
            rounded='rounded'
            delay={base + 40}
            className='mt-3'
          />
          {/* Description */}
          <div className='space-y-1.5 mt-1'>
            <Bone w='w-full' h='h-3' delay={base + 55} />
            <Bone
              w={['w-4/5', 'w-3/4', 'w-5/6'][index % 3]!}
              h='h-3'
              delay={base + 68}
            />
          </div>
        </CardHeader>
        <CardContent className='mt-auto space-y-3'>
          {/* Tags */}
          <div className='flex flex-wrap gap-1'>
            {Array.from({ length: 3 + (index % 2) }).map((_, j) => (
              <Bone
                key={j}
                w={['w-12', 'w-16', 'w-10', 'w-14'][j % 4]!}
                h='h-4'
                rounded='rounded'
                delay={base + 70 + j * 15}
              />
            ))}
          </div>
          {/* Problems count + author */}
          <div className='flex justify-between'>
            <Bone w='w-24' h='h-3.5' delay={base + 90} />
            <Bone w='w-20' h='h-3.5' delay={base + 105} />
          </div>
          {/* View Sheet link */}
          <div className='flex justify-end'>
            <Bone w='w-20' h='h-3.5' delay={base + 115} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Full page skeleton ───────────────────────────────────────────────────────

function SheetsSkeleton() {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <div className='flex items-center gap-3 mb-2'>
            <Bone w='w-8' h='h-8' rounded='rounded-lg' />
            <Bone w='w-44' h='h-8' rounded='rounded-lg' delay={30} />
          </div>
          <Bone w='w-32' h='h-4' delay={60} />
        </motion.div>

        {/* 3 stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'
        >
          {[0, 80, 160].map((d, i) => (
            <div
              key={i}
              className={`glass-card p-4 text-center ${i === 2 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <Bone w='w-12 mx-auto' h='h-7' rounded='rounded-lg' delay={d} />
              <Bone
                w='w-24 mx-auto'
                h='h-2.5'
                delay={d + 30}
                className='mt-2'
              />
            </div>
          ))}
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className='mb-6'
        >
          <Bone w='w-full' h='h-10' rounded='rounded-xl' delay={160} />
        </motion.div>

        {/* Sheet cards grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonSheetCard key={i} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SheetsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { sheets, isPending, isError, error } = useGetAllSheetDetails();

  const filteredSheets = useMemo(
    () =>
      sheets.filter(
        (s) =>
          s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.allTags?.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      ),
    [searchQuery, sheets],
  );

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isPending) return <SheetsSkeleton />;

  // ── Error ─────────────────────────────────────────────────────────────────
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
              {sheets.reduce((acc, s) => acc + s.totalProblems, 0)}
            </div>
            <div className='text-xs text-muted-foreground mt-1'>
              Total Problems
            </div>
          </div>
          <div className='glass-card p-4 text-center col-span-2 md:col-span-1'>
            <div className='text-2xl font-bold text-[hsl(var(--emerald))]'>
              {sheets.reduce((acc, s) => acc + s.allDifficulties.length, 0)}
            </div>
            <div className='text-xs text-muted-foreground mt-1'>
              Total Difficulties
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
              placeholder='Search sheets by name, description, or tag...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 bg-surface-1 border-border/50 h-10'
            />
          </div>
        </motion.div>

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

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredSheets.map((sheet: Sheet, i: number) => (
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
                      {sheet.allDifficulties.length > 0 && (
                        <div className='flex gap-1 flex-wrap justify-end'>
                          {sheet.allDifficulties.slice(0, 2).map((d) => (
                            <span
                              key={d}
                              className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${d === 'EASY' ? 'difficulty-easy' : d === 'MEDIUM' ? 'difficulty-medium' : 'difficulty-hard'}`}
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <CardTitle className='text-lg mt-3 group-hover:text-primary transition-colors'>
                      {sheet.name}
                    </CardTitle>
                    <CardDescription className='text-sm line-clamp-2'>
                      {sheet.description ?? 'No description provided.'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='mt-auto'>
                    {sheet.allTags.length > 0 && (
                      <div className='flex flex-wrap gap-1 mb-4'>
                        {sheet.allTags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className='text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className='flex justify-between text-sm mb-3'>
                      <span className='text-muted-foreground'>
                        {sheet.totalProblems} problems
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        by {sheet.user.name ?? sheet.user.username ?? 'Unknown'}
                      </span>
                    </div>
                    <div className='flex items-center justify-end mt-2 text-xs text-primary font-medium group-hover:gap-2 transition-all'>
                      <span>View Sheet</span>
                      <ArrowRight className='h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform' />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
