import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownContent } from './MarkdownContent';
import { Pencil, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxLength?: number;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your comment...',
  minHeight = '100px',
  maxLength,
  className,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>('write');

  return (
    <div
      className={cn(
        'rounded-lg border border-border/50 bg-surface-1 overflow-hidden',
        className,
      )}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className='flex items-center justify-between border-b border-border/30 px-3 py-1'>
          <TabsList className='h-8 bg-transparent p-0 gap-1'>
            <TabsTrigger
              value='write'
              className='h-7 px-3 text-xs data-[state=active]:bg-surface-2 data-[state=active]:shadow-none rounded-md'
            >
              <Pencil className='h-3 w-3 mr-1.5' />
              Write
            </TabsTrigger>
            <TabsTrigger
              value='preview'
              className='h-7 px-3 text-xs data-[state=active]:bg-surface-2 data-[state=active]:shadow-none rounded-md'
            >
              <Eye className='h-3 w-3 mr-1.5' />
              Preview
            </TabsTrigger>
          </TabsList>
          <span className='text-[10px] text-muted-foreground'>
            Markdown supported
          </span>
        </div>

        <TabsContent value='write' className='m-0'>
          <Textarea
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              'border-0 rounded-none bg-transparent resize-none font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0',
            )}
            style={{ minHeight }}
            maxLength={maxLength}
          />
        </TabsContent>

        <TabsContent value='preview' className='m-0'>
          <div className='px-4 py-3 overflow-y-auto' style={{ minHeight }}>
            {value.trim() ? (
              <MarkdownContent
                content={value}
                className='text-sm text-foreground/90'
              />
            ) : (
              <p className='text-sm text-muted-foreground italic'>
                Nothing to preview yet. Start writing in the Write tab.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
