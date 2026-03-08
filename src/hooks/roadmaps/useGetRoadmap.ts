import { useQuery } from '@tanstack/react-query';
import { getRoadmapRequest, type RoadmapWithProgress } from '@/services/roadmap.service';

export const useGetRoadmap = (slug: string) => {
  const query = useQuery<{ message: string; data: RoadmapWithProgress }, { message: string }>({
    queryKey: ['roadmap', slug],
    queryFn: () => getRoadmapRequest(slug),
    staleTime: 1000 * 60 * 5,
    enabled: !!slug,
  });

  return {
    ...query,
    roadmap: query.data?.data ?? null,
  };
};
