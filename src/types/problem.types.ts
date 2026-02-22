export interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  solved?: boolean;
}

export interface GetAllProblemsPayload {
  userId?: string | null;
}

export interface GetAllProblemsResponse {
  problems: Problem[];
}

export interface ApiError {
  message: string;
}
