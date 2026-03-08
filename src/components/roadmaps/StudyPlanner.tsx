import { useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Target,
  Minus,
  Plus,
  BookOpen,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getRoadmapStats, type Roadmap } from '@/data/roadmaps';
import { useGetRoadmaps } from '@/hooks/roadmaps/useGetRoadmaps';
import { useAppSelector } from '@/hooks/redux';
import type { RoadmapWithProgress } from '@/services/roadmap.service';

const STORAGE_KEY = 'study-planner';

interface PlannerData {
  hoursPerDay: number;
  daysPerWeek: number;
  selectedRoadmaps: string[];
}

function loadPlanner(): PlannerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : { hoursPerDay: 2, daysPerWeek: 5, selectedRoadmaps: [] };
  } catch {
    return { hoursPerDay: 2, daysPerWeek: 5, selectedRoadmaps: [] };
  }
}

function savePlanner(data: PlannerData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadProgress(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem('roadmap-progress');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const colorTextMap: Record<string, string> = {
  emerald: 'text-[hsl(var(--emerald))]',
  cyan: 'text-[hsl(var(--cyan))]',
  amber: 'text-[hsl(var(--amber))]',
  rose: 'text-[hsl(var(--rose))]',
};

const colorBgMap: Record<string, string> = {
  emerald: 'bg-[hsl(var(--emerald)/0.1)]',
  cyan: 'bg-[hsl(var(--cyan)/0.1)]',
  amber: 'bg-[hsl(var(--amber)/0.1)]',
  rose: 'bg-[hsl(var(--rose)/0.1)]',
};

export function StudyPlanner() {
  const [expanded, setExpanded] = useState(false);
  const [planner, setPlanner] = useState<PlannerData>(loadPlanner);
  const currentUserId = useAppSelector((state) => state.auth.id);
  const { roadmaps: apiRoadmaps } = useGetRoadmaps();
  const published = apiRoadmaps as unknown as (Roadmap & { completedTopicIds?: string[] })[];

  // For logged-in users, progress comes from the API (completedTopicIds per roadmap).
  // For anonymous users, read from localStorage.
  const progress = useMemo(() => {
    if (currentUserId) {
      return Object.fromEntries(
        (apiRoadmaps as RoadmapWithProgress[]).map((r) => [r.id, r.completedTopicIds ?? []]),
      );
    }
    return loadProgress();
  }, [currentUserId, apiRoadmaps]);

  const update = useCallback((partial: Partial<PlannerData>) => {
    setPlanner((prev) => {
      const next = { ...prev, ...partial };
      savePlanner(next);
      return next;
    });
  }, []);

  const toggleRoadmap = useCallback(
    (id: string) => {
      const selected = planner.selectedRoadmaps.includes(id)
        ? planner.selectedRoadmaps.filter((r) => r !== id)
        : [...planner.selectedRoadmaps, id];
      update({ selectedRoadmaps: selected });
    },
    [planner.selectedRoadmaps, update],
  );

  const activeRoadmaps = useMemo(
    () =>
      planner.selectedRoadmaps.length > 0
        ? published.filter((r) => planner.selectedRoadmaps.includes(r.id))
        : published,
    [planner.selectedRoadmaps, published],
  );

  const stats = useMemo(() => {
    return activeRoadmaps.map((r) => {
      const s = getRoadmapStats(r as unknown as Roadmap);
      const completedIds = progress[r.id] ?? [];
      const allTopicIds = r.sections.flatMap((sec) =>
        sec.topics.map((t) => t.id),
      );
      const done = completedIds.filter((id) => allTopicIds.includes(id)).length;
      const remainingTopics = s.totalTopics - done;
      const avgMinPerTopic =
        s.totalTopics > 0 ? s.totalMinutes / s.totalTopics : 30;
      const remainingMinutes = remainingTopics * avgMinPerTopic;
      return {
        roadmap: r,
        totalHours: Math.round(s.totalMinutes / 60),
        remainingHours: Math.round(remainingMinutes / 60),
        completedPercent:
          s.totalTopics > 0 ? Math.round((done / s.totalTopics) * 100) : 0,
        totalTopics: s.totalTopics,
        completedTopics: done,
        remainingTopics,
      };
    });
  }, [activeRoadmaps, progress]);

  const totalRemainingHours = stats.reduce((a, s) => a + s.remainingHours, 0);
  const weeklyHours = planner.hoursPerDay * planner.daysPerWeek;
  const weeksToComplete =
    weeklyHours > 0 ? Math.ceil(totalRemainingHours / weeklyHours) : Infinity;
  const completionDate = useMemo(() => {
    if (weeksToComplete === Infinity) return null;
    const d = new Date();
    d.setDate(d.getDate() + weeksToComplete * 7);
    return d;
  }, [weeksToComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className='glass-card overflow-hidden'
    >
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className='w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors'
      >
        <div className='flex items-center gap-3'>
          <div className='p-2 rounded-lg bg-primary/10 border border-primary/20'>
            <Calendar className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h3 className='text-sm font-semibold text-foreground'>
              Study Planner
            </h3>
            <p className='text-xs text-muted-foreground'>
              {totalRemainingHours}h remaining · ~
              {weeksToComplete === Infinity ? '∞' : weeksToComplete} week
              {weeksToComplete !== 1 ? 's' : ''} at {weeklyHours}h/week
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          {completionDate && (
            <Badge
              variant='outline'
              className='text-[10px] border-primary/20 text-primary hidden sm:flex'
            >
              Est. finish:{' '}
              {completionDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Badge>
          )}
          {expanded ? (
            <ChevronUp className='h-4 w-4 text-muted-foreground' />
          ) : (
            <ChevronDown className='h-4 w-4 text-muted-foreground' />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='overflow-hidden'
          >
            <div className='px-5 pb-5 space-y-5 border-t border-border/50 pt-4'>
              {/* Schedule config */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-xs text-muted-foreground flex items-center gap-1.5'>
                    <Clock className='h-3 w-3' /> Hours per day
                  </label>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-7 w-7'
                      onClick={() =>
                        update({
                          hoursPerDay: Math.max(0.5, planner.hoursPerDay - 0.5),
                        })
                      }
                      disabled={planner.hoursPerDay <= 0.5}
                    >
                      <Minus className='h-3 w-3' />
                    </Button>
                    <span className='text-sm font-semibold w-10 text-center'>
                      {planner.hoursPerDay}h
                    </span>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-7 w-7'
                      onClick={() =>
                        update({
                          hoursPerDay: Math.min(12, planner.hoursPerDay + 0.5),
                        })
                      }
                      disabled={planner.hoursPerDay >= 12}
                    >
                      <Plus className='h-3 w-3' />
                    </Button>
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-xs text-muted-foreground flex items-center gap-1.5'>
                    <Target className='h-3 w-3' /> Days per week
                  </label>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-7 w-7'
                      onClick={() =>
                        update({
                          daysPerWeek: Math.max(1, planner.daysPerWeek - 1),
                        })
                      }
                      disabled={planner.daysPerWeek <= 1}
                    >
                      <Minus className='h-3 w-3' />
                    </Button>
                    <span className='text-sm font-semibold w-10 text-center'>
                      {planner.daysPerWeek}d
                    </span>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-7 w-7'
                      onClick={() =>
                        update({
                          daysPerWeek: Math.min(7, planner.daysPerWeek + 1),
                        })
                      }
                      disabled={planner.daysPerWeek >= 7}
                    >
                      <Plus className='h-3 w-3' />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className='grid grid-cols-3 gap-3 text-center'>
                <div className='bg-muted/50 rounded-lg p-3'>
                  <div className='text-lg font-bold text-foreground'>
                    {weeklyHours}h
                  </div>
                  <div className='text-[10px] text-muted-foreground'>
                    per week
                  </div>
                </div>
                <div className='bg-muted/50 rounded-lg p-3'>
                  <div className='text-lg font-bold text-primary'>
                    {totalRemainingHours}h
                  </div>
                  <div className='text-[10px] text-muted-foreground'>
                    remaining
                  </div>
                </div>
                <div className='bg-muted/50 rounded-lg p-3'>
                  <div className='text-lg font-bold text-[hsl(var(--amber))]'>
                    {weeksToComplete === Infinity ? '∞' : `${weeksToComplete}w`}
                  </div>
                  <div className='text-[10px] text-muted-foreground'>
                    to finish
                  </div>
                </div>
              </div>

              {/* Roadmap selector */}
              <div className='space-y-2'>
                <label className='text-xs text-muted-foreground flex items-center gap-1.5'>
                  <BookOpen className='h-3 w-3' /> Focus on specific roadmaps
                  <span className='text-[10px]'>
                    (
                    {planner.selectedRoadmaps.length === 0
                      ? 'all selected'
                      : `${planner.selectedRoadmaps.length} selected`}
                    )
                  </span>
                </label>
                <div className='flex flex-wrap gap-1.5'>
                  {published.map((r) => {
                    const isActive =
                      planner.selectedRoadmaps.length === 0 ||
                      planner.selectedRoadmaps.includes(r.id);
                    return (
                      <button
                        key={r.id}
                        onClick={() => toggleRoadmap(r.id)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                          isActive
                            ? `${colorBgMap[r.color]} ${colorTextMap[r.color]} border-current/20`
                            : 'bg-muted/30 text-muted-foreground border-border/50 opacity-50'
                        }`}
                      >
                        {r.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Per-roadmap breakdown */}
              <div className='space-y-3'>
                <label className='text-xs text-muted-foreground flex items-center gap-1.5'>
                  <TrendingUp className='h-3 w-3' /> Breakdown
                </label>
                {stats.map((s) => {
                  const roadmapWeeks =
                    weeklyHours > 0
                      ? Math.ceil(s.remainingHours / weeklyHours)
                      : Infinity;
                  return (
                    <Link
                      key={s.roadmap.id}
                      to={`/roadmaps/${s.roadmap.slug}`}
                      className='block'
                    >
                      <div className='group flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors'>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-between mb-1.5'>
                            <span className='text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors'>
                              {s.roadmap.name}
                            </span>
                            <div className='flex items-center gap-2 text-[10px] text-muted-foreground shrink-0 ml-2'>
                              <span>{s.totalHours}h total</span>
                              <span>·</span>
                              <span>{s.remainingHours}h left</span>
                              <span>·</span>
                              <span className={colorTextMap[s.roadmap.color]}>
                                ~
                                {roadmapWeeks === Infinity ? '∞' : roadmapWeeks}
                                w
                              </span>
                            </div>
                          </div>
                          <div className='h-1.5 bg-surface-3 rounded-full overflow-hidden'>
                            <div
                              className='h-full rounded-full transition-all duration-500'
                              style={{
                                width: `${s.completedPercent}%`,
                                backgroundColor: `hsl(var(--${s.roadmap.color}))`,
                              }}
                            />
                          </div>
                          <div className='flex justify-between mt-1 text-[10px] text-muted-foreground'>
                            <span>
                              {s.completedTopics}/{s.totalTopics} topics
                            </span>
                            <span>{s.completedPercent}%</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
