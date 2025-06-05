import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface uploadState {
  status?: string; // temporary set to string type. It'll be updated later.
  previewUrl?: string;
  coverImgUrl?: string;
  duration?: number;
  localFileObjectUrl?: string;
}

const initialState: uploadState = {};

const uploadSlice = createSlice({
  name: "uploadState",
  initialState,
  reducers: {
    updateUploadDetails(state, action: PayloadAction<uploadState>) {
      const newState = {
        ...action.payload,
      };
      return { ...state, ...newState };
    },
  },
});

export const { updateUploadDetails } = uploadSlice.actions;

export default uploadSlice.reducer;
