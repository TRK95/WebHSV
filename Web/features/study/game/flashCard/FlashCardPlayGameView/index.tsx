import { useMediaQuery, useTheme } from "@mui/material";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../../../app/hooks";
import { getStorageURL } from "../../../../../utils/format";
import { GameObject } from "../../game.core";
import { setShowNext } from "../../game.slice";
import { QuizGameObject } from "../../quiz/QuizGameObject";
import QuizGameView from "../../quiz/QuizGameView";
import AudioButton from "../AudioButton";
import { FlashCardGameObject, FlashCardGameTypes } from "../FlashCardGameObject";
import FlashCardNextGameButton from "../FlashCardNextGameButton";
import useSubmitFlashCard from "../useSubmitFlashCard";
import "./flashCardPlayGameView.scss";

const FlashCardPlayGameView = () => {
  const currentGame = useSelector((state) => state.gameState.currentGame);
  const gameObjects = useSelector((state) => state.gameState.gameObjects);
  const showNext = useSelector((state) => state.gameState.showNext);
  const [game, setGame] = useState<FlashCardGameTypes | null>(null);
  const [gameObject, setGameObject] = useState<GameObject | null>(null)
  const [showResult, setShowResult] = useState(false);
  const [isPlayingAudio, setPlayingAudio] = useState(false);
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  const dispatch = useDispatch();

  const { onSubmit: onSubmitFlashCard } = useSubmitFlashCard();

  useEffect(() => {
    if (!!currentGame?.id) {
      const _game = _.sample([
        FlashCardGameTypes.QUIZ,
        // FlashCardGameTypes.SPELLING
      ]);
      setGame(_game);
      setShowResult(false);
      setGameObject((currentGame as FlashCardGameObject).toQuizGameObject({ samples: gameObjects as FlashCardGameObject[] }));
    }
  }, [currentGame?.id]);

  useEffect(() => {
    dispatch(setShowNext(showResult));
  }, [showResult]);

  const onSubmitAnswer = (correct: boolean) => {
    onSubmitFlashCard({
      gameObject: gameObject as FlashCardGameObject,
      correct
    });
  }

  const renderGame = () => {
    if (!gameObject) return <></>;
    switch (game) {
      case FlashCardGameTypes.QUIZ:
        return <QuizGameView
          gameObject={gameObject as QuizGameObject}
          questionClassName="flash-card-quiz-question"
          onSelectChoice={(choice) => {
            onSubmitAnswer(choice.isCorrect);
            setShowResult(true);
          }}
          showResult={showResult}
          resetOnChangeGame
          explanationType="example"
        />;
      case FlashCardGameTypes.SPELLING:
        return <></>;
      default:
        return <></>;
    }
  }

  return game !== null
    ? <>
      <div id="flash-card-play-game-view">
        <AudioButton
          src={getStorageURL(currentGame?.question?.urlSound)}
          isPlaying={isPlayingAudio}
          onChange={setPlayingAudio}
          onClick={() => {
            if (!showResult) return;
            if (!isPlayingAudio) setPlayingAudio(true);
          }}
          size="large"
          className="flash-card-audio-button"
        />
        {renderGame()}
        {!isTabletUI && <FlashCardNextGameButton className="flash-card-desktop-footer-right" />}
      </div>
    </>
    : <></>
}

export default FlashCardPlayGameView;