import { deleteDiscussionRequest } from "@/apis/Discussions/deleteDiscussion";
import { useMutation } from "@tanstack/react-query";


export const useDeleteDiscussion = () => {

    const { isPending, isSuccess, error, mutateAsync: deleteDiscussionMutation } = useMutation({
        mutationFn: deleteDiscussionRequest,
        onSuccess: (data) => {
            console.log('Successfully deleted discussion', data);
            // toast.success('Successfully deleted discussion.');
        },
        onError: (error) => {
            console.error('Failed to delete discussion', error);
            // toast.error(error?.message || 'Failed to delete discussion. Please try again.');
        },
    });

    return {
        isPending,
        isSuccess,
        error,
        deleteDiscussionMutation,
    };
}