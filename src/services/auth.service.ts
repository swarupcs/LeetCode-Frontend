import type { AxiosError } from 'axios';
import type {
  SignUpPayload,
  SignInPayload,
  AuthResponse,
  ApiError,
  UpdateProfilePayload,
  UpdateUserProfileResponse,
  UserProfile,
  GetUserDetailsResponse,
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

export const logoutRequest = async (): Promise<void> => {
  try {
    await axiosInstance.post('/auth/logout');
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};

/**
 * Get Logged-in User
 */
export const getUserDetails = async (): Promise<UserProfile> => {
  try {
    const { data } = await axiosInstance.get<GetUserDetailsResponse>(
      '/auth/getUserDetails',
    );
    console.log("data", data)

    return data?.user;
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
      '/auth/updateUserProfile',
      payload,
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiError>;
    throw err.response?.data ?? { message: 'Something went wrong' };
  }
};
