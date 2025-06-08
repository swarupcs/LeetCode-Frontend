import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { signUpRequest } from '@/apis/auth';
import { useDispatch } from 'react-redux';
 import { loginSuccess } from '@/features/auth/authSlice';
export const useSignup = () => {
  const dispatch = useDispatch();

  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: signupMutation,
  } = useMutation({
    mutationFn: signUpRequest,
    onSuccess: (data) => {
      console.log('Scuccessfully signed up', data);
      dispatch(
        loginSuccess({
          user: data.user.name,
          role: data.user.role,
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          isAuthenticated: true,
        })
      );
      toast.success('Successfully signed up.');
    },
    onError: (error) => {
      console.error('Failed to sign up', error);
      toast.error('Failed to sign up. Please try again.');
    },
  });

  return {
    isPending,
    isSuccess,
    error,
    signupMutation,
  };
};
