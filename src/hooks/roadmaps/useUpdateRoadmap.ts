import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRoadmapRequest } from '@/services/roadmap.service';
import type { UpdateRoadmapPayload, UpdateRoadmapResponse, ApiError } from '@/types/roadmap.types';
 
export const useUpdateRoadmap = () => {
  const queryClient = useQueryClient();
 
  const mutation = useMutation<UpdateRoadmapResponse, ApiError, UpdateRoadmapPayload>({
    mutationFn: ({ id, ...payload }) => updateRoadmapRequest(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['roadmapsAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['roadmapAdmin', id] });
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
    },
  });
 
  return {
    updateRoadmapMutation: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};