import { useMemo, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { useParams, Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  Binary,
  Monitor,
  Server,
  Network,
  GraduationCap,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Search,
  Clock,
  ExternalLink,
  Video,
  FileText,
  BookMarked,
  Code2,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  GraduationCap as CourseIcon,
} from 'lucide-react';
import { roadmaps, type RoadmapResource } from '@/data/roadmaps';
import { useRoadmapProgress } from '@/hooks/use-roadmap-progress';
import { useLearningStreak } from '@/hooks/use-learning-streak';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { RotateCcw } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Binary,
  Monitor,
  Server,
  Network,
  GraduationCap,
};

const colorMap: Record<string, string> = {
  emerald: 'hsl(var(--emerald))',
  cyan: 'hsl(var(--cyan))',
  amber: 'hsl(var(--amber))',
  rose: 'hsl(var(--rose))',
};

const colorBgMap: Record<string, string> = {
  emerald: 'bg-[hsl(var(--emerald)/0.1)] border-[hsl(var(--emerald)/0.2)]',
  cyan: 'bg-[hsl(var(--cyan)/0.1)] border-[hsl(var(--cyan)/0.2)]',
  amber: 'bg-[hsl(var(--amber)/0.1)] border-[hsl(var(--amber)/0.2)]',
  rose: 'bg-[hsl(var(--rose)/0.1)] border-[hsl(var(--rose)/0.2)]',
};

const colorTextMap: Record<string, string> = {
  emerald: 'text-[hsl(var(--emerald))]',
  cyan: 'text-[hsl(var(--cyan))]',
  amber: 'text-[hsl(var(--amber))]',
  rose: 'text-[hsl(var(--rose))]',
};

const difficultyColors: Record<string, string> = {
  beginner:
    'bg-[hsl(var(--emerald)/0.1)] text-[hsl(var(--emerald))] border-[hsl(var(--emerald)/0.2)]',
  intermediate:
    'bg-[hsl(var(--amber)/0.1)] text-[hsl(var(--amber))] border-[hsl(var(--amber)/0.2)]',
  advanced:
    'bg-[hsl(var(--rose)/0.1)] text-[hsl(var(--rose))] border-[hsl(var(--rose)/0.2)]',
};

