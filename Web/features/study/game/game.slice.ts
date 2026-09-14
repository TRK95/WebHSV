import { createAsyncThunk, createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit"
import _ from "lodash"
import { persistReducer } from "redux-persist"
import { CARD_HAS_CHILD } from "../../../modules/share/constraint"
import { Card, CardGames } from "../../../modules/share/model/card"
import Skill from "../../../modules/share/model/skill"
import { gameLocalStore } from "../topic.utils"
import { FillParaGameObject } from "./fillPara/FillParaGameObject"
import { FlashCardGameObject } from "./flashCard/FlashCardGameObject"
import { apiGetCardsByIds, apiGetCardsByTopicId, apiGetSkillsByExamType } from "./game.api"
import { CLASS_GAME_FILL_PARAGRAPH, ClientCardProgress, GameFunction, GameObject, GameObjectStatus, GameTypes, QuestionItem } from "./game.core"
import { ParaGameObject } from "./para/ParaGameObject"
import { QuizClientCardProgress, QuizGameObject } from "./quiz/QuizGameObject"
import { SpellingClientCardProgress, SpellingGameObject } from "./spelling/SpellingGameObject"

export type MapCardProgress = {
  [studyId: string]: ClientCardProgress;
}

export type MapExamTypeSkills = {
  [examType: number]: {
    fetched: boolean;
    data: Skill[];
  }
}

export type MapCardBox = {
  [cardId: string]: number;
}

/** Map<CorrectTime, cardIds> */
export type MapCorrectBox = {
  [correctTime: number]: string[];
}

export enum ReplayMode {
  NONE = 0,
  CORRECT,
  INCORRECT
}

export enum TestView {
  PLAY = -1,
  NEW = 0,
  CONTINUE = 1,
  REVIEW = 2,
  END = 3
}

export enum FlashCardView {
  OVERVIEW = 0,
  CARD = 1,
  GAME = 2,
  END = 3
}

export enum CardStudyOrder {
  DEFAULT = -1,
  NEW = 0,
  MEMORIZED = 1,
  UNMEMORIZED = 2,
  MARKED = 3
}

export const RENDERED_REVIEW_MIN_INDEX = 25;

export type GameState = {
  gameKey: any;
  cards: Card[];
  fetchedCard: boolean;
  sortedCard: boolean;
  questionItems: QuestionItem[];
  gameObjects: GameObject[];
  currentGameIdx: number;
  currentQuestionIdx: number;
  currentGame: GameObject | null;
  currentQuestion: QuestionItem | null;
  gameType: GameTypes;
  showResultOnAnswer: boolean | null;
  loading: boolean;
  showNext: boolean;
  showReviewNav: boolean;
  currentGameViewIdx: number;
  isDone: boolean;
  cardProgresses: MapCardProgress;
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
  replayMode: ReplayMode;
  testView: TestView;
  flashCardView: FlashCardView;
  questionsPlayNum: number;
  cardStudyOrder: CardStudyOrder;
  duration: number;
  pauseForSubmit: boolean;
  userPlaying: boolean;
  gameFunction: GameFunction | null;
  fetchedCardProgresses: boolean;
  openRestartDialog: boolean;
  openSubmitDialog: boolean;
  mathJax: boolean;
  renderedReviewIndex: number;
  mapExamTypeSkills: MapExamTypeSkills;
  boxCard: MapCardBox;
  updateBoxCard: MapCardBox | null;
  isCheckShowCollapse: boolean;
  forceReviewPractice: boolean;
  disableAutoPlayAudio: boolean;
  currentCardId: string | null;
}

const initialState: GameState = {
  gameKey: null,
  cards: [],
  fetchedCard: false,
  sortedCard: false,
  questionItems: [],
  gameObjects: [],
  currentGame: null,
  currentGameIdx: -1,
  currentQuestion: null,
  currentQuestionIdx: -1,
  gameType: GameTypes.INIT,
  showResultOnAnswer: null,
  loading: true,
  showNext: false,
  showReviewNav: false,
  currentGameViewIdx: -1,
  isDone: false,
  cardProgresses: {},
  totalQuestions: 0,
  totalCorrect: 0,
  totalIncorrect: 0,
  replayMode: ReplayMode.NONE,
  testView: TestView.NEW,
  flashCardView: FlashCardView.OVERVIEW,
  questionsPlayNum: 0,
  cardStudyOrder: CardStudyOrder.DEFAULT,
  duration: 0,
  pauseForSubmit: false,
  userPlaying: false,
  gameFunction: null,
  fetchedCardProgresses: false,
  openRestartDialog: false,
  openSubmitDialog: false,
  mathJax: true,
  renderedReviewIndex: RENDERED_REVIEW_MIN_INDEX,
  mapExamTypeSkills: {},
  boxCard: {},
  updateBoxCard: null,
  isCheckShowCollapse: false,
  forceReviewPractice: false,
  disableAutoPlayAudio: false,
  currentCardId: null,
}

export const fetchCards = createAsyncThunk("game/fetchCards", async (topicId: string) => {
  const cards = await apiGetCardsByTopicId({ topicId });
  return cards?.filter(item => (item.answer?.texts?.length || item.hasChild === CARD_HAS_CHILD)) ?? [];
});

export const fetchCardsRandomByPercent = createAsyncThunk("game/fetchCardsRandomByPercent", async (args: { topicId: string, questionTotal?: number, level?: number }) => {
  const cards = await apiGetCardsByTopicId({ topicId: args.topicId, questionTotal: args.questionTotal, typeQuery: "card_random_by_percent", level: args.level });
  return cards?.filter(item => (item.answer?.texts?.length || item.hasChild === CARD_HAS_CHILD)) ?? [];
});

export const fetchCardsByIds = createAsyncThunk("game/fetchCardsByIds", async (cardIds: string[]) => {
  const cards = await apiGetCardsByIds({ cardIds });
  return cards?.filter(item => (item.answer?.texts?.length || item.hasChild === CARD_HAS_CHILD)) ?? [];
});

export const fetchSkillsByExamType = createAsyncThunk("game/fetchSkillsByExamType", async (args: { examType: number }) => {
  const data = await apiGetSkillsByExamType(args);
  return {
    examType: args.examType,
    data
  }
});

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameKey: (state, action: PayloadAction<any>) => {
      state.gameKey = action.payload;
    },
    setGameFunction: (state, action: PayloadAction<GameFunction | null>) => {
      state.gameFunction = action.payload;
    },
    setCardsList: (state, action: PayloadAction<Card[]>) => {
      state.cards = action.payload;
    },
    setFetchedCard: (state, action: PayloadAction<boolean>) => {
      state.fetchedCard = action.payload;
    },
    setSortedCard: (state, action: PayloadAction<boolean>) => {
      state.sortedCard = action.payload;
    },
    setMapCardProgressAsync: (state, action: PayloadAction<{ mapCardProgress: MapCardProgress; userId: string }>) => {
      const { mapCardProgress, userId } = action.payload;
      const oldCardProgressKeys = Object.keys(state.cardProgresses);
      const oldCardProgresses = oldCardProgressKeys.reduce((map, e) => {
        const oldCardProgress = state.cardProgresses[e];
        if (oldCardProgress?.userId === userId) map[e] = oldCardProgress;
        return map;
      }, {} as MapCardProgress);
      state.cardProgresses = {
        ...oldCardProgresses,
        ...mapCardProgress
      };
    },
    setNewMapCardProgressAsync: (state, action: PayloadAction<{ mapCardProgress: MapCardProgress; userId: string }>) => {
      const { mapCardProgress } = action.payload;
      // const oldCardProgressKeys = Object.keys(state.cardProgresses);
      // const oldCardProgresses = oldCardProgressKeys.reduce((map, e) => {
      //   const oldCardProgress = state.cardProgresses[e];
      //   if (oldCardProgress?.userId === userId) map[e] = oldCardProgress;
      //   return map;
      // }, {} as MapCardProgress);
      state.cardProgresses = mapCardProgress;
    },
    setFetchedCardProgress: (state, action: PayloadAction<boolean>) => {
      state.fetchedCardProgresses = action.payload;
    },
    setOpenRestartGameDialog: (state, action: PayloadAction<boolean>) => {
      state.openRestartDialog = action.payload;
    },
    setOpenSubmitGameDialog: (state, action: PayloadAction<boolean>) => {
      state.openSubmitDialog = action.payload;
    },
    setGameType: (state, action: PayloadAction<GameTypes>) => {
      state.gameType = action.payload
    },
    setShowResultOnAnswer: (state, action: PayloadAction<boolean | null>) => {
      state.showResultOnAnswer = action.payload
    },
    setGameDone: (state, action: PayloadAction<boolean>) => {
      state.isDone = action.payload
    },
    setTestView: (state, action: PayloadAction<TestView>) => {
      state.testView = action.payload;
    },
    setFlashCardView: (state, action: PayloadAction<FlashCardView>) => {
      state.flashCardView = action.payload;
    },
    setQuestionsPlayNum: (state, action: PayloadAction<number>) => {
      state.questionsPlayNum = action.payload;
    },
    setCardStudyOrder: (state, action: PayloadAction<CardStudyOrder>) => {
      state.cardStudyOrder = action.payload;
    },
    setGameDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },
    setPauseForSubmit: (state, action: PayloadAction<boolean>) => {
      state.pauseForSubmit = action.payload
    },
    changeQuestionItem: (state: GameState, action: PayloadAction<{
      item: QuestionItem;
      gameViewOnly?: boolean;
    }>) => {
      const { item, gameViewOnly = false } = action.payload;
      const gameObjectIdx = _.findIndex(state.gameObjects, { id: item.path[0] ?? item.id });
      if (gameObjectIdx !== -1) {
        state.currentGame = state.gameObjects[gameObjectIdx];
        state.currentGameViewIdx = gameObjectIdx;
        if (!gameViewOnly) {
          const currentQuestionIdx = item.index - 1;
          state.currentQuestionIdx = currentQuestionIdx;
          state.currentQuestion = state.questionItems[currentQuestionIdx];
          state.currentGameIdx = gameObjectIdx;
        } else {
          if (state.currentGameIdx === gameObjectIdx) {
            const currentQuestionIdx = item.index - 1;
            state.currentQuestionIdx = currentQuestionIdx
            state.currentQuestion = state.questionItems[currentQuestionIdx];
          }
        }
      }
    },

    setLoadingGame: (state, action: PayloadAction<boolean>) => {
      if (action.payload) state.userPlaying = false;
      state.loading = action.payload
    },
    resetGameState: (state) => {
      state.isDone = false;
      state.loading = true;
      state.fetchedCard = false;
      state.sortedCard = false;
      state.fetchedCardProgresses = false;
      state.showResultOnAnswer = null;
      state.showNext = false;
      state.gameType = GameTypes.INIT;
      state.showReviewNav = false;
      state.userPlaying = false;
    },
    setUsingMathJax: (state, action: PayloadAction<boolean>) => {
      state.mathJax = action.payload;
    },
    setRenderedReviewIndex: (state, action: PayloadAction<number>) => {
      state.renderedReviewIndex = action.payload;
    },
    onStartGame: (state: GameState, action: PayloadAction<{
      cards?: Card[];
      cardProgresses?: MapCardProgress;
      userId?: string;
      topicId?: string;
      replayMode?: ReplayMode;
      boxCard?: { [cardId: string]: number };
      cardBookmarks?: string[];
    }>) => {
      const {
        cards = [],
        cardProgresses = {},
        userId = '',
        topicId = '',
        replayMode = ReplayMode.NONE,
        boxCard = {},
        cardBookmarks = []
      } = action.payload;
      if (replayMode === ReplayMode.NONE) {
        const { gameObjects, questionItems } = genGame({
          cards,
          cardProgresses,
          topicId,
          userId,
          flashCardGame: state.gameType === GameTypes.FLASH_CARD,
          boxCard,
          cardBookmarks
        });

        state.gameObjects = gameObjects;
        state.questionItems = questionItems;
        state.totalQuestions = questionItems.length;
        state.totalCorrect = questionItems.filter((item) => item.status === GameObjectStatus.ANSWERED && item.correct).length;
        state.totalIncorrect = questionItems.filter((item) => item.status === GameObjectStatus.ANSWERED && !item.correct).length;



        if (!!gameObjects.length && gameObjects.every((go) => go.status === GameObjectStatus.ANSWERED) && state.showResultOnAnswer) {
          state.isDone = true;
        } else {
          state.replayMode = replayMode;
          state.isDone = false;
          const { nextGameObject, nextIndex } = onContinue({
            gameObjects,
            showResultOnAnswer: state.showResultOnAnswer
          });

          if (nextGameObject) {
            state.currentGame = nextGameObject;
            const currentQuestionIdx = _.findIndex(questionItems, (item) => (item?.path[0] ?? item?.id) === nextGameObject.id);
            state.currentQuestionIdx = currentQuestionIdx;
            state.currentQuestion = questionItems[currentQuestionIdx]
            state.currentGameIdx = nextIndex;
          }
        }
      } else {
        state.replayMode = replayMode;
        const { nextGameObject, nextIndex } = onContinue({
          gameObjects: state.gameObjects,
          showResultOnAnswer: state.showResultOnAnswer,
          replayMode
        });
        if (nextGameObject) {
          state.currentGame = nextGameObject;
          const currentQuestionIdx = _.findIndex(state.questionItems, (item) => (item?.path[0] || item?.id) === nextGameObject.id);
          state.currentQuestionIdx = currentQuestionIdx;
          state.currentQuestion = state.questionItems[currentQuestionIdx]
          state.currentGameIdx = nextIndex;
          state.isDone = false;
        } else {
          state.isDone = true;
        }
      }
      if (typeof boxCard !== "undefined") {
        state.boxCard = boxCard;
      }
      state.loading = false;
    },
    onAnswer: (state: GameState, action: PayloadAction<{
      questionItem: QuestionItem;
      cardProgress: ClientCardProgress;
      isFillPara?: boolean;
    }>) => {
      if (!state.userPlaying) state.userPlaying = true;
      const { questionItem, cardProgress, isFillPara } = action.payload;
      if ((questionItem.path[0] || questionItem.id) === state.currentGame?.id) {
        const oldQuestionItem = state.questionItems[questionItem.index - 1]
        state.questionItems[questionItem.index - 1] = questionItem;
        // if (state.showResultOnAnswer) {
        if (!isFillPara) {
          if (oldQuestionItem.status === GameObjectStatus.NOT_ANSWER) {
            if (questionItem.correct) state.totalCorrect += 1;
            else state.totalIncorrect += 1;
          } else if (oldQuestionItem.status === GameObjectStatus.ANSWERED) {
            if (oldQuestionItem.correct) {
              if (!questionItem.correct) {
                state.totalCorrect -= 1;
                state.totalIncorrect += 1;
              }
            } else {
              if (questionItem.correct) {
                state.totalCorrect += 1;
                state.totalIncorrect -= 1;
              }
            }
          }
        }

        const currentGameItems = state.questionItems.filter((item) => (item.path[0] || item.id) === state.currentGame?.id);
        if (!isFillPara && currentGameItems.every((item) => item.status === GameObjectStatus.ANSWERED)) {
          const gameObjectIdx = state.gameObjects.findIndex((go) => go.id === state.currentGame?.id);
          if (gameObjectIdx !== -1) {
            const gameObject = state.gameObjects[gameObjectIdx];
            gameObject.setProgress({
              status: GameObjectStatus.ANSWERED,
              correct: currentGameItems.every((item) => item.correct)
            });
            if (gameObject instanceof FlashCardGameObject) {
              const currentBoxNum = gameObject.boxNum;
              const newBoxNum = questionItem.correct
                ? (currentBoxNum >= 0 ? (currentBoxNum >= 5 ? 5 : currentBoxNum + 1) : 1)
                : (currentBoxNum <= 0 ? (currentBoxNum <= -5 ? -5 : currentBoxNum - 1) : 0);
              gameObject.setBoxNum(newBoxNum);
              const newBoxCard = {
                ...state.boxCard,
                [cardProgress.cardId]: newBoxNum
              }
              state.boxCard = newBoxCard
              state.updateBoxCard = newBoxCard;
            }
            state.gameObjects[gameObjectIdx] = gameObject;
          }
          state.showNext = true;
        } else {
          if (state.currentGame instanceof ParaGameObject) {
            // Para graph
            const currentQuestionIdx = questionItem.index - 1
            state.currentQuestionIdx = currentQuestionIdx;
            state.currentQuestion = state.questionItems[currentQuestionIdx];
          }

        }
        state.cardProgresses = { ...state.cardProgresses, [cardProgress.id]: cardProgress };
      }
    },
    getPreviousGameObject: (state) => {
      if (!state.showResultOnAnswer) {
        if (state.currentGameIdx - 1 >= 0) {
          const prevIndex = state.currentGameIdx - 1;
          const prevGameObject = state.gameObjects[prevIndex];

          if (prevGameObject) {
            state.currentGame = prevGameObject;
            state.currentGameIdx = prevIndex;
            const currentQuestionIdx = _.findIndex(state.questionItems, (item) => (item.path[0] ?? item.id) === prevGameObject.id);
            if (currentQuestionIdx !== -1) {
              state.currentQuestionIdx = currentQuestionIdx;
              state.currentQuestion = state.questionItems[currentQuestionIdx];
            }
          }
        }
      }
    },
    getNextGameObject: (state) => {
      const { nextGameObject, nextIndex } = onContinue({
        gameObjects: state.gameObjects,
        showResultOnAnswer: state.showResultOnAnswer,
        currentIndex: state.currentGameIdx,
        replayMode: state.replayMode
      });
      state.currentGame = nextGameObject;
      if (!!nextGameObject) {
        state.currentGameIdx = nextIndex;
        const currentQuestionIdx = _.findIndex(state.questionItems, (item) => (item.path[0] ?? item.id) === nextGameObject.id);
        state.currentQuestionIdx = currentQuestionIdx;
        state.currentQuestion = state.questionItems[currentQuestionIdx];
      } else {
        state.isDone = true;
      }
    },
    getNextFlashCardGameObject: (state) => {
      const { nextGameObject, nextIndex } = onContinueFlashCard({ gameObjects: state.gameObjects as FlashCardGameObject[], currentIndex: state.currentGameIdx });
      state.currentGameIdx = nextIndex;
      state.currentGameViewIdx = nextIndex;
      if (nextGameObject) {
        state.currentGame = nextGameObject;
      } else {
        // Return Review Flash Card
        state.flashCardView = FlashCardView.END;
      }
    },
    setShowNext: (state, action: PayloadAction<boolean>) => {
      state.showNext = action.payload
    },
    setShowReviewNav: (state, action: PayloadAction<boolean>) => {
      state.showReviewNav = action.payload;
    },
    setIsCheckShowCollapse: (state, action: PayloadAction<boolean>) => {
      state.isCheckShowCollapse = action.payload;
    },
    getGameReviewNav: (state, action: PayloadAction<{ isNext: boolean }>) => {
      const { isNext } = action.payload;
      if (isNext && state.currentGameViewIdx !== state.gameObjects.length - 1
        || (!isNext && state.currentGameViewIdx - 1 !== 0)
      ) {

      }
      const idx = isNext ? state.currentGameViewIdx + 1 : state.currentGameViewIdx - 1;
      state.currentGameViewIdx = idx;
      state.currentGame = state.gameObjects[idx];
      if (idx === state.currentGameIdx) state.showReviewNav = false;
    },
    returnEndGameState: (state) => {
      state.currentGameIdx = -1;
      state.currentQuestionIdx = -1;
      state.currentGame = null;
      state.currentQuestion = null;
    },
    resetCardProgresses: (state: GameState, action: PayloadAction<{ topicId: string; }>) => {
      state.questionItems.forEach((item) => {
        const key = `${action.payload.topicId}_${item.id}`;
        if (state.cardProgresses[key]) {
          delete state.cardProgresses[key];
        }
      })
    },
    onStartFlashCardGame: (state: GameState) => {
      const gameObjects = [...(state.gameObjects as FlashCardGameObject[])].map((go) => { go.render = true; return go; });
      const questionsNum = state.questionsPlayNum;
      const cardStudyOrder = state.cardStudyOrder;
      const totalQuestions = state.totalQuestions;
      const newGameObjects: FlashCardGameObject[] = [];
      if (cardStudyOrder === CardStudyOrder.NEW) {
        newGameObjects.push(...(_.shuffle(gameObjects.filter((go) => go.status === GameObjectStatus.NOT_ANSWER))));
      } else if (cardStudyOrder === CardStudyOrder.MEMORIZED) {
        newGameObjects.push(...(_.shuffle(gameObjects.filter((go) => go.status === GameObjectStatus.ANSWERED && go.isCorrect))));
      } else if (cardStudyOrder === CardStudyOrder.UNMEMORIZED) {
        newGameObjects.push(...(_.shuffle(gameObjects.filter((go) => go.status === GameObjectStatus.ANSWERED && !go.isCorrect))));
      } else if (cardStudyOrder === CardStudyOrder.MARKED) {
        newGameObjects.push(...(_.shuffle(gameObjects.filter((go) => go.bookmark))));
      } else {
        newGameObjects.push(...(_.sampleSize(gameObjects, questionsNum)))
      }

      if (newGameObjects.length < totalQuestions) {
        const unRenderedGameObjects = gameObjects
          .filter((go) => !newGameObjects.find(({ id }) => id === go.id))
          .map((go) => { go.render = false; return go; });
        newGameObjects.push(...unRenderedGameObjects);
      }

      state.gameObjects = newGameObjects;
      const { nextGameObject, nextIndex } = onContinueFlashCard({ gameObjects: newGameObjects });
      state.currentGameIdx = nextIndex;
      state.currentGameViewIdx = nextIndex;
      if (nextGameObject) {
        state.currentGame = nextGameObject;
      } else {
        // Return Review Flash Card
        state.flashCardView = FlashCardView.END;
      }
    },
    onSubmitFillPara: (state: GameState, action: PayloadAction<{
      gameObject: FillParaGameObject;
      arrCardProgress: SpellingClientCardProgress[];
    }>) => {
      const { gameObject, arrCardProgress } = action.payload;
      const childGameObjects = gameObject.childGameObjects;
      childGameObjects.forEach((go) => {
        const questionItem = state.questionItems.find((item) => item.id === go.id);
        go.setProgress({ correct: !!questionItem?.correct, status: GameObjectStatus.ANSWERED });
      });
      const gameQuestions = state.questionItems.filter((item) => item.path.includes(gameObject.id));
      gameQuestions.forEach((item) => {
        item.setProgress({ correct: item.correct, status: GameObjectStatus.ANSWERED });
      });
      gameObject.setProgress({ correct: gameQuestions.every((item) => item.status === GameObjectStatus.ANSWERED && item.correct), status: GameObjectStatus.ANSWERED });
      state.totalCorrect = state.questionItems.filter((item) => item.status === GameObjectStatus.ANSWERED && item.correct).length;
      state.totalIncorrect = state.questionItems.filter((item) => item.status === GameObjectStatus.ANSWERED && !item.correct).length;
      arrCardProgress.forEach((cardProgress) => {
        const oldCardProgress = state.cardProgresses[cardProgress.id];
        const newCardProgress = !!oldCardProgress
          ? SpellingClientCardProgress.clone(oldCardProgress as SpellingClientCardProgress)
          : cardProgress;
        Object.assign(newCardProgress, oldCardProgress || {});
        state.cardProgresses[cardProgress.id] = newCardProgress;
      });

      if (gameObject.id !== state.currentGame?.id) {
        const rootGameItems = state.questionItems.filter((item) => (item.path[0] || item.id) === state.currentGame?.id);
        if (rootGameItems.every((item) => item.status === GameObjectStatus.ANSWERED)) {
          const gameObjectIdx = state.gameObjects.findIndex((go) => go.id === state.currentGame?.id);
          if (gameObjectIdx !== -1) {
            const gameObject = state.gameObjects[gameObjectIdx];
            gameObject.setProgress({
              status: GameObjectStatus.ANSWERED,
              correct: rootGameItems.every((item) => item.correct)
            });
            state.gameObjects[gameObjectIdx] = gameObject;
          }
          state.showNext = true;
        }
      } else {
        state.showNext = true;
      }
    },
    setUpdateBoxCard: (state, action: PayloadAction<MapCardBox | null>) => {
      state.updateBoxCard = action.payload;
    },
    setForceReviewPractice: (state, action: PayloadAction<boolean>) => {
      state.forceReviewPractice = action.payload;
    },
    setDisableAutoPlayAudio: (state, action: PayloadAction<boolean>) => {
      state.disableAutoPlayAudio = action.payload;
    },
    setCurrentCardId: (state, action: PayloadAction<string>) => {
      state.currentCardId = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchSkillsByExamType.fulfilled, (state, action) => {
      state.mapExamTypeSkills = {
        ...state.mapExamTypeSkills,
        [action.payload.examType]: {
          fetched: true,
          data: action.payload.data
        }
      }
    });
    builder.addMatcher(isAnyOf(fetchCards.fulfilled, fetchCardsByIds.fulfilled, fetchCardsRandomByPercent.fulfilled), (state, action) => {
      state.cards = action.payload;
      state.fetchedCard = true;
    });
  }
});

