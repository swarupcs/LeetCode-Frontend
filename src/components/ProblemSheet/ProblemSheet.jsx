import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  Clock,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Code,
  Target,
  TrendingUp,
  Calendar,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useGetAllSheetDetails } from '@/hooks/apis/ProblemSheets/useGetAllSheetDetails';
import { set } from 'date-fns';
import { SkeletonCard } from '@/Pages/SkeletonPage/SkeletonCard';

// Mock data
const sdeSheets = [
  {
    id: 1,
    title: 'Microsoft SDE Sheet',
    description:
      'Complete preparation guide for Software Development Engineer interviews covering all important topics',
    author: 'Microsoft SDE',
    authorAvatar: '/placeholder.svg?height=40&width=40',
    totalProblems: 191,
    completedProblems: 45,
    difficulty: 'Mixed',
    tags: ['Arrays', 'Strings', 'Trees', 'Graphs', 'DP'],
    createdAt: '2024-01-15',
    isPublic: true,
    likes: 1250,
    views: 15420,
  },
  {
    id: 2,
    title: 'Google Interview Prep',
    description:
      'Curated list of problems frequently asked in Google interviews',
    author: 'Tech Interviewer',
    authorAvatar: '/placeholder.svg?height=40&width=40',
    totalProblems: 150,
    completedProblems: 23,
    difficulty: 'Hard',
    tags: ['System Design', 'Algorithms', 'Data Structures'],
    createdAt: '2024-02-01',
    isPublic: true,
    likes: 890,
    views: 8750,
  },
  {
    id: 3,
    title: 'Beginner Friendly DSA',
    description:
      'Perfect starting point for beginners to learn Data Structures and Algorithms',
    author: 'Code Mentor',
    authorAvatar: '/placeholder.svg?height=40&width=40',
    totalProblems: 75,
    completedProblems: 75,
    difficulty: 'Easy',
    tags: ['Basics', 'Arrays', 'Strings', 'Sorting'],
    createdAt: '2024-01-20',
    isPublic: true,
    likes: 2100,
    views: 25600,
  },
];

const problems = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    completed: true,
    sheetId: 1,
  },
  {
    id: 2,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Strings',
    completed: false,
    sheetId: 1,
  },
  {
    id: 3,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: 'Arrays',
    completed: false,
    sheetId: 1,
  },
];

