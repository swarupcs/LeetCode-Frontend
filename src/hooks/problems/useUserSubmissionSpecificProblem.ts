import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getUserSubmissionSpecificProblemDetails } from '@/services/code.service';
import type { GetSubmissionResponse, ApiError } from '@/types/code.types';
 
export const useUserSubmissionSpecificProblem = (
  problemId: string,
  isAuthenticated: boolean,
) => {
  const query = useQuery<GetSubmissionResponse, ApiError>({
    queryKey: ['submissionDetails', problemId],
    queryFn: () => getUserSubmissionSpecificProblemDetails(problemId),
    enabled: !!problemId && isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
 
  useEffect(() => {
    if (query.isError && query.error) {
      toast.error(query.error.message || 'Failed to fetch submission details.');
    }
  }, [query.isError, query.error]);
 
  return {
    // data.data is ProblemSubmissionsData
    submissions: query.data?.data?.submissions ?? [],
    problemTitle: query.data?.data?.problemTitle ?? '',
    total: query.data?.data?.total ?? 0,
    isPending: query.isPending,
    isSuccess: query.isSuccess,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};