import { Fullscreen, FullscreenExit, Pause, PlayArrow, VolumeDown, VolumeOff, VolumeUp } from "@mui/icons-material";
import Slider from "@mui/material/Slider";
import { IconButton, Tooltip } from "@mui/material";
import classNames from "classnames";
import moment from "moment";
import momentDurationFormat from "moment-duration-format";
import { forwardRef, PropsWithoutRef, useEffect, useRef, useState } from "react";
import { findDOMNode } from "react-dom";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import "./videoPlayer.scss";

momentDurationFormat(moment as any);
let nonInteractiveTimeout: any = null;

const formatDuration = (value: number, unit: moment.unitOfTime.DurationConstructor) => {
  return moment.duration(value, unit).format(value > 3600 ? "HH:mm:ss" : "mm:ss", { trim: false })
}

const VideoPlayer = forwardRef((props: PropsWithoutRef<{
  playOnRender?: boolean;
  id?: any;
  className?: string;
  url?: string;
}>, ref: any) => {
  const {
    playOnRender,
    id,
    className,
    url
  } = props;
  const [isPlaying, setPlaying] = useState(!!playOnRender);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [isHideControl, setHideControl] = useState(!!playOnRender);
  const [isEnd, setEnd] = useState(false);
  const [isFullScreen, setFullScreen] = useState(false);
  const [isFullScreenMac, setFullScreenMac] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playedSecs, setPlayedSecs] = useState(0);
  const [isSeeking, setSeeking] = useState(false);

  const videoContainerRef = useRef<HTMLDivElement>();
  const videoPlayerRef = useRef<ReactPlayer>();

  useEffect(() => {
    const exitHandler = () => {
      if (
        !document.fullscreenElement &&
        !document['webkitIsFullScreen'] &&
        !document['mozFullScreen'] &&
        !document['msFullscreenElement']
      ) {
        setFullScreen(false);
        setFullScreenMac(false);
      }
    }

    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('mozfullscreenchange', exitHandler);
    document.addEventListener('MSFullscreenChange', exitHandler);
    return () => {
      document.removeEventListener('fullscreenchange', exitHandler);
      document.removeEventListener('webkitfullscreenchange', exitHandler);
      document.removeEventListener('mozfullscreenchange', exitHandler);
      document.removeEventListener('MSFullscreenChange', exitHandler);
      if (nonInteractiveTimeout) {
        clearTimeout(nonInteractiveTimeout);
      }
    }
  }, []);

  const handleNonInteractiveTimeout = (args: { hide: boolean; play: boolean }) => {
    const { hide, play } = args;
    if (play) {
      if (hide) {
        clearTimeout(nonInteractiveTimeout);
        setHideControl(false);
        nonInteractiveTimeout = setTimeout(() => {
          setHideControl(true);
        }, 2500);
      } else {
        clearTimeout(nonInteractiveTimeout);
        setHideControl(false);
      }
    }
  }

  const handlePausePlay = () => {
    clearTimeout(nonInteractiveTimeout);
    setHideControl(false);
    if (!isEnd) {
      handleNonInteractiveTimeout({ hide: !isPlaying, play: !isPlaying });
      setPlaying(!isPlaying);
    } else {
      videoPlayerRef?.current?.seekTo(0);
      setPlaying(true);
      setEnd(false);
    }
  }

  const handleSeek = (value: number) => {
    videoPlayerRef?.current?.seekTo(value, "seconds");
    setSeeking(false);
    setPlayedSecs(value as number);
    setPlaying(false);
    setEnd(false);
  }

  const handleChangeVolume = (evet, value: number) => {
    if (value > 0 && muted) setMuted(false);
    setVolume(value);
  }

  const handleFullscreen = (check = false) => {
    if (!check) {
      // If On Full Screen Mode
      if (!!(
        document['fullScreen'] ||
        document['webkitIsFullScreen'] ||
        document['mozFullScreen'] ||
        document['msFullscreenElement'] ||
        document['fullscreenElement']
      )) {
        // Exit
        if (document['exitFullscreen']) document['exitFullscreen']();
        else if (document['mozCancelFullScreen']) document['mozCancelFullScreen']();
        else if (document['webkitCancelFullScreen']) document['webkitCancelFullScreen']();
        else if (document['msExitFullscreen']) document['msExitFullscreen']();
      } else {
        setFullScreen(true);
        if (videoContainerRef?.current?.requestFullscreen) videoContainerRef?.current?.requestFullscreen();
        else if (videoContainerRef?.current['mozRequestFullScreen']) videoContainerRef?.current['mozRequestFullScreen']();
        else if (videoContainerRef?.current['webkitRequestFullScreen']) {
          if (screenfull.isEnabled) {
            setFullScreenMac(true);
            screenfull.request(findDOMNode(videoPlayerRef.current) as Element);
          }
        } else if (videoContainerRef?.current['msRequestFullscreen']) {
          videoContainerRef?.current['msRequestFullscreen']();
        }
      }
    }
  }

  return <div {...{ id }} className={classNames("com-video-player-main", className)} ref={videoContainerRef}>
    <div className={classNames("com-video-player-main-overlay", isPlaying ? 'play' : '')}>
      <div
        className={classNames("player-main-screen", isHideControl ? "hide-cursor" : "")}
        onClick={handlePausePlay}
        onMouseMove={() => handleNonInteractiveTimeout({ hide: true, play: isPlaying })}
        onMouseOut={() => handleNonInteractiveTimeout({ hide: false, play: isPlaying })}
      />

      <div className={classNames("player-seek", isHideControl ? "hide-control" : "")}>
        {/* Pause Play */}
        <Tooltip title={isPlaying ? "Pause" : "Play"} placement="top" arrow>
          <IconButton size="small" onClick={handlePausePlay}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Tooltip>

        {/* Volume Control */}
        <div className="video-volume-control">
          <Tooltip title={muted || volume === 0 ? 'Volume Up' : 'Mute'} placement="top" arrow>
            <IconButton size="small" onClick={() => setMuted(!muted)}>
              {muted || volume === 0 ? <VolumeOff /> : (volume < 0.5 ? <VolumeDown /> : <VolumeUp />)}
            </IconButton>
          </Tooltip>

          <Slider
            style={{ marginRight: '5px' }}
            className="video-volume-control-slider"
            aria-label="Volume"
            size="small"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={handleChangeVolume}
          />
        </div>

        {/* Time */}
        <div className="video-timer">
          {formatDuration(playedSecs, "s")}&nbsp;/&nbsp;{formatDuration(duration, "s")}
        </div>

        {/* Seek Slider */}
        <div className="video-seek-control">
          <Slider
            className="player-seek-slider"
            size="small"
            value={playedSecs}
            step={1}
            min={0}
            max={duration}
            onChange={(e, value: number) => handleSeek(value)}
            onChangeCommitted={() => setPlaying(true)}
          />
        </div>

        {/* Full screen */}
        <Tooltip title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'} placement="top" arrow>
          <IconButton size="small" onClick={() => handleFullscreen()}>
            {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Tooltip>
      </div>
    </div>
    <div className="com-video-player-main-wrap">
      <ReactPlayer
        className="video-player"
        url={url}
        playing={isPlaying}
        playIcon={<PlayArrow />}
        width="100%"
        height="100%"
        controls={isFullScreenMac}
        volume={volume}
        muted={muted}
        ref={videoPlayerRef}
        onDuration={(e) => setDuration(e)}
        onProgress={({ playedSeconds }) => {
          if (!isSeeking && isPlaying) {
            setPlayedSecs(playedSeconds)
          }
        }}
        onEnded={() => {
          clearTimeout(nonInteractiveTimeout)
          setHideControl(false);
          setEnd(true);
          setPlaying(false);
        }}
        config={{
          file: {
            attributes: {
              disablePictureInPicture: true,
              controlsList: 'nodownload'
            }
          }
        }}
      />
    </div>
  </div>
});

export default VideoPlayer;