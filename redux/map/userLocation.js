import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentLocation: null,
};
const productSlice = createSlice({
  name: "userLocation",
  initialState: initialState,
  reducers: {
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
      return state;
    },
    resetLocation: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const reducer = productSlice.reducer;
export const actions = productSlice.actions;
