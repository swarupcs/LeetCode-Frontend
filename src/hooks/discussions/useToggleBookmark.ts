import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookmarkRequest } from '@/services/discussion.service';

export const useToggleBookmark = (discussionId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { message: string; bookmarked: boolean },
    { message: string },
    string
  >({
    mutationFn: toggleBookmarkRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
    },
  });

  return {
    toggleBookmarkMutation: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
