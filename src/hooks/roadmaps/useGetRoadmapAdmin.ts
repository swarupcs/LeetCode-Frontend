import { useQuery } from '@tanstack/react-query';
import { getRoadmapAdminRequest, type RoadmapWithProgress } from '@/services/roadmap.service';

export const useGetRoadmapAdmin = (id: string) => {
  const query = useQuery<{ message: string; data: RoadmapWithProgress }, { message: string }>({
    queryKey: ['roadmapAdmin', id],
    queryFn: () => getRoadmapAdminRequest(id),
    staleTime: 1000 * 60 * 2,
    enabled: !!id,
  });

  return {
    ...query,
    roadmap: query.data?.data ?? null,
  };
};
