export interface Sheet {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: SheetUser;
  problems: string[];
  totalProblems: number;
  allTags: string[];
  allDifficulties: string[];
}

export interface SheetProblem {
  id: string;
  title: string;
  problemNumber: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  tags: string[];
  isSolved?: boolean;
}

export interface SheetProblemInSheet {
  id: string;
  sheetId: string;
  problemId: string;
  createdAt: string;
  updatedAt: string;
  problem: SheetProblem;
}

export interface GetAllSheetDetailsResponse {
  sdeSheets: Sheet[];
  message?: string;
}

export interface CreateSheetResponse {
  sheet: Sheet;
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface SheetTopic {
  name: string;
  problemIds: string[];
}

export interface SheetUser {
  id: string;
  name: string;
  username: string;
  image: string;
}

export interface CreateSheetPayload {
  name: string;
  description: string;
  topics: SheetTopic[];
}

export interface SheetDetail {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: SheetUser;
  problems: SheetProblemInSheet[];
  totalProblems: number;
  allTags: string[];
  allDifficulties: string[];
}

export interface GetSheetByIdResponse {
  success: boolean;
  message: string;
  sdeSheet: SheetDetail;
}