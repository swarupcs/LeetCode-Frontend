import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateProblemRequest } from '@/services/problem.service';
import type { UpdateProblemPayload, UpdateProblemResponse, ApiError } from '@/types/problem.types';
 
export const useUpdateProblem = () => {
  const queryClient = useQueryClient();
 
  const mutation = useMutation<UpdateProblemResponse, ApiError, UpdateProblemPayload>({
    mutationFn: updateProblemRequest,
    onSuccess: (_, { problemId }) => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      queryClient.invalidateQueries({ queryKey: ['problem', problemId] });
      toast.success('Problem updated successfully.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update problem. Please try again.');
    },
  });
 
  return {
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    updateProblemMutation: mutation.mutateAsync,
  };
};