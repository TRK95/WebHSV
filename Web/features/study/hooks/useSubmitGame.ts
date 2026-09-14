import { useDispatch, useSelector } from "../../../app/hooks";
import { EXAM_SCORE_FINISH, EXAM_TYPE_TOEIC, SKILL_TYPE_LISTENING, SKILL_TYPE_READING, TOPIC_TYPE_LESSON } from "../../../modules/share/constraint";
import { GameObjectStatus, GameTypes } from "../game/game.core";
import { returnEndGameState, setOpenSubmitGameDialog, setPauseForSubmit, setTestView, TestView } from "../game/game.slice";
import { ClientTopicProgress } from "../topic.model";
import { updateAppPracticeData, updateTopicProgress } from "../topic.slice";
import { getSkillTypeValues, getTOEICScore, toeicBaremScore } from "../game/game.scoreUtils";

const useSubmitGame = () => {
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const gameType = useSelector((state) => state.gameState.gameType);
  const totalCorrect = useSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useSelector((state) => state.gameState.totalIncorrect);
  const totalQuestions = useSelector((state) => state.gameState.totalQuestions);
  const questionItems = useSelector((state) => state.gameState.questionItems);
  const userId = useSelector((state) => state.authState.userId);
  const mapExamTypeSkills = useSelector((state) => state.gameState.mapExamTypeSkills);
  const user = useSelector((state) => state.authState.user);
  const studyScoreId = useSelector((state) => state.topicState.studyScoreId);
  const studyScoreDataId = useSelector((state) => state.topicState.studyScoreDataId);

  const dispatch = useDispatch();

  const handleOpenSubmitDialog = () => {
    if (topic.type === TOPIC_TYPE_LESSON) return;
    dispatch(setPauseForSubmit(true));
    dispatch(setOpenSubmitGameDialog(true));
  }

  const handleCloseSubmitDialog = () => {
    dispatch(setPauseForSubmit(false));
    dispatch(setOpenSubmitGameDialog(false));
  }

  const handleSubmitGame = () => {
    const newTopicProgress = ClientTopicProgress.clone(topicProgresses[topic._id] || {} as ClientTopicProgress);
    if (gameType === GameTypes.TEST) {
      let progress = 0;
      let score = 0;
      if (topic.topicExercise?.contentType === EXAM_TYPE_TOEIC) {
        const skills = mapExamTypeSkills[EXAM_TYPE_TOEIC]?.data ?? [];
        const skillTypeValues = getSkillTypeValues(skills);
        const { score: _score } = getTOEICScore({
          skillTypeValues, questionItems
        });
        score = _score;
        const correctRate = totalCorrect / (totalQuestions || 1);
        const passScore = topic.topicExercise?.pass ?? 0;
        progress = score >= passScore ? 100 : Math.round((correctRate + Number.EPSILON) * 100);
        newTopicProgress.setStudyData({
          progress, score, totalCardNum: totalQuestions, correctNum: totalCorrect, incorrectNum: totalIncorrect, status: EXAM_SCORE_FINISH,
          totalTime: newTopicProgress.totalTime
        });
      } else {
        const correctRate = totalCorrect / (totalQuestions || 1);
        score = correctRate * 10;
        const passScore = topic.topicExercise?.pass ?? 0;
        progress = score >= passScore ? 100 : Math.round((correctRate + Number.EPSILON) * 100);
        newTopicProgress.setStudyData({
          progress, score, totalCardNum: totalQuestions, correctNum: totalCorrect, incorrectNum: totalIncorrect, status: EXAM_SCORE_FINISH,
          totalTime: newTopicProgress.totalTime
        });
      }
      newTopicProgress.setUserId(userId)
      dispatch(updateTopicProgress(newTopicProgress));
      dispatch(returnEndGameState());
      dispatch(setTestView(TestView.REVIEW));
      if (!!user) {
        dispatch(updateAppPracticeData({
          progress,
          score,
          status: EXAM_SCORE_FINISH,
          studyScoreDataId,
          studyScoreId,
          totalCorrect,
          totalIncorrect,
          totalQuestions,
          totalTime: newTopicProgress.totalTime
        }));
      }
    }
  }

  return {
    handleOpenSubmitDialog,
    handleCloseSubmitDialog,
    handleSubmitGame
  }
}

export default useSubmitGame;