import { useQuery } from '@tanstack/react-query';
import { getAllDiscussionsRequest } from '@/services/discussion.service';
import type { GetAllDiscussionsResponse, ApiError } from '@/types/discussion.types';
 
export const useGetAllDiscussions = () => {
  const query = useQuery<GetAllDiscussionsResponse, ApiError>({
    queryKey: ['discussions'],
    queryFn: getAllDiscussionsRequest,
    staleTime: 2 * 60 * 1000,
  });
  return {
    ...query,
    discussions: query.data?.data ?? [],
  };
};