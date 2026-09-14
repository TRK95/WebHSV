import { useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { PropsWithoutRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { getStorageURL } from "../../../../utils/format";
import { GameObjectStatus, GameTypes } from "../game.core";
import { TestView } from "../game.slice";
import GameAudioPlayer from "../GameAudioPlayer";
import GameObjectView from "../GameObjectView";
import QuestionView from "../QuestionView";
import { ParaGameObject } from "./ParaGameObject";
import "./paraGameView.scss";
const ParaGameView = (props: PropsWithoutRef<{
  gameObject: ParaGameObject;
  onAnswer?: () => void;
  isSize?: number;
  isRoot?: boolean;
}>) => {
  const { gameObject, isRoot } = props;
  const { isCheckShowCollapse, userPlaying, gameType, isDone, testView, showResultOnAnswer } = useSelector((state: any) => state.gameState);
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down('lg'));

  const _showResult = useMemo(() => {
    const isReview = (isDone || (gameType === GameTypes.TEST && testView === TestView.REVIEW));
    return (showResultOnAnswer && gameObject.status === GameObjectStatus.ANSWERED) || isReview;
  }, [isDone, gameType, testView, showResultOnAnswer, gameObject.status])

  return (<>
    {!!gameObject.question.urlSound && isRoot && <div className="game-object-question-sound-para">
      <GameAudioPlayer
        src={getStorageURL(gameObject.question.urlSound)}
        playOnRender={!!userPlaying && !!isRoot}
      />
    </div>}
    <div className={classNames(
      "game-object-view game-object-para",
      isTabletUI ? "tablet" : "",
      !!gameObject.question.urlSound && isRoot ? "has-sound" : ""
    )} id={gameObject.id}>
      <QuestionView question={gameObject.question} isPara isRoot={isRoot} isSize={12} />

      <div className={classNames(
        "game-object-para-children",
        !isCheckShowCollapse ? "showCollapse" : "",
        isTabletUI ? "tablet" : "",
        !gameObject.question.content && !gameObject.question.urlImage ? "no-parent-content" : ""
      )}>
        {gameObject.childGameObjects.map((childGameObject) => (
          <div className="game-object-child-wrap" key={childGameObject.id} id={`child-${gameObject.id}-${childGameObject.id}`}>
            <GameObjectView gameObject={childGameObject} showQuestionIndex />
          </div>
        ))}
      </div>
    </div>

    {_showResult &&
      !!gameObject.explanation &&
      isRoot &&
      <div
        className="game-object-question-explanation-para"
      >
        <div><b>Giải thích</b>:</div>
        <div
          dangerouslySetInnerHTML={{ __html: gameObject.explanation }}
        />
      </div>}
  </>)
}

export default ParaGameView;