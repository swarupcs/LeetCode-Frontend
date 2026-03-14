import { useMutation, useQueryClient } from '@tanstack/react-query';
import { voteDiscussionRequest } from '@/services/discussion.service';
import type { VotePayload, VoteDiscussionResponse, ApiError } from '@/types/discussion.types';
 
export const useVoteDiscussion = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<VoteDiscussionResponse, ApiError, VotePayload>({
    mutationFn: ({ id, value }) => voteDiscussionRequest(id, value),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      queryClient.invalidateQueries({ queryKey: ['discussion', id] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkedDiscussions'] });
    },
  });
  return {
    isPending: mutation.isPending,
    voteDiscussionMutation: mutation.mutateAsync,
  };
};