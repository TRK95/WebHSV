import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Box, Button, Collapse, Container, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, Popover, Typography, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { EXAM_SCORE_FINISH, EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY, TOPIC_CONTENT_TYPE_CARD, TOPIC_CONTENT_TYPE_FLASH_CARD, TOPIC_TYPE_EXERCISE, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from "../../modules/share/constraint";
import { Card } from "../../modules/share/model/card";
import Topic from "../../modules/share/model/topic";
import LoadingContainer from "../common/LoadingContainer";
import ScrollContainer from "../common/ScrollContainer";
import CurrentTopicList from "./CurrentTopicList";
import WordListView from "./game/flashCard/WordListView/WordListView";
import { GameTypes } from "./game/game.core";
import { fetchCards, fetchCardsByIds, fetchCardsRandomByPercent, FlashCardView, MapCardProgress, resetGameState, setCardsList, setFetchedCard, setFetchedCardProgress, setFlashCardView, setGameDone, setGameType, setIsCheckShowCollapse, setLoadingGame, setMapCardProgressAsync, setNewMapCardProgressAsync, setShowNext, setShowResultOnAnswer, setSortedCard, setTestView, sortCards, TestView } from "./game/game.slice";
import GameView from "./game/GameView";
import useRestartGame from "./hooks/useRestartGame";
import useSubmitGame from "./hooks/useSubmitGame";
import AllPracticesIcon from "./icons/AllPracticesIcon";
import LevelIcon from "./icons/LevelIcon";
import NavRestartIcon from "./icons/NavRestartIcon";
import NavSubmitGameIcon from "./icons/NavSubmitGameIcon";
import QuestionPaletteIcon from "./icons/QuestionPaletteIcon";
import QuestionPalette from "./QuestionPalette";
import QuestionsProgress from "./QuestionPalette/QuestionsProgress";
import QuestionsStat from "./QuestionPalette/QuestionsStat";
import "./studyView.scss";
import SubTopicList from "./SubTopicList";
import { ClientTopicProgress } from "./topic.model";
import { createAppPracticeData, createAppPracticeDataAgain, fetchCurrentTopic, fetchTopicProgresses, initCardOrderPractice, initClientTopicProgress, MapCurrentProgress, refreshStudyGame, setFetchedTopicProgresses, setMapCurrentProgress, setStudyAgain, TopicItem, updateAppPracticeData, updateTopicProgress } from "./topic.slice";
import { getRelaProgress } from "./topic.utils";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SeoInfo } from "../../modules/share/model/seoInfo";
import { getFormattedContentWithImg } from "../../utils/format";
import { QUESTION_LIMIT } from "../../utils/constraint";
import { StudyScoreData } from "../../modules/share/model/studyScoreData";

enum StudyNavItemType {
  NONE = 'none',
  PRACTICES = 'practices',
  LEVELS = 'levels',
  QUESTIONS = 'questions',
  GAME = 'game',
}

