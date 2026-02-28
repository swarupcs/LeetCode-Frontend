// ─── hooks/useGetLeaderboard.ts ───────────────────────────────────────────────
import { useQuery } from '@tanstack/react-query';
import { getLeaderboardRequest } from '@/services/leaderboard.service';
import type { LeaderboardResponse, ApiError } from '@/types/leaderboard.types';

export const useGetLeaderboard = () => {
  const query = useQuery<LeaderboardResponse, ApiError>({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboardRequest,
    staleTime: 2 * 60 * 1000, // 2 min — leaderboard changes more often
  });

  return {
    ...query,
    leaderboard: query.data?.data ?? [],
  };
};
