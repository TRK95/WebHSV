import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import MockTest from "../../modules/share/model/mockTest";
import Topic from "../../modules/share/model/topic";
import { apiOffsetTopicsByParentId } from "../study/topic.api";
import { gameLocalStore } from "../study/topic.utils";
import { apiCreateMockTest, apiGetMockTestById, apiGetMockTests } from "./customTest.api";

export const CUSTOM_TEST_LIMIT = 4;
export const customTestPageKey = "_custom_test_page";

export enum CreateCustomTestStatus {
  INIT,
  CREATING,
  FINISH,
  ERROR
}

export type CustomTestState = {
  ready: boolean;
  data: MockTest[];
  list: MockTest[];
  total: number;
  page: number;
  openCreateModal: boolean;
  samples: Topic[];
  selectedSamples: string[];
  fetchedSamples: boolean;
  mouseOnCta: boolean;
  createStatus: CreateCustomTestStatus;
  currentTest: MockTest | null;
}

const initialState: CustomTestState = {
  ready: false,
  data: [],
  list: [],
  total: 0,
  page: 1,
  openCreateModal: false,
  samples: [],
  selectedSamples: [],
  fetchedSamples: false,
  mouseOnCta: false,
  createStatus: CreateCustomTestStatus.INIT,
  currentTest: null
}

export const fetchCustomTests = createAsyncThunk("customTest/fetchTests", async (args: {
  courseId: string;
  userId: string;
  skip?: number;
}) => {
  const response = await apiGetMockTests({
    ...args,
    fields: ["_id", "title", "questionsNum", "duration", "createdAt", "studyInfo", "updatedAt"],
    limit: CUSTOM_TEST_LIMIT
  });
  return response;
});

export const requestAddCustomTest = createAsyncThunk("customTest/createTest", async (args: {
  userId: string;
  courseId: string;
  duration: number;
  questionsNum: number;
  pass: number;
  cardStudyOrder: number;
  topicIds?: string[];
  offline?: boolean;
  excludedCardIds?: string[]
}) => {
  const data = await apiCreateMockTest(args);
  return data;
});

export const fetchCustomTestSamples = createAsyncThunk("customTest/fetchSamples", async (args: {
  courseId: string;
  limit: number;
  parentId: string | null;
}) => {
  const data = await apiOffsetTopicsByParentId({
    ...args,
    skip: 0,
    topicFields: ["_id", "name"]
  });
  return data;
});

export const fetchCurrentTest = createAsyncThunk("customTest/fetchCurrentTest", async (_id: string) => {
  const data = apiGetMockTestById({ _id });
  return data;
})

const customTestSlice = createSlice({
  name: "mockTest",
  initialState,
  reducers: {
    addCustomTest: (state, action: PayloadAction<MockTest>) => {
      state.list = [action.payload, ...state.list];
    },
    setCurrentCustomTestList: (state, action: PayloadAction<MockTest[]>) => {
      state.data = action.payload;
    },
    setTotalCustomTest: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setCustomTestPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setCustomTestList: (state, action: PayloadAction<MockTest[]>) => {
      state.list = action.payload;
    },
    putCustomTest: (state, action: PayloadAction<MockTest>) => {
      const index = state.list.findIndex((e) => e._id === action.payload._id);
      if (index !== -1) {
        const _list = [...state.list];
        _list.splice(index, 1, action.payload);
        state.list = _list;
      }
    },
    setOpenCreateModal: (state, action: PayloadAction<boolean>) => {
      state.openCreateModal = action.payload;
    },
    setSelectedSamples: (state, action: PayloadAction<string[]>) => {
      state.selectedSamples = action.payload;
    },
    setMouseOnCta: (state, action: PayloadAction<boolean>) => {
      state.mouseOnCta = action.payload
    },
    setCreateCustomTestStatus: (state, action: PayloadAction<CreateCustomTestStatus>) => {
      state.createStatus = action.payload;
    },
    setCurrentTest: (state, action: PayloadAction<MockTest | null>) => {
      state.currentTest = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomTests.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.total = action.payload.total;
    });

    builder.addCase(requestAddCustomTest.fulfilled, (state, action) => {
      if (action.payload) {
        const test = action.payload;
        if (!test.title) Object.assign(test, { title: `My Test ${state.list.length + 1}` });
        state.list = [test, ...state.list];
        state.total = state.total + 1;
        if (state.page === 1) {
          const oldData = state.data;
          if (oldData.length < CUSTOM_TEST_LIMIT) {
            state.data = [test, ...oldData]
          } else {
            state.data = [test, ...oldData.slice(0, CUSTOM_TEST_LIMIT - 1)]
          }
        };
        state.createStatus = CreateCustomTestStatus.FINISH;
      } else {
        state.createStatus = CreateCustomTestStatus.ERROR;
      }
    });

    builder.addCase(requestAddCustomTest.rejected, (state, action) => {
      state.createStatus = CreateCustomTestStatus.ERROR;
    });

    builder.addCase(fetchCustomTestSamples.fulfilled, (state, action) => {
      state.samples = action.payload;
      state.selectedSamples = action.payload.map((e) => e._id);
      state.fetchedSamples = true;
    });

    builder.addCase(fetchCurrentTest.fulfilled, (state, action) => {
      state.currentTest = action.payload;
    });
  }
});

export const {
  addCustomTest,
  putCustomTest,
  setCurrentCustomTestList,
  setCustomTestList,
  setCustomTestPage,
  setTotalCustomTest,
  setOpenCreateModal,
  setSelectedSamples,
  setMouseOnCta,
  setCreateCustomTestStatus,
  setCurrentTest
} = customTestSlice.actions;

// const customTestReducer = typeof window === "undefined"
//   ? customTestSlice.reducer
//   : persistReducer({
//     key: "mocktest",
//     storage: gameLocalStore,
//     whitelist: ["list"],
//     timeout: null
//   }, customTestSlice.reducer);

const customTestReducer = customTestSlice.reducer

export default customTestReducer;