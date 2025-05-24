import { getIndividualSheetDetailsRequest } from "@/apis/ProblemSheet/getIndividualSheetDetails";
import { useMutation } from "@tanstack/react-query";


export const useGetIndividualSheetDetails = () => {
    const { isLoading, isSuccess, error, mutateAsync: getIndividualSheetDetailsMutation } = useMutation({
        mutationFn: (sheetId) => getIndividualSheetDetailsRequest(sheetId),
        onSuccess: (data) => {
            console.log('Successfully fetched individual sheet details', data);
        },
        onError: (error) => {
            console.error('Error fetching individual sheet details', error);
        },
    });

    return {
        isLoading,
        isSuccess,
        error,
        getIndividualSheetDetailsMutation,
    };
}