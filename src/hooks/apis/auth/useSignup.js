import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { signUpRequest } from '@/apis/auth';

export const useSignup = () => {
  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: signupMutation,
  } = useMutation({
    mutationFn: signUpRequest,
    onSuccess: (data) => {
      console.log('Scuccessfully signed up', data);
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
