import { getAllCommentsRequest } from '@/apis/Discussions/getAllComments';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';

export const useGetAllComments = () => {
  const { data, error, isPending, isSuccess, refetch } = useQuery({
    queryKey: ['allComments'],
    queryFn: () => getAllCommentsRequest(),
    cacheTime: 0, // No cache
    staleTime: 0, // Always stale
    onSuccess: (data) => {
      console.log('Successfully fetched all comments', data);
      // toast.success('Successfully fetched all comments.');
    },
    onError: (error) => {
      console.error('Failed to fetch all comments', error);
      // toast.error(error?.message || 'Failed to fetch comments. Please try again.');
    },
  });
  return {
    data,
    isPending,
    isSuccess,
    error,
    refetch,
  };
};
