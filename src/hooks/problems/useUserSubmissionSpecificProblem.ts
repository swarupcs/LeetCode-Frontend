import { getUserSubmissionSpecificProblemDetails } from '@/services/code.service';
import type { ApiErrorResponse, GetSubmissionResponse } from '@/types/code.types';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';


export const useUserSubmissionSpecificProblem = (
  problemId: string,
  isAuthenticated: boolean,
) => {
  const query = useQuery<GetSubmissionResponse, ApiErrorResponse>({
    queryKey: ['submissionDetails', problemId],

    queryFn: () => getUserSubmissionSpecificProblemDetails(problemId),

    enabled: Boolean(problemId) && isAuthenticated,

    staleTime: 1000 * 60 * 5, // 5 minutes (better than Infinity)

    onSuccess: (data) => {
      console.log('Successfully fetched submission details', data);
    },

    onError: (error) => {
      console.error('Failed to fetch submission details', error);

      toast.error(error?.message || 'Failed to fetch submission details.');
    },
  });

  return {
    submissions: query.data?.submissions ?? [],
    data: query.data,
    isPending: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
