import { axiosInstance } from '@/config/axiosConfig';
import type { AxiosError } from 'axios';
import type {
  HeatMapResponse,
  SolvedStatsResponse,
  UserProgressResponse,
  ApiError,
} from '@/types/userStats.types';

export const getUserHeatMapDataRequest = async (): Promise<HeatMapResponse> => {
  try {
    const { data } = await axiosInstance.get<HeatMapResponse>(
      '/userStats/getUserHeatMapData',
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    if (error.response?.data) throw error.response.data;
    throw { message: error.message || 'Something went wrong' };
  }
};

export const getUserSolvedStatsRequest =
  async (): Promise<SolvedStatsResponse> => {
    try {
      const { data } = await axiosInstance.get<SolvedStatsResponse>(
        '/userStats/getUserSolvedStats',
      );
      return data;
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      if (error.response?.data) throw error.response.data;
      throw { message: error.message || 'Something went wrong' };
    }
  };

export const getUserProgressDataRequest =
  async (): Promise<UserProgressResponse> => {
    try {
      const { data } = await axiosInstance.get<UserProgressResponse>(
        '/userStats/getUserProgress',
      );
      return data;
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      if (error.response?.data) throw error.response.data;
      throw { message: error.message || 'Something went wrong' };
    }
  };
