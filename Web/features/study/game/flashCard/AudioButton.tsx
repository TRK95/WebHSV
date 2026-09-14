import { VolumeUpTwoTone } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import classNames from "classnames";
import { ForwardedRef, forwardRef, MouseEventHandler, PropsWithoutRef, useState } from "react";
import ReactSound from "react-sound";

const AudioButton = forwardRef((props: PropsWithoutRef<{
  PlayVolumeIcon?: JSX.Element;
  PauseVolumeIcon?: JSX.Element;
  customIconVolume?: boolean;
  src: string;
  isPlaying?: boolean;
  onChange?: (isPlaying: boolean) => void;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  size?: "small" | "medium" | "large";
  defaultPlaying?: boolean;
}>, ref: ForwardedRef<HTMLButtonElement>) => {
  const {
    customIconVolume = false,
    PlayVolumeIcon = <></>,
    PauseVolumeIcon = <></>,
    src,
    isPlaying,
    onChange = () => { },
    onClick = () => { },
    className,
    size,
    defaultPlaying = false
  } = props;
  const [isReady, setReady] = useState(false);
  const [_isPlaying, setPlaying] = useState(defaultPlaying);

  return <>
    <IconButton
      ref={ref}
      sx={{
        color: isPlaying ? "#4caf50" : "#494949"
      }}
      className={classNames("app-game-audio-button", className)}
      onClick={(event) => {
        if (isReady) {
          onClick(event);
          if (typeof isPlaying === "undefined") {
            setPlaying(!_isPlaying);
          }
        }
      }}
      size={size}
    >
      {customIconVolume
        ? <>
          {_isPlaying ? <>{PlayVolumeIcon}</> : <>{PauseVolumeIcon}</>}
        </>
        : <VolumeUpTwoTone
          color="inherit"
          className={`${className}-icon`}
        />
      }
    </IconButton>
    <ReactSound
      url={src}
      autoLoad
      playStatus={(typeof isPlaying !== "undefined" && isPlaying) || _isPlaying ? "PLAYING" : "STOPPED"}
      onLoad={((args: { loaded: boolean }) => {
        setReady(args.loaded);
      }) as () => void}
      playFromPosition={0}
      onFinishedPlaying={() => {
        onChange(false);
        setPlaying(false);
      }}
    />
  </>
});

export default AudioButton;