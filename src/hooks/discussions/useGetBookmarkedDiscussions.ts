import { useQuery } from '@tanstack/react-query';
import { getBookmarkedDiscussionsRequest } from '@/services/discussion.service';
import type { Discussion } from '@/data/discussions';

export const useGetBookmarkedDiscussions = () => {
  const query = useQuery<{ message: string; data: Discussion[] }, { message: string }>({
    queryKey: ['bookmarkedDiscussions'],
    queryFn: getBookmarkedDiscussionsRequest,
    staleTime: 1000 * 60 * 2,
  });

  return {
    ...query,
    bookmarkedDiscussions: query.data?.data ?? [],
  };
};
