// ─── Simple markdown renderer for AI responses ──────────────────

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className='font-semibold text-foreground'>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className='text-[10px] font-mono bg-surface-3 text-accent px-1 py-0.5 rounded'
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return (
        <em key={i} className='text-muted-foreground italic'>
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

export default function AIMarkdownContent({ content }: { content: string }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <>
      {lines.map((line, i) => {
        // Heading ##
        if (line.startsWith('## ')) {
          return (
            <div
              key={i}
              className='text-xs font-semibold text-foreground mt-3 mb-1.5 first:mt-0'
            >
              {line.slice(3)}
            </div>
          );
        }
        // Heading ###
        if (line.startsWith('### ')) {
          return (
            <div
              key={i}
              className='text-[11px] font-semibold text-foreground/90 mt-2 mb-1'
            >
              {line.slice(4)}
            </div>
          );
        }
        // Table separator
        if (/^\|[-\s|]+\|$/.test(line.trim())) {
          return null;
        }
        // Table row
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
          const cells = line
            .trim()
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim());
          return (
            <div
              key={i}
              className='grid gap-2 text-[10px] font-mono py-0.5'
              style={{ gridTemplateColumns: `repeat(${cells.length}, 1fr)` }}
            >
              {cells.map((cell, j) => (
                <span
                  key={j}
                  className={
                    j === 0 ? 'text-muted-foreground' : 'text-foreground'
                  }
                >
                  {renderInlineMarkdown(cell)}
                </span>
              ))}
            </div>
          );
        }
        // List items
        if (/^[-•]\s/.test(line.trim()) || /^\d+\.\s/.test(line.trim())) {
          const text = line.replace(/^[-•]\s*/, '').replace(/^\d+\.\s*/, '');
          return (
            <div key={i} className='flex items-start gap-1.5 my-0.5'>
              <span className='text-primary mt-1 text-[6px]'>●</span>
              <span>{renderInlineMarkdown(text)}</span>
            </div>
          );
        }
        // Empty line
        if (!line.trim()) {
          return <div key={i} className='h-1.5' />;
        }
        // Regular paragraph
        return (
          <div key={i} className='my-0.5'>
            {renderInlineMarkdown(line)}
          </div>
        );
      })}
    </>
  );
}
