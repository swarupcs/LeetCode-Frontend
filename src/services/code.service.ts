// src/services/code.service.ts
import { axiosInstance } from '@/config/axiosConfig';
import type { AxiosError } from 'axios';
import type {
  RunCodePayload,
  RunCodeResponse,
  SubmitCodePayload,
  SubmitCodeResponse,
  GetSubmissionResponse,
  ApiError,
} from '@/types/code.types';

// POST /api/v1/code/run
export const runCodeRequest = async (
  payload: RunCodePayload,
): Promise<RunCodeResponse> => {
  try {
    const { data } = await axiosInstance.post<RunCodeResponse>('/code/run', payload);
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: 'Something went wrong' };
  }
};

// POST /api/v1/code/submit
export const submitCode = async (
  payload: SubmitCodePayload,
): Promise<SubmitCodeResponse> => {
  try {
    const { data } = await axiosInstance.post<SubmitCodeResponse>('/code/submit', payload);
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: 'Something went wrong' };
  }
};

// GET /api/v1/submissions/problem/:problemId
export const getUserSubmissionSpecificProblemDetails = async (
  problemId: string,
): Promise<GetSubmissionResponse> => {
  try {
    const { data } = await axiosInstance.get<GetSubmissionResponse>(
      `/submissions/problem/${problemId}`,
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: 'Something went wrong' };
  }
};