export const {
  setGameKey,
  setGameFunction,
  setCardsList,
  setFetchedCard,
  setSortedCard,
  setGameType,
  setGameDone,
  setTestView,
  setFlashCardView,
  setQuestionsPlayNum,
  setCardStudyOrder,
  setGameDuration,
  setPauseForSubmit,
  setShowResultOnAnswer,
  changeQuestionItem,
  setLoadingGame,
  resetGameState,
  onStartGame,
  onAnswer,
  onSubmitFillPara,
  getPreviousGameObject,
  getNextGameObject,
  getNextFlashCardGameObject,
  setShowNext,
  setShowReviewNav,
  getGameReviewNav,
  returnEndGameState,
  resetCardProgresses,
  setFetchedCardProgress,
  setMapCardProgressAsync,
  setNewMapCardProgressAsync,
  setOpenRestartGameDialog,
  setOpenSubmitGameDialog,
  setUsingMathJax,
  setRenderedReviewIndex,
  setIsCheckShowCollapse,
  onStartFlashCardGame,
  setUpdateBoxCard,
  setForceReviewPractice,
  setDisableAutoPlayAudio,
  setCurrentCardId,
} = gameSlice.actions;

// Logic
export function sortCards(cards: Card[]) {
  const sortedCards = [...cards].sort((a, b) => a.orderIndex - b.orderIndex).map((card) => {
    const _card = { ...card };
    if (card.hasChild === CARD_HAS_CHILD) {
      _card.childCards = sortCards(card.childCards ?? []);
    }
    return _card;
  });
  return sortedCards
}

