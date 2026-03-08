import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRoadmapRequest, type RoadmapWithProgress } from '@/services/roadmap.service';

interface UpdateRoadmapPayload {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  color?: string;
  isPublished?: boolean;
  sections?: unknown;
  order?: number;
}

export const useUpdateRoadmap = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { message: string; data: RoadmapWithProgress },
    { message: string },
    UpdateRoadmapPayload
  >({
    mutationFn: ({ id, ...payload }) => updateRoadmapRequest(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roadmapsAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['roadmapAdmin', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
    },
  });

  return {
    updateRoadmapMutation: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
