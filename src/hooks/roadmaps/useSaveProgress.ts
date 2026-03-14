import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveProgressRequest } from '@/services/roadmap.service';
import type { SaveProgressResponse, ApiError } from '@/types/roadmap.types';
 
export const useSaveProgress = (roadmapId: string) => {
  const queryClient = useQueryClient();
 
  const mutation = useMutation<SaveProgressResponse, ApiError, string[]>({
    mutationFn: (completedTopicIds) => saveProgressRequest(roadmapId, completedTopicIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
  });
 
  return {
    // mutate (fire-and-forget) matches the usage in useRoadmapProgress onSave callback
    saveProgressMutation: mutation.mutate,
    isPending: mutation.isPending,
  };
};