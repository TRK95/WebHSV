import { PAGE_SIZE, RESPONSE_SUCCESS, STATUS_DELETED, STATUS_PUBLIC } from "../../../utils/constraint";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from ".";
import Club from "../../../models/clubsModel";
import { apiCreateClubApi, apiGetClubsByCategory, apiUpdateClubApi, getClubsByTypeApi, reqBodyCreateClubs, reqQueryClubs } from "../../../utils/api/clubsApi";
import { apiSetPresidentClub } from "../../../utils/api/clubMembersApi";
import ClubMember from "../../../models/ClubMember";

export type ClubsState = {
  clubs: Club[],
  loading: boolean,
  total: number,
  category: number,
  status: number,
  notifications: {
    isError: boolean,
    message: string
  }
};

const initialState: ClubsState = {
  clubs: [],
  loading: false,
  total: 0,
  category: 0,
  status: STATUS_PUBLIC,
  notifications: {
    isError: false,
    message: ''
  }
};

export const loadClubsByCategory = createAsyncThunk(
  "club/loadClubsByCategory", async (dataBody: {
    categoryId: number,
    status: number
  }) => {
  const dataClubs = await apiGetClubsByCategory(dataBody)
  if (dataClubs.status === RESPONSE_SUCCESS) {
    const datas = dataClubs.data.map(data => new Club(data))
    return datas
  }
}
)

export const loadClubs = createAsyncThunk(
  "club/loadClub",
  async (dataBody: reqQueryClubs) => {
    const dataClubs = await getClubsByTypeApi({ reqQuery: dataBody })
    if (dataClubs.status === RESPONSE_SUCCESS) {
      const datas = dataClubs.data.map(data => new Club(data))
      return { datas, total: dataClubs.total };
    }
  }
);

export const createClub = createAsyncThunk(
  "club/createClub",
  async (dataBody: reqBodyCreateClubs & {
    presidentId: string
  }, { dispatch, getState }) => {
    const store: any = getState()
    const { presidentId, ...datas } = dataBody
    const dataClub = await apiCreateClubApi({ reqBody: dataBody })
    if (dataClub.status === RESPONSE_SUCCESS) {
      const data = new Club(dataClub.data);
      if (store.clubsReducer.category) {
        dispatch(loadClubsByCategory({
          categoryId: store.clubsReducer.category,
          status: store.clubsReducer.status
        }))
      } else {
        dispatch(loadClubs({
          limit: PAGE_SIZE,
          offset: 0,
          type: dataBody.type,
          status: store.clubsReducer.status
        }))
      }
      if (presidentId) {
        dispatch(setPresidentClubs({
          clubId: data.id || 0,
          studentId: presidentId
        }))
      }
      return data
    }
  }
);

export const updateClub = createAsyncThunk(
  "club/updateClub",
  async (dataBody: Club & {
    isLoadClub?: boolean,
  }, { dispatch, getState }) => {
    const store: any = getState();
    const { isLoadClub = true, ...value } = dataBody
    const dataClub = await apiUpdateClubApi({ reqBody: value })
    if (dataClub.status === RESPONSE_SUCCESS) {
      const data = new Club(dataClub.data);
      if (store.clubsReducer.category) {
        dispatch(loadClubsByCategory({
          categoryId: store.clubsReducer.category,
          status: store.clubsReducer.status
        }))
      } else {
        dispatch(loadClubs({
          limit: PAGE_SIZE,
          offset: 0,
          type: dataBody.type,
          status: store.clubsReducer.status
        }))
      }
      return data
    }

  }
);

export const deleteClub = createAsyncThunk(
  "club/deleteClub",
  async (dataBody: Club, { dispatch, getState }) => {
    const store: any = getState();
    const dataClub = await apiUpdateClubApi({
      reqBody: {
        ...dataBody,
        status: STATUS_DELETED
      }
    })
    if (dataClub.status === RESPONSE_SUCCESS) {
      const data = new Club(dataClub.data);
      if (store.clubsReducer.category) {
        dispatch(loadClubsByCategory({
          categoryId: store.clubsReducer.category,
          status: store.clubsReducer.status
        }))
      } else {
        dispatch(loadClubs({
          limit: PAGE_SIZE,
          offset: 0,
          type: dataBody.type,
          status: store.clubsReducer.status
        }))
      }
      return data
    }
  }
);

export const setPresidentClubs = createAsyncThunk(
  "clubMembers/setPresidentClub", async (dataBody: {
    studentId: string,
    clubId: number
  }) => {
  const dataClubMember = await apiSetPresidentClub(dataBody)
  if (dataClubMember.status === RESPONSE_SUCCESS && dataClubMember.data) {
    return new ClubMember(dataClubMember.data)
  }
})

const clubs = createSlice({
  name: "clubs",
  initialState,
  reducers: {
    resetIsNotification: (state) => {
      state.notifications = {
        isError: false,
        message: ''
      }
    },
    setCategoryClubs: (state, action) => {
      state.category = action.payload
    },
    setStatus: (state, action) => {
      state.status = action.payload
    }
  },
  extraReducers: (builder) => {
    const actionList = [loadClubs, createClub, updateClub, deleteClub, loadClubsByCategory]
    actionList.forEach(action => {
      builder.addCase(action.pending, (state) => {
        state.loading = true;
      })
    })
    // load
    builder.addCase(loadClubs.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.clubs = [...action.payload.datas];
        state.total = action.payload.total || 0
      }
    });
    builder.addCase(loadClubs.rejected, (state) => {
      state.loading = false;
    })
    // loadClubsByCategory
    builder.addCase(loadClubsByCategory.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.clubs = [...action.payload];
      }
    });
    builder.addCase(loadClubsByCategory.rejected, (state) => {
      state.loading = false;
    })

    // createClub
    builder.addCase(createClub.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.notifications = {
          isError: false,
          message: 'Tạo thành công'
        }
      }
    });
    builder.addCase(createClub.rejected, (state) => {
      state.loading = false;
      state.notifications = {
        isError: true,
        message: 'Lỗi! tạo không thành công'
      }
    })
    // updateClub
    builder.addCase(updateClub.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.notifications = {
          isError: false,
          message: 'Cập nhật thành công'
        }
      }
    });
    builder.addCase(updateClub.rejected, (state) => {
      state.loading = false;
      state.notifications = {
        isError: true,
        message: 'Lỗi! cập nhật không thành công'
      }
    })
    // deleteClub
    builder.addCase(deleteClub.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.notifications = {
          isError: false,
          message: 'Xóa thành công'
        }
      }
    });
    builder.addCase(deleteClub.rejected, (state) => {
      state.loading = false;
      state.notifications = {
        isError: true,
        message: 'Lỗi! xóa không thành công'
      }
    })
    // setPresidentClub
    builder.addCase(setPresidentClubs.pending, state => { state.loading = true })
    builder.addCase(setPresidentClubs.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload) {
        state.notifications = {
          isError: false,
          message: 'Thêm chủ tịch thành công'
        }
      }
    })
    builder.addCase(setPresidentClubs.rejected, (state) => {
      state.loading = false
      state.notifications = {
        isError: false,
        message: 'Lỗi! thêm chủ tịch không thành công'
      }
    })
  },
});

export const { resetIsNotification, setCategoryClubs, setStatus } = clubs.actions;

const clubsReducer = clubs.reducer;
export default clubsReducer;
