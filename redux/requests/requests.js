import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
};
const productSlice = createSlice({
  name: "requests",
  initialState: initialState,
  reducers: {
    setRequests: (state, action) => {
      state.requests = [...action.payload];
      return state;
    },
    updateRequests: (state, action) => {
      console.log("payload", action.payload);
      console.log("before", state.requests);

      state.requests = action.payload;

      console.log("after", state.requests);
      return state;
    },

    resetRequests: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const reducer = productSlice.reducer;
export const actions = productSlice.actions;
