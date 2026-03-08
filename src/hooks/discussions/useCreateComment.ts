import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommentRequest } from '@/services/discussion.service';
import type { Comment } from '@/data/discussions';

interface CreateCommentPayload {
  discussionId: string;
  content: string;
  parentId?: string;
}

export const useCreateComment = (discussionId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { message: string; data: Comment },
    { message: string },
    CreateCommentPayload
  >({
    mutationFn: createCommentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
    },
  });

  return {
    isPending: mutation.isPending,
    createCommentMutation: mutation.mutateAsync,
  };
};