const resourceIcons: Record<string, React.ElementType> = {
  article: FileText,
  video: Video,
  course: CourseIcon,
  documentation: BookMarked,
  practice: Code2,
  book: BookOpen,
};

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function RoadmapDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const roadmap = useMemo(
    () => roadmaps.find((r) => r.slug === slug && r.isPublished),
    [slug],
  );
  const roadmapId = roadmap?.id ?? '';
  const { isCompleted, toggleTopic, completedCount, resetProgress } =
    useRoadmapProgress(roadmapId);
  const { recordActivity, newMilestone, milestoneMessage, clearMilestone } =
    useLearningStreak();
  const totalTopics = roadmap
    ? roadmap.sections.reduce((acc, s) => acc + s.topics.length, 0)
    : 0;
  const totalMinutes = roadmap
    ? roadmap.sections.reduce(
        (acc, s) => acc + s.topics.reduce((a, t) => a + t.estimatedMinutes, 0),
        0,
      )
    : 0;
  const progress =
    totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  const Icon = roadmap ? iconMap[roadmap.icon] || Binary : Binary;
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );

  const toggleSectionCollapse = (sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const filteredSections = useMemo(() => {
    const sections = roadmap?.sections ?? [];
    const query = searchQuery.toLowerCase().trim();

    let filtered = sections;

    // Apply search
    if (query) {
      filtered = filtered
        .map((s) => ({
          ...s,
          topics: s.topics.filter(
            (t) =>
              t.name.toLowerCase().includes(query) ||
              t.description.toLowerCase().includes(query),
          ),
        }))
        .filter((s) => s.topics.length > 0);
    }

    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered
        .map((s) => ({
          ...s,
          topics: s.topics.filter((t) => t.difficulty === difficultyFilter),
        }))
        .filter((s) => s.topics.length > 0);
    }

    // Apply sort
    if (sortOrder === 'default') return filtered;
    return filtered.map((s) => ({
      ...s,
      topics: [...s.topics].sort((a, b) =>
        sortOrder === 'shortest'
          ? a.estimatedMinutes - b.estimatedMinutes
          : b.estimatedMinutes - a.estimatedMinutes,
      ),
    }));
  }, [roadmap, difficultyFilter, sortOrder, searchQuery]);

  const handleToggle = (topicId: string) => {
    const wasCompleted = isCompleted(topicId);
    toggleTopic(topicId);
    if (!wasCompleted) {
      recordActivity();
    }
  };

  const handleSubtopicToggle = (
    topicId: string,
    subtopicId: string,
    allSubtopicIds: string[],
  ) => {
    const wasCompleted = isCompleted(subtopicId);
    toggleTopic(subtopicId);
    if (!wasCompleted) {
      recordActivity();
      // Auto-complete parent topic if all subtopics are now done
      const othersDone = allSubtopicIds
        .filter((id) => id !== subtopicId)
        .every((id) => isCompleted(id));
      if (othersDone && !isCompleted(topicId)) {
        toggleTopic(topicId);
      }
    } else {
      // If unchecking a subtopic, also uncheck parent topic
      if (isCompleted(topicId)) {
        toggleTopic(topicId);
      }
    }
  };
  const prevCompletedRef = useRef(completedCount);

  useEffect(() => {
    if (
      completedCount === totalTopics &&
      totalTopics > 0 &&
      prevCompletedRef.current < totalTopics
    ) {
      const end = Date.now() + 1500;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
    prevCompletedRef.current = completedCount;
  }, [completedCount, totalTopics]);



  useEffect(() => {
    if (newMilestone && milestoneMessage) {
toast.success(`${milestoneMessage.emoji} ${milestoneMessage.title}`, {
  description: milestoneMessage.description,
});
      clearMilestone();
    }
  }, [newMilestone, milestoneMessage, clearMilestone, toast]);

  if (!roadmap) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-bold mb-2'>Roadmap not found</h2>
          <Link to='/roadmaps'>
            <Button variant='outline'>Back to Roadmaps</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to='/roadmaps'
            className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6'
          >
            <ArrowLeft className='h-4 w-4' />
            All Roadmaps
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className='mb-8'
        >
          <div className='flex items-start gap-4 mb-4'>
            <div
              className={`p-3 rounded-xl border ${colorBgMap[roadmap.color]}`}
            >
              <Icon className={`h-7 w-7 ${colorTextMap[roadmap.color]}`} />
            </div>
            <div className='flex-1'>
              <h1 className='text-2xl sm:text-3xl font-bold'>{roadmap.name}</h1>
              <p className='text-muted-foreground mt-1'>
                {roadmap.description}
              </p>
              <div className='flex items-center gap-3 mt-2'>
                <span className='inline-flex items-center gap-1 text-xs text-muted-foreground'>
                  <Clock className='h-3 w-3' />
                  {formatTime(totalMinutes)} total
                </span>
                <span className='text-xs text-muted-foreground'>·</span>
                <span className='text-xs text-muted-foreground'>
                  {roadmap.sections.length} sections
                </span>
                <span className='text-xs text-muted-foreground'>·</span>
                <span className='text-xs text-muted-foreground'>
                  {totalTopics} topics
                </span>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className='relative mb-3'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search topics...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-9 h-9 text-sm'
            />
          </div>

          {/* Filter & Sort */}
          <div className='flex items-center justify-between gap-2 mb-3 flex-wrap'>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-muted-foreground'>Filter:</span>
              {(searchQuery ||
                difficultyFilter !== 'all' ||
                sortOrder !== 'default') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setDifficultyFilter('all');
                    setSortOrder('default');
                  }}
                  className='text-[10px] px-2 py-0.5 rounded-full border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors'
                >
                  Clear all
                </button>
              )}
              {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficultyFilter(level)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors capitalize ${
                    difficultyFilter === level
                      ? level === 'all'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : difficultyColors[level] + ' font-semibold'
                      : 'border-border/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-muted-foreground'>Sort:</span>
              {[
                { value: 'default', label: 'Default' },
                { value: 'shortest', label: 'Shortest first' },
                { value: 'longest', label: 'Longest first' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortOrder(opt.value)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    sortOrder === opt.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className='glass-card p-4'>
            <div className='flex items-center justify-between text-sm mb-2'>
              <span className='text-muted-foreground'>
                {completedCount} of {totalTopics} topics completed
              </span>
              <div className='flex items-center gap-3'>
                <span
                  className='font-semibold'
                  style={{ color: colorMap[roadmap.color] }}
                >
                  {progress}%
                </span>
                {completedCount > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='h-7 px-2 text-xs text-muted-foreground hover:text-destructive'
                      >
                        <RotateCcw className='h-3 w-3 mr-1' />
                        Reset
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset progress?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will clear all {completedCount} completed topics
                          for this roadmap. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={resetProgress}
                          className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        >
                          Reset Progress
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
            <div className='h-2 bg-surface-3 rounded-full overflow-hidden'>
              <div
                className='h-full rounded-full transition-all duration-500'
                style={{
                  width: `${progress}%`,
                  backgroundColor: colorMap[roadmap.color],
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Section controls */}
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            {(() => {
              const completedSectionIds = filteredSections
                .filter(
                  (s) =>
                    s.topics.length > 0 &&
                    s.topics.every((t) => isCompleted(t.id)),
                )
                .map((s) => s.id);
              const hasCompletedSections = completedSectionIds.length > 0;
              const allCollapsed = filteredSections.every((s) =>
                collapsedSections.has(s.id),
              );
              return (
                <>
                  {hasCompletedSections && (
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-7 px-2.5 text-xs gap-1.5'
                      onClick={() => {
                        setCollapsedSections((prev) => {
                          const next = new Set(prev);
                          completedSectionIds.forEach((id) => next.add(id));
                          return next;
                        });
                      }}
                    >
                      <ChevronsDownUp className='h-3 w-3' />
                      Collapse completed
                    </Button>
                  )}
                  {collapsedSections.size > 0 && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-7 px-2.5 text-xs gap-1.5 text-muted-foreground'
                      onClick={() => setCollapsedSections(new Set())}
                    >
                      <ChevronsUpDown className='h-3 w-3' />
                      Expand all
                    </Button>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {/* Sections */}
        <div className='space-y-8'>
          {filteredSections.length === 0 && (
            <p className='text-center text-sm text-muted-foreground py-8'>
              No topics match this filter.
            </p>
          )}
          {filteredSections.map((section, si) => {
            const sectionCompleted = section.topics.filter((t) =>
              isCompleted(t.id),
            ).length;
            const sectionMinutes = section.topics.reduce(
              (a, t) => a + t.estimatedMinutes,
              0,
            );
            const sectionProgress =
              section.topics.length > 0
                ? Math.round((sectionCompleted / section.topics.length) * 100)
                : 0;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + si * 0.05 }}
              >
                <Collapsible
                  open={!collapsedSections.has(section.id)}
                  onOpenChange={() => toggleSectionCollapse(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div className='flex items-center gap-3 mb-2 cursor-pointer group/section'>
                      <div className='flex items-center justify-center h-7 w-7 rounded-full bg-surface-3 text-xs font-bold text-muted-foreground'>
                        {si + 1}
                      </div>
                      <div className='flex-1'>
                        <h2 className='text-lg font-semibold group-hover/section:text-primary transition-colors'>
                          {section.name}
                        </h2>
                        {section.description && (
                          <p className='text-xs text-muted-foreground'>
                            {section.description}
                          </p>
                        )}
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-[10px] text-muted-foreground flex items-center gap-1'>
                          <Clock className='h-2.5 w-2.5' />
                          {formatTime(sectionMinutes)}
                        </span>
                        <Badge
                          variant='outline'
                          className='text-[10px] border-border/50 text-muted-foreground'
                        >
                          {sectionCompleted}/{section.topics.length}
                        </Badge>
                        <div className='flex items-center gap-1.5'>
                          <div className='w-16 h-1.5 bg-surface-3 rounded-full overflow-hidden'>
                            <div
                              className='h-full rounded-full transition-all duration-500'
                              style={{
                                width: `${sectionProgress}%`,
                                backgroundColor: colorMap[roadmap.color],
                              }}
                            />
                          </div>
                          <span
                            className='text-[10px] font-semibold min-w-[28px] text-right'
                            style={{
                              color:
                                sectionProgress > 0
                                  ? colorMap[roadmap.color]
                                  : undefined,
                            }}
                          >
                            {sectionProgress}%
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${collapsedSections.has(section.id) ? '-rotate-90' : ''}`}
                        />
                      </div>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className='space-y-2 pl-3 border-l-2 border-border/30 ml-3.5'>
                      {section.topics.map((topic) => {
                        const done = isCompleted(topic.id);
                        const ResIcon =
                          resourceIcons[topic.resources[0]?.type] || BookOpen;
                        return (
                          <div
                            key={topic.id}
                            className={`glass-card p-4 group hover:border-primary/30 transition-all ${
                              done ? 'opacity-60' : ''
                            }`}
                          >
                            <div className='flex items-start gap-3'>
                              <div
                                className='pt-0.5 cursor-pointer'
                                onClick={() => handleToggle(topic.id)}
                              >
                                {done ? (
                                  <CheckCircle2 className='h-4.5 w-4.5 text-primary' />
                                ) : (
                                  <Checkbox
                                    className='h-4 w-4'
                                    checked={false}
                                  />
                                )}
                              </div>
                              <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2 flex-wrap'>
                                  <h3
                                    className={`text-sm font-medium cursor-pointer ${done ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                                    onClick={() => handleToggle(topic.id)}
                                  >
                                    {topic.name}
                                  </h3>
                                  <Badge
                                    variant='outline'
                                    className={`text-[9px] px-1.5 py-0 h-4 ${difficultyColors[topic.difficulty]}`}
                                  >
                                    {topic.difficulty}
                                  </Badge>
                                  <span className='text-[10px] text-muted-foreground flex items-center gap-0.5'>
                                    <Clock className='h-2.5 w-2.5' />
                                    {formatTime(topic.estimatedMinutes)}
                                  </span>
                                </div>
                                <p className='text-xs text-muted-foreground mt-1'>
                                  {topic.description}
                                </p>

                                {/* Subtopics */}
                                {topic.subtopics.length > 0 && (
                                  <div className='mt-2 space-y-1'>
                                    <div className='flex items-center gap-2 mb-1'>
                                      <span className='text-[10px] text-muted-foreground font-medium'>
                                        Subtopics (
                                        {
                                          topic.subtopics.filter((st) =>
                                            isCompleted(st.id),
                                          ).length
                                        }
                                        /{topic.subtopics.length})
                                      </span>
                                      <div className='flex-1 h-1 bg-surface-3 rounded-full overflow-hidden max-w-[80px]'>
                                        <div
                                          className='h-full rounded-full transition-all duration-300 bg-primary'
                                          style={{
                                            width: `${topic.subtopics.length > 0 ? (topic.subtopics.filter((st) => isCompleted(st.id)).length / topic.subtopics.length) * 100 : 0}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                    {topic.subtopics.map((st) => {
                                      const stDone = isCompleted(st.id);
                                      return (
                                        <div
                                          key={st.id}
                                          className='flex items-center gap-2 cursor-pointer group/st pl-1'
                                          onClick={() =>
                                            handleSubtopicToggle(
                                              topic.id,
                                              st.id,
                                              topic.subtopics.map((s) => s.id),
                                            )
                                          }
                                        >
                                          {stDone ? (
                                            <CheckCircle2 className='h-3 w-3 text-primary shrink-0' />
                                          ) : (
                                            <Checkbox
                                              className='h-3 w-3 shrink-0'
                                              checked={false}
                                            />
                                          )}
                                          <span
                                            className={`text-[11px] ${stDone ? 'line-through text-muted-foreground' : 'text-foreground/80 group-hover/st:text-foreground'} transition-colors`}
                                          >
                                            {st.name}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {/* Resources */}
                                {topic.resources.length > 0 && (
                                  <div className='flex flex-wrap gap-1.5 mt-2'>
                                    {topic.resources.map((r, ri) => {
                                      const RIcon =
                                        resourceIcons[r.type] || BookOpen;
                                      return r.url ? (
                                        <a
                                          key={ri}
                                          href={r.url}
                                          target='_blank'
                                          rel='noopener noreferrer'
                                          className='inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-primary/5 text-primary border border-primary/10 hover:bg-primary/10 transition-colors'
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <RIcon className='h-2.5 w-2.5' />
                                          {r.title}
                                          <ExternalLink className='h-2 w-2' />
                                        </a>
                                      ) : (
                                        <span
                                          key={ri}
                                          className='inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-surface-3 text-muted-foreground'
                                        >
                                          <RIcon className='h-2.5 w-2.5' />
                                          {r.title}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
