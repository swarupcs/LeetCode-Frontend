import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CodeEditor({ language, onChange, codeSnippets }) {
  const [code, setCode] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  // Update code when language or codeSnippets change.
  useEffect(() => {
    if (codeSnippets && Object.keys(codeSnippets).length > 0) {
      // Convert language to uppercase to match keys in codeSnippets object.
      const snippet = codeSnippets[language.toUpperCase()] || '';
      setCode(snippet);
    } else {
      setCode('');
    }
  }, [language, codeSnippets]);

  // Handle editor mount.
  const handleEditorDidMount = (editor, monaco) => {
    console.log('Editor mounted', editor, monaco);
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsEditorReady(true);

    // Configure editor settings.
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'on',
      lineNumbers: 'on',
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
    });

    // Focus the editor shortly after mount.
    setTimeout(() => {
      editor.focus();
    }, 100);
  };

  // Handle code change.
  const handleEditorChange = (value) => {
    setCode(value || '');
    if (onChange) {
      onChange(value);
    }
  };

  // Map language to Monaco language.
  const getMonacoLanguage = (lang) => {
    switch (lang) {
      case 'javascript':
        return 'javascript';
      case 'python':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
        return 'cpp';
      default:
        return 'javascript';
    }
  };

  // Global error handler for ResizeObserver issues.
  useEffect(() => {
    const handleError = (event) => {
      if (
        event.message ===
          'ResizeObserver loop completed with undelivered notifications.' ||
        event.message === 'ResizeObserver loop limit exceeded'
      ) {
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <div ref={containerRef} className='h-full w-full overflow-hidden relative'>
      {!isEditorReady && (
        <div className='h-full w-full p-4 bg-zinc-900 absolute top-0 left-0 z-10'>
          <Skeleton className='h-6 w-full mb-2 bg-zinc-800' />
          <Skeleton className='h-6 w-3/4 mb-2 bg-zinc-800' />
          <Skeleton className='h-6 w-5/6 mb-2 bg-zinc-800' />
          <Skeleton className='h-6 w-2/3 mb-2 bg-zinc-800' />
        </div>
      )}
      <Editor
        height='100%'
        width='100%'
        language={getMonacoLanguage(language)}
        value={code}
        theme='vs-dark'
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly: false,
          minimap: { enabled: false },
          scrollBeyondLastLine: false, // Enable scrolling beyond last line
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          tabSize: 2,
          wordWrap: 'off', // Disable word wrap to ensure horizontal scrolling
          overviewRulerBorder: false, // Optional: removes the border in the overview ruler
          scrollbar: {
            vertical: 'auto', // Ensure vertical scrollbar appears when needed
            horizontalSliderSize: 10, // Make horizontal scrollbar more visible
            verticalSliderSize: 10, // Make vertical scrollbar more visible
            horizontalScrollbarSize: 10,
            verticalScrollbarSize: 10,
            alwaysConsumeMouseWheel: false, // Better scrolling behavior
          },
        }}
        loading={
          <div className='flex items-center justify-center h-full'>
            Loading editor...
          </div>
        }
        className='monaco-editor-container'
      />
    </div>
  );
}
