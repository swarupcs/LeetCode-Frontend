import { getLeaderBoardDataRequest } from "@/apis/Leaderboard/getLeaderBoardData";
import { useQuery } from "@tanstack/react-query";


export const useGetLeaderBoardData = () => {
    const { isPending, isSuccess, error, data: leaderBoardData } = useQuery({
        queryKey: ['leaderBoardData'],
        queryFn: getLeaderBoardDataRequest,
        cacheTime: 0, // No cache
        staleTime: 0, // Always stale   
        onSuccess: (data) => {
            console.log('Successfully fetched leaderboard data', data);
            // toast.success('Leaderboard data fetched successfully.');
        },
        onError: (error) => {
            console.error('Failed to fetch leaderboard data', error);
            // toast.error(error?.message || 'Failed to fetch leaderboard data. Please try again.');
        },
    });
    return {
        isPending,
        isSuccess,
        error,
        leaderBoardData,
    };


}