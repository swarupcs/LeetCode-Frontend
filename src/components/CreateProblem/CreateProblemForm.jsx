import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputField from './InputField';
import CodeSnippet from './CodeSnippet';
import TestCase from './TestCase';
import Examples from './Examples';
import { PlusCircle, Save, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
// import { toast } from "@/hooks/use-toast"
// import { useTheme } from "next-themes"

// Define the problem structure
// interface Problem {
//   title: string
//   description: string
//   difficulty: "EASY" | "MEDIUM" | "HARD"
//   tags: string[]
//   examples: {
//     [language: string]: {
//       input: string
//       output: string
//       explanation: string
//     }
//   }
//   constraints: string
//   testcases: {
//     input: string
//     output: string
//   }[]
//   codeSnippets: {
//     [language: string]: string
//   }
//   referenceSolutions: {
//     [language: string]: string
//   }
// }

const SUPPORTED_LANGUAGES = ['PYTHON', 'JAVASCRIPT', 'JAVA'];

export default function CreateProblemForm() {
  const [problem, setProblem] = useState({
    title: '',
    description: '',
    difficulty: 'EASY',
    tags: [],
    examples: [
      { input: '', output: '', explanation: '' }, // Start with one example
    ],
    constraints: '',
    testcases: [{ input: '', output: '' }],
    codeSnippets: {
      PYTHON:
        'def is_palindrome(n):\n    # Write your code here\n    return False\n\nimport sys\nn = int(sys.stdin.read())\nprint(str(is_palindrome(n)).lower())',
      JAVASCRIPT:
        "const fs = require('fs');\n\nfunction isPalindrome(n) {\n    // Write your code here\n    return false;\n}\n\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst n = Number(input);\nconsole.log(isPalindrome(n));",
      JAVA: 'import java.util.Scanner;\n\npublic class Main {\n    public static boolean isPalindrome(int n) {\n        // Write your code here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(isPalindrome(n));\n    }\n}',
    },
    referenceSolutions: {
      PYTHON: '',
      JAVASCRIPT: '',
      JAVA: '',
    },
  });

  const [newTag, setNewTag] = useState('');
  // const { theme } = useTheme()

  const [exampleCount, setExampleCount] = useState(1);

  // Update problem field
  const updateProblem = (field, value) => {
    setProblem((prev) => ({ ...prev, [field]: value }));
  };

  // Add a new tag
  const addTag = () => {
    if (newTag && !problem.tags.includes(newTag)) {
      updateProblem('tags', [...problem.tags, newTag]);
      setNewTag('');
    }
  };

  // Remove a tag
  const removeTag = (tag) => {
    updateProblem(
      'tags',
      problem.tags.filter((t) => t !== tag)
    );
  };

  // Add a new test case
  const addTestCase = () => {
    updateProblem('testcases', [
      ...problem.testcases,
      { input: '', output: '' },
    ]);
  };

  // Update a test case
  const updateTestCase = (index, field, value) => {
    const updatedTestCases = [...problem.testcases];
    updatedTestCases[index] = {
      ...updatedTestCases[index],
      [field]: value,
    };
    updateProblem('testcases', updatedTestCases);
  };

  // Remove a test case
  const removeTestCase = (index) => {
    const updatedTestCases = problem.testcases.filter((_, i) => i !== index);
    updateProblem('testcases', updatedTestCases);
  };

  // Update code snippet for a language
  const updateCodeSnippet = (language, code) => {
    setProblem((prev) => ({
      ...prev,
      codeSnippets: {
        ...prev.codeSnippets,
        [language]: code,
      },
    }));
  };

  // Update reference solution for a language
  const updateReferenceSolution = (language, code) => {
    setProblem((prev) => ({
      ...prev,
      referenceSolutions: {
        ...prev.referenceSolutions,
        [language]: code,
      },
    }));
  };

  // Update example for a language
  const updateExample = (language, field, value) => {
    setProblem((prev) => ({
      ...prev,
      examples: {
        ...prev.examples,
        [language]: {
          ...prev.examples[language],
          [field]: value,
        },
      },
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!problem.title || !problem.description) {
      toast.warning('Missing required fields');
      return;
    }

    // Convert to JSON
    const problemJson = JSON.stringify(problem, null, 2);
    console.log("problemJson ", problemJson);

    // Here you would typically send this to your API
    toast.success( 'Your problem has been created and saved.');
  };

  return (
    <div className='container mx-auto py-8 bg-slate-900 text-slate-50'>
      <h1 className='text-3xl font-bold mb-6'>Create New Problem</h1>

      <div className='space-y-8'>
        {/* Basic Information */}
        <Card>
          <CardContent className='pt-6'>
            <h2 className='text-xl font-semibold mb-4'>Basic Information</h2>
            <div className='space-y-4'>
              <InputField
                label='Title'
                value={problem.title}
                onChange={(value) => updateProblem('title', value)}
                placeholder='Enter problem title'
                required
              />

              <InputField
                label='Description'
                value={problem.description}
                onChange={(value) => updateProblem('description', value)}
                placeholder='Enter problem description'
                multiline
                required
              />

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Difficulty
                  </label>
                  <Select
                    value={problem.difficulty}
                    onValueChange={(value) =>
                      updateProblem('difficulty', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select difficulty' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='EASY'>Easy</SelectItem>
                      <SelectItem value='MEDIUM'>Medium</SelectItem>
                      <SelectItem value='HARD'>Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>Tags</label>
                  <div className='flex gap-2'>
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder='Add a tag'
                      className='flex-1'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type='button' onClick={addTag} size='sm'>
                      Add
                    </Button>
                  </div>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    {problem.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant='secondary'
                        className='flex items-center gap-1'
                      >
                        {tag}
                        <button
                          type='button'
                          onClick={() => removeTag(tag)}
                          className='text-xs hover:text-destructive'
                        >
                          <Trash2 size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <InputField
                label='Constraints'
                value={problem.constraints}
                onChange={(value) => updateProblem('constraints', value)}
                placeholder='Enter problem constraints'
                multiline
              />
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <Card>
          <CardContent className='pt-6'>
            <h2 className='text-xl font-semibold mb-4'>Examples</h2>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>Examples</h2>
              <Button
                onClick={() =>
                  updateProblem('examples', [
                    ...problem.examples,
                    { input: '', output: '', explanation: '' }, // Add a new example
                  ])
                }
                size='sm'
                variant='outline'
              >
                <PlusCircle size={16} className='mr-2' />
                Add Example
              </Button>
            </div>
            {problem.examples.map((example, index) => (
              <Examples
                key={index}
                example={example}
                onChange={(field, value) => {
                  const updatedExamples = [...problem.examples];
                  updatedExamples[index] = {
                    ...updatedExamples[index],
                    [field]: value,
                  };
                  updateProblem('examples', updatedExamples);
                }}
                onRemove={() => {
                  const updatedExamples = problem.examples.filter(
                    (_, i) => i !== index
                  );
                  updateProblem('examples', updatedExamples);
                }}
              />
            ))}
          </CardContent>
        </Card>

        {/* Test Cases */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>Test Cases</h2>
              <Button onClick={addTestCase} size='sm' variant='outline'>
                <PlusCircle size={16} className='mr-2' />
                Add Test Case
              </Button>
            </div>

            <div className='space-y-4'>
              {problem.testcases.map((testcase, index) => (
                <TestCase
                  key={index}
                  testCase={testcase}
                  index={index}
                  onChange={updateTestCase}
                  onRemove={removeTestCase}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Code Snippets */}
        <Card>
          <CardContent className='pt-6'>
            <h2 className='text-xl font-semibold mb-4'>Code Snippets</h2>
            <Tabs defaultValue='PYTHON'>
              <TabsList className='mb-4'>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <TabsTrigger key={lang} value={lang}>
                    {lang}
                  </TabsTrigger>
                ))}
              </TabsList>

              {SUPPORTED_LANGUAGES.map((lang) => (
                <TabsContent key={lang} value={lang}>
                  <CodeSnippet
                    code={problem.codeSnippets[lang]}
                    onChange={(code) => updateCodeSnippet(lang, code)}
                    language={lang.toLowerCase()}
                    label='Starter Code'
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Reference Solutions */}
        <Card>
          <CardContent className='pt-6'>
            <h2 className='text-xl font-semibold mb-4'>Reference Solutions</h2>
            <Tabs defaultValue='PYTHON'>
              <TabsList className='mb-4'>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <TabsTrigger key={lang} value={lang}>
                    {lang}
                  </TabsTrigger>
                ))}
              </TabsList>

              {SUPPORTED_LANGUAGES.map((lang) => (
                <TabsContent key={lang} value={lang}>
                  <CodeSnippet
                    code={problem.referenceSolutions[lang]}
                    onChange={(code) => updateReferenceSolution(lang, code)}
                    language={lang.toLowerCase()}
                    label='Reference Solution'
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className='flex justify-end'>
          <Button onClick={handleSubmit} size='lg'>
            <Save size={18} className='mr-2' />
            Save Problem
          </Button>
        </div>
      </div>
    </div>
  );
}
