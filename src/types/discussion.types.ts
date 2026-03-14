// src/types/discussion.types.ts
import type { ApiSuccess, ApiError } from './problem.types';
export type { ApiError };

// ─── Author (subset of User) ──────────────────────────────────────────────────

export interface DiscussionAuthor {
  id: string;
  username: string | null;
  image: string | null;
}

// ─── Comment (recursive for replies) ─────────────────────────────────────────

export interface Comment {
  id: string;
  content: string;
  discussionId: string;
  parentId: string | null;
  authorId: string;
  author: DiscussionAuthor;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  userVote: -1 | 0 | 1;
  replies: Comment[];
}

// ─── Discussion ───────────────────────────────────────────────────────────────

export type DiscussionCategory = 'general' | 'problem' | 'interview' | 'career';

export interface Discussion {
  id: string;
  title: string;
  content: string;
  contentType: 'text' | 'code';
  codeContent: string | null;
  codeLanguage: string | null;
  category: DiscussionCategory;
  tags: string[];
  company: string | null;
  position: string | null;
  problemId: number | null;
  problemTitle: string | null;
  problemDifficulty: string | null;
  authorId: string;
  author: DiscussionAuthor;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  userVote: -1 | 0 | 1;
  bookmarked: boolean;
  commentCount: number;
  // Only present on GET /:id
  comments?: Comment[];
}

// ─── Vote result ──────────────────────────────────────────────────────────────

export interface VoteResult {
  upvotes: number;
  downvotes: number;
  userVote: -1 | 0 | 1;
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateDiscussionPayload {
  title: string;
  content: string;
  category: DiscussionCategory;
  tags: string[];
  codeContent?: string;
  codeLanguage?: string;
  company?: string;
  position?: string;
  problemId?: string;
  problemTitle?: string;
  problemDifficulty?: string;
}

export interface UpdateDiscussionPayload {
  id: string;
  title: string;
  content: string;
  category: DiscussionCategory;
  tags: string[];
  codeContent?: string;
  codeLanguage?: string;
  company?: string;
  position?: string;
}

export interface CreateCommentPayload {
  discussionId: string;
  content: string;
  parentId?: string;
}

export interface UpdateCommentPayload {
  id: string;
  content: string;
}

export interface VotePayload {
  id: string;
  value: 1 | -1 | 0;
}

// ─── Responses (all wrapped in ApiSuccess<T>) ─────────────────────────────────

// GET  /api/v1/discussions               → ApiSuccess<Discussion[]>
export type GetAllDiscussionsResponse = ApiSuccess<Discussion[]>;

// GET  /api/v1/discussions/:id           → ApiSuccess<Discussion>  (includes comments)
export type GetDiscussionResponse = ApiSuccess<Discussion>;

// POST /api/v1/discussions               → ApiSuccess<Discussion>  (201)
export type CreateDiscussionResponse = ApiSuccess<Discussion>;

// PUT  /api/v1/discussions/:id           → ApiSuccess<Discussion>
export type UpdateDiscussionResponse = ApiSuccess<Discussion>;

// DELETE /api/v1/discussions/:id         → ApiSuccess<null>
export type DeleteDiscussionResponse = ApiSuccess<null>;

// POST /api/v1/discussions/comments      → ApiSuccess<Comment>     (201)
export type CreateCommentResponse = ApiSuccess<Comment>;

// PUT  /api/v1/discussions/comments/:id  → ApiSuccess<Comment>
export type UpdateCommentResponse = ApiSuccess<Comment>;

// DELETE /api/v1/discussions/comments/:id → ApiSuccess<null>
export type DeleteCommentResponse = ApiSuccess<null>;

// POST /api/v1/discussions/:id/vote      → ApiSuccess<VoteResult>
export type VoteDiscussionResponse = ApiSuccess<VoteResult>;

// POST /api/v1/discussions/comments/:id/vote → ApiSuccess<VoteResult>
export type VoteCommentResponse = ApiSuccess<VoteResult>;

// POST   /api/v1/discussions/:id/bookmark → ApiSuccess<{ bookmarked: boolean }>
export type ToggleBookmarkResponse = ApiSuccess<{ bookmarked: boolean }>;

// GET    /api/v1/discussions/bookmarks    → ApiSuccess<Discussion[]>
export type GetBookmarksResponse = ApiSuccess<Discussion[]>;