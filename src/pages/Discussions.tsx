// src/pages/DiscussionsPage.tsx
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  MessageSquare,
  Search,
  Plus,
  TrendingUp,
  Bookmark,
} from 'lucide-react';
import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import { CategoryFilter } from '@/components/discussions/CategoryFilter';
import { NewPostDialog } from '@/components/discussions/NewPostDialog';
import { usePagination } from '@/hooks/use-pagination';
import { toast } from 'sonner';
import { useAppSelector } from '@/hooks/redux';
import { useGetAllDiscussions } from '@/hooks/discussions/useGetAllDiscussions';
import { useGetBookmarkedDiscussions } from '@/hooks/discussions/useGetBookmarkedDiscussions';
import { useCreateDiscussion } from '@/hooks/discussions/useCreateDiscussion';
import { useDeleteDiscussion } from '@/hooks/discussions/useDeleteDiscussion';
import { useVoteDiscussion } from '@/hooks/discussions/useVoteDiscussion';
import type { CreateDiscussionPayload } from '@/types/discussion.types';

type TabView = 'all' | 'bookmarks';

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

// ─── Skeleton: one discussion card ───────────────────────────────────────────
// Mirrors DiscussionCard's visible structure: vote column + body

function SkeletonDiscussionCard({ index }: { index: number }) {
  const base = index * 70;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.3 + index * 0.055 }}
      className='glass-card p-4 flex gap-4'
    >
      {/* Vote column */}
      <div className='flex flex-col items-center gap-2 pt-0.5 shrink-0'>
        <Bone w='w-6' h='h-6' rounded='rounded-md' delay={base} />
        <Bone w='w-5' h='h-3' delay={base + 20} />
        <Bone w='w-6' h='h-6' rounded='rounded-md' delay={base + 40} />
      </div>

      {/* Body */}
      <div className='flex-1 min-w-0 space-y-3'>
        {/* Category badge + tags row */}
        <div className='flex items-center gap-2 flex-wrap'>
          <Bone w='w-16' h='h-5' rounded='rounded-full' delay={base + 20} />
          <Bone w='w-20' h='h-4' rounded='rounded-md' delay={base + 40} />
          <Bone w='w-14' h='h-4' rounded='rounded-md' delay={base + 55} />
        </div>

        {/* Title */}
        <Bone
          w={['w-3/4', 'w-5/6', 'w-2/3', 'w-4/5', 'w-3/5'][index % 5]!}
          h='h-4'
          delay={base + 30}
        />

        {/* Excerpt lines */}
        <div className='space-y-1.5'>
          <Bone w='w-full' h='h-3' delay={base + 50} />
          <Bone
            w={['w-5/6', 'w-4/5', 'w-full', 'w-3/4', 'w-5/6'][index % 5]!}
            h='h-3'
            delay={base + 65}
          />
        </div>

        {/* Footer: avatar + name + time + comments + bookmark */}
        <div className='flex items-center justify-between pt-1'>
          <div className='flex items-center gap-2'>
            <Bone w='w-6' h='h-6' rounded='rounded-full' delay={base + 70} />
            <Bone w='w-20' h='h-2.5' delay={base + 85} />
            <Bone w='w-14' h='h-2.5' delay={base + 100} />
          </div>
          <div className='flex items-center gap-3'>
            <Bone w='w-12' h='h-4' rounded='rounded-md' delay={base + 80} />
            <Bone w='w-6' h='h-6' rounded='rounded-md' delay={base + 90} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Full page skeleton ───────────────────────────────────────────────────────

