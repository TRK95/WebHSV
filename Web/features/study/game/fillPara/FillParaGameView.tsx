import { Button } from "@mui/material";
import classNames from "classnames";
import {
  PropsWithoutRef,
  useEffect,
  useMemo,
  useState
} from "react";
import { useDispatch, useSelector } from "../../../../app/hooks";
import { getStorageURL } from "../../../../utils/format";
import { GameObjectStatus, GameTypes, QuestionItem } from "../game.core";
import { onAnswer, onSubmitFillPara, TestView } from "../game.slice";
import GameAudioPlayer from "../GameAudioPlayer";
import ImageWidget from "../ImageWidget";
import { SpellingClientCardProgress } from "../spelling/SpellingGameObject";
import { FillParaGameObject } from "./FillParaGameObject";
import "./fillParaGameView.scss";

const FillParaGameView = (props: PropsWithoutRef<{
  gameObject: FillParaGameObject;
  showQuestionIndex?: boolean;
}>) => {
  const { gameObject, showQuestionIndex } = props;
  const showResultOnAnswer = useSelector((state) => state.gameState.showResultOnAnswer);
  const gameType = useSelector((state) => state.gameState.gameType);
  const isDone = useSelector((state) => state.gameState.isDone);
  const testView = useSelector((state) => state.gameState.testView);
  const questionItems = useSelector((state) => state.gameState.questionItems);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const userId = useSelector((state) => state.authState.userId);
  const user = useSelector((state) => state.authState.user);
  const gameFunction = useSelector((state) => state.gameState.gameFunction);
  const isReview = isDone || (gameType === GameTypes.TEST && testView === TestView.REVIEW);

  const [isReady, setReady] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null);

  const _showResult = useMemo(() => {
    return (showResultOnAnswer && answered) || isReview;
  }, [showResultOnAnswer, answered, isReview]);

  const gameQuestions = useMemo(() => {
    return questionItems.filter((item) => item.path.includes(gameObject.id)).sort((a, b) => a.index - b.index);
  }, [questionItems, gameObject.id]);

  const dispatch = useDispatch();

  useEffect(() => {
    const gameQuestions = questionItems.filter((item) => item.path.includes(gameObject.id));
    setAnswered(gameQuestions.every((item) => item.status === GameObjectStatus.ANSWERED));
  }, [gameObject.id]);

  useEffect(() => {
    setReady(false);
    if (contentRef) {
      const _inputEls = contentRef.querySelectorAll("input");
      const inputEls = Array.from(_inputEls).sort((a, b) => {
        const aIdx = Number(a.id.slice(a.id.lastIndexOf('-') + 1));
        const bIdx = Number(b.id.slice(b.id.lastIndexOf('-') + 1));
        if (isNaN(aIdx) || isNaN(bIdx)) return 0;
        return aIdx - bIdx;
      });
      inputEls.map((inputEl, index) => {
        const inputGameObject = gameObject.childGameObjects[index];
        const inputId = inputGameObject?.id;
        const questionItem = questionItems.find((item) => item.id === inputGameObject.id);
        if (!inputId || !questionItem) return;
        inputEl.value = questionItem.answerText || '';
        inputEl.setAttribute("autocomplete", "off");
        inputEl.setAttribute("id", `${inputId}-${index}`);
        inputEl.className = "fill-para-input";

        const questionIndexEl = inputEl.previousElementSibling;
        if (questionIndexEl) {
          questionIndexEl.setAttribute("class", "fill-para-question-index")
        }

        const explanationBtnEl = contentRef.getElementsByClassName(`explanation-${inputId}`).item(0);
        const explanationContentEl = contentRef.getElementsByClassName(`explanation-content-${inputId}`).item(0);
        if (!explanationContentEl) {
          const _explanationContentEl = document.createElement("div");
          _explanationContentEl.className = `explanation-content-${inputId} fill-para-explanation-content collapsed`;
          _explanationContentEl.innerHTML = `
            <div><b>Câu trả lời chính xác</b>: ${inputGameObject.answer}</div>
            ${!!inputGameObject.explanation ? `<div><b>Giải thích</b>: ${inputGameObject.explanation}</div>` : ''}
          `;
          inputEl.parentNode.insertBefore(_explanationContentEl, inputEl.nextSibling);
        };
        if (!_showResult) {
          if (explanationBtnEl) { explanationBtnEl.outerHTML = "" };
          inputEl.readOnly = false;
          inputEl.classList.remove("answered", "correct", "incorrect");
          inputEl.onkeyup = (evt) => {
            onChangeInput({ questionId: inputId, value: inputEl.value.trim().toLocaleLowerCase() });
          }
          inputEl.onblur = (evt) => {
            onChangeInput({ questionId: inputId, value: inputEl.value.trim().toLocaleLowerCase() });
          }
        } else {
          inputEl.readOnly = true;
          inputEl.classList.add("answered", questionItem.correct ? "correct" : "incorrect");
          inputEl.onkeyup = (evt) => { evt.preventDefault(); return; }
          inputEl.onblur = (evt) => { evt.preventDefault(); return; };
          if (!explanationBtnEl) {
            const _explanationBtnEl = document.createElement("span");
            _explanationBtnEl.className = `explanation-${inputId} fill-para-explanation-button`;
            _explanationBtnEl.innerHTML = 'Hiển thị giải thích';
            _explanationBtnEl.onclick = (evt) => {
              const _explanationContentEl = document.getElementsByClassName(`explanation-content-${inputId}`).item(0);
              if (_explanationContentEl) {
                if (_explanationContentEl.classList.contains("collapsed")) {
                  _explanationContentEl.classList.remove("collapsed");
                  _explanationBtnEl.innerHTML = 'Ẩn giải thích';
                } else {
                  _explanationContentEl.classList.add("collapsed");
                  _explanationBtnEl.innerHTML = 'Hiển thị giải thích';
                }
              }
            }
            inputEl.parentNode.insertBefore(_explanationBtnEl, inputEl.nextSibling);
          }
        }
      });
      setReady(true);
    }
  }, [contentRef, gameObject.id, _showResult]);

  const onChangeInput = (args: {
    questionId: string;
    value: string;
  }) => {
    const { questionId, value } = args;
    const questionItem = gameQuestions.find((item) => item.id === questionId);
    const inputGameObject = gameObject.childGameObjects.find((go) => go.id === questionId);
    if (inputGameObject && questionItem) {
      const correct = inputGameObject.answer.split(" / ").map((e) => e.trim().toLowerCase()).includes(value);
      const cardProgress = new SpellingClientCardProgress({
        cardId: questionId,
        topicId: topic._id,
        userId,
        answer: value,
        correct
      });
      const newQuestionItem = QuestionItem.clone(questionItem || {} as QuestionItem);
      newQuestionItem.setProgress({ correct, status: GameObjectStatus.NOT_ANSWER });
      newQuestionItem.setAnswerText(value);
      dispatch(onAnswer({
        questionItem: newQuestionItem,
        cardProgress,
        isFillPara: !!showResultOnAnswer
      }));
      if (!!user) {
        if (gameType === GameTypes.PRACTICE) {
          if (!!gameFunction?.onAnswer) {
            gameFunction.onAnswer(cardProgress);
          }
        }
      }
    }
  }

  return <div className="game-object-view game-object-fill-para">
    {showQuestionIndex && <div className="game-object-view-question-index">
      <span>{gameQuestions.length > 1
        ? `${gameQuestions[0]?.index ?? ''} - ${gameQuestions[gameQuestions.length]?.index ?? ''}`
        : `${gameQuestions[0]?.index ?? ''}`
      }.</span>
    </div>}
    {!!gameObject.question.urlSound && <div className="game-object-question-sound">
      <GameAudioPlayer src={getStorageURL(gameObject.question.urlSound)} />
    </div>}

    {!!gameObject.question.urlImage && <div className="game-object-question-image">
      <ImageWidget src={getStorageURL(gameObject.question.urlImage)} width={300} />
    </div>}

    <div
      id={gameObject.id}
      ref={setContentRef}
      className={classNames(
        "game-object-question-text fill-para-question-text",
        isReady ? "ready" : ""
      )}
      dangerouslySetInnerHTML={{ __html: gameObject.question.content }}
    />
    {showResultOnAnswer && !_showResult && isReady && <div className="fill-para-submit">
      <Button
        className="fill-para-submit-button"
        onClick={() => {
          setAnswered(true);
          const arrCardProgress = gameQuestions.map((item) => new SpellingClientCardProgress({
            cardId: item.id, topicId: topic._id, userId,
          }));
          dispatch(onSubmitFillPara({
            gameObject, arrCardProgress
          }));
        }}
      >
        Nộp bài
      </Button>
    </div>}
  </div>

}

export default FillParaGameView;