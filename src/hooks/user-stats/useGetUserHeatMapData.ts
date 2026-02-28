import { useQuery } from '@tanstack/react-query';
import { getUserHeatMapDataRequest } from '@/services/userStats.service';
import type { HeatMapResponse, ApiError } from '@/types/userStats.types';

export const useGetUserHeatMapData = () => {
  const query = useQuery<HeatMapResponse, ApiError>({
    queryKey: ['userHeatMap'],
    queryFn: getUserHeatMapDataRequest,
    staleTime: 5 * 60 * 1000,
  });

  return {
    ...query,
    heatMapData: query.data?.heatmap ?? [],
  };
};
