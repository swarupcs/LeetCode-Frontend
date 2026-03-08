import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDiscussionRequest } from '@/services/discussion.service';
import type { Discussion } from '@/data/discussions';

interface CreateDiscussionPayload {
  title: string;
  content: string;
  category: string;
  tags: string[];
  codeContent?: string;
  codeLanguage?: string;
  company?: string;
  position?: string;
}

export const useCreateDiscussion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<{ message: string; data: Discussion }, { message: string }, CreateDiscussionPayload>({
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
