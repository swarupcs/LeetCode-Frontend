import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDiscussionRequest } from '@/services/discussion.service';
import type { Discussion } from '@/data/discussions';

interface UpdateDiscussionPayload {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  codeContent?: string;
  codeLanguage?: string;
  company?: string;
  position?: string;
}

export const useUpdateDiscussion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { message: string; data: Discussion },
    { message: string },
    UpdateDiscussionPayload
  >({
    mutationFn: ({ id, ...payload }) => updateDiscussionRequest(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      queryClient.invalidateQueries({ queryKey: ['discussion', variables.id] });
    },
  });

  return {
    isPending: mutation.isPending,
    updateDiscussionMutation: mutation.mutateAsync,
  };
};
