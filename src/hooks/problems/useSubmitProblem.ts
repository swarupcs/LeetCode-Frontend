
import { submitCode } from '@/services/code.service';
import type { ApiErrorResponse, SubmitCodePayload } from '@/types/code.types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSubmitCode = () => {
  const mutation = useMutation({
    mutationFn: (payload: SubmitCodePayload) => submitCode(payload),

    onSuccess: (data) => {
      console.log('Successfully submitted problem', data);

      toast.success(data.message || 'Problem submitted successfully 🚀');
    },

    onError: (error: ApiErrorResponse) => {
      console.error('Failed to submit problem', error);

      toast.error(
        error?.message || 'Failed to submit problem. Please try again.',
      );
    },
  });

  return {
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    submitProblem: mutation.mutateAsync,
  };
};
