import { useQuery } from '@tanstack/react-query';
import { getAllProblemsRequest } from '@/services/problem.service';

import type { GetAllProblemsResponse, ApiError } from '@/types/problem.types';

export const useProblems = (userId?: string | null) => {
  const query = useQuery<GetAllProblemsResponse, ApiError>({
    queryKey: ['problems', userId],
    queryFn: () =>
      getAllProblemsRequest({
        userId: userId ?? null,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  return {
    ...query,
    problems: query.data?.problems ?? [],
  };
};
