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

export interface GetAllProblemsPayload {
  userId?: string | null;
}

export interface GetAllProblemsResponse {
  success: boolean;
  message: string;
  problems: Problem[];
}

export interface ApiError {
  message: string;
}

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

export interface CreateProblemResponse {
  success: boolean;
  message: string;
  problem: Problem;
}

export interface UpdateProblemPayload {
  problemId: string;
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

export interface UpdateProblemResponse {
  success: boolean;
  message: string;
  problem: Problem;
}

export interface DeleteProblemResponse {
  success: boolean;
  message: string;
}