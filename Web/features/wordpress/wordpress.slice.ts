import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WPPost } from "./wordpress.model";

export type WordPressState = {
  latestPosts: WPPost[];
}

const initialState: WordPressState = {
  latestPosts: []
}

const wordPressSlice = createSlice({
  name: "wp",
  initialState,
  reducers: {
    setWPLatestPosts: (state, action: PayloadAction<Array<WPPost>>) => {
      state.latestPosts = action.payload;
    }
  },
});

export const {
  setWPLatestPosts
} = wordPressSlice.actions;

export default wordPressSlice.reducer;