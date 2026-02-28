// ─── types/leaderboard.types.ts ───────────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  username: string;
  name: string;
  image: string | null;
  solved: number;
  streak: number;
  score: number;
}

export interface LeaderboardResponse {
  success: boolean;
  message: string;
  data: LeaderboardEntry[];
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
