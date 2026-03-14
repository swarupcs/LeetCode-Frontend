import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetProgressRequest } from '@/services/roadmap.service';
import type { ResetProgressResponse, ApiError } from '@/types/roadmap.types';
 
export const useResetProgress = (roadmapId: string) => {
  const queryClient = useQueryClient();
 
  const mutation = useMutation<ResetProgressResponse, ApiError, void>({
    mutationFn: () => resetProgressRequest(roadmapId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
  });
 
  return {
    // mutate (fire-and-forget) matches the usage in useRoadmapProgress onReset callback
    resetProgressMutation: mutation.mutate,
    isPending: mutation.isPending,
  };
};