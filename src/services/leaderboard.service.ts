// src/services/leaderboard.service.ts
import { axiosInstance } from '@/config/axiosConfig';
import type { AxiosError } from 'axios';
import type { LeaderboardResponse, ApiError } from '@/types/leaderboard.types';

// GET /api/v1/leaderboard?limit=50&offset=0
export const getLeaderboardRequest = async (
  limit = 50,
  offset = 0,
): Promise<LeaderboardResponse> => {
  try {
    const { data } = await axiosInstance.get<LeaderboardResponse>(
      `/leaderboard?limit=${limit}&offset=${offset}`,
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: error.message || 'Something went wrong' };
  }
};