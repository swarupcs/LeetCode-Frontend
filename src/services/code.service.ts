import { axiosInstance } from '@/config/axiosConfig';
import type {
  RunCodePayload,
  RunCodeResponse,
  ApiError,
  SubmitCodePayload,
  SubmitCodeResponse,
  ApiErrorResponse,
  GetSubmissionResponse,
} from '@/types/code.types';
import type { AxiosError } from 'axios';

export const runCodeRequest = async (
  payload: RunCodePayload,
): Promise<RunCodeResponse> => {
  try {
    const { data } = await axiosInstance.post<RunCodeResponse>(
      '/codeExecutor/runCode',
      payload,
    );

    return data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};

export const submitCode = async (
  payload: SubmitCodePayload,
): Promise<SubmitCodeResponse> => {
  try {
    const { data } = await axiosInstance.post<SubmitCodeResponse>(
      '/codeExecutor/submitCode',
      payload,
    );

    return data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;

    // If backend sends structured error
    if (error.response?.data) {
      throw error.response.data;
    }

    // Network / unexpected error
    throw {
      message: error.message || 'Something went wrong',
    };
  }
};

export const getUserSubmissionSpecificProblemDetails = async (
  problemId: string,
): Promise<GetSubmissionResponse> => {
  if (!problemId) {
    throw { message: 'Problem ID is required' };
  }

  try {
    const { data } = await axiosInstance.get<GetSubmissionResponse>(
      `/submission/getUserSubmissionsForSpecificProblem/${problemId}`,
    );

    return data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;

    if (error.response?.data) {
      throw error.response.data;
    }

    throw {
      message: error.message || 'Something went wrong',
    };
  }
};