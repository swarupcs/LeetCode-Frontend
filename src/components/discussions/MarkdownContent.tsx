import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={cn('markdown-content', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children, ...props }) => (
            <pre
              className='my-3 p-4 rounded-lg bg-surface-2 border border-border/50 text-xs font-mono overflow-x-auto'
              {...props}
            >
              {children}
            </pre>
          ),
          code: ({ className: codeClassName, children, ...props }) => {
            const isInline = !codeClassName;
            if (isInline) {
              return (
                <code
                  className='px-1.5 py-0.5 rounded-md bg-surface-2 border border-border/40 text-xs font-mono text-primary'
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={cn(codeClassName, 'text-xs')} {...props}>
                {children}
              </code>
            );
          },
          table: ({ children, ...props }) => (
            <div className='my-3 overflow-x-auto rounded-lg border border-border/50'>
              <table className='w-full text-xs border-collapse' {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className='bg-surface-2' {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th
              className='px-3 py-2 text-left font-semibold text-foreground border-b border-border/50'
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className='px-3 py-2 text-muted-foreground border-b border-border/30'
              {...props}
            >
              {children}
            </td>
          ),
          a: ({ children, ...props }) => (
            <a
              className='text-primary hover:underline'
              target='_blank'
              rel='noopener noreferrer'
              {...props}
            >
              {children}
            </a>
          ),
          ul: ({ children, ...props }) => (
            <ul className='my-2 ml-4 list-disc space-y-1' {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className='my-2 ml-4 list-decimal space-y-1' {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className='text-sm text-foreground/90' {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className='my-3 pl-4 border-l-2 border-primary/40 text-muted-foreground italic'
              {...props}
            >
              {children}
            </blockquote>
          ),
          h1: ({ children, ...props }) => (
            <h1 className='text-xl font-bold mt-4 mb-2' {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className='text-lg font-bold mt-3 mb-2' {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className='text-base font-semibold mt-3 mb-1' {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className='mb-2 last:mb-0' {...props}>
              {children}
            </p>
          ),
          hr: (props) => <hr className='my-4 border-border/50' {...props} />,
          strong: ({ children, ...props }) => (
            <strong className='font-semibold text-foreground' {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className='italic' {...props}>
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
