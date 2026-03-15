// src/pages/DiscussionDetail.tsx
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  MessageSquare,
  Share2,
  Bookmark,
  BookmarkCheck,
  Flag,
  Pencil,
  Trash2,
  X,
  Loader2,
  Code2,
  Building2,
} from 'lucide-react';
import { VoteButton } from '@/components/discussions/VoteButton';
import { CommentThread } from '@/components/discussions/CommentThread';
import { MarkdownContent } from '@/components/discussions/MarkdownContent';
import { MarkdownEditor } from '@/components/discussions/MarkdownEditor';
import { getCategoryStyle, getCategoryIcon } from '@/data/discussions';
import { toast } from 'sonner';
import { useAppSelector } from '@/hooks/redux';
import { useGetDiscussion } from '@/hooks/discussions/useGetDiscussion';
import { useUpdateDiscussion } from '@/hooks/discussions/useUpdateDiscussion';
import { useDeleteDiscussion } from '@/hooks/discussions/useDeleteDiscussion';
import { useCreateComment } from '@/hooks/discussions/useCreateComment';
import { useUpdateComment } from '@/hooks/discussions/useUpdateComment';
import { useDeleteComment } from '@/hooks/discussions/useDeleteComment';
import { useVoteDiscussion } from '@/hooks/discussions/useVoteDiscussion';
import { useVoteComment } from '@/hooks/discussions/useVoteComment';
import { useToggleBookmark } from '@/hooks/discussions/useToggleBookmark';
import type { Comment, DiscussionCategory } from '@/types/discussion.types';

const CODE_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'go',
  'rust',
  'kotlin',
  'swift',
  'ruby',
  'php',
  'sql',
  'bash',
  'other',
];

// ─── Skeleton primitive ───────────────────────────────────────────────────────

