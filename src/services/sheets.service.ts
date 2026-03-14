// src/services/sheets.service.ts
import { axiosInstance } from '@/config/axiosConfig';
import type { AxiosError } from 'axios';
import type {
  CreateSheetPayload,
  CreateSheetResponse,
  UpdateSheetPayload,
  UpdateSheetResponse,
  GetAllSheetsResponse,
  GetSheetByIdResponse,
  DeleteSheetResponse,
  ApiError,
} from '@/types/sheet.types';

// GET /api/v1/sheets
export const getAllSheetDetailsRequest = async (): Promise<GetAllSheetsResponse> => {
  try {
    const { data } = await axiosInstance.get<GetAllSheetsResponse>('/sheets');
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: 'Something went wrong' };
  }
};

// GET /api/v1/sheets/:id
export const getSheetByIdRequest = async (sheetId: string): Promise<GetSheetByIdResponse> => {
  try {
    const { data } = await axiosInstance.get<GetSheetByIdResponse>(`/sheets/${sheetId}`);
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: 'Something went wrong' };
  }
};

// POST /api/v1/sheets
export const createSheetRequest = async (
  payload: CreateSheetPayload,
): Promise<CreateSheetResponse> => {
  try {
    const { data } = await axiosInstance.post<CreateSheetResponse>('/sheets', payload);
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: 'Something went wrong' };
  }
};

// PUT /api/v1/sheets/:id
export const updateSheetRequest = async (
  sheetId: string,
  payload: UpdateSheetPayload,
): Promise<UpdateSheetResponse> => {
  try {
    const { data } = await axiosInstance.put<UpdateSheetResponse>(`/sheets/${sheetId}`, payload);
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: 'Something went wrong' };
  }
};

// DELETE /api/v1/sheets/:id
export const deleteSheetRequest = async (sheetId: string): Promise<DeleteSheetResponse> => {
  try {
    const { data } = await axiosInstance.delete<DeleteSheetResponse>(`/sheets/${sheetId}`);
    return data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    throw error.response?.data ?? { message: 'Something went wrong' };
  }
};