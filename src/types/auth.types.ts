// src/types/auth.types.ts

/* ============================= */
/*         REQUEST TYPES         */
/* ============================= */
export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

/* ============================= */
/*          USER TYPES           */
/* ============================= */
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

// Extended user shape returned by getUserDetails — includes profile fields
export interface UserProfile extends User {
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  github: string | null;
  twitter: string | null;
  website: string | null;
  joinDate: string;
  rank: number;
}

// Payload for PATCH /auth/updateProfile
export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  location?: string;
  githubUrl?: string;
  twitterUrl?: string;
  website?: string;
}

// Shape of the updated fields returned after a profile update
export interface UpdatedProfileFields {
  id: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  githubUrl: string | null;
  twitterUrl: string | null;
  website: string | null;
}

/* ============================= */
/*        RESPONSE TYPES         */
/* ============================= */
export interface AuthResponse {
  message: string;
  user: User;
}

export interface GetUserProfileResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}

export interface UpdateUserProfileResponse {
  success: boolean;
  message: string;
  user: UpdatedProfileFields;
}

export type UserDetails = User;

/* ============================= */
/*          ERROR TYPE           */
/* ============================= */
export interface ApiError {
  message: string;
}


export interface GetUserDetailsResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}