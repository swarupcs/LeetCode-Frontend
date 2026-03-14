import { useQuery } from '@tanstack/react-query';
import { getDiscussionRequest } from '@/services/discussion.service';
import type { GetDiscussionResponse, ApiError } from '@/types/discussion.types';
 
export const useGetDiscussion = (id: string) => {
  const query = useQuery<GetDiscussionResponse, ApiError>({
    queryKey: ['discussion', id],
    queryFn: () => getDiscussionRequest(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
  return {
    ...query,
    // data.data is the Discussion (with comments populated)
    discussion: query.data?.data ?? null,
  };
};