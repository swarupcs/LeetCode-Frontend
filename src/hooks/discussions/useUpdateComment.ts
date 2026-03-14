import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCommentRequest } from '@/services/discussion.service';
import type {
  UpdateCommentPayload, UpdateCommentResponse, ApiError,
} from '@/types/discussion.types';
 
export const useUpdateComment = (discussionId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<UpdateCommentResponse, ApiError, UpdateCommentPayload>({
    mutationFn: ({ id, content }) => updateCommentRequest(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
    },
  });
  return {
    isPending: mutation.isPending,
    updateCommentMutation: mutation.mutateAsync,
  };
};