import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCommentRequest } from '@/services/discussion.service';
import type { Comment } from '@/data/discussions';

export const useUpdateComment = (discussionId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { message: string; data: Comment },
    { message: string },
    { id: string; content: string }
  >({
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
