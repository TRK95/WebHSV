import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { memo, PropsWithoutRef, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { TOPIC_TYPE_LESSON } from "../../../modules/share/constraint";
import { GameObjectStatus, GameTypes } from "../game/game.core";
import { changeQuestionItem, FlashCardView, ReplayMode, setFlashCardView, setShowReviewNav, TestView } from "../game/game.slice";
import useRestartGame from "../hooks/useRestartGame";
import useSubmitGame from "../hooks/useSubmitGame";
import PaletteNextIcon from "./PaletteNextIcon";
import PalettePrevIcon from "./PalettePrevIcon";
import QuestionPaletteSkeleton from "./QuestionPaletteSkeleton";
import QuestionsProgress from "./QuestionsProgress";
import QuestionsStat from "./QuestionsStat";
import RestartIcon from "./RestartIcon";
import "./style.scss";

const QuestionPalette = (props: PropsWithoutRef<{
  clickItemCallback?: () => void;
  isFlashCard?: boolean;
}>) => {
  const {
    clickItemCallback = () => { },
    isFlashCard
  } = props;
  const topic = useSelector((state) => state.topicState.currentTopic);
  const gameType = useSelector((state) => state.gameState.gameType);
  const fetchedCardProgresses = useSelector((state) => state.gameState.fetchedCardProgresses)
  const questionItems = useSelector((state) => state.gameState.questionItems);
  const totalCorrect = useSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useSelector((state) => state.gameState.totalIncorrect);
  const totalQuestions = useSelector((state) => state.gameState.totalQuestions);
  const currentQuestion = useSelector((state) => state.gameState.currentQuestion);
  const currentQuestionIdx = useSelector((state) => state.gameState.currentQuestionIdx);
  // const questionItems = _.range(30).map((index) => new QuestionItem({
  //   id: `${index}`, index: index + 1
  // }));
  const currentGame = useSelector((state) => state.gameState.currentGame);
  const showResultOnAnswer = useSelector((state) => state.gameState.showResultOnAnswer);
  const isDone = useSelector((state) => state.gameState.isDone);
  const replayMode = useSelector((state) => state.gameState.replayMode);
  const testView = useSelector((state) => state.gameState.testView);
  const flashCardView = useSelector((state) => state.gameState.flashCardView);
  const showReviewNav = useSelector((state) => state.gameState.showReviewNav);
  const openRestartDialog = useSelector((state) => state.gameState.openRestartDialog);
  const openSubmitDialog = useSelector((state) => state.gameState.openSubmitDialog);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isInitGame = useMemo(() => !fetchedCardProgresses, [fetchedCardProgresses]);
  const ITEM_CHUNK_SIZE = useMemo(() => isMobile ? 7 : 8, [isMobile]);

  const totalChunks = useMemo(() => Math.ceil(questionItems.length / ITEM_CHUNK_SIZE), [questionItems?.length, ITEM_CHUNK_SIZE]);
  const [lastChunkIndex, setLastChunkIndex] = useState(2);
  const dispatch = useDispatch();

  const { handleOpenSubmitDialog, handleCloseSubmitDialog, handleSubmitGame } = useSubmitGame();
  const { handleCloseRestartDialog, handleOpenRestartDialog, handleRestartGame } = useRestartGame();

  useEffect(() => {
    const chunkIndex = Math.ceil((currentQuestionIdx + 1) / ITEM_CHUNK_SIZE) - 1;
    if (chunkIndex - 2 < 0) setLastChunkIndex(2);
    else setLastChunkIndex(chunkIndex);
  }, [currentQuestionIdx]);


  const renderMainTable = () => {
    return isFlashCard
      ? <>
        <div className="flash-card-question-stat">
          <div className="flash-card-question-stat-box" style={{ color: "#4CAF50" }}>
            <div>
              <div className="stat-value">{totalCorrect}/{totalQuestions}</div>
            </div>
            <div className="stat-title" style={{ backgroundColor: "#EAF4EB" }}>
              Memorized
            </div>
          </div>

          <div className="flash-card-question-stat-box" style={{ color: "#FF5252" }}>
            <div>
              <div className="stat-value">{totalIncorrect}/{totalQuestions}</div>
            </div>
            <div className="stat-title" style={{ backgroundColor: "#FDF0F0" }}>
              Unmemorized
            </div>
          </div>
        </div>
        <div className="question-palette-footer">
          {[FlashCardView.CARD, FlashCardView.GAME].includes(flashCardView) && <div className="question-palette-function-buttons">
            <Button
              className="button-restart-game"
              onClick={() => {
                dispatch(setFlashCardView(FlashCardView.OVERVIEW));
              }}
            >
              Kết thúc
            </Button>
          </div>}
        </div>
      </>
      : <>
        <div className="question-palette-header">
          <div className="question-palette-title">Bảng câu hỏi</div>
          {totalChunks > 2 && <div className="question-palette-nav">
            <IconButton
              className="question-palette-nav-button button-left"
              disabled={lastChunkIndex === 2}
              onClick={() => {
                setLastChunkIndex(lastChunkIndex - 3);
              }}>
              <PalettePrevIcon />
            </IconButton>
            <IconButton
              disabled={lastChunkIndex >= totalChunks - 1}
              className="question-palette-nav-button button-right"
              onClick={() => {
                setLastChunkIndex(lastChunkIndex + 3);
              }}
            >
              <PaletteNextIcon />
            </IconButton>
          </div>}
        </div>

        <div className="question-palette-body">
          <div className="questions-list">
            {_.range(totalChunks).map((rowIndex) => {
              // const isShow = rowIndex >= lastChunkIndex - 2 && rowIndex <= lastChunkIndex
              return (
                <div className={classNames(
                  "questions-list-row",
                  rowIndex < lastChunkIndex - 2 || rowIndex > lastChunkIndex ? "hidden" : "",
                  isTablet ? "tablet" : "",
                  isMobile ? "mobile" : ""
                )}
                  key={rowIndex}
                >
                  {questionItems.slice(rowIndex * ITEM_CHUNK_SIZE, (rowIndex + 1) * ITEM_CHUNK_SIZE).map((item, i) => {
                    const isCurrentGame = (item.path[0] ?? item.id) === currentGame?.id;
                    const isCurrentIndex = item.index - 1 === currentQuestionIdx;
                    const isAnswered = item.status === GameObjectStatus.ANSWERED;
                    const currentQuestionIdxs = currentQuestion?.path?.length ? questionItems.filter((_item) => _item.path[0] === currentQuestion.path[0]).map(({ index }) => index) : [];
                    return (<IconButton
                      key={`${item.id}_${item.index}`}
                      className={classNames(
                        "question-item",
                        isTablet ? "tablet" : "",
                        isMobile ? "mobile" : "",
                        isCurrentGame ? "p-item-current-game" : "",
                        isCurrentIndex ? "p-item-current-index" : "",
                        !isCurrentGame && isCurrentIndex ? "p-item-review-other-game" : "",
                        showResultOnAnswer || (gameType === GameTypes.TEST && testView === TestView.REVIEW)
                          ? (isAnswered ? (item.correct ? "p-item-correct" : "p-item-incorrect") : "")
                          : "",
                        !showResultOnAnswer && isAnswered && ((gameType === GameTypes.TEST && testView === TestView.PLAY)) ? "p-item-played" : ""
                      )}
                      onClick={() => {
                        if (showResultOnAnswer) {
                          if (isDone) return;
                          if (replayMode === ReplayMode.NONE) {
                            if (item.status === GameObjectStatus.ANSWERED ||
                              (!!currentQuestion.path.length && currentQuestionIdxs.includes(item.index)) ||
                              (!currentQuestion.path.length && isCurrentIndex)
                            ) {
                              // Change CurrentGame Only
                              dispatch(changeQuestionItem({ item, gameViewOnly: true }));
                              clickItemCallback();
                              if (item.status === GameObjectStatus.ANSWERED) {
                                if (!showReviewNav) {
                                  dispatch(setShowReviewNav(true));
                                }
                              } else {
                                if (showReviewNav) {
                                  dispatch(setShowReviewNav(false));
                                }
                              }
                            }
                          }
                        } else {
                          dispatch(changeQuestionItem({ item }));
                          clickItemCallback();
                        }
                      }}
                    >
                      {item.index}
                    </IconButton>)
                  })}
                </div>
              )
            })}
          </div>
          {!isTablet && !isMobile
            && (showResultOnAnswer
              ? <QuestionsStat />
              : <QuestionsProgress />)
          }
        </div>

        {!isTablet && !isMobile && <div className="question-palette-footer">
          {showResultOnAnswer && !isDone && <div className="question-palette-function-buttons">
            <Button
              startIcon={<RestartIcon />}
              className="button-restart-game"
              onClick={handleOpenRestartDialog}
            >
              Làm lại
            </Button>
          </div>}

          {!showResultOnAnswer && (gameType === GameTypes.TEST && testView === TestView.PLAY) && <div className="question-palette-function-buttons">
            <Button
              className="button-submit-game"
              onClick={handleOpenSubmitDialog}
            >
              Nộp bài
            </Button>
          </div>}
        </div>}
      </>
  }

  return isInitGame
    ? <QuestionPaletteSkeleton />
    : topic.type === TOPIC_TYPE_LESSON
      ? <></>
      : <>
        <div id="question-palette-panel">
          {/* <div className="current-topic-label">{topic?.name}</div> */}
          <div className="question-palette-main">
            {renderMainTable()}
          </div>
        </div>

        <Dialog
          open={openRestartDialog}
          onClose={handleCloseRestartDialog}
          fullWidth
          maxWidth="sm"
          PaperProps={{ className: "submit-game-confirm-modal" }}
        >
          <DialogTitle className="submit-game-confirm-modal-title">Làm lại</DialogTitle>
          <DialogContent sx={{ textAlign: "justify" }} className="submit-game-confirm-modal-content">
            Bạn có muốn bắt đầu lại bài làm của mình không? Kết quả kiểm tra của bạn sẽ không được lưu.
          </DialogContent>
          <DialogActions className="submit-game-confirm-modal-actions">
            <Button
              className="restart-game-button restart-game-button-cancel"
              onClick={handleCloseRestartDialog}
            >
              Hủy
            </Button>
            <Button
              className="restart-game-button restart-game-button-ok"
              onClick={handleRestartGame}
            >
              Làm lại
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openSubmitDialog}
          onClose={handleCloseSubmitDialog}
          fullWidth
          maxWidth="sm"
          PaperProps={{ className: "submit-game-confirm-modal" }}
        >
          <DialogTitle className="submit-game-confirm-modal-title">Submit</DialogTitle>
          <DialogContent sx={{ textAlign: "justify" }} className="submit-game-confirm-modal-content">
            Bạn có chắc chắn muốn nộp bài làm của mình không?
          </DialogContent>
          <DialogActions className="submit-game-confirm-modal-actions">
            <Button
              className="restart-game-button restart-game-button-cancel"
              onClick={handleCloseSubmitDialog}
            >
              Hủy
            </Button>
            <Button
              className="restart-game-button restart-game-button-ok"
              onClick={() => {
                handleSubmitGame();
                handleCloseSubmitDialog();
              }}
            >
              Nộp bài
            </Button>
          </DialogActions>
        </Dialog>
      </>;
}

export default memo(QuestionPalette);