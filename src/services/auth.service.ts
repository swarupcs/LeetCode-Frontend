// src/services/auth.service.ts
import type { AxiosError } from 'axios';
import type {
  SignUpPayload,
  SignInPayload,
  AuthResponse,
  ApiError,
  UpdateProfilePayload,
  UpdateUserProfileResponse,
  GetUserProfileResponse,
} from '@/types/auth.types';
import { axiosInstance } from '@/config/axiosConfig';

export const signUpRequest = async (payload: SignUpPayload): Promise<AuthResponse> => {
  try {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/register', payload);
    return data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};

export const signInRequest = async (payload: SignInPayload): Promise<AuthResponse> => {
  try {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', payload);
    return data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};

export const logoutRequest = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};

// GET /api/v1/auth/profile
export const getUserDetails = async (): Promise<GetUserProfileResponse> => {
  try {
    const { data } = await axiosInstance.get<GetUserProfileResponse>('/auth/profile');
    return data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};

// PATCH /api/v1/auth/profile
export const updateUserProfile = async (
  payload: UpdateProfilePayload,
): Promise<UpdateUserProfileResponse> => {
  try {
    const { data } = await axiosInstance.patch<UpdateUserProfileResponse>(
      '/auth/profile',
      payload,
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};