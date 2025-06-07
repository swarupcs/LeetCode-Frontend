import { useState, useMemo, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  Reply,
  ExternalLink,
  Briefcase,
  Code,
  Users,
  TrendingUp,
  Clock,
  Star,
  FileText,
  Code2,
} from 'lucide-react';
import { DiscussionComments } from './DiscussionThread';
import { RichTextEditor } from './RichTextEditor';
import { useGetAllDiscussions } from '@/hooks/apis/discussions/useGetAllDiscussions';
import { SkeletonCard } from '@/Pages/SkeletonPage/SkeletonCard';
import { useCreateDiscussion } from '@/hooks/apis/discussions/useCreateDiscussions';
import { EditorTabs } from './EditorTabs';
import { toast } from 'sonner';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';
import { useDeleteDiscussion } from '@/hooks/apis/discussions/useDeleteDiscussion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { useSelector } from 'react-redux';

// Discussion categories
const categories = [
  {
    id: 'problem',
    label: 'Problem Discussion',
    icon: Code,
    color: 'bg-blue-500',
  },
  {
    id: 'interview',
    label: 'Interview Experience',
    icon: Briefcase,
    color: 'bg-green-500',
  },
  {
    id: 'career',
    label: 'Career Advice',
    icon: TrendingUp,
    color: 'bg-purple-500',
  },
  {
    id: 'general',
    label: 'General Discussion',
    icon: Users,
    color: 'bg-orange-500',
  },
];

