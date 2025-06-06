import { getUserProgressDataRequest } from "@/apis/userStats/getUserProgressData";
import { useQuery } from "@tanstack/react-query";



export const useGetUserProgressData = () => {


    const { data, error, isPending, isSucess, refetch } = useQuery({
      queryKey: ['userProgressData'],
      queryFn: () => getUserProgressDataRequest(),
      //enabled: false, // Don't fetch on mount
      cacheTime: 0, // No cache
      staleTime: 0, // Always stale
      onSuccess: (data) => {
        console.log('Successfully fetched user progress data', data);
        // toast.success('Successfully fetched user progress data.');
      },
      onError: (error) => {
        console.error('Failed to fetch user progress data', error);
        // toast.error(error?.message || 'Failed to fetch user progress data. Please try again.');
      },
    });
    return {
        data,
        isPending,
        isSucess,
        error,
        refetch, // use this when a new submission is made
    };
}