import { LinearProgress } from "@mui/material";
import { withStyles } from "@mui/styles";
import { memo, useMemo } from "react";
import { useSelector } from "../../../app/hooks";
import "./questionsProgress.scss";

const GameProgressBar = withStyles(({
  root: {
    backgroundColor: "#D8D9DC",
    height: 8,
    borderRadius: 50
  },
  barColorPrimary: { backgroundColor: "#4CAF50" }
}))(LinearProgress);

const QuestionsProgress = memo(() => {
  const totalQuestions = useSelector((state) => state.gameState.totalQuestions);
  const totalCorrect = useSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useSelector((state) => state.gameState.totalIncorrect);
  const totalAnswered = useMemo(() => totalCorrect + totalIncorrect, [totalCorrect, totalIncorrect]);
  return <div className="questions-progress">
    <div className="game-progress-bar">
      <GameProgressBar
        color="primary"
        variant="determinate"
        value={100 * (totalAnswered / (totalQuestions || 1))}
      />
    </div>
    <div className="progress-title">{totalAnswered}/{totalQuestions}</div>
  </div>
});

export default QuestionsProgress;