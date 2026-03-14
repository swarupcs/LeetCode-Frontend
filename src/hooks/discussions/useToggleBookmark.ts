import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookmarkRequest } from '@/services/discussion.service';
import type { ToggleBookmarkResponse, ApiError } from '@/types/discussion.types';
 
export const useToggleBookmark = (discussionId: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ToggleBookmarkResponse, ApiError, string>({
    mutationFn: toggleBookmarkRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      queryClient.invalidateQueries({ queryKey: ['discussion', discussionId] });
      queryClient.invalidateQueries({ queryKey: ['bookmarkedDiscussions'] });
    },
  });
  return {
    isPending: mutation.isPending,
    toggleBookmarkMutation: mutation.mutateAsync,
  };
};