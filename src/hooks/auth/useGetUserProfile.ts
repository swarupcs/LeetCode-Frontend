import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { getUserDetails } from '@/services/auth.service';
import { setUser, logout } from '@/features/auth/authSlice';

import type { User, ApiError } from '@/types/auth.types';
import type { AppDispatch } from '@/app/store';

export const useGetUserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const query = useQuery<User, ApiError>({
    queryKey: ['currentUser'],
    queryFn: getUserDetails,
    retry: false,
  });

  // ✅ Handle success
  useEffect(() => {
    if (query.isSuccess && query.data) {
      dispatch(
        setUser({
          user: query.data.name,
          role: query.data.role,
          id: query.data.id,
          username: query.data.username,
          email: query.data.email,
        }),
      );
    }
  }, [query.isSuccess, query.data, dispatch]);

  // ✅ Handle error
  useEffect(() => {
    if (query.isError) {
      dispatch(logout());
    }
  }, [query.isError, dispatch]);

  return {
    ...query,
    user: query.data,
  };
};
