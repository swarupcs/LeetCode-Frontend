import { getUSerSolvedStatsRequest } from "@/apis/userStats/getUserSolvedStats";
import { useQuery } from "@tanstack/react-query";


export const useGetUserSolvedStats = () => {

    const { data, error, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['userSolvedStats'],
        queryFn: () => getUSerSolvedStatsRequest(),
        //enabled: false, // Don't fetch on mount
        cacheTime: 0, // No cache
        staleTime: 0, // Always stale
        onSuccess: (data) => {
            console.log('Successfully fetched user solved stats', data);
            // toast.success('Successfully fetched user solved stats.');
        },
        onError: (error) => {
            console.error('Failed to fetch user solved stats', error);
            // toast.error(error?.message || 'Failed to fetch user solved stats. Please try again.');
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