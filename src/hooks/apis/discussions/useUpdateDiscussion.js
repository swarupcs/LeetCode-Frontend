import { updateDiscussionRequest } from '@/apis/Discussions/updateDiscussion';
import { useMutation } from '@tanstack/react-query';

export const useUpdateDiscussion = () => {
  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: updateDiscussionMutation,
  } = useMutation({
    mutationFn: updateDiscussionRequest,
    onSuccess: (data) => {
      console.log('Successfully updated discussion', data);
      // toast.success('Successfully updated discussion.');
    },
    onError: (error) => {
      console.error('Failed to update discussion', error);
      // toast.error(error?.message || 'Failed to update discussion. Please try again.');
    },
  });

  return {
    isPending,
    isSuccess,
    error,
    updateDiscussionMutation,
  };
};
