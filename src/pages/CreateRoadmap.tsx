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
} from 'lucide-react';
import {
  roadmaps,
  type RoadmapSection,
  type RoadmapTopic,
  type RoadmapResource,
  type RoadmapSubtopic,
} from '@/data/roadmaps';
import { toast } from 'sonner';



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

export default function CreateRoadmapPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = !!id;

  const existing = useMemo(
    () => (id ? roadmaps.find((r) => r.id === id) : null),
    [id],
  );

  const [name, setName] = useState(existing?.name ?? '');
  const [slug, setSlug] = useState(existing?.slug ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [icon, setIcon] = useState(existing?.icon ?? 'Binary');
  const [color, setColor] = useState(existing?.color ?? 'emerald');
  const [isPublished, setIsPublished] = useState(
    existing?.isPublished ?? false,
  );
  const [sections, setSections] = useState<RoadmapSection[]>(
    existing?.sections ?? [],
  );
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    new Set(sections.map((_, i) => i)),
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

  // Expand / Collapse all helpers
  const expandAllSections = () => {
    setExpandedSections(new Set(sections.map((_, i) => i)));
  };
  const collapseAllSections = () => {
    setExpandedSections(new Set());
    setExpandedTopics(new Set());
  };
  const expandAllTopics = () => {
    const allIds = sections.flatMap((s) => s.topics.map((t) => t.id));
    setExpandedSections(new Set(sections.map((_, i) => i)));
    setExpandedTopics(new Set(allIds));
  };
  const collapseAllTopics = () => {
    setExpandedTopics(new Set());
  };

  // Search/filter


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

  // Section CRUD
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
  ) => {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  // Topic CRUD
  const addTopic = (sectionIndex: number) => {
    const newTopic = createEmptyTopic();
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex ? { ...s, topics: [...s.topics, newTopic] } : s,
      ),
    );
    setExpandedTopics((prev) => new Set([...prev, newTopic.id]));
  };

  const removeTopic = (sectionIndex: number, topicIndex: number) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex
          ? { ...s, topics: s.topics.filter((_, ti) => ti !== topicIndex) }
          : s,
      ),
    );
  };

  const updateTopic = (
    sectionIndex: number,
    topicIndex: number,
    updates: Partial<RoadmapTopic>,
  ) => {
    setSections((prev) =>
      prev.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              topics: s.topics.map((t, ti) =>
                ti === topicIndex ? { ...t, ...updates } : t,
              ),
            }
          : s,
      ),
    );
  };

  // Resource CRUD
  const addResource = (sectionIndex: number, topicIndex: number) => {
    setSections((prev) =>
      prev.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              topics: s.topics.map((t, ti) =>
                ti === topicIndex
                  ? { ...t, resources: [...t.resources, createEmptyResource()] }
                  : t,
              ),
            }
          : s,
      ),
    );
  };

  const updateResource = (
    sectionIndex: number,
    topicIndex: number,
    resIndex: number,
    updates: Partial<RoadmapResource>,
  ) => {
    setSections((prev) =>
      prev.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              topics: s.topics.map((t, ti) =>
                ti === topicIndex
                  ? {
                      ...t,
                      resources: t.resources.map((r, ri) =>
                        ri === resIndex ? { ...r, ...updates } : r,
                      ),
                    }
                  : t,
              ),
            }
          : s,
      ),
    );
  };

  const removeResource = (
    sectionIndex: number,
    topicIndex: number,
    resIndex: number,
  ) => {
    setSections((prev) =>
      prev.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              topics: s.topics.map((t, ti) =>
                ti === topicIndex
                  ? {
                      ...t,
                      resources: t.resources.filter((_, ri) => ri !== resIndex),
                    }
                  : t,
              ),
            }
          : s,
      ),
    );
  };

  // Subtopic CRUD
  const addSubtopic = (sectionIndex: number, topicIndex: number) => {
    setSections((prev) =>
      prev.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              topics: s.topics.map((t, ti) =>
                ti === topicIndex
                  ? { ...t, subtopics: [...t.subtopics, createEmptySubtopic()] }
                  : t,
              ),
            }
          : s,
      ),
    );
  };

  const updateSubtopic = (
    sectionIndex: number,
    topicIndex: number,
    stIndex: number,
    name: string,
  ) => {
    setSections((prev) =>
      prev.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              topics: s.topics.map((t, ti) =>
                ti === topicIndex
                  ? {
                      ...t,
                      subtopics: t.subtopics.map((st, sti) =>
                        sti === stIndex ? { ...st, name } : st,
                      ),
                    }
                  : t,
              ),
            }
          : s,
      ),
    );
  };

  const removeSubtopic = (
    sectionIndex: number,
    topicIndex: number,
    stIndex: number,
  ) => {
    setSections((prev) =>
      prev.map((s, si) =>
        si === sectionIndex
          ? {
              ...s,
              topics: s.topics.map((t, ti) =>
                ti === topicIndex
                  ? {
                      ...t,
                      subtopics: t.subtopics.filter(
                        (_, sti) => sti !== stIndex,
                      ),
                    }
                  : t,
              ),
            }
          : s,
      ),
    );
  };

