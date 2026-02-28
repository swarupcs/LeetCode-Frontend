import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logoutRequest } from '@/services/auth.service';
import { logout } from '@/features/auth/authSlice';
import type { ApiError } from '@/types/auth.types';
import type { AppDispatch } from '@/app/store';

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation<void, ApiError>({
    mutationFn: logoutRequest,

    onSuccess: () => {
      // 1. Clear localStorage
      localStorage.clear();

      // 2. Clear Redux auth state
      dispatch(logout());

      // 3. Wipe all React Query cache so stale user data isn't served
      queryClient.clear();

      toast.success('Logged out successfully.');
      navigate('/login');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to log out.');
    },
  });

  return {
    ...mutation,
    logoutMutation: mutation.mutate, // fire-and-forget
    logoutAsync: mutation.mutateAsync, // awaitable
  };
};
