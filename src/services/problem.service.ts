import { axiosInstance } from '@/config/axiosConfig';
import type {
  GetAllProblemsPayload,
  GetAllProblemsResponse,
  ApiError,
  Problem,
  CreateProblemPayload,
  CreateProblemResponse,
  UpdateProblemPayload,
  UpdateProblemResponse,
  DeleteProblemResponse,
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

export const createProblemRequest = async (
  payload: CreateProblemPayload,
): Promise<CreateProblemResponse> => {
  try {
    const { data } = await axiosInstance.post<CreateProblemResponse>(
      '/problems/create-problem',
      payload,
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    if (error.response?.data) throw error.response.data;
    throw { message: error.message || 'Something went wrong' };
  }
};

export const updateProblemRequest = async (
  payload: UpdateProblemPayload,
): Promise<UpdateProblemResponse> => {
  try {
    const { problemId, ...rest } = payload;
    const { data } = await axiosInstance.put<UpdateProblemResponse>(
      `/problems/update-problem/${problemId}`,
      rest,
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    if (error.response?.data) throw error.response.data;
    throw { message: error.message || 'Something went wrong' };
  }
};

export const deleteProblemRequest = async (
  problemId: string,
): Promise<DeleteProblemResponse> => {
  try {
    const { data } = await axiosInstance.delete<DeleteProblemResponse>(
      `/problems/delete-problem/${problemId}`,
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    if (error.response?.data) throw error.response.data;
    throw { message: error.message || 'Something went wrong' };
  }
};