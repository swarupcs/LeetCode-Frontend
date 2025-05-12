import { getIndividualProblemsRequest } from '@/apis/getIndividualProblemDetails';
import { useMutation } from '@tanstack/react-query';

export const useGetIndividualProblem = () => {
  const {
    isLoading,
    isSuccess,
    error,
    mutateAsync: getIndividualProblemMutation,
  } = useMutation({
    mutationFn: (problemId) => getIndividualProblemsRequest(problemId),
    onSuccess: (data) => {
      console.log('Successfully fetched individual problem', data);
    },
    onError: (error) => {
      console.error('Error fetching individual problem', error);
    },
  });

  return {
    isLoading,
    isSuccess,
    error,
    getIndividualProblemMutation,
  };
};
