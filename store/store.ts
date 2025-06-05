import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import uploadSlice from "./uploadSlice";
// import royalityReducer from "./royalitySlice";
// import payoutSlice from "./payoutSlice";
// import sonoRegistationSlice from "./sonoRegSlice";
// import sonoArtistSlice from "./getSonoUserSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    upload: uploadSlice,
    // royalities: royalityReducer,
    // payouts: payoutSlice,
    // sonoUser: sonoRegistationSlice,
    // sonoArtiste: sonoArtistSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
