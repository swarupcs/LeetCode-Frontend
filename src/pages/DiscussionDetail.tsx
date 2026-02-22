import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  ArrowLeft,
  Clock,
  Eye,
  MessageSquare,
  Share2,
  Bookmark,
  Flag,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import { VoteButton } from '@/components/discussions/VoteButton';
import { CommentThread } from '@/components/discussions/CommentThread';
import { MarkdownContent } from '@/components/discussions/MarkdownContent';
import { MarkdownEditor } from '@/components/discussions/MarkdownEditor';
import {
  getCategoryStyle,
  getCategoryIcon,
  mockDiscussions,
} from '@/data/discussions';
import type { Discussion, Comment } from '@/data/discussions';
import { toast } from 'sonner';

export default function DiscussionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [discussions, setDiscussions] = useState<Discussion[]>(mockDiscussions);
  const [commentText, setCommentText] = useState('');
  const [commentSort, setCommentSort] = useState('top');
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState('');

  const discussion = discussions.find((d) => d.id === id);

  const sortedComments = useMemo(() => {
    if (!discussion) return [];
    const sorted = [...discussion.comments];
    if (commentSort === 'top') {
      sorted.sort(
        (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes),
      );
    } else if (commentSort === 'newest') {
      sorted.reverse();
    }
    return sorted;
  }, [discussion, commentSort]);

  if (!discussion) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <MessageSquare className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h2 className='text-xl font-semibold mb-2'>Discussion not found</h2>
          <Button variant='outline' onClick={() => navigate('/discussions')}>
            Back to Discussions
          </Button>
        </div>
      </div>
    );
  }

  const isOwnPost = discussion.author === 'you';

  const handlePostVote = (vote: -1 | 0 | 1) => {
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const oldVote = d.userVote;
        return {
          ...d,
          userVote: vote,
          upvotes: d.upvotes + (vote === 1 ? 1 : 0) - (oldVote === 1 ? 1 : 0),
          downvotes:
            d.downvotes + (vote === -1 ? 1 : 0) - (oldVote === -1 ? 1 : 0),
        };
      }),
    );
  };

  const handleCommentVote = (commentId: string, vote: -1 | 0 | 1) => {
    const updateComment = (comments: Comment[]): Comment[] =>
      comments.map((c) => {
        if (c.id === commentId) {
          const oldVote = c.userVote;
          return {
            ...c,
            userVote: vote,
            upvotes: c.upvotes + (vote === 1 ? 1 : 0) - (oldVote === 1 ? 1 : 0),
            downvotes:
              c.downvotes + (vote === -1 ? 1 : 0) - (oldVote === -1 ? 1 : 0),
          };
        }
        return { ...c, replies: updateComment(c.replies) };
      });

    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return { ...d, comments: updateComment(d.comments) };
      }),
    );
  };

  const handleReply = (parentId: string, content: string) => {
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      authorName: 'you',
      content,
      createdAt: 'Just now',
      upvotes: 1,
      downvotes: 0,
      userVote: 1,
      replies: [],
    };

    const addReply = (comments: Comment[]): Comment[] =>
      comments.map((c) => {
        if (c.id === parentId) {
          return { ...c, replies: [...c.replies, newReply] };
        }
        return { ...c, replies: addReply(c.replies) };
      });

    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return {
          ...d,
          comments: addReply(d.comments),
          commentCount: d.commentCount + 1,
        };
      }),
    );

    toast.success('Your reply has been added to the thread.');
  };

  const handleCommentEdit = (commentId: string, newContent: string) => {
    const editComment = (comments: Comment[]): Comment[] =>
      comments.map((c) => {
        if (c.id === commentId) {
          return { ...c, content: newContent };
        }
        return { ...c, replies: editComment(c.replies) };
      });

    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return { ...d, comments: editComment(d.comments) };
      }),
    );

toast.success('Your comment has been edited.');
  };

  const handleCommentDelete = (commentId: string) => {
    const countComments = (comments: Comment[]): number =>
      comments.reduce((sum, c) => sum + 1 + countComments(c.replies), 0);

    const removeComment = (comments: Comment[]): Comment[] =>
      comments
        .filter((c) => c.id !== commentId)
        .map((c) => ({ ...c, replies: removeComment(c.replies) }));

    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const deletedComment = findComment(d.comments, commentId);
        const deletedCount = deletedComment
          ? 1 + countComments(deletedComment.replies)
          : 1;
        return {
          ...d,
          comments: removeComment(d.comments),
          commentCount: Math.max(0, d.commentCount - deletedCount),
        };
      }),
    );

toast.success('Your comment has been removed.');
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      authorName: 'you',
      content: commentText.trim(),
      createdAt: 'Just now',
      upvotes: 1,
      downvotes: 0,
      userVote: 1,
      replies: [],
    };

    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return {
          ...d,
          comments: [...d.comments, newComment],
          commentCount: d.commentCount + 1,
        };
      }),
    );
    setCommentText('');

toast.success('Your comment has been added to the discussion.');
  };

  const handleEditPost = () => {
    setEditPostContent(discussion.content);
    setIsEditingPost(true);
  };

  const handleSavePostEdit = () => {
    if (!editPostContent.trim()) return;
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        return { ...d, content: editPostContent.trim() };
      }),
    );
    setIsEditingPost(false);