const StudyView = (props: {
  levelListLabel?: string;
  practiceListLabel?: string;
  /** Show SubList only */
  singleList?: boolean;
  onClickSubTopic?: (topic: Topic) => void;
  gameTitle?: string;
  tabletNavCol?: number;
  cardIds?: string[];
  hideAllList?: boolean;
  hideTabletGameControl?: boolean;
  hideSubList?: boolean;
  test?: boolean;
  testCard?: Card[];
  isDifficultLevel?: boolean;
  questionTotal?: number;
  studyScoreDataIdReview?: string;
}) => {
  const {
    levelListLabel = 'Topics',
    practiceListLabel = 'Practices',
    singleList,
    onClickSubTopic,
    gameTitle,
    tabletNavCol = 2,
    cardIds,
    hideAllList,
    hideTabletGameControl,
    hideSubList,
    test,
    testCard,
    isDifficultLevel,
    questionTotal,
    studyScoreDataIdReview
  } = props;
  const openTabletMenu = useSelector((state) => state.studyLayoutState.openTabletMenu);
  const { rootTopic, subTopic, currentTopic, loading, hasSub, fetchedTopicProgresses, list, topicProgresses, studyScoreDataId, studyScoreId, studyAgain } = useSelector((state) => state.topicState);
  const { userId, user } = useSelector((state) => state.authState);
  const mapCurrentProgress = useSelector((state) => state.topicState.mapCurrentProgress);
  const gameFunction = useSelector((state) => state.gameState.gameFunction);
  const cards = useSelector((state) => state.gameState.cards);
  const fetchedCard = useSelector((state) => state.gameState.fetchedCard);
  const sortedCard = useSelector((state) => state.gameState.sortedCard);
  const fetchedCardProgresses = useSelector((state) => state.gameState.fetchedCardProgresses);
  const gameType = useSelector((state) => state.gameState.gameType);
  const testView = useSelector((state) => state.gameState.testView);
  const flashCardView = useSelector((state) => state.gameState.flashCardView);
  const showResultOnAnswer = useSelector((state) => state.gameState.showResultOnAnswer);
  const forceHideSubTopicTheory = useSelector((state) => state.studyLayoutState.forceHideSubTopicTheory);
  const [tabletItemHovering, setTabletItemHovering] = useState<StudyNavItemType>(StudyNavItemType.NONE);
  const [tabletItemActive, setTabletItemActive] = useState<StudyNavItemType>(StudyNavItemType.NONE);
  const [expandTheory, setExpandTheory] = useState(true);
  const refreshGame = useSelector((state) => state.topicState.refreshGame);
  // const studyScoreData = useSelector((state) => state.topicState.studyScore?.studyScoreData);
  const dispatch = useDispatch();

  const theme = useTheme();
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  const { handleOpenRestartDialog } = useRestartGame();
  const { handleOpenSubmitDialog } = useSubmitGame();

  useEffect(() => {
    if (subTopic?._id && fetchedTopicProgresses) {
      const subProgress = topicProgresses[subTopic._id]?.userId === userId
        ? (topicProgresses[subTopic._id]?.progress ?? 0) : 0
      if (!subProgress) {
        try {
          const _mapCollapsedTheory = JSON.parse(localStorage.getItem("map-collapsed-theory") || "{}");
          setExpandTheory(!(_mapCollapsedTheory[subTopic._id] || false));
        } catch (_) {
          setExpandTheory(true);
        }
      } else {
        setExpandTheory(false);
      }
    }
  }, [subTopic?._id, fetchedTopicProgresses]);

  const resetState = () => {
    dispatch(resetGameState());
    dispatch(setFetchedTopicProgresses(false));
    dispatch(setMapCurrentProgress(null));
  }

  useEffect(() => {
    return () => {
      resetState();
    }
  }, []);

  useEffect(() => {
    if (!!currentTopic?._id) {
      resetState();
      setTimeout(() => {
        if (currentTopic.type === TOPIC_TYPE_EXERCISE) {
          if (currentTopic.topicExercise?.contentType === TOPIC_CONTENT_TYPE_FLASH_CARD) {
            dispatch(setGameType(GameTypes.FLASH_CARD));
            dispatch(setFlashCardView(FlashCardView.OVERVIEW));
            dispatch(setShowResultOnAnswer(true));
          } else {
            dispatch(setGameType(GameTypes.PRACTICE));
            dispatch(setShowResultOnAnswer(true));
          }
        } else if (currentTopic.type === TOPIC_TYPE_TEST) {
          dispatch(setGameType(GameTypes.TEST));
          dispatch(setShowResultOnAnswer(false));
        } else if (currentTopic.type === TOPIC_TYPE_LESSON) {
          dispatch(setGameType(GameTypes.LESSON));
          dispatch(setFetchedCard(true));
          dispatch(setFetchedCardProgress(true));
          dispatch(fetchCurrentTopic({ topicId: currentTopic._id }));
        }
      }, 100);
    }
  }, [currentTopic?._id]);

  useEffect(() => {
    if (!!currentTopic?._id && currentTopic?.type !== TOPIC_TYPE_LESSON && !fetchedCard) {
      if (cardIds?.length && !studyAgain) {
        dispatch(fetchCardsByIds(cardIds));
      } else if (test) {
        dispatch(setFetchedCard(true));
        if (testCard) {
          dispatch(setCardsList(testCard));
          dispatch(setFetchedTopicProgresses(true));
          dispatch(setFetchedCardProgress(true));
          dispatch(setSortedCard(true));
        }
      } else {
        if (isDifficultLevel && questionTotal >= 200) {
          dispatch(fetchCardsRandomByPercent({
            topicId: currentTopic._id,
            questionTotal: QUESTION_LIMIT,
            // level: getStudyScoreDataLevel(studyScoreData)
          }));
        } else {
          dispatch(fetchCards(currentTopic._id));
        }
      }
    }
  }, [currentTopic?._id, fetchedCard, test]);

  useEffect(() => {
    if (!list.length) return;
    if (!!currentTopic?._id && !fetchedTopicProgresses) {
      if (!!user) {
        dispatch(fetchTopicProgresses({
          topicIds: list.map((e) => e._id),
          userId,
          currentTopicId: currentTopic._id,
          currentTopicType: currentTopic.type,
          studyScoreDataId: studyScoreDataIdReview ?? null
        }))
      } else {
        dispatch(initClientTopicProgress({ userId }));
      }
    }
  }, [currentTopic?._id, fetchedTopicProgresses, list.length]);

  useEffect(() => {
    if (fetchedTopicProgresses && !mapCurrentProgress) {
      const items: TopicItem[] = [];
      if (subTopic) items.push(subTopic);
      if (currentTopic) items.push(currentTopic);
      if (hasSub && rootTopic) items.push(rootTopic as TopicItem);
      const mapCurrentProgress = items.reduce((map, item) => {
        const _list = list.filter((e) => e.parentId === item.parentId && e.type !== TOPIC_TYPE_TEST && e.type !== TOPIC_TYPE_LESSON);
        map[item._id] = {
          parentId: item.parentId,
          relaProgress: getRelaProgress({ list: _list, topicProgresses, userId, item }),
          totalParts: _list.length,
          currentProgress: topicProgresses[item._id]
        }
        return map;
      }, {} as MapCurrentProgress);
      dispatch(setMapCurrentProgress(mapCurrentProgress));

      if (currentTopic.type === TOPIC_TYPE_LESSON) {
        dispatch(updateTopicProgress(new ClientTopicProgress({ topicId: currentTopic._id, userId, progress: 100 })));
      }
    }
  }, [mapCurrentProgress, fetchedTopicProgresses]);

  useEffect(() => {
    if (fetchedCard && !!mapCurrentProgress) {
      const _savedTopicProgress = topicProgresses[currentTopic._id];
      let topicProgress = _savedTopicProgress?.userId === userId ? ClientTopicProgress.clone(_savedTopicProgress) : undefined;
      let isCreated = false;
      let isUpdateCardOrder = false;
      if (!topicProgress && currentTopic.type !== TOPIC_TYPE_TEST) {
        topicProgress = new ClientTopicProgress({ topicId: currentTopic._id, userId, status: EXAM_SCORE_PLAY });
        isCreated = true;
      }
      if (currentTopic.type === TOPIC_TYPE_EXERCISE && currentTopic.topicExercise?.contentType === TOPIC_CONTENT_TYPE_FLASH_CARD) {
        dispatch(initCardOrderPractice(topicProgress));
      } else {
        let _cards: Card[] = [];
        if (currentTopic.type === TOPIC_TYPE_TEST) {
          _cards = sortCards(cards);
          let testView: TestView = TestView.NEW;
          if (!!topicProgress) {
            if (topicProgress.status === EXAM_SCORE_PLAY || topicProgress.status === EXAM_SCORE_PAUSE) testView = TestView.CONTINUE;
            else if (topicProgress.status === EXAM_SCORE_FINISH) {
              testView = TestView.REVIEW;
            }
          }
          dispatch(setTestView(testView));
        } else {
          if (!topicProgress.cardOrder) {
            if (currentTopic?.topicExercise?.shuffleQuestion) {
              _cards = _.shuffle(cards);
            } else {
              _cards = sortCards(cards);
            }
            isUpdateCardOrder = true;
            topicProgress.setCardOrder(_cards.map((e) => e._id));
            dispatch(initCardOrderPractice(topicProgress));
          } else {
            console.log('Continue');
            _cards = _.sortBy(cards, (e) => _.indexOf(topicProgress.cardOrder, e._id));
          }
        }
        dispatch(setCardsList(_cards));
      }
      if (!!user) {
        if (isCreated) {
          dispatch(createAppPracticeData({
            cardOrder: topicProgress.cardOrder, studyTime: topicProgress.studyTime, topicId: currentTopic._id, userId,
            courseId: currentTopic.courseId, parentId: currentTopic.parentId
          }));
        } else if (studyAgain) {
          dispatch(createAppPracticeDataAgain({
            cardOrder: topicProgress.cardOrder, studyTime: topicProgress.studyTime, topicId: currentTopic._id, userId,
            courseId: currentTopic.courseId, parentId: currentTopic.parentId,
            studyScoreId,
          }));
          dispatch(setStudyAgain(false));
          dispatch(setTestView(TestView.PLAY));
        } else if (isUpdateCardOrder && !!studyScoreDataId) {
          dispatch(updateAppPracticeData({ cardOrder: topicProgress.cardOrder, studyScoreId, studyScoreDataId }));
        }
      }
      dispatch(setSortedCard(true));
    }
  }, [mapCurrentProgress, fetchedCard]);

  useEffect(() => {
    if (sortedCard && !fetchedCardProgresses && !refreshGame) {
      if (!!user) {
        if (gameFunction?.fetchCardProgress) {
          gameFunction.fetchCardProgress().then((arr) => {
            const mapCardProgress: MapCardProgress = arr.reduce((map, cardProgress) => {
              map[cardProgress.id] = cardProgress;
              return map;
            }, {} as MapCardProgress);
            // dispatch(setMapCardProgressAsync({ mapCardProgress, userId }));
            dispatch(setNewMapCardProgressAsync({ mapCardProgress, userId }));
            setTimeout(() => {
              dispatch(setFetchedCardProgress(true));
            }, 100);
          });
        } else {
          setTimeout(() => {
            dispatch(setFetchedCardProgress(true));
          }, 100);
        }
      } else {
        setTimeout(() => {
          dispatch(setFetchedCardProgress(true));
        }, 100);
      }
    }
    if (refreshGame) {
      setTimeout(() => {
        dispatch(refreshStudyGame(false));
        dispatch(setFetchedCardProgress(true));
      }, 100);
    }
  }, [fetchedCardProgresses, sortedCard, gameFunction?.fetchCardProgress]);

  const changeExpandTheory = () => {
    const _expandTheory = !expandTheory;
    setExpandTheory(_expandTheory);
    const _mapCollapsedTheory = JSON.parse(localStorage.getItem("map-collapsed-theory") || "{}");
    if (subTopic?._id) {
      localStorage.setItem("map-collapsed-theory", JSON.stringify({ ..._mapCollapsedTheory, [subTopic._id]: !_expandTheory }));
    }
  }

  const renderStudyNavMenuContent = () => {
    switch (tabletItemActive) {
      case StudyNavItemType.PRACTICES:
        return <Box sx={{ pt: "30px", pl: "10px", background: "#fff" }}>
          <SubTopicList
            clickItemCallback={() => { setTabletItemActive(StudyNavItemType.NONE); }}
            list={singleList ? list : undefined}
            onClickTopic={onClickSubTopic}
          />
        </Box>;
      case StudyNavItemType.LEVELS:
        return <Box sx={{ pt: "30px", pl: "10px", pr: "10px", background: "#F2F3F7" }}><CurrentTopicList clickItemCallback={() => { setTabletItemActive(StudyNavItemType.NONE); }} /></Box>
      case StudyNavItemType.QUESTIONS:
        return <Box sx={{ pt: "60px", pl: "10px", pr: "10px", background: "#F2F3F7" }}><QuestionPalette clickItemCallback={() => { setTabletItemActive(StudyNavItemType.NONE); }} /></Box>;
      default:
        return <></>;
    }
  }

  // Popover zoom
  const sizeText = 12
  const [isOpen, setisOpen] = useState(false)
  const [isOpenSetSize, setIsOpenSetSize] = useState(null)
  const [sizeTextPara, setSizeTextPara] = useState(sizeText)
  const [widthText, setWidthText] = useState(100)
  const [maxWidthModal, setMaxWidthModal] = useState<any>()
  const open = Boolean(isOpenSetSize);
  const id = open ? 'simple-popover' : undefined;

  const showPopupContentParaFullScreen = () => {
    if (!subTopic?.description) return;
    setisOpen(true);
    setMaxWidthModal('xl');
  }

  const showPopupContentParaSmall = (event: React.MouseEvent<HTMLElement>) => {
    if (!subTopic?.description) return;
    setIsOpenSetSize(event.currentTarget)
  }

  const ascSize = () => {
    setSizeTextPara(sizeTextPara + _.divide(sizeText, 10))

    setWidthText(widthText + 10)
  }

  const descSize = () => {
    setSizeTextPara(sizeTextPara - _.divide(sizeText, 10))
    setWidthText(widthText - 10)
  }

  const reSizeText = () => {
    setSizeTextPara(sizeText)
    setWidthText(100)
  }

  return <LoadingContainer loading={loading}>
    <div id="main-study-view" className={classNames("main-study-view", isTabletUI ? "tablet" : "")}>
      <Container maxWidth="xl_game">
        {/* {!isTabletUI &&
          <div style={{ display: 'flex' }}>
            <div style={{
              width: isSmallDesktop ? "250px" : "335px"
            }}></div>
            <Typography component="h1" className="root-topic-name">
              {gameTitle || `${rootTopic?.name}${subTopic && hasSub ? `: ${subTopic?.name}` : ''}`}
            </Typography>
          </div>
        } */}
        <div className={classNames("main-study-layout", isTabletUI ? "tablet" : "")}>
          <div className={classNames(
            "study-layout-item study-layout-left",
            isSmallDesktop ? "small-desktop" : "",
            isTabletUI ? "tablet" : ""
          )}>
            {/* <Typography component="h1" className="root-topic-name">
              {gameTitle || `${rootTopic?.name || ''}${subTopic && hasSub ? `: ${subTopic?.name || ''}` : ''}`}
            </Typography> */}
            <QuestionPalette
              isFlashCard={gameType === GameTypes.FLASH_CARD}
            />
            {!hideAllList && <>
              <CurrentTopicList />
              {/* <div className="sub-list-container">
                {!hideSubList && <SubTopicList
                  list={singleList ? list : undefined}
                  onClickTopic={onClickSubTopic}
                />}
              </div> */}
            </>}
          </div>

          <div className={classNames("study-layout-item study-layout-mid", isTabletUI ? "tablet" : "")}>
            {!!subTopic?.description && !forceHideSubTopicTheory && <>
              <div className="sub-topic-theory-control">
                <Button
                  className="sub-topic-theory-control-button"
                  onClick={() => changeExpandTheory()}
                  endIcon={<ExpandLess sx={{
                    transform: `rotate(${expandTheory ? 0 : -180}deg)`,
                    transition: "transform 0.4s ease"
                  }} />}
                >
                  Theory
                </Button>
              </div>
              <Collapse in={expandTheory}>
                <div id="sub-topic-theory">
                  <ScrollContainer thumbSize={50} style={{ height: "calc(100% - 8px)" }}>
                    <div
                      style={{ fontSize: `${sizeTextPara}px` }}
                      className="sub-topic-theory-main"
                      dangerouslySetInnerHTML={{ __html: subTopic?.description }}
                    />
                  </ScrollContainer>
                  <div className="zoom-theory">
                    <img className="change-size-text" onClick={showPopupContentParaSmall} src="/images/smallscreen.svg" alt="SmallScreen" />
                    <Popover
                      className="show-zoom-in-out-theory"
                      id={id}
                      open={open}
                      anchorEl={isOpenSetSize}
                      onClose={() => setIsOpenSetSize(null)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                    >
                      <div className="custom-popover-theory">
                        <span>{widthText}%</span>
                        <button onClick={() => ascSize()}> + </button>
                        <button onClick={() => descSize()}> - </button>
                        <button onClick={() => reSizeText()}> Reset </button>
                      </div>
                    </Popover>
                    <img onClick={() => showPopupContentParaFullScreen()} src="/images/fullscreen.svg" alt="fullscreen" />
                  </div>
                </div>
              </Collapse>
            </>}

            {isTabletUI && gameType !== GameTypes.LESSON && (<>
              {showResultOnAnswer
                ? <div className="tablet-question-stats"><QuestionsStat /></div>
                : <div className="tablet-question-progress"><QuestionsProgress /></div>}
            </>)}
            <GameView />
            {gameType === GameTypes.FLASH_CARD
              && flashCardView === FlashCardView.OVERVIEW
              && <WordListView />
            }
          </div>
        </div>
      </Container>
    </div>

    <Dialog
      open={isOpen}
      onClose={() => setisOpen(false)}
      fullWidth
      maxWidth={maxWidthModal}
      PaperProps={{ className: "dialog-theory-modal" }}
      id="dialog-theory-modal"
    >
      <DialogTitle className="dialog-theory-modal-title"></DialogTitle>
      <DialogContent sx={{ textAlign: "justify" }} className="dialog-theory-modal-content">
        <div
          className='dialog-theory-modal-content-text'
          dangerouslySetInnerHTML={{ __html: getFormattedContentWithImg(subTopic?.description) }}
        >
        </div>
      </DialogContent>
      <DialogActions style={{ padding: "16px" }} className="dialog-theory-modal-actions">
      </DialogActions>
    </Dialog>

    {isTabletUI && <>
      <div id="tablet-study-view-nav" className={openTabletMenu ? "tablet-nav-open" : ""}>
        <div className="tablet-study-main-nav" style={{ gridTemplateColumns: `repeat(${tabletNavCol}, 1fr)` }}>
          {/* {!hideAllList && !hideSubList && <div className="study-nav-item all-practices-item"
            onMouseEnter={() => setTabletItemHovering(StudyNavItemType.PRACTICES)}
            onMouseLeave={() => setTabletItemHovering(StudyNavItemType.NONE)}
            onClick={() => {
              if (tabletItemActive === StudyNavItemType.PRACTICES) setTabletItemActive(StudyNavItemType.NONE);
              else setTabletItemActive(StudyNavItemType.PRACTICES);
            }}
          >
            <AllPracticesIcon fill={(tabletItemHovering === StudyNavItemType.PRACTICES || tabletItemActive === StudyNavItemType.PRACTICES) ? "#007AFF" : undefined} />
            <div className={classNames("study-nav-item-label", tabletItemActive === StudyNavItemType.PRACTICES ? "active" : "")}>All {practiceListLabel}</div>
          </div>}

          {!hideAllList && !singleList && <div className="study-nav-item all-levels-item"
            onMouseEnter={() => setTabletItemHovering(StudyNavItemType.LEVELS)}
            onMouseLeave={() => setTabletItemHovering(StudyNavItemType.NONE)}
            onClick={() => {
              if (tabletItemActive === StudyNavItemType.LEVELS) setTabletItemActive(StudyNavItemType.NONE);
              else setTabletItemActive(StudyNavItemType.LEVELS);
            }}
          >
            <LevelIcon fill={(tabletItemHovering === StudyNavItemType.LEVELS || tabletItemActive === StudyNavItemType.LEVELS) ? "#007AFF" : undefined} />
            <div className={classNames("study-nav-item-label", tabletItemActive === StudyNavItemType.LEVELS ? "active" : "")}>{levelListLabel}</div>
          </div>} */}

          {gameType !== GameTypes.FLASH_CARD && <div className="study-nav-item all-questions-item"
            onMouseEnter={() => setTabletItemHovering(StudyNavItemType.QUESTIONS)}
            onMouseLeave={() => setTabletItemHovering(StudyNavItemType.NONE)}
            onClick={() => {
              if (tabletItemActive === StudyNavItemType.QUESTIONS) setTabletItemActive(StudyNavItemType.NONE);
              else setTabletItemActive(StudyNavItemType.QUESTIONS);
            }}
          >
            <QuestionPaletteIcon fill={(tabletItemHovering === StudyNavItemType.QUESTIONS || tabletItemActive === StudyNavItemType.QUESTIONS) ? "#007AFF" : undefined} />
            <div className={classNames("study-nav-item-label", tabletItemActive === StudyNavItemType.QUESTIONS ? "active" : "")}>Question Palette</div>
          </div>}

          {!hideTabletGameControl && <div className="study-nav-item game-item"
            onMouseEnter={() => setTabletItemHovering(StudyNavItemType.GAME)}
            onMouseLeave={() => setTabletItemHovering(StudyNavItemType.NONE)}
            onClick={() => {
              if (gameType === GameTypes.TEST) {
                if (testView === TestView.PLAY) {
                  handleOpenSubmitDialog();
                }
              } else if (gameType === GameTypes.FLASH_CARD) {
                if ([FlashCardView.GAME, FlashCardView.CARD].includes(flashCardView)) {
                  dispatch(setFlashCardView(FlashCardView.OVERVIEW))
                }
              } else {
                if (fetchedCardProgresses) {
                  handleOpenRestartDialog();
                }
              }
            }}
          >
            {gameType === GameTypes.TEST
              ? <>
                <NavSubmitGameIcon fill={tabletItemHovering === StudyNavItemType.GAME ? "#007AFF" : undefined} />
                <div className={classNames("study-nav-item-label", tabletItemActive === StudyNavItemType.GAME ? "active" : "")}>Submit</div>
              </>
              : (gameType === GameTypes.FLASH_CARD
                ? <>
                  <NavSubmitGameIcon fill={tabletItemHovering === StudyNavItemType.GAME ? "#007AFF" : undefined} />
                  <div className={classNames("study-nav-item-label", tabletItemActive === StudyNavItemType.GAME ? "active" : "")}>End</div>
                </>
                : <>
                  <NavRestartIcon fill={tabletItemHovering === StudyNavItemType.GAME ? "#007AFF" : undefined} />
                  <div className={classNames("study-nav-item-label", tabletItemActive === StudyNavItemType.GAME ? "active" : "")}>Restart</div>
                </>)
            }
          </div>}
        </div>
      </div>
      <Drawer
        anchor="bottom"
        open={tabletItemActive !== StudyNavItemType.NONE}
        onClose={() => setTabletItemActive(StudyNavItemType.NONE)}
        PaperProps={{
          id: "tablet-study-menu-item-content"
        }}
      >
        {renderStudyNavMenuContent()}
      </Drawer>
    </>}
  </LoadingContainer>
}

const getStudyScoreDataLevel = (data: StudyScoreData) => {
  const rate = data.correctNum / data.totalCardNum * 100;
  if (rate < 60) return 0;
  if (rate >= 60 && rate <= 80) return 1;
  return 2;
}

export default StudyView;