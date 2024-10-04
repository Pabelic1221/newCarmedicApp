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
    setUserData: (state, action) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        state.currentUser[key] = value;
      });
    },
    resetUser: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const reducer = userSlice.reducer;
export const actions = userSlice.actions;
