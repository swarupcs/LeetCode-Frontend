import { axiosInstance } from '@/config/axiosConfig';
import type {
  GetAllProblemsPayload,
  GetAllProblemsResponse,
  ApiError,
  Problem,
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

export const getIndividualProblemRequest = async (
  problemId: string,
): Promise<Problem> => {
  try {
    const { data } = await axiosInstance.get<{
      success: boolean;
      message: string;
      problem: Problem;
    }>(`/problems/get-problem/${problemId}`);

    return data.problem; // ← the only change from your current code
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};