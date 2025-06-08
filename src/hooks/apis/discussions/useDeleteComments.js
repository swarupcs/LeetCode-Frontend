import { deleteCommentRequest } from '@/apis/Discussions/deleteComment';
import { useMutation } from '@tanstack/react-query';

export const useDeleteComment = () => {
  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: deleteCommentMutation,
  } = useMutation({
    mutationFn: deleteCommentRequest,
    onSuccess: (data) => {
      console.log('Successfully deleted comment', data);
      // toast.success('Successfully deleted comment.');
    },
    onError: (error) => {
      console.error('Failed to delete comment', error);
      // toast.error(error?.message || 'Failed to delete comment. Please try again.');
    },
  });
  return {
    isPending,
    isSuccess,
    error,
    deleteCommentMutation,
  };
};
