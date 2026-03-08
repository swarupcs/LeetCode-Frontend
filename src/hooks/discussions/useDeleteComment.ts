import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCommentRequest } from '@/services/discussion.service';

export const useDeleteComment = (discussionId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<{ message: string }, { message: string }, string>({
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
