import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { HydrateAppAction } from "../../../types/nextReduxTypes";
import { StateData } from "../../../types/StateData";

export const stateSlugKey = "state-slug";

export type StateReducer = {
  statesList: StateData[];
  currentState: StateData | null;
  openSelectStateDialog: boolean;
  onSelectStateCallback: (stateSlug: string) => void | null;
}

const initialState: StateReducer = {
  statesList: [],
  currentState: null,
  openSelectStateDialog: false,
  onSelectStateCallback: null
}

const statesSlice = createSlice({
  name: "states",
  initialState,
  reducers: {
    setStatesList: (state, action: PayloadAction<StateData[]>) => {
      state.statesList = action.payload;
    },
    setCurrentState: (state, action: PayloadAction<StateData | null>) => {
      state.currentState = action.payload;
    },
    setOpenSelectStateDialog: (state, action: PayloadAction<{ open: boolean; onSelect?: (stateSlug: string) => void; }>) => {
      state.openSelectStateDialog = action.payload.open;
      state.onSelectStateCallback = action.payload.onSelect || null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: HydrateAppAction) => {
      state.statesList = action.payload?.state?.statesList ?? initialState.statesList;
    })
  }
});

export const {
  setStatesList,
  setCurrentState,
  setOpenSelectStateDialog
} = statesSlice.actions;
export default statesSlice.reducer;