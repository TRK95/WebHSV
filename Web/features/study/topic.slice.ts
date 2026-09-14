import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { persistReducer } from "redux-persist";
import { EXAM_SCORE_FINISH, EXAM_SCORE_PAUSE, TOPIC_TYPE_TEST } from "../../modules/share/constraint";
import MyCardData from "../../modules/share/model/myCardData";
import { StudyScore } from "../../modules/share/model/studyScore";
import StudyScoreDetail from "../../modules/share/model/studyScoreDetail";
import Topic from "../../modules/share/model/topic";
import TopicExercise from "../../modules/share/model/topicExercise";
import TopicProgress from "../../modules/share/model/topicProgress";
import { HydrateAppAction } from "../../types/nextReduxTypes";
import { MapCardBox } from "./game/game.slice";
import { apiBulkUpdateTopicProgresses, apiCreateStudyData, apiCreateStudyDataAgain, apiGetStudyData, apiGetTopicById, apiGetTopicProgresses, apiGetTopicsByParentSlug, apiOffsetTopicsByParentId, apiResetCardStudyData, apiUpdateStudyData, apiUpdateStudyResult, apiUpdateStudyScoreDetail } from "./topic.api";
import { ClientTopicProgress, CreateAppPracticeDataArgs, GetTopicsByParentSlugArgs, OffsetTopicsByParentIdArgs, UpdateAppPracticeDataArgs, UpdateAppPracticeResultArgs } from "./topic.model";
import { gameLocalStore, getRelaTopicList } from "./topic.utils";

export type TopicItem = Topic & {
  topicProgress?: TopicProgress;
  topicExercise: Pick<TopicExercise, "questionsNum" | "contentType" | "duration">;
}

export type MapParentTopics = {
  [parentId: string]: {
    fetched: boolean;
    data: Topic[];
  }
}

export type MapTopicProgress = {
  [examId: string]: ClientTopicProgress
}

export type MapCurrentProgress = {
  [topicId: string]: {
    currentProgress?: ClientTopicProgress
    relaProgress: number;
    totalParts: number;
    parentId: string | null;
  }
}

export const fetchTopicProgresses = createAsyncThunk("topic/fetchTopicProgresses", async (args: {
  topicIds: string[];
  userId: string;
  currentTopicId?: string;
  currentTopicType?: number;
  studyScoreDataId?: string;
}) => {
  const { currentTopicId, currentTopicType, studyScoreDataId, ...rest } = args;

  const progresses = await apiGetTopicProgresses(rest);
  let currentStudyScore: StudyScore & { myCardData?: MyCardData } | null = null;
  if (currentTopicId) {
    currentStudyScore = await apiGetStudyData({ topicId: currentTopicId, userId: rest.userId, studyScoreDataId });
  }
  return {
    progresses,
    currentStudyScore,
    userId: rest.userId,
    currentTopicId,
    currentTopicType
  };
});

export const createAppPracticeData = createAsyncThunk("topic/createAppPracticeData", async (args: CreateAppPracticeDataArgs) => {
  const createdData = await apiCreateStudyData(args);
  return createdData;
});

export const createAppPracticeDataAgain = createAsyncThunk("topic/createAppPracticeDataAgain", async (args: CreateAppPracticeDataArgs & { studyScoreId: string }) => {
  const createdData = await apiCreateStudyDataAgain(args);
  return createdData;
});

export const updateAppPracticeData = createAsyncThunk("topic/updateAppPracticeData", async (args: UpdateAppPracticeDataArgs) => {
  const updated = await apiUpdateStudyData(args);
  return updated;
});

export const updateAppPracticeResult = createAsyncThunk("topic/updateAppPracticeResult", async (args: UpdateAppPracticeResultArgs) => {
  const updated = await apiUpdateStudyResult(args);
  return updated;
});

export const bulkUpdateTopicProgresses = createAsyncThunk("topic/bulkUpdateTopicProgresses", async (args: TopicProgress[]) => {
  await apiBulkUpdateTopicProgresses({ topicProgresses: args });
});

export const updateStudyScoreDetail = createAsyncThunk("topic/updateStudyScoreDetail", async (args: StudyScoreDetail & {
  updateCardDate?: boolean;
  boxCardValue?: number;
}) => {
  await apiUpdateStudyScoreDetail(args);
});

export const resetCardStudyData = createAsyncThunk("topic/resetCardStudyData", async (args: { studyScoreDataId: string }) => {
  await apiResetCardStudyData(args);
});

export const fetchRelaTopics = createAsyncThunk("topic/fetchRelaTopics", async (topic: TopicItem & { topicTypes?: number[] }) => {
  const topics = await getRelaTopicList(topic, false, topic.topicTypes);
  return topics;
});

