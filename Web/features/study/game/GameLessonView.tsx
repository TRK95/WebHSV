import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { PropsWithoutRef } from "react";
import { ITopic } from "../../../modules/share/model/topic";
import ScrollContainer from "../../common/ScrollContainer";
import VideoPlayer from "../VideoPlayer";

const GameLessonView = (props: PropsWithoutRef<{
  onVideoProgress?: (args: { playedSecs: number, duration: number }) => void;
} & Pick<
  ITopic,
  "name" | "description" | "videoUrl"
>>) => {
  const { name, description, videoUrl, onVideoProgress } = props;
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  return <div className="game-object-view game-object-lesson">
    <Typography
      className="lesson-title"
      sx={{ textAlign: "center", fontWeight: 600, fontSize: 16, mb: "16px" }}
    >
      {name}
    </Typography>
    <ScrollContainer thumbSize={50}
      style={{ height: isTabletUI ? 485 : 500 }}
      className="normal-root-container">
      {!!videoUrl && <VideoPlayer
        url={videoUrl}
      />}
      {!!description && <Box
        sx={{ "& *": { fontFamily: "inherit !important" } }}
        className="game-lesson-view-content"
        dangerouslySetInnerHTML={{ __html: description }}
      />}
    </ScrollContainer>
  </div>
}

export default GameLessonView;