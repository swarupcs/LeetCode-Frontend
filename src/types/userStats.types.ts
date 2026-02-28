export interface HeatMapEntry {
  date: string;
  count: number;
}

export interface HeatMapResponse {
  success: boolean;
  message: string;
  heatmap: HeatMapEntry[]; // ← 'heatmap' not 'data'
}

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

export interface SolvedStatsResponse {
  success: boolean;
  message: string;
  data: SolvedStats;
}

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

export interface UserProgressResponse {
  success: boolean;
  message: string;
  data: ProgressData;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
