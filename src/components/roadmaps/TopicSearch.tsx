import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Roadmap, RoadmapTopic } from '@/data/roadmaps';
import { useGetRoadmaps } from '@/hooks/roadmaps/useGetRoadmaps';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  roadmap: Roadmap;
  sectionName: string;
  topic: RoadmapTopic;
  matchedSubtopics: string[];
  matchType: 'topic' | 'subtopic' | 'both';
}

const difficultyColor: Record<string, string> = {
  beginner:
    'bg-[hsl(var(--emerald)/0.1)] text-[hsl(var(--emerald))] border-[hsl(var(--emerald)/0.2)]',
  intermediate:
    'bg-[hsl(var(--amber)/0.1)] text-[hsl(var(--amber))] border-[hsl(var(--amber)/0.2)]',
  advanced:
    'bg-[hsl(var(--rose)/0.1)] text-[hsl(var(--rose))] border-[hsl(var(--rose)/0.2)]',
};

export function TopicSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const { roadmaps } = useGetRoadmaps();
  const published = roadmaps as unknown as Roadmap[];

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2 || published.length === 0) return [];

    const matches: SearchResult[] = [];
    for (const roadmap of published) {
      for (const section of roadmap.sections) {
        for (const topic of section.topics) {
          const topicMatch =
            topic.name.toLowerCase().includes(q) ||
            topic.description.toLowerCase().includes(q);
          const matchedSubs = topic.subtopics
            .filter((st) => st.name.toLowerCase().includes(q))
            .map((st) => st.name);

          if (topicMatch || matchedSubs.length > 0) {
            matches.push({
              roadmap,
              sectionName: section.name,
              topic,
              matchedSubtopics: matchedSubs,
              matchType:
                topicMatch && matchedSubs.length > 0
                  ? 'both'
                  : topicMatch
                    ? 'topic'
                    : 'subtopic',
            });
          }
        }
      }
    }
    return matches.slice(0, 50);
  }, [query, published]);

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className='relative w-full'>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search topics across all roadmaps...'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className='pl-10 pr-9 bg-surface-1 border-border/50 h-11'
        />
        {query && (
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground'
            onClick={handleClear}
          >
            <X className='h-3.5 w-3.5' />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className='absolute z-50 top-full mt-2 w-full rounded-lg border border-border/50 bg-card shadow-lg overflow-hidden'
          >
            <div className='px-3 py-2 border-b border-border/30 flex items-center justify-between'>
              <span className='text-xs text-muted-foreground'>
                {results.length === 0
                  ? 'No results found'
                  : `${results.length}${results.length === 50 ? '+' : ''} result${results.length !== 1 ? 's' : ''}`}
              </span>
              <Button
                variant='ghost'
                size='sm'
                className='h-6 text-xs px-2'
                onClick={handleClear}
              >
                Close
              </Button>
            </div>

            {results.length > 0 && (
              <ScrollArea className='max-h-[400px]'>
                <div className='p-2 space-y-1'>
                  {results.map((result, i) => (
                    <Link
                      key={`${result.roadmap.id}-${result.topic.id}-${i}`}
                      to={`/roadmaps/${result.roadmap.slug}`}
                      onClick={handleClear}
                      className='block rounded-md px-3 py-2.5 hover:bg-surface-2 transition-colors group'
                    >
                      <div className='flex items-start justify-between gap-2'>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-0.5'>
                            <span className='text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate'>
                              {highlightMatch(result.topic.name, query)}
                            </span>
                            <Badge
                              variant='outline'
                              className={`text-[9px] shrink-0 ${difficultyColor[result.topic.difficulty]}`}
                            >
                              {result.topic.difficulty}
                            </Badge>
                          </div>
                          <div className='flex items-center gap-1.5 text-[11px] text-muted-foreground'>
                            <span className='font-medium'>
                              {result.roadmap.name}
                            </span>
                            <span>›</span>
                            <span>{result.sectionName}</span>
                          </div>
                          {result.matchedSubtopics.length > 0 && (
                            <div className='mt-1 flex flex-wrap gap-1'>
                              {result.matchedSubtopics
                                .slice(0, 3)
                                .map((st, j) => (
                                  <span
                                    key={j}
                                    className='text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary'
                                  >
                                    {highlightMatch(st, query)}
                                  </span>
                                ))}
                              {result.matchedSubtopics.length > 3 && (
                                <span className='text-[10px] px-1.5 py-0.5 text-muted-foreground'>
                                  +{result.matchedSubtopics.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <ArrowRight className='h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 mt-1 transition-colors' />
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close */}
      {isOpen && query.length >= 2 && (
        <div className='fixed inset-0 z-40' onClick={handleClear} />
      )}
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className='underline decoration-primary/50 font-semibold'>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}
