import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shops: [],
};
const productSlice = createSlice({
  name: "shops",
  initialState: initialState,
  reducers: {
    setShops: (state, action) => {
      state.shops = [...action.payload];
      return state;
    },
    resetShops: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const reducer = productSlice.reducer;
export const actions = productSlice.actions;
