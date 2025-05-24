import { addProblemToSheetRequest } from "@/apis/ProblemSheet/addProblemToSheet";
import { useMutation } from "@tanstack/react-query";


export const useAddProblemToSheet = () => { 
    const {isLoading, isSucess, error, mutateAsync: addProblemToSheetMutation} = useMutation({
        mutationFn: () => addProblemToSheetRequest(),

        onSuccess: (data) => {
            console.log('Successfully added problem to sheet', data);
        },
        onError: (error) => {
            console.error('Failed to add problem to sheet', error);
            console.log("error.message", error.message);
        },
    })

    return {
        isLoading,
        isSucess,
        error,
        addProblemToSheetMutation,
    };

}