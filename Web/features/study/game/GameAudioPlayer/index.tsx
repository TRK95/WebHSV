import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { IconButton, Slider as MuiSlider } from "@mui/material";
import { flatMap } from "lodash";
import { useEffect } from "react";
import { PropsWithoutRef, useState } from "react";
import { useSelector } from "react-redux";
import ReactSound from "react-sound";
import './gameAudioPlayer.scss';

type SoundMngArgs = {
  /** ms */
  duration: number;
  /** * ms */
  position: number;
}

const GameAudioPlayer = (props: PropsWithoutRef<{
  src?: string;
  playOnRender?: boolean;
}>) => {
  const [isReady, setReady] = useState(false);
  const [isPlaying, setisPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime_, setCurrentTime_] = useState(0)
  const [dataSeek, setDataSeek] = useState(0)
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  const [isShown, setIsShown] = useState(false);

  const disableAutoPlayAudio = useSelector((state: any) => state.gameState.disableAutoPlayAudio);

  useEffect(() => {
    if (isReady && props.playOnRender && !disableAutoPlayAudio) {
      setisPlaying(true);
    }
  }, [props.playOnRender, isReady, disableAutoPlayAudio])

  const onChangeIsPlaying = () => {
    setisPlaying(!isPlaying)
  }
  const caculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    const seconds = Math.floor(secs % 60)
    const returnSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    return `${returnMinutes}:${returnSeconds}`
  }
  const changeRange = (e: number) => {
    const valueCurrentTime = Math.round((Number(e) * duration) / 100);
    setCurrentTime_(valueCurrentTime);
    setDataSeek(valueCurrentTime);
  }
  const clickMuted = () => {
    setMuted(!muted);

  }
  const changeVolume = (e: number) => {
    setVolume(e);
    setMuted(!e);
  }
  return <>
    <div className="custom-react-audio-player">
      <IconButton className="iconButton__" onClick={onChangeIsPlaying}>
        {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
      </IconButton>

      <div className="current-time-audio-player">
        {isReady ? caculateTime(currentTime_) : '--:--'} / {isReady ? caculateTime(duration) : '--:--'}
      </div>
      <div className="audio-progress-control" style={isShown ? { marginRight: '80px', transition: '.5s' } : { marginRight: '30px', transition: '.5s' }}>
        <MuiSlider
          className="audio-progress-control-slider"
          classes={{
            rail: "audio-progress-control-slider-rail",
            thumb: "audio-progress-control-slider-thumb",
            track: "audio-progress-control-slider-track"
          }}
          min={0}
          max={100}
          step={0.01}
          value={dataSeek / (duration || 1) * 100}
          onChange={(_evt, value) => {
            setisPlaying(false);
            changeRange(value as number)
          }}
          onChangeCommitted={() => setisPlaying(true)}
        />
      </div>
      <div className="audio-player" id="iconButton__volume"
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}>
        <div className="wrapper-audio-player">
          <div className="audio-volume-control">
            <MuiSlider
              className="audio-volume-control-slider"
              classes={{
                rail: "audio-volume-control-slider-rail",
                thumb: "audio-volume-control-slider-thumb",
                track: "audio-volume-control-slider-track"
              }}
              min={0}
              max={100}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(_evt, value) => changeVolume(value as number)}
            />
          </div>
        </div>
        <div className="volumeAudio">
          <IconButton className="iconButton__volume" onClick={() => clickMuted()}>
            {muted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
          </IconButton>
        </div>
      </div>
    </div>
    <ReactSound
      url={props.src}
      autoLoad
      loop
      playStatus={isPlaying ? "PLAYING" : "PAUSED"}
      onLoad={((args: { loaded: boolean }) => {
        setReady(args.loaded);
      }) as () => void}
      onLoading={((args: SoundMngArgs) => {
        setDuration(args.duration / 1000);
      }) as () => void}
      position={currentTime_ * 1000}
      onPlaying={((args: SoundMngArgs) => {
        if (args.position !== args.duration) {
          const _value = args.position / 1000;
          setCurrentTime_(_value);
          setDataSeek(_value);
        } else {
          setisPlaying(false);
          setCurrentTime_(0);
        }
      }) as () => void}
      volume={muted ? 0 : volume}
    />
  </>
}
export default GameAudioPlayer