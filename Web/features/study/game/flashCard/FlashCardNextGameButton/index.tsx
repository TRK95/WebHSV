import { ChevronRight } from "@mui/icons-material";
import { Button } from "@mui/material";
import classNames from "classnames";
import { memo, PropsWithoutRef } from "react";
import { useDispatch, useSelector } from "../../../../../app/hooks";
import { getNextFlashCardGameObject } from "../../game.slice";
import "./flashCardNextGameButton.scss";

const FlashCardNextGameButton = memo((props: PropsWithoutRef<{ className?: string }>) => {
  const dispatch = useDispatch();
  const showNext = useSelector((state) => state.gameState.showNext);
  return showNext
    ? <Button
      className={classNames("flash-card-play-game-button-next-card", props.className)}
      onClick={() => {
        dispatch(getNextFlashCardGameObject());
      }}
      endIcon={<ChevronRight />}
    >
      Next
    </Button>
    : <></>
});

export default FlashCardNextGameButton;