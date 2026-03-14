import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getUserDetails } from '@/services/auth.service';
import { setUser, logout } from '@/features/auth/authSlice';
import type { GetUserProfileResponse, ApiError } from '@/types/auth.types';
import type { AppDispatch } from '@/app/store';
 
export const CURRENT_USER_QUERY_KEY = ['currentUser'] as const;
 
export const useGetUserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
 
  const query = useQuery<GetUserProfileResponse, ApiError>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getUserDetails,
    retry: false,
  });
 
  useEffect(() => {
    if (query.isSuccess && query.data?.data) {
      const profile = query.data.data;
      dispatch(
        setUser({
          user: profile.displayName ?? profile.email,
          role: profile.role,
          id: profile.id,
          username: profile.username ?? '',
          email: profile.email,
        }),
      );
    }
  }, [query.isSuccess, query.data, dispatch]);
 
  useEffect(() => {
    if (query.isError) {
      dispatch(logout());
    }
  }, [query.isError, dispatch]);
 
  return {
    ...query,
    // data.data is UserProfile
    user: query.data?.data ?? null,
  };
};