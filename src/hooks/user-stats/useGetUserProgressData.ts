import { useQuery } from '@tanstack/react-query';
import { getUserProgressDataRequest } from '@/services/userStats.service';
import type { UserProgressResponse, ApiError } from '@/types/userStats.types';

export const useGetUserProgressData = () => {
  const query = useQuery<UserProgressResponse, ApiError>({
    queryKey: ['userProgress'],
    queryFn: getUserProgressDataRequest,
    staleTime: 5 * 60 * 1000,
  });
 
  return {
    ...query,
    progressData: query.data?.data ?? null,
  };
};
