import { signUpRequest } from "@/services/auth.service"
import type { ApiError, AuthResponse, SignUpPayload } from "@/types/auth.types"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useSignup = () => {
    const mutation = useMutation<AuthResponse, ApiError, SignUpPayload>({
        mutationFn: signUpRequest,

        onSuccess: () => {
            toast.success("Account created successfully")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create account")
        }
    });

    return {
        ...mutation,
        signupMutation: mutation.mutateAsync
    }
}