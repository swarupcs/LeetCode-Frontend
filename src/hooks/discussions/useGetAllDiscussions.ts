import { useQuery } from '@tanstack/react-query';
import { getAllDiscussionsRequest } from '@/services/discussion.service';
import type { Discussion } from '@/data/discussions';

export const useGetAllDiscussions = () => {
  const query = useQuery<{ message: string; data: Discussion[] }, { message: string }>({
    queryKey: ['discussions'],
    queryFn: getAllDiscussionsRequest,
    staleTime: 1000 * 60 * 2,
  });

  return {
    ...query,
    discussions: query.data?.data ?? [],
  };
};
