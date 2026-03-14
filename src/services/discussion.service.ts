// src/services/discussion.service.ts
import { axiosInstance } from '@/config/axiosConfig';
import type { AxiosError } from 'axios';
import type {
  CreateDiscussionPayload,
  CreateDiscussionResponse,
  UpdateDiscussionPayload,
  UpdateDiscussionResponse,
  DeleteDiscussionResponse,
  GetAllDiscussionsResponse,
  GetDiscussionResponse,
  CreateCommentPayload,
  CreateCommentResponse,
  UpdateCommentResponse,
  DeleteCommentResponse,
  VotePayload,
  VoteDiscussionResponse,
  VoteCommentResponse,
  ToggleBookmarkResponse,
  GetBookmarksResponse,
  ApiError,
} from '@/types/discussion.types';

const throwError = (err: unknown): never => {
  const error = err as AxiosError<ApiError>;
  throw error.response?.data ?? { message: (err as Error).message || 'Something went wrong' };
};

// ─── Discussions ──────────────────────────────────────────────────────────────

// GET /api/v1/discussions
export const getAllDiscussionsRequest = async (): Promise<GetAllDiscussionsResponse> => {
  try {
    const { data } = await axiosInstance.get<GetAllDiscussionsResponse>('/discussions');
    return data;
  } catch (err) { return throwError(err); }
};

// GET /api/v1/discussions/bookmarks  (must come before /:id route)
export const getBookmarkedDiscussionsRequest = async (): Promise<GetBookmarksResponse> => {
  try {
    const { data } = await axiosInstance.get<GetBookmarksResponse>('/discussions/bookmarks');
    return data;
  } catch (err) { return throwError(err); }
};

// GET /api/v1/discussions/:id
export const getDiscussionRequest = async (id: string): Promise<GetDiscussionResponse> => {
  try {
    const { data } = await axiosInstance.get<GetDiscussionResponse>(`/discussions/${id}`);
    return data;
  } catch (err) { return throwError(err); }
};

// POST /api/v1/discussions
export const createDiscussionRequest = async (
  payload: CreateDiscussionPayload,
): Promise<CreateDiscussionResponse> => {
  try {
    const { data } = await axiosInstance.post<CreateDiscussionResponse>('/discussions', payload);
    return data;
  } catch (err) { return throwError(err); }
};

// PUT /api/v1/discussions/:id
export const updateDiscussionRequest = async (
  id: string,
  payload: Omit<UpdateDiscussionPayload, 'id'>,
): Promise<UpdateDiscussionResponse> => {
  try {
    const { data } = await axiosInstance.put<UpdateDiscussionResponse>(`/discussions/${id}`, payload);
    return data;
  } catch (err) { return throwError(err); }
};

// DELETE /api/v1/discussions/:id
export const deleteDiscussionRequest = async (id: string): Promise<DeleteDiscussionResponse> => {
  try {
    const { data } = await axiosInstance.delete<DeleteDiscussionResponse>(`/discussions/${id}`);
    return data;
  } catch (err) { return throwError(err); }
};

// ─── Comments ─────────────────────────────────────────────────────────────────

// POST /api/v1/discussions/comments
export const createCommentRequest = async (
  payload: CreateCommentPayload,
): Promise<CreateCommentResponse> => {
  try {
    const { data } = await axiosInstance.post<CreateCommentResponse>('/discussions/comments', payload);
    return data;
  } catch (err) { return throwError(err); }
};

// PUT /api/v1/discussions/comments/:id
export const updateCommentRequest = async (
  id: string,
  content: string,
): Promise<UpdateCommentResponse> => {
  try {
    const { data } = await axiosInstance.put<UpdateCommentResponse>(
      `/discussions/comments/${id}`,
      { content },
    );
    return data;
  } catch (err) { return throwError(err); }
};

// DELETE /api/v1/discussions/comments/:id
export const deleteCommentRequest = async (id: string): Promise<DeleteCommentResponse> => {
  try {
    const { data } = await axiosInstance.delete<DeleteCommentResponse>(
      `/discussions/comments/${id}`,
    );
    return data;
  } catch (err) { return throwError(err); }
};

// ─── Votes ────────────────────────────────────────────────────────────────────

// POST /api/v1/discussions/:id/vote
export const voteDiscussionRequest = async (
  id: string,
  value: VotePayload['value'],
): Promise<VoteDiscussionResponse> => {
  try {
    const { data } = await axiosInstance.post<VoteDiscussionResponse>(
      `/discussions/${id}/vote`,
      { value },
    );
    return data;
  } catch (err) { return throwError(err); }
};

// POST /api/v1/discussions/comments/:id/vote
export const voteCommentRequest = async (
  id: string,
  value: VotePayload['value'],
): Promise<VoteCommentResponse> => {
  try {
    const { data } = await axiosInstance.post<VoteCommentResponse>(
      `/discussions/comments/${id}/vote`,
      { value },
    );
    return data;
  } catch (err) { return throwError(err); }
};

// ─── Bookmarks ────────────────────────────────────────────────────────────────

// POST /api/v1/discussions/:id/bookmark
export const toggleBookmarkRequest = async (id: string): Promise<ToggleBookmarkResponse> => {
  try {
    const { data } = await axiosInstance.post<ToggleBookmarkResponse>(
      `/discussions/${id}/bookmark`,
    );
    return data;
  } catch (err) { return throwError(err); }
};