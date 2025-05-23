import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowLeft,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetAllProblems } from '@/hooks/apis/getAllProblems/useGetAllProblems';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
// Mock data for demonstration
const problemCategories = [
  { name: 'Array', count: 1906 },
  { name: 'String', count: 787 },
  { name: 'Hash Table', count: 692 },
  { name: 'Dynamic Programming', count: 584 },
  { name: 'Math', count: 578 },
  { name: 'Sorting', count: 449 },
  { name: 'Greedy', count: 411 },
  { name: 'Depth-First Search', count: 318 },
  { name: 'Binary Search', count: 302 },
];

const topics = [
  { name: 'All Topics', icon: null },
  { name: 'Algorithms', icon: null },
  { name: 'Database', icon: null },
  { name: 'Shell', icon: null },
  { name: 'Concurrency', icon: null },
  { name: 'JavaScript', icon: null },
  { name: 'pandas', icon: null },
];

// const problems = [
//   {
//     id: 1550,
//     title: 'Three Consecutive Odds',
//     difficulty: 'Easy',
//     completion: 68.9,
//   },
//   { id: 1, title: 'Two Sum', difficulty: 'Easy', completion: 55.5 },
//   { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', completion: 45.9 },
//   {
//     id: 3,
//     title: 'Longest Substring Without Repeating Characters',
//     difficulty: 'Medium',
//     completion: 36.7,
//   },
//   {
//     id: 4,
//     title: 'Median of Two Sorted Arrays',
//     difficulty: 'Hard',
//     completion: 43.5,
//   },
//   {
//     id: 5,
//     title: 'Longest Palindromic Substring',
//     difficulty: 'Medium',
//     completion: 35.6,
//   },
//   { id: 6, title: 'Zigzag Conversion', difficulty: 'Medium', completion: 51.3 },
//   { id: 7, title: 'Reverse Integer', difficulty: 'Medium', completion: 30.1 },
//   {
//     id: 8,
//     title: 'String to Integer (atoi)',
//     difficulty: 'Medium',
//     completion: 19.0,
//   },
//   {
//     id: 11,
//     title: 'Container With Most Water',
//     difficulty: 'Medium',
//     completion: 57.6,
//   },
//   { id: 12, title: 'Integer to Roman', difficulty: 'Medium', completion: 68.3 },
//   { id: 13, title: 'Roman to Integer', difficulty: 'Easy', completion: 64.6 },
//   {
//     id: 14,
//     title: 'Longest Common Prefix',
//     difficulty: 'Easy',
//     completion: 45.3,
//   },
// ];

const featuredCourses = [
  {
    title: "LeetCode's Interview Crash Course:",
    subtitle: 'System Design for Interviews and Beyond',
    buttonText: 'Start Learning',
    color: 'bg-emerald-700',
    dotColor: 'bg-emerald-400',
  },
  {
    title: "LeetCode's Interview Crash Course:",
    subtitle: 'Data Structures and Algorithms',
    buttonText: 'Start Learning',
    color: 'bg-violet-600',
    dotColor: 'bg-violet-300',
  },
  {
    title: 'New & Trending Company Qs',
    subtitle: 'Latest Qs From Big Tech',
    buttonText: 'Claim Now',
    color: 'bg-amber-500',
    dotColor: 'bg-amber-300',
    badge: 'New',
  },
  {
    title: 'Top Interview Questions',
    subtitle: '',
    buttonText: 'Get Started',
    color: 'bg-blue-500',
    dotColor: 'bg-blue-300',
  },
];

