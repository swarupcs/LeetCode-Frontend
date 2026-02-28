// src/hooks/auth/useSignin.ts

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';


import { loginSuccess } from '@/features/auth/authSlice';

import type { SignInPayload, AuthResponse, ApiError } from '@/types/auth.types';
import type { AppDispatch } from '@/app/store';
import { signInRequest } from '@/services/auth.service';


export const useSignin = () => {
  const dispatch = useDispatch<AppDispatch>();

  const mutation = useMutation<AuthResponse, ApiError, SignInPayload>({
    mutationFn: signInRequest,

    onSuccess: (data) => {
      dispatch(
        loginSuccess({
          user: data.user.name,
          role: data.user.role,
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
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
