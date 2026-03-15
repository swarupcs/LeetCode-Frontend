// src/hooks/admin/useAdminDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { getAdminDashboard } from '@/services/admin.service';
import type { AdminDashboardData, ApiError } from '@/types/admin.types';

export const ADMIN_DASHBOARD_QUERY_KEY = (from?: Date, to?: Date) =>
  [
    'adminDashboard',
    from?.toISOString().split('T')[0],
    to?.toISOString().split('T')[0],
  ] as const;

/**
 * Fetches admin dashboard data for the given date range.
 * Automatically re-fetches whenever `from` or `to` changes.
 *
 * @param from    – start of range (inclusive), undefined → backend default (30d ago)
 * @param to      – end of range (inclusive),   undefined → backend default (today)
 * @param enabled – pass false to pause fetching while the user is mid-picking a range
 */
export const useAdminDashboard = (from?: Date, to?: Date, enabled = true) => {
  const query = useQuery<AdminDashboardData, ApiError>({
    queryKey: ADMIN_DASHBOARD_QUERY_KEY(from, to),
    queryFn: async (): Promise<AdminDashboardData> => {
      const res = await getAdminDashboard(from, to);
      // res.data is typed as AdminDashboardData | null by ApiSuccess<T>,
      // but this endpoint always returns data — throw if somehow missing
      if (!res.data) throw new Error('No data returned from dashboard API');
      return res.data;
    },
    enabled,
    // Keep previous range data visible while the new range loads (no flash to skeleton)
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5, // 5 min — analytics don't need real-time freshness
    retry: false,
  });

  return {
    ...query,
    // Convenience destructures so the page never has to write `query.data?.analytics`
    analytics: query.data?.analytics ?? [],
    summary: query.data?.summary ?? null,
    problemStats: query.data?.problemStats ?? null,
    sheets: query.data?.sheets ?? [],
  };
};
