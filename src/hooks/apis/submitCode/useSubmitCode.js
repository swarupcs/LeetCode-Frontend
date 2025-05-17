import { submitCode } from '@/apis/submitCode';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useSubmitCode = () => {
  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: submitProblemMutation,
  } = useMutation({
    mutationFn: submitCode,
    onSuccess: (data) => {
      console.log('Successfully submitted problem', data);
      toast.success('Successfully submitted problem.');
    },
    onError: (error) => {
      console.error('Failed to submitted problem', error);
      console.log('error.message', error.message);
      toast.error(
        error.message || 'Failed to submitted problem. Please try again.'
      );
    },
  });
  return {
    isPending,
    isSuccess,
    error,
    submitProblemMutation,
  };
};
