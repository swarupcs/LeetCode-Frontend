// src/types/code.types.ts
import type { ApiSuccess, ApiError } from './problem.types';
export type { ApiError };

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface RunCodePayload {
  source_code: string;
  language_id: number;
  problemId: string;
}

export interface SubmitCodePayload {
  source_code: string;
  language_id: number;
  problemId: string;
}

// ─── Run code ─────────────────────────────────────────────────────────────────

export interface TestCaseResult {
  testCase: number;
  passed: boolean;
  stdout: string;
  expected: string;
  stderr: string | null;
  compile_output: string | null;
  status: string;
  memory?: string;
  time?: string;
  isPublic?: boolean;
  testCaseId?: string;
}

export interface RunData {
  allPassed: boolean;
  performance: { totalTime: string; totalMemory: string };
  results: TestCaseResult[];
}

// GET /api/v1/code/run → ApiSuccess<RunData>
export type RunCodeResponse = ApiSuccess<RunData>;

// ─── Submit code ──────────────────────────────────────────────────────────────

export interface SubmissionSummary {
  language: string;
  status: string;
  performance: { totalTime: string; totalMemory: string };
  testCasesPassed: string; // e.g. "3/5"
}

export interface SubmitData {
  allPassed: boolean;
  submission: SubmissionSummary;
}

// POST /api/v1/code/submit → ApiSuccess<SubmitData>
export type SubmitCodeResponse = ApiSuccess<SubmitData>;

// ─── Submissions history ──────────────────────────────────────────────────────

export interface ProblemSubmission {
  id: string;
  status: string;
  language: string;
  runtime: string;  // already formatted: "12.34ms"
  memory: string;   // already formatted: "1.23 MB"
  date: string;     // already formatted: "Mar 5, 2026"
}

export interface ProblemSubmissionsData {
  problemId: string;
  problemTitle: string;
  total: number;
  submissions: ProblemSubmission[];
}

// GET /api/v1/submissions/problem/:problemId → ApiSuccess<ProblemSubmissionsData>
export type GetSubmissionResponse = ApiSuccess<ProblemSubmissionsData>;

export interface AllSubmission {
  id: string;
  problemName: string;
  problemId: string;
  problemDifficulty: string;
  tags: string[];
  status: string;
  language: string;
  runtime: string;
  memory: string;
  date: string;
}

export interface AllSubmissionsData {
  submissions: AllSubmission[];
  stats: {
    totalProblemsAvailable: number;
    solvedProblemCount: number;
  };
}

// GET /api/v1/submissions → ApiSuccess<AllSubmissionsData>
export type GetAllSubmissionsResponse = ApiSuccess<AllSubmissionsData>;