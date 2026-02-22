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

export interface SubmitCodeResponse {
  success: boolean;
  allPassedFlag: boolean;
  message: string;
  submission: {
    language: string;
    status: string;
    performance: {
      totalTime: string;
      totalMemory: string;
    };
    testCasesPassed: string; // "3/3"
  };
}

export interface ApiError {
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  success?: boolean;
}