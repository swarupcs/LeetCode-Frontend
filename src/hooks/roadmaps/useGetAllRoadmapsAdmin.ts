import { useQuery } from '@tanstack/react-query';
import { getAllRoadmapsAdminRequest } from '@/services/roadmap.service';
import type { GetAllRoadmapsAdminResponse, ApiError } from '@/types/roadmap.types';
 
export const useGetAllRoadmapsAdmin = () => {
  const query = useQuery<GetAllRoadmapsAdminResponse, ApiError>({
    queryKey: ['roadmapsAdmin'],
    queryFn: getAllRoadmapsAdminRequest,
    staleTime: 2 * 60 * 1000,
  });
 
  return {
    ...query,
    roadmaps: query.data?.data ?? [],
  };
};