export const fetchTopicsByParentId = createAsyncThunk("topic/fetchTopicsByParentId", async (args: OffsetTopicsByParentIdArgs) => {
  const topics = await apiOffsetTopicsByParentId(args);
  return {
    parentId: args.parentId,
    topics
  }
});

export const fetchTopicsByParentSlug = createAsyncThunk("topic/fetchTopicsByParentSlug", async (args: GetTopicsByParentSlugArgs) => {
  const data = await apiGetTopicsByParentSlug(args);
  return data;
});

export const fetchCurrentTopic = createAsyncThunk("topic/fetchCurrentTopic", async (args: { topicId }) => {
  const topic = await apiGetTopicById({ topicId: args.topicId });
  return topic;
})

export type TopicState = {
  list: TopicItem[];
  rootTopic: Topic;
  subTopic: TopicItem;
  currentTopic: TopicItem;
  loading: boolean;
  hasSub: boolean;
  fetchedTopicProgresses: boolean;
  topicByParentId: Topic[];
  loadTopicPractice: Topic[];
  loadTopicTest: Topic[];
  topicProgresses: MapTopicProgress;
  mapParentTopics: MapParentTopics;
  mapCurrentProgress: MapCurrentProgress | null;
  courseId: string;
  studyScore: StudyScore | null,
  studyScoreId: string;
  studyScoreTotalCorrect: number | null;
  studyScoreDataId: string;
  shuffleQuestionOrder: string[] | null;
  topicProgressId: string;
  topicProgressesToUpdate: ClientTopicProgress[] | null;
  studyBaseSlug: string;
  showStudyView: boolean;
  studyAgain: boolean;
  isFetchStatistic: boolean;
  refreshGame: boolean;
}

const initialState: TopicState = {
  list: [],
  rootTopic: null,
  subTopic: null,
  currentTopic: null,
  loading: true,
  hasSub: false,
  fetchedTopicProgresses: false,
  topicByParentId: [],
  loadTopicPractice: [],
  loadTopicTest: [],
  topicProgresses: {},
  mapParentTopics: {},
  mapCurrentProgress: null,
  courseId: '',
  studyScore: null,
  studyScoreId: '',
  studyScoreTotalCorrect: null,
  studyScoreDataId: '',
  shuffleQuestionOrder: null,
  topicProgressId: '',
  topicProgressesToUpdate: null,
  studyBaseSlug: '',
  showStudyView: false,
  studyAgain: false,
  isFetchStatistic: true,
  refreshGame: false,
}

