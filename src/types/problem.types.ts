// src/types/problem.types.ts

// ─── Base API envelope ────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  statusCode: number;
  message: string;
  timestamp: string;
  data: T | null;
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

// ─── Problem ──────────────────────────────────────────────────────────────────

export interface Problem {
  id: string;
  title: string;
  problemNumber: number;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  constraints: string;
  tags: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  hints: string;
  editorial: string;
  companyTags: string[];
  codeSnippets: {
    python?: string;
    javascript?: string;
    java?: string;
  };
  referenceSolutions: Record<string, string>;
  testCases: {
    input: string;
    expected: string;
  }[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  isSolved?: boolean;
}

// ─── Get all problems ─────────────────────────────────────────────────────────

export interface GetAllProblemsPayload {
  userId?: string | null;
}

// backend returns ApiSuccess<Problem[]>
// the array is directly in data, so data.data is Problem[]
export type GetAllProblemsResponse = ApiSuccess<Problem[]>;

// ─── Get single problem ───────────────────────────────────────────────────────

export type GetProblemResponse = ApiSuccess<Problem>;

// ─── Create problem ───────────────────────────────────────────────────────────

export interface CreateProblemPayload {
  problemNumber: number;
  problem: {
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    constraints: string;
    tags: string[];
    hints?: string;
    editorial?: string;
    companyTags?: string[];
    examples: {
      input: string;
      output: string;
      explanation?: string;
    }[];
    codeSnippets: {
      python?: string;
      javascript?: string;
      java?: string;
    };
    referenceSolutions: Record<string, string>;
  };
  testCases: {
    input: string;
    expected: string;
  }[];
}

export type CreateProblemResponse = ApiSuccess<Problem>;

// ─── Update problem ───────────────────────────────────────────────────────────

export interface UpdateProblemPayload {
  problemId: string;
  problemNumber?: number;
  problem?: {
    title?: string;
    description?: string;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    constraints?: string;
    tags?: string[];
    hints?: string;
    editorial?: string;
    companyTags?: string[];
    examples?: {
      input: string;
      output: string;
      explanation?: string;
    }[];
    codeSnippets?: {
      python?: string;
      javascript?: string;
      java?: string;
    };
    referenceSolutions?: Record<string, string>;
  };
}

export type UpdateProblemResponse = ApiSuccess<Problem>;

// ─── Delete problem ───────────────────────────────────────────────────────────

export type DeleteProblemResponse = ApiSuccess<null>;