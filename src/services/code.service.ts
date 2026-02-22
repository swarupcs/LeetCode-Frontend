import { axiosInstance } from '@/config/axiosConfig';
import type {
  RunCodePayload,
  RunCodeResponse,
  ApiError,
  SubmitCodePayload,
  SubmitCodeResponse,
  ApiErrorResponse,
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