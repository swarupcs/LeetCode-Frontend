import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteProblemRequest } from '@/services/problem.service';
import type { DeleteProblemResponse, ApiError } from '@/types/problem.types';
 
export const useDeleteProblem = () => {
  const queryClient = useQueryClient();
 
  const mutation = useMutation<DeleteProblemResponse, ApiError, string>({
    mutationFn: deleteProblemRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      toast.success('Problem deleted successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete problem. Please try again.');
    },
  });
 
  return {
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    deleteProblemMutation: mutation.mutateAsync,
  };
};
 