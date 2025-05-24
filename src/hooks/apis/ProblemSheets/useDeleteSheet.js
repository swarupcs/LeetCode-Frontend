import { deleteSheetRequest } from "@/apis/ProblemSheet/deleteSheet";


export const useDeleteSheet = () => { 
    const { isLoading, isSucess, error, mutateAsync: deleteSheetMutation } = useMutation({
        mutateAsync: () => deleteSheetRequest(),
        onSuccess: (data) => {
            console.log('Successfully deleted sheet', data);
        },
        onError: (error) => {
            console.error('Failed to delete sheet', error);
            console.log("error.message", error.message);
        },
    })

    return {
        isLoading,
        isSucess,
        error,
        deleteSheetMutation,
    };
}