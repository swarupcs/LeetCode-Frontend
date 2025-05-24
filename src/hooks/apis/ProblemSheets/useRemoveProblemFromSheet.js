import { removeProblemFromSheetRequest } from "@/apis/ProblemSheet/removeProblemFromSheet";
import { useMutation } from "@tanstack/react-query";


export const useRemoveProblemFromSheet = () => {
    const { isLoading, isSuccess, error, mutateAsync: removeProblemFromSheetMutation } = useMutation({
        mutationFn: () => removeProblemFromSheetRequest(),
        onSuccess: (data) => {
            console.log('Successfully removed problem from sheet', data);
        },
        onError: (error) => {
            console.error('Failed to remove problem from sheet', error);
            console.log("error.message", error.message);
        },
    })


    return {
        isLoading,
        isSuccess,
        error,
        removeProblemFromSheetMutation,
    };
}