export default function AllProblem() {
  const [problems, setProblems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProblems, setFilteredProblems] = useState(problems);
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);

  // Add this somewhere to verify data is persisted
  const authUser = useSelector((state) => state.auth);
  console.log('Current auth state:', authUser);
  // Simulate checking if user is admin
  useEffect(() => {
    // In a real app, you would check user roles from authentication
    const checkIfAdmin = async () => {
      if(authUser?.role.toLowerCase() === 'admin') {
        setIsAdmin(true);
      }
      
    };

    checkIfAdmin();
  }, []);

  const { isPending, isSuccess, error, getAllProblemsMutation } =
    useGetAllProblems();

  const getAllProblems = async () => {
    try {
      const userId = authUser?.id || null;
      const data = await getAllProblemsMutation(userId);
      console.log('Fetched all problems:', data);
      setProblems(data.problems);
      setFilteredProblems(data.problems);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  useEffect(() => {
    getAllProblems();
    if (isSuccess) {
      console.log('Successfully fetched all problems');
    }
  }, []);

  console.log("isAdmin", isAdmin);

  // console.log('problems', problems);

  // Filter problems based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProblems(problems);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = problems.filter(
        (problem) =>
          problem.id.toString().includes(query) ||
          problem.title.toLowerCase().includes(query)
      );
      setFilteredProblems(filtered);
    }
  }, [searchQuery]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-emerald-500';
      case 'Medium':
        return 'text-amber-500';
      case 'Hard':
        return 'text-red-500';
      default:
        return '';
    }
  };

  const handleDeleteProblem = (problem) => {
    setProblemToDelete(problem);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Add your delete API call here
      console.log('Deleting problem:', problemToDelete);

      // After successful deletion, refresh the problems list
      await getAllProblems();

      // Close the dialog
      setDeleteConfirmOpen(false);
      setProblemToDelete(null);
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-950 text-gray-100'>
      {/* Navigation */}
      <header className='border-b border-gray-800'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center h-14'>
            <Link to='/' className='mr-6'>
              <ArrowLeft className='h-5 w-5' />
            </Link>
            <nav className='flex space-x-6'>
              <Link to='/explore' className='text-gray-400 hover:text-white'>
                Explore
              </Link>
              <Link
                to='/problems'
                className='text-white font-medium border-b-2 border-white pb-4'
              >
                Problems
              </Link>
              <Link to='/contest' className='text-gray-400 hover:text-white'>
                Contest
              </Link>
              <Link to='/discuss' className='text-gray-400 hover:text-white'>
                Discuss
              </Link>
              <Link to='/interview' className='text-gray-400 hover:text-white'>
                Interview
              </Link>
              <Link to='/store' className='text-gray-400 hover:text-white'>
                Store
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className='flex'>
        {/* Sidebar */}
        <aside className='w-56 border-r border-gray-800 h-[calc(100vh-3.5rem)] p-4'>
          <div className='space-y-4'>
            <div className='flex items-center space-x-2 p-2 rounded hover:bg-gray-800 cursor-pointer'>
              <span className='text-gray-300'>Library</span>
            </div>
            <div className='flex items-center space-x-2 p-2 rounded hover:bg-gray-800 cursor-pointer'>
              <span className='text-gray-300'>Study Plan</span>
            </div>

            <div className='pt-4 pb-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-400'>My Lists</span>
                <button className='text-gray-400 hover:text-white'>
                  <Plus className='h-4 w-4' />
                </button>
              </div>
            </div>

            <div className='space-y-1'>
              <div className='flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer'>
                <span className='text-gray-300'>Favorite</span>
                <span className='text-gray-500'>🔒</span>
              </div>
              <div className='flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer'>
                <span className='text-gray-300'>Queue</span>
                <span className='text-gray-500'>🔒</span>
              </div>
              <div className='flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer'>
                <span className='text-gray-300'>Stack</span>
                <span className='text-gray-500'>🔒</span>
              </div>
              <div className='flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer'>
                <span className='text-gray-300'>Binary Search</span>
                <span className='text-gray-500'>🔒</span>
              </div>
              <div className='flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer'>
                <span className='text-gray-300'>LinkedList</span>
                <span className='text-gray-500'>🔒</span>
              </div>
              <div className='flex items-center justify-between p-2 rounded hover:bg-gray-800 cursor-pointer'>
                <span className='text-gray-300'>Arrays</span>
                <span className='text-gray-500'>🔒</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className='flex-1 p-6'>
          {/* Featured courses */}
          {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
            {featuredCourses.map((course, index) => (
              <Card
                key={index}
                className={`${course.color} text-white border-none overflow-hidden relative`}
              >
                <div className='absolute top-4 right-4 h-16 w-16 rounded-full opacity-20 bg-white'></div>
                <div
                  className={`absolute bottom-4 right-8 h-8 w-8 rounded-full ${course.dotColor}`}
                ></div>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-lg font-medium'>
                    {course.title}
                    {course.badge && (
                      <Badge className='ml-2 bg-red-500 text-white'>
                        {course.badge}
                      </Badge>
                    )}
                  </CardTitle>
                  <p className='text-sm opacity-90'>{course.subtitle}</p>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant='secondary'
                    size='sm'
                    className='text-xs bg-white/20 hover:bg-white/30 border-none'
                  >
                    {course.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div> */}

          {/* Problem categories */}
          <div className='flex flex-wrap gap-4 mb-6'>
            {problemCategories.map((category, index) => (
              <div
                key={index}
                className='flex items-center space-x-2 bg-gray-900 px-3 py-1 rounded-full'
              >
                <span className='text-white'>{category.name}</span>
                <span className='text-gray-400 text-sm'>{category.count}</span>
              </div>
            ))}
          </div>

          {/* Topic filters */}
          <div className='mb-6'>
            <div className='flex flex-wrap gap-2'>
              {topics.map((topic, index) => (
                <Button
                  key={index}
                  variant={selectedTopic === topic.name ? 'default' : 'outline'}
                  className={
                    selectedTopic === topic.name
                      ? 'bg-gray-700'
                      : 'bg-transparent text-gray-300 border-gray-700'
                  }
                  onClick={() => setSelectedTopic(topic.name)}
                >
                  {topic.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Admin create button */}
          {isAdmin && (
            <div className='mb-6'>
              <Link to='/create-problem' state={{ mode: 'create' }}>
                <Button className='bg-green-600 hover:bg-green-700'>
                  <Plus className='mr-2 h-4 w-4' />
                  Create New Problem
                </Button>
              </Link>
            </div>
          )}

          {/* Search and filter */}
          <div className='flex items-center mb-6 gap-2'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                type='text'
                placeholder='Search questions'
                className='pl-10 bg-gray-900 border-gray-700 text-white'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant='outline' className='border-gray-700'>
              <Filter className='h-4 w-4 mr-2' />
              <span>1</span>
            </Button>
            <div className='text-sm text-gray-400'>
              {filteredProblems.length} Qs
            </div>
          </div>

          {/* Problems list */}
          <div className='bg-gray-900 rounded-lg overflow-scroll h-[calc(100vh-20rem)]'>
            <div className='divide-y divide-gray-800'>
              {filteredProblems.map((problem, index) => (
                <div
                  key={index}
                  className='flex items-center p-4 hover:bg-gray-800'
                >
                  <div className='w-6 mr-4 text-green-500'>
                    {problem.isSolved ? '✓' : ' '}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center'>
                      <span className='mr-2 text-gray-400'>
                        {problem.problemNumber}.
                      </span>
                      <Link
                        to={`/problems/${problem.id}`}
                        className='text-white hover:text-blue-400'
                      >
                        {problem.title}
                      </Link>
                    </div>
                  </div>
                  <div className='flex items-center space-x-6'>
                    <span
                      className={`${getDifficultyColor(problem.difficulty)}`}
                    >
                      {problem.difficulty}
                    </span>
                    {/* Admin actions column */}
                    {isAdmin && (
                      <div className='ml-4'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 text-gray-400 hover:text-white'
                            >
                              <MoreVertical className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align='end'
                            className='bg-gray-800 border-gray-700 text-white'
                          >
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/edit-problem/${problem.id}`}
                                state={{ mode: 'update' }}
                                className='cursor-pointer hover:bg-gray-700 focus:bg-gray-700 flex items-center'
                              >
                                <Pencil className='mr-2 h-4 w-4' />
                                Update problem
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className='cursor-pointer text-red-500 hover:bg-gray-700 focus:bg-gray-700'
                              onClick={() => handleDeleteProblem(problem)}
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              Delete problem
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className='bg-gray-900 border-gray-700 text-white'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className='text-gray-400'>
              This will permanently delete the problem "{problemToDelete?.title}
              ". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='bg-gray-800 text-white hover:bg-gray-700'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className='bg-red-600 hover:bg-red-700 text-white'
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
