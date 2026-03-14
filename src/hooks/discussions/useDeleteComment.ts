import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCommentRequest } from '@/services/discussion.service';
import type { DeleteCommentResponse, ApiError } from '@/types/discussion.types';
 
export const useDeleteComment = (discussionId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<DeleteCommentResponse, ApiError, string>({
    mutationFn: deleteCommentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
    },
  });
  return {
    isPending: mutation.isPending,
    deleteCommentMutation: mutation.mutateAsync,
  };
};
 