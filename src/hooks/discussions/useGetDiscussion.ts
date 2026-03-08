import { useQuery } from '@tanstack/react-query';
import { getDiscussionRequest } from '@/services/discussion.service';
import type { Discussion, Comment } from '@/data/discussions';

export const useGetDiscussion = (id: string) => {
  const query = useQuery<Discussion & { comments: Comment[] }, { message: string }>({
    queryKey: ['discussion', id],
    queryFn: () => getDiscussionRequest(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 1,
  });

  return {
    ...query,
    discussion: query.data,
  };
};
