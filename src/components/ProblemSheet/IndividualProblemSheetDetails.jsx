import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Search,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  User,
  BookOpen,
  Target,
  Clock,
  Edit,
  Share2,
  ExternalLink,
  Code,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetIndividualSheetDetails } from '@/hooks/apis/ProblemSheets/useGetIndividualSheetDetails';
import { SkeletonCard } from '@/Pages/SkeletonPage/SkeletonCard';
// Mock data based on your structure
const mockSheetData = {
  id: '4b22f483-3178-4a5f-9a4b-bdf7bafff80e',
  name: 'Test SDE Sheets4',
  description: 'Test Description',
  userId: '33ccebfb-7b81-4d8f-b49d-8211d64884e0',
  createdAt: '2025-05-24T08:54:24.990Z',
  updatedAt: '2025-05-24T08:54:24.990Z',
  user: {
    id: '33ccebfb-7b81-4d8f-b49d-8211d64884e0',
    name: 'Swarup Das',
    username: 'swarupd',
    image: null,
  },
  problems: [
    {
      id: '0a139a56-77db-4d25-9f91-4f927998e56b',
      sheetId: '4b22f483-3178-4a5f-9a4b-bdf7bafff80e',
      problemId: '39c008a7-022b-4ac6-b08b-f1e243760470',
      createdAt: '2025-05-24T08:59:12.461Z',
      updatedAt: '2025-05-24T08:59:12.461Z',
      problem: {
        id: '39c008a7-022b-4ac6-b08b-f1e243760470',
        title: 'Reverse Number For Test-4',
        problemNumber: 4,
        difficulty: 'EASY',
        tags: ['math', 'string', 'number-theory'],
      },
      completed: false,
    },
    {
      id: '009bced8-c152-4a50-b2c7-d12ce2215ca5',
      sheetId: '4b22f483-3178-4a5f-9a4b-bdf7bafff80e',
      problemId: 'af07b227-373e-4a8e-a683-443e1c23893c',
      createdAt: '2025-05-24T08:59:12.461Z',
      updatedAt: '2025-05-24T08:59:12.461Z',
      problem: {
        id: 'af07b227-373e-4a8e-a683-443e1c23893c',
        title: 'Reverse Number For Test-1',
        problemNumber: 1,
        difficulty: 'EASY',
        tags: ['math', 'string', 'number-theory'],
      },
      completed: true,
    },
    {
      id: 'additional-1',
      sheetId: '4b22f483-3178-4a5f-9a4b-bdf7bafff80e',
      problemId: 'additional-problem-1',
      createdAt: '2025-05-24T09:00:00.000Z',
      updatedAt: '2025-05-24T09:00:00.000Z',
      problem: {
        id: 'additional-problem-1',
        title: 'Two Sum',
        problemNumber: 2,
        difficulty: 'MEDIUM',
        tags: ['array', 'hash-table'],
      },
      completed: true,
    },
    {
      id: 'additional-2',
      sheetId: '4b22f483-3178-4a5f-9a4b-bdf7bafff80e',
      problemId: 'additional-problem-2',
      createdAt: '2025-05-24T09:01:00.000Z',
      updatedAt: '2025-05-24T09:01:00.000Z',
      problem: {
        id: 'additional-problem-2',
        title: 'Binary Tree Traversal',
        problemNumber: 3,
        difficulty: 'HARD',
        tags: ['tree', 'dfs', 'recursion'],
      },
      completed: false,
    },
  ],
  totalProblems: 4,
  allTags: [
    'math',
    'string',
    'number-theory',
    'array',
    'hash-table',
    'tree',
    'dfs',
    'recursion',
  ],
  allDifficulties: ['EASY', 'MEDIUM', 'HARD'],
};

