import { getAllDiscussionsRequest } from "@/apis/Discussions/GetAllDiscussions";
import {  useQuery } from "@tanstack/react-query"


export const useGetAllDiscussions = () => {
    const {data, error, isPending, isSuccess, refetch} = useQuery({
        queryKey: ['allDiscussions'],
        queryFn: () => getAllDiscussionsRequest(),
        cacheTime: 0, // No cache
        staleTime: 0, // Always stale
        onSuccess: (data) => {
            console.log('Successfully fetched all discussions', data);
            // toast.success('Successfully fetched all discussions.');
        },
        onError: (error) => {
            console.error('Failed to fetch all discussions', error);
            // toast.error(error?.message || 'Failed to fetch discussions. Please try again.');
        },
    })

    return {
        data,
        isPending,
        isSuccess,
        error,
        refetch, 
    }
}