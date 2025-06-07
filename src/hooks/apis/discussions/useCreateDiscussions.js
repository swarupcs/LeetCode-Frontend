import { createDiscussionRequest } from "@/apis/Discussions/CreateDiscussions";
import { useMutation } from "@tanstack/react-query";


export const useCreateDiscussion = () => {
    const {
      isPending,
      isSuccess,
      error,
      mutateAsync: createDiscussionMutation,
    } = useMutation({
      mutationFn: createDiscussionRequest,
      onSuccess: (data) => {
        console.log('Successfully created discussion', data);
        // toast.success('Discussion created successfully.');
      },
      onError: (error) => {
        console.error('Failed to create discussion', error);
        // toast.error(error?.message || 'Failed to create discussion. Please try again.');
      },
    });

    return {
      isPending,
      isSuccess,
      error,
      createDiscussionMutation,
    };
}