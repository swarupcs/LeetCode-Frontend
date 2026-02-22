import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/* ============================= */
/*            TYPES              */
/* ============================= */

export interface AuthState {
  user: string | null;
  role: string | null;
  username: string | null;
  email: string | null;
  id: string | null;
  isAuthenticated: boolean;
}

interface AuthPayload {
  user: string;
  role: string;
  username: string;
  email: string;
  id: string;
}

/* ============================= */
/*        INITIAL STATE          */
/* ============================= */

const initialState: AuthState = {
  user: null,
  role: null,
  username: null,
  email: null,
  id: null,
  isAuthenticated: false,
};

/* ============================= */
/*           SLICE               */
/* ============================= */

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthPayload>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.id = null;
      state.username = null;
      state.email = null;
    },

    setUser: (state, action: PayloadAction<AuthPayload>) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
  },
});

export const { loginSuccess, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
