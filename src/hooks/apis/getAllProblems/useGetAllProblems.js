import { getAllProblemsRequest } from '@/apis/getAllProblems';
import { useMutation } from '@tanstack/react-query';

export const useGetAllProblems = () => {
  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: getAllProblemsMutation,
  } = useMutation({
    mutationFn: getAllProblemsRequest,
    onSuccess: (data) => {
      console.log('Successfully fetched all problems', data);
    },
    onError: (error) => {
      console.error('Failed to fetch all problems', error);
    },
  });

  return {
    isPending,
    isSuccess,
    error,
    getAllProblemsMutation,
  };
};
