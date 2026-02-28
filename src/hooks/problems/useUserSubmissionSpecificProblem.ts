import { useEffect } from 'react';
import { getUserSubmissionSpecificProblemDetails } from '@/services/code.service';
import type {
  ApiErrorResponse,
  GetSubmissionResponse,
} from '@/types/code.types';
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
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(
        query.error?.message || 'Failed to fetch submission details.',
      );
    }
  }, [query.isError, query.error]);

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
