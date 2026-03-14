import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoadmapRequest } from '@/services/roadmap.service';
import type { CreateRoadmapPayload, CreateRoadmapResponse, ApiError } from '@/types/roadmap.types';
 
export const useCreateRoadmap = () => {
  const queryClient = useQueryClient();
 
  const mutation = useMutation<CreateRoadmapResponse, ApiError, CreateRoadmapPayload>({
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