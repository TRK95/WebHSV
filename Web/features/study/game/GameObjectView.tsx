import { Box, useMediaQuery, useTheme } from "@mui/material";
import { memo, PropsWithoutRef, useEffect } from "react";
import ScrollContainer from "../../common/ScrollContainer";
import { FillParaGameObject } from "./fillPara/FillParaGameObject";
import FillParaGameView from "./fillPara/FillParaGameView";
import { GameObject } from "./game.core";
import { GAME_PANEL_ID } from "./GameView";
import { ParaGameObject } from "./para/ParaGameObject";
import ParaGameView from "./para/ParaGameView";
import { QuizGameObject } from "./quiz/QuizGameObject";
import QuizGameView from "./quiz/QuizGameView";
import { SpellingGameObject } from "./spelling/SpellingGameObject";
import SpellingGameView from "./spelling/SpellingGameView";

const GameObjectView = memo((props: PropsWithoutRef<{ gameObject: GameObject; showQuestionIndex?: boolean, isRoot?: boolean }>) => {
  const { gameObject, showQuestionIndex, isRoot } = props;
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  useEffect(() => {
    document.getElementById(GAME_PANEL_ID)?.scrollTo({ top: 0, behavior: "smooth" });
  }, [gameObject?.id]);

  const renderGame = () => {
    if (gameObject instanceof QuizGameObject) {
      return <QuizGameView
        gameObject={gameObject}
        key={gameObject.id}
        showQuestionIndex={showQuestionIndex}
        isRoot={isRoot}
      />
    } else if (gameObject instanceof SpellingGameObject) {
      return <SpellingGameView
        gameObject={gameObject}
        key={gameObject.id}
        showQuestionIndex={showQuestionIndex}
      />
    } else if (gameObject instanceof FillParaGameObject) {
      return <FillParaGameView
        key={gameObject.id}
        gameObject={gameObject}
        showQuestionIndex={showQuestionIndex}
      />
    } else if (gameObject instanceof ParaGameObject) {
      return <ParaGameView
        gameObject={gameObject}
        key={gameObject.id}
        isRoot={isRoot}
      />
    }
  }
  return isRoot
    ? (gameObject instanceof ParaGameObject
      ? <Box className="box-game-para" sx={{
        height: isTabletUI ? 485 : 500,
        "> .game-object-view": {
          height: "inherit"
        }
      }}>{renderGame()}</Box>
      : <div
        className="normal-root-container"
      >
        {renderGame()}
      </div>
    )
    : <>{renderGame()}</>
});

export default GameObjectView;