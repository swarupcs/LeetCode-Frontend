export interface Problem {
  id: string;
  title: string;
  problemNumber: number;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  constraints: string; // string, not array
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
  // from the problems list endpoint
  isSolved?: boolean;
}

export interface ApiError {
  message: string;
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
