// ─── services/leaderboard.service.ts ─────────────────────────────────────────
import { axiosInstance } from '@/config/axiosConfig';
import type { AxiosError } from 'axios';
import type { LeaderboardResponse, ApiError } from '@/types/leaderboard.types';

export const getLeaderboardRequest = async (): Promise<LeaderboardResponse> => {
  try {
    const { data } = await axiosInstance.get<LeaderboardResponse>(
      '/leaderboard/getLeaderboard',
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    if (error.response?.data) throw error.response.data;
    throw { message: error.message || 'Something went wrong' };
  }
};


