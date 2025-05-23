import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getUserSubmissionSpecificProblemDetails } from '@/apis/getUserSubmissionSpecificProblemDetails';

export const useUserSubmissionSpecificProblem = (problemId, isAuthenticated) => {
  const queryClient = useQueryClient();

  const { data, error, isPending, isSuccess, refetch } = useQuery({
    queryKey: ['submissionDetails', problemId],
    queryFn: () => getUserSubmissionSpecificProblemDetails(problemId),
    enabled: !!problemId && isAuthenticated, // only fetch if problemId is available
    staleTime: Infinity, // cache forever until invalidated
    onSuccess: (data) => {
      console.log('Successfully fetched submission details', data);
      // toast.success('Successfully fetched submission details.');
    },
    onError: (error) => {
      console.error('Failed to fetch submission details', error);
      // toast.error(
      //   error?.message ||
      //     'Failed to fetch submission details. Please try again.'
      // );
    },
  });

  return {
    data,
    isPending,
    isSuccess,
    error,
    refetch, // use this when a new submission is made
  };
};