toast.success('Your discussion has been edited.');
  };

  const handleDeletePost = () => {
    setDiscussions((prev) => prev.filter((d) => d.id !== id));
    navigate('/discussions');
toast.success('Post deleted', {
  description: 'Your discussion has been removed.',
});
  };

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant='ghost'
            className='mb-6 text-muted-foreground hover:text-foreground'
            onClick={() => navigate('/discussions')}
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Discussions
          </Button>
        </motion.div>

        {/* Main post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className='glass-card border-border/50 mb-8'>
            <CardContent className='p-6'>
              <div className='flex gap-5'>
                <VoteButton
                  upvotes={discussion.upvotes}
                  downvotes={discussion.downvotes}
                  userVote={discussion.userVote}
                  onVote={handlePostVote}
                />

                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant='outline'
                        className={`text-xs px-2.5 py-0.5 ${getCategoryStyle(
                          discussion.category,
                        )}`}
                      >
                        <span className='mr-1'>
                          {getCategoryIcon(discussion.category)}
                        </span>
                        {discussion.category}
                      </Badge>
                    </div>

                    {isOwnPost && !isEditingPost && (
                      <div className='flex items-center gap-1'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 px-2 text-xs text-muted-foreground hover:text-foreground'
                          onClick={handleEditPost}
                        >
                          <Pencil className='h-3.5 w-3.5 mr-1' />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 px-2 text-xs text-muted-foreground hover:text-destructive'
                            >
                              <Trash2 className='h-3.5 w-3.5 mr-1' />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this post?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your discussion post and all
                                its comments.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                onClick={handleDeletePost}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>

                  <h1 className='text-2xl font-bold mb-4'>
                    {discussion.title}
                  </h1>

                  {isEditingPost ? (
                    <div className='mb-5 space-y-3'>
                      <MarkdownEditor
                        value={editPostContent}
                        onChange={setEditPostContent}
                        placeholder='Edit your post...'
                        minHeight='150px'
                        maxLength={5000}
                      />
                      <div className='flex items-center gap-2'>
                        <Button
                          size='sm'
                          onClick={handleSavePostEdit}
                          disabled={!editPostContent.trim()}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setIsEditingPost(false)}
                        >
                          <X className='h-3.5 w-3.5 mr-1' />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <MarkdownContent
                      content={discussion.content}
                      className='text-sm text-foreground/90 mb-5 leading-relaxed'
                    />
                  )}

                  {/* Tags */}
                  <div className='flex flex-wrap gap-1.5 mb-4'>
                    {discussion.tags.map((tag) => (
                      <span
                        key={tag}
                        className='text-[11px] px-2 py-0.5 rounded-full bg-surface-3 text-muted-foreground border border-border/30'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta row */}
                  <div className='flex items-center justify-between border-t border-border/30 pt-4'>
                    <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                      <div className='flex items-center gap-1.5'>
                        <Avatar className='h-6 w-6'>
                          <AvatarFallback className='bg-primary/10 text-primary text-[10px] font-bold'>
                            {discussion.author[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className='font-medium'>{discussion.author}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        <span>{discussion.createdAt}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Eye className='h-3 w-3' />
                        <span>{discussion.viewCount} views</span>
                      </div>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-foreground'
                      >
                        <Bookmark className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-foreground'
                      >
                        <Share2 className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-destructive'
                      >
                        <Flag className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comment input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='mb-6'
        >
          <Card className='glass-card border-border/50'>
            <CardContent className='p-5'>
              <h3 className='text-sm font-semibold mb-3'>Add a comment</h3>
              <MarkdownEditor
                value={commentText}
                onChange={setCommentText}
                placeholder='Share your thoughts, code snippets, or ask a follow-up question...'
                minHeight='100px'
                maxLength={3000}
              />
              <div className='flex items-center justify-end mt-3'>
                <Button
                  onClick={handlePostComment}
                  disabled={!commentText.trim()}
                  size='sm'
                >
                  <MessageSquare className='h-4 w-4 mr-1.5' />
                  Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comments section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-bold flex items-center gap-2'>
              <MessageSquare className='h-5 w-5 text-primary' />
              {discussion.commentCount} Comments
            </h2>
            <Select value={commentSort} onValueChange={setCommentSort}>
              <SelectTrigger className='w-36 h-9 bg-surface-1 border-border/50 text-xs'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='top'>Top</SelectItem>
                <SelectItem value='newest'>Newest</SelectItem>
                <SelectItem value='oldest'>Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className='glass-card border-border/50'>
            <CardContent className='p-5 divide-y divide-border/30'>
              {sortedComments.length > 0 ? (
                sortedComments.map((comment) => (
                  <CommentThread
                    key={comment.id}
                    comment={comment}
                    onVote={handleCommentVote}
                    onReply={handleReply}
                    onEdit={handleCommentEdit}
                    onDelete={handleCommentDelete}
                  />
                ))
              ) : (
                <div className='text-center py-10'>
                  <MessageSquare className='h-8 w-8 text-muted-foreground mx-auto mb-2' />
                  <p className='text-sm text-muted-foreground'>
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function findComment(comments: Comment[], id: string): Comment | null {
  for (const c of comments) {
    if (c.id === id) return c;
    const found = findComment(c.replies, id);
    if (found) return found;
  }
  return null;
}
