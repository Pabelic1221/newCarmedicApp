import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      return state;
    },
    resetUser: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const reducer = userSlice.reducer;
export const actions = userSlice.actions;
