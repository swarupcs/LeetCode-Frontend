import { axiosInstance } from '@/config/axiosConfig';
import type {
  GetAllProblemsPayload,
  GetAllProblemsResponse,
  ApiError,
} from '@/types/problem.types';
import type { AxiosError } from 'axios';

export const getAllProblemsRequest = async (
  payload: GetAllProblemsPayload,
): Promise<GetAllProblemsResponse> => {
  try {
    const { data } = await axiosInstance.post<GetAllProblemsResponse>(
      '/problems/get-all-problems',
      payload,
    );

    return data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};
