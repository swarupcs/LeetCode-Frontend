import { useQuery } from '@tanstack/react-query';
import { getAllProblemsRequest } from '@/services/problem.service';
import type { GetAllProblemsResponse, ApiError } from '@/types/problem.types';
 
export const useProblems = (userId?: string | null) => {
  const query = useQuery<GetAllProblemsResponse, ApiError>({
    queryKey: ['problems', userId],
    queryFn: () => getAllProblemsRequest({ userId: userId ?? null }),
    staleTime: 5 * 60 * 1000,
  });
 
  return {
    ...query,
    // backend: ApiSuccess<Problem[]> → data.data is Problem[]
    problems: query.data?.data ?? [],
  };
};