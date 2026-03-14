import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDiscussionRequest } from '@/services/discussion.service';
import type { DeleteDiscussionResponse, ApiError } from '@/types/discussion.types';
 
export const useDeleteDiscussion = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<DeleteDiscussionResponse, ApiError, string>({
    mutationFn: deleteDiscussionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkedDiscussions'] });
    },
  });
  return {
    isPending: mutation.isPending,
    deleteDiscussionMutation: mutation.mutateAsync,
  };
};