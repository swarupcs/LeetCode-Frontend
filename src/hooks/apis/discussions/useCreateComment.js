import { createCommentRequest } from '@/apis/Discussions/createComment';
import { useMutation } from '@tanstack/react-query';

export const useCreateComment = () => {
  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: createCommentMutation,
  } = useMutation({
    mutationFn: createCommentRequest,
    onSuccess: (data) => {
      console.log('Successfully created comment', data);
      // toast.success('Comment created successfully.');
    },
    onError: (error) => {
      console.error('Failed to create comment', error);
      // toast.error(error?.message || 'Failed to create comment. Please try again.');
    },
  });
  return {
    isPending,
    isSuccess,
    error,
    createCommentMutation,
  };
};
