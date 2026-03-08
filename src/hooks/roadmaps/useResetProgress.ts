import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetProgressRequest } from '@/services/roadmap.service';

export const useResetProgress = (roadmapId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<{ message: string }, { message: string }, void>({
    mutationFn: () => resetProgressRequest(roadmapId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
  });

  return {
    resetProgressMutation: mutation.mutate,
    isPending: mutation.isPending,
  };
};
