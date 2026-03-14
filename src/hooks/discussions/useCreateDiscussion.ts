import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDiscussionRequest } from '@/services/discussion.service';
import type {
  CreateDiscussionPayload, CreateDiscussionResponse, ApiError,
} from '@/types/discussion.types';
 
export const useCreateDiscussion = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<CreateDiscussionResponse, ApiError, CreateDiscussionPayload>({
    mutationFn: createDiscussionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
    },
  });
  return {
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    createDiscussionMutation: mutation.mutateAsync,
  };
};