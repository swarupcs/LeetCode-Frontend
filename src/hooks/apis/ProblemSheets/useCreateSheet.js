
import { createSheetRequest } from '@/apis/ProblemSheet/createSheet';
import { useMutation } from '@tanstack/react-query';

export const useCreateSheet = () => { 
    const {
      isPending,
      isSuccess,
      error,
      mutateAsync: createSheetMutation,
    } = useMutation({
      mutationFn: createSheetRequest,
      onSuccess: (data) => {
        console.log('Successfully created sheet', data);
      },
      onError: (error) => {
        console.error('Failed to create sheet', error);

      },
    });

    return {
      isPending,
      isSuccess,
      error,
      createSheetMutation,
    };


}