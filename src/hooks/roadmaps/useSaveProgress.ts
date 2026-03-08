import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveProgressRequest } from '@/services/roadmap.service';

export const useSaveProgress = (roadmapId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { message: string; data: { completedTopicIds: string[] } },
    { message: string },
    string[]
  >({
    mutationFn: (completedTopicIds) => saveProgressRequest(roadmapId, completedTopicIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
    },
  });

  return {
    saveProgressMutation: mutation.mutate,
    isPending: mutation.isPending,
  };
};
