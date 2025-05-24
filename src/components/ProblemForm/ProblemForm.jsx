import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InputField from './InputField';
import CodeSnippet from './CodeSnippet';
import TestCase from './TestCase';
import Examples from './Examples';
import { LucideLoader2, PlusCircle, Save, Trash2 } from 'lucide-react';
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
import { useCreateProblem } from '@/hooks/apis/createProblem/useCreateProblem';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import { useUpdateProblemDetails } from '@/hooks/apis/updateProblemDetails/useUpdateProblemDetails';
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

export default function ProblemForm({ mode, problemInfo, isSuccessProblemInfo }) {
  // const [problemDetails, setProblemDetails] = useState({
  //   problemNumber: 42,
  //   problem: {
  //     title: 'Reverse Number For Test-2-update',
  //     description:
  //       'Given an integer n, return the number obtained by reversing its digits. Handle negative numbers appropriately.',
  //     difficulty: 'EASY',
  //     tags: ['math', 'string', 'number-theory'],
  //     examples: [
  //       {
  //         input: '-123',
  //         output: '-321',
  //         explanation: 'Reversing -123 gives -321.',
  //       },
  //       {
  //         input: '456',
  //         output: '654',
  //         explanation: 'Reversing 456 gives 654.',
  //       },
  //     ],
  //     constraints: '-10^9 ≤ n ≤ 10^9',
  //     codeSnippets: {
  //       python:
  //         'def reverse_number(n):\n    # Write your code here\n    return 0\n\nimport sys\nn = int(sys.stdin.read())\nprint(reverse_number(n))',
  //       javascript:
  //         "const fs = require('fs');\n\nfunction reverseNumber(n) {\n    // Write your code here\n    return 0;\n}\n\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst n = Number(input);\nconsole.log(reverseNumber(n));",
  //       java: 'import java.util.Scanner;\n\npublic class Main {\n    public static int reverseNumber(int n) {\n        // Write your code here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(reverseNumber(n));\n    }\n}',
  //     },
  //     referenceSolutions: {
  //       python:
  //         'import sys\nn = int(sys.stdin.read())\n\ndef reverse_number(n):\n    sign = -1 if n < 0 else 1\n    reversed_str = str(abs(n))[::-1]\n    print(sign * int(reversed_str))\n\nreverse_number(n)',
  //       javascript:
  //         "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst n = Number(input);\n\nfunction reverseNumber(n) {\n    const sign = n < 0 ? -1 : 1;\n    const reversed = Math.abs(n).toString().split('').reverse().join('');\n    return sign * parseInt(reversed);\n}\n\nconsole.log(reverseNumber(n));",
  //       java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int sign = n < 0 ? -1 : 1;\n        String reversed = new StringBuilder(Integer.toString(Math.abs(n))).reverse().toString();\n        System.out.println(sign * Integer.parseInt(reversed));\n    }\n}',
  //     },
  //   },
  //   testCases: [
  //     {
  //       input: '123',
  //       expected: '321',
  //       isPublic: false,
  //     },
  //     {
  //       input: '-456',
  //       expected: '-654',
  //       isPublic: false,
  //     },
  //     {
  //       input: '1000',
  //       expected: '1',
  //       isPublic: true,
  //     },
  //     {
  //       input: '0',
  //       expected: '0',
  //       isPublic: true,
  //     },
  //   ],
  // });

  // Transform examples object to array format for rendering
  // Extract examples from the language-keyed object and convert to array

  // const [problem, setProblem] = useState({
  //   title: '',
  //   problemNumber: '',
  //   description: '',
  //   difficulty: 'EASY',
  //   tags: [],
  //   examples: [
  //     { input: '', output: '', explanation: '' }, // Start with one example
  //   ],
  //   constraints: '',
  //   testcases: [{ input: '', output: '' }],
  //   codeSnippets: {
  //     PYTHON: '',
  //     JAVASCRIPT: '',
  //     JAVA: '',
  //   },
  //   referenceSolutions: {
  //     PYTHON: '',
  //     JAVASCRIPT: '',
  //     JAVA: '',
  //   },
  // });

  console.log('problemInfo', problemInfo);

  debugger;

  console.log('isSuccessProblemInfo', isSuccessProblemInfo);

  const [problemDetails, setProblemDetails] = useState({
    problemNumber: problemInfo?.problemNumber || '',
    problem: {
      title: problemInfo?.title || '',
      description: problemInfo?.description || '',
      difficulty: problemInfo?.difficulty || 'EASY',
      tags: problemInfo?.tags || [],
      examples: problemInfo?.examples?.map((example) => ({
        input: example.input || '',
        output: example.output || '',
        explanation: example.explanation || '',
      })) || [
        {
          input: '',
          output: '',
          explanation: '',
        },
      ],
      constraints: problemInfo?.constraints || '',
      hints: problemInfo?.hints || '',
      editorial: problemInfo?.editorial || '',
      codeSnippets: {
        python: problemInfo?.codeSnippets?.python || '',
        javascript: problemInfo?.codeSnippets?.javascript || '',
        java: problemInfo?.codeSnippets?.java || '',
      },
      referenceSolutions: {
        java: problemInfo?.referenceSolutions?.java || '',
        javascript: problemInfo?.referenceSolutions?.javascript || '',
        python: problemInfo?.referenceSolutions?.python || '',
      },
    },
    testCases: problemInfo?.testCases?.map((testCase) => ({
      input: testCase.input || '',
      expected: testCase.expected || '',
      isPublic: testCase.isPublic || false, // This field doesn't exist in your problemInfo, so defaulting to false
    })) || [
      {
        input: '',
        expected: '',
        isPublic: false,
      },
    ],
  });
  const examplesArray = problemDetails.problem.examples || [];

  const [newTag, setNewTag] = useState('');
  // const { theme } = useTheme()

  const [exampleCount, setExampleCount] = useState(1);

  // Update problemDetails field
  const updateProblem = (field, value, scope = 'problem') => {
    setProblemDetails((prev) => {
      if (scope === 'root') {
        return { ...prev, [field]: value };
      }

      return {
        ...prev,
        [scope]: {
          ...prev[scope],
          [field]: value,
        },
      };
    });
  };

  // Add a new tag
  const addTag = () => {
    if (newTag && !problemDetails.problem.tags.includes(newTag)) {
      updateProblem('tags', [...problemDetails.problem.tags, newTag]);
      setNewTag('');
    }
  };

  // Remove a tag
  const removeTag = (tag) => {
    updateProblem(
      'tags',
      problemDetails.problem.tags.filter((t) => t !== tag)
    );
  };

  // Add a new test case
  const addTestCase = () => {
    updateProblem(
      'testCases',
      [
        ...problemDetails.testCases,
        { input: '', expected: '', isPublic: false },
      ],
      'root'
    );
  };

  // Update a test case using the correct key and root scope
  const updateTestCase = (index, field, value) => {
    const updatedTestCases = [...problemDetails.testCases];
    updatedTestCases[index] = {
      ...updatedTestCases[index],
      [field]: value,
    };

    // Use "testCases" (capital C) and specify the "root" scope
    updateProblem('testCases', updatedTestCases, 'root');
  };

  // Remove a test case
  const removeTestCase = (index) => {
    const updatedTestCases = problemDetails.testCases.filter(
      (_, i) => i !== index
    );
    updateProblem('testCases', updatedTestCases, 'root');
  };

  // Update code snippet for a language
  const updateCodeSnippet = (language, code) => {
    setProblemDetails((prev) => ({
      ...prev,
      problem: {
        ...prev.problem,
        codeSnippets: {
          ...prev.problem.codeSnippets,
          [language]: code,
        },
      },
    }));
  };

  // Update reference solution for a language
  const updateReferenceSolution = (language, code) => {
    setProblemDetails((prev) => ({
      ...prev,
      problem: {
        ...prev.problem,
        referenceSolutions: {
          ...prev.problem.referenceSolutions,
          [language]: code,
        },
      },
    }));
  };

  // Update example for a language
  const updateExample = (language, field, value) => {
    setProblemDetails((prev) => ({
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

  const { isPending, isSuccess, error, createProblemMutation } =
    useCreateProblem();
  // console.log('problemDetails', problemDetails);

  const {isLoading, isSuccess: updateProblemSuccess, error: updateProblemError, updateProblemMutation} = useUpdateProblemDetails()

  const navigate = useNavigate();
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!problemDetails.problem.title || !problemDetails.problem.description) {
      toast.warning('Missing required fields');
      return;
    }

    // Optionally convert problemNumber to a number
    const payload = {
      problemNumber: Number(problemDetails.problemNumber),
      problem: problemDetails.problem,
      testCases: problemDetails.testCases,
    };

    // Log the payload
    // console.log('payload ', JSON.stringify(payload, null, 2));

    // Pass the correct payload to your mutation
    await createProblemMutation(payload);

    // Notify user on success
    toast.success('Your problem has been created and saved.');
  };

  const handleUpdate = async () => {
    // Validate form
    if (!problemDetails.problem.title || !problemDetails.problem.description) {
      toast.warning('Missing required fields');
      return;
    }
    const problemId = problemInfo.id;
    // console.log('problemId', problemId);
    // Optionally convert problemNumber to a number
    const payload = {
      problemNumber: Number(problemDetails.problemNumber),
      problem: problemDetails.problem,
      testCases: problemDetails.testCases,
    };

    console.log("payload ", payload);
    await updateProblemMutation({ problemId: problemId, ...payload });
    toast.success('Your problem has been updated.');

  }

  
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate('/problem-set');
      }, 1500);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (updateProblemSuccess) {
      setTimeout(() => {
        navigate('/problem-set');
      }, 1500);
    }
  }, [updateProblemSuccess, navigate]);

  return (
    <div className='container mx-auto py-8 bg-premium-darker text-slate-50'>
      {mode == 'create' ? (
        <h1 className='text-3xl font-bold mb-6'>Create New Problem</h1>
      ) : (
        <h1 className='text-3xl font-bold mb-6'>Update Problem</h1>
      )}

      <div className='space-y-8'>
        {/* Basic Information */}
        <Card className='bg-green-900 border border-blue-800/20 text-white shadow-lg premium-border-gradient'>
          <CardContent className='pt-6'>
            {isSuccess && (
              <div className='bg-primary/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-primary mb-5'>
                <FaCheck className='size-8 fill-green-500' />
                <p className='text-sm text-white'>
                  Successfully signed in. You will be redirected to the problem
                  page in a few seconds.
                  <LucideLoader2 className='animate-spin ml-2' />
                </p>
              </div>
            )}
            <h2 className='text-xl font-semibold mb-4'>Basic Information</h2>
            <div className='space-y-4'>
              <InputField
                label='Title'
                value={problemDetails.problem.title}
                onChange={(value) => updateProblem('title', value)}
                placeholder='Enter problem title'
                required
              />

              <InputField
                label='Problem Number'
                value={problemDetails.problemNumber}
                onChange={(value) =>
                  updateProblem('problemNumber', value, 'root')
                }
                placeholder='Enter problem number'
                required
              />

              <InputField
                label='Description'
                value={problemDetails.problem.description}
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
                    value={problemDetails.problem.difficulty}
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
                    {problemDetails.problem.tags.map((tag) => (
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
                value={problemDetails.problem.constraints}
                onChange={(value) => updateProblem('constraints', value)}
                placeholder='Enter problem constraints'
                multiline
              />
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <Card className='bg-green-900 border border-blue-800/20 text-white shadow-lg premium-border-gradient'>
          <CardContent className='pt-6'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>Examples</h2>
              <Button
                onClick={() => {
                  const updatedExamples = [
                    ...examplesArray,
                    { input: '', output: '', explanation: '' },
                  ];
                  updateProblem('examples', updatedExamples);
                }}
                size='sm'
                variant='outline'
                className='bg-zinc-800'
              >
                <PlusCircle size={16} className='mr-2' />
                Add Example
              </Button>
            </div>

            {examplesArray.map((example, index) => (
              <Examples
                key={index}
                example={example}
                onChange={(field, value) => {
                  const updatedExamples = [...examplesArray];
                  updatedExamples[index] = {
                    ...updatedExamples[index],
                    [field]: value,
                  };
                  updateProblem('examples', updatedExamples);
                }}
                onRemove={() => {
                  const updatedExamples = examplesArray.filter(
                    (_, i) => i !== index
                  );
                  updateProblem('examples', updatedExamples);
                }}
              />
            ))}
          </CardContent>
        </Card>

        {/* Test Cases */}
        <Card className='bg-green-900 border border-blue-800/20 text-white shadow-lg premium-border-gradient'>
          <CardContent className='pt-6'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>Test Cases</h2>
              <Button
                onClick={addTestCase}
                size='sm'
                variant='outline'
                className='bg-zinc-800'
              >
                <PlusCircle size={16} className='mr-2' />
                Add Test Case
              </Button>
            </div>

            <div className='space-y-4 '>
              {problemDetails.testCases.map((testcase, index) => (
                <TestCase
                  key={index}
                  testCase={testcase}
                  index={index}
                  onChange={updateTestCase}
                  onRemove={() => removeTestCase(index)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Code Snippets */}
        <Card className='bg-green-900 border border-blue-800/20 text-white shadow-lg premium-border-gradient'>
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
                    code={
                      problemDetails.problem.codeSnippets[lang.toLowerCase()]
                    }
                    onChange={(code) =>
                      updateCodeSnippet(lang.toLowerCase(), code)
                    }
                    language={lang.toLowerCase()}
                    label='Starter Code'
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Reference Solutions */}
        <Card className='bg-green-900 border border-blue-800/20 text-white shadow-lg premium-border-gradient'>
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
                    code={
                      problemDetails.problem.referenceSolutions[
                        lang.toLowerCase()
                      ]
                    }
                    onChange={(code) =>
                      updateReferenceSolution(lang.toLowerCase(), code)
                    }
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
          {mode == 'create' ? (
            <Button onClick={handleSubmit} size='lg'>
              <Save size={18} className='mr-2' />
              Create Problem
            </Button>
          ) : (
            <Button onClick={handleUpdate} size='lg'>
              <Save size={18} className='mr-2' />
              Update Problem
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
