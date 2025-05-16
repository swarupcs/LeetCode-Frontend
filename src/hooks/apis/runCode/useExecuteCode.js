
import { runCode } from '@/apis/runCode';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';



export const useExecuteProblem = () => {
  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: runProblemMutation,
  } = useMutation({
    mutationFn: runCode,
    onSuccess: (data) => {
      console.log('Successfully executed problem', data);
      toast.success('Successfully executed problem.');
    },
    onError: (error) => {
      console.error('Failed to executed problem', error);
      console.log('error.message', error.message);
      toast.error(
        error.message || 'Failed to executed problem. Please try again.'
      );
    },
  });
  return {
    isPending,
    isSuccess,
    error,
    runProblemMutation,
  };
};
