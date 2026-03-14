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
  Loader2,
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
import type {
  CreateDiscussionPayload,
} from '@/types/discussion.types';

type TabView = 'all' | 'bookmarks';

export default function DiscussionsPage() {
  const navigate = useNavigate();
  const currentUserId = useAppSelector((state) => state.auth.id);

  const [activeTab, setActiveTab] = useState<TabView>('all');

  // hooks — data.data is pre-unwrapped in each hook
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
          d.tags.some((t) => t.toLowerCase().includes(q))
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
    [filtered, pagination.startIndex, pagination.endIndex]
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
    [discussions]
  );

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

        {/* ── BOOKMARKS TAB ─────────────────────────────────────────── */}
        {activeTab === 'bookmarks' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isLoadingBookmarks && (
              <div className='flex items-center justify-center py-16'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
              </div>
            )}
            {isErrorBookmarks && (
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

        {/* ── ALL DISCUSSIONS TAB ────────────────────────────────────── */}
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

            {isLoading && (
              <div className='flex items-center justify-center py-16'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
              </div>
            )}
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

            {!isLoading && !isError && (
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
                      )
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
