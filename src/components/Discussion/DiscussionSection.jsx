
import { useState, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
} from "lucide-react"

// Sample data
const sampleDiscussions = [
  {
    id: 1,
    title: "Optimal O(n) Solution using HashMap",
    content:
      "Here's an efficient approach using a HashMap to solve this in linear time...\n\n```python\ndef twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n```",
    author: "codeMaster",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    createdAt: "2024-01-15T10:30:00Z",
    upvotes: 45,
    downvotes: 2,
    userVote: 1, // 1 for upvote, -1 for downvote, 0 for no vote
    commentCount: 12,
    tags: ["Python", "HashMap", "Optimized"],
    comments: [
      {
        id: 1,
        content: "Great explanation! This is much cleaner than the brute force approach.",
        author: "newbie123",
        authorAvatar: "/placeholder.svg?height=24&width=24",
        createdAt: "2024-01-15T11:00:00Z",
        upvotes: 8,
        downvotes: 0,
        userVote: 0,
        replies: [],
      },
      {
        id: 2,
        content: "Can you explain the time complexity analysis?",
        author: "student_dev",
        authorAvatar: "/placeholder.svg?height=24&width=24",
        createdAt: "2024-01-15T11:15:00Z",
        upvotes: 3,
        downvotes: 0,
        userVote: 0,
        replies: [
          {
            id: 3,
            content:
              "We iterate through the array once (O(n)) and HashMap operations are O(1) on average, so overall it's O(n).",
            author: "codeMaster",
            authorAvatar: "/placeholder.svg?height=24&width=24",
            createdAt: "2024-01-15T11:30:00Z",
            upvotes: 5,
            downvotes: 0,
            userVote: 0,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Java Solution with Detailed Explanation",
    content:
      'Here\'s my Java implementation with step-by-step breakdown:\n\n```java\npublic int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> map = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (map.containsKey(complement)) {\n            return new int[] { map.get(complement), i };\n        }\n        map.put(nums[i], i);\n    }\n    throw new IllegalArgumentException("No two sum solution");\n}\n```',
    author: "javaGuru",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    createdAt: "2024-01-14T15:20:00Z",
    upvotes: 32,
    downvotes: 1,
    userVote: 0,
    commentCount: 8,
    tags: ["Java", "HashMap", "Beginner-Friendly"],
    comments: [],
  },
  {
    id: 3,
    title: "Brute Force vs Optimized - Performance Comparison",
    content:
      "I ran both approaches on different input sizes. Here are the results:\n\n**Brute Force O(n²):**\n- 1000 elements: 2.3ms\n- 10000 elements: 180ms\n\n**HashMap O(n):**\n- 1000 elements: 0.8ms\n- 10000 elements: 1.2ms\n\nThe difference is significant for larger inputs!",
    author: "perfAnalyst",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    createdAt: "2024-01-13T09:45:00Z",
    upvotes: 28,
    downvotes: 0,
    userVote: -1,
    commentCount: 15,
    tags: ["Performance", "Analysis", "Comparison"],
    comments: [],
  },
]

const allTags = [
  "Python",
  "Java",
  "JavaScript",
  "C++",
  "HashMap",
  "Array",
  "Optimized",
  "Brute Force",
  "Dynamic Programming",
  "Two Pointers",
  "Beginner-Friendly",
  "Performance",
  "Analysis",
  "Comparison",
]

export default function DiscussionSection() {
  const [discussions, setDiscussions] = useState(sampleDiscussions)
  const [sortBy, setSortBy] = useState("top")
  const [filterTag, setFilterTag] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [newPostOpen, setNewPostOpen] = useState(false)
  const [expandedComments, setExpandedComments] = useState([])

  // New post form state
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: [] as string[],
  })

  const handleVote = (discussionId, voteType) => {
    setDiscussions((prev) =>
      prev.map((discussion) => {
        if (discussion.id === discussionId) {
          const currentVote = discussion.userVote
          let newVote = 0
          let upvotes = discussion.upvotes
          let downvotes = discussion.downvotes

          // Remove previous vote
          if (currentVote === 1) upvotes--
          if (currentVote === -1) downvotes--

          // Apply new vote
          if (voteType === "up" && currentVote !== 1) {
            newVote = 1
            upvotes++
          } else if (voteType === "down" && currentVote !== -1) {
            newVote = -1
            downvotes++
          }

          return { ...discussion, userVote: newVote, upvotes, downvotes }
        }
        return discussion
      }),
    )
  }

  const handleCommentVote = (discussionId, commentId, voteType) => {
    // Similar logic for comment voting
    console.log(`Voting ${voteType} on comment ${commentId} in discussion ${discussionId}`)
  }

  const toggleComments = (discussionId) => {
    setExpandedComments((prev) =>
      prev.includes(discussionId) ? prev.filter((id) => id !== discussionId) : [...prev, discussionId],
    )
  }

  const filteredAndSortedDiscussions = useMemo(() => {
    let filtered = discussions

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by tag
    if (filterTag !== "all") {
      filtered = filtered.filter((d) => d.tags.includes(filterTag))
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "top":
          return b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "discussed":
          return b.commentCount - a.commentCount
        default:
          return 0
      }
    })
  }, [discussions, sortBy, filterTag, searchQuery])

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return

    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: "currentUser",
      authorAvatar: "/placeholder.svg?height=32&width=32",
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVote: 0,
      commentCount: 0,
      tags: newPost.tags,
      comments: [],
    }

    setDiscussions((prev) => [post, ...prev])
    setNewPost({ title: "", content: "", tags: [] })
    setNewPostOpen(false)
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Discussion</h1>
          <p className="text-muted-foreground">Problem: Two Sum</p>
        </div>

        <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Discussion Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPost.title}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a descriptive title..."
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newPost.content}
                  onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your solution, ask a question, or start a discussion... (Markdown supported)"
                  rows={8}
                />
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={newPost.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setNewPost((prev) => ({
                          ...prev,
                          tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
                        }))
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setNewPostOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost}>Create Post</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="discussed">Most Discussed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="w-[120px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
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
      <div className="space-y-4">
        {filteredAndSortedDiscussions.map((discussion) => (
          <Card key={discussion.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1 min-w-[60px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 h-8 w-8 ${discussion.userVote === 1 ? "text-orange-500" : ""}`}
                    onClick={() => handleVote(discussion.id, "up")}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium">{discussion.upvotes - discussion.downvotes}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-1 h-8 w-8 ${discussion.userVote === -1 ? "text-blue-500" : ""}`}
                    onClick={() => handleVote(discussion.id, "down")}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg leading-tight">{discussion.title}</h3>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Flag className="w-4 h-4 mr-2" />
                          Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={discussion.authorAvatar || "/placeholder.svg"} />
                      <AvatarFallback>{discussion.author[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{discussion.author}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(discussion.createdAt)}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {discussion.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="ml-[75px]">
                <div className="prose prose-sm max-w-none mb-4">
                  <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm">
                    <code>{discussion.content}</code>
                  </pre>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => toggleComments(discussion.id)}>
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {discussion.commentCount} comments
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Reply className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                </div>

                {/* Comments Section */}
                {expandedComments.includes(discussion.id) && (
                  <div className="mt-4 space-y-3 border-l-2 border-muted pl-4">
                    {discussion.comments.map((comment) => (
                      <div key={comment.id} className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} />
                            <AvatarFallback>{comment.author[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-medium">{comment.author}</span>
                              <span className="text-muted-foreground">{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm mt-1">{comment.content}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-6 px-1">
                                  <ChevronUp className="w-3 h-3" />
                                </Button>
                                <span className="text-xs">{comment.upvotes}</span>
                                <Button variant="ghost" size="sm" className="h-6 px-1">
                                  <ChevronDown className="w-3 h-3" />
                                </Button>
                              </div>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Nested Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-8 space-y-2 border-l border-muted pl-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarImage src={reply.authorAvatar || "/placeholder.svg"} />
                                  <AvatarFallback>{reply.author[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="font-medium">{reply.author}</span>
                                    <span className="text-muted-foreground">{formatTimeAgo(reply.createdAt)}</span>
                                  </div>
                                  <p className="text-sm mt-1">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedDiscussions.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No discussions found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterTag !== "all"
              ? "Try adjusting your search or filters"
              : "Be the first to start a discussion!"}
          </p>
          <Button onClick={() => setNewPostOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create First Post
          </Button>
        </div>
      )}
    </div>
  )
}
