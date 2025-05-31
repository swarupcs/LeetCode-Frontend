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
  Minus,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetIndividualSheetDetails } from '@/hooks/apis/ProblemSheets/useGetIndividualSheetDetails';
import { SkeletonCard } from '@/Pages/SkeletonPage/SkeletonCard';
import { useGetAllProblems } from '@/hooks/apis/getAllProblems/useGetAllProblems';
import { useSelector } from 'react-redux';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { useUpdateProblemsInSheet } from '@/hooks/apis/ProblemSheets/useUpdateProblemsInSheet';
// Mock data based on your structure

export default function IndividualProblemSheetDetails({ params }) {
  const [sheetData, setSheetData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [completionFilter, setCompletionFilter] = useState('all');
  const [addProblemOpen, setAddProblemOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(useSelector((state) => state.auth.role)); // Toggle for demo
  const [dialogSearchQuery, setDialogSearchQuery] = useState('');
  const [dialogDifficultyFilter, setDialogDifficultyFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [sheetProblems, setSheetProblems] = useState([]);

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

  const {
    isLoading: sheetDetailsLoading,
    isSuccess,
    error,
    getIndividualSheetDetailsMutation,
  } = useGetIndividualSheetDetails();

  const {
    isPending,
    isSuccess: getAllProblemSuccess,
    error: getAllProblemError,
    getAllProblemsMutation,
  } = useGetAllProblems();

  const {
    isLoading: isUpdateLoading,
    isSucess,
    error: updateError,
    updateProblemsInSheetMutation,
  } = useUpdateProblemsInSheet();

  console.log('isSuccess', isSuccess);

  const [problems, setProblems] = useState([]);
  //   const [filteredProblems, setFilteredProblems] = useState(problems);

  console.log('problems', problems);

  const authUser = useSelector((state) => state.auth);
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

  const getAllProblems = async () => {
    try {
      const userId = authUser?.id || null;
      const data = await getAllProblemsMutation(userId);
      console.log('Fetched all problems:', data);
      setProblems(data.problems);
      //   setFilteredProblems(data.problems);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  console.log('problems', problems);

  useEffect(() => {
    getAllProblems();
    if (isSuccess) {
      console.log('Successfully fetched all problems');
    }
  }, []);

  // Updated filtering function
  const filteredProblems = sheetData?.problems?.filter((problemItem) => {
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

  const completedCount = sheetData?.problems?.filter(
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

  const handleAddProblemClick = () => {
    // setAddProblemOpen(true);
  };

  // Check if a problem is already in the sheet
  const isProblemInSheet = (problemId) => {
    return sheetData.problems.some(
      (sheetProblem) => sheetProblem.problemId === problemId
    );
  };

  // Add problem to sheet with proper validation
  const addProblemToSheet = async (problem) => {
    // Check if problem is already in sheet
    if (isProblemInSheet(problem.id)) {
      alert('This problem is already in the sheet!');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newSheetProblem = {
        id: `temp-${Date.now()}-${Math.random()}`,
        sheetId: sheetData.id,
        problemId: problem.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        problem: problem,
        completed: false,
      };

      setSheetData((prev) => {
        const updatedTags = [...new Set([...prev.allTags, ...problem.tags])];
        const updatedDifficulties = [
          ...new Set([...prev.allDifficulties, problem.difficulty]),
        ];

        return {
          ...prev,
          problems: [...prev.problems, newSheetProblem],
          totalProblems: prev.totalProblems + 1,
          allTags: updatedTags,
          allDifficulties: updatedDifficulties,
        };
      });

      console.log(`Added problem "${problem.title}" to sheet`);
    } catch (error) {
      console.error('Error adding problem to sheet:', error);
      alert('Failed to add problem to sheet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove problem from sheet with proper validation
  const removeProblemFromSheet = async (problemId) => {
    // Check if problem exists in sheet
    if (!isProblemInSheet(problemId)) {
      alert('This problem is not in the sheet!');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSheetData((prev) => {
        const updatedProblems = prev.problems.filter(
          (sp) => sp.problemId !== problemId
        );

        // Recalculate tags and difficulties from remaining problems
        const remainingTags = [
          ...new Set(updatedProblems.flatMap((p) => p.problem.tags)),
        ];
        const remainingDifficulties = [
          ...new Set(updatedProblems.map((p) => p.problem.difficulty)),
        ];

        return {
          ...prev,
          problems: updatedProblems,
          totalProblems: updatedProblems.length,
          allTags: remainingTags,
          allDifficulties: remainingDifficulties,
        };
      });

      console.log(`Removed problem with ID ${problemId} from sheet`);
    } catch (error) {
      console.error('Error removing problem from sheet:', error);
      alert('Failed to remove problem from sheet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProblems = async () => {
    setIsLoading(true);
    try {
      setAddProblemOpen(false);

      let sheetProblemsId = sheetData.problems.map(
        (problem) => problem.problem.id
      );
      console.log('sheetProblemsId', sheetProblemsId);

      // Call the mutation properly
      await updateProblemsInSheetMutation({
        sheetId: sheetData.id,
        problemIds: sheetProblemsId,
      });

      console.log('Updated problems in sheet successfully!');
    } catch (error) {
      console.error('Error updating problems in sheet:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Filter problems in dialog (excluding problems already in sheet for "Add" view)
  const filteredDialogProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(dialogSearchQuery.toLowerCase()) ||
      problem.tags.some((tag) =>
        tag.toLowerCase().includes(dialogSearchQuery.toLowerCase())
      );

    const matchesDifficulty =
      dialogDifficultyFilter === 'all' ||
      problem.difficulty.toLowerCase() === dialogDifficultyFilter.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });







  return (
    <div
      className='min-h-screen bg-gradient-to-br from-premium-midnight to-premium-cyan-dark
'
    >
      {isSuccess ? (
        <>
          <div
            className='bg-gradient-to-r from-premium-shadow to-premium-purple
 border-b border-gray-200'
          >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='flex justify-between items-center h-16'>
                <div className='flex items-center space-x-4'>
                  <Button
                    className='bg-blue-600 hover:bg-blue-700'
                    onClick={() => navigate(-1)}
                  >
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
                        <Button
                          className='bg-blue-600 hover:bg-blue-700'
                          onClick={handleAddProblemClick}
                        >
                          <Plus className='h-4 w-4 mr-2' />
                          Add Problem
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='sm:max-w-[525px] max-h-[calc(100vh-4rem)] overflow-y-auto'>
                        <DialogHeader>
                          <DialogTitle>Add New Problem</DialogTitle>
                          <DialogDescription>
                            Add a new problem to this sheet
                          </DialogDescription>
                        </DialogHeader>

                        {/* Problems List */}
                        <div className='mt-4'>
                          <div className='bg-white rounded-lg border max-h-96 overflow-y-auto'>
                            <Table>
                              <TableHeader className='sticky top-0 bg-white border-b'>
                                <TableRow>
                                  <TableHead className='w-16'>#</TableHead>
                                  <TableHead>Title</TableHead>
                                  <TableHead className='w-24'>
                                    Difficulty
                                  </TableHead>
                                  <TableHead className='w-32'>Status</TableHead>
                                  <TableHead className='w-32'>Action</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredDialogProblems.length > 0 ? (
                                  filteredDialogProblems.map((problem) => {
                                    const isInSheet = isProblemInSheet(
                                      problem.id
                                    );
                                    return (
                                      <TableRow
                                        key={problem.id}
                                        className=''
                                      >
                                        <TableCell className='font-medium'>
                                          {problem.problemNumber}
                                        </TableCell>
                                        <TableCell>
                                          <div className='flex flex-col'>
                                            <span className='font-medium'>
                                              {problem.title}
                                            </span>
                                            <div className='flex flex-wrap gap-1 mt-1'>
                                              {problem.tags
                                                .slice(0, 3)
                                                .map((tag) => (
                                                  <Badge
                                                    key={tag}
                                                    variant='outline'
                                                    className='text-xs'
                                                  >
                                                    {tag}
                                                  </Badge>
                                                ))}
                                              {problem.tags.length > 3 && (
                                                <Badge
                                                  variant='outline'
                                                  className='text-xs'
                                                >
                                                  +{problem.tags.length - 3}
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            className={getDifficultyColor(
                                              problem.difficulty
                                            )}
                                          >
                                            {problem.difficulty}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          {isInSheet ? (
                                            <Badge
                                              variant='secondary'
                                              className='bg-green-100 text-green-800'
                                            >
                                              In Sheet
                                            </Badge>
                                          ) : (
                                            <Badge variant='outline'>
                                              Available
                                            </Badge>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          {isInSheet ? (
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                <Button
                                                  variant='destructive'
                                                  size='sm'
                                                  disabled={isLoading}
                                                >
                                                  <Minus className='h-4 w-4 mr-1' />
                                                  Remove
                                                </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogTitle>
                                                    Remove Problem
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    Are you sure you want to
                                                    remove "{problem.title}"
                                                    from this sheet? This action
                                                    cannot be undone.
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel>
                                                    Cancel
                                                  </AlertDialogCancel>
                                                  <AlertDialogAction
                                                    onClick={() =>
                                                      removeProblemFromSheet(
                                                        problem.id
                                                      )
                                                    }
                                                    className='bg-red-600 hover:bg-red-700'
                                                  >
                                                    Remove
                                                  </AlertDialogAction>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                          ) : (
                                            <Button
                                              variant='default'
                                              size='sm'
                                              onClick={() =>
                                                addProblemToSheet(problem)
                                              }
                                              disabled={isLoading}
                                              className='bg-green-600 hover:bg-green-700'
                                            >
                                              <Plus className='h-4 w-4 mr-1' />
                                              Add
                                            </Button>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })
                                ) : (
                                  <TableRow>
                                    <TableCell
                                      colSpan={5}
                                      className='text-center py-8 text-gray-500'
                                    >
                                      No problems found matching your filters.
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            variant='outline'
                            onClick={handleUpdateProblems}
                          >
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className=' max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Sheet Header */}
            <div className='mb-8'>
              <Card className='bg-[hsl(var(--premium-rose))] border border-pink-300 text-white p-4 rounded-lg'>
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
                      <Button variant='outline' size='sm' className='text-blue-600'>
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
              <Card className='bg-[hsl(var(--premium-rose))] text-white p-4 rounded-xl'>
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
            <Card className='bg-[hsl(var(--premium-rose))] text-white p-4 rounded-xl shadow-lg'>
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
                          className=''
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
                            <div className='flex flex-wrap gap-1 '>
                              {problemItem.problem.tags &&
                              problemItem.problem.tags.length > 0 ? (
                                <>
                                  {problemItem.problem.tags
                                    .slice(0, 2)
                                    .map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant='outline'
                                        className='text-xs text-gray-950 bg-blue-400'
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
                            <Button variant='ghost' size='sm' onClick={() => navigate(`/problems/${problemItem.problem.id}`)}>
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
