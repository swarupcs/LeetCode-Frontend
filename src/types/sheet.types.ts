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

