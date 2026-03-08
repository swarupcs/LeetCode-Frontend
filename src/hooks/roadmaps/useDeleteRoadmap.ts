import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRoadmapRequest } from '@/services/roadmap.service';

export const useDeleteRoadmap = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<{ message: string }, { message: string }, string>({
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
