import React, { Suspense, lazy } from 'react';
import { Card } from '@/components/ui/card';

// Lazy load the Monaco editor component
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

/**
 * CodeSnippet component that renders a Monaco editor
 * @param {Object} props
 * @param {string} props.code - The code to display in the editor
 * @param {function} props.onChange - Function to call when code changes
 * @param {string} props.language - The programming language for syntax highlighting
 * @param {string} props.label - Label for the code editor
 */
export default function CodeSnippet({ code, onChange, language, label }) {
  
  // console.log("code", code);
  
  return (
    <div className='space-y-2'>
      <label className='block text-sm font-medium'>{label}</label>
      <Card className='border rounded-md overflow-hidden'>
        <Suspense
          fallback={
            <div className='h-400 bg-slate-800 flex items-center justify-center'>
              <div className='animate-pulse text-slate-300'>
                Loading editor...
              </div>
            </div>
          }
        >
          <MonacoEditor
            height='400px'
            language={language}
            value={code}
            onChange={(newValue) => {
              // console.log('Updated code:', newValue);
              onChange(newValue);
            }}
            theme='vs-dark'
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              tabSize: 2,
              theme: 'vs-dark',
              backgroundColor: '#1e293b',
            }}
          />
        </Suspense>
      </Card>
      <p className='text-xs text-gray-500'>
        Use the code editor to write your {language} code.
      </p>
    </div>
  );
}
