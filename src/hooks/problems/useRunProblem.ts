import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { runCodeRequest } from '@/services/code.service';
import type { RunCodePayload, RunCodeResponse, ApiError } from '@/types/code.types';
 
export const useExecuteProblem = () => {
  const mutation = useMutation<RunCodeResponse, ApiError, RunCodePayload>({
    mutationFn: runCodeRequest,
    onError: (error) => {
      toast.error(error.message || 'Failed to execute code. Please try again.');
    },
  });
 
  return {
    ...mutation,
    runProblemMutation: mutation.mutateAsync,
    // unwrapped convenience fields — data.data is RunData
    runData: mutation.data?.data ?? null,
  };
};