
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, SortAsc } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CommentEditor } from "./CommentEditor"
import { CommentThread } from "./CommentThread"



export function DiscussionComments({
  discussionId,
  comments,
  commentCount,
  onAddComment,
  onVoteComment,
  onReplyToComment,
  onEditComment,
  onDeleteComment,
  onReportComment,
}) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState("best")
  const [showCommentEditor, setShowCommentEditor] = useState(false)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await onAddComment(newComment)
      setNewComment("")
      setShowCommentEditor(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case "best":
        return b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default:
        return 0
    }
  })




  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          <h3 className="text-lg font-semibold">
            {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="best">Best</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add Comment */}
      <div className="space-y-3">
        {!showCommentEditor ? (
          <Button
            variant="outline"
            className="w-full justify-start text-muted-foreground"
            onClick={() => {setShowCommentEditor(true)}}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Add a comment...
          </Button>
        ) : (
          <CommentEditor
            value={newComment}
            onChange={setNewComment}
            onSubmit={handleSubmitComment}
            onCancel={() => {
              setShowCommentEditor(false)
              setNewComment("")
            }}
            placeholder="What are your thoughts?"
            submitText="Comment"
            isSubmitting={isSubmitting}
            showCancel
          />
        )}
      </div>

      {/* Comments List */}
      {sortedComments.length > 0 ? (
        <CommentThread
          comments={sortedComments}
          onVote={onVoteComment}
          onReply={onReplyToComment}
          onEdit={onEditComment}
          onDelete={onDeleteComment}
          onReport={onReportComment}
        />
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No comments yet</h3>
          <p className="text-muted-foreground mb-4">Be the first to share your thoughts!</p>
          <Button onClick={() => setShowCommentEditor(true)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Add Comment
          </Button>
        </div>
      )}
    </div>
  )
}
