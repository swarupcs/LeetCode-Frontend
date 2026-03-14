// src/types/roadmap.types.ts
import type { ApiSuccess, ApiError } from './problem.types';
export type { ApiError };

// ─── Content types (mirror the data/roadmaps.ts shapes) ──────────────────────

export interface RoadmapResource {
  title: string;
  type: 'article' | 'video' | 'course' | 'documentation' | 'practice' | 'book';
  url?: string;
}

export interface RoadmapSubtopic {
  id: string;
  name: string;
}

export interface RoadmapTopic {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  resources: RoadmapResource[];
  subtopics: RoadmapSubtopic[];
}

export interface RoadmapSection {
  id: string;
  name: string;
  description?: string;
  topics: RoadmapTopic[];
}

// ─── Roadmap (as returned by backend FormattedRoadmap) ────────────────────────

export interface Roadmap {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  isPublished: boolean;
  sections: RoadmapSection[];
  order: number;
  completedTopicIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateRoadmapPayload {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  isPublished?: boolean;
  sections?: RoadmapSection[];
  order?: number;
}

export interface UpdateRoadmapPayload extends Partial<CreateRoadmapPayload> {
  id: string;
}

export interface SaveProgressPayload {
  completedTopicIds: string[];
}

// ─── API Responses (all wrapped in ApiSuccess<T>) ─────────────────────────────

// GET  /api/v1/roadmaps              → ApiSuccess<Roadmap[]>
export type GetAllRoadmapsResponse = ApiSuccess<Roadmap[]>;

// GET  /api/v1/roadmaps/:slug        → ApiSuccess<Roadmap>
export type GetRoadmapResponse = ApiSuccess<Roadmap>;

// GET  /api/v1/roadmaps/admin/all    → ApiSuccess<Roadmap[]>
export type GetAllRoadmapsAdminResponse = ApiSuccess<Roadmap[]>;

// GET  /api/v1/roadmaps/admin/:id    → ApiSuccess<Roadmap>
export type GetRoadmapAdminResponse = ApiSuccess<Roadmap>;

// POST /api/v1/roadmaps              → ApiSuccess<Roadmap> (201)
export type CreateRoadmapResponse = ApiSuccess<Roadmap>;

// PUT  /api/v1/roadmaps/:id          → ApiSuccess<Roadmap>
export type UpdateRoadmapResponse = ApiSuccess<Roadmap>;

// DELETE /api/v1/roadmaps/:id        → ApiSuccess<null>
export type DeleteRoadmapResponse = ApiSuccess<null>;

// PATCH /api/v1/roadmaps/:id/publish → ApiSuccess<Roadmap>
export type TogglePublishResponse = ApiSuccess<Roadmap>;

// POST  /api/v1/roadmaps/:id/progress   → ApiSuccess<{ completedTopicIds: string[] }>
export type SaveProgressResponse = ApiSuccess<{ completedTopicIds: string[] }>;

// DELETE /api/v1/roadmaps/:id/progress  → ApiSuccess<null>
export type ResetProgressResponse = ApiSuccess<null>;