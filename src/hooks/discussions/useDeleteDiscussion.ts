import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDiscussionRequest } from '@/services/discussion.service';

export const useDeleteDiscussion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<{ message: string }, { message: string }, string>({
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
