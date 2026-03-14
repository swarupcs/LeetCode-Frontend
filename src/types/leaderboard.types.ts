// src/types/leaderboard.types.ts
import type { ApiSuccess, ApiError } from './problem.types';
export type { ApiError };

export interface LeaderboardEntry {
  rank: number;
  username: string;
  name: string;
  image: string | null;
  solved: number;
  streak: number;
  score: number;
}

// The service wraps LeaderboardResponse in ApiSuccess:
// GET /api/v1/leaderboard → ApiSuccess<LeaderboardData>
export interface LeaderboardData {
  data: LeaderboardEntry[];
  total: number;
  limit: number;
  offset: number;
}

export type LeaderboardResponse = ApiSuccess<LeaderboardData>;