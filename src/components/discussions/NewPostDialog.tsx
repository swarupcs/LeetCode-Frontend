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
import { X } from 'lucide-react';
import type { DiscussionCategory } from '@/data/discussions';

interface NewPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (post: {
    title: string;
    content: string;
    category: DiscussionCategory;
    tags: string[];
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
    });
    setTitle('');
    setContent('');
    setCategory('general');
    setTags([]);
    onOpenChange(false);
  };

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] glass-card border-border/50'>
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
              className='min-h-[160px] bg-surface-1 border-border/50 resize-none font-mono text-sm'
              maxLength={5000}
            />
            <p className='text-xs text-muted-foreground text-right'>
              {content.length}/5000
            </p>
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
