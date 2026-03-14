import { useMutation, useQueryClient } from '@tanstack/react-query';
import { togglePublishRequest } from '@/services/roadmap.service';
import type { TogglePublishResponse, ApiError } from '@/types/roadmap.types';
 
export const useToggleRoadmapPublish = () => {
  const queryClient = useQueryClient();
 
  const mutation = useMutation<TogglePublishResponse, ApiError, string>({
    mutationFn: togglePublishRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmapsAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
    },
  });
 
  return {
    togglePublishMutation: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};