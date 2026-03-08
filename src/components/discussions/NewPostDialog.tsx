import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DiscussionCategory } from '@/data/discussions';

const CODE_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'go',
  'rust',
  'kotlin',
  'swift',
  'ruby',
  'php',
  'sql',
  'bash',
  'other',
];

interface NewPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (post: {
    title: string;
    content: string;
    category: DiscussionCategory;
    tags: string[];
    codeContent?: string;
    codeLanguage?: string;
    company?: string;
    position?: string;
  }) => void;
}

export function NewPostDialog({
  open,
  onOpenChange,
  onSubmit,
}: NewPostDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<DiscussionCategory>('general');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
      ...(showCode && codeContent.trim()
        ? { codeContent: codeContent.trim(), codeLanguage }
        : {}),
      ...(category === 'interview' && company.trim()
        ? { company: company.trim() }
        : {}),
      ...(category === 'interview' && position.trim()
        ? { position: position.trim() }
        : {}),
    });
    setTitle('');
    setContent('');
    setCategory('general');
    setTags([]);
    setShowCode(false);
    setCodeContent('');
    setCodeLanguage('javascript');
    setCompany('');
    setPosition('');
    onOpenChange(false);
  };

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto glass-card border-border/50'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-2'>
          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground'>
              Category
            </label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as DiscussionCategory)}
            >
              <SelectTrigger className='bg-surface-1 border-border/50'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='general'>💬 General</SelectItem>
                <SelectItem value='problem'>💡 Problem</SelectItem>
                <SelectItem value='interview'>🎯 Interview</SelectItem>
                <SelectItem value='career'>💼 Career</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interview-only fields */}
          {category === 'interview' && (
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-foreground'>
                  Company{' '}
                  <span className='text-muted-foreground font-normal'>
                    (optional)
                  </span>
                </label>
                <Input
                  placeholder='e.g. Google'
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className='bg-surface-1 border-border/50'
                  maxLength={60}
                />
              </div>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-foreground'>
                  Position{' '}
                  <span className='text-muted-foreground font-normal'>
                    (optional)
                  </span>
                </label>
                <Input
                  placeholder='e.g. SWE Intern'
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className='bg-surface-1 border-border/50'
                  maxLength={60}
                />
              </div>
            </div>
          )}

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground'>Title</label>
            <Input
              placeholder='Give your post a clear, descriptive title...'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='bg-surface-1 border-border/50'
              maxLength={120}
            />
            <p className='text-xs text-muted-foreground text-right'>
              {title.length}/120
            </p>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground'>
              Content
            </label>
            <Textarea
              placeholder='Share your thoughts, code, or question... (Markdown supported)'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className='min-h-[140px] bg-surface-1 border-border/50 resize-none text-sm'
              maxLength={5000}
            />
            <p className='text-xs text-muted-foreground text-right'>
              {content.length}/5000
            </p>
          </div>

          {/* Code snippet toggle */}
          <div className='space-y-2'>
            <button
              type='button'
              onClick={() => setShowCode((v) => !v)}
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors',
                showCode
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Code2 className='h-4 w-4' />
              {showCode ? 'Remove code snippet' : 'Add code snippet'}
            </button>

            {showCode && (
              <div className='space-y-2 rounded-md border border-border/50 p-3 bg-surface-1/50'>
                <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                  <SelectTrigger className='w-44 bg-surface-1 border-border/50 h-8 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CODE_LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang} className='text-xs'>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder='Paste your code here...'
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  className='min-h-[120px] bg-surface-1 border-border/50 resize-none font-mono text-xs'
                  maxLength={8000}
                />
                <p className='text-xs text-muted-foreground text-right'>
                  {codeContent.length}/8000
                </p>
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium text-foreground'>
              Tags{' '}
              <span className='text-muted-foreground font-normal'>
                (up to 5)
              </span>
            </label>
            <div className='flex gap-2'>
              <Input
                placeholder='Add a tag...'
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className='bg-surface-1 border-border/50'
                maxLength={20}
                disabled={tags.length >= 5}
              />
              <Button
                variant='outline'
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                className='shrink-0'
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className='flex flex-wrap gap-1.5 mt-2'>
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant='secondary'
                    className='text-xs gap-1 pr-1'
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className='ml-0.5 rounded-full hover:bg-foreground/10 p-0.5'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant='ghost' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
