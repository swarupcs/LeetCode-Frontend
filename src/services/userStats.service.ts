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
    const { data } = await axiosInstance.get<HeatMapResponse>('/user-stats/heatmap');
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: error.message || 'Something went wrong' };
  }
};
 
export const getUserSolvedStatsRequest = async (): Promise<SolvedStatsResponse> => {
  try {
    const { data } = await axiosInstance.get<SolvedStatsResponse>('/user-stats/solved');
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: error.message || 'Something went wrong' };
  }
};
 
export const getUserProgressDataRequest = async (): Promise<UserProgressResponse> => {
  try {
    const { data } = await axiosInstance.get<UserProgressResponse>('/user-stats/progress');
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: error.message || 'Something went wrong' };
  }
};