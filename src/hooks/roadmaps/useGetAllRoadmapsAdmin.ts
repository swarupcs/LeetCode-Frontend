import { useQuery } from '@tanstack/react-query';
import { getAllRoadmapsAdminRequest, type RoadmapWithProgress } from '@/services/roadmap.service';

export const useGetAllRoadmapsAdmin = () => {
  const query = useQuery<{ message: string; data: RoadmapWithProgress[] }, { message: string }>({
    queryKey: ['roadmapsAdmin'],
    queryFn: getAllRoadmapsAdminRequest,
    staleTime: 1000 * 60 * 2,
  });

  return {
    ...query,
    roadmaps: query.data?.data ?? [],
  };
};
