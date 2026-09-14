import { Button } from "@mui/material";
import { MouseEvent, PropsWithoutRef, useEffect, useMemo, useRef, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { useDispatch, useSelector } from "../../../../app/hooks";
import { getFormattedContentWithImg, getStorageURL } from "../../../../utils/format";
import { ClientCardProgress, GameObjectStatus, QuestionItem } from "../game.core";
import { getNextFlashCardGameObject } from "../game.slice";
import AudioButton from "./AudioButton";
import { FlashCardGameObject } from "./FlashCardGameObject";
import "./flashCardPracticeView.scss";
import useSubmitFlashCard from "./useSubmitFlashCard";

const FlashCardPracticeView = (props: PropsWithoutRef<{
  gameObject: FlashCardGameObject;
  isFirstCard?: boolean;
}>) => {
  const { gameObject, isFirstCard } = props;
  const [isFlipped, setFlipped] = useState(false);
  const [isPlayingAudio, setPlayingAudio] = useState(false);
  const [isFlipping, setFlipping] = useState(false);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const userId = useSelector((state) => state.authState.userId);
  const user = useSelector((state) => state.authState.user);
  const cardProgresses = useSelector((state) => state.gameState.cardProgresses);
  const questionItem = useSelector((state) => state.gameState.questionItems.find((item) => item.id === gameObject.id));

  const isSafari = useMemo(() => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf("safari/") > -1 && ua.indexOf("chrome") === -1;
  }, [navigator.userAgent]);

  const { statusLabel, statusColor } = useMemo(() => {
    let statusLabel = "New";
    let statusColor = '#F2C94C';
    if (gameObject?.status === GameObjectStatus.ANSWERED) {
      statusLabel = gameObject?.isCorrect ? "Memorized" : "Unmemorized";
      statusColor = gameObject?.isCorrect ? "#26C048" : "#B5C1EA"
    }
    return { statusLabel, statusColor };
  }, [gameObject?.status, gameObject?.isCorrect])

  const submitCorrectRef = useRef<HTMLButtonElement | null>(null);
  const submitIncorrectRef = useRef<HTMLButtonElement | null>(null);
  const audioBtnRef = useRef<HTMLButtonElement | null>(null);
  const dispatch = useDispatch();

  const { onSubmit: onSubmitFlashCard } = useSubmitFlashCard();

  useEffect(() => {
    setFlipped(false);
  }, [gameObject?.id]);

  useEffect(() => {
    if (gameObject && gameObject.question.urlSound && !(isFirstCard && isSafari)) {
      if (!isPlayingAudio) {
        setPlayingAudio(true);
      }
    }
  }, [isFirstCard, gameObject?.id, isSafari])

  const onFlipCard = () => {
    if (isFlipping) return;
    setFlipping(true);
    setFlipped(!isFlipped);
    setTimeout(() => {
      setFlipping(false);
    }, 600);
  }

  const onSubmitCard = (correct: boolean) => {
    onSubmitFlashCard({
      gameObject,
      correct
    });
    dispatch(getNextFlashCardGameObject());
  }

  const handleClickCard = (evt: MouseEvent<HTMLDivElement>) => {
    const node = evt.target as Node;
    if (audioBtnRef.current?.contains(node)) {
      if (!isPlayingAudio) {
        setPlayingAudio(true);
      }
    }
    else if (submitCorrectRef.current?.contains(node)) {
      onSubmitCard(true);
    } else if (submitIncorrectRef.current?.contains(node)) {
      onSubmitCard(false);
    } else {
      onFlipCard();
    }
  }

  return <div id="flash-card-practice-view">
    <div className="main-flip-card-area">
      <div className="flip-card-area-header">
        <span style={{ background: statusColor }}>
          {statusLabel}
        </span>
      </div>
      <ReactCardFlip containerClassName="sm-game-flash-card-wrap" isFlipped={isFlipped} flipDirection="horizontal">
        <div className="flash-card-side front" onClick={handleClickCard}>
          <div className="flash-card-side-body">
            {!!gameObject?.question?.urlImage && (
              <div className="flash-card-side-image">
                <img src={getStorageURL(gameObject?.question?.urlImage)} alt="" />
              </div>
            )}
            {!!gameObject?.question?.content && (
              <div className="flash-card-side-content"
                dangerouslySetInnerHTML={{ __html: getFormattedContentWithImg(gameObject?.question?.content) }}
              >
              </div>
            )}
            {!!gameObject?.question?.hint && (
              <div className="flash-card-side-hint"
                dangerouslySetInnerHTML={{ __html: getFormattedContentWithImg(gameObject?.question?.hint) }}
              >
              </div>
            )}
          </div>

          <div className="flash-card-side-footer">
            <Button className="explanation-button">
              Press to see explanation and example
            </Button>
          </div>
        </div>

        <div className="flash-card-side back" onClick={handleClickCard}>
          <div className="flash-card-side-body">
            {!!gameObject?.backText && (
              <div className="flash-card-side-back-hint"
                dangerouslySetInnerHTML={{ __html: getFormattedContentWithImg(gameObject?.backText) }}
              >
              </div>
            )}

            {!!gameObject?.explanation && (
              <div className="flash-card-side-back-content"
                dangerouslySetInnerHTML={{ __html: getFormattedContentWithImg(gameObject?.explanation) }}
              >
              </div>
            )}
          </div>

          <div className="flash-card-side-footer">
            <Button className="flash-card-button-submit flash-card-button-unmem" ref={submitIncorrectRef}>
              Study Again
            </Button>

            <Button className="flash-card-button-submit flash-card-button-mem" ref={submitCorrectRef}>
              Got It
            </Button>
          </div>
        </div>
      </ReactCardFlip>
      <AudioButton
        ref={audioBtnRef}
        src={getStorageURL(gameObject?.question?.urlSound)}
        isPlaying={isPlayingAudio}
        onChange={setPlayingAudio}
        onClick={() => {
          if (!isPlayingAudio) setPlayingAudio(true);
        }}
        size="large"
        className="flash-card-audio-button"
      />
    </div>
  </div>
}

export default FlashCardPracticeView;