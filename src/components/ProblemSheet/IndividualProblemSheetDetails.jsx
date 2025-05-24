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

    console.log("isSuccess", isSuccess);

  const completedCount = sheetData.problems.filter((p) => p.completed).length;
  const progressPercentage = (completedCount / sheetData.totalProblems) * 100;

  const { sheetId } = useParams();

  console.log("sheetId", sheetId);

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

  const filteredProblems = sheetData.problems.filter((problemItem) => {
    const problem = problemItem.problem;
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesDifficulty =
      difficultyFilter === 'all' ||
      problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

    const matchesTag = tagFilter === 'all' || problem.tags.includes(tagFilter);

    const matchesCompletion =
      completionFilter === 'all' ||
      (completionFilter === 'completed' && problemItem.completed) ||
      (completionFilter === 'pending' && !problemItem.completed);

    return (
      matchesSearch && matchesDifficulty && matchesTag && matchesCompletion
    );
  });

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
          <h1 className='text-3xl font-bold'>Problem Sheet</h1>
        </>
      ) : (
        <>
          {' '}
          <h1 className='text-3xl font-bold'>Loading Sheet</h1>{' '}
        </>
      )}
      {/* Header */}
    </div>
  );
}
