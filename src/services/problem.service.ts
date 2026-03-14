// src/services/problem.service.ts
import { axiosInstance } from '@/config/axiosConfig';
import type { AxiosError } from 'axios';
import type {
  GetAllProblemsPayload,
  GetAllProblemsResponse,
  GetProblemResponse,
  CreateProblemPayload,
  CreateProblemResponse,
  UpdateProblemPayload,
  UpdateProblemResponse,
  DeleteProblemResponse,
  Problem,
  ApiError,
} from '@/types/problem.types';

// ─── GET /api/v1/problems/all ─────────────────────────────────────────────────

export const getAllProblemsRequest = async (
  payload: GetAllProblemsPayload,
): Promise<GetAllProblemsResponse> => {
  try {
    const { data } = await axiosInstance.post<GetAllProblemsResponse>(
      '/problems/all',
      payload,
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: 'Something went wrong' };
  }
};

// ─── GET /api/v1/problems/:id ─────────────────────────────────────────────────

export const getIndividualProblemRequest = async (
  problemId: string,
): Promise<Problem> => {
  try {
    const { data } = await axiosInstance.get<GetProblemResponse>(
      `/problems/${problemId}`,
    );
    // data.data is the Problem, unwrap it for the hook
    return data.data!;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: 'Something went wrong' };
  }
};

// ─── POST /api/v1/problems ────────────────────────────────────────────────────

export const createProblemRequest = async (
  payload: CreateProblemPayload,
): Promise<CreateProblemResponse> => {
  try {
    const { data } = await axiosInstance.post<CreateProblemResponse>(
      '/problems',
      payload,
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: 'Something went wrong' };
  }
};

// ─── PUT /api/v1/problems/:id ─────────────────────────────────────────────────

export const updateProblemRequest = async (
  payload: UpdateProblemPayload,
): Promise<UpdateProblemResponse> => {
  try {
    const { problemId, ...rest } = payload;
    const { data } = await axiosInstance.put<UpdateProblemResponse>(
      `/problems/${problemId}`,
      rest,
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: 'Something went wrong' };
  }
};

// ─── DELETE /api/v1/problems/:id ──────────────────────────────────────────────

export const deleteProblemRequest = async (
  problemId: string,
): Promise<DeleteProblemResponse> => {
  try {
    const { data } = await axiosInstance.delete<DeleteProblemResponse>(
      `/problems/${problemId}`,
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: 'Something went wrong' };
  }
};