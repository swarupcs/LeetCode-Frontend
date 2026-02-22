import { axiosInstance } from '@/config/axiosConfig';
import type {
  RunCodePayload,
  RunCodeResponse,
  ApiError,
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
