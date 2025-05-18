import { getUserDetails } from "@/apis/auth";
import { useMutation } from "@tanstack/react-query"


export const useGetUserDetails = () => {


    const { isPending, isSucsess, error, mutateAsync: getUserDetailsMutation } = useMutation({
        mutationFn: () => getUserDetails(),
        onSuccess: (data) => {
            console.log('Successfully fetched user details', data);
        },
        onError: (error) => {
            console.error('Error fetching user details', error);
        },
    
    })

    return { isPending, isSucsess, error, getUserDetailsMutation };
}