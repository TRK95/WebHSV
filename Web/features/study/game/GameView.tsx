import { Divider, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { EXAM_TYPE_TOEIC } from "../../../modules/share/constraint";
import Skill from "../../../modules/share/model/skill";
import ScrollContainer from "../../common/ScrollContainer";
import useSubmitGame from "../hooks/useSubmitGame";
import ClockIcon from "../icons/ClockIcon";
import { ClientTopicProgress, UpdateAppPracticeResultArgs } from "../topic.model";
import { setMapCurrentProgress, updateAppPracticeData, updateAppPracticeResult, updateTestTime, updateTopicProgress } from "../topic.slice";
import Countdown from "./Countdown";
import FlashCardEndView from "./flashCard/FlashCardEndView";
import { FlashCardGameObject } from "./flashCard/FlashCardGameObject";
import FlashCardNextGameButton from "./flashCard/FlashCardNextGameButton";
import FlashCardOverview from "./flashCard/FlashCardOverview";
import FlashCardPlayGameView from "./flashCard/FlashCardPlayGameView";
import FlashCardPracticeView from "./flashCard/FlashCardPracticeView";
import { GameTypes } from "./game.core";
import { FlashCardView, onStartGame, RENDERED_REVIEW_MIN_INDEX, setCurrentCardId, setDisableAutoPlayAudio, setRenderedReviewIndex, TestView } from "./game.slice";
import GameDoneView from "./GameDoneView";
import GameLessonView from "./GameLessonView";
import GameNavButtons from "./GameNavButtons";
import GameObjectView from "./GameObjectView";
import "./gameView.scss";
import LoadingGameIcon from "./LoadingGameIcon";
import { ParaGameObject } from "./para/ParaGameObject";
import SkillStats from "./SkillStats";
import TestOverview from "./TestOverview";
import { scroller } from "react-scroll";

export const GAME_CONTAINER_ID = "main-game-view";
export const GAME_PANEL_ID = "main-game-scroll-panel";
export const GAME_REVIEW_SECTION_ID = "main-game-review-section";

const GameView = () => {
  const gameObjects = useSelector((state) => state.gameState.gameObjects);
  const currentGame = useSelector((state) => state.gameState.currentGame);
  const currentGameIdx = useSelector((state) => state.gameState.currentGameIdx);
  const loading = useSelector((state) => state.gameState.loading);
  const gameType = useSelector((state) => state.gameState.gameType);
  const isDone = useSelector((state) => state.gameState.isDone);
  const testView = useSelector((state) => state.gameState.testView);
  const flashCardView = useSelector((state) => state.gameState.flashCardView);
  const showResultOnAnswer = useSelector((state) => state.gameState.showResultOnAnswer);
  const sortedCard = useSelector((state) => state.gameState.sortedCard);
  const fetchedCardProgresses = useSelector((state) => state.gameState.fetchedCardProgresses);
  const cards = useSelector((state) => state.gameState.cards);
  const currentCardId = useSelector((state) => state.gameState.currentCardId);
  const mapExamTypeSkills = useSelector((state) => state.gameState.mapExamTypeSkills);
  const cardProgresses = useSelector((state) => state.gameState.cardProgresses);
  const userPlaying = useSelector((state) => state.gameState.userPlaying);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const fetchedTopicProgresses = useSelector((state) => state.topicState.fetchedTopicProgresses);
  const studyScore = useSelector((state) => state.topicState.studyScore);
  const studyScoreId = useSelector((state) => state.topicState.studyScoreId);
  const studyScoreTotalCorrect = useSelector((state) => state.topicState.studyScoreTotalCorrect);
  const studyScoreDataId = useSelector((state) => state.topicState.studyScoreDataId);
  const userId = useSelector((state) => state.authState.userId);
  const user = useSelector((state) => state.authState.user);
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);
  const mapCurrentProgress = useSelector((state) => state.topicState.mapCurrentProgress);
  const questionItems = useSelector((state) => state.gameState.questionItems);
  const totalQuestions = useSelector((state) => state.gameState.totalQuestions);
  const totalCorrect = useSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useSelector((state) => state.gameState.totalIncorrect);
  const boxCard = useSelector((state) => state.gameState.boxCard);
  const gameKey = useSelector((state) => state.gameState.gameKey);
  const renderedReviewIndex = useSelector((state) => state.gameState.renderedReviewIndex);
  const pauseForSubmit = useSelector((state) => state.gameState.pauseForSubmit);
  const gameDuration = useSelector((state) => state.gameState.duration);
  const forceReviewPractice = useSelector((state) => state.gameState.forceReviewPractice);
  const topicDuration = (topic?.topicExercise?.duration ?? 0) * 60;

  const gameViewRef = useRef<HTMLDivElement | null>(null);

  const skillsForStat = useMemo(() => {
    const _skillsForStat: Skill[] = [];
    if (topic?.topicExercise?.contentType === EXAM_TYPE_TOEIC) {
      (mapExamTypeSkills[topic?.topicExercise?.contentType]?.data ?? []).forEach((skill) => {
        _skillsForStat.push(...(skill?.childSkills ?? []));
      });
    }
    return _skillsForStat;
  }, [mapExamTypeSkills, topic?.topicExercise?.contentType]);

  const showReviewSection = useMemo(() => {
    return ((gameType === GameTypes.TEST && testView === TestView.REVIEW)
      || (gameType === GameTypes.PRACTICE && forceReviewPractice && isDone));
  }, [gameType, testView, forceReviewPractice, isDone])

  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down('lg'));

  const dispatch = useDispatch();

  const { handleSubmitGame } = useSubmitGame();

  useEffect(() => {
    dispatch(setDisableAutoPlayAudio(showReviewSection));
  }, [showReviewSection])

  useEffect(() => {
    if (fetchedTopicProgresses && fetchedCardProgresses && sortedCard) {
      dispatch(onStartGame({
        cards,
        cardProgresses,
        topicId: topic._id,
        userId,
        boxCard: topicProgresses[topic._id]?.boxCard,
        cardBookmarks: topicProgresses[topic._id]?.cardBookmarks
      }));
    }
  }, [fetchedTopicProgresses, fetchedCardProgresses, sortedCard])

  useEffect(() => {
    if (!loading) {
      if (showResultOnAnswer || (
        gameType === GameTypes.FLASH_CARD && flashCardView !== FlashCardView.OVERVIEW
      )) {
        if (userPlaying) {
          const topicProgress = ClientTopicProgress.clone(topicProgresses[topic._id]);
          const progress = Math.round(((totalCorrect / (totalQuestions || 1)) + Number.EPSILON) * 100);
          topicProgress.setUserId(userId);
          topicProgress.setStudyData({
            progress,
            totalCardNum: totalQuestions,
            correctNum: totalCorrect,
            incorrectNum: totalIncorrect,
            boxCard
          })
          dispatch(setMapCurrentProgress({
            ...mapCurrentProgress,
            [topic._id]: {
              ...mapCurrentProgress[topic._id],
              currentProgress: topicProgress
            }
          }));
          dispatch(updateTopicProgress(topicProgress));
          if (!!user) {
            // dispatch(updateAppPracticeData({ progress, totalCorrect, totalQuestions, studyScoreId, studyScoreDataId, totalIncorrect }))
            let dataUpdateAppPractice: UpdateAppPracticeResultArgs = {
              studyScoreDataProgress: {
                progress,
                totalCorrect,
                totalQuestions,
                studyScoreId,
                studyScoreDataId,
                totalIncorrect,
              }
            }
            if (currentCardId) {
              dataUpdateAppPractice = {
                ...dataUpdateAppPractice,
                studyScoreProgress: {
                  cardId: currentCardId,
                  studyScoreTotalCorrect: studyScoreTotalCorrect ?? (studyScore.progress * studyScore.totalCardStudy / 100),
                  totalStorage: totalQuestions,
                  userId: studyScore.userId,
                  topicId: studyScore.topicId,
                }
              }
            }
            dispatch(updateAppPracticeResult(dataUpdateAppPractice))
            dispatch(setCurrentCardId(null))
          }
        }
      }
    }
  }, [totalQuestions, totalCorrect, totalIncorrect, loading, userPlaying, boxCard]);

  useEffect(() => {
    if (!loading && !!currentGame?.id) {
      if (window.innerHeight < 768) {
        try {
          scroller.scrollTo(GAME_CONTAINER_ID, {
            smooth: true, duration: 800, offset: -10
          });
        } catch (_) { }
      }
    }
  }, [loading, currentGame?.id]);

  let renderedReviewTimeout: any = null;
  useEffect(() => {
    if (gameType === GameTypes.TEST && testView === TestView.REVIEW) {
      if (gameObjects.length) {
        if (renderedReviewIndex >= gameObjects.length) {
          if (renderedReviewTimeout) {
            clearTimeout(renderedReviewTimeout);
          }
          return;
        }
        renderedReviewTimeout = setTimeout(() => {
          dispatch(setRenderedReviewIndex(renderedReviewIndex + RENDERED_REVIEW_MIN_INDEX));
        }, 1000);
      }
    } else {
      if (renderedReviewTimeout) {
        clearTimeout(renderedReviewTimeout);
      }
      dispatch(setRenderedReviewIndex(RENDERED_REVIEW_MIN_INDEX));
    }
  }, [gameType, testView, renderedReviewIndex, gameObjects.length]);

  useEffect(() => {
    return () => {
      if (renderedReviewTimeout) {
        if (renderedReviewTimeout) {
          clearTimeout(renderedReviewTimeout);
        }
      }
      dispatch(setRenderedReviewIndex(RENDERED_REVIEW_MIN_INDEX));
    }
  }, []);

  const renderGameObjectView = () => {
    if (loading) return <LoadingGameIcon />;
    if (gameType === GameTypes.LESSON) {
      return <GameLessonView
        name={topic.name}
        description={topic?.description ?? ''}
        videoUrl={topic?.videoUrl}
      />;
    }
    if (gameType === GameTypes.FLASH_CARD) {
      if (flashCardView === FlashCardView.OVERVIEW) {
        return <FlashCardOverview />
      } else if (flashCardView === FlashCardView.CARD) {
        return <FlashCardPracticeView
          gameObject={currentGame as FlashCardGameObject}
          isFirstCard={!currentGameIdx}
        />;
      } else if (flashCardView === FlashCardView.GAME) {
        return <FlashCardPlayGameView />
      } else if (flashCardView === FlashCardView.END) {
        return <FlashCardEndView />
      }
      return <></>;
    }
    if (!gameObjects.length) return <>Không có dữ liệu</>;
    if (gameType === GameTypes.PRACTICE && isDone) return <GameDoneView />;
    if (gameType === GameTypes.TEST && testView !== TestView.PLAY) {
      return <TestOverview />
    }
    if (currentGame) {
      return <GameObjectView gameObject={currentGame} isRoot />
    }
    return <></>;
  }

  return (<>
    <div
      id={GAME_CONTAINER_ID}
      ref={gameViewRef}
      className={classNames(
        currentGame instanceof FlashCardGameObject ? "flash-card" : "",
        isTabletUI ? "tablet" : ""
      )}
    >
      {gameType === GameTypes.TEST && <div className="test-clock-panel">
        <ClockIcon className="test-clock-icon" />
        <Countdown
          total={gameDuration}
          stop={testView !== TestView.PLAY || pauseForSubmit}
          id={gameKey}
          onChange={(timeLeft) => {
            dispatch(updateTestTime({
              topicId: topic._id, second: topicDuration - timeLeft
            }))
          }}
          onEnd={() => handleSubmitGame()}
        />
      </div>}
      <div id={GAME_PANEL_ID} className={classNames(
        "main-game-object",
        gameType !== GameTypes.FLASH_CARD
          && !!currentGame
          && currentGame instanceof ParaGameObject ? "para-root-container" : ""
      )}>
        {renderGameObjectView()}
      </div>
      {!isTabletUI && <div className="main-game-object-buttons">
        <GameNavButtons />
      </div>}
    </div>

    {showReviewSection
      && <>
        {!!skillsForStat.length && <div id="skill-stats-panel">
          <SkillStats skills={skillsForStat} questionItems={questionItems} />
        </div>}
        <div id={GAME_REVIEW_SECTION_ID}>
          {gameObjects.map((go, index) => {
            const gameQuestions = questionItems.filter((item) => (item.path[0] || item.id) === go.id);
            const questionLabel = gameQuestions.length === 1 ? `${gameQuestions[0]?.index}` : `${gameQuestions[0]?.index}-${gameQuestions[gameQuestions.length - 1]?.index}`;
            return <div key={go.id} id={`review-${go.id}`}>
              {renderedReviewIndex >= index
                ? <>
                  <div className="question-index-title">Question {questionLabel}: </div>
                  <GameObjectView gameObject={go} isRoot />
                  {index !== gameObjects.length - 1 && <Divider />}
                </>
                : <></>}
            </div>
          })}
        </div>
      </>}

    {isTabletUI && <div className="main-game-tablet-buttons-wrap">
      <div id="main-game-tablet-buttons">
        <GameNavButtons />
        {gameType === GameTypes.FLASH_CARD && <FlashCardNextGameButton className="footer-tablet-right" />}
      </div>
    </div>}
  </>)
}

export default GameView;