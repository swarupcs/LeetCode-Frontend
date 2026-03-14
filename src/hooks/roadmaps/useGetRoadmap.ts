import { useQuery } from '@tanstack/react-query';
import { getRoadmapRequest } from '@/services/roadmap.service';
import type { GetRoadmapResponse, ApiError } from '@/types/roadmap.types';
 
export const useGetRoadmap = (slug: string) => {
  const query = useQuery<GetRoadmapResponse, ApiError>({
    queryKey: ['roadmap', slug],
    queryFn: () => getRoadmapRequest(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });
 
  return {
    ...query,
    roadmap: query.data?.data ?? null,
  };
};