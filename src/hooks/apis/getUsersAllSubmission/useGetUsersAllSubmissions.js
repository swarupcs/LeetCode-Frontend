import { useMutation } from '@tanstack/react-query';
import { getUserAllSubmissions } from '@/apis/getUserSubmissions';

export const useGetUsersAllSubmissions = () => {
  const {
    isLoading,
    isSuccess,
    error,
    mutateAsync: getUserAllSubmissionsMutation,
  } = useMutation({
    mutationFn: () => getUserAllSubmissions(),
    onSuccess: (data) => {
      console.log('successfully fetched all user submissions', data);
    },

    onError: (error) => {
      console.log('Error fetching all user submissions', error);
    },
  });

  return { isLoading, isSuccess, error, getUserAllSubmissionsMutation };
};
