import { useQuery } from '@tanstack/react-query';
import { getAllRoadmapsRequest } from '@/services/roadmap.service';
import type { GetAllRoadmapsResponse, ApiError } from '@/types/roadmap.types';
 
export const useGetRoadmaps = () => {
  const query = useQuery<GetAllRoadmapsResponse, ApiError>({
    queryKey: ['roadmaps'],
    queryFn: getAllRoadmapsRequest,
    staleTime: 5 * 60 * 1000,
  });
 
  return {
    ...query,
    roadmaps: query.data?.data ?? [],
  };
};