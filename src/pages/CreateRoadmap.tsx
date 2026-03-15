// src/pages/admin/CreateRoadmapPage.tsx
import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Save,
  ArrowLeft,
  Search,
  ChevronsUpDown,
  ChevronsDownUp,
  FoldVertical,
  UnfoldVertical,
  Loader2,
} from 'lucide-react';
import type {
  RoadmapSection,
  RoadmapTopic,
  RoadmapResource,
  RoadmapSubtopic,
} from '@/types/roadmap.types';
import { toast } from 'sonner';
import { useGetRoadmapAdmin } from '@/hooks/roadmaps/useGetRoadmapAdmin';
import { useCreateRoadmap } from '@/hooks/roadmaps/useCreateRoadmap';
import { useUpdateRoadmap } from '@/hooks/roadmaps/useUpdateRoadmap';

const iconOptions = ['Binary', 'Monitor', 'Server', 'Network', 'GraduationCap'];
const colorOptions = ['emerald', 'cyan', 'amber', 'rose'];
const difficultyOptions: RoadmapTopic['difficulty'][] = [
  'beginner',
  'intermediate',
  'advanced',
];
const resourceTypeOptions: RoadmapResource['type'][] = [
  'article',
  'video',
  'course',
  'documentation',
  'practice',
  'book',
];

