import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { submitCode } from '@/services/code.service';
import type { SubmitCodePayload, SubmitCodeResponse, ApiError } from '@/types/code.types';
 
export const useSubmitCode = () => {
  const mutation = useMutation<SubmitCodeResponse, ApiError, SubmitCodePayload>({
    mutationFn: submitCode,
    onSuccess: (response) => {
      if (response.data?.allPassed) {
        toast.success('All test cases passed! 🚀');
      } else {
        toast.warning(response.message || 'Some test cases failed.');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit. Please try again.');
    },
  });
 
  return {
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    submitProblem: mutation.mutateAsync,
    // unwrapped convenience fields — data.data is SubmitData
    submitData: mutation.data?.data ?? null,
  };
};