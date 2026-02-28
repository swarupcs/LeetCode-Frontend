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
  testCase: number;
  passed: boolean;
  stdout: string; // ← was actualOutput
  expected: string; // ← was expectedOutput
  stderr: string | null;
  compile_output: string | null;
  status: string;
  memory?: string;
  time?: string;
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

export interface SubmissionDetails {
  id: string;
  status: string;
  language: string;
  runtime?: number;
  memory?: number;
  createdAt: string;
}

export interface GetSubmissionResponse {
  success: boolean;
  message: string;
  submissions: SubmissionDetails[];
}
