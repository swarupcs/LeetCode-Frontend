// src/services/admin.service.ts
import type { AxiosError } from 'axios';
import type { AdminDashboardResponse, ApiError } from '@/types/admin.types';
import { axiosInstance } from '@/config/axiosConfig';

/**
 * GET /api/v1/admin/dashboard
 *
 * Query params (both optional — backend defaults to last 30 days):
 *   from  – "YYYY-MM-DD"
 *   to    – "YYYY-MM-DD"
 */
export const getAdminDashboard = async (
  from?: Date,
  to?: Date,
): Promise<AdminDashboardResponse> => {
  try {
    const params: Record<string, string> = {};
    if (from) params['from'] = from.toISOString().split('T')[0]!; // "YYYY-MM-DD"
    if (to) params['to'] = to.toISOString().split('T')[0]!;

    const { data } = await axiosInstance.get<AdminDashboardResponse>(
      '/admin/dashboard',
      { params },
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};
