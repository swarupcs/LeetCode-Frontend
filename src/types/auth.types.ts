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

/* ============================= */
/*        RESPONSE TYPES         */
/* ============================= */

export interface AuthResponse {
  message: string;
  user: User;
}

export interface UserDetails extends User {}

/* ============================= */
/*          ERROR TYPE           */
/* ============================= */

export interface ApiError {
  message: string;
}
