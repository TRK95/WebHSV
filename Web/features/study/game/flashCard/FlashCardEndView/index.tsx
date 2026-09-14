import { Button } from "@mui/material";
import { useDispatch } from "../../../../../app/hooks";
import { FlashCardView, onStartFlashCardGame, setFlashCardView } from "../../game.slice";
import "./flashCardEndView.scss";

const FlashCardEndView = () => {
  const dispatch = useDispatch();
  return <div id="flash-card-end-view">
    <div className="done-view-title">Nice!</div>
    <div className="done-view-image-wrap">
      <img className="done-view-image" alt="congratulations" src="/images/practice-done.svg" />
    </div>

    <div className="flash-card-end-buttons">
      <Button
        className="flash-card-end-btn end-btn"
        onClick={() => dispatch(setFlashCardView(FlashCardView.OVERVIEW))}
      >
        End
      </Button>

      <Button
        className="flash-card-end-btn play-game-btn"
        onClick={() => {
          dispatch(setFlashCardView(FlashCardView.GAME));
          dispatch(onStartFlashCardGame());
        }}
      >
        Play game
      </Button>
    </div>
  </div>
}

export default FlashCardEndView;