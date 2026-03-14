// src/hooks/auth/useSignin.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/features/auth/authSlice';
import { signInRequest } from '@/services/auth.service';
import type { SignInPayload, AuthResponse, ApiError } from '@/types/auth.types';
import type { AppDispatch } from '@/app/store';

export const useSignin = () => {
  const dispatch = useDispatch<AppDispatch>();

  const mutation = useMutation<AuthResponse, ApiError, SignInPayload>({
    mutationFn: signInRequest,

    onSuccess: (response) => {
      const user = response.data;
      dispatch(
        loginSuccess({
          user: user?.name ?? user?.email ?? '',
          role: user?.role ?? '',
          id: user?.id ?? '',
          username: user?.username ?? '',
          email: user?.email ?? '',
        }),
      );
      toast.success('Successfully signed in.');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to sign in.');
    },
  });

  return {
    ...mutation,
    signinMutation: mutation.mutateAsync,
  };
};