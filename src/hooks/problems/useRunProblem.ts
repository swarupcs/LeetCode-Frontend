import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { runCodeRequest } from '@/services/code.service';
import type {
  RunCodePayload,
  RunCodeResponse,
  ApiError,
} from '@/types/code.types';

export const useExecuteProblem = () => {
  const mutation = useMutation<RunCodeResponse, ApiError, RunCodePayload>({
    mutationFn: runCodeRequest,

    onSuccess: (data) => {
      if (data.success) {
        toast.success('Code executed successfully.');
      } else {
        toast.warning(data.message || 'Execution finished with errors.');
      }
    },

    onError: (error) => {
      toast.error(
        error.message || 'Failed to execute problem. Please try again.',
      );
    },
  });

  return {
    ...mutation,
    runProblemMutation: mutation.mutateAsync,
  };
};
