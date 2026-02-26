import { axiosInstance } from '@/config/axiosConfig';
import type {
  ApiErrorResponse,
  CreateSheetPayload,
  CreateSheetResponse,
  GetAllSheetDetailsResponse,
} from '@/types/sheet.types';

import type { AxiosError } from 'axios';

export const getAllSheetDetailsRequest =
  async (): Promise<GetAllSheetDetailsResponse> => {
    try {
      const { data } =
        await axiosInstance.get<GetAllSheetDetailsResponse>('/sheets');

        console.log("data", data)
      return data;
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;

      if (error.response?.data) {
        throw error.response.data;
      }

      throw {
        message: error.message || 'Something went wrong',
      };
    }
  };

export const createSheetRequest = async (
  payload: CreateSheetPayload,
): Promise<CreateSheetResponse> => {
  try {
    const { data } = await axiosInstance.post<CreateSheetResponse>(
      '/sheets/createSheet',
      payload,
    );
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;

    if (error.response?.data) {
      throw error.response.data;
    }

    throw { message: error.message || 'Something went wrong' };
  }
};