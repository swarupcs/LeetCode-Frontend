import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: null,
  id: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.id = action.payload.id;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.id = null;
    },
    setUser(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.id = action.payload.id;
      state.isAuthenticated = true;
    },
  },
});

export const { loginSuccess, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