export default function IndividualProblemSheetDetails({ params }) {
  const [sheetData, setSheetData] = useState(mockSheetData);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [completionFilter, setCompletionFilter] = useState('all');
  const [addProblemOpen, setAddProblemOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // Toggle for demo

  const navigate = useNavigate();

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const { isLoading, isSuccess, error, getIndividualSheetDetailsMutation } =
    useGetIndividualSheetDetails();

  console.log('isSuccess', isSuccess);

 

  const { sheetId } = useParams();

  console.log('sheetId', sheetId);

  const fetchSheetDetails = async () => {
    try {
      const data = await getIndividualSheetDetailsMutation(sheetId);
      setSheetData(data?.sdeSheet);
    } catch (error) {
      console.error('Error fetching sheet details:', error);
    }
  };

  useEffect(() => {
    // Fetch sheet details when component mounts or sheetId changes
    fetchSheetDetails();
  }, [sheetId]);

  console.log('Sheet Data:', sheetData);

  // Updated filtering function
  const filteredProblems = sheetData.problems.filter((problemItem) => {
    const problem = problemItem.problem;

    // Search filter - check title and tags
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Difficulty filter
    const matchesDifficulty =
      difficultyFilter === 'all' ||
      problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

    // Tag filter
    const matchesTag = tagFilter === 'all' || problem.tags.includes(tagFilter);

    // Completion filter - check if problemItem has completed property
    const isCompleted = problemItem.completed || false; // Default to false if not present
    const matchesCompletion =
      completionFilter === 'all' ||
      (completionFilter === 'completed' && isCompleted) ||
      (completionFilter === 'pending' && !isCompleted);

    return (
      matchesSearch && matchesDifficulty && matchesTag && matchesCompletion
    );
  });

  const completedCount = sheetData.problems.filter(
    (item) => item.completed || false
  ).length;
  const progressPercentage =
    sheetData.totalProblems > 0
      ? (completedCount / sheetData.totalProblems) * 100
      : 0;

  console.log('filteredProblems', filteredProblems);

  const toggleProblemCompletion = (problemId) => {
    setSheetData((prev) => ({
      ...prev,
      problems: prev.problems.map((p) =>
        p.id === problemId ? { ...p, completed: !p.completed } : p
      ),
    }));
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {isSuccess ? (
        <>
          <header className='bg-white border-b border-gray-200 sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='flex justify-between items-center h-16'>
                <div className='flex items-center space-x-4'>
                  <Button className='bg-blue-600 hover:bg-blue-700' onClick={() => navigate(-1)}>
                    <ArrowLeft className='h-4 w-4 mr-2' />
                    Back
                  </Button>
                </div>

                <div className='flex items-center space-x-4'>
                  {/* <Button variant='outline' size='sm'>
                    <Share2 className='h-4 w-4 mr-2' />
                    Share
                  </Button> */}
                  {isAdmin && (
                    <Dialog
                      open={addProblemOpen}
                      onOpenChange={setAddProblemOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className='bg-blue-600 hover:bg-blue-700'>
                          <Plus className='h-4 w-4 mr-2' />
                          Add Problem
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='sm:max-w-[525px]'>
                        <DialogHeader>
                          <DialogTitle>Add New Problem</DialogTitle>
                          <DialogDescription>
                            Add a new problem to this sheet
                          </DialogDescription>
                        </DialogHeader>
                        <div className='grid gap-4 py-4'>
                          <div className='grid gap-2'>
                            <Label htmlFor='problem-title'>Problem Title</Label>
                            <Input
                              id='problem-title'
                              placeholder='Enter problem title'
                            />
                          </div>
                          <div className='grid gap-2'>
                            <Label htmlFor='problem-number'>
                              Problem Number
                            </Label>
                            <Input
                              id='problem-number'
                              type='number'
                              placeholder='Enter problem number'
                            />
                          </div>
                          <div className='grid gap-2'>
                            <Label htmlFor='problem-difficulty'>
                              Difficulty
                            </Label>
                            <Select>
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
                          <div className='grid gap-2'>
                            <Label htmlFor='problem-tags'>
                              Tags (comma separated)
                            </Label>
                            <Input
                              id='problem-tags'
                              placeholder='array, string, math...'
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type='submit'
                            onClick={() => setAddProblemOpen(false)}
                          >
                            Add Problem
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Sheet Header */}
            <div className='mb-8'>
              <Card>
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='text-2xl mb-2'>
                        {sheetData.name}
                      </CardTitle>
                      <CardDescription className='text-base mb-4'>
                        {sheetData.description}
                      </CardDescription>

                      <div className='flex items-center space-x-6 text-sm text-gray-600'>
                        <div className='flex items-center space-x-2'>
                          <Avatar className='h-6 w-6'>
                            <AvatarImage
                              src={sheetData.user.image || '/placeholder.svg'}
                            />
                            <AvatarFallback>
                              {sheetData.user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{sheetData.user.name}</span>
                          <span className='text-gray-400'>
                            @{sheetData.user.username}
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Calendar className='h-4 w-4 mr-1' />
                          Created{' '}
                          {new Date(sheetData.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {isAdmin && (
                      <Button variant='outline' size='sm'>
                        <Edit className='h-4 w-4 mr-2' />
                        Edit Sheet
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                    {/* Progress Card */}
                    <div className='bg-blue-50 p-4 rounded-lg'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-blue-700'>
                          Progress
                        </span>
                        <Target className='h-4 w-4 text-blue-600' />
                      </div>
                      <div className='text-2xl font-bold text-blue-900 mb-2'>
                        {completedCount}/{sheetData.totalProblems}
                      </div>
                      <Progress value={progressPercentage} className='h-2' />
                      <div className='text-xs text-blue-600 mt-1'>
                        {Math.round(progressPercentage)}% Complete
                      </div>
                    </div>

                    {/* Total Problems */}
                    <div className='bg-green-50 p-4 rounded-lg'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-green-700'>
                          Total Problems
                        </span>
                        <BookOpen className='h-4 w-4 text-green-600' />
                      </div>
                      <div className='text-2xl font-bold text-green-900'>
                        {sheetData.totalProblems}
                      </div>
                    </div>

                    {/* Difficulties */}
                    <div className='bg-purple-50 p-4 rounded-lg'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-purple-700'>
                          Difficulties
                        </span>
                        <Clock className='h-4 w-4 text-purple-600' />
                      </div>
                      <div className='flex flex-wrap gap-1'>
                        {sheetData.allDifficulties &&
                        sheetData.allDifficulties.length > 0 ? (
                          sheetData.allDifficulties.map((difficulty) => (
                            <Badge
                              key={difficulty}
                              variant='secondary'
                              className='text-xs'
                            >
                              {difficulty}
                            </Badge>
                          ))
                        ) : (
                          <span className='text-xs text-purple-600'>
                            No difficulties
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className='bg-orange-50 p-4 rounded-lg'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-orange-700'>
                          Topics
                        </span>
                        <User className='h-4 w-4 text-orange-600' />
                      </div>
                      <div className='flex flex-wrap gap-1'>
                        {sheetData.allTags && sheetData.allTags.length > 0 ? (
                          <>
                            {sheetData.allTags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant='secondary'
                                className='text-xs'
                              >
                                {tag}
                              </Badge>
                            ))}
                            {sheetData.allTags.length > 3 && (
                              <Badge variant='secondary' className='text-xs'>
                                +{sheetData.allTags.length - 3}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className='text-xs text-orange-600'>
                            No topics
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className='mb-6'>
              <Card>
                <CardContent className='p-4'>
                  <div className='flex flex-col sm:flex-row gap-4'>
                    <div className='relative flex-1'>
                      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                      <Input
                        placeholder='Search problems...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='pl-10'
                      />
                    </div>

                    <Select
                      value={difficultyFilter}
                      onValueChange={setDifficultyFilter}
                    >
                      <SelectTrigger className='w-40'>
                        <SelectValue placeholder='Difficulty' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Difficulties</SelectItem>
                        <SelectItem value='easy'>Easy</SelectItem>
                        <SelectItem value='medium'>Medium</SelectItem>
                        <SelectItem value='hard'>Hard</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={tagFilter} onValueChange={setTagFilter}>
                      <SelectTrigger className='w-40'>
                        <SelectValue placeholder='Topic' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Topics</SelectItem>
                        {sheetData.allTags &&
                          sheetData.allTags.map((tag) => (
                            <SelectItem key={tag} value={tag}>
                              {tag}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={completionFilter}
                      onValueChange={setCompletionFilter}
                    >
                      <SelectTrigger className='w-40'>
                        <SelectValue placeholder='Status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='completed'>Completed</SelectItem>
                        <SelectItem value='pending'>Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Problems Table */}
            <Card>
              <CardHeader>
                <CardTitle>Problems ({filteredProblems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-12'>Status</TableHead>
                      <TableHead className='w-16'>#</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className='w-24'>Difficulty</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className='w-24'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProblems.length > 0 ? (
                      filteredProblems.map((problemItem) => (
                        <TableRow
                          key={problemItem.id}
                          className='hover:bg-gray-50'
                        >
                          <TableCell>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() =>
                                toggleProblemCompletion(problemItem.id)
                              }
                              className='p-0 h-6 w-6'
                            >
                              {problemItem.completed ? (
                                <CheckCircle2 className='h-5 w-5 text-green-600' />
                              ) : (
                                <Circle className='h-5 w-5 text-gray-400' />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className='font-medium'>
                            {problemItem.problem.problemNumber}
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center space-x-2'>
                              <span
                                className={
                                  problemItem.completed
                                    ? 'line-through text-gray-500'
                                    : ''
                                }
                              >
                                {problemItem.problem.title}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getDifficultyColor(
                                problemItem.problem.difficulty
                              )}
                            >
                              {problemItem.problem.difficulty}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className='flex flex-wrap gap-1'>
                              {problemItem.problem.tags &&
                              problemItem.problem.tags.length > 0 ? (
                                <>
                                  {problemItem.problem.tags
                                    .slice(0, 2)
                                    .map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant='outline'
                                        className='text-xs'
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  {problemItem.problem.tags.length > 2 && (
                                    <Badge
                                      variant='outline'
                                      className='text-xs'
                                    >
                                      +{problemItem.problem.tags.length - 2}
                                    </Badge>
                                  )}
                                </>
                              ) : (
                                <span className='text-xs text-gray-400'>
                                  No tags
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant='ghost' size='sm'>
                              <ExternalLink className='h-4 w-4' />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className='text-center py-8 text-gray-500'
                        >
                          No problems found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </>
      ) : (
        <>
          <SkeletonCard />
        </>
      )}
      {/* Header */}
    </div>
  );
}
