
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronUp, ChevronDown, Reply, MoreHorizontal, Edit, Trash2, Flag, MessageSquare } from "lucide-react"
import { CommentEditor } from "./CommentEditor"



export function CommentThread({
  comments,
  onVote,
  onReply,
  onEdit,
  onDelete,
  onReport,
  maxDepth = 3,
  currentDepth = 0,
}) {
  const [replyingTo, setReplyingTo] = useState(null)
  const [editingComment, setEditingComment] = useState(null)
  const [replyContent, setReplyContent] = useState("")
  const [editContent, setEditContent] = useState("")
  const [collapsedComments, setCollapsedComments] = useState(new Set());


  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const formatMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs">$1</code>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-2 border-muted pl-2 italic">$1</blockquote>')
      .replace(/^\* (.*$)/gm, "<li>$1</li>")
      .replace(/\[([^\]]+)\]$$([^)]+)$$/g, '<a href="$2" class="text-blue-500 underline">$1</a>')
      .replace(/\n/g, "<br>")
  }

  const handleReply = (parentId) => {
    if (replyContent.trim()) {
      onReply(parentId, replyContent)
      setReplyContent("")
      setReplyingTo(null)
    }
  }

  const handleEdit = (commentId) => {
    if (editContent.trim()) {
      onEdit(commentId, editContent)
      setEditContent("")
      setEditingComment(null)
    }
  }

  const startEdit = (comment) => {
    setEditContent(comment.content)
    setEditingComment(comment.id)
  }

  const toggleCollapse = (commentId) => {
    const newCollapsed = new Set(collapsedComments)
    if (newCollapsed.has(commentId)) {
      newCollapsed.delete(commentId)
    } else {
      newCollapsed.add(commentId)
    }
    setCollapsedComments(newCollapsed)
  }

  const getReplyCount = (comment) => {
    return comment.replies.reduce((count, reply) => count + 1 + getReplyCount(reply), 0)
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const isCollapsed = collapsedComments.has(comment.id)
        const replyCount = getReplyCount(comment)
        const indentLevel = Math.min(currentDepth, 4)

        return (
          <div
            key={comment.id}
            className={`${indentLevel > 0 ? `ml-${indentLevel * 4} border-l border-muted pl-4` : ""}`}
          >
            <div className="flex items-start gap-3">
              <Avatar className="w-7 h-7">
                <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} />
                <AvatarFallback>{comment.author[0].toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt)}</span>
                  {comment.isEdited && (
                    <Badge variant="outline" className="text-xs">
                      edited
                    </Badge>
                  )}
                  {replyCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 px-1 text-xs text-muted-foreground"
                      onClick={() => toggleCollapse(comment.id)}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      {replyCount} {replyCount === 1 ? "reply" : "replies"}
                      {isCollapsed ? " (hidden)" : ""}
                    </Button>
                  )}
                </div>

                {editingComment === comment.id ? (
                  <div className="mb-3">
                    <CommentEditor
                      value={editContent}
                      onChange={setEditContent}
                      onSubmit={() => handleEdit(comment.id)}
                      onCancel={() => setEditingComment(null)}
                      placeholder="Edit your comment..."
                      submitText="Save"
                      showCancel
                      compact
                    />
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none mb-2">
                    <div dangerouslySetInnerHTML={{ __html: formatMarkdown(comment.content) }} />
                  </div>
                )}

                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-6 w-6 p-0 ${comment.userVote === 1 ? "text-orange-500" : ""}`}
                      onClick={() => onVote(comment.id, "up")}
                    >
                      <ChevronUp className="w-3 h-3" />
                    </Button>
                    <span className="text-xs font-medium min-w-[20px] text-center">
                      {comment.upvotes - comment.downvotes}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-6 w-6 p-0 ${comment.userVote === -1 ? "text-blue-500" : ""}`}
                      onClick={() => onVote(comment.id, "down")}
                    >
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </div>

                  {currentDepth < maxDepth && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    >
                      <Reply className="w-3 h-3 mr-1" />
                      Reply
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => startEdit(comment)}>
                        <Edit className="w-3 h-3 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(comment.id)}>
                        <Trash2 className="w-3 h-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onReport(comment.id)}>
                        <Flag className="w-3 h-3 mr-2" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {replyingTo === comment.id && (
                  <div className="mb-3">
                    <CommentEditor
                      value={replyContent}
                      onChange={setReplyContent}
                      onSubmit={() => handleReply(comment.id)}
                      onCancel={() => setReplyingTo(null)}
                      placeholder={`Reply to ${comment.author}...`}
                      submitText="Reply"
                      showCancel
                      compact
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Nested Replies */}
            {!isCollapsed && comment.replies.length > 0 && (
              <div className="mt-3">
                <CommentThread
                  comments={comment.replies}
                  onVote={onVote}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onReport={onReport}
                  maxDepth={maxDepth}
                  currentDepth={currentDepth + 1}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
