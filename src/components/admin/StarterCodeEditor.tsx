import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StarterCodeEditorProps {
  starterCode: Record<string, string>;
  onChange: (starterCode: Record<string, string>) => void;
}

const languages = [
  { id: 'python', label: 'Python', icon: '🐍' },
  { id: 'javascript', label: 'JavaScript', icon: '⚡' },
  { id: 'java', label: 'Java', icon: '☕' },
];

export function StarterCodeEditor({
  starterCode,
  onChange,
}: StarterCodeEditorProps) {
  const [activeTab, setActiveTab] = useState('python');

  const updateCode = (lang: string, value: string) => {
    onChange({ ...starterCode, [lang]: value });
  };

  return (
    <div className='space-y-3'>
      <Label className='text-sm font-semibold text-foreground'>
        Starter Code
      </Label>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='bg-surface-2 border border-border/50 h-9'>
          {languages.map((lang) => (
            <TabsTrigger
              key={lang.id}
              value={lang.id}
              className='data-[state=active]:bg-surface-3 data-[state=active]:text-foreground text-muted-foreground text-xs gap-1.5 px-3 h-7'
            >
              <span>{lang.icon}</span>
              {lang.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {languages.map((lang) => (
          <TabsContent key={lang.id} value={lang.id} className='mt-3'>
            <Textarea
              value={starterCode[lang.id] || ''}
              onChange={(e) => updateCode(lang.id, e.target.value)}
              placeholder={`Write ${lang.label} starter code here...`}
              className='bg-surface-1 border-border/50 font-mono text-sm min-h-[200px] resize-y'
              spellCheck={false}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
