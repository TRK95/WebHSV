
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RESPONSE_SUCCESS } from "../../../utils/constraint";
import ClubCategory from "../../../models/clubsCategoryModel";
import { apiGetClubCategories } from "../../../utils/api/clubsApi";

export type CategoryClubsState = {
  categoryClubs: ClubCategory[],
  loading: boolean,
  notifications: {
    isError: boolean,
    message: string
  }
};

const initialState: CategoryClubsState = {
  categoryClubs: [],
  loading: false,
  notifications: {
    isError: false,
    message: ''
  }
};

export const loadClubCategorys = createAsyncThunk(
  "clubCategory/loadClubCategorys",
  async (dataBody: {
    type: number,
    parentId: number,
    status: number
  }) => {
    const dataClubCategorys = await apiGetClubCategories({ reqQuery: dataBody })
    if (dataClubCategorys.status === RESPONSE_SUCCESS) {
      const datas = dataClubCategorys.data.map(data => new ClubCategory(data))
      return datas;
    }
  }
);

const categoryClubs = createSlice({
  name: "categoryClubs",
  initialState,
  reducers: {
    resetNotification: (state) => {
      state.notifications = {
        isError: false,
        message: ''
      }
    }
  },
  extraReducers: (builder) => {
    const actionList = [loadClubCategorys]
    actionList.forEach(action => {
      builder.addCase(action.pending, (state) => {
        state.loading = true;
      })
    })
    // loadClubCategorys
    builder.addCase(loadClubCategorys.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload) state.categoryClubs = [...action.payload];
    })
    builder.addCase(loadClubCategorys.rejected, (state) => {
      state.loading = false;
      state.notifications = {
        isError: true,
        message: 'Không tải được danh sách danh mục'
      }
    })
    // createClubCategorys
  }
});

export const { resetNotification } = categoryClubs.actions;

const categoryClubsReducer = categoryClubs.reducer;
export default categoryClubsReducer;
