import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voteDiscussionRequest } from '@/services/discussion.service';

export const useVoteDiscussion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { message: string; upvotes: number; downvotes: number; userVote: number },
    { message: string },
    { id: string; value: 1 | -1 | 0 }
  >({
    mutationFn: ({ id, value }) => voteDiscussionRequest(id, value),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      queryClient.invalidateQueries({ queryKey: ['discussion', variables.id] });
    },
  });

  return {
    voteDiscussionMutation: mutation.mutate,
    isPending: mutation.isPending,
  };
};
