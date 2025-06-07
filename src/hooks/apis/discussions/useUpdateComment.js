import { updateCommentRequest } from '@/apis/Discussions/updateComment';
import { useMutation } from '@tanstack/react-query';

export const useUpdateComment = () => {
  const {
    isPending,
    isSuccess,
    error,
    mutatateAsync: updateCommentMutation,
  } = useMutation({
    mutationFn: updateCommentRequest,
    onSuccess: (data) => {
      console.log('Successfully updated comment', data);
      // toast.success('Comment updated successfully.');
    },
    onError: (error) => {
      console.error('Failed to update comment', error);
      // toast.error(error?.message || 'Failed to update comment. Please try again.');
    },
  });
  return {
    isPending,
    isSuccess,
    error,
    updateCommentMutation,
  };
};