const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {
    setTopics: (state, action: PayloadAction<TopicItem[]>) => {
      state.list = action.payload;
    },
    setRootTopic: (state, action: PayloadAction<Topic>) => {
      state.rootTopic = action.payload
    },
    setSubTopic: (state, action: PayloadAction<TopicItem>) => {
      state.subTopic = action.payload
    },
    setCurrentTopic: (state, action: PayloadAction<TopicItem>) => {
      state.currentTopic = action.payload;
    },
    setStudyScoreDataId: (state, action: PayloadAction<{ studyScoreDataId: string }>) => {
      state.studyScoreDataId = action.payload.studyScoreDataId;
    },
    setTopicLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setHasSub: (state, action: PayloadAction<boolean>) => {
      state.hasSub = action.payload
    },
    setFetchedTopicProgresses: (state, action: PayloadAction<boolean>) => {
      state.fetchedTopicProgresses = action.payload;
    },
    initClientTopicProgress: (state, action: PayloadAction<{ userId: string }>) => {
      const progressIds = Object.keys(state.topicProgresses);
      progressIds.forEach((id) => {
        if (state.topicProgresses[id]?.userId !== action.payload.userId) state.topicProgresses[id] = undefined;
      });
      state.fetchedTopicProgresses = true;
    },
    setCurrentStudyInfo: (state: TopicState, action: PayloadAction<{
      courseId?: string;
      studyScoreId?: string;
      studyScoreDataId?: string;
      topicProgressId?: string;
    }>) => {
      [
        "courseId",
        "studyScoreId",
        "studyScoreDataId",
        "topicProgressId"
      ].forEach((key) => {
        if (typeof action.payload[key] !== "undefined") {
          state[key] = action.payload[key] ?? '';
        }
      });
    },
    setTopicByParentId: (state, action: PayloadAction<Topic[]>) => {
      state.topicByParentId = action.payload;
    },
    setLoadTopicPractice: (state, action: PayloadAction<Topic[]>) => {
      state.loadTopicPractice = action.payload;
    },
    setLoadTopicTest: (state, action: PayloadAction<Topic[]>) => {
      state.loadTopicTest = action.payload;
    },
    updateTopicProgress: (state, action: PayloadAction<ClientTopicProgress>) => {
      const updated: ClientTopicProgress[] = [];
      updateCurrentProgressRecursive({ updated, mapCurrentProgress: state.mapCurrentProgress, item: action.payload });
      updated.forEach((progress) => {
        state.topicProgresses[progress.id] = progress;
      });
      state.topicProgressesToUpdate = updated;
    },
    removeTopicProgressesToUpdate: (state) => {
      state.topicProgressesToUpdate = null;
    },
    updateTopicProgressTestOnDevice: (state, action: PayloadAction<ClientTopicProgress>) => {
      state.topicProgresses[action.payload.id] = action.payload;
    },
    setMapCurrentProgress: (state, action: PayloadAction<MapCurrentProgress | null>) => {
      state.mapCurrentProgress = action.payload;
    },
    updateTestTime: (state, action: PayloadAction<{ topicId: string; skillId?: string; second: number }>) => {
      const { topicId, skillId = '', second } = action.payload;
      const id = `${topicId}${skillId ? `_${skillId}` : ''}`;
      // state.topicProgresses[id] = 
      const newTopicProgress = ClientTopicProgress.clone(state.topicProgresses[id] || {} as ClientTopicProgress);
      newTopicProgress.setTotalTime(second);
      state.topicProgresses[id] = newTopicProgress;
    },
    initCardOrderPractice: (state, action: PayloadAction<ClientTopicProgress>) => {
      state.topicProgresses[action.payload.id] = action.payload;
    },
    updateTopicBoxCard: (state, action: PayloadAction<{ topicId: string; boxCard: MapCardBox }>) => {
      const oldTopicProgress = state.topicProgresses[action.payload.topicId];
      if (oldTopicProgress) {
        oldTopicProgress.boxCard = action.payload.boxCard;
      }
    },
    setStudyBaseSlug: (state, action: PayloadAction<string>) => {
      state.studyBaseSlug = action.payload;
    },
    setShowStudyView: (state, action: PayloadAction<boolean>) => {
      state.showStudyView = action.payload;
    },
    setStudyAgain: (state, action: PayloadAction<boolean>) => {
      state.studyAgain = action.payload;
    },
    setIsFetchStatistic: (state, action: PayloadAction<boolean>) => {
      state.isFetchStatistic = action.payload;
    },
    refreshStudyGame: (state, action: PayloadAction<boolean>) => {
      state.refreshGame = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: HydrateAppAction) => {
      state.list = action.payload?.topicState?.list ?? initialState.list;
      state.loading = action.payload?.topicState?.loading ?? initialState.loading;
    });
    builder.addCase(fetchTopicProgresses.fulfilled, (state, action) => {
      const { progresses, currentStudyScore, currentTopicId, currentTopicType, userId } = action.payload;
      let clientTopicProgresses = progresses.map((e) => ClientTopicProgress.fromServerTopicProgress(e));
      if (!!currentTopicId) {
        clientTopicProgresses = clientTopicProgresses.filter((e) => e.topicId !== currentTopicId);
        if (currentTopicType !== TOPIC_TYPE_TEST) {
          if (!!currentStudyScore) {
            state.studyScore = currentStudyScore;
            state.studyScoreId = currentStudyScore._id;
            state.studyScoreDataId = currentStudyScore.studyScoreData?._id;
            state.shuffleQuestionOrder = currentStudyScore.studyScoreData?.shuffleQuestionOrder;
            clientTopicProgresses.push(ClientTopicProgress.fromServerStudyScore(currentStudyScore));
          }
        } else {
          if (!!currentStudyScore) {
            state.studyScore = currentStudyScore;
            state.studyScoreId = currentStudyScore._id;
            state.studyScoreDataId = currentStudyScore.studyScoreData?._id;
          }
          const currentTestProgress = state.topicProgresses[currentTopicId];
          if ([EXAM_SCORE_PAUSE, EXAM_SCORE_FINISH].includes(currentStudyScore?.status)) {
            // USING SERVER SIDE PROGRESS
            if (!!currentTestProgress && currentTestProgress.userId === userId) {
              clientTopicProgresses.push(Object.assign(
                currentTestProgress,
                !!currentStudyScore ? ClientTopicProgress.fromServerStudyScore(currentStudyScore) : {} as ClientTopicProgress
              ));
            } else {
              clientTopicProgresses.push(ClientTopicProgress.fromServerStudyScore(currentStudyScore));
            }
          } else {
            // USING CLIENT SIDE PROGRESS
            if (!!currentTestProgress && currentTestProgress.userId === userId) {
              clientTopicProgresses.push(currentTestProgress);
            }
          }
        }
      }
      const oldProgressKeys = Object.keys(state.topicProgresses);
      const oldProgresses = oldProgressKeys.reduce((map, e) => {
        let oldProgress = state.topicProgresses[e];
        if (oldProgress?.userId === userId) map[e] = oldProgress;
        return map
      }, {} as MapTopicProgress)
      state.topicProgresses = {
        ...oldProgresses,
        ...(clientTopicProgresses.reduce((map: MapTopicProgress, e) => {
          map[e.id] = e;
          return map;
        }, {} as MapTopicProgress))
      }
      state.fetchedTopicProgresses = true;
    });
    builder.addCase(createAppPracticeData.fulfilled, (state, action) => {
      const clientTopicProgresses = ClientTopicProgress.fromServerStudyScore(action.payload.studyScore);
      state.studyScore = action.payload.studyScore;
      state.studyScoreId = action.payload.studyScore?._id;
      state.studyScoreDataId = action.payload.studyScore?.studyScoreData?._id;
      state.topicProgresses[clientTopicProgresses.id] = clientTopicProgresses;
      state.fetchedTopicProgresses = true;
    });
    builder.addCase(createAppPracticeDataAgain.fulfilled, (state, action) => {
      state.studyScoreDataId = action.payload.studyScoreData?._id;
    });
    builder.addCase(updateAppPracticeData.fulfilled, (state) => {
      state.topicProgressesToUpdate = null;
    });
    builder.addCase(updateAppPracticeResult.fulfilled, (state, action) => {
      const { studyScoreTotalCorrect }: { studyScoreTotalCorrect: number } = action.payload;
      if (studyScoreTotalCorrect) {
        state.studyScoreTotalCorrect = studyScoreTotalCorrect
      }
      state.topicProgressesToUpdate = null;
    });
    builder.addCase(bulkUpdateTopicProgresses.fulfilled, (state) => {
      state.topicProgressesToUpdate = null;
    });
    builder.addCase(fetchRelaTopics.fulfilled, (state, action) => {
      state.list = action.payload;
    });
    builder.addCase(fetchTopicsByParentId.fulfilled, (state, action) => {
      const { parentId, topics } = action.payload;
      state.mapParentTopics = {
        ...state.mapParentTopics,
        [parentId]: {
          fetched: true,
          data: topics
        }
      }
    });
    builder.addCase(fetchTopicsByParentSlug.fulfilled, (state, action) => {
      const data = action.payload;
      data.forEach(({ children: data, ...parent }) => {
        state.mapParentTopics = {
          ...state.mapParentTopics,
          [parent.slug]: {
            fetched: true,
            data
          }
        }
      });
    });
    builder.addCase(fetchCurrentTopic.fulfilled, (state, action) => {
      if (action.payload) {
        state.currentTopic = action.payload;
      }
    });
  }
});

