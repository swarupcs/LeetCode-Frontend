import { useQuery } from '@tanstack/react-query';
import { getAllRoadmapsRequest, type RoadmapWithProgress } from '@/services/roadmap.service';

export const useGetRoadmaps = () => {
  const query = useQuery<{ message: string; data: RoadmapWithProgress[] }, { message: string }>({
    queryKey: ['roadmaps'],
    queryFn: getAllRoadmapsRequest,
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    roadmaps: query.data?.data ?? [],
  };
};
