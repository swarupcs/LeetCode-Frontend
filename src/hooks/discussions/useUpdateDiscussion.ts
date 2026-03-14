import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDiscussionRequest } from '@/services/discussion.service';
import type {
  UpdateDiscussionPayload, UpdateDiscussionResponse, ApiError,
} from '@/types/discussion.types';
 
export const useUpdateDiscussion = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<UpdateDiscussionResponse, ApiError, UpdateDiscussionPayload>({
    mutationFn: ({ id, ...payload }) => updateDiscussionRequest(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      queryClient.invalidateQueries({ queryKey: ['discussion', id] });
    },
  });
  return {
    isPending: mutation.isPending,
    updateDiscussionMutation: mutation.mutateAsync,
  };
};