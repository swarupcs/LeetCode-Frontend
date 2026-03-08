import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voteCommentRequest } from '@/services/discussion.service';

export const useVoteComment = (discussionId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { message: string; upvotes: number; downvotes: number; userVote: number },
    { message: string },
    { id: string; value: 1 | -1 | 0 }
  >({
    mutationFn: ({ id, value }) => voteCommentRequest(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
    },
  });

  return {
    voteCommentMutation: mutation.mutate,
    isPending: mutation.isPending,
  };
};
