import { getAllSheetDetailsRequest } from "@/apis/ProblemSheet/getAllSheetDetails";
import { useMutation } from "@tanstack/react-query";



export const useGetAllSheetDetails = () => { 
    const {
      isLoading,
      isSuccess,
      error,
      mutateAsync: getAllSheetDetailsMutation,
    } = useMutation({
      mutationFn: (userId) => getAllSheetDetailsRequest(userId),
      onSuccess: (data) => {
        console.log('Successfully fetched all sheet details', data);
      },
      onError: (error) => {
        console.error('Error fetching all sheet details', error);
      },
    });

    return {
      isLoading,
      isSuccess,
      error,
      getAllSheetDetailsMutation,
    };
}