const toggleSection = (index: number) => {
  setExpandedSections((prev) => {
    const next = new Set(prev);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    return next;
  });
};

const toggleTopic = (topicId: string) => {
  setExpandedTopics((prev) => {
    const next = new Set(prev);
    if (next.has(topicId)) {
      next.delete(topicId);
    } else {
      next.add(topicId);
    }
    return next;
  });
};

  // Drag-and-drop state
  const [dragType, setDragType] = useState<'section' | 'topic' | null>(null);
  const [dragSource, setDragSource] = useState<{
    sectionIndex: number;
    topicIndex?: number;
  } | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{
    sectionIndex: number;
    topicIndex?: number;
  } | null>(null);

  const handleSectionDragStart = (e: React.DragEvent, sectionIndex: number) => {
    setDragType('section');
    setDragSource({ sectionIndex });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };

  const handleSectionDragOver = (e: React.DragEvent, sectionIndex: number) => {
    if (dragType !== 'section') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget({ sectionIndex });
  };

  const handleSectionDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (dragType !== 'section' || !dragSource) return;
    const fromIndex = dragSource.sectionIndex;
    if (fromIndex === targetIndex) return;
    setSections((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    // Update expanded sections indices
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

  const handleTopicDragStart = (
    e: React.DragEvent,
    sectionIndex: number,
    topicIndex: number,
  ) => {
    e.stopPropagation();
    setDragType('topic');
    setDragSource({ sectionIndex, topicIndex });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };

  const handleTopicDragOver = (
    e: React.DragEvent,
    sectionIndex: number,
    topicIndex: number,
  ) => {
    if (dragType !== 'topic') return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget({ sectionIndex, topicIndex });
  };

  const handleTopicDrop = (
    e: React.DragEvent,
    targetSectionIndex: number,
    targetTopicIndex: number,
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
    if (fromSI === targetSectionIndex && fromTI === targetTopicIndex) return;
    setSections((prev) => {
      const next = prev.map((s) => ({ ...s, topics: [...s.topics] }));
      const [movedTopic] = next[fromSI].topics.splice(fromTI, 1);
      next[targetSectionIndex].topics.splice(targetTopicIndex, 0, movedTopic);
      return next;
    });
    resetDrag();
  };

  const resetDrag = () => {
    setDragType(null);
    setDragSource(null);
    setDragOverTarget(null);
  };

  const handleSave = () => {
    if (!name.trim()) {
toast.error('Name required', {
  description: 'Please enter a roadmap name.',
});
      return;
    }
toast.success(`${isEditing ? 'Roadmap updated' : 'Roadmap created'}`, {
  description: `"${name}" has been saved.`,
});
    navigate('/admin/roadmaps');
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
            onClick={handleSave}
            className='bg-primary hover:bg-primary/90 text-primary-foreground gap-2'
          >
            <Save className='h-4 w-4' /> Save
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

          {/* Toolbar: search + expand/collapse */}
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
            const section = sections[si];
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
                className={`rounded-lg border bg-surface-1/30 overflow-hidden transition-colors ${
                  dragOverTarget?.sectionIndex === si &&
                  dragType === 'section' &&
                  dragSource?.sectionIndex !== si
                    ? 'border-primary/60 ring-1 ring-primary/30'
                    : 'border-border/40'
                }`}
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
                    {/* Section description */}
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
                          className={`rounded-lg border bg-surface-2/30 overflow-hidden transition-colors ${
                            dragOverTarget?.sectionIndex === si &&
                            dragOverTarget?.topicIndex === ti &&
                            dragType === 'topic'
                              ? 'border-primary/60 ring-1 ring-primary/30'
                              : 'border-border/30'
                          }`}
                          onDragOver={(e) => handleTopicDragOver(e, si, ti)}
                          onDrop={(e) => handleTopicDrop(e, si, ti)}
                          onDragEnd={resetDrag}
                        >
                          {/* Topic header */}
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

                          {/* Topic expanded content */}
                          {topicExpanded && (
                            <div className='px-3 pb-3 space-y-3 border-t border-border/20 pt-3'>
                              {/* Description */}
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

                              {/* Subtopics */}
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
                                  {topic.subtopics.map((st, sti) => (
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
                                            sti,
                                            e.target.value,
                                          )
                                        }
                                        placeholder='Subtopic name'
                                        className='bg-transparent border-none shadow-none h-5 text-[11px] px-0 flex-1 focus-visible:ring-0'
                                      />
                                      <button
                                        onClick={() =>
                                          removeSubtopic(si, ti, sti)
                                        }
                                        className='text-muted-foreground hover:text-destructive shrink-0'
                                      >
                                        <Trash2 className='h-2.5 w-2.5' />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Resources */}
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
