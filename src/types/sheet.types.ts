export interface Sheet {
  _id: string;
  title: string;
  description: string;
  totalProblems: number;
  solvedProblems: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllSheetDetailsResponse {
  sheets: Sheet[];
  message?: string;
}

export interface CreateSheetPayload {
  name: string;
  description: string;
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