function createEmptyTopic(): RoadmapTopic {
  return {
    id: `t${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: '',
    description: '',
    difficulty: 'beginner',
    estimatedMinutes: 60,
    resources: [],
    subtopics: [],
  };
}
function createEmptyResource(): RoadmapResource {
  return { title: '', type: 'article' };
}
function createEmptySubtopic(): RoadmapSubtopic {
  return {
    id: `st${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: '',
  };
}

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

// ─── Edit-mode loading skeleton ───────────────────────────────────────────────

function CreateRoadmapSkeleton() {
  return (
    <div className='p-6 lg:p-8 max-w-4xl'>
      {/* Back + header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Bone w='w-32' h='h-8' rounded='rounded-lg' className='mb-4' />
        <div className='flex items-center justify-between mb-8'>
          <div className='space-y-2'>
            <Bone w='w-40' h='h-7' rounded='rounded-lg' delay={40} />
            <Bone w='w-80' h='h-4' delay={60} />
          </div>
          <Bone w='w-20' h='h-10' rounded='rounded-lg' delay={80} />
        </div>
      </motion.div>

      <div className='space-y-8'>
        {/* Basic info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className='glass-card p-6 space-y-5'
        >
          <Bone w='w-36' h='h-4' delay={100} />
          {/* Name + slug */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Bone w='w-10' h='h-3' delay={110} />
              <Bone w='w-full' h='h-10' rounded='rounded-xl' delay={120} />
            </div>
            <div className='space-y-2'>
              <Bone w='w-10' h='h-3' delay={130} />
              <Bone w='w-full' h='h-10' rounded='rounded-xl' delay={140} />
            </div>
          </div>
          {/* Description */}
          <div className='space-y-2'>
            <Bone w='w-20' h='h-3' delay={150} />
            <Bone w='w-full' h='h-20' rounded='rounded-xl' delay={160} />
          </div>
          {/* Icon + color + published */}
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Bone w='w-8' h='h-3' delay={170} />
              <Bone w='w-full' h='h-10' rounded='rounded-xl' delay={180} />
            </div>
            <div className='space-y-2'>
              <Bone w='w-10' h='h-3' delay={190} />
              <Bone w='w-full' h='h-10' rounded='rounded-xl' delay={200} />
            </div>
            <div className='flex items-end gap-2 pb-1'>
              <Bone w='w-10' h='h-6' rounded='rounded-full' delay={210} />
              <Bone w='w-16' h='h-3' delay={220} />
            </div>
          </div>
        </motion.div>

        {/* Sections & Topics card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='glass-card p-6 space-y-5'
        >
          {/* Card heading row */}
          <div className='flex items-center justify-between'>
            <div className='space-y-1.5'>
              <Bone w='w-36' h='h-4' delay={240} />
              <Bone w='w-56' h='h-2.5' delay={255} />
            </div>
            <Bone w='w-24' h='h-7' rounded='rounded-lg' delay={265} />
          </div>

          {/* Search + expand controls */}
          <div className='flex flex-col sm:flex-row gap-2'>
            <Bone w='flex-1 w-full' h='h-8' rounded='rounded-xl' delay={275} />
            <div className='flex gap-1.5 shrink-0'>
              {[0, 1, 2, 3].map((i) => (
                <Bone
                  key={i}
                  w='w-20'
                  h='h-8'
                  rounded='rounded-lg'
                  delay={285 + i * 15}
                />
              ))}
            </div>
          </div>

          {/* 3 skeleton section blocks */}
          {[0, 1, 2].map((si) => (
            <motion.div
              key={si}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + si * 0.07 }}
              className='rounded-lg border border-border/40 bg-surface-1/30 overflow-hidden'
            >
              {/* Section header */}
              <div className='flex items-center gap-2 px-4 py-2.5 bg-surface-2/50 border-b border-border/30'>
                <Bone w='w-4' h='h-4' rounded='rounded' delay={320 + si * 50} />
                <Bone w='w-4' h='h-4' rounded='rounded' delay={330 + si * 50} />
                <Bone
                  w={['w-40', 'w-52', 'w-36'][si]!}
                  h='h-5'
                  rounded='rounded'
                  delay={340 + si * 50}
                  className='flex-1'
                />
                <Bone
                  w='w-14'
                  h='h-5'
                  rounded='rounded-full'
                  delay={350 + si * 50}
                />
                <Bone w='w-8' h='h-3' delay={358 + si * 50} />
                <Bone
                  w='w-6'
                  h='h-6'
                  rounded='rounded-md'
                  delay={365 + si * 50}
                />
              </div>
              {/* Topic rows inside (only first section expanded) */}
              {si === 0 && (
                <div className='p-4 space-y-2'>
                  <Bone w='w-full' h='h-8' rounded='rounded-xl' delay={380} />
                  {[0, 1, 2].map((ti) => (
                    <div
                      key={ti}
                      className='rounded-lg border border-border/30 bg-surface-2/30 overflow-hidden'
                    >
                      <div className='flex items-center gap-2 px-3 py-2'>
                        <Bone
                          w='w-3'
                          h='h-3'
                          rounded='rounded'
                          delay={395 + ti * 30}
                        />
                        <Bone
                          w='w-3.5'
                          h='h-3.5'
                          rounded='rounded'
                          delay={405 + ti * 30}
                        />
                        <Bone
                          w={['w-36', 'w-44', 'w-32'][ti]!}
                          h='h-3.5'
                          delay={415 + ti * 30}
                          className='flex-1'
                        />
                        <Bone
                          w='w-16'
                          h='h-4'
                          rounded='rounded-full'
                          delay={425 + ti * 30}
                        />
                        <Bone w='w-8' h='h-3' delay={432 + ti * 30} />
                        <Bone
                          w='w-6'
                          h='h-6'
                          rounded='rounded-md'
                          delay={440 + ti * 30}
                        />
                      </div>
                    </div>
                  ))}
                  <Bone w='w-full' h='h-7' rounded='rounded-lg' delay={500} />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateRoadmapPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { roadmap: existing, isPending: isLoadingExisting } =
    useGetRoadmapAdmin(id ?? '');
  const { createRoadmapMutation, isPending: isCreating } = useCreateRoadmap();
  const { updateRoadmapMutation, isPending: isUpdating } = useUpdateRoadmap();
  const isSaving = isCreating || isUpdating;

  const [name, setName] = useState(() => existing?.name ?? '');
  const [slug, setSlug] = useState(() => existing?.slug ?? '');
  const [description, setDescription] = useState(
    () => existing?.description ?? '',
  );
  const [icon, setIcon] = useState(() => existing?.icon ?? 'Binary');
  const [color, setColor] = useState(() => existing?.color ?? 'emerald');
  const [isPublished, setIsPublished] = useState(
    () => existing?.isPublished ?? false,
  );
  const [sections, setSections] = useState<RoadmapSection[]>(
    () => (existing?.sections as RoadmapSection[] | undefined) ?? [],
  );

  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set(),
  );
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing)
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
      );
  };

  const expandAllSections = () =>
    setExpandedSections(new Set(sections.map((_, i) => i)));
  const collapseAllSections = () => {
    setExpandedSections(new Set());
    setExpandedTopics(new Set());
  };
  const expandAllTopics = () => {
    const ids = sections.flatMap((s) => s.topics.map((t) => t.id));
    setExpandedSections(new Set(sections.map((_, i) => i)));
    setExpandedTopics(new Set(ids));
  };
  const collapseAllTopics = () => setExpandedTopics(new Set());

  const matchesSearch = useCallback(
    (topic: RoadmapTopic) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        topic.name.toLowerCase().includes(q) ||
        topic.description.toLowerCase().includes(q) ||
        topic.subtopics.some((st) => st.name.toLowerCase().includes(q))
      );
    },
    [searchQuery],
  );

  const filteredSectionIndices = useMemo(() => {
    if (!searchQuery.trim()) return sections.map((_, i) => i);
    return sections
      .map((s, i) => ({ section: s, index: i }))
      .filter(({ section }) => section.topics.some(matchesSearch))
      .map(({ index }) => index);
  }, [sections, searchQuery, matchesSearch]);

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: `s${Date.now()}`, name: '', description: '', topics: [] },
    ]);
    setExpandedSections((prev) => new Set([...prev, sections.length]));
  };
  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
    setExpandedSections((prev) => {
      const next = new Set<number>();
      prev.forEach((v) => {
        if (v < index) next.add(v);
        else if (v > index) next.add(v - 1);
      });
      return next;
    });
  };
  const updateSection = (
    index: number,
    field: 'name' | 'description',
    value: string,
  ) =>
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );

  const addTopic = (si: number) => {
    const t = createEmptyTopic();
    setSections((prev) =>
      prev.map((s, i) => (i === si ? { ...s, topics: [...s.topics, t] } : s)),
    );
    setExpandedTopics((prev) => new Set([...prev, t.id]));
  };
  const removeTopic = (si: number, ti: number) =>
    setSections((prev) =>
      prev.map((s, i) =>
        i === si ? { ...s, topics: s.topics.filter((_, j) => j !== ti) } : s,
      ),
    );
  const updateTopic = (
    si: number,
    ti: number,
    updates: Partial<RoadmapTopic>,
  ) =>
    setSections((prev) =>
      prev.map((s, sI) =>
        sI === si
          ? {
              ...s,
              topics: s.topics.map((t, tI) =>
                tI === ti ? { ...t, ...updates } : t,
              ),
            }
          : s,
      ),
    );

  const addResource = (si: number, ti: number) =>
    setSections((prev) =>
      prev.map((s, sI) =>
        sI === si
          ? {
              ...s,
              topics: s.topics.map((t, tI) =>
                tI === ti
                  ? { ...t, resources: [...t.resources, createEmptyResource()] }
                  : t,
              ),
            }
          : s,
      ),
    );
  const updateResource = (
    si: number,
    ti: number,
    ri: number,
    upd: Partial<RoadmapResource>,
  ) =>
    setSections((prev) =>
      prev.map((s, sI) =>
        sI === si
          ? {
              ...s,
              topics: s.topics.map((t, tI) =>
                tI === ti
                  ? {
                      ...t,
                      resources: t.resources.map((r, rI) =>
                        rI === ri ? { ...r, ...upd } : r,
                      ),
                    }
                  : t,
              ),
            }
          : s,
      ),
    );
  const removeResource = (si: number, ti: number, ri: number) =>
    setSections((prev) =>
      prev.map((s, sI) =>
        sI === si
          ? {
              ...s,
              topics: s.topics.map((t, tI) =>
                tI === ti
                  ? {
                      ...t,
                      resources: t.resources.filter((_, rI) => rI !== ri),
                    }
                  : t,
              ),
            }
          : s,
      ),
    );

  const addSubtopic = (si: number, ti: number) =>
    setSections((prev) =>
      prev.map((s, sI) =>
        sI === si
          ? {
              ...s,
              topics: s.topics.map((t, tI) =>
                tI === ti
                  ? { ...t, subtopics: [...t.subtopics, createEmptySubtopic()] }
                  : t,
              ),
            }
          : s,
      ),
    );
  const updateSubtopic = (
    si: number,
    ti: number,
    stIdx: number,
    stName: string,
  ) =>
    setSections((prev) =>
      prev.map((s, sI) =>
        sI === si
          ? {
              ...s,
              topics: s.topics.map((t, tI) =>
                tI === ti
                  ? {
                      ...t,
                      subtopics: t.subtopics.map((st, i) =>
                        i === stIdx ? { ...st, name: stName } : st,
                      ),
                    }
                  : t,
              ),
            }
          : s,
      ),
    );
  const removeSubtopic = (si: number, ti: number, stIdx: number) =>
    setSections((prev) =>
      prev.map((s, sI) =>
        sI === si
          ? {
              ...s,
              topics: s.topics.map((t, tI) =>
                tI === ti
                  ? {
                      ...t,
                      subtopics: t.subtopics.filter((_, i) => i !== stIdx),
                    }
                  : t,
              ),
            }
          : s,
      ),
    );

  const toggleSection = (index: number) =>
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  const toggleTopic = (topicId: string) =>
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });

  const [dragType, setDragType] = useState<'section' | 'topic' | null>(null);
  const [dragSource, setDragSource] = useState<{
    sectionIndex: number;
    topicIndex?: number;
  } | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{
    sectionIndex: number;
    topicIndex?: number;
  } | null>(null);
  const resetDrag = () => {
    setDragType(null);
    setDragSource(null);
    setDragOverTarget(null);
  };

  const handleSectionDragStart = (e: React.DragEvent, si: number) => {
    setDragType('section');
    setDragSource({ sectionIndex: si });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };
  const handleSectionDragOver = (e: React.DragEvent, si: number) => {
    if (dragType !== 'section') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget({ sectionIndex: si });
  };
  const handleSectionDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (
      dragType !== 'section' ||
      !dragSource ||
      dragSource.sectionIndex === targetIndex
    )
      return;
    const fromIndex = dragSource.sectionIndex;
    setSections((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setExpandedSections((prev) => {
      const next = new Set<number>();
      prev.forEach((idx) => {
        if (idx === fromIndex) next.add(targetIndex);
        else if (
          fromIndex < targetIndex &&
          idx > fromIndex &&
          idx <= targetIndex
        )
          next.add(idx - 1);
        else if (
          fromIndex > targetIndex &&
          idx >= targetIndex &&
          idx < fromIndex
        )
          next.add(idx + 1);
        else next.add(idx);
      });
      return next;
    });
    resetDrag();
  };

  const handleTopicDragStart = (e: React.DragEvent, si: number, ti: number) => {
    e.stopPropagation();
    setDragType('topic');
    setDragSource({ sectionIndex: si, topicIndex: ti });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };
  const handleTopicDragOver = (e: React.DragEvent, si: number, ti: number) => {
    if (dragType !== 'topic') return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget({ sectionIndex: si, topicIndex: ti });
  };
  const handleTopicDrop = (
    e: React.DragEvent,
    targetSI: number,
    targetTI: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      dragType !== 'topic' ||
      !dragSource ||
      dragSource.topicIndex === undefined
    )
      return;
    const { sectionIndex: fromSI, topicIndex: fromTI } = dragSource;
    if (fromSI === targetSI && fromTI === targetTI) return;
    setSections((prev) => {
      const next = prev.map((s) => ({ ...s, topics: [...s.topics] }));
      const [moved] = next[fromSI].topics.splice(fromTI, 1);
      next[targetSI].topics.splice(targetTI, 0, moved);
      return next;
    });
    resetDrag();
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name required', {
        description: 'Please enter a roadmap name.',
      });
      return;
    }
    if (!slug.trim()) {
      toast.error('Slug required', {
        description: 'Please enter a roadmap slug.',
      });
      return;
    }
    try {
      if (isEditing && id) {
        await updateRoadmapMutation({
          id,
          name,
          slug,
          description,
          icon,
          color,
          isPublished,
          sections,
        });
        toast.success('Roadmap updated', {
          description: `"${name}" has been saved.`,
        });
      } else {
        await createRoadmapMutation({
          name,
          slug,
          description,
          icon,
          color,
          isPublished,
          sections,
        });
        toast.success('Roadmap created', {
          description: `"${name}" has been published.`,
        });
      }
      navigate('/admin/roadmaps');
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Please try again.';
      toast.error('Failed to save roadmap', { description: msg });
    }
  };

  const totalTopics = sections.reduce((acc, s) => acc + s.topics.length, 0);
  const totalSubtopics = sections.reduce(
    (acc, s) => acc + s.topics.reduce((a, t) => a + t.subtopics.length, 0),
    0,
  );
  const totalMinutes = sections.reduce(
    (acc, s) => acc + s.topics.reduce((a, t) => a + t.estimatedMinutes, 0),
    0,
  );

  // ── Loading (edit mode only) ──────────────────────────────────────────────
  if (isEditing && isLoadingExisting) return <CreateRoadmapSkeleton />;

  return (
    <div className='p-6 lg:p-8 max-w-4xl'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant='ghost'
          size='sm'
          className='mb-4 text-muted-foreground hover:text-foreground gap-1.5'
          onClick={() => navigate('/admin/roadmaps')}
        >
          <ArrowLeft className='h-4 w-4' /> Back to Roadmaps
        </Button>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-2xl font-bold'>
              {isEditing ? 'Edit Roadmap' : 'Create Roadmap'}
            </h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Define sections, topics, resources, and subtopics for a structured
              learning path
            </p>
          </div>
          <Button
            onClick={() => void handleSave()}
            disabled={isSaving}
            className='bg-primary hover:bg-primary/90 text-primary-foreground gap-2'
          >
            {isSaving ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Save className='h-4 w-4' />
            )}
            Save
          </Button>
        </div>
      </motion.div>

      <div className='space-y-8'>
        {/* Basic info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className='glass-card p-6 space-y-5'
        >
          <h2 className='text-sm font-semibold text-foreground'>
            Basic Information
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label className='text-xs text-muted-foreground'>Name</Label>
              <Input
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder='e.g. Frontend Development'
                className='bg-surface-2 border-border/50'
              />
            </div>
            <div className='space-y-2'>
              <Label className='text-xs text-muted-foreground'>Slug</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder='frontend'
                className='bg-surface-2 border-border/50 font-mono text-sm'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label className='text-xs text-muted-foreground'>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='A brief description of this roadmap...'
              className='bg-surface-2 border-border/50 min-h-[80px]'
            />
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label className='text-xs text-muted-foreground'>Icon</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger className='bg-surface-2 border-border/50'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label className='text-xs text-muted-foreground'>Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger className='bg-surface-2 border-border/50'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((c) => (
                    <SelectItem key={c} value={c} className='capitalize'>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex items-end gap-2 pb-1'>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              <Label className='text-xs text-muted-foreground'>Published</Label>
            </div>
          </div>
        </motion.div>

        {/* Sections & Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='glass-card p-6 space-y-5'
        >
          <div className='flex items-center justify-between flex-wrap gap-3'>
            <div>
              <h2 className='text-sm font-semibold text-foreground'>
                Sections & Topics
              </h2>
              <p className='text-[11px] text-muted-foreground/60 mt-0.5'>
                {sections.length} sections · {totalTopics} topics ·{' '}
                {totalSubtopics} subtopics · ~{Math.round(totalMinutes / 60)}h
                total
              </p>
            </div>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={addSection}
              className='text-primary hover:text-primary/80 gap-1.5 h-7 text-xs'
            >
              <Plus className='h-3.5 w-3.5' /> Add Section
            </Button>
          </div>

          {sections.length > 0 && (
            <div className='flex flex-col sm:flex-row gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground' />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search topics, subtopics...'
                  className='pl-8 bg-surface-2 border-border/50 h-8 text-xs'
                />
              </div>
              <div className='flex gap-1.5 shrink-0'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={expandAllSections}
                  className='h-8 text-[10px] gap-1 border-border/50 px-2'
                >
                  <UnfoldVertical className='h-3 w-3' /> Sections
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={collapseAllSections}
                  className='h-8 text-[10px] gap-1 border-border/50 px-2'
                >
                  <FoldVertical className='h-3 w-3' /> Sections
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={expandAllTopics}
                  className='h-8 text-[10px] gap-1 border-border/50 px-2'
                >
                  <ChevronsUpDown className='h-3 w-3' /> All Topics
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={collapseAllTopics}
                  className='h-8 text-[10px] gap-1 border-border/50 px-2'
                >
                  <ChevronsDownUp className='h-3 w-3' /> All Topics
                </Button>
              </div>
            </div>
          )}

          {sections.length === 0 && (
            <div className='text-center py-8 rounded-lg border border-dashed border-border/50'>
              <p className='text-sm text-muted-foreground mb-2'>
                No sections defined yet.
              </p>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={addSection}
                className='border-border/50 gap-1.5'
              >
                <Plus className='h-3.5 w-3.5' /> Add First Section
              </Button>
            </div>
          )}

          {filteredSectionIndices.map((si) => {
            const section = sections[si]!;
            const isExpanded = expandedSections.has(si);
            const visibleTopics = searchQuery.trim()
              ? section.topics.filter(matchesSearch)
              : section.topics;
            const sectionMinutes = section.topics.reduce(
              (a, t) => a + t.estimatedMinutes,
              0,
            );
            return (
              <div
                key={section.id}
                className={`rounded-lg border bg-surface-1/30 overflow-hidden transition-colors ${dragOverTarget?.sectionIndex === si && dragType === 'section' && dragSource?.sectionIndex !== si ? 'border-primary/60 ring-1 ring-primary/30' : 'border-border/40'}`}
                onDragOver={(e) => handleSectionDragOver(e, si)}
                onDrop={(e) => handleSectionDrop(e, si)}
                onDragEnd={resetDrag}
              >
                <div className='flex items-center gap-2 px-4 py-2.5 bg-surface-2/50 border-b border-border/30'>
                  <button
                    onClick={() => toggleSection(si)}
                    className='text-muted-foreground hover:text-foreground transition-colors'
                  >
                    {isExpanded ? (
                      <ChevronDown className='h-4 w-4' />
                    ) : (
                      <ChevronRight className='h-4 w-4' />
                    )}
                  </button>
                  <div
                    draggable
                    onDragStart={(e) => handleSectionDragStart(e, si)}
                    className='cursor-grab active:cursor-grabbing'
                  >
                    <GripVertical className='h-3.5 w-3.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors' />
                  </div>
                  <Input
                    value={section.name}
                    onChange={(e) => updateSection(si, 'name', e.target.value)}
                    placeholder={`Section ${si + 1} name`}
                    className='bg-transparent border-none shadow-none h-8 text-sm font-medium px-1 focus-visible:ring-0'
                  />
                  <Badge
                    variant='outline'
                    className='text-[10px] border-border/50 text-muted-foreground whitespace-nowrap'
                  >
                    {section.topics.length} topics
                  </Badge>
                  <span className='text-[10px] text-muted-foreground whitespace-nowrap hidden sm:inline'>
                    ~{Math.round(sectionMinutes / 60)}h
                  </span>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0'
                    onClick={() => removeSection(si)}
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </div>
                {isExpanded && (
                  <div className='p-4 space-y-3'>
                    <Input
                      value={section.description ?? ''}
                      onChange={(e) =>
                        updateSection(si, 'description', e.target.value)
                      }
                      placeholder='Section description (optional)'
                      className='bg-surface-2 border-border/50 h-8 text-xs'
                    />
                    {visibleTopics.map((topic) => {
                      const ti = section.topics.indexOf(topic);
                      const topicExpanded = expandedTopics.has(topic.id);
                      return (
                        <div
                          key={topic.id}
                          className={`rounded-lg border bg-surface-2/30 overflow-hidden transition-colors ${dragOverTarget?.sectionIndex === si && dragOverTarget?.topicIndex === ti && dragType === 'topic' ? 'border-primary/60 ring-1 ring-primary/30' : 'border-border/30'}`}
                          onDragOver={(e) => handleTopicDragOver(e, si, ti)}
                          onDrop={(e) => handleTopicDrop(e, si, ti)}
                          onDragEnd={resetDrag}
                        >
                          <div className='flex items-center gap-2 px-3 py-2'>
                            <div
                              draggable
                              onDragStart={(e) =>
                                handleTopicDragStart(e, si, ti)
                              }
                              className='cursor-grab active:cursor-grabbing'
                            >
                              <GripVertical className='h-3 w-3 text-muted-foreground/40 hover:text-muted-foreground transition-colors' />
                            </div>
                            <button
                              onClick={() => toggleTopic(topic.id)}
                              className='text-muted-foreground hover:text-foreground transition-colors'
                            >
                              {topicExpanded ? (
                                <ChevronDown className='h-3.5 w-3.5' />
                              ) : (
                                <ChevronRight className='h-3.5 w-3.5' />
                              )}
                            </button>
                            <Input
                              value={topic.name}
                              onChange={(e) =>
                                updateTopic(si, ti, { name: e.target.value })
                              }
                              placeholder='Topic name'
                              className='bg-transparent border-none shadow-none h-7 text-sm font-medium px-1 focus-visible:ring-0 flex-1'
                            />
                            <Badge
                              variant='outline'
                              className='text-[9px] border-border/50 text-muted-foreground capitalize'
                            >
                              {topic.difficulty}
                            </Badge>
                            <span className='text-[10px] text-muted-foreground whitespace-nowrap'>
                              {topic.estimatedMinutes}m
                            </span>
                            {topic.subtopics.length > 0 && (
                              <span className='text-[10px] text-muted-foreground/60 whitespace-nowrap'>
                                {topic.subtopics.length} sub
                              </span>
                            )}
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='h-6 w-6 text-muted-foreground hover:text-destructive'
                              onClick={() => removeTopic(si, ti)}
                            >
                              <Trash2 className='h-3 w-3' />
                            </Button>
                          </div>
                          {topicExpanded && (
                            <div className='px-3 pb-3 space-y-3 border-t border-border/20 pt-3'>
                              <Textarea
                                value={topic.description}
                                onChange={(e) =>
                                  updateTopic(si, ti, {
                                    description: e.target.value,
                                  })
                                }
                                placeholder='Topic description'
                                className='bg-surface-2 border-border/50 text-xs min-h-[60px]'
                              />
                              <div className='grid grid-cols-2 gap-3'>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-muted-foreground'>
                                    Difficulty
                                  </Label>
                                  <Select
                                    value={topic.difficulty}
                                    onValueChange={(v) =>
                                      updateTopic(si, ti, {
                                        difficulty:
                                          v as RoadmapTopic['difficulty'],
                                      })
                                    }
                                  >
                                    <SelectTrigger className='bg-surface-2 border-border/50 h-7 text-xs'>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {difficultyOptions.map((d) => (
                                        <SelectItem
                                          key={d}
                                          value={d}
                                          className='text-xs capitalize'
                                        >
                                          {d}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className='space-y-1'>
                                  <Label className='text-[10px] text-muted-foreground'>
                                    Est. Time (minutes)
                                  </Label>
                                  <Input
                                    type='number'
                                    min={5}
                                    max={600}
                                    value={topic.estimatedMinutes}
                                    onChange={(e) =>
                                      updateTopic(si, ti, {
                                        estimatedMinutes:
                                          parseInt(e.target.value) || 0,
                                      })
                                    }
                                    className='bg-surface-2 border-border/50 h-7 text-xs'
                                  />
                                </div>
                              </div>
                              <div className='space-y-1.5'>
                                <div className='flex items-center justify-between'>
                                  <Label className='text-[10px] text-muted-foreground'>
                                    Subtopics ({topic.subtopics.length})
                                  </Label>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => addSubtopic(si, ti)}
                                    className='h-5 text-[10px] text-primary px-1.5'
                                  >
                                    <Plus className='h-2.5 w-2.5 mr-0.5' /> Add
                                  </Button>
                                </div>
                                <div className='space-y-1'>
                                  {topic.subtopics.map((st, stIdx) => (
                                    <div
                                      key={st.id}
                                      className='flex items-center gap-1 bg-surface-3 rounded px-2 py-1'
                                    >
                                      <Input
                                        value={st.name}
                                        onChange={(e) =>
                                          updateSubtopic(
                                            si,
                                            ti,
                                            stIdx,
                                            e.target.value,
                                          )
                                        }
                                        placeholder='Subtopic name'
                                        className='bg-transparent border-none shadow-none h-5 text-[11px] px-0 flex-1 focus-visible:ring-0'
                                      />
                                      <button
                                        onClick={() =>
                                          removeSubtopic(si, ti, stIdx)
                                        }
                                        className='text-muted-foreground hover:text-destructive shrink-0'
                                      >
                                        <Trash2 className='h-2.5 w-2.5' />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className='space-y-1.5'>
                                <div className='flex items-center justify-between'>
                                  <Label className='text-[10px] text-muted-foreground'>
                                    Resources ({topic.resources.length})
                                  </Label>
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => addResource(si, ti)}
                                    className='h-5 text-[10px] text-primary px-1.5'
                                  >
                                    <Plus className='h-2.5 w-2.5 mr-0.5' /> Add
                                  </Button>
                                </div>
                                {topic.resources.map((res, ri) => (
                                  <div
                                    key={ri}
                                    className='flex items-center gap-1.5 bg-surface-3/50 rounded p-1.5'
                                  >
                                    <Select
                                      value={res.type}
                                      onValueChange={(v) =>
                                        updateResource(si, ti, ri, {
                                          type: v as RoadmapResource['type'],
                                        })
                                      }
                                    >
                                      <SelectTrigger className='bg-transparent border-none shadow-none h-6 w-24 text-[10px] px-1'>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {resourceTypeOptions.map((rt) => (
                                          <SelectItem
                                            key={rt}
                                            value={rt}
                                            className='text-xs capitalize'
                                          >
                                            {rt}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      value={res.title}
                                      onChange={(e) =>
                                        updateResource(si, ti, ri, {
                                          title: e.target.value,
                                        })
                                      }
                                      placeholder='Resource title'
                                      className='bg-transparent border-none shadow-none h-6 text-[10px] px-1 flex-1 focus-visible:ring-0'
                                    />
                                    <Input
                                      value={res.url ?? ''}
                                      onChange={(e) =>
                                        updateResource(si, ti, ri, {
                                          url: e.target.value || undefined,
                                        })
                                      }
                                      placeholder='URL (optional)'
                                      className='bg-transparent border-none shadow-none h-6 text-[10px] px-1 flex-1 focus-visible:ring-0'
                                    />
                                    <button
                                      onClick={() => removeResource(si, ti, ri)}
                                      className='text-muted-foreground hover:text-destructive'
                                    >
                                      <Trash2 className='h-2.5 w-2.5' />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => addTopic(si)}
                      className='text-primary hover:text-primary/80 gap-1 h-7 text-xs w-full border border-dashed border-border/40'
                    >
                      <Plus className='h-3 w-3' /> Add Topic
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
