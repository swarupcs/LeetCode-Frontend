import { useMutation, useQueryClient } from '@tanstack/react-query';
import { togglePublishRequest, type RoadmapWithProgress } from '@/services/roadmap.service';

export const useToggleRoadmapPublish = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { message: string; data: RoadmapWithProgress },
    { message: string },
    string
  >({
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
