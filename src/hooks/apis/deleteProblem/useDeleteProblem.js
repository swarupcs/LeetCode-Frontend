import { deleteProblem } from "@/apis/Delete Problem";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


export const useDeleteProblem = () => {
    const {
        isLoading,
        isSuccess,
        error,
        mutateAsync: deleteProblemMutation,
    } = useMutation({
        mutationFn: deleteProblem,
        onSuccess: (data) => {
        console.log('Successfully deleted problem', data);
        // toast.success('Successfully deleted problem.');
        },
        onError: (error) => {
        console.error('Failed to delete problem', error);
        console.log('error.message', error.message);
        // toast.error(
        //     error.message || 'Failed to delete problem. Please try again.'
        // );
        },
    });
    
    return {
        isLoading,
        isSuccess,
        error,
        deleteProblemMutation,
    };
    }