import { deleteSheetRequest } from "@/apis/ProblemSheet/deleteSheet";
import { useMutation } from "@tanstack/react-query";


export const useDeleteSheet = () => { 
    const {
      isLoading,
      isSucess,
      error,
      mutateAsync: deleteSheetMutation,
    } = useMutation({
      mutationFn: (sheetId) => deleteSheetRequest(sheetId),
      onSuccess: (data) => {
        console.log('Successfully deleted sheet', data);
      },
      onError: (error) => {
        console.error('Failed to delete sheet', error);
        console.log('error.message', error.message);
      },
    });

    return {
        isLoading,
        isSucess,
        error,
        deleteSheetMutation,
    };
}