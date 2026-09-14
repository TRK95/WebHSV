import { IconButton } from "@mui/material";
import classNames from "classnames";
import { PropsWithoutRef, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../../../../app/hooks";
import { getFormattedContentWithImg } from "../../../../utils/format";
import { GameObjectStatus, GameTypes, QuestionItem } from "../game.core";
import { onAnswer, ReplayMode, TestView } from "../game.slice";
import QuestionView from "../QuestionView";
import ChoiceItem from "../quiz/ChoiceItem";
import QuizExplanation from "../quiz/QuizExplanation";
import { Choice } from "../quiz/QuizGameObject";
import CheckCorrectIcon from "./CheckCorrectIcon";
import SendAnswerIcon from "./SendAnswerIcon";
import { SpellingClientCardProgress, SpellingGameObject } from "./SpellingGameObject";
import "./spellingGameView.scss";
import TimesIncorrectIcon from "./TimesIncorrectIcon";

const SpellingGameView = (props: PropsWithoutRef<{
  gameObject: SpellingGameObject;
  showQuestionIndex?: boolean;
}>) => {
  const {
    gameObject,
    showQuestionIndex
  } = props;

  const showResultOnAnswer = useSelector((state) => state.gameState.showResultOnAnswer);
  const questionItem = useSelector((state) => state.gameState.questionItems.find((item) => item.id === gameObject.id));
  const gameType = useSelector((state) => state.gameState.gameType);
  const isDone = useSelector((state) => state.gameState.isDone);
  const testView = useSelector((state) => state.gameState.testView);
  const replayMode = useSelector((state) => state.gameState.replayMode);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const userId = useSelector((state) => state.authState.userId);
  const user = useSelector((state) => state.authState.user);
  const gameFunction = useSelector((state) => state.gameState.gameFunction);
  const isReview = isDone || (gameType === GameTypes.TEST && testView === TestView.REVIEW);

  const [answered, setAnswered] = useState(false);
  const [answer, setAnswer] = useState(questionItem?.answerText ?? "");

  const _showResult = useMemo(() => {
    return ((showResultOnAnswer && answered) || isReview)
  }, [showResultOnAnswer, answered, isReview]);

  useEffect(() => {
    setAnswered(questionItem?.status === GameObjectStatus.ANSWERED);
  }, [questionItem?.status]);

  useEffect(() => {
    if (replayMode !== ReplayMode.NONE) {
      setAnswered(false);
      setAnswer("");
    }
  }, [replayMode]);

  const dispatch = useDispatch();

  const onSubmitAnswer = () => {
    if (isReview) return;
    const _answer = answer.trim().toLowerCase();
    if (showResultOnAnswer) {
      if (questionItem.status === GameObjectStatus.NOT_ANSWER || replayMode !== ReplayMode.NONE) {
        const correct = gameObject.answer.split(" / ").map((e) => e.trim().toLowerCase()).includes(_answer);
        const cardProgress = new SpellingClientCardProgress({
          cardId: gameObject.id,
          topicId: topic._id,
          userId,
          answer: _answer,
          correct
        });
        const newQuestionItem = QuestionItem.clone(questionItem);
        newQuestionItem.setProgress({ correct, status: GameObjectStatus.ANSWERED });
        newQuestionItem.setAnswerText(answer);
        dispatch(onAnswer({
          questionItem: newQuestionItem,
          cardProgress
        }));
        if (!!user) {
          if (gameType === GameTypes.PRACTICE) {
            if (!!gameFunction?.onAnswer) {
              gameFunction.onAnswer(cardProgress);
            }
          }
        }
      }
      setAnswered(true);
    } else {
      const correct = gameObject.answer.split(" / ").map((e) => e.trim().toLowerCase()).includes(_answer);
      const cardProgress = new SpellingClientCardProgress({
        cardId: gameObject.id,
        topicId: topic._id,
        userId,
        answer: _answer,
        correct
      });
      const newQuestionItem = QuestionItem.clone(questionItem);
      newQuestionItem.setProgress({ correct, status: GameObjectStatus.ANSWERED });
      newQuestionItem.setAnswerText(answer);
      dispatch(onAnswer({
        questionItem: newQuestionItem,
        cardProgress
      }));
      if (!!user) {
        if (gameType === GameTypes.TEST) {
          if (!!gameFunction?.onAnswer) {
            gameFunction.onAnswer(cardProgress);
          }
        }
      }
    }
  }

  return <div className="game-object-view game-object-spelling">
    <div className="question-index-wrap">
      {showQuestionIndex && <div className="game-object-view-question-index">
        <span>{questionItem?.index}.</span>
      </div>}

      <QuestionView question={gameObject.question} className="spelling-game-object-question" />
    </div>

    <div className="game-object-spelling-answer-box">
      <div className="answer-box-wrap">
        <input
          placeholder={_showResult ? "" : "Your answer..."}
          value={answer}
          onChange={(evt) => setAnswer(evt.target.value)}
          readOnly={_showResult}
          className={classNames(
            _showResult
            && (questionItem?.correct ? "input-correct-answer" : "input-incorrect-answer")
          )}
          onBlur={() => {
            if (!showResultOnAnswer) {
              onSubmitAnswer();
            }
          }}
        />

        <div className="answer-box-button">
          {_showResult
            ? <>
              {questionItem?.correct
                ? <CheckCorrectIcon />
                : <TimesIncorrectIcon />
              }
            </>
            : <>
              {showResultOnAnswer
                ? <IconButton onClick={onSubmitAnswer}>
                  <SendAnswerIcon />
                </IconButton>
                : <></>
              }
            </>
          }
        </div>
      </div>
    </div>

    {_showResult && <>
      <ChoiceItem
        choice={new Choice({ content: gameObject.answer, isCorrect: true })}
        showResult
        disabled
      />
      <QuizExplanation
        explanation={getFormattedContentWithImg(gameObject.explanation)}
      />
    </>
    }
  </div>
}

export default SpellingGameView;