function DiscussionsSkeleton() {
  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'
        >
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <Bone w='w-8' h='h-8' rounded='rounded-lg' />
              <Bone w='w-36' h='h-8' rounded='rounded-lg' delay={40} />
            </div>
            <Bone w='w-56' h='h-4' delay={80} />
          </div>
          {/* New Post button placeholder */}
          <Bone w='w-28' h='h-9' rounded='rounded-lg' delay={60} />
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className='flex items-center gap-6 mb-6'
        >
          <div className='flex items-center gap-1.5'>
            <Bone w='w-4' h='h-4' rounded='rounded' delay={100} />
            <Bone w='w-16' h='h-3.5' delay={115} />
          </div>
          <div className='flex items-center gap-1.5'>
            <Bone w='w-4' h='h-4' rounded='rounded' delay={130} />
            <Bone w='w-20' h='h-3.5' delay={145} />
          </div>
        </motion.div>

        {/* Tab toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className='flex items-center gap-1 mb-5 bg-surface-1 rounded-lg p-1 w-fit border border-border/40'
        >
          <Bone w='w-36' h='h-8' rounded='rounded-md' delay={140} />
          <Bone w='w-32' h='h-8' rounded='rounded-md' delay={170} />
        </motion.div>

        {/* Category filter chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='flex items-center gap-2 flex-wrap mb-4'
        >
          {[48, 64, 56, 72, 52, 60].map((w, i) => (
            <Bone
              key={i}
              w={`w-[${w}px]`}
              h='h-7'
              rounded='rounded-full'
              delay={160 + i * 25}
            />
          ))}
        </motion.div>

        {/* Search + sort */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className='flex flex-col sm:flex-row gap-3 mb-6'
        >
          <Bone w='flex-1 w-full' h='h-10' rounded='rounded-xl' delay={200} />
          <Bone w='w-full sm:w-44' h='h-10' rounded='rounded-xl' delay={230} />
        </motion.div>

        {/* Discussion cards */}
        <div className='space-y-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonDiscussionCard key={i} index={i} />
          ))}
        </div>

        {/* Pagination placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className='mt-8 flex flex-col items-center gap-3'
        >
          <div className='flex items-center gap-1.5'>
            {[0, 1, 2, 3, 4].map((i) => (
              <Bone
                key={i}
                w='w-9'
                h='h-9'
                rounded='rounded-lg'
                delay={600 + i * 30}
              />
            ))}
          </div>
          <Bone w='w-48' h='h-3' delay={760} />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DiscussionsPage() {
  const navigate = useNavigate();
  const currentUserId = useAppSelector((state) => state.auth.id);

  const [activeTab, setActiveTab] = useState<TabView>('all');

  const { discussions, isPending: isLoading, isError } = useGetAllDiscussions();
  const {
    bookmarkedDiscussions,
    isPending: isLoadingBookmarks,
    isError: isErrorBookmarks,
  } = useGetBookmarkedDiscussions(!!currentUserId);
  const { createDiscussionMutation, isPending: isCreating } =
    useCreateDiscussion();
  const { deleteDiscussionMutation } = useDeleteDiscussion();
  const { voteDiscussionMutation, isPending: isVotePending } =
    useVoteDiscussion();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('top');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [newPostOpen, setNewPostOpen] = useState(false);

  const ITEMS_PER_PAGE = 5;

  const filtered = useMemo(() => {
    let result = discussions;
    if (categoryFilter !== 'all')
      result = result.filter((d) => d.category === categoryFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.content.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return [...result].sort((a, b) => {
      if (sortBy === 'top')
        return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
      if (sortBy === 'newest')
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === 'discussed') return b.commentCount - a.commentCount;
      return 0;
    });
  }, [discussions, searchQuery, sortBy, categoryFilter]);

  const pagination = usePagination({
    totalItems: filtered.length,
    itemsPerPage: ITEMS_PER_PAGE,
  });
  const paginatedItems = useMemo(
    () => filtered.slice(pagination.startIndex, pagination.endIndex),
    [filtered, pagination.startIndex, pagination.endIndex],
  );

  useEffect(() => {
    pagination.setPage(1);
  }, [searchQuery, sortBy, categoryFilter]);

  const handleVote = async (id: string, vote: -1 | 0 | 1) => {
    if (!currentUserId) {
      toast.error('Please log in to vote');
      return;
    }
    try {
      await voteDiscussionMutation({ id, value: vote });
    } catch {
      toast.error('Failed to vote. Please try again.');
    }
  };

  const handleNewPost = async (post: CreateDiscussionPayload) => {
    try {
      await createDiscussionMutation(post);
      toast.success('Post created!', {
        description: 'Your discussion has been published.',
      });
      pagination.setPage(1);
    } catch {
      toast.error('Failed to create post. Please try again.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteDiscussionMutation(postId);
      toast.success('Post deleted', {
        description: 'Your discussion has been removed.',
      });
    } catch {
      toast.error('Failed to delete post. Please try again.');
    }
  };

  const stats = useMemo(
    () => ({
      totalPosts: discussions.length,
      totalComments: discussions.reduce((sum, d) => sum + d.commentCount, 0),
    }),
    [discussions],
  );

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) return <DiscussionsSkeleton />;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'
        >
          <div>
            <h1 className='text-3xl font-bold mb-1 flex items-center gap-3'>
              <MessageSquare className='h-8 w-8 text-primary' />
              Discussions
            </h1>
            <p className='text-muted-foreground text-sm'>
              Share solutions, ask questions, learn together
            </p>
          </div>
          <Button
            onClick={() => {
              if (!currentUserId) {
                toast.error('Please log in to create a post');
                return;
              }
              setNewPostOpen(true);
            }}
            disabled={isCreating}
          >
            <Plus className='h-4 w-4 mr-2' />
            New Post
          </Button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className='flex items-center gap-6 mb-6 text-sm text-muted-foreground'
        >
          <div className='flex items-center gap-1.5'>
            <TrendingUp className='h-4 w-4 text-primary' />
            <span>
              <strong className='text-foreground'>{stats.totalPosts}</strong>{' '}
              posts
            </span>
          </div>
          <div className='flex items-center gap-1.5'>
            <MessageSquare className='h-4 w-4 text-accent' />
            <span>
              <strong className='text-foreground'>{stats.totalComments}</strong>{' '}
              comments
            </span>
          </div>
        </motion.div>

        {/* Tab toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className='flex items-center gap-1 mb-5 bg-surface-1 rounded-lg p-1 w-fit border border-border/40'
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <MessageSquare className='h-3.5 w-3.5' />
            All Discussions
          </button>
          <button
            onClick={() => {
              if (!currentUserId) {
                toast.error('Please log in to view bookmarks');
                return;
              }
              setActiveTab('bookmarks');
            }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'bookmarks' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Bookmark className='h-3.5 w-3.5' />
            My Bookmarks
            {bookmarkedDiscussions.length > 0 && (
              <span className='ml-1 text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-semibold'>
                {bookmarkedDiscussions.length}
              </span>
            )}
          </button>
        </motion.div>

        {/* ── BOOKMARKS TAB ──────────────────────────────────────────────── */}
        {activeTab === 'bookmarks' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isLoadingBookmarks && (
              <div className='space-y-3'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonDiscussionCard key={i} index={i} />
                ))}
              </div>
            )}
            {isErrorBookmarks && !isLoadingBookmarks && (
              <div className='text-center py-16'>
                <Bookmark className='h-10 w-10 text-muted-foreground mx-auto mb-3' />
                <p className='text-muted-foreground mb-1'>
                  Failed to load bookmarks
                </p>
                <p className='text-xs text-muted-foreground'>
                  Please try again later
                </p>
              </div>
            )}
            {!isLoadingBookmarks && !isErrorBookmarks && (
              <div className='space-y-3'>
                {bookmarkedDiscussions.length > 0 ? (
                  bookmarkedDiscussions.map((discussion, index) => (
                    <DiscussionCard
                      key={discussion.id}
                      discussion={discussion}
                      index={index}
                      currentUserId={currentUserId}
                      onVote={handleVote}
                      onClick={(id) => navigate(`/discussions/${id}`)}
                      onDelete={handleDeletePost}
                      isVotePending={isVotePending}
                    />
                  ))
                ) : (
                  <div className='text-center py-16'>
                    <Bookmark className='h-10 w-10 text-muted-foreground mx-auto mb-3' />
                    <p className='text-muted-foreground mb-1'>
                      No bookmarks yet
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Bookmark discussions you want to revisit
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* ── ALL DISCUSSIONS TAB ─────────────────────────────────────────── */}
        {activeTab === 'all' && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className='mb-4'
            >
              <CategoryFilter
                selected={categoryFilter}
                onSelect={setCategoryFilter}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='flex flex-col sm:flex-row gap-3 mb-6'
            >
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search discussions, tags...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10 bg-surface-1 border-border/50 h-10'
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='w-full sm:w-44 bg-surface-1 border-border/50 h-10'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='top'>🔥 Top Voted</SelectItem>
                  <SelectItem value='newest'>🕐 Newest</SelectItem>
                  <SelectItem value='discussed'>💬 Most Discussed</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {isError && (
              <div className='text-center py-16'>
                <MessageSquare className='h-10 w-10 text-muted-foreground mx-auto mb-3' />
                <p className='text-muted-foreground mb-1'>
                  Failed to load discussions
                </p>
                <p className='text-xs text-muted-foreground'>
                  Please try again later
                </p>
              </div>
            )}

            {!isError && (
              <div className='space-y-3'>
                {paginatedItems.map((discussion, index) => (
                  <DiscussionCard
                    key={discussion.id}
                    discussion={discussion}
                    index={index}
                    currentUserId={currentUserId}
                    onVote={handleVote}
                    onClick={(id) => navigate(`/discussions/${id}`)}
                    onDelete={handleDeletePost}
                    isVotePending={isVotePending}
                  />
                ))}
                {filtered.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='text-center py-16'
                  >
                    <MessageSquare className='h-10 w-10 text-muted-foreground mx-auto mb-3' />
                    <p className='text-muted-foreground mb-1'>
                      No discussions found
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      Try a different search or category filter
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='mt-8 flex flex-col items-center gap-3'
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={(e) => {
                          e.preventDefault();
                          pagination.prevPage();
                        }}
                        className={
                          pagination.isFirstPage
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                    {pagination.pageNumbers.map((page, idx) =>
                      page === 'ellipsis' ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === pagination.currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              pagination.setPage(page);
                            }}
                            className='cursor-pointer'
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => {
                          e.preventDefault();
                          pagination.nextPage();
                        }}
                        className={
                          pagination.isLastPage
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <p className='text-xs text-muted-foreground'>
                  Showing {pagination.startIndex + 1}–{pagination.endIndex} of{' '}
                  {filtered.length} discussions
                </p>
              </motion.div>
            )}
          </>
        )}

        <NewPostDialog
          open={newPostOpen}
          onOpenChange={setNewPostOpen}
          isPending={isCreating}
          onSubmit={handleNewPost}
        />
      </div>
    </div>
  );
}
