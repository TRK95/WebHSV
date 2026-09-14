import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type StudyLayoutState = {
  openTabletMenu: boolean;
  hideSubList: boolean;
  forceHideSubTopicTheory: boolean;
}

const initialState: StudyLayoutState = {
  openTabletMenu: false,
  hideSubList: false,
  forceHideSubTopicTheory: false
}

const studyLayoutSlice = createSlice({
  name: "studyLayout",
  initialState: initialState,
  reducers: {
    setOpenTabletMenu: (state, action: PayloadAction<boolean>) => {
      state.openTabletMenu = action.payload;
    },
    setHideSubList: (state, action: PayloadAction<boolean>) => {
      state.hideSubList = action.payload;
    },
    setForceHideSubTopicTheory: (state, action: PayloadAction<boolean>) => {
      state.forceHideSubTopicTheory = action.payload;
    }
  }
});

export const {
  setOpenTabletMenu,
  setHideSubList,
  setForceHideSubTopicTheory
} = studyLayoutSlice.actions;
export default studyLayoutSlice.reducer;