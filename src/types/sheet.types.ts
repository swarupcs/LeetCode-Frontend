// src/types/sheet.types.ts
import type { ApiSuccess, ApiError } from './problem.types';
export type { ApiError };

// ─── Sub-shapes ───────────────────────────────────────────────────────────────

export interface SheetUser {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
}

export interface SheetProblem {
  id: string;
  title: string;
  problemNumber: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  companyTags?: string[];
  isSolved?: boolean;
}

export interface SheetProblemInSheet {
  sheetId: string;
  problemId: string;
  createdAt: string;
  updatedAt: string;
  problem: SheetProblem;
}

// ─── Sheet (list view — from GET /api/v1/sheets) ──────────────────────────────
// Backend enriches each sheet with totalProblems, allTags, allDifficulties
// but problems[] is the raw ProblemInSheet rows (not needed in list view)

export interface Sheet {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: SheetUser;
  problems: SheetProblemInSheet[];
  totalProblems: number;
  allTags: string[];
  allDifficulties: string[];
}

// ─── Sheet detail (from GET /api/v1/sheets/:id) ───────────────────────────────
// Same shape but problems includes isSolved per authenticated user

export type SheetDetail = Sheet; // same shape, isSolved populated per problem

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface SheetTopic {
  name: string;
  problemIds: string[];
}

export interface CreateSheetPayload {
  name: string;
  description?: string;
  topics: SheetTopic[];
}

export interface UpdateSheetPayload {
  name: string;
  description?: string;
  topics: SheetTopic[];
}

// ─── Responses (all wrapped in ApiSuccess<T>) ─────────────────────────────────

// GET  /api/v1/sheets         → ApiSuccess<Sheet[]>
export type GetAllSheetsResponse = ApiSuccess<Sheet[]>;

// GET  /api/v1/sheets/:id     → ApiSuccess<SheetDetail>
export type GetSheetByIdResponse = ApiSuccess<SheetDetail>;

// POST /api/v1/sheets         → ApiSuccess<Sheet> (201)
export type CreateSheetResponse = ApiSuccess<Sheet>;

// PUT  /api/v1/sheets/:id     → ApiSuccess<Sheet>
export type UpdateSheetResponse = ApiSuccess<Sheet>;

// DELETE /api/v1/sheets/:id   → ApiSuccess<null>
export type DeleteSheetResponse = ApiSuccess<null>;