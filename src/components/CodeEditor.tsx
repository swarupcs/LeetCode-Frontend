import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { EditorView } from '@codemirror/view';
import { syntaxHighlighting } from '@codemirror/language';
import {
  resolveTheme,
  editorThemes,
  type EditorThemeId,
  type EditorThemeMeta,
} from '@/components/editor/editorThemes';

// Re-export for consumers
export { editorThemes };
export type { EditorThemeId, EditorThemeMeta };

// ─── Language resolver ───────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  editorTheme?: EditorThemeId;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  editorTheme = 'algodrill',
}: CodeEditorProps) {
  const { theme, highlighting } = resolveTheme(editorTheme);
  const isDark = editorThemes.find((t) => t.id === editorTheme)?.dark ?? true;

  const extensions = useMemo(
    () => [
      getLanguageExtension(language),
      EditorView.lineWrapping,
      syntaxHighlighting(highlighting),
    ],
    [language, highlighting],
  );

  return (
    <div className={`h-full ${isDark ? '' : 'bg-white'}`}>
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={extensions}
        theme={theme}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          indentOnInput: true,
          tabSize: 4,
        }}
        className='h-full overflow-auto'
      />
    </div>
  );
}
