import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Skeleton } from '@/components/ui/skeleton';

export function CodeEditor({ language, onChange, codeSnippets }) {
  const [code, setCode] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const lastLanguage = useRef(language);
  const isInitialLoad = useRef(true);

  // Initialize with code snippets on first load and language change
  useEffect(() => {
    // Generate a storage key based on both language and problem id
    // Extract problem ID from URL path
    const pathParts = window.location.pathname.split('/');
    const problemId = pathParts[pathParts.length - 1];
    const storageKey = `editor_code_${problemId}_${language.toLowerCase()}`;
    
    // Try to load from localStorage first
    const savedCode = localStorage.getItem(storageKey);
    
    // If we have saved code for this language and problem, use it
    if (savedCode) {
      setCode(savedCode);
      if (onChange) {
        onChange(savedCode);
      }
    } 
    // Otherwise, load from codeSnippets when language changes or on initial load
    else if (lastLanguage.current !== language || isInitialLoad.current) {
      const snippet = (codeSnippets && codeSnippets[language.toLowerCase()]) || '';
      setCode(snippet);
      if (onChange) {
        onChange(snippet);
      }
      // Save to localStorage for future use
      if (snippet) {
        localStorage.setItem(storageKey, snippet);
      }
    }
    
    lastLanguage.current = language;
    isInitialLoad.current = false;
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

    setTimeout(() => {
      editor.focus();
    }, 100);
  };

  // Handle code change from user editing
  const handleEditorChange = (value) => {
    const newCode = value || '';
    setCode(newCode);
    
    // Extract problem ID from URL path
    const pathParts = window.location.pathname.split('/');
    const problemId = pathParts[pathParts.length - 1];
    const storageKey = `editor_code_${problemId}_${language.toLowerCase()}`;
    
    // Save to localStorage whenever code changes
    localStorage.setItem(storageKey, newCode);
    
    if (onChange) {
      onChange(newCode);
    }
  };


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