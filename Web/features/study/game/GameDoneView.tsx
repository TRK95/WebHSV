import { Button } from "@mui/material";
import _ from "lodash";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "../../../app/hooks";
import ContinueBox from "../ContinueBox";
import { ClientTopicProgress } from "../topic.model";
import { resetCardStudyData, updateAppPracticeData, updateTopicProgress } from "../topic.slice";
import { onStartGame, ReplayMode, resetCardProgresses, setLoadingGame } from "./game.slice";
import "./gameDoneView.scss";
import { GAME_REVIEW_SECTION_ID } from "./GameView";

const GameDoneView = () => {
  const userId = useSelector((state) => state.authState.userId);
  const user = useSelector((state) => state.authState.user);
  const cards = useSelector((state) => state.gameState.cards);
  const forceReviewPractice = useSelector((state) => state.gameState.forceReviewPractice);
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);
  const totalCorrect = useSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useSelector((state) => state.gameState.totalIncorrect);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const studyScoreId = useSelector((state) => state.topicState.studyScoreId);
  const studyScoreDataId = useSelector((state) => state.topicState.studyScoreDataId);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleReplay = (replayMode?: ReplayMode) => {
    if ((replayMode === ReplayMode.CORRECT && !totalCorrect)
      || (replayMode === ReplayMode.INCORRECT && !totalIncorrect)) {
      enqueueSnackbar("No Data!", { variant: "info" });
      return;
    }
    dispatch(setLoadingGame(true));
    if (replayMode === ReplayMode.NONE) {
      const newTopicProgress = ClientTopicProgress.clone(topicProgresses[topic._id]);
      let _cards = cards;
      if (topic?.topicExercise?.shuffleQuestion) {
        _cards = _.shuffle(cards);
      }
      newTopicProgress.setCardOrder(_cards.map((e) => e._id));
      newTopicProgress.setProgress(0);
      newTopicProgress.setQuestionStats({ totalQuestions: newTopicProgress.totalCardNum, totalCorrect: 0 });
      newTopicProgress.setUserId(userId);
      dispatch(updateTopicProgress(newTopicProgress));
      dispatch(resetCardProgresses({ topicId: topic._id }));
      if (!!user) {
        dispatch(updateAppPracticeData({ progress: 0, totalCorrect: 0, totalQuestions: newTopicProgress.totalCardNum, studyScoreDataId, totalIncorrect: 0, cardOrder: newTopicProgress.cardOrder }));
        dispatch(resetCardStudyData({ studyScoreDataId }));
      }
      // TODO: Reseting game State
      setTimeout(() => {
        dispatch(onStartGame({
          cards: _cards,
          cardProgresses: {},
          userId,
          topicId: topic._id
        }));
      }, 500);
    } else {
      dispatch(onStartGame({ replayMode }));
    }
  }

  const handleClickReview = () => {
    const reviewSection = document.getElementById(GAME_REVIEW_SECTION_ID);
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  return <div id="game-done-view">
    <div className="done-view-title">Congratulations</div>
    <div className="done-view-image-wrap">
      <img className="done-view-image" alt="congratulations" src="/images/practice-done.svg" />
    </div>

    <div className="try-again-button-wrap">
      <Button
        className="try-again-button"
        onClick={() => handleReplay(ReplayMode.NONE)}
      >
        TRY AGAIN
      </Button>

      {forceReviewPractice
        && <Button className="try-again-button review-button" onClick={handleClickReview}>REVIEW</Button>}
    </div>

    <div className="continue-box-buttons">
      <ContinueBox
        value={totalIncorrect}
        label="Incorrect"
        color="#FF5252"
        onClick={() => handleReplay(ReplayMode.INCORRECT)}
      />

      <ContinueBox
        value={totalCorrect}
        label="Correct"
        color="#82BC24"
        onClick={() => handleReplay(ReplayMode.CORRECT)}
      />
    </div>
    {/* <div>
      <Button onClick={() => handleReplay(ReplayMode.NONE)}>All</Button>
      <Button onClick={() => handleReplay(ReplayMode.CORRECT)}>Correct</Button>
      <Button onClick={() => handleReplay(ReplayMode.INCORRECT)}>Incorrect</Button>
    </div> */}
  </div>
}

export default GameDoneView;