const updateCurrentProgressRecursive = (args: {
  updated: ClientTopicProgress[];
  mapCurrentProgress: MapCurrentProgress;
  item: ClientTopicProgress;
}) => {
  const { updated, mapCurrentProgress, item } = args;
  if (!mapCurrentProgress && !item) return;
  updated.push(item);
  if (!mapCurrentProgress) return;
  const currentProgress = mapCurrentProgress[item.topicId];
  if (!currentProgress || !currentProgress?.parentId) return;
  const _parentProgress = ((currentProgress?.relaProgress ?? 0) + (item.progress ?? 0)) / (currentProgress?.totalParts || 1);
  const parentProgress = Math.round((_parentProgress / 100 + Number.EPSILON) * 100);
  const parentCurrentProgress = mapCurrentProgress[currentProgress.parentId];
  const parentItem = ClientTopicProgress.clone(parentCurrentProgress?.currentProgress || new ClientTopicProgress({
    userId: item.userId, topicId: currentProgress.parentId
  }));
  parentItem.setProgress(parentProgress ?? 0);
  parentItem.setUserId(item.userId);
  updateCurrentProgressRecursive({ updated, item: parentItem, mapCurrentProgress });
}

export const {
  setTopics,
  setRootTopic,
  setSubTopic,
  setCurrentTopic,
  setStudyScoreDataId,
  setTopicLoading,
  setHasSub,
  setFetchedTopicProgresses,
  initClientTopicProgress,
  setCurrentStudyInfo,
  setTopicByParentId,
  setLoadTopicPractice,
  setLoadTopicTest,
  updateTopicProgress,
  removeTopicProgressesToUpdate,
  updateTopicProgressTestOnDevice,
  setMapCurrentProgress,
  updateTestTime,
  initCardOrderPractice,
  updateTopicBoxCard,
  setStudyBaseSlug,
  setShowStudyView,
  setStudyAgain,
  setIsFetchStatistic,
  refreshStudyGame,
} = topicSlice.actions;


// const topicSliceReducer = typeof window === "undefined"
//   ? topicSlice.reducer
//   : persistReducer({
//     key: "topic-progress",
//     storage: gameLocalStore,
//     whitelist: ["topicProgresses"],
//     timeout: null
//   }, topicSlice.reducer);

const topicSliceReducer = topicSlice.reducer

export default topicSliceReducer;
