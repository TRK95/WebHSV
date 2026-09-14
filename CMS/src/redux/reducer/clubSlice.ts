import { apiSetPresidentClub } from "@/api/clubMembersApi";
import { apiCreateClubApi, apiGetClubsByCategory, apiGetClubsByPresidentId, apiUpdateClubApi, getClubsByTypeApi, reqBodyCreateClubs, reqQueryClubs } from "@/api/clubsApi";
import Club from "@/models/Club";
import ClubMember from "@/models/ClubMember";
import { PAGE_SIZE, RESPONSE_SUCCESS, STATUS_DELETED, STATUS_PUBLIC } from "@/utils/contrants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from ".";
import { apiAuthorizeByToken } from "@/api/userInfoApi";
import { UserInfoI } from "@/models/UserInfo";

export type ClubsState = {
  clubs: Club[],
  loading: boolean,
  total: number,
  category: string,
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
  category: '',
  status: STATUS_PUBLIC,
  notifications: {
    isError: false,
    message: ''
  }
};

export const loadClubsByCategory = createAsyncThunk(
  "club/loadClubsByCategory", async (dataBody: {
    categoryId: string,
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
    let dataClubs
    const presidentInfo = localStorage.getItem("presidentInfo")
    const presidentToken = localStorage.getItem("presidentToken")
    if (!presidentInfo) {
      dataClubs = await getClubsByTypeApi({ reqQuery: dataBody });
    } else if (presidentToken !== null) {
      const parsedPresidentInfo = await apiAuthorizeByToken({ token: presidentToken });
      const presidentId = parsedPresidentInfo.data.userId

      if (presidentId) {
        dataClubs = await apiGetClubsByPresidentId({ presidentId });
      } else {
        throw new Error('Invalid president information');
      }
    }
    if (dataClubs.status === RESPONSE_SUCCESS) {
      const datas = dataClubs.data.map(data => new Club(data))
      return { datas, total: dataClubs.total };
    }
  }
);

export const loadClubByPresidentId = createAsyncThunk(
  "club/loadClubByPresidentId",
  async (dataBody: { presidentId: string }) => {
    const dataClubs = await apiGetClubsByPresidentId(dataBody)
    if (dataClubs.status === RESPONSE_SUCCESS) {
      const datas = dataClubs.data.map(data => new Club(data))
      return { datas };
    }
  }
);

export const createClub = createAsyncThunk(
  "club/createClub",
  async (dataBody: Club, { dispatch, getState }) => {
    const store: any = getState()
    const { presidentId, president, ...datas } = dataBody
    const dataClub = await apiCreateClubApi({ reqBody: dataBody })
    if (dataClub.status === RESPONSE_SUCCESS) {
      const data = new Club(dataClub.data);
      if (presidentId) {
        dispatch(setPresidentClubs({
          user: president,
          clubId: data._id || '',
        }))
      }
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
        if (isLoadClub) {
          dispatch(loadClubs({
            limit: PAGE_SIZE,
            offset: 0,
            type: dataBody.type,
            status: store.clubsReducer.status
          }))
        }
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
    user: any,
    clubId: string
  }) => {
  const dataClubMember = await apiSetPresidentClub({ clubId: dataBody.clubId }, { user: dataBody.user })
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
    const actionList = [loadClubs, loadClubByPresidentId, createClub, updateClub, deleteClub, loadClubsByCategory]
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
    // load by president Id
    builder.addCase(loadClubByPresidentId.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.clubs = [...action.payload.datas];
        state.total = 1
      }
    });
    builder.addCase(loadClubByPresidentId.rejected, (state) => {
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
          message: 'tạo thành công'
        }
      }
    });
    builder.addCase(createClub.rejected, (state) => {
      state.loading = false;
      state.notifications = {
        isError: true,
        message: 'lỗi! tạo không thành công'
      }
    })
    // updateClub
    builder.addCase(updateClub.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.notifications = {
          isError: false,
          message: 'cập nhật thành công'
        }
      }
    });
    builder.addCase(updateClub.rejected, (state) => {
      state.loading = false;
      state.notifications = {
        isError: true,
        message: 'lỗi! cập nhật không thành công'
      }
    })
    // deleteClub
    builder.addCase(deleteClub.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.notifications = {
          isError: false,
          message: 'xóa thành công'
        }
      }
    });
    builder.addCase(deleteClub.rejected, (state) => {
      state.loading = false;
      state.notifications = {
        isError: true,
        message: 'lỗi! xóa không thành công'
      }
    })
    // setPresidentClub
    builder.addCase(setPresidentClubs.pending, state => { state.loading = true })
    builder.addCase(setPresidentClubs.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload) {
        state.notifications = {
          isError: false,
          message: 'thêm chủ tịch thành công'
        }
      }
    })
    builder.addCase(setPresidentClubs.rejected, (state) => {
      state.loading = false
      state.notifications = {
        isError: false,
        message: 'lỗi! thêm chủ tịch không thành công'
      }
    })
  },
});

export const { resetIsNotification, setCategoryClubs, setStatus } = clubs.actions;

const clubsReducer = clubs.reducer;
export default clubsReducer;
