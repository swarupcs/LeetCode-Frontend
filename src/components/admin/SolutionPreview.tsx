import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { EditorView } from '@codemirror/view';
import { syntaxHighlighting } from '@codemirror/language';
import { resolveTheme } from '@/components/editor/editorThemes';
import type { SolutionData } from './SolutionEditor';

interface SolutionPreviewProps {
  solution: SolutionData;
}

const languages = [
  { id: 'python', label: 'Python', icon: '🐍' },
  { id: 'javascript', label: 'JavaScript', icon: '⚡' },
  { id: 'java', label: 'Java', icon: '☕' },
];

function getLanguageExtension(language: string) {
  switch (language) {
    case 'python':
      return python();
    case 'javascript':
      return javascript();
    case 'java':
      return java();
    default:
      return python();
  }
}

/** Very basic markdown → JSX renderer for explanation text */
function renderMarkdown(text: string) {
  if (!text.trim()) {
    return (
      <p className='text-muted-foreground/60 italic text-sm'>
        No explanation provided yet.
      </p>
    );
  }

  const lines = text.split('\n');

  return (
    <div className='space-y-2 text-sm leading-relaxed text-foreground/90'>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className='h-2' />;

        // Numbered list items
        const listMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (listMatch) {
          return (
            <div key={i} className='flex gap-2.5'>
              <span className='text-primary font-semibold text-xs mt-0.5 min-w-[18px]'>
                {listMatch[1]}.
              </span>
              <span>{renderInline(listMatch[2])}</span>
            </div>
          );
        }

        // Bullet items
        if (line.match(/^[-*]\s+/)) {
          return (
            <div key={i} className='flex gap-2.5'>
              <span className='text-primary mt-1.5 min-w-[18px]'>•</span>
              <span>{renderInline(line.replace(/^[-*]\s+/, ''))}</span>
            </div>
          );
        }

        return <p key={i}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

/** Inline markdown: **bold**, `code` */
function renderInline(text: string) {
  const parts: React.ReactNode[] = [];
  // Match **bold** and `code`
  const regex = /(\*\*(.+?)\*\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[2]) {
      parts.push(
        <strong key={match.index} className='font-semibold text-foreground'>
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      parts.push(
        <code
          key={match.index}
          className='px-1.5 py-0.5 rounded bg-surface-3 text-primary font-mono text-xs'
        >
          {match[3]}
        </code>,
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function SolutionPreview({ solution }: SolutionPreviewProps) {
  const [codeTab, setCodeTab] = useState('python');
  const { theme, highlighting } = resolveTheme('algodrill');

  const availableLanguages = languages.filter((lang) =>
    solution.code[lang.id]?.trim(),
  );

  const hasAnything =
    solution.approach ||
    solution.timeComplexity ||
    solution.spaceComplexity ||
    solution.explanation.trim() ||
    availableLanguages.length > 0;

  const extensions = useMemo(
    () => [
      getLanguageExtension(codeTab),
      EditorView.lineWrapping,
      syntaxHighlighting(highlighting),
      EditorView.editable.of(false),
    ],
    [codeTab, highlighting],
  );

  if (!hasAnything) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-muted-foreground/60'>
        <p className='text-sm'>Nothing to preview yet.</p>
        <p className='text-xs mt-1'>
          Fill in the solution details to see a preview.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Metadata badges */}
      {(solution.approach ||
        solution.timeComplexity ||
        solution.spaceComplexity) && (
        <Card className='bg-surface-1 border-border/50'>
          <CardContent className='p-4'>
            <div className='flex flex-wrap gap-2'>
              {solution.approach && (
                <Badge className='bg-primary/15 text-primary border-primary/20 text-xs font-medium'>
                  {solution.approach}
                </Badge>
              )}
              {solution.timeComplexity && (
                <Badge
                  variant='outline'
                  className='border-border/50 text-muted-foreground font-mono text-xs'
                >
                  ⏱ Time: {solution.timeComplexity}
                </Badge>
              )}
              {solution.spaceComplexity && (
                <Badge
                  variant='outline'
                  className='border-border/50 text-muted-foreground font-mono text-xs'
                >
                  💾 Space: {solution.spaceComplexity}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Explanation */}
      {solution.explanation.trim() && (
        <div>
          <h3 className='text-sm font-semibold text-foreground mb-3 flex items-center gap-2'>
            <span className='h-1 w-1 rounded-full bg-primary' />
            Explanation
          </h3>
          <Card className='bg-surface-1 border-border/50'>
            <CardContent className='p-5'>
              {renderMarkdown(solution.explanation)}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Code with syntax highlighting */}
      {availableLanguages.length > 0 && (
        <div>
          <h3 className='text-sm font-semibold text-foreground mb-3 flex items-center gap-2'>
            <span className='h-1 w-1 rounded-full bg-primary' />
            Solution Code
          </h3>
          <Card className='bg-surface-1 border-border/50 overflow-hidden'>
            <Tabs
              value={
                availableLanguages.find((l) => l.id === codeTab)
                  ? codeTab
                  : availableLanguages[0]?.id || 'python'
              }
              onValueChange={setCodeTab}
            >
              <div className='border-b border-border/50 px-4 pt-2'>
                <TabsList className='bg-transparent h-8 p-0 gap-0'>
                  {availableLanguages.map((lang) => (
                    <TabsTrigger
                      key={lang.id}
                      value={lang.id}
                      className='data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none text-muted-foreground rounded-none text-xs gap-1.5 px-3 h-8'
                    >
                      <span>{lang.icon}</span>
                      {lang.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {availableLanguages.map((lang) => (
                <TabsContent key={lang.id} value={lang.id} className='mt-0'>
                  <ScrollArea className='max-h-[400px]'>
                    <CodeMirror
                      value={solution.code[lang.id] || ''}
                      extensions={extensions}
                      theme={theme}
                      editable={false}
                      basicSetup={{
                        lineNumbers: true,
                        highlightActiveLineGutter: false,
                        highlightActiveLine: false,
                        foldGutter: true,
                      }}
                      className='text-sm'
                    />
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>
      )}
    </div>
  );
}
