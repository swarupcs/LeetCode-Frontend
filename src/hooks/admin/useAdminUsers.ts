// src/hooks/admin/useAdminUsers.ts
import { useQuery } from '@tanstack/react-query';
import { getAdminUsers } from '@/services/admin.service';
import type { AdminUsersData, ApiError } from '@/types/admin.types';

export const ADMIN_USERS_QUERY_KEY = ['adminUsers'] as const;

export const useAdminUsers = () => {
  const query = useQuery<AdminUsersData, ApiError>({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: async (): Promise<AdminUsersData> => {
      const res = await getAdminUsers();
      if (!res.data) throw new Error('No data returned from users API');
      return res.data;
    },
    staleTime: 1000 * 60 * 2, // 2 min
    retry: false,
  });

  return {
    ...query,
    users: query.data?.users ?? [],
    stats: query.data?.stats ?? null,
  };
};
