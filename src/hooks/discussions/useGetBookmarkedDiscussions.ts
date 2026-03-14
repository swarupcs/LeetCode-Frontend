import { useQuery } from '@tanstack/react-query';
import { getBookmarkedDiscussionsRequest } from '@/services/discussion.service';
import type { GetBookmarksResponse, ApiError } from '@/types/discussion.types';
 
export const useGetBookmarkedDiscussions = (enabled = true) => {
  const query = useQuery<GetBookmarksResponse, ApiError>({
    queryKey: ['bookmarkedDiscussions'],
    queryFn: getBookmarkedDiscussionsRequest,
    staleTime: 2 * 60 * 1000,
    enabled,
  });
  return {
    ...query,
    bookmarkedDiscussions: query.data?.data ?? [],
  };
};