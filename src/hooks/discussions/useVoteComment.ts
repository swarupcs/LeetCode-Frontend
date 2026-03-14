import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voteCommentRequest } from '@/services/discussion.service';
import type { VotePayload, VoteCommentResponse, ApiError } from '@/types/discussion.types';
 
export const useVoteComment = (discussionId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<VoteCommentResponse, ApiError, VotePayload>({
    mutationFn: ({ id, value }) => voteCommentRequest(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
    },
  });
  return {
    isPending: mutation.isPending,
    voteCommentMutation: mutation.mutateAsync,
  };
};