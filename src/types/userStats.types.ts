export interface ApiSuccess<T> {
  success: true;
  statusCode: number;
  message: string;
  timestamp: string;
  data: T;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: null;
  errors: Array<{ field: string; message: string }> | null;
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────

export interface HeatMapEntry {
  date: string;
  count: number;
}

export type HeatMapResponse = ApiSuccess<{ heatmap: HeatMapEntry[] }>;

// ─── Solved stats ─────────────────────────────────────────────────────────────

export interface DifficultyStats {
  EASY: number;
  MEDIUM: number;
  HARD: number;
}

export interface SolvedStats {
  difficultyStats: DifficultyStats;
  tagStats: Record<string, number>;
  totalDifficultyCounts: DifficultyStats;
  totalTagCounts: Record<string, number>;
  currentStreak: number;
  maxStreak: number;
  totalSubmissions: number;
  acceptanceRate: number;
}

export type SolvedStatsResponse = ApiSuccess<SolvedStats>;

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface WeeklyDay {
  date: string;
  day: string;
  problems: number;
}

export interface MonthlyEntry {
  month: string;
  solved: number;
  submissions: number;
}

export interface LanguageStat {
  language: string;
  count: number;
  percentage: number;
}

export interface RecentSubmission {
  problem: string;
  problemId: string;
  difficulty: string;
  status: string;
  language: string;
  time: string;
  memory: string;
  date: string;
}

export interface ProgressData {
  weeklyData: WeeklyDay[];
  monthlyTrend: MonthlyEntry[];
  languageStats: LanguageStat[];
  recentSubmissions: RecentSubmission[];
}

export type UserProgressResponse = ApiSuccess<ProgressData>;