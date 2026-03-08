import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoadmapRequest, type RoadmapWithProgress } from '@/services/roadmap.service';

interface CreateRoadmapPayload {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  isPublished: boolean;
  sections: unknown;
  order?: number;
}

export const useCreateRoadmap = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { message: string; data: RoadmapWithProgress },
    { message: string },
    CreateRoadmapPayload
  >({
    mutationFn: createRoadmapRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmapsAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
    },
  });

  return {
    createRoadmapMutation: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};