function genGame(args: {
  cards: Card[];
  userId: string;
  topicId: string;
  cardProgresses: MapCardProgress;
  flashCardGame?: boolean;
  boxCard?: { [cardId: string]: number };
  cardBookmarks?: string[]
}) {
  const {
    cards,
    userId,
    topicId,
    cardProgresses,
    flashCardGame,
    boxCard = {},
    cardBookmarks = []
  } = args;
  const questionItems: QuestionItem[] = [];
  const gameObjects: GameObject[] = [];

  const genGameFromCard = (args: {
    card: Card;
    path: string[];
    depth?: number;
    parentSkillType?: number;
  }) => {
    const { card, path, depth = 0, parentSkillType } = args;
    let gameObject: GameObject;
    const _questionItems: QuestionItem[] = [];

    if (depth > 2) return null;

    if (flashCardGame) {
      const boxNum = boxCard[card._id];
      const bookmark = cardBookmarks.includes(card._id);
      const _card = Object.assign({}, card, { boxNum, bookmark, render: true });
      gameObject = new FlashCardGameObject(_card);
      const _cardProgress = cardProgresses[`${topicId}_${card._id}`];
      const cardProgress = _cardProgress?.userId === userId ? _cardProgress : undefined;
      const questionItem = new QuestionItem({
        id: card._id,
        correct: cardProgress?.correct ?? false,
        status: !!cardProgress ? GameObjectStatus.ANSWERED : GameObjectStatus.NOT_ANSWER,
        path
      });
      questionItems.push(questionItem);
      _questionItems.push(questionItem);
    } else {
      if (card.hasChild === CARD_HAS_CHILD) {
        // GEN PARA Object
        const childGameObjects: GameObject[] = [];
        const childQuestionItems: QuestionItem[] = [];
        card.childCards?.map((childCard) => {
          const {
            gameObject: childGameObject,
            questionItems: _childQuestionItems
          } = genGameFromCard({
            card: childCard,
            path: [...path, card._id],
            depth: depth + 1,
            parentSkillType: !depth ? card.type : parentSkillType
          });
          if (!!childGameObject) childGameObjects.push(childGameObject);
          childQuestionItems.push(..._childQuestionItems);
        });
        if (card.question.text.includes(CLASS_GAME_FILL_PARAGRAPH)) {
          gameObject = new FillParaGameObject(card);
          (gameObject as FillParaGameObject).childGameObjects = (childGameObjects as SpellingGameObject[]).sort((a, b) => a.index - b.index);
          if (childQuestionItems.some((item) => item.status !== GameObjectStatus.ANSWERED)) {
            childQuestionItems.forEach((item) => {
              item.status = GameObjectStatus.NOT_ANSWER;
            });
          }
        } else {
          gameObject = new ParaGameObject(card);
          (gameObject as ParaGameObject).childGameObjects = childGameObjects;
        }
      } else {
        const _cardProgress = cardProgresses[`${topicId}_${card._id}`];
        const cardProgress = _cardProgress?.userId === userId ? _cardProgress : undefined;

        const answersNum = card.setting.splitPointAnswers && card.answer.texts.length > 1
          ? card.answer.texts.length
          : 1;
        // Palette Items
        const __questionItems = _.range(answersNum).map((_) =>
          new QuestionItem({
            id: card._id,
            correct: cardProgress?.correct ?? false,
            status: !!cardProgress ? GameObjectStatus.ANSWERED : GameObjectStatus.NOT_ANSWER,
            path,
            skillValue: card.type > 0 ? card.type : parentSkillType
          })
        );
        _questionItems.push(...__questionItems);

        // GameObject
        const gameType = card.games?.length ? _.sample(card.games) : null;

        if (_.isNil(gameType)) {
          if (card.answer.choices.length) {
            gameObject = new QuizGameObject(card);
            _questionItems.forEach((item) => {
              if (!!cardProgress) {
                item.setSelectedChoices((cardProgress as QuizClientCardProgress).selectedChoices);
              }
            });
          } else {
            gameObject = new SpellingGameObject(card);
            _questionItems.forEach((item) => {
              if (!!cardProgress) {
                item.setAnswerText((cardProgress as SpellingClientCardProgress).answer);
              }
            });
          }
        } else if (gameType === CardGames.quiz) {
          gameObject = new QuizGameObject(card);
          _questionItems.forEach((item) => {
            if (!!cardProgress) {
              item.setSelectedChoices((cardProgress as QuizClientCardProgress).selectedChoices);
            }
          });
        } else if (gameType === CardGames.spelling) {
          gameObject = new SpellingGameObject(card);
          _questionItems.forEach((item) => {
            if (!!cardProgress) {
              item.setAnswerText((cardProgress as SpellingClientCardProgress).answer);
            }
          });
        } else if (gameType === CardGames.matching) {

        }
        questionItems.push(..._questionItems);
      }
    }
    if (!depth) {
      if (gameObject) {
        const gameQuestions = questionItems.filter((item) => (item?.path[0] || item.id) === gameObject?.id);
        const isAnswered = gameQuestions.every((item) => item.status === GameObjectStatus.ANSWERED);
        if (isAnswered) {
          gameObject.setProgress({
            status: GameObjectStatus.ANSWERED,
            correct: gameQuestions.every((item) => item.correct)
          });
        }
        gameObjects.push(gameObject);
      }
    }
    return {
      gameObject,
      questionItems: _questionItems
    };
  }

  cards.map((card) => {
    genGameFromCard({ card, path: [] });
  });

  return {
    gameObjects,
    questionItems: questionItems.map((e, i) => { e.index = i + 1; return e; })
  }
}

