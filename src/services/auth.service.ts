import type { AxiosError } from 'axios';
import type {
  SignUpPayload,
  SignInPayload,
  AuthResponse,
  ApiError,
  User,
  UpdateProfilePayload,
  UpdateUserProfileResponse,
} from '@/types/auth.types';
import { axiosInstance } from '@/config/axiosConfig';

/**
 * Register
 */
export const signUpRequest = async (
  payload: SignUpPayload,
): Promise<AuthResponse> => {
  try {
    const { data } = await axiosInstance.post<AuthResponse>(
      '/auth/register',
      payload,
    );

    return data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};

/**
 * Login
 */
export const signInRequest = async (
  payload: SignInPayload,
): Promise<AuthResponse> => {
  try {
    const { data } = await axiosInstance.post<AuthResponse>(
      '/auth/login',
      payload,
    );

    return data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};

/**
 * Get Logged-in User
 */
export const getUserDetails = async (): Promise<User> => {
  try {
    const { data } = await axiosInstance.get<User>('/auth/getUserDetails');

    return data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};

export const updateUserProfile = async (
  payload: UpdateProfilePayload,
): Promise<UpdateUserProfileResponse> => {
  try {
    const response = await axiosInstance.patch<UpdateUserProfileResponse>(
      '/auth/updateProfile',
      payload,
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};
