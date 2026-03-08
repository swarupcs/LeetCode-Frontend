import { axiosInstance } from '@/config/axiosConfig';
import type { AxiosError } from 'axios';
import type { Discussion, Comment } from '@/data/discussions';

interface ApiErrorResponse {
  message: string;
}

const handleError = (err: unknown): never => {
  const error = err as AxiosError<ApiErrorResponse>;
  if (error.response?.data) throw error.response.data;
  throw { message: (err as Error).message || 'Something went wrong' };
};

// ─── Discussions ──────────────────────────────────────────────────────────────

export const getAllDiscussionsRequest = async (): Promise<{
  message: string;
  data: Discussion[];
}> => {
  try {
    const { data } = await axiosInstance.get('/discussions/getAllDiscussions');
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const getDiscussionRequest = async (
  id: string,
): Promise<Discussion & { comments: Comment[] }> => {
  try {
    const { data } = await axiosInstance.get(`/discussions/getDiscussion/${id}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const createDiscussionRequest = async (payload: {
  title: string;
  content: string;
  category: string;
  tags: string[];
  codeContent?: string;
  codeLanguage?: string;
}): Promise<{ message: string; data: Discussion }> => {
  try {
    const { data } = await axiosInstance.post('/discussions/createDiscussion', payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const updateDiscussionRequest = async (
  id: string,
  payload: { title: string; content: string; category: string; tags: string[] },
): Promise<{ message: string; data: Discussion }> => {
  try {
    const { data } = await axiosInstance.put(
      `/discussions/updateDiscussion/${id}`,
      payload,
    );
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const deleteDiscussionRequest = async (
  id: string,
): Promise<{ message: string }> => {
  try {
    const { data } = await axiosInstance.delete(`/discussions/deleteDiscussion/${id}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

// ─── Comments ─────────────────────────────────────────────────────────────────

export const createCommentRequest = async (payload: {
  discussionId: string;
  content: string;
  parentId?: string;
}): Promise<{ message: string; data: Comment }> => {
  try {
    const { data } = await axiosInstance.post('/discussions/createComment', payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const updateCommentRequest = async (
  id: string,
  content: string,
): Promise<{ message: string; data: Comment }> => {
  try {
    const { data } = await axiosInstance.put(`/discussions/updateComment/${id}`, {
      content,
    });
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const deleteCommentRequest = async (
  id: string,
): Promise<{ message: string }> => {
  try {
    const { data } = await axiosInstance.delete(`/discussions/deleteComment/${id}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

// ─── Votes ────────────────────────────────────────────────────────────────────

export const voteDiscussionRequest = async (
  id: string,
  value: 1 | -1 | 0,
): Promise<{ message: string; upvotes: number; downvotes: number; userVote: -1 | 0 | 1 }> => {
  try {
    const { data } = await axiosInstance.post(`/discussions/voteDiscussion/${id}`, {
      value,
    });
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const voteCommentRequest = async (
  id: string,
  value: 1 | -1 | 0,
): Promise<{ message: string; upvotes: number; downvotes: number; userVote: -1 | 0 | 1 }> => {
  try {
    const { data } = await axiosInstance.post(`/discussions/voteComment/${id}`, {
      value,
    });
    return data;
  } catch (err) {
    return handleError(err);
  }
};

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export const getBookmarkedDiscussionsRequest = async (): Promise<{
  message: string;
  data: Discussion[];
}> => {
  try {
    const { data } = await axiosInstance.get('/discussions/bookmarks');
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const toggleBookmarkRequest = async (
  id: string,
): Promise<{ message: string; bookmarked: boolean }> => {
  try {
    const { data } = await axiosInstance.post(`/discussions/toggleBookmark/${id}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};
