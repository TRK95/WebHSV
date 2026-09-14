import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from "@mui/material";
import { styled } from "@mui/styles";
import classNames from "classnames";
import { useMemo } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { GameTypes } from "./game.core";
import { getGameReviewNav, getNextGameObject, getPreviousGameObject, setShowNext, TestView } from "./game.slice";

const IconPrev = styled(ArrowBackIosIcon)({ height: "12px", width: "auto" });
const IconNext = styled(ArrowForwardIosIcon)({ height: "12px", width: "auto" });

const GameNavButtons = () => {
  const showResultOnAnswer = useSelector((state) => state.gameState.showResultOnAnswer);
  const gameType = useSelector((state) => state.gameState.gameType);
  const showNext = useSelector((state) => state.gameState.showNext);
  const showReviewNav = useSelector((state) => state.gameState.showReviewNav);
  const testView = useSelector((state) => state.gameState.testView);
  const currentGameIdx = useSelector((state) => state.gameState.currentGameIdx);
  const currentGame = useSelector((state) => state.gameState.currentGame);
  const gameObjects = useSelector((state) => state.gameState.gameObjects);
  const totalGames = useMemo(() => gameObjects.length, [gameObjects.length])
  const currentViewGameIdx = useMemo(() => gameObjects.findIndex((go) => go.id === currentGame?.id), [currentGame?.id]);

  const dispatch = useDispatch();

  if (gameType !== GameTypes.FLASH_CARD) {
    if (showResultOnAnswer) {
      return showNext
        ? <>
          <Button className="main-game-object-button main-game-object-continue-button single-node" onClick={() => {
            dispatch(setShowNext(false));
            dispatch(getNextGameObject());
          }} endIcon={<IconNext />}>
            Next
          </Button>
        </>
        : (showReviewNav
          ? <>
            {currentViewGameIdx !== 0 && <Button
              className="main-game-review-nav main-game-review-nav-prev"
              onClick={() => {
                dispatch(getGameReviewNav({ isNext: false }));
              }}
            >
              <IconPrev />
            </Button>}

            {currentViewGameIdx !== totalGames - 1 && <Button
              className="main-game-review-nav main-game-review-nav-next"
              onClick={() => {
                dispatch(getGameReviewNav({ isNext: true }));
              }}
            >
              <IconNext />
            </Button>}
          </>
          : <></>);
    } else {
      if (testView === TestView.PLAY) {
        return <>
          {currentGameIdx !== 0 && <Button
            className="main-game-object-button main-game-object-prev-button"
            onClick={() => {
              dispatch(getPreviousGameObject());
            }}
            startIcon={<IconPrev />}
          >
            Previous
          </Button>}

          {currentGameIdx !== totalGames - 1 && <Button
            className={classNames(
              "main-game-object-button main-game-object-continue-button",
              currentGameIdx === 0 ? "single-node" : ""
            )}
            onClick={() => {
              dispatch(getNextGameObject());
            }}
            endIcon={<IconNext />}
          >
            Next
          </Button>}
        </>
      }
      return <></>;
    }
  }
  return <></>
}

export default GameNavButtons;