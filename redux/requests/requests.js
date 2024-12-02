import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
  rescueRoute: [],
  shopLocation: {},
  requestLocation: {},
};
const productSlice = createSlice({
  name: "requests",
  initialState: initialState,
  reducers: {
    setRequests: (state, action) => {
      state.requests = [...action.payload];
      return state;
    },
    setRescueRoute: (state, action) => {
      state.rescueRoute = action.payload;
    },
    setShopLocation: (state, action) => {
      state.shopLocation = action.payload;
    },
    setRequestLocation: (state, action) => {
      state.requestLocation = action.payload;
    },
    updateRequests: (state, action) => {
      state.requests = action.payload;

      return state;
    },

    resetRequests: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const reducer = productSlice.reducer;
export const actions = productSlice.actions;
