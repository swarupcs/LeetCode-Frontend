import { getUserHeatMapDataRequest } from '@/apis/userStats/getUserHeatMapData';
import { useQuery, useQueryClient } from '@tanstack/react-query';


export const useGetUserHeatMapData = () => {
    const queryClient = useQueryClient();

    const { data, error, isPending, isSuccess, refetch } = useQuery({
      queryKey: ['userHeatMapData'],
      queryFn: () => getUserHeatMapDataRequest(),
      //enabled: false, // Don't fetch on mount
      cacheTime: 0, // No cache
      staleTime: 0, // Always stale
      onSuccess: (data) => {
        console.log('Successfully fetched user heatmap data', data);
        // toast.success('Successfully fetched user heatmap data.');
      },
      onError: (error) => {
        console.error('Failed to fetch user heatmap data', error);
        // toast.error(error?.message || 'Failed to fetch user heatmap data. Please try again.');
      },
    });
    return {
        data,
        isPending,
        isSuccess,
        error,
        refetch, // use this when a new submission is made
    };


}