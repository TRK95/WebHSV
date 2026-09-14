import classNames from "classnames";
import _ from "lodash";
import { Fragment, PropsWithoutRef, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../../../../app/hooks";
import { getFormattedContentWithImg } from "../../../../utils/format";
import { ExplanationType, GameObjectStatus, GameTypes, QuestionItem } from "../game.core";
import { onAnswer, ReplayMode, setCurrentCardId, TestView } from "../game.slice";
import QuestionView from "../QuestionView";
import ChoiceItem from "./ChoiceItem";
import QuizExplanation from "./QuizExplanation";
import { Choice, QuizClientCardProgress, QuizGameObject } from "./QuizGameObject";
import "./quizGameView.scss";

const QuizGameView = (props: PropsWithoutRef<{
  gameObject: QuizGameObject;
  showQuestionIndex?: boolean;
  questionClassName?: string;
  onSelectChoice?: (choice: Choice) => void;
  showResult?: boolean;
  resetOnChangeGame?: boolean;
  explanationType?: ExplanationType;
  isRoot?: boolean;
}>) => {
  const {
    gameObject, showQuestionIndex,
    questionClassName,
    onSelectChoice: _onSelectedChoice,
    showResult,
    resetOnChangeGame,
    explanationType,
    isRoot
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

  const [selected, setSelected] = useState<number[]>(questionItem?.selectedChoices ?? []);

  const _showResult = useMemo(() => {
    return typeof _onSelectedChoice !== "undefined"
      ? showResult
      : ((showResultOnAnswer && gameObject.numberOfAnswers === selected.length) || isReview)
  }, [typeof _onSelectedChoice, showResult, showResultOnAnswer, gameObject.numberOfAnswers, selected.length, isReview]);

  useEffect(() => {
    if (replayMode !== ReplayMode.NONE) {
      setSelected([]);
    }
  }, [replayMode]);

  useEffect(() => {
    if (resetOnChangeGame) {
      setSelected([]);
    }
  }, [resetOnChangeGame, gameObject?.id])

  const dispatch = useDispatch();

  const onSelectChoice = (choice: Choice, cardId: string) => {
    if (_showResult) return;
    if (typeof _onSelectedChoice !== "undefined") {
      let _selected = [...selected];
      if (gameObject.numberOfAnswers > _selected.length) {
        _selected.push(choice.id);
      } else {
        _selected = [choice.id];
      }
      setSelected(_selected)
      _onSelectedChoice(choice);
    } else {
      if (choice.isCorrect) {
        dispatch(setCurrentCardId(cardId))
      }
      if (showResultOnAnswer) {
        if (questionItem.status === GameObjectStatus.NOT_ANSWER || replayMode !== ReplayMode.NONE) {
          const isSelected = _.includes(selected, choice.id);
          if (isSelected || selected.length === gameObject.numberOfAnswers) return;
          const _selected = [...selected, choice.id];
          if (_selected.length === gameObject.numberOfAnswers) {
            const correct = gameObject.choices
              .filter((choice) => _selected.includes(choice.id))
              .every((choice) => choice.isCorrect);
            const cardProgress = new QuizClientCardProgress({
              cardId: gameObject.id,
              topicId: topic._id,
              userId,
              // TODO: shuffle
              choiceOrder: _.range(gameObject.choices.length),
              selectedChoices: _selected,
              correct
            });
            // const newGameObject = QuizGameObject.fromGameObject(gameObject);
            // newGameObject.setProgress({ correct, status: GameObjectStatus.ANSWERED })
            // newGameObject.setSelectedChoices(_selected);
            const newQuestionItem = QuestionItem.clone(questionItem);
            newQuestionItem.setProgress({ correct, status: GameObjectStatus.ANSWERED });
            newQuestionItem.setSelectedChoices(_selected);
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
          setSelected(_selected);
        }
      } else {
        let _selected = [...selected];
        if (gameObject.numberOfAnswers > _selected.length) {
          _selected.push(choice.id);
        } else {
          _selected = [choice.id];
        }
        if (_selected.length === gameObject.numberOfAnswers) {
          const correct = gameObject.choices
            .filter((choice) => _selected.includes(choice.id))
            .every((choice) => choice.isCorrect);
          const cardProgress = new QuizClientCardProgress({
            cardId: gameObject.id,
            topicId: topic._id,
            userId,
            // TODO: shuffle
            choiceOrder: _.range(gameObject.choices.length),
            selectedChoices: _selected,
            correct
          });
          const newQuestionItem = QuestionItem.clone(questionItem);
          newQuestionItem.setProgress({ correct, status: GameObjectStatus.ANSWERED });
          newQuestionItem.setSelectedChoices(_selected);
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
        setSelected(_selected);
      }
    }
  }

  return (<div className="game-object-view game-object-quiz">
    <div className="question-index-wrap">
      {showQuestionIndex && <div className="game-object-view-question-index">
        <span>{questionItem?.index}.</span>
      </div>}
      <QuestionView question={gameObject.question} className={classNames("quiz-game-object-question", questionClassName)} isRoot={isRoot} />
    </div>

    <div className="game-object-quiz-choices">
      {gameObject.numberOfAnswers > 1 && <div className="game-object-quiz-choices-label">
        Select {gameObject.numberOfAnswers} answers {gameObject.splitPointAnswers ? "(1 point/answer)" : ""}
      </div>}
      {gameObject.choices.map((choice, i) => {
        const isLastCorrectChoice = choice.isCorrect && i === _.findLastIndex(gameObject.choices, (c) => c.isCorrect);
        return <Fragment key={choice.id}>
          <ChoiceItem
            choice={{
              ...choice,
              isSelected: _.includes(selected, choice.id)
            }}
            last={i === gameObject.choices.length - 1}
            onSelect={() => { onSelectChoice(choice, gameObject.id); }}
            showResult={_showResult}
            multiplePicking={gameObject.numberOfAnswers !== selected.length}
          />
          {isLastCorrectChoice
            && _showResult
            && <QuizExplanation explanation={getFormattedContentWithImg(gameObject.explanation)} type={explanationType} />}
        </Fragment>
      })}
    </div>
  </div>);
}

export default QuizGameView;