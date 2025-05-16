import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Skeleton } from '@/components/ui/skeleton';

export default function CodeEditor({ language, onChange, codeSnippets }) {
  const [code, setCode] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const isInitialLoad = useRef(true);
  const lastLanguage = useRef(language);

  // Update code ONLY on initial load or when language changes
  useEffect(() => {
    // If this is the initial load OR the language has changed
    if (isInitialLoad.current || lastLanguage.current !== language) {
      if (codeSnippets && Object.keys(codeSnippets).length > 0) {
        // Convert language to uppercase to match keys in codeSnippets object
        const snippet = codeSnippets[language.toUpperCase()] || '';
        setCode(snippet);

        // Always call onChange to update parent component when language changes
        if (onChange) {
          onChange(snippet);
        }
      } else {
        setCode('');
        if (onChange) {
          onChange('');
        }
      }

      // Update the last language reference
      lastLanguage.current = language;

      // No longer the initial load
      isInitialLoad.current = false;
    }
  }, [language, codeSnippets, onChange]);

  // Handle editor mount
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsEditorReady(true);

    // Configure editor settings
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

    // Focus the editor shortly after mount
    setTimeout(() => {
      editor.focus();
    }, 100);
  };

  // Handle code change from user editing
  const handleEditorChange = (value) => {
    setCode(value || '');
    if (onChange) {
      onChange(value);
    }
  };

  // Map language to Monaco language
  const getMonacoLanguage = (lang) => {
    switch (lang?.toLowerCase()) {
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

  // Global error handler for ResizeObserver issues
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
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          tabSize: 2,
          wordWrap: 'off',
          overviewRulerBorder: false,
          scrollbar: {
            vertical: 'auto',
            horizontalSliderSize: 10,
            verticalSliderSize: 10,
            horizontalScrollbarSize: 10,
            verticalScrollbarSize: 10,
            alwaysConsumeMouseWheel: false,
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
