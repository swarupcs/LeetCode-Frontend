export interface RunCodePayload {
  source_code: string;
  language_id: number;
  problemId: string;
}

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

export interface RunCodeResponse {
  success: boolean;
  results: TestCaseResult[];
  message?: string;
}

export interface ApiError {
  message: string;
}
