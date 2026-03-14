import { useQuery } from '@tanstack/react-query';
import { getRoadmapAdminRequest } from '@/services/roadmap.service';
import type { GetRoadmapAdminResponse, ApiError } from '@/types/roadmap.types';
 
export const useGetRoadmapAdmin = (id: string) => {
  const query = useQuery<GetRoadmapAdminResponse, ApiError>({
    queryKey: ['roadmapAdmin', id],
    queryFn: () => getRoadmapAdminRequest(id),
    staleTime: 2 * 60 * 1000,
    enabled: !!id,
  });
 
  return {
    ...query,
    roadmap: query.data?.data ?? null,
  };
};
 