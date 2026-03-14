// src/services/roadmap.service.ts
import { axiosInstance } from '@/config/axiosConfig';
import type { AxiosError } from 'axios';
import type {
  Roadmap,
  CreateRoadmapPayload,
  UpdateRoadmapPayload,
  GetAllRoadmapsResponse,
  GetRoadmapResponse,
  GetAllRoadmapsAdminResponse,
  GetRoadmapAdminResponse,
  CreateRoadmapResponse,
  UpdateRoadmapResponse,
  DeleteRoadmapResponse,
  TogglePublishResponse,
  SaveProgressResponse,
  ResetProgressResponse,
  ApiError,
} from '@/types/roadmap.types';

// Re-export Roadmap so existing imports of RoadmapWithProgress can be migrated
export type { Roadmap };
/** @deprecated Use Roadmap instead */
export type RoadmapWithProgress = Roadmap;

const throwError = (err: unknown): never => {
  const error = err as AxiosError<ApiError>;
  throw error.response?.data ?? { message: (err as Error).message || 'Something went wrong' };
};

// ─── Public ───────────────────────────────────────────────────────────────────

// GET /api/v1/roadmaps
export const getAllRoadmapsRequest = async (): Promise<GetAllRoadmapsResponse> => {
  try {
    const { data } = await axiosInstance.get<GetAllRoadmapsResponse>('/roadmaps');
    return data;
  } catch (err) { return throwError(err); }
};

// GET /api/v1/roadmaps/:slug
export const getRoadmapRequest = async (slug: string): Promise<GetRoadmapResponse> => {
  try {
    const { data } = await axiosInstance.get<GetRoadmapResponse>(`/roadmaps/${slug}`);
    return data;
  } catch (err) { return throwError(err); }
};

// ─── Progress ─────────────────────────────────────────────────────────────────

// POST /api/v1/roadmaps/:id/progress
export const saveProgressRequest = async (
  id: string,
  completedTopicIds: string[],
): Promise<SaveProgressResponse> => {
  try {
    const { data } = await axiosInstance.post<SaveProgressResponse>(
      `/roadmaps/${id}/progress`,
      { completedTopicIds },
    );
    return data;
  } catch (err) { return throwError(err); }
};

// DELETE /api/v1/roadmaps/:id/progress
export const resetProgressRequest = async (id: string): Promise<ResetProgressResponse> => {
  try {
    const { data } = await axiosInstance.delete<ResetProgressResponse>(
      `/roadmaps/${id}/progress`,
    );
    return data;
  } catch (err) { return throwError(err); }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

// GET /api/v1/roadmaps/admin/all
export const getAllRoadmapsAdminRequest = async (): Promise<GetAllRoadmapsAdminResponse> => {
  try {
    const { data } = await axiosInstance.get<GetAllRoadmapsAdminResponse>('/roadmaps/admin/all');
    return data;
  } catch (err) { return throwError(err); }
};

// GET /api/v1/roadmaps/admin/:id
export const getRoadmapAdminRequest = async (id: string): Promise<GetRoadmapAdminResponse> => {
  try {
    const { data } = await axiosInstance.get<GetRoadmapAdminResponse>(`/roadmaps/admin/${id}`);
    return data;
  } catch (err) { return throwError(err); }
};

// POST /api/v1/roadmaps
export const createRoadmapRequest = async (
  payload: CreateRoadmapPayload,
): Promise<CreateRoadmapResponse> => {
  try {
    const { data } = await axiosInstance.post<CreateRoadmapResponse>('/roadmaps', payload);
    return data;
  } catch (err) { return throwError(err); }
};

// PUT /api/v1/roadmaps/:id
export const updateRoadmapRequest = async (
  id: string,
  payload: Omit<UpdateRoadmapPayload, 'id'>,
): Promise<UpdateRoadmapResponse> => {
  try {
    const { data } = await axiosInstance.put<UpdateRoadmapResponse>(`/roadmaps/${id}`, payload);
    return data;
  } catch (err) { return throwError(err); }
};

// DELETE /api/v1/roadmaps/:id
export const deleteRoadmapRequest = async (id: string): Promise<DeleteRoadmapResponse> => {
  try {
    const { data } = await axiosInstance.delete<DeleteRoadmapResponse>(`/roadmaps/${id}`);
    return data;
  } catch (err) { return throwError(err); }
};

// PATCH /api/v1/roadmaps/:id/publish
export const togglePublishRequest = async (id: string): Promise<TogglePublishResponse> => {
  try {
    const { data } = await axiosInstance.patch<TogglePublishResponse>(`/roadmaps/${id}/publish`);
    return data;
  } catch (err) { return throwError(err); }
};