import { reducer as userLocationReducer } from "./map/userLocation";
import { reducer as shopsReducer } from "./shops/shops";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    userLocation: userLocationReducer,
    shops: shopsReducer,
  },
});
