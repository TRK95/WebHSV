import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { EXAM_SCORE_PLAY, EXAM_TYPE_TOEIC, GAME_TYPE_TEST } from "../../../modules/share/constraint";
import ContinueBox from "../ContinueBox";
import { ClientTopicProgress, UpdateAppPracticeDataArgs } from "../topic.model";
import { createAppPracticeData, resetCardStudyData, updateAppPracticeData, updateTopicProgress } from "../topic.slice";
import { fetchSkillsByExamType, onStartGame, resetCardProgresses, setGameDuration, setGameKey, setTestView, TestView } from "./game.slice";
import { GAME_REVIEW_SECTION_ID } from "./GameView";
import "./testOverview.scss";
import TOEICOverview from "./toeic/TOEICOverview";

const TestOverview = () => {
  const testView = useSelector((state) => state.gameState.testView);
  const cards = useSelector((state) => state.gameState.cards);
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const userId = useSelector((state) => state.authState.userId);
  const user = useSelector((state) => state.authState.user);
  const totalCorrect = useSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useSelector((state) => state.gameState.totalIncorrect);
  const totalQuestions = useSelector((state) => state.gameState.totalQuestions);
  const mapExamTypeSkills = useSelector((state) => state.gameState.mapExamTypeSkills);
  const hideSubList = useSelector((state) => state.studyLayoutState.hideSubList);
  const studyScoreId = useSelector((state) => state.topicState.studyScoreId);
  const studyScoreDataId = useSelector((state) => state.topicState.studyScoreDataId);
  const dispatch = useDispatch();
  const passed = topicProgresses[topic._id]?.progress === 100;

  const isRenderDefaultOverview = useMemo(() => ![
    EXAM_TYPE_TOEIC
  ].includes(topic?.topicExercise?.contentType), [topic?.topicExercise?.contentType]);

  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!!topic) {
      let duration = (topic.topicExercise?.duration * 60);
      if (testView === TestView.CONTINUE
        || testView === TestView.REVIEW
      ) duration -= (topicProgresses[topic._id]?.totalTime ?? 0);
      dispatch(setGameDuration(duration));
    }
  }, [testView, topic]);

  useEffect(() => {
    const examType = topic?.topicExercise?.contentType;
    if (examType === EXAM_TYPE_TOEIC) {
      if (!mapExamTypeSkills[examType]?.fetched) {
        dispatch(fetchSkillsByExamType({ examType }));
      }
    }
  }, [topic?.topicExercise?.contentType, mapExamTypeSkills]);

  const handleClickPlay = (args: { replay?: boolean; continueMode?: boolean; } = {}) => {
    const { replay = false, continueMode = false } = args;
    const _savedTopicProgress = topicProgresses[topic._id];
    let topicProgress = _savedTopicProgress?.userId === userId ? ClientTopicProgress.clone(_savedTopicProgress) : undefined;
    // let topicProgress = _savedTopicProgress ? ClientTopicProgress.clone(_savedTopicProgress) : undefined;
    if (!topicProgress) topicProgress = new ClientTopicProgress({
      topicId: topic._id, userId
    });
    // let duration = (topic.topicExercise?.duration ?? 0) * 60;
    topicProgress.setStatus(EXAM_SCORE_PLAY);
    if (!continueMode) {
      topicProgress.increaseStudyTime();
      topicProgress.setTotalTime(0);
    } else {
      // duration -= topicProgress.totalTime;
    }
    // dispatch(setGameDuration(duration));
    if (replay) {
      dispatch(resetCardProgresses({ topicId: topic._id }));
      topicProgress.setStudyData({ correctNum: 0, incorrectNum: 0, score: 0, progress: 0 });
      dispatch(onStartGame({
        cards, cardProgresses: {}, userId, topicId: topic._id
      }));
    }
    topicProgress.setUserId(userId);
    dispatch(updateTopicProgress(topicProgress));
    if (!!user) {
      if (replay) {
        const updateAppPracticeDataArgs: UpdateAppPracticeDataArgs = {
          studyScoreDataId,
          studyScoreId,
          status: EXAM_SCORE_PLAY,
          progress: 0, totalCorrect: 0, totalIncorrect: 0,
          totalQuestions,
          studyTime: topicProgress.studyTime,
          totalTime: 0,
          score: 0
        }
        dispatch(updateAppPracticeData(updateAppPracticeDataArgs));
        dispatch(resetCardStudyData({ studyScoreDataId }));
      } else if (!continueMode && !replay) {
        // New Game
        dispatch(createAppPracticeData({
          topicId: topic._id,
          userId,
          courseId: topic.courseId,
          parentId: topic.parentId,
          gameType: GAME_TYPE_TEST
        }));
      }
    }
    dispatch(setGameKey(Date.now()));
    dispatch(setTestView(TestView.PLAY));
  }

  const handleClickReview = () => {
    const reviewSection = document.getElementById(GAME_REVIEW_SECTION_ID);
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  const renderTestReviewPanel = () => {
    switch (topic?.topicExercise?.contentType) {
      case EXAM_TYPE_TOEIC:
        return <Box mt="10px"><TOEICOverview /></Box>;
      default:
        return <div className="test-game-image">
          <img className="test-game-image-img" src={passed ? "/images/practice-done.svg" : "/images/practice-in-progress.svg"} alt={passed ? 'passed' : 'failed'} />
        </div>;
    }
  }

  return <div id="test-overview" className={classNames("test-overview", hideSubList ? "hide-sublist" : "")}>
    {testView === TestView.NEW && <>
      <div className="test-game-image">
        <img className="test-game-image-img" src="/images/practice-in-progress.svg" alt="start" />
      </div>
      <div className="game-buttons single-button">
        <Button
          className="game-button game-button-play"
          onClick={() => handleClickPlay()}
        >Take test</Button>
      </div>
    </>}
    {testView === TestView.CONTINUE && <>
      <div className="test-game-image">
        <img className="test-game-image-img" src="/images/practice-in-progress.svg" alt="continue" />
      </div>
      <div className="game-buttons single-button">
        <Button className="game-button game-button-play" onClick={() => handleClickPlay({ continueMode: true })}>TIẾP TỤC</Button>
      </div>
    </>}
    {testView === TestView.REVIEW && <>
      <div className="test-game-done-title">
        {passed ? "Congratulations" : "Not enough to pass"}
      </div>
      {renderTestReviewPanel()}
      <div className={classNames("game-buttons", isMobileUI ? "mobile" : "")}>
        <Button className="game-button game-button-play" onClick={() => handleClickPlay({ replay: true })}>LÀM LẠI</Button>
        <Button className="game-button game-button-review" onClick={handleClickReview}>XEM LẠI</Button>
      </div>

      {isRenderDefaultOverview && <div className={classNames("box-buttons", isMobileUI ? "mobile" : "")}>
        <ContinueBox
          value={totalQuestions}
          label="Total"
          color="#FFC93F"
          disabled
        />

        <ContinueBox
          value={totalIncorrect}
          label="Incorrect"
          color="#FF5252"
          disabled
        />

        <ContinueBox
          value={totalCorrect}
          label="Correct"
          color="#82BC24"
          disabled
        />
      </div>}
    </>
    }
  </div >
}

export default TestOverview;