// src/types/auth.types.ts
import type { ApiSuccess, ApiError } from './problem.types';
export type { ApiError };

// ─── Request payloads ─────────────────────────────────────────────────────────

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  location?: string;
  githubUrl?: string;
  twitterUrl?: string;
  website?: string;
}

// ─── User shapes ──────────────────────────────────────────────────────────────

// Minimal user — stored in Redux, returned on login/register
export interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  role: string;
  image: string | null;
}

// Full profile — returned by GET /auth/profile
// Mirrors backend UserProfile exactly
export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  displayName: string | null;
  role: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  github: string | null;    // username only, e.g. "swarupd1999"
  twitter: string | null;   // username only
  website: string | null;
  joinDate: string;          // e.g. "Nov 2025"
  rank: number;
}

// Fields returned by PATCH /auth/profile
export interface UpdatedProfileFields {
  id: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  githubUrl: string | null;
  twitterUrl: string | null;
  website: string | null;
}

// ─── API responses ────────────────────────────────────────────────────────────

// POST /api/v1/auth/login  → ApiSuccess<User>
// POST /api/v1/auth/register → ApiSuccess<User>
export type AuthResponse = ApiSuccess<User>;

// GET  /api/v1/auth/profile  → ApiSuccess<UserProfile>
export type GetUserProfileResponse = ApiSuccess<UserProfile>;

// PATCH /api/v1/auth/profile → ApiSuccess<UpdatedProfileFields>
export type UpdateUserProfileResponse = ApiSuccess<UpdatedProfileFields>;