// Sample problems for reference
const sampleProblems = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy' },
  { id: 2, title: 'Add Two Numbers', difficulty: 'Medium' },
  {
    id: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
  },
  { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard' },
  { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium' },
  { id: 6, title: 'Regular Expression Matching', difficulty: 'Hard' },
];

// Sample comments
const sampleComments = [
  {
    id: 1,
    content:
      'Great explanation! This is much cleaner than the brute force approach. I especially like how you explained the time complexity trade-offs.',
    author: 'newbie123',
    authorAvatar: '/placeholder.svg?height=24&width=24',
    createdAt: '2024-01-15T11:00:00Z',
    upvotes: 12,
    downvotes: 0,
    userVote: 1,
    replies: [
      {
        id: 2,
        content:
          'Agreed! The HashMap approach is definitely the way to go for this problem.',
        author: 'codingNinja',
        authorAvatar: '/placeholder.svg?height=24&width=24',
        createdAt: '2024-01-15T11:30:00Z',
        upvotes: 5,
        downvotes: 0,
        userVote: 0,
        replies: [],
      },
    ],
  },
  {
    id: 3,
    content:
      "Can you explain the time complexity analysis in more detail? I'm still learning about Big O notation.",
    author: 'student_dev',
    authorAvatar: '/placeholder.svg?height=24&width=24',
    createdAt: '2024-01-15T11:15:00Z',
    upvotes: 8,
    downvotes: 0,
    userVote: 0,
    replies: [
      {
        id: 4,
        content:
          "We iterate through the array once (O(n)) and HashMap operations are O(1) on average, so overall it's O(n). The space complexity is also O(n) for the HashMap.",
        author: 'algorithmExpert',
        authorAvatar: '/placeholder.svg?height=24&width=24',
        createdAt: '2024-01-15T11:45:00Z',
        upvotes: 15,
        downvotes: 0,
        userVote: 0,
        replies: [
          {
            id: 5,
            content:
              'Thanks! That makes it much clearer. So the trade-off is space for time efficiency.',
            author: 'student_dev',
            authorAvatar: '/placeholder.svg?height=24&width=24',
            createdAt: '2024-01-15T12:00:00Z',
            upvotes: 3,
            downvotes: 0,
            userVote: 0,
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    content:
      "I implemented this in Python and got the same result. Here's my version:\n\n```python\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        if target - num in seen:\n            return [seen[target - num], i]\n        seen[num] = i\n```",
    author: 'pythonista',
    authorAvatar: '/placeholder.svg?height=24&width=24',
    createdAt: '2024-01-15T12:30:00Z',
    upvotes: 20,
    downvotes: 1,
    userVote: 0,
    replies: [],
  },
];

// Sample global discussions with comments
const sampleDiscussions = [
  {
    id: 1,
    title: 'Google Interview Experience - L4 SWE Position',
    content: `Just finished my Google interview process and wanted to share my experience!\n\n**Round 1: Phone Screen**\n- Two Sum variant\n- Follow-up questions about optimization\n\n**Round 2-5: Onsite**\n- Dynamic Programming (Edit Distance)\n- System Design (Design a URL Shortener)\n- Behavioral questions\n- Coding on whiteboard\n\n**Tips:**\n- Practice explaining your thought process\n- Don't jump into coding immediately\n- Ask clarifying questions\n\n**Result:** Got the offer! 🎉`,
    contentType: 'text',
    codeContent: '',
    codeLanguage: 'javascript',
    category: 'interview',
    problemId: null,
    company: 'Google',
    position: 'L4 Software Engineer',
    author: 'techInterviewee',
    authorAvatar: '/placeholder.svg?height=32&width=32',
    createdAt: '2024-01-15T10:30:00Z',
    upvotes: 89,
    downvotes: 3,
    userVote: 1,
    commentCount: 24,
    tags: ['Google', 'L4', 'System Design', 'Interview Tips'],
    isBookmarked: false,
    comments: sampleComments,
  },
  {
    id: 2,
    title: 'Optimal Solution for Two Sum - Multiple Approaches',
    content: `Let's discuss different approaches to solve Two Sum and their trade-offs:

**Approach 1: Brute Force O(n²)**
Simple nested loop approach - easy to understand but inefficient for large inputs.

**Approach 2: HashMap O(n)**
Single pass with hash map - optimal time complexity with O(n) space trade-off.

**Analysis:**
- Time Complexity: O(n²) vs O(n)
- Space Complexity: O(1) vs O(n)
- Readability: High vs Medium
- Performance: Poor vs Excellent

Which approach do you prefer and why?`,
    contentType: 'code',
    codeContent: `// JavaScript - HashMap Approach
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}

// Test case
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,
    codeLanguage: 'javascript',
    category: 'problem',
    problemId: 1,
    problemTitle: 'Two Sum',
    problemDifficulty: 'Easy',
    author: 'algorithmExpert',
    authorAvatar: '/placeholder.svg?height=32&width=32',
    createdAt: '2024-01-14T15:20:00Z',
    upvotes: 156,
    downvotes: 4,
    userVote: 0,
    commentCount: 43,
    tags: ['JavaScript', 'HashMap', 'Time Complexity', 'Optimization'],
    isBookmarked: true,
    comments: sampleComments,
  },
];

const allTags = [
  // Programming Languages
  'Python',
  'Java',
  'JavaScript',
  'C++',
  'Go',
  'Rust',
  // Companies
  'Google',
  'Meta',
  'Amazon',
  'Microsoft',
  'Apple',
  'Netflix',
  // Concepts
  'Dynamic Programming',
  'System Design',
  'Data Structures',
  'Algorithms',
  // Interview
  'Interview Tips',
  'Behavioral',
  'Coding Interview',
  'System Design Interview',
  // Career
  'Career Transition',
  'Salary Negotiation',
  'Remote Work',
  'Startup vs Big Tech',
  // Difficulty
  'Beginner',
  'Intermediate',
  'Advanced',
  // Contest
  'Contest',
  'Weekly',
  'Competition',
];

const companies = [
  'Google',
  'Meta',
  'Amazon',
  'Microsoft',
  'Apple',
  'Netflix',
  'Uber',
  'Airbnb',
  'Spotify',
  'Twitter',
  'LinkedIn',
  'Salesforce',
  'Adobe',
  'Other',
];

export default function GlobalDiscussion() {
  const [discussions, setDiscussions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('top');
  const [filterTag, setFilterTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState([]);

  // New post form state
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    contentType: 'text',
    codeContent: '',
    codeLanguage: 'javascript',
    category: 'general',
    problemId: null,
    company: '',
    position: '',
    tags: [],
  });

  const authUser = useSelector((state) => state.auth);

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  console.log('newPost', newPost);

  const {
    data: discussionData,
    isPending: discussionPending,
    isSuccess: discussionSuccess,
    error: discussionError,
    refetch: discussionRefetch,
  } = useGetAllDiscussions();

  const {
    isPending: createDiscussionPending,
    isSuccess: createDiscussionSuccess,
    error: createDiscussionError,
    createDiscussionMutation,
  } = useCreateDiscussion();

  const {
    isPending: deleteDiscussionPending,
    isSuccess: deleteDiscussionSuccess,
    error: deleteDiscussionError,
    deleteDiscussionMutation,
  } = useDeleteDiscussion();

  useEffect(() => {
    console.log('discussionData', discussionData);
    setDiscussions(discussionData?.data);
  }, [discussionData]);

  console.log('discussion Pending', discussionPending);

  const handleCreateDiscussion = async (post) => {
    try {
      console.log('post', post);
      const data = await createDiscussionMutation(post);
      console.log('successfully created discussion', data);
      toast.success('Discussion created successfully.');
      await discussionRefetch();
    } catch (error) {
      console.log('error while creating discussion', error);
    }
  };

  const handleVote = (discussionId, voteType) => {
    setDiscussions((prev) =>
      prev.map((discussion) => {
        if (discussion.id === discussionId) {
          const currentVote = discussion.userVote;
          let newVote = 0;
          let upvotes = discussion.upvotes;
          let downvotes = discussion.downvotes;

          // Remove previous vote
          if (currentVote === 1) upvotes--;
          if (currentVote === -1) downvotes--;

          // Apply new vote
          if (voteType === 'up' && currentVote !== 1) {
            newVote = 1;
            upvotes++;
          } else if (voteType === 'down' && currentVote !== -1) {
            newVote = -1;
            downvotes++;
          }

          return { ...discussion, userVote: newVote, upvotes, downvotes };
        }
        return discussion;
      })
    );
  };

  const handleCommentVote = (discussionId, commentId, voteType) => {
    setDiscussions((prev) =>
      prev.map((discussion) => {
        if (discussion.id === discussionId) {
          const updateCommentVote = (comments) => {
            return comments.map((comment) => {
              if (comment.id === commentId) {
                const currentVote = comment.userVote;
                let newVote = 0;
                let upvotes = comment.upvotes;
                let downvotes = comment.downvotes;

                // Remove previous vote
                if (currentVote === 1) upvotes--;
                if (currentVote === -1) downvotes--;

                // Apply new vote
                if (voteType === 'up' && currentVote !== 1) {
                  newVote = 1;
                  upvotes++;
                } else if (voteType === 'down' && currentVote !== -1) {
                  newVote = -1;
                  downvotes++;
                }

                return { ...comment, userVote: newVote, upvotes, downvotes };
              }
              return {
                ...comment,
                replies: updateCommentVote(comment.replies),
              };
            });
          };

          return {
            ...discussion,
            comments: updateCommentVote(discussion.comments),
          };
        }
        return discussion;
      })
    );
  };

  const handleAddComment = (discussionId, content) => {
    const newComment = {
      id: Date.now(),
      content,
      author: 'currentUser',
      authorAvatar: '/placeholder.svg?height=24&width=24',
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVote: 0,
      replies: [],
    };

    setDiscussions((prev) =>
      prev.map((discussion) => {
        if (discussion.id === discussionId) {
          return {
            ...discussion,
            comments: [...discussion.comments, newComment],
            commentCount: discussion.commentCount + 1,
          };
        }
        return discussion;
      })
    );
  };

  const handleReplyToComment = (discussionId, parentId, content) => {
    const newReply = {
      id: Date.now(),
      content,
      author: 'currentUser',
      authorAvatar: '/placeholder.svg?height=24&width=24',
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVote: 0,
      replies: [],
    };

    setDiscussions((prev) =>
      prev.map((discussion) => {
        if (discussion.id === discussionId) {
          const addReply = (comments) => {
            return comments.map((comment) => {
              if (comment.id === parentId) {
                return { ...comment, replies: [...comment.replies, newReply] };
              }
              return { ...comment, replies: addReply(comment.replies) };
            });
          };

          return {
            ...discussion,
            comments: addReply(discussion.comments),
            commentCount: discussion.commentCount + 1,
          };
        }
        return discussion;
      })
    );
  };

  const handleEditComment = (discussionId, commentId, content) => {
    setDiscussions((prev) =>
      prev.map((discussion) => {
        if (discussion.id === discussionId) {
          const editComment = (comments) => {
            return comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  content,
                  isEdited: true,
                  editedAt: new Date().toISOString(),
                };
              }
              return { ...comment, replies: editComment(comment.replies) };
            });
          };

          return { ...discussion, comments: editComment(discussion.comments) };
        }
        return discussion;
      })
    );
  };

  const handleDeleteComment = (discussionId, commentId) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      setDiscussions((prev) =>
        prev.map((discussion) => {
          if (discussion.id === discussionId) {
            const deleteComment = (comments) => {
              return comments
                .filter((comment) => comment.id !== commentId)
                .map((comment) => ({
                  ...comment,
                  replies: deleteComment(comment.replies),
                }));
            };

            return {
              ...discussion,
              comments: deleteComment(discussion.comments),
              commentCount: discussion.commentCount - 1,
            };
          }
          return discussion;
        })
      );
    }
  };

  const handleReportComment = (discussionId, commentId) => {
    alert('Comment reported. Thank you for helping keep our community safe.');
  };

  const toggleBookmark = (discussionId) => {
    setDiscussions((prev) =>
      prev.map((discussion) =>
        discussion.id === discussionId
          ? { ...discussion, isBookmarked: !discussion.isBookmarked }
          : discussion
      )
    );
  };

  const toggleComments = (discussionId) => {
    setExpandedComments((prev) =>
      prev.includes(discussionId)
        ? prev.filter((id) => id !== discussionId)
        : [...prev, discussionId]
    );
  };

  const filteredAndSortedDiscussions = useMemo(() => {
    let filtered = discussions;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((d) => d.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (d.company &&
            d.company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by tag
    if (filterTag !== 'all') {
      filtered = filtered?.filter((d) => d.tags.includes(filterTag));
    }

    // Sort
    return filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'top':
          return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'oldest':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case 'discussed':
          return b.commentCount - a.commentCount;
        default:
          return 0;
      }
    });
  }, [discussions, activeCategory, sortBy, filterTag, searchQuery]);

  const handleCreatePost = () => {
    if (!newPost.title.trim()) return;

    // Validate content based on selected type
    if (newPost.contentType === 'text' && !newPost.content.trim()) {
      toast.warning;
      toast.warning('Please add some content to your post');
      return;
    }

    if (newPost.contentType === 'code' && !newPost.codeContent.trim()) {
      toast.warning('Please add some code to your solution');
      return;
    }

    handleCreateDiscussion(newPost);

    setNewPost({
      title: '',
      content: '',
      contentType: 'text',
      codeContent: '',
      codeLanguage: 'javascript',
      category: 'general',
      problemId: null,
      company: '',
      position: '',
      tags: [],
    });
    setNewPostOpen(false);
  };

  const [discussionToDelete, setDiscussionToDelete] = useState(null);
  const [discussionConfirmOpen, setDiscussionConfirmOpen] = useState(false);

  const handleDeleteDiscussion = (discussionId) => {
    console.log('discussionId', discussionId);
    const discussion = discussions.find((d) => d.id === discussionId);
    if (discussion) {
      const totalReplies = discussion?.comments?.reduce((count, comment) => {
        const getReplyCount = (c) => {
          return c.replies.reduce(
            (total, reply) => total + 1 + getReplyCount(reply),
            0
          );
        };
        return count + getReplyCount(comment);
      }, 0);

      setDeleteTarget({
        type: 'discussion',
        id: discussionId,
        title: discussion.title,
        author: discussion.author,
        commentCount: discussion.commentCount,
        replyCount: totalReplies,
      });
      setDeleteDialogOpen(true);
    }
  };

  const handleDelDiscussion = async (discussionId) => {
    // const discussion = discussions.find((d) => d.id === discussionId);
    // setDiscussionToDelete(discussion);
    try {
      console.log('discussionId', discussionId);
      await deleteDiscussionMutation(discussionId);
      toast.success('Discussion deleted successfully.');
      setDiscussionToDelete(null);
      await discussionRefetch();
      setDiscussionConfirmOpen(false);
    } catch (error) {
      console.error('Error deleting discussion:', error);
      toast.error('Failed to delete discussion. Please try again.');
      return;
    }
  };



  const confirmDelete = async() => {
    try {
      console.log("discussionToDelete", discussionToDelete);
      // deleteDiscussionMutation(discussionToDelete?.id);
      toast.success('Discussion deleted successfully.');
      // await discussionRefetch(); 
      setDiscussionConfirmOpen(false);
    } catch (error) {
      console.error('Error deleting discussion:', error);
      toast.error('Failed to delete discussion. Please try again.');
    }
  };


  const confirmDeleteDiscussion = () => {
    if (deleteTarget && deleteTarget.type === 'discussion') {
      setDiscussions((prev) =>
        prev.filter((discussion) => discussion.id !== deleteTarget.id)
      );
    }
  };

  const confirmDeleteComment = () => {
    if (
      deleteTarget &&
      deleteTarget.type === 'comment' &&
      deleteTarget.discussionId
    ) {
      setDiscussions((prev) =>
        prev.map((discussion) => {
          if (discussion.id === deleteTarget.discussionId) {
            const deleteComment = (comments) => {
              return comments
                .filter((comment) => comment.id !== deleteTarget.id)
                .map((comment) => ({
                  ...comment,
                  replies: deleteComment(comment.replies),
                }));
            };

            return {
              ...discussion,
              comments: deleteComment(discussion.comments),
              commentCount: discussion.commentCount - 1,
            };
          }
          return discussion;
        })
      );
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.icon : Users;
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.color : 'bg-gray-500';
  };

  const formatMarkdown = (text) => {
    if (!text) return '';

    // Simple markdown to HTML conversion for display
    return text
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>'
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>'
      )
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(
        /`(.*?)`/g,
        '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>'
      )
      .replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        '<pre class="bg-muted p-3 rounded-md overflow-x-auto my-2"><code>$2</code></pre>'
      )
      .replace(
        /^> (.*$)/gm,
        '<blockquote class="border-l-4 border-muted pl-4 italic my-2">$1</blockquote>'
      )
      .replace(/^\* (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" class="text-blue-500 underline">$1</a>'
      )
      .replace(
        /!\[([^\]]*)\]$$([^)]+)$$/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-2" />'
      )
      .replace(/\n/g, '<br>');
  };


  console.log('authUser', authUser);
  console.log('discussions', discussions);

  return (
    <>
      {discussionPending ? (
        <SkeletonCard />
      ) : (
        <div className='max-w-6xl mx-auto p-6 space-y-6'>
          {/* Header */}
          <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold'>Global Discussions</h1>
              <p className='text-muted-foreground'>
                Share experiences, discuss problems, and connect with the
                community
              </p>
            </div>

            <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
              <DialogTrigger asChild>
                <Button size='lg'>
                  <Plus className='w-4 h-4 mr-2' />
                  Create Post
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-5xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle>Create New Discussion Post</DialogTitle>
                </DialogHeader>
                <div className='space-y-6'>
                  {/* Post Type Selection */}
                  <div>
                    <Label>Post Type</Label>
                    <Tabs
                      value={newPost.contentType}
                      onValueChange={(value) =>
                        setNewPost((prev) => ({ ...prev, contentType: value }))
                      }
                    >
                      <TabsList className='grid w-full grid-cols-2'>
                        <TabsTrigger
                          value='text'
                          className='flex items-center gap-2'
                        >
                          <FileText className='w-4 h-4' />
                          Text Discussion
                        </TabsTrigger>
                        <TabsTrigger
                          value='code'
                          className='flex items-center gap-2'
                        >
                          <Code2 className='w-4 h-4' />
                          Code Solution
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Basic Info */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <Label htmlFor='category'>Category</Label>
                      <Select
                        value={newPost.category}
                        onValueChange={(value) =>
                          setNewPost((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                              <SelectItem key={category.id} value={category.id}>
                                <div className='flex items-center gap-2'>
                                  <Icon className='w-4 h-4' />
                                  {category.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {newPost.category === 'problem' && (
                      <div>
                        <Label htmlFor='problem'>
                          Related Problem (Optional)
                        </Label>
                        <Select
                          value={newPost.problemId?.toString() || 'none'}
                          onValueChange={(value) =>
                            setNewPost((prev) => ({
                              ...prev,
                              problemId:
                                value === 'none'
                                  ? null
                                  : Number.parseInt(value),
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select a problem...' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='none'>
                              No specific problem
                            </SelectItem>
                            {sampleProblems.map((problem) => (
                              <SelectItem
                                key={problem.id}
                                value={problem.id.toString()}
                              >
                                <div className='flex items-center gap-2'>
                                  <Badge
                                    variant={
                                      problem.difficulty === 'Easy'
                                        ? 'default'
                                        : problem.difficulty === 'Medium'
                                        ? 'secondary'
                                        : 'destructive'
                                    }
                                    className='text-xs'
                                  >
                                    {problem.difficulty}
                                  </Badge>
                                  {problem.title}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {newPost.category === 'interview' && (
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='company'>Company</Label>
                        <Select
                          value={newPost.company}
                          onValueChange={(value) =>
                            setNewPost((prev) => ({ ...prev, company: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select company...' />
                          </SelectTrigger>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem key={company} value={company}>
                                {company}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor='position'>Position</Label>
                        <Input
                          id='position'
                          value={newPost.position}
                          onChange={(e) =>
                            setNewPost((prev) => ({
                              ...prev,
                              position: e.target.value,
                            }))
                          }
                          placeholder='e.g., L4 Software Engineer'
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor='title'>Title</Label>
                    <Input
                      id='title'
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder='Enter a descriptive title...'
                    />
                  </div>

                  {/* Content Editor */}
                  {newPost.contentType === 'text' ? (
                    <div>
                      <Label>Content</Label>
                      <RichTextEditor
                        value={newPost.content}
                        onChange={(value) =>
                          setNewPost((prev) => ({ ...prev, content: value }))
                        }
                        placeholder='Share your thoughts, experience, or question...'
                      />
                    </div>
                  ) : (
                    <div>
                      <Label>Code Solution</Label>
                      <EditorTabs
                        textValue={newPost.content}
                        onTextChange={(value) =>
                          setNewPost((prev) => ({ ...prev, content: value }))
                        }
                        codeValue={newPost.codeContent}
                        onCodeChange={(value) =>
                          setNewPost((prev) => ({
                            ...prev,
                            codeContent: value,
                          }))
                        }
                        codeLanguage={newPost.codeLanguage}
                        onLanguageChange={(language) =>
                          setNewPost((prev) => ({
                            ...prev,
                            codeLanguage: language,
                          }))
                        }
                      />
                    </div>
                  )}

                  <div>
                    <Label>Tags</Label>
                    <div className='flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto'>
                      {allTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={
                            newPost.tags.includes(tag) ? 'default' : 'outline'
                          }
                          className='cursor-pointer'
                          onClick={() => {
                            setNewPost((prev) => ({
                              ...prev,
                              tags: prev.tags.includes(tag)
                                ? prev.tags.filter((t) => t !== tag)
                                : [...prev.tags, tag],
                            }));
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className='flex gap-2 justify-end'>
                    <Button
                      variant='outline'
                      onClick={() => setNewPostOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost}>Create Post</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Category Tabs */}
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-5'>
              <TabsTrigger value='all' className='flex items-center gap-2'>
                <Users className='w-4 h-4' />
                All
              </TabsTrigger>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className='flex items-center gap-2'
                  >
                    <Icon className='w-4 h-4' />
                    <span className='hidden sm:inline'>{category.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>

          {/* Search and Filters */}
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
              <Input
                placeholder='Search discussions, companies, or topics...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </div>

            <div className='flex gap-2'>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='w-[140px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='top'>
                    <div className='flex items-center gap-2'>
                      <TrendingUp className='w-4 h-4' />
                      Top
                    </div>
                  </SelectItem>
                  <SelectItem value='newest'>
                    <div className='flex items-center gap-2'>
                      <Clock className='w-4 h-4' />
                      Newest
                    </div>
                  </SelectItem>
                  <SelectItem value='oldest'>Oldest</SelectItem>
                  <SelectItem value='discussed'>Most Discussed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className='w-[120px]'>
                  <Filter className='w-4 h-4 mr-2' />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Discussion List */}
          <div className='space-y-6'>
            {filteredAndSortedDiscussions?.map((discussion) => {
              const CategoryIcon = getCategoryIcon(discussion.category);
              const isCommentsExpanded = expandedComments.includes(
                discussion.id
              );

              return (
                <Card
                  key={discussion.id}
                  className='overflow-hidden hover:shadow-md transition-shadow'
                >
                  <CardHeader className='pb-3'>
                    <div className='flex items-start gap-3'>
                      <div className='flex flex-col items-center gap-1 min-w-[60px]'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className={`p-1 h-8 w-8 ${
                            discussion.userVote === 1 ? 'text-orange-500' : ''
                          }`}
                          onClick={() => handleVote(discussion.id, 'up')}
                        >
                          <ChevronUp className='w-4 h-4' />
                        </Button>
                        <span className='text-sm font-medium'>
                          {discussion.upvotes - discussion.downvotes}
                        </span>
                        <Button
                          variant='ghost'
                          size='sm'
                          className={`p-1 h-8 w-8 ${
                            discussion.userVote === -1 ? 'text-blue-500' : ''
                          }`}
                          onClick={() => handleVote(discussion.id, 'down')}
                        >
                          <ChevronDown className='w-4 h-4' />
                        </Button>
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-2'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-2 mb-2'>
                              <div
                                className={`w-2 h-2 rounded-full ${getCategoryColor(
                                  discussion.category
                                )}`}
                              />
                              <CategoryIcon className='w-4 h-4 text-muted-foreground' />
                              <span className='text-sm text-muted-foreground'>
                                {
                                  categories.find(
                                    (c) => c.id === discussion.category
                                  )?.label
                                }
                              </span>
                              {discussion.contentType === 'code' && (
                                <>
                                  <span className='text-muted-foreground'>
                                    •
                                  </span>
                                  <Badge variant='outline' className='text-xs'>
                                    <Code2 className='w-3 h-3 mr-1' />
                                    {discussion.codeLanguage}
                                  </Badge>
                                </>
                              )}
                              {discussion.company && (
                                <>
                                  <span className='text-muted-foreground'>
                                    •
                                  </span>
                                  <Badge variant='outline' className='text-xs'>
                                    {discussion.company}
                                  </Badge>
                                </>
                              )}
                              {discussion.problemTitle && (
                                <>
                                  <span className='text-muted-foreground'>
                                    •
                                  </span>
                                  <div className='flex items-center gap-1'>
                                    <Badge
                                      variant={
                                        discussion.problemDifficulty === 'Easy'
                                          ? 'default'
                                          : discussion.problemDifficulty ===
                                            'Medium'
                                          ? 'secondary'
                                          : 'destructive'
                                      }
                                      className='text-xs'
                                    >
                                      {discussion.problemDifficulty}
                                    </Badge>
                                    <span className='text-sm text-muted-foreground'>
                                      {discussion.problemTitle}
                                    </span>
                                    <ExternalLink className='w-3 h-3 text-muted-foreground' />
                                  </div>
                                </>
                              )}
                            </div>
                            <h3 className='font-semibold text-lg leading-tight mb-2'>
                              {discussion.title}
                            </h3>
                          </div>

                          <div className='flex items-center gap-1'>
                            <Button
                              variant='ghost'
                              size='sm'
                              className={`h-8 w-8 p-0 ${
                                discussion.isBookmarked ? 'text-yellow-500' : ''
                              }`}
                              onClick={() => toggleBookmark(discussion.id)}
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  discussion.isBookmarked ? 'fill-current' : ''
                                }`}
                              />
                            </Button>
                            {discussion.author?.id === authUser?.id && (
                              <DropdownMenu
                                open={openDropdownId === discussion.id}
                                onOpenChange={(open) => {
                                  if (open) {
                                    setOpenDropdownId(discussion.id);
                                  } else {
                                    setOpenDropdownId(null);
                                  }
                                }}
                              >
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='h-8 w-8 p-0'
                                  >
                                    <MoreHorizontal className='w-4 h-4' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                  <DropdownMenuItem>
                                    <Edit className='w-4 h-4 mr-2' />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    // onClick={() =>
                                    //   handleDeleteDiscussion(discussion.id)
                                    // }

                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDiscussionToDelete(discussion);
                                      setDiscussionConfirmOpen(true);
                                      setOpenDropdownId(null);
                                    }}
                                  >
                                    <Trash2 className='w-4 h-4 mr-2' />
                                    Delete
                                  </DropdownMenuItem>
                                  {/* <DropdownMenuItem>
                                  <Flag className='w-4 h-4 mr-2' />
                                  Report
                                </DropdownMenuItem> */}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>

                        <div className='flex items-center gap-2 mb-3 text-sm text-muted-foreground'>
                          <Avatar className='w-5 h-5'>
                            <AvatarImage
                              src={
                                discussion?.author?.image || '/placeholder.svg'
                              }
                            />
                            <AvatarFallback>
                              {discussion.author?.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{discussion?.author?.username}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(discussion.createdAt)}</span>
                        </div>

                        <div className='flex flex-wrap gap-1 mb-3'>
                          {discussion.tags.slice(0, 5).map((tag) => (
                            <Badge
                              key={tag}
                              variant='secondary'
                              className='text-xs'
                            >
                              {tag}
                            </Badge>
                          ))}
                          {discussion.tags.length > 5 && (
                            <Badge variant='outline' className='text-xs'>
                              +{discussion.tags.length - 5} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className='pt-0'>
                    <div className='ml-[75px]'>
                      {/* Text Content */}
                      {discussion.content && (
                        <div className='prose prose-sm max-w-none mb-4'>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: formatMarkdown(discussion.content),
                            }}
                          />
                        </div>
                      )}

                      {/* Code Content */}
                      {discussion.contentType === 'code' &&
                        discussion.codeContent && (
                          <div className='mb-4'>
                            <div className='bg-slate-950 text-slate-100 p-4 rounded-md overflow-x-auto'>
                              <div className='flex items-center justify-between mb-2'>
                                <Badge
                                  variant='outline'
                                  className='text-slate-300 border-slate-600'
                                >
                                  {discussion.codeLanguage}
                                </Badge>
                              </div>
                              <pre className='text-sm'>
                                <code>{discussion.codeContent}</code>
                              </pre>
                            </div>
                          </div>
                        )}

                      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 px-2'
                          onClick={() => toggleComments(discussion.id)}
                        >
                          <MessageSquare className='w-4 h-4 mr-1' />
                          {discussion.commentCount} comments
                        </Button>
                        <Button variant='ghost' size='sm' className='h-8 px-2'>
                          <Reply className='w-4 h-4 mr-1' />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </CardContent>

                  {/* Comments Section */}
                  {isCommentsExpanded && (
                    <CardContent className='pt-0 border-t'>
                      <div className='ml-[75px]'>
                        <DiscussionComments
                          discussionId={discussion.id}
                          comments={discussion.comments}
                          commentCount={discussion.commentCount}
                          onAddComment={(content) =>
                            handleAddComment(discussion.id, content)
                          }
                          onVoteComment={(commentId, voteType) =>
                            handleCommentVote(
                              discussion.id,
                              commentId,
                              voteType
                            )
                          }
                          onReplyToComment={(parentId, content) =>
                            handleReplyToComment(
                              discussion.id,
                              parentId,
                              content
                            )
                          }
                          onEditComment={(commentId, content) =>
                            handleEditComment(discussion.id, commentId, content)
                          }
                          onDeleteComment={(commentId) =>
                            handleDeleteComment(discussion.id, commentId)
                          }
                          onReportComment={(commentId) =>
                            handleReportComment(discussion.id, commentId)
                          }
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {filteredAndSortedDiscussions?.length === 0 && (
            <div className='text-center py-12'>
              <MessageSquare className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
              <h3 className='text-lg font-medium mb-2'>No discussions found</h3>
              <p className='text-muted-foreground mb-4'>
                {searchQuery || filterTag !== 'all' || activeCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to start a discussion!'}
              </p>
              <Button onClick={() => setNewPostOpen(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Create First Post
              </Button>
            </div>
          )}

          <DeleteConfirmationDialog
            isOpen={deleteDialogOpen}
            onClose={() => {
              setDeleteDialogOpen(false);
              setDeleteTarget(null);
            }}
            onConfirm={
              deleteTarget?.type === 'discussion'
                ? confirmDeleteDiscussion
                : confirmDeleteComment
            }
            type={deleteTarget?.type || 'discussion'}
            title={deleteTarget?.title}
            author={deleteTarget?.author}
            commentCount={deleteTarget?.commentCount}
            replyCount={deleteTarget?.replyCount}
            requireConfirmation={
              deleteTarget?.type === 'discussion'
                ? (deleteTarget.commentCount || 0) > 0 ||
                  (deleteTarget.replyCount || 0) > 0
                : (deleteTarget?.replyCount || 0) > 0
            }
          />

          <AlertDialog
            open={discussionConfirmOpen}
            onOpenChange={setDiscussionConfirmOpen}
          >
            <AlertDialogContent className='bg-gray-900 border-gray-700 text-white'>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className='text-gray-400'>
                  This will permanently delete the problem "{discussionToDelete?.title}
                  ". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className='bg-gray-800 text-white hover:bg-gray-700'
                  onClick={() => setDiscussionToDelete(null)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className='bg-red-600 hover:bg-red-700 text-white'
                  onClick={()=> {
                    if(discussionToDelete) {
                      handleDelDiscussion(discussionToDelete.id);
                      setDiscussionToDelete(null);
                      setDiscussionConfirmOpen(false);
                    }
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  );
}
