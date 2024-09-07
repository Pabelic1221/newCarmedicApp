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
      const newRequests = action.payload;

      // Create a map for quick access to the existing requests by their id
      const existingRequestsMap = state.requests.reduce((map, request) => {
        map[request.id] = request;
        return map;
      }, {});

      // Loop through the new requests and merge with existing ones
      newRequests.forEach((newReq) => {
        if (existingRequestsMap[newReq.id]) {
          // If the request exists, merge the old request with the new fields
          existingRequestsMap[newReq.id] = {
            ...existingRequestsMap[newReq.id], // Preserve existing keys/values
            ...newReq, // Overwrite with new data (e.g., the updated state field)
          };
        } else {
          // If the request is new, add it to the map
          existingRequestsMap[newReq.id] = newReq;
        }
      });

      // Convert the updated map back to an array and assign it to the state
      state.requests = Object.values(existingRequestsMap);
      console.log(state);
    },

    resetRequests: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const reducer = productSlice.reducer;
export const actions = productSlice.actions;
