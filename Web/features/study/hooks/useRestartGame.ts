import _ from "lodash";
import { useDispatch, useSelector } from "../../../app/hooks";
import { TOPIC_TYPE_LESSON } from "../../../modules/share/constraint";
import { onStartGame, resetCardProgresses, setLoadingGame, setOpenRestartGameDialog, setShowNext } from "../game/game.slice";
import { ClientTopicProgress } from "../topic.model";
import { resetCardStudyData, updateAppPracticeData, updateTopicProgress } from "../topic.slice";

const useRestartGame = () => {
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const cards = useSelector((state) => state.gameState.cards);
  const studyScoreId = useSelector((state) => state.topicState.studyScoreId);
  const studyScoreDataId = useSelector((state) => state.topicState.studyScoreDataId);
  const user = useSelector((state) => state.authState.user);
  const userId = useSelector((state) => state.authState.userId);

  const dispatch = useDispatch();
  const handleOpenRestartDialog = () => {
    if (topic.type === TOPIC_TYPE_LESSON) return;
    dispatch(setOpenRestartGameDialog(true));
  }

  const handleCloseRestartDialog = () => {
    dispatch(setOpenRestartGameDialog(false));
  }

  const handleRestartGame = () => {
    dispatch(setLoadingGame(true));
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
    setTimeout(() => {
      dispatch(onStartGame({
        cards: _cards,
        cardProgresses: {},
        userId,
        topicId: topic._id
      }));
      dispatch(setShowNext(false));
    }, 500);
    dispatch(setOpenRestartGameDialog(false));
  }

  const handleRestartGameAgain = () => {
    dispatch(setLoadingGame(true));
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
    setTimeout(() => {
      dispatch(onStartGame({
        cards: _cards,
        cardProgresses: {},
        userId,
        topicId: topic._id
      }));
      dispatch(setShowNext(false));
    }, 500);
    dispatch(setOpenRestartGameDialog(false));
  }

  return {
    handleOpenRestartDialog,
    handleCloseRestartDialog,
    handleRestartGame,
    handleRestartGameAgain,
  }
}

export default useRestartGame;