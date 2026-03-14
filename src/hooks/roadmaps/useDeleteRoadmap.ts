import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRoadmapRequest } from '@/services/roadmap.service';
import type { DeleteRoadmapResponse, ApiError } from '@/types/roadmap.types';
 
export const useDeleteRoadmap = () => {
  const queryClient = useQueryClient();
 
  const mutation = useMutation<DeleteRoadmapResponse, ApiError, string>({
    mutationFn: deleteRoadmapRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmapsAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
    },
  });
 
  return {
    deleteRoadmapMutation: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};