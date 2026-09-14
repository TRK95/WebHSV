import classNames from "classnames";
import { PropsWithoutRef } from "react";
import { useSelector } from "../../../../app/hooks";
import { getFormattedContentWithImg } from "../../../../utils/format";
import RichContent from "../RichContent";
import "./choiceItem.scss";
import QuizBoxIcon from "./QuizBoxIcon";
import QuizBoxSelectedIcon from "./QuizBoxSelectedIcon";
import QuizCorrectIcon from "./QuizCorrectIcon";
import { Choice } from "./QuizGameObject";
import QuizIncorrectIcon from "./QuizIncorrectIcon";

const ChoiceItem = (props: PropsWithoutRef<{
  choice: Choice;
  last?: boolean;
  onSelect?: () => void;
  showResult?: boolean;
  multiplePicking?: boolean;
  disabled?: boolean
}>) => {
  const { choice, last = false, onSelect = () => { }, showResult = false, multiplePicking = false, disabled } = props;
  const mathJax = useSelector((state) => state.gameState.mathJax);
  const renderIconItem = () => {
    if ((showResult && (choice.isSelected || choice.isCorrect)) || (showResult && multiplePicking && choice.isSelected)) {
      return choice.isCorrect ? <QuizCorrectIcon /> : <QuizIncorrectIcon />
    } else {
      return choice.isSelected ? <QuizBoxSelectedIcon /> : <QuizBoxIcon className="quiz-choice-item-icon-svg" />
    }
  }

  return <div
    className={classNames(
      "quiz-choice-item",
      last ? "item-last" : "",
      showResult && choice.isSelected ? "picking" : "",
      disabled ? "disabled" : ""
    )}
    onClick={onSelect}
  >
    <div className={classNames(
      "quiz-choice-item-icon",
      showResult ? "show-result" : ""
    )}>
      {renderIconItem()}
    </div>
    <RichContent mathJax={mathJax}>
      <div className={classNames(
        "quiz-choice-item-content",
        showResult && !choice.isSelected && !choice.isCorrect ? "not-selected" : "",
        showResult && choice.isSelected && !choice.isCorrect ? "incorrect" : "",
        showResult && choice.isSelected && choice.isCorrect ? "correct" : "",
        !showResult && choice.isSelected ? "picking" : ""
      )}
        dangerouslySetInnerHTML={{ __html: getFormattedContentWithImg(choice.content) }}
      ></div>
    </RichContent>
  </div>
}

export default ChoiceItem;