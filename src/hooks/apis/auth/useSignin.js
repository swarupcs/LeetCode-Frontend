import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { signInRequest } from '@/apis/auth';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/features/auth/authSlice';
import { store } from '@/app/store';
// import { useAuth } from '@/hooks/context/useAuth';
export const useSignin = () => {
  const dispatch = useDispatch();

  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: signinMutation,
  } = useMutation({
    mutationFn: signInRequest,
    onSuccess: (data) => {
      console.log('Scuccessfully signed in', data);

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

      console.log('Login dispatched, current state:', store.getState());

      toast.success('Successfully signed in.');
    },
    onError: (error) => {
      console.error('Failed to sign in', error);
      toast.error('Failed to sign in. Please try again.');
    },
  });

  return {
    isPending,
    isSuccess,
    error,
    signinMutation,
  };
};
