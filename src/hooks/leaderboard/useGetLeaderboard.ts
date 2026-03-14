// src/hooks/leaderboard/useGetLeaderboard.ts
import { useQuery } from '@tanstack/react-query';
import { getLeaderboardRequest } from '@/services/leaderboard.service';
import type { LeaderboardResponse, ApiError } from '@/types/leaderboard.types';

export const useGetLeaderboard = () => {
  const query = useQuery<LeaderboardResponse, ApiError>({
    queryKey: ['leaderboard'],
    queryFn: () => getLeaderboardRequest(),
    staleTime: 2 * 60 * 1000,
  });

  return {
    ...query,
    // response shape: ApiSuccess<LeaderboardData>
    // data.data is LeaderboardData, data.data.data is LeaderboardEntry[]
    leaderboard: query.data?.data?.data ?? [],
    total: query.data?.data?.total ?? 0,
  };
};