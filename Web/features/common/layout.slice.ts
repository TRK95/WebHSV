import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type LayoutState = {
  useDynamicNav: boolean
}

const initialState: LayoutState = {
  useDynamicNav: false
}

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setUseDynamicNav: (state, action: PayloadAction<boolean>) => {
      state.useDynamicNav = action.payload;
    }
  }
});

export const {
  setUseDynamicNav
} = layoutSlice.actions;

export default layoutSlice.reducer;