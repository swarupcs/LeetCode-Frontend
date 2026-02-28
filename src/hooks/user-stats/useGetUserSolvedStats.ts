import { useQuery } from '@tanstack/react-query';
import { getUserSolvedStatsRequest } from '@/services/userStats.service';
import type { SolvedStatsResponse, ApiError } from '@/types/userStats.types';

export const useGetUserSolvedStats = () => {
  const query = useQuery<SolvedStatsResponse, ApiError>({
    queryKey: ['userSolvedStats'],
    queryFn: getUserSolvedStatsRequest,
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    solvedStats: query.data?.data ?? null,
  };
};