export default function ProblemSheet() {
  const [isAdmin, setIsAdmin] = useState(true); // Toggle for demo
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [addProblemOpen, setAddProblemOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const [sheetDetails, setSheetDetails] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const { isLoading, isSuccess, error, getAllSheetDetailsMutation } =
    useGetAllSheetDetails();

  const fetchSheetDetails = async () => {
    try {
      const data = await getAllSheetDetailsMutation();
      if (!isSuccess) {
        console.log('Successfully fetched sheet details:', data.sdeSheets);
        setSheetDetails(data.sdeSheets || []);
      }
    } catch (error) {
      console.error('Error fetching sheet details:', error);
    }
  };

  useEffect(() => {
    fetchSheetDetails();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Updated filter function for sheetDetails array
  // Updated filter function for sheetDetails array with error handling
  const filteredSheets = sheetDetails.filter((sheet) => {
    if (!sheet) return false;

    const name = sheet.name || '';
    const description = sheet.description || '';
    const tags = sheet.allTags || [];
    const query = (searchQuery || '').toLowerCase();

    return (
      name.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query) ||
      tags.some((tag) => (tag || '').toLowerCase().includes(query))
    );
  });

  // console.log('Filtered Sheets:', filteredSheets);

  console.log("sheetDetails:", sheetDetails);

  console.log('isSuccess:', isSuccess);
  // console.log("isLoading:", isLoading);

  const handleCreateSheet = () => {
    // Logic to create a new sheet
    console.log('Creating new sheet...');
    setCreateSheetOpen(false);
    // Reset form fields if needed
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {isSuccess ? (
        <>
          {/* Header */}
          <header className='bg-white border-b border-gray-200 sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='flex justify-between items-center h-16'>
                <div className='flex items-center space-x-4'>
                  {isAdmin && (
                    <Dialog
                      open={createSheetOpen}
                      onOpenChange={setCreateSheetOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className='bg-blue-600 hover:bg-blue-700'>
                          <Plus className='h-4 w-4 mr-2' />
                          Create Sheet
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='sm:max-w-[525px]'>
                        <DialogHeader>
                          <DialogTitle>Create New SDE Sheet</DialogTitle>
                          <DialogDescription>
                            Create a new problem sheet for interview preparation
                          </DialogDescription>
                        </DialogHeader>
                        <div className='grid gap-4 py-4'>
                          <div className='grid gap-2'>
                            <Label htmlFor='title'>Title</Label>
                            <Input id='title' placeholder='Enter sheet title' />
                          </div>
                          <div className='grid gap-2'>
                            <Label htmlFor='description'>Description</Label>
                            <Textarea
                              id='description'
                              placeholder='Describe your sheet'
                            />
                          </div>
                          {/* <div className='grid gap-2'>
                            <Label htmlFor='difficulty'>Difficulty Level</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder='Select difficulty' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='easy'>Easy</SelectItem>
                                <SelectItem value='medium'>Medium</SelectItem>
                                <SelectItem value='hard'>Hard</SelectItem>
                                <SelectItem value='mixed'>Mixed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div> */}
                          {/* <div className='grid gap-2'>
                            <Label htmlFor='tags'>Tags (comma separated)</Label>
                            <Input
                              id='tags'
                              placeholder='Arrays, Strings, Trees...'
                            />
                          </div> */}
                        </div>
                        <DialogFooter>
                          <Button
                            type='submit'
                            onClick={handleCreateSheet}
                            className='bg-blue-600 hover:bg-blue-700'
                          >
                            Create Sheet
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
            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
              <Card>
                <CardContent className='p-6'>
                  <div className='flex items-center'>
                    <BookOpen className='h-8 w-8 text-blue-600' />
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-600'>
                        Total Sheets
                      </p>
                      <p className='text-2xl font-bold text-gray-900'>
                        {sheetDetails.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='p-6'>
                  <div className='flex items-center'>
                    <Target className='h-8 w-8 text-green-600' />
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-600'>
                        Total Problems
                      </p>
                      <p className='text-2xl font-bold text-gray-900'>
                        {sheetDetails.reduce(
                          (total, sheet) => total + sheet.totalProblems,
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='p-6'>
                  <div className='flex items-center'>
                    <TrendingUp className='h-8 w-8 text-purple-600' />
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-600'>
                        Success Rate
                      </p>
                      <p className='text-2xl font-bold text-gray-900'>78%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='p-6'>
                  <div className='flex items-center'>
                    <Clock className='h-8 w-8 text-orange-600' />
                    <div className='ml-4'>
                      <p className='text-sm font-medium text-gray-600'>
                        Study Streak
                      </p>
                      <p className='text-2xl font-bold text-gray-900'>
                        12 days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <div className='flex flex-col sm:flex-row gap-4 mb-6'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  placeholder='Search sheets by title, description, or tags...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm'>
                  <Filter className='h-4 w-4 mr-2' />
                  Filter
                </Button>
                <Select
                  value={viewMode}
                  onValueChange={(value) => setViewMode(value)}
                >
                  <SelectTrigger className='w-32'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='grid'>Grid View</SelectItem>
                    <SelectItem value='list'>List View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sheets Grid/List */}
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredSheets.map((sheet) => (
                <Card
                  key={sheet.id}
                  className='hover:shadow-lg transition-shadow cursor-pointer'
                >
                  <CardHeader>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <CardTitle className='text-lg mb-2'>
                          {sheet.name}
                        </CardTitle>
                        <CardDescription className='text-sm text-gray-600 line-clamp-2'>
                          {sheet.description}
                        </CardDescription>
                      </div>
                      {isAdmin && (
                        <DropdownMenu
                          open={openDropdownId === sheet.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenDropdownId(sheet.id);
                            } else {
                              setOpenDropdownId(null);
                            }
                          }}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreVertical className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem>
                              <Eye className='mr-2 h-4 w-4' />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className='mr-2 h-4 w-4' />
                              Edit Sheet
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setDropdownOpen(false); // manually close dropdown
                                setTimeout(() => setAddProblemOpen(true), 50);
                              }}
                              className='text-blue-600'
                            >
                              <Plus className='mr-2 h-4 w-4' />
                              Add Problem
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='text-red-600'>
                              <Trash2 className='mr-2 h-4 w-4' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    <div className='flex items-center space-x-2 mt-3'>
                      <Avatar className='h-6 w-6'>
                        <AvatarImage
                          src={sheet.user.image || '/placeholder.svg'}
                        />
                        <AvatarFallback>{sheet.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className='text-sm text-gray-600'>
                        {sheet.user.name}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className='space-y-4'>
                      {/* Progress - using totalProblems since we don't have completedProblems */}
                      <div>
                        <div className='flex justify-between text-sm mb-2'>
                          <span>Total Problems</span>
                          <span>{sheet.totalProblems}</span>
                        </div>
                        <Progress
                          value={sheet.totalProblems > 0 ? 50 : 0} // Default 50% or 0 if no problems
                          className='h-2'
                        />
                      </div>

                      {/* Tags */}
                      <div className='flex flex-wrap gap-1'>
                        {sheet.allTags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant='secondary'
                            className='text-xs'
                          >
                            {tag}
                          </Badge>
                        ))}
                        {sheet.allTags.length > 3 && (
                          <Badge variant='secondary' className='text-xs'>
                            +{sheet.allTags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Difficulty - showing all difficulties from the sheet */}
                      <div className='flex flex-wrap gap-1'>
                        {sheet.allDifficulties.map((difficulty, index) => (
                          <Badge
                            key={index}
                            className={getDifficultyColor(difficulty)}
                          >
                            {difficulty}
                          </Badge>
                        ))}
                        {sheet.allDifficulties.length === 0 && (
                          <Badge variant='outline'>No Problems</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className='pt-0'>
                    <div className='flex items-center justify-between w-full text-sm text-gray-500'>
                      <div className='flex items-center space-x-4'>
                        <div className='flex items-center'>
                          <Star className='h-4 w-4 mr-1' />0{' '}
                          {/* Default value since not in data */}
                        </div>
                        <div className='flex items-center'>
                          <Eye className='h-4 w-4 mr-1' />0{' '}
                          {/* Default value since not in data */}
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <Calendar className='h-4 w-4 mr-1' />
                        {new Date(sheet.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Add Problem Dialog */}
            <Dialog open={addProblemOpen} onOpenChange={setAddProblemOpen}>
              <DialogContent className='sm:max-w-[525px]'>
                <DialogHeader>
                  <DialogTitle>Add New Problem</DialogTitle>
                  <DialogDescription>
                    Add a new problem to the selected sheet
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
                    <Label htmlFor='problem-link'>Problem Link</Label>
                    <Input
                      id='problem-link'
                      placeholder='https://leetcode.com/problems/...'
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='problem-difficulty'>Difficulty</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder='Select difficulty' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='easy'>Easy</SelectItem>
                        <SelectItem value='medium'>Medium</SelectItem>
                        <SelectItem value='hard'>Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='problem-category'>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='arrays'>Arrays</SelectItem>
                        <SelectItem value='strings'>Strings</SelectItem>
                        <SelectItem value='trees'>Trees</SelectItem>
                        <SelectItem value='graphs'>Graphs</SelectItem>
                        <SelectItem value='dp'>Dynamic Programming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='problem-notes'>Notes (Optional)</Label>
                    <Textarea
                      id='problem-notes'
                      placeholder='Add any notes or hints'
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
          </main>
        </>
      ) : (
        <>
          <SkeletonCard />
        </>
      )}
    </div>
  );
}
