import { axiosInstance } from '@/config/axiosConfig';
import type { AxiosError } from 'axios';
import type { Roadmap, RoadmapSection } from '@/data/roadmaps';

interface ApiErrorResponse {
  message: string;
}

export interface RoadmapWithProgress extends Omit<Roadmap, 'sections'> {
  sections: RoadmapSection[];
  completedTopicIds: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

const handleError = (err: unknown): never => {
  const error = err as AxiosError<ApiErrorResponse>;
  if (error.response?.data) throw error.response.data;
  throw { message: (err as Error).message || 'Something went wrong' };
};

// ─── Public ───────────────────────────────────────────────────────────────────

export const getAllRoadmapsRequest = async (): Promise<{
  message: string;
  data: RoadmapWithProgress[];
}> => {
  try {
    const { data } = await axiosInstance.get('/roadmaps/getAllRoadmaps');
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const getRoadmapRequest = async (slug: string): Promise<{
  message: string;
  data: RoadmapWithProgress;
}> => {
  try {
    const { data } = await axiosInstance.get(`/roadmaps/getRoadmap/${slug}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

// ─── Progress ─────────────────────────────────────────────────────────────────

export const saveProgressRequest = async (
  id: string,
  completedTopicIds: string[],
): Promise<{ message: string; data: { completedTopicIds: string[] } }> => {
  try {
    const { data } = await axiosInstance.post(`/roadmaps/progress/${id}`, {
      completedTopicIds,
    });
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const resetProgressRequest = async (
  id: string,
): Promise<{ message: string }> => {
  try {
    const { data } = await axiosInstance.delete(`/roadmaps/progress/${id}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const getAllRoadmapsAdminRequest = async (): Promise<{
  message: string;
  data: RoadmapWithProgress[];
}> => {
  try {
    const { data } = await axiosInstance.get('/roadmaps/admin/getAll');
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const getRoadmapAdminRequest = async (id: string): Promise<{
  message: string;
  data: RoadmapWithProgress;
}> => {
  try {
    const { data } = await axiosInstance.get(`/roadmaps/admin/get/${id}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const createRoadmapRequest = async (payload: {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  isPublished: boolean;
  sections: unknown;
  order?: number;
}): Promise<{ message: string; data: RoadmapWithProgress }> => {
  try {
    const { data } = await axiosInstance.post('/roadmaps/createRoadmap', payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const updateRoadmapRequest = async (
  id: string,
  payload: {
    name?: string;
    slug?: string;
    description?: string;
    icon?: string;
    color?: string;
    isPublished?: boolean;
    sections?: unknown;
    order?: number;
  },
): Promise<{ message: string; data: RoadmapWithProgress }> => {
  try {
    const { data } = await axiosInstance.put(`/roadmaps/updateRoadmap/${id}`, payload);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const deleteRoadmapRequest = async (
  id: string,
): Promise<{ message: string }> => {
  try {
    const { data } = await axiosInstance.delete(`/roadmaps/deleteRoadmap/${id}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};

export const togglePublishRequest = async (
  id: string,
): Promise<{ message: string; data: RoadmapWithProgress }> => {
  try {
    const { data } = await axiosInstance.patch(`/roadmaps/togglePublish/${id}`);
    return data;
  } catch (err) {
    return handleError(err);
  }
};
