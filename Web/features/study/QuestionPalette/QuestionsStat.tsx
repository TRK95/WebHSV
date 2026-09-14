import { memo, useMemo } from "react";
import { useSelector } from "../../../app/hooks";
import { GameTypes } from "../game/game.core";
import PaletteStatIcon from "./PaletteStatIcon";
import "./questionsStat.scss";

const QuestionStat = memo(() => {
  const totalQuestions = useSelector((state) => state.gameState.totalQuestions);
  const totalCorrect = useSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useSelector((state) => state.gameState.totalIncorrect);
  const gameType = useSelector((state) => state.gameState.gameType);

  const Labels = useMemo(() => {
    let correct = "Câu đúng";
    let incorrect = "Câu sai";
    if (gameType === GameTypes.FLASH_CARD) {
      correct = "Memorized"; incorrect = "Unmemorized";
    }
    return { correct, incorrect }
  }, [gameType]);

  return <div className="questions-stat">
    <div className="questions-stat-item">
      <PaletteStatIcon fill="#4CAF50" />
      <span className="questions-stat-item-text">{totalCorrect}/{totalQuestions} {Labels.correct}</span>
    </div>

    <div className="questions-stat-item">
      <PaletteStatIcon fill="#FF5252" />
      <span className="questions-stat-item-text">{totalIncorrect}/{totalQuestions} {Labels.incorrect}</span>
    </div>
  </div>
})

export default QuestionStat;