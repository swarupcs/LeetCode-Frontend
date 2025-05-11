

import { useState } from 'react';

import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

export default function CreateProblem() {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: '',
    description: '',
    examples: '',
    constraints: '',
    tags: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your API
    console.log('Submitting problem:', formData);
    alert('Problem created successfully!');
    // Redirect to problems list
    window.location.href = '/problems';
  };

  return (
    <div className='min-h-screen bg-gray-950 text-gray-100'>
      {/* Navigation */}
      <header className='border-b border-gray-800'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center h-14'>
            <Link to='/problems' className='mr-6'>
              <ArrowLeft className='h-5 w-5' />
            </Link>
            <h1 className='text-xl font-medium'>Create New Problem</h1>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        <Card className='bg-gray-900 border-gray-800'>
          <CardHeader>
            <CardTitle>Problem Details</CardTitle>
            <CardDescription>
              Create a new coding problem for users to solve.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className='space-y-6'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Problem Title</Label>
                <Input
                  id='title'
                  name='title'
                  placeholder='e.g., Two Sum'
                  className='bg-gray-800 border-gray-700'
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='difficulty'>Difficulty</Label>
                <Select
                  onValueChange={(value) =>
                    handleSelectChange('difficulty', value)
                  }
                  required
                >
                  <SelectTrigger className='bg-gray-800 border-gray-700'>
                    <SelectValue placeholder='Select difficulty' />
                  </SelectTrigger>
                  <SelectContent className='bg-gray-800 border-gray-700'>
                    <SelectItem value='Easy'>Easy</SelectItem>
                    <SelectItem value='Medium'>Medium</SelectItem>
                    <SelectItem value='Hard'>Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue='description' className='w-full'>
                <TabsList className='bg-gray-800'>
                  <TabsTrigger value='description'>Description</TabsTrigger>
                  <TabsTrigger value='examples'>Examples</TabsTrigger>
                  <TabsTrigger value='constraints'>Constraints</TabsTrigger>
                </TabsList>
                <TabsContent value='description' className='pt-4'>
                  <Textarea
                    name='description'
                    placeholder='Enter the problem description...'
                    className='min-h-[200px] bg-gray-800 border-gray-700'
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </TabsContent>
                <TabsContent value='examples' className='pt-4'>
                  <Textarea
                    name='examples'
                    placeholder='Enter example inputs and outputs...'
                    className='min-h-[200px] bg-gray-800 border-gray-700'
                    value={formData.examples}
                    onChange={handleChange}
                  />
                </TabsContent>
                <TabsContent value='constraints' className='pt-4'>
                  <Textarea
                    name='constraints'
                    placeholder='Enter constraints for the problem...'
                    className='min-h-[200px] bg-gray-800 border-gray-700'
                    value={formData.constraints}
                    onChange={handleChange}
                  />
                </TabsContent>
              </Tabs>

              <div className='space-y-2'>
                <Label>Categories</Label>
                <div className='flex flex-wrap gap-2'>
                  {[
                    'Array',
                    'String',
                    'Hash Table',
                    'Dynamic Programming',
                    'Math',
                    'Sorting',
                    'Greedy',
                    'Depth-First Search',
                    'Binary Search',
                  ].map((tag) => (
                    <Button
                      key={tag}
                      type='button'
                      variant='outline'
                      className={`
                        border-gray-700 
                        ${
                          formData.tags.includes(tag)
                            ? 'bg-gray-700'
                            : 'bg-transparent'
                        }
                      `}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          tags: prev.tags.includes(tag)
                            ? prev.tags.filter((t) => t !== tag)
                            : [...prev.tags, tag],
                        }));
                      }}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type='submit' className='bg-green-600 hover:bg-green-700'>
                <Save className='mr-2 h-4 w-4' />
                Create Problem
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