function Bone({
  w,
  h = 'h-3',
  rounded = 'rounded-md',
  delay = 0,
  className = '',
}: {
  w: string;
  h?: string;
  rounded?: string;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`${w} ${h} ${rounded} bg-surface-3 animate-pulse ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

// ─── Skeleton: one comment row ────────────────────────────────────────────────

function SkeletonComment({
  index,
  nested = false,
}: {
  index: number;
  nested?: boolean;
}) {
  const base = index * 60;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.55 + index * 0.07 }}
      className={`py-4 ${nested ? 'ml-8 pl-4 border-l border-border/30' : ''} ${index > 0 ? 'border-t border-border/30' : ''}`}
    >
      <div className='flex gap-3'>
        {/* Vote column */}
        <div className='flex flex-col items-center gap-1.5 shrink-0 pt-1'>
          <Bone w='w-5' h='h-5' rounded='rounded' delay={base} />
          <Bone w='w-4' h='h-3' delay={base + 15} />
          <Bone w='w-5' h='h-5' rounded='rounded' delay={base + 30} />
        </div>

        {/* Body */}
        <div className='flex-1 min-w-0 space-y-2.5'>
          {/* Author row */}
          <div className='flex items-center gap-2'>
            <Bone w='w-6' h='h-6' rounded='rounded-full' delay={base + 20} />
            <Bone w='w-24' h='h-3' delay={base + 35} />
            <Bone w='w-16' h='h-2.5' delay={base + 50} />
          </div>

          {/* Content lines */}
          <div className='space-y-1.5'>
            <Bone w='w-full' h='h-3' delay={base + 40} />
            <Bone
              w={['w-4/5', 'w-5/6', 'w-3/4', 'w-full'][index % 4]!}
              h='h-3'
              delay={base + 55}
            />
            {index % 3 === 0 && <Bone w='w-2/3' h='h-3' delay={base + 70} />}
          </div>

          {/* Reply action */}
          <Bone w='w-12' h='h-3' delay={base + 65} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Full page skeleton ───────────────────────────────────────────────────────

function DiscussionDetailSkeleton() {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Bone w='w-40' h='h-9' rounded='rounded-lg' className='mb-6' />
        </motion.div>

        {/* ── Main post card ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className='glass-card border-border/50 mb-8'>
            <CardContent className='p-6'>
              <div className='flex gap-5'>
                {/* Vote column */}
                <div className='flex flex-col items-center gap-2 pt-1 shrink-0'>
                  <Bone w='w-8' h='h-8' rounded='rounded-lg' delay={60} />
                  <Bone w='w-6' h='h-4' delay={80} />
                  <Bone w='w-8' h='h-8' rounded='rounded-lg' delay={100} />
                </div>

                {/* Post body */}
                <div className='flex-1 min-w-0 space-y-4'>
                  {/* Category badge + edit/delete buttons row */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <Bone
                        w='w-20'
                        h='h-6'
                        rounded='rounded-full'
                        delay={80}
                      />
                      <Bone w='w-32' h='h-4' delay={100} />
                    </div>
                    <div className='flex items-center gap-1'>
                      <Bone w='w-14' h='h-8' rounded='rounded-md' delay={120} />
                      <Bone w='w-16' h='h-8' rounded='rounded-md' delay={140} />
                    </div>
                  </div>

                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Bone w='w-4/5' h='h-7' rounded='rounded-lg' delay={120} />
                  </motion.div>

                  {/* Body paragraphs */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='space-y-2'
                  >
                    <Bone w='w-full' h='h-3.5' delay={160} />
                    <Bone w='w-[92%]' h='h-3.5' delay={175} />
                    <Bone w='w-full' h='h-3.5' delay={190} />
                    <Bone w='w-[85%]' h='h-3.5' delay={205} />
                    <Bone w='w-[70%]' h='h-3.5' delay={220} />
                  </motion.div>

                  {/* Code block */}
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.27 }}
                    className='rounded-lg border border-border/50 bg-surface-2 p-4 space-y-2'
                  >
                    <div className='flex items-center gap-1.5 mb-2'>
                      <Bone w='w-3.5' h='h-3.5' rounded='rounded' delay={260} />
                      <Bone w='w-16' h='h-3' rounded='rounded' delay={275} />
                    </div>
                    {['w-3/4', 'w-full', 'w-2/3', 'w-[85%]', 'w-1/2'].map(
                      (w, i) => (
                        <Bone
                          key={i}
                          w={w}
                          h='h-3'
                          rounded='rounded'
                          delay={280 + i * 18}
                        />
                      ),
                    )}
                  </motion.div>

                  {/* Tags */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.32 }}
                    className='flex flex-wrap gap-1.5'
                  >
                    {[40, 56, 48, 64].map((w, i) => (
                      <Bone
                        key={i}
                        w={`w-[${w}px]`}
                        h='h-5'
                        rounded='rounded-full'
                        delay={320 + i * 20}
                      />
                    ))}
                  </motion.div>

                  {/* Footer: author + time + actions */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.36 }}
                    className='flex items-center justify-between border-t border-border/30 pt-4'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='flex items-center gap-1.5'>
                        <Bone
                          w='w-6'
                          h='h-6'
                          rounded='rounded-full'
                          delay={360}
                        />
                        <Bone w='w-20' h='h-3' delay={375} />
                      </div>
                      <div className='flex items-center gap-1'>
                        <Bone w='w-3' h='h-3' rounded='rounded' delay={390} />
                        <Bone w='w-20' h='h-3' delay={405} />
                      </div>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Bone w='w-8' h='h-8' rounded='rounded-md' delay={380} />
                      <Bone w='w-8' h='h-8' rounded='rounded-md' delay={395} />
                      <Bone w='w-8' h='h-8' rounded='rounded-md' delay={410} />
                    </div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Comment input card ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='mb-6'
        >
          <Card className='glass-card border-border/50'>
            <CardContent className='p-5 space-y-3'>
              <Bone w='w-28' h='h-4' delay={440} />
              <Bone w='w-full' h='h-24' rounded='rounded-xl' delay={460} />
              <div className='flex justify-end'>
                <Bone w='w-24' h='h-9' rounded='rounded-lg' delay={480} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Comments section ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
        >
          {/* Section header */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <Bone w='w-5' h='h-5' rounded='rounded' delay={500} />
              <Bone w='w-28' h='h-5' rounded='rounded' delay={515} />
            </div>
            <Bone w='w-36' h='h-9' rounded='rounded-xl' delay={530} />
          </div>

          <Card className='glass-card border-border/50'>
            <CardContent className='p-5'>
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonComment key={i} index={i} />
              ))}
              {/* One nested reply under first comment */}
              <SkeletonComment index={4} nested />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiscussionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUserId = useAppSelector((state) => state.auth.id);

  const { discussion, isPending: isLoading, isError } = useGetDiscussion(id!);
  const { updateDiscussionMutation, isPending: isUpdatingPost } =
    useUpdateDiscussion();
  const { deleteDiscussionMutation } = useDeleteDiscussion();
  const { createCommentMutation, isPending: isPostingComment } =
    useCreateComment(id!);
  const { updateCommentMutation } = useUpdateComment(id!);
  const { deleteCommentMutation } = useDeleteComment(id!);
  const { voteDiscussionMutation, isPending: isVotingDiscussion } =
    useVoteDiscussion();
  const { voteCommentMutation, isPending: isVotingComment } = useVoteComment(
    id!,
  );
  const { toggleBookmarkMutation, isPending: isTogglingBookmark } =
    useToggleBookmark(id!);

  const [commentText, setCommentText] = useState('');
  const [commentSort, setCommentSort] = useState('top');
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] =
    useState<DiscussionCategory>('general');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editCodeContent, setEditCodeContent] = useState('');
  const [editCodeLanguage, setEditCodeLanguage] = useState('javascript');
  const [showEditCode, setShowEditCode] = useState(false);

  const sortedComments = useMemo(() => {
    const sorted = [...(discussion?.comments ?? [])];
    if (commentSort === 'top')
      sorted.sort(
        (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes),
      );
    else if (commentSort === 'newest')
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    else if (commentSort === 'oldest')
      sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    return sorted;
  }, [discussion?.comments, commentSort]);

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) return <DiscussionDetailSkeleton />;

  // ── Error state ───────────────────────────────────────────────────────────
  if (isError || !discussion) {
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

  const isOwnPost = !!currentUserId && discussion.author.id === currentUserId;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handlePostVote = async (vote: -1 | 0 | 1) => {
    if (!currentUserId) {
      toast.error('Please log in to vote');
      return;
    }
    try {
      await voteDiscussionMutation({ id: discussion.id, value: vote });
    } catch {
      toast.error('Failed to vote. Please try again.');
    }
  };

  const handleCommentVote = async (commentId: string, vote: -1 | 0 | 1) => {
    if (!currentUserId) {
      toast.error('Please log in to vote');
      return;
    }
    try {
      await voteCommentMutation({ id: commentId, value: vote });
    } catch {
      toast.error('Failed to vote. Please try again.');
    }
  };

  const handleReply = async (
    parentId: string,
    content: string,
  ): Promise<void> => {
    if (!currentUserId) {
      toast.error('Please log in to reply');
      return;
    }
    await createCommentMutation({ discussionId: id!, content, parentId });
    toast.success('Your reply has been added to the thread.');
  };

  const handleCommentEdit = async (
    commentId: string,
    newContent: string,
  ): Promise<void> => {
    await updateCommentMutation({ id: commentId, content: newContent });
    toast.success('Your comment has been edited.');
  };

  const handleCommentDelete = async (commentId: string) => {
    try {
      await deleteCommentMutation(commentId);
      toast.success('Your comment has been removed.');
    } catch {
      toast.error('Failed to delete comment. Please try again.');
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    if (!currentUserId) {
      toast.error('Please log in to comment');
      return;
    }
    try {
      await createCommentMutation({
        discussionId: id!,
        content: commentText.trim(),
      });
      setCommentText('');
      toast.success('Your comment has been added to the discussion.');
    } catch {
      toast.error('Failed to post comment. Please try again.');
    }
  };

  const handleEditPost = () => {
    setEditTitle(discussion.title);
    setEditContent(discussion.content);
    setEditCategory(discussion.category);
    setEditTags([...discussion.tags]);
    setEditTagInput('');
    setEditCompany(discussion.company ?? '');
    setEditPosition(discussion.position ?? '');
    setEditCodeContent(discussion.codeContent ?? '');
    setEditCodeLanguage(discussion.codeLanguage ?? 'javascript');
    setShowEditCode(!!discussion.codeContent);
    setIsEditingPost(true);
  };

  const handleAddEditTag = () => {
    const trimmed = editTagInput.trim();
    if (trimmed && !editTags.includes(trimmed) && editTags.length < 5) {
      setEditTags([...editTags, trimmed]);
      setEditTagInput('');
    }
  };

  const handleSavePostEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    try {
      await updateDiscussionMutation({
        id: discussion.id,
        title: editTitle.trim(),
        content: editContent.trim(),
        category: editCategory,
        tags: editTags,
        company:
          editCategory === 'interview' && editCompany.trim()
            ? editCompany.trim()
            : undefined,
        position:
          editCategory === 'interview' && editPosition.trim()
            ? editPosition.trim()
            : undefined,
        codeContent:
          showEditCode && editCodeContent.trim()
            ? editCodeContent.trim()
            : undefined,
        codeLanguage:
          showEditCode && editCodeContent.trim() ? editCodeLanguage : undefined,
      });
      setIsEditingPost(false);
      toast.success('Your discussion has been edited.');
    } catch {
      toast.error('Failed to update post. Please try again.');
    }
  };

  const handleDeletePost = async () => {
    try {
      await deleteDiscussionMutation(discussion.id);
      navigate('/discussions');
      toast.success('Post deleted', {
        description: 'Your discussion has been removed.',
      });
    } catch {
      toast.error('Failed to delete post. Please try again.');
    }
  };

  const handleBookmark = async () => {
    if (!currentUserId) {
      toast.error('Please log in to bookmark');
      return;
    }
    try {
      await toggleBookmarkMutation(discussion.id);
    } catch {
      toast.error('Failed to update bookmark. Please try again.');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8'>
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
                  disabled={isVotingDiscussion}
                />
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center justify-between mb-3'>
                    {!isEditingPost && (
                      <div className='flex items-center gap-2 flex-wrap'>
                        <Badge
                          variant='outline'
                          className={`text-xs px-2.5 py-0.5 ${getCategoryStyle(discussion.category)}`}
                        >
                          <span className='mr-1'>
                            {getCategoryIcon(discussion.category)}
                          </span>
                          {discussion.category}
                        </Badge>
                        {discussion.category === 'interview' &&
                          (discussion.company || discussion.position) && (
                            <span className='flex items-center gap-1 text-xs text-muted-foreground'>
                              <Building2 className='h-3.5 w-3.5' />
                              {[discussion.company, discussion.position]
                                .filter(Boolean)
                                .join(' · ')}
                            </span>
                          )}
                        {discussion.isEdited && (
                          <span className='text-xs text-muted-foreground italic'>
                            edited
                          </span>
                        )}
                      </div>
                    )}
                    {isOwnPost && !isEditingPost && (
                      <div className='flex items-center gap-1 ml-auto'>
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
                                onClick={() => void handleDeletePost()}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>

                  {/* Edit form */}
                  {isEditingPost ? (
                    <div className='space-y-4 mb-5'>
                      <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>
                          Title
                        </label>
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className='bg-surface-1 border-border/50'
                          maxLength={120}
                        />
                        <p className='text-xs text-muted-foreground text-right'>
                          {editTitle.length}/120
                        </p>
                      </div>
                      <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>
                          Category
                        </label>
                        <Select
                          value={editCategory}
                          onValueChange={(v) =>
                            setEditCategory(v as DiscussionCategory)
                          }
                        >
                          <SelectTrigger className='bg-surface-1 border-border/50'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='general'>💬 General</SelectItem>
                            <SelectItem value='problem'>💡 Problem</SelectItem>
                            <SelectItem value='interview'>
                              🎯 Interview
                            </SelectItem>
                            <SelectItem value='career'>💼 Career</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {editCategory === 'interview' && (
                        <div className='grid grid-cols-2 gap-3'>
                          <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>
                              Company{' '}
                              <span className='font-normal'>(optional)</span>
                            </label>
                            <Input
                              value={editCompany}
                              onChange={(e) => setEditCompany(e.target.value)}
                              placeholder='e.g. Google'
                              className='bg-surface-1 border-border/50'
                              maxLength={60}
                            />
                          </div>
                          <div className='space-y-1.5'>
                            <label className='text-xs font-medium text-muted-foreground'>
                              Position{' '}
                              <span className='font-normal'>(optional)</span>
                            </label>
                            <Input
                              value={editPosition}
                              onChange={(e) => setEditPosition(e.target.value)}
                              placeholder='e.g. SWE Intern'
                              className='bg-surface-1 border-border/50'
                              maxLength={60}
                            />
                          </div>
                        </div>
                      )}
                      <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>
                          Content
                        </label>
                        <MarkdownEditor
                          value={editContent}
                          onChange={setEditContent}
                          placeholder='Edit your post...'
                          minHeight='150px'
                          maxLength={5000}
                        />
                      </div>
                      <div className='space-y-2'>
                        <button
                          type='button'
                          onClick={() => setShowEditCode((v) => !v)}
                          className={`flex items-center gap-2 text-sm font-medium transition-colors ${showEditCode ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                          <Code2 className='h-4 w-4' />
                          {showEditCode
                            ? 'Remove code snippet'
                            : 'Add / edit code snippet'}
                        </button>
                        {showEditCode && (
                          <div className='space-y-2 rounded-md border border-border/50 p-3 bg-surface-1/50'>
                            <Select
                              value={editCodeLanguage}
                              onValueChange={setEditCodeLanguage}
                            >
                              <SelectTrigger className='w-44 bg-surface-1 border-border/50 h-8 text-xs'>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CODE_LANGUAGES.map((lang) => (
                                  <SelectItem
                                    key={lang}
                                    value={lang}
                                    className='text-xs'
                                  >
                                    {lang}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Textarea
                              value={editCodeContent}
                              onChange={(e) =>
                                setEditCodeContent(e.target.value)
                              }
                              placeholder='Paste your code here...'
                              className='min-h-[120px] bg-surface-1 border-border/50 resize-none font-mono text-xs'
                              maxLength={8000}
                            />
                          </div>
                        )}
                      </div>
                      <div className='space-y-1.5'>
                        <label className='text-xs font-medium text-muted-foreground'>
                          Tags <span className='font-normal'>(up to 5)</span>
                        </label>
                        <div className='flex gap-2'>
                          <Input
                            value={editTagInput}
                            onChange={(e) => setEditTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddEditTag();
                              }
                            }}
                            placeholder='Add a tag...'
                            className='bg-surface-1 border-border/50'
                            maxLength={20}
                            disabled={editTags.length >= 5}
                          />
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={handleAddEditTag}
                            disabled={
                              !editTagInput.trim() || editTags.length >= 5
                            }
                            className='shrink-0'
                          >
                            Add
                          </Button>
                        </div>
                        {editTags.length > 0 && (
                          <div className='flex flex-wrap gap-1.5 mt-1'>
                            {editTags.map((tag) => (
                              <Badge
                                key={tag}
                                variant='secondary'
                                className='text-xs gap-1 pr-1'
                              >
                                {tag}
                                <button
                                  onClick={() =>
                                    setEditTags(
                                      editTags.filter((t) => t !== tag),
                                    )
                                  }
                                  className='ml-0.5 rounded-full hover:bg-foreground/10 p-0.5'
                                >
                                  <X className='h-3 w-3' />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className='flex items-center gap-2 pt-1'>
                        <Button
                          size='sm'
                          onClick={() => void handleSavePostEdit()}
                          disabled={
                            !editTitle.trim() ||
                            !editContent.trim() ||
                            isUpdatingPost
                          }
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
                    <>
                      <h1 className='text-2xl font-bold mb-4'>
                        {discussion.title}
                      </h1>
                      <MarkdownContent
                        content={discussion.content}
                        className='text-sm text-foreground/90 mb-5 leading-relaxed'
                      />
                      {discussion.codeContent && (
                        <div className='mb-5'>
                          <div className='flex items-center gap-1.5 mb-1.5'>
                            <Code2 className='h-3.5 w-3.5 text-muted-foreground' />
                            <span className='text-xs font-mono text-muted-foreground'>
                              {discussion.codeLanguage || 'code'}
                            </span>
                          </div>
                          <pre className='p-4 rounded-lg bg-surface-2 border border-border/50 text-xs font-mono overflow-x-auto whitespace-pre-wrap'>
                            <code>{discussion.codeContent}</code>
                          </pre>
                        </div>
                      )}
                    </>
                  )}

                  {!isEditingPost && discussion.tags.length > 0 && (
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
                  )}

                  <div className='flex items-center justify-between border-t border-border/30 pt-4'>
                    <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                      <div className='flex items-center gap-1.5'>
                        <Avatar className='h-6 w-6'>
                          {discussion.author.image && (
                            <AvatarImage src={discussion.author.image} />
                          )}
                          <AvatarFallback className='bg-primary/10 text-primary text-[10px] font-bold'>
                            {discussion.author.username?.[0]?.toUpperCase() ??
                              '?'}
                          </AvatarFallback>
                        </Avatar>
                        <span className='font-medium'>
                          {discussion.author.username}
                        </span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='h-3 w-3' />
                        <span>
                          {formatDistanceToNow(new Date(discussion.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-foreground'
                        onClick={() => void handleBookmark()}
                        disabled={isTogglingBookmark}
                      >
                        {discussion.bookmarked ? (
                          <BookmarkCheck className='h-4 w-4 text-primary' />
                        ) : (
                          <Bookmark className='h-4 w-4' />
                        )}
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-foreground'
                        onClick={() => {
                          void navigator.clipboard.writeText(
                            window.location.href,
                          );
                          toast.success('Link copied to clipboard');
                        }}
                      >
                        <Share2 className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-muted-foreground hover:text-destructive'
                        onClick={() =>
                          toast.info('Reporting feature coming soon')
                        }
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
        {currentUserId && (
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
                  placeholder='Share your thoughts...'
                  minHeight='100px'
                  maxLength={3000}
                />
                <div className='flex items-center justify-end mt-3'>
                  <Button
                    onClick={() => void handlePostComment()}
                    disabled={!commentText.trim() || isPostingComment}
                    size='sm'
                  >
                    {isPostingComment ? (
                      <Loader2 className='h-4 w-4 mr-1.5 animate-spin' />
                    ) : (
                      <MessageSquare className='h-4 w-4 mr-1.5' />
                    )}
                    Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Comments */}
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
                sortedComments.map((comment: Comment) => (
                  <CommentThread
                    key={comment.id}
                    comment={comment}
                    currentUserId={currentUserId}
                    onVote={handleCommentVote}
                    onReply={handleReply}
                    onEdit={handleCommentEdit}
                    onDelete={handleCommentDelete}
                    isVotePending={isVotingComment}
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
