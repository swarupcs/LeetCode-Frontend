import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  problems: [], // only essential fields like id, title, tags, number
  isLoading: false,
  error: null,
};

export const problemsSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {
    setProblemDetails: (state, action) => {
      state.problems = action.payload;
    },
    // add loading/error handlers as needed
  },
});

export const { setProblemDetails } = problemsSlice.actions;
export default problemsSlice.reducer;
