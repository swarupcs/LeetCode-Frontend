// src/types/admin.types.ts
import type { ApiSuccess, ApiError } from './problem.types';
export type { ApiError };

// ─── Daily analytics entry (one per day in the selected range) ────────────────

export interface DailyAnalyticsEntry {
  date: string; // "Mar 5" — used directly as XAxis dataKey
  signups: number;
  active: number; // unique users with ≥1 submission that day
  accepted: number;
  rejected: number;
}

// ─── Summary stats for the selected date window ───────────────────────────────

export interface AnalyticsSummary {
  days: number;
  totalUsers: number;
  newUsersInRange: number;
  userGrowthPct: number;
  avgDailyActive: number;
  totalSubmissions: number;
}

// ─── Problem difficulty breakdown ─────────────────────────────────────────────

export interface AdminProblemStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

// ─── Sheet list item ──────────────────────────────────────────────────────────

export interface AdminSheetItem {
  id: string;
  name: string;
  description: string | null;
  totalProblems: number;
}

// ─── Full dashboard payload (`data` field inside the API envelope) ────────────

export interface AdminDashboardData {
  analytics: DailyAnalyticsEntry[];
  summary: AnalyticsSummary;
  problemStats: AdminProblemStats;
  sheets: AdminSheetItem[];
}

// ─── Typed API response  ──────────────────────────────────────────────────────
// GET /api/v1/admin/dashboard → ApiSuccess<AdminDashboardData>
export type AdminDashboardResponse = ApiSuccess<AdminDashboardData>;

// ─── Users types ──────────────────────────────────────────────────────────────

export interface AdminUserEntry {
  id: string;
  displayName: string;
  username: string;
  email: string;
  initials: string;
  role: 'ADMIN' | 'USER';
  image: string | null;
  totalSolved: number;
  currentStreak: number;
  acceptanceRate: number; // 0–100
  rank: number;
  lastActive: string | null; // "Mar 5, 2026" or null
}

export interface AdminUsersData {
  users: AdminUserEntry[];
  stats: {
    total: number;
    totalSolved: number;
  };
}

// GET /api/v1/admin/users → ApiSuccess<AdminUsersData>
export type AdminUsersResponse = ApiSuccess<AdminUsersData>;

// ─── User Detail types ────────────────────────────────────────────────────────

export interface AdminUserTopTopic {
  topic: string;
  solved: number;
  total: number;
}

export interface AdminUserRecentSubmission {
  problem: string;
  problemId: string;
  status: string;
  language: string;
  runtime: string;
  date: string;
}

export interface AdminUserDetail {
  // Identity
  id: string;
  displayName: string;
  username: string;
  email: string;
  initials: string;
  image: string | null;
  role: 'ADMIN' | 'USER';
  joinDate: string;
  lastActive: string | null;

  // Stats
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  acceptanceRate: number;
  currentStreak: number;
  maxStreak: number;
  rank: number;

  // Platform totals for progress bars
  difficultyTotals: { easy: number; medium: number; hard: number };

  // Topic skills
  topTopics: AdminUserTopTopic[];

  // Recent activity
  recentSubmissions: AdminUserRecentSubmission[];
}

// GET /api/v1/admin/users/:userId → ApiSuccess<AdminUserDetail>
export type AdminUserDetailResponse = ApiSuccess<AdminUserDetail>;

// PATCH /api/v1/admin/users/:userId/role
export interface UpdateUserRolePayload {
  role: 'ADMIN' | 'USER';
}

export interface UpdateUserRoleData {
  id: string;
  role: string;
}

// PATCH /api/v1/admin/users/:userId/role → ApiSuccess<UpdateUserRoleData>
export type UpdateUserRoleResponse = ApiSuccess<UpdateUserRoleData>;
