import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { VoteButton } from './VoteButton';
import { MarkdownContent } from './MarkdownContent';
import { MarkdownEditor } from './MarkdownEditor';
import { Clock, Reply, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Comment } from '@/data/discussions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CommentThreadProps {
  comment: Comment;
  depth?: number;
  currentUserId: string | null;
  onVote: (commentId: string, vote: -1 | 0 | 1) => void;
  onReply: (parentId: string, content: string) => Promise<void>;
  onEdit?: (commentId: string, newContent: string) => Promise<void>;
  onDelete?: (commentId: string) => void;
  isVotePending?: boolean;
}

export function CommentThread({
  comment,
  depth = 0,
  currentUserId,
  onVote,
  onReply,
  onEdit,
  onDelete,
  isVotePending = false,
}: CommentThreadProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const maxDepth = 3;
  const isOwn = !!currentUserId && comment.author.id === currentUserId;

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    try {
      await onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setShowReplyInput(false);
    } catch {
      toast.error('Failed to post reply. Please try again.');
    }
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || !onEdit) return;
    try {
      await onEdit(comment.id, editContent.trim());
      setIsEditing(false);
    } catch {
      toast.error('Failed to save edit. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        'group/comment',
        depth > 0 && 'ml-6 pl-4 border-l-2 border-border/30',
      )}
    >
      <div className='flex gap-3 py-3'>
        <Avatar className='h-7 w-7 shrink-0 mt-0.5'>
          {comment.author.image && <AvatarImage src={comment.author.image} />}
          <AvatarFallback className='bg-primary/10 text-primary text-[10px] font-bold'>
            {comment.author.username?.[0]?.toUpperCase() ?? '?'}
          </AvatarFallback>
        </Avatar>

        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='text-sm font-semibold text-foreground'>
              {comment.author.username}
            </span>
            <span className='text-xs text-muted-foreground flex items-center gap-1'>
              <Clock className='h-3 w-3' />
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
            {comment.isEdited && (
              <span className='text-xs text-muted-foreground italic'>edited</span>
            )}
          </div>

          {isEditing ? (
            <div className='mb-2 space-y-2'>
              <MarkdownEditor
                value={editContent}
                onChange={setEditContent}
                placeholder='Edit your comment...'
                minHeight='80px'
              />
              <div className='flex items-center gap-2'>
                <Button
                  size='sm'
                  className='h-7 text-xs'
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim()}
                >
                  Save
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-7 text-xs'
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className='text-sm text-foreground/90 mb-2'>
              <MarkdownContent content={comment.content} />
            </div>
          )}

          <div className='flex items-center gap-3'>
            <VoteButton
              upvotes={comment.upvotes}
              downvotes={comment.downvotes}
              userVote={comment.userVote}
              onVote={(vote) => onVote(comment.id, vote)}
              size='sm'
              horizontal
              disabled={isVotePending}
            />

            {depth < maxDepth && (
              <Button
                variant='ghost'
                size='sm'
                className='h-7 px-2 text-xs text-muted-foreground hover:text-foreground'
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                <Reply className='h-3 w-3 mr-1' />
                Reply
              </Button>
            )}

            {isOwn && !isEditing && (
              <>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-7 px-2 text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover/comment:opacity-100 transition-opacity'
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className='h-3 w-3 mr-1' />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-7 px-2 text-xs text-muted-foreground hover:text-destructive opacity-0 group-hover/comment:opacity-100 transition-opacity'
                    >
                      <Trash2 className='h-3 w-3 mr-1' />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your comment.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        onClick={() => onDelete?.(comment.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>

          {showReplyInput && (
            <div className='mt-3 space-y-2'>
              <MarkdownEditor
                value={replyContent}
                onChange={setReplyContent}
                placeholder={`Reply to ${comment.author.username}...`}
                minHeight='80px'
              />
              <div className='flex items-center gap-2'>
                <Button
                  size='sm'
                  className='h-8 text-xs'
                  onClick={handleSubmitReply}
                  disabled={!replyContent.trim()}
                >
                  Post Reply
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8 text-xs'
                  onClick={() => {
                    setShowReplyInput(false);
                    setReplyContent('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className='mt-1'>
              {comment.replies.map((reply) => (
                <CommentThread
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  currentUserId={currentUserId}
                  onVote={onVote}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isVotePending={isVotePending}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
