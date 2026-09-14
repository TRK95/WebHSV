import { apiGetEvent, apiUpdateEvent, reqQueryEvents } from "@/api/eventsApi"
import Event from "@/models/Event"
import { PAGE_SIZE, RESPONSE_SUCCESS, STATUS_DELETED, STATUS_PUBLIC } from "@/utils/contrants"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export type EventState = {
  events: Event[],
  loading: boolean,
  total: number,
  status: number,
  notifications: {
    isError: boolean,
    message: string
  }
}

const initialState: EventState = {
  events: [],
  loading: false,
  total: 0,
  status: STATUS_PUBLIC,
  notifications: {
    isError: false,
    message: ''
  }
}

export const loadEvents = createAsyncThunk(
  "events/loadEvents", async (dataBody: reqQueryEvents) => {
    const dataEvents = await apiGetEvent(dataBody)
    if (dataEvents.status === RESPONSE_SUCCESS) {
      const datas = dataEvents.data.map(data => new Event(data))
      return { datas, total: dataEvents.total };
    }
  }
)
export const createOrUpdateEvents = createAsyncThunk(
  "events/createOrUpdateEvents", async (dataBody: Event, { dispatch, getState }) => {
    const store: any = getState()
    const dataEvents = await apiUpdateEvent(dataBody)
    if (dataEvents.status === RESPONSE_SUCCESS) {
      // trường hợp tạo thành công
      // if (!dataBody?.id) {
      if (!dataBody?._id) {
        dispatch(setNotification({
          isError: false,
          message: 'tạo thành công'
        }))
      } else if (dataBody?.status === STATUS_DELETED) {
        // trường hợp xóa
        dispatch(setNotification({
          isError: false,
          message: 'xóa thành công'
        }))
      } else {
        // trường hợp cập nhật
        dispatch(setNotification({
          isError: false,
          message: 'cập nhật thành công'
        }))
      }
      dispatch(loadEvents({
        limit: PAGE_SIZE,
        offset: 0,
        status: store.eventsReducer.status
      }))
    } else {
      dispatch(setNotification({
        isError: true,
        message: 'Lỗi!!'
      }))
    }
  }
)

const events = createSlice({
  name: "events",
  initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload
    },
    resetNotification: (state) => {
      state.notifications = {
        isError: false,
        message: ''
      }
    },
    setNotification: (state, action) => {
      state.notifications = action.payload
    }
  },
  extraReducers: (builder) => {
    const actionList = [loadEvents, createOrUpdateEvents]
    actionList.forEach(action => {
      builder.addCase(action.pending, (state) => {
        state.loading = true;
      })
    })
    // load events 
    builder.addCase(loadEvents.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.events = [...action.payload.datas];
        state.total = action.payload.total || 0
      }
    });
    builder.addCase(loadEvents.rejected, (state) => {
      state.loading = false;
    })
    // create or update or delete events 
    builder.addCase(createOrUpdateEvents.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(createOrUpdateEvents.rejected, (state) => {
      state.loading = false;
    })
  }
})

export const { setStatus, resetNotification, setNotification } = events.actions;

const eventsReducer = events.reducer;
export default eventsReducer;