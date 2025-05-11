import { createProblemRequest } from '@/apis/CreateProblem';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';


export const useCreateProblem = () => {
    const { isPending, isSuccess, error, mutateAsync: createProblemMutation } = useMutation({ 
        mutationFn: createProblemRequest,
        onSuccess: (data) => {
            console.log('Successfully created problem', data);
            toast.success('Successfully created problem.');
        },
        onError: (error) => {
            console.error('Failed to create problem', error);
            console.log("error.message", error.message);
            toast.error(error.message ||'Failed to create problem. Please try again.'); 
        }
    });
    return {
        isPending,
        isSuccess,
        error,
        createProblemMutation,
    };

}