import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommentRequest } from '@/services/discussion.service';
import type {
  CreateCommentPayload, CreateCommentResponse, ApiError,
} from '@/types/discussion.types';
 
export const useCreateComment = (discussionId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<CreateCommentResponse, ApiError, CreateCommentPayload>({
    mutationFn: createCommentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
    },
  });
  return {
    isPending: mutation.isPending,
    createCommentMutation: mutation.mutateAsync,
  };
};