function onContinue(args: {
  gameObjects: GameObject[];
  showResultOnAnswer: boolean;
  currentIndex?: number;
  replayMode?: ReplayMode;
}) {
  const {
    gameObjects,
    showResultOnAnswer,
    currentIndex = -1,
    replayMode = ReplayMode.NONE
  } = args;
  let nextGameObject: GameObject;
  let nextIndex = -1;
  if (showResultOnAnswer) {
    switch (replayMode) {
      case ReplayMode.NONE:
        nextIndex = _.findIndex(gameObjects, (go, index) => {
          return index > currentIndex && go.status !== GameObjectStatus.ANSWERED
        });
        break;
      case ReplayMode.CORRECT:
        nextIndex = _.findIndex(gameObjects, (go, index) => {
          return index > currentIndex && go.status === GameObjectStatus.ANSWERED && go.isCorrect
        });
        break;
      case ReplayMode.INCORRECT:
        nextIndex = _.findIndex(gameObjects, (go, index) => {
          return index > currentIndex && go.status === GameObjectStatus.ANSWERED && !go.isCorrect
        });
        break;
      default:
        break;
    }
    if (nextIndex !== -1) nextGameObject = gameObjects[nextIndex];
  } else {
    if (currentIndex + 1 < gameObjects.length) {
      nextGameObject = gameObjects[currentIndex + 1];
      nextIndex = currentIndex + 1;
    }
  }
  return {
    nextGameObject: nextGameObject ?? null,
    nextIndex
  }
}

function onContinueFlashCard(args: {
  gameObjects: FlashCardGameObject[];
  currentIndex?: number;
}) {
  const {
    gameObjects,
    currentIndex = -1
  } = args;
  let nextGameObject: FlashCardGameObject;
  const nextIndex = gameObjects.findIndex((go, i) => go.render && i > currentIndex);
  if (nextIndex !== -1) nextGameObject = gameObjects[nextIndex];
  return { nextGameObject: nextGameObject ?? null, nextIndex }
}

// const gameSliceReducer = typeof window === "undefined"
//   ? gameSlice.reducer
//   : persistReducer({
//     key: "game-v2",
//     storage: gameLocalStore,
//     whitelist: ["cardProgresses"],
//     timeout: null
//   }, gameSlice.reducer);

const gameSliceReducer = gameSlice.reducer

export default gameSliceReducer;