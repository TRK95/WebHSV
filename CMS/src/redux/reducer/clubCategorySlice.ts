import { apiCreateCategorys, apiGetCategorys, apiUpdateCategorys, reqBodyCreateClubCategory } from "@/api/clubCategoryApi";
import ClubCategory from "@/models/ClubCategory";
import { RESPONSE_SUCCESS, STATUS_DELETED, STATUS_PRIVATE, TYPE_CLUB } from "@/utils/contrants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type CategoryClubsState = {
  categoryClubs: ClubCategory[],
  loading: boolean,
  addNewCategory?: ClubCategory,
  notifications: {
    isError: boolean,
    message: string
  }
};

const initialState: CategoryClubsState = {
  categoryClubs: [],
  loading: false,
  addNewCategory: undefined,
  notifications: {
    isError: false,
    message: ''
  }
};

export const loadClubCategorys = createAsyncThunk(
  "clubCategory/loadClubCategorys",
  async (dataBody: {
    type: number,
    parentId: string,
    status: number
  }) => {
    const dataClubCategorys = await apiGetCategorys(dataBody)
    if (dataClubCategorys.status === RESPONSE_SUCCESS) {
      const datas = dataClubCategorys.data.map(data => new ClubCategory(data))
      return datas;
    }
  }
);

export const createClubCategorys = createAsyncThunk(
  "clubCategory/createClubCategorys",
  async (dataBody: ClubCategory) => {
    const dataClubCategorys = await apiCreateCategorys(dataBody)
    if (dataClubCategorys.status === RESPONSE_SUCCESS) {
      const datas = new ClubCategory(dataClubCategorys.data)
      return datas;
    }
  }
);
export const updateClubCategorys = createAsyncThunk(
  "clubCategory/updateClubCategorys",
  async (dataBody: ClubCategory) => {
    const dataClubCategorys = await apiUpdateCategorys(dataBody)
    if (dataClubCategorys.status === RESPONSE_SUCCESS) {
      const datas = new ClubCategory(dataClubCategorys.data)
      return datas;
    }
  }
);

export const deleteClubCategorys = createAsyncThunk(
  "clubCategory/deleteClubCategorys",
  async (dataBody: ClubCategory) => {
    const dataClubCategorys = await apiUpdateCategorys({
      ...dataBody,
      status: STATUS_DELETED
    })
    if (dataClubCategorys.status === RESPONSE_SUCCESS) {
      const datas = new ClubCategory(dataClubCategorys.data)
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
    const actionList = [loadClubCategorys, createClubCategorys, updateClubCategorys, deleteClubCategorys]
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
        message: 'không tải được danh sách danh mục'
      }
    })
    // createClubCategorys
    builder.addCase(createClubCategorys.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload) {
        state.addNewCategory = action.payload
        state.notifications = {
          isError: false,
          message: 'tạo danh mục thành công'
        }
      }
    })
    builder.addCase(createClubCategorys.rejected, (state) => {
      state.loading = false;
      state.notifications = {
        isError: true,
        message: 'lỗi ! không tạo được danh sách danh mục'
      }
    })
    // updateClubCategorys
    builder.addCase(updateClubCategorys.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload) {
        state.addNewCategory = action.payload
        state.notifications = {
          isError: false,
          message: 'cập nhật danh mục thành công'
        }
      }
    })
    builder.addCase(updateClubCategorys.rejected, (state) => {
      state.loading = false;
      state.notifications = {
        isError: true,
        message: 'lỗi ! không cập nhật được danh sách danh mục'
      }
    })

    // deleteClubCategorys
    builder.addCase(deleteClubCategorys.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload) {
        state.addNewCategory = action.payload
        state.notifications = {
          isError: false,
          message: 'xóa danh mục thành công'
        }
      }
    })
    builder.addCase(deleteClubCategorys.rejected, (state) => {
      state.loading = false;
      state.notifications = {
        isError: true,
        message: 'lỗi ! không xóa được danh sách danh mục'
      }
    })
  }
});

export const { resetNotification } = categoryClubs.actions;

const categoryClubsReducer = categoryClubs.reducer;
export default categoryClubsReducer;
