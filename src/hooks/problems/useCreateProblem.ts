import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createProblemRequest } from '@/services/problem.service';
import type {
  CreateProblemPayload,
  CreateProblemResponse,
  ApiError,
} from '@/types/problem.types';

export const useCreateProblem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateProblemResponse,
    ApiError,
    CreateProblemPayload
  >({
    mutationFn: (payload) => createProblemRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      toast.success('Problem created successfully.');
    },
    onError: (error) => {
      toast.error(
        error.message || 'Failed to create problem. Please try again.',
      );
    },
  });

  return {
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    createProblemMutation: mutation.mutateAsync,
  };
};
