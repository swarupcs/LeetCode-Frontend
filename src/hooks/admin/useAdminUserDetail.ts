// src/hooks/admin/useAdminUserDetail.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminUserDetail, updateUserRole } from '@/services/admin.service';
import type { AdminUserDetail, ApiError } from '@/types/admin.types';
import { ADMIN_USERS_QUERY_KEY } from './useAdminUsers';

export const adminUserDetailKey = (userId: string) =>
  ['adminUserDetail', userId] as const;

// ─── Fetch hook ───────────────────────────────────────────────────────────────

export const useAdminUserDetail = (userId: string) => {
  const query = useQuery<AdminUserDetail, ApiError>({
    queryKey: adminUserDetailKey(userId),
    queryFn: async (): Promise<AdminUserDetail> => {
      const res = await getAdminUserDetail(userId);
      if (!res.data) throw new Error('No data returned');
      return res.data;
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 2,
    retry: false,
  });

  return {
    ...query,
    user: query.data ?? null,
  };
};

// ─── Role mutation hook ───────────────────────────────────────────────────────

export const useUpdateUserRole = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (role: 'ADMIN' | 'USER') => updateUserRole(userId, { role }),
    onSuccess: () => {
      // Refetch this user's detail + invalidate the users list
      void queryClient.invalidateQueries({
        queryKey: adminUserDetailKey(userId),
      });
      void queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
    },
  });
};
