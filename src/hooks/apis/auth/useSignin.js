import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { signInRequest } from '@/apis/auth';
// import { useAuth } from '@/hooks/context/useAuth';
export const useSignin = () => {
//   const { setAuth } = useAuth();
  const {
    isPending,
    isSuccess,
    error,
    mutateAsync: signinMutation,
  } = useMutation({
    mutationFn: signInRequest,
    onSuccess: (response) => {
      console.log('Scuccessfully signed in', response);
    //   toast.success('Successfully signed in');
    //   const userObject = JSON.stringify(response.data);

    //   localStorage.setItem('user', userObject);
    //   localStorage.setItem('token', response.data.token);
    //   setAuth({
    //     token: response.data.token,
    //     user: response.data,
    //     loading: false,
    //   });
    },
    onError: (error) => {
      console.error('Failed to sign in', error);
      toast.error('Failed to sign in');
    },
  });

  return {
    isPending,
    isSuccess,
    error,
    signinMutation,
  };
};
