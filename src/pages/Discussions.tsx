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
import { MessageSquare, Search, Plus, TrendingUp } from 'lucide-react';
import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import { CategoryFilter } from '@/components/discussions/CategoryFilter';
import { NewPostDialog } from '@/components/discussions/NewPostDialog';
import { mockDiscussions } from '@/data/discussions';
import type { Discussion, DiscussionCategory } from '@/data/discussions';

import { usePagination } from '@/hooks/use-pagination';
import { toast } from 'sonner';

export default function DiscussionsPage() {
  const navigate = useNavigate();
  const [discussions, setDiscussions] = useState<Discussion[]>(mockDiscussions);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('top');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [newPostOpen, setNewPostOpen] = useState(false);
  const ITEMS_PER_PAGE = 5;

  const filtered = useMemo(() => {
    let result = discussions;

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((d) => d.category === categoryFilter);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.content.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Sort
    return [...result].sort((a, b) => {
      if (sortBy === 'top')
        return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
      if (sortBy === 'newest') return 0; // mock data doesn't have real dates
      if (sortBy === 'discussed') return b.commentCount - a.commentCount;
      if (sortBy === 'views') return b.viewCount - a.viewCount;
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

  // Reset to page 1 when filters change
  useEffect(() => {
    pagination.setPage(1);
  }, [searchQuery, sortBy, categoryFilter]);

  const handleVote = (id: string, vote: -1 | 0 | 1) => {
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

  const handleNewPost = (post: {
    title: string;
    content: string;
    category: DiscussionCategory;
    tags: string[];
  }) => {
    const newDiscussion: Discussion = {
      id: `new-${Date.now()}`,
      title: post.title,
      content: post.content,
      author: 'you',
      createdAt: 'Just now',
      upvotes: 1,
      downvotes: 0,
      userVote: 1,
      commentCount: 0,
      tags: post.tags,
      category: post.category,
      comments: [],
      viewCount: 1,
    };
    setDiscussions((prev) => [newDiscussion, ...prev]);
    pagination.setPage(1);
toast.success('Post created!', {
  description: 'Your discussion has been published.',
});
  };

  const handleDeletePost = (postId: string) => {
    setDiscussions((prev) => prev.filter((d) => d.id !== postId));
    toast.success('Post deleted', {
      description: 'Your discussion has been removed.',
    });
  };

  const stats = useMemo(() => {
    const totalPosts = discussions.length;
    const totalComments = discussions.reduce(
      (sum, d) => sum + d.commentCount,
      0,
    );
    return { totalPosts, totalComments };
  }, [discussions]);

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
          <Button onClick={() => setNewPostOpen(true)}>
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

        {/* Category filter */}
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

        {/* Search & Sort */}
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
              <SelectItem value='views'>👁 Most Viewed</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Discussion List */}
        <div className='space-y-3'>
          {paginatedItems.map((discussion, index) => (
            <DiscussionCard
              key={discussion.id}
              discussion={discussion}
              index={index}
              onVote={handleVote}
              onClick={(id) => navigate(`/discussions/${id}`)}
              onDelete={handleDeletePost}
            />
          ))}

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-16'
            >
              <MessageSquare className='h-10 w-10 text-muted-foreground mx-auto mb-3' />
              <p className='text-muted-foreground mb-1'>No discussions found</p>
              <p className='text-xs text-muted-foreground'>
                Try a different search or category filter
              </p>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
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

        <NewPostDialog
          open={newPostOpen}
          onOpenChange={setNewPostOpen}
          onSubmit={handleNewPost}
        />
      </div>
    </div>
  );
}
