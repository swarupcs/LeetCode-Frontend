import { updateProblemDetails } from '@/apis/updateProblemDetails';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateProblemDetails = () => {
  const {
    isLoading,
    isSuccess,
    error,
    mutateAsync: updateProblemMutation,
  } = useMutation({
    mutationFn: updateProblemDetails,
    onSuccess: (data) => {
      console.log('Successfully updated problem', data);
      toast.success('Successfully updated problem.');
    },
    onError: (error) => {
      console.error('Failed to update problem', error);
      console.log('error.message', error.message);
      toast.error(
        error.message || 'Failed to update problem. Please try again.'
      );
    },
  });

  return {
    isLoading,
    isSuccess,
    error,
    updateProblemMutation,
  };
};
