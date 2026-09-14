import { Close, Visibility, ZoomIn, ZoomOut } from "@mui/icons-material";
import { Backdrop, IconButton } from "@mui/material";
import { PropsWithoutRef, useMemo, useState } from "react";
import "./imageWidget.scss";

const IMG_MIN_WIDTH = 100;
const IMG_MAX_WIDTH = 500;

const ImageWidget = (props: PropsWithoutRef<{
  src: string; width?: number;
}>) => {
  const { src, width = 250 } = props;

  const [imgWidth, setImgWidth] = useState(width > IMG_MAX_WIDTH ? IMG_MAX_WIDTH : (width < IMG_MIN_WIDTH ? IMG_MIN_WIDTH : width));
  const [preview, setPreview] = useState(false);
  const initWidth = useMemo(() => width > IMG_MAX_WIDTH ? IMG_MAX_WIDTH : (width < IMG_MIN_WIDTH ? IMG_MIN_WIDTH : width), [width])

  const zoomIn = () => {
    const newWidth = imgWidth + initWidth * 0.1;
    setImgWidth(newWidth >= IMG_MAX_WIDTH ? IMG_MAX_WIDTH : newWidth);
  }

  const zoomOut = () => {
    const newWidth = imgWidth - initWidth * 0.1;
    setImgWidth(newWidth <= IMG_MIN_WIDTH ? IMG_MIN_WIDTH : newWidth);
  }

  return !!src
    ? <div className="game-image-widget-container" style={{ width: imgWidth }}>
      <img src={src} style={{ width: "100%" }} alt={src} onClick={() => setPreview(true)} />
      <div className="game-image-widget">
        <IconButton title="Preview" onClick={() => setPreview(true)} className="game-image-widget-button game-image-widget-preview">
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton title="Zoom In" onClick={zoomIn} className="game-image-widget-button game-image-widget-zoom-in">
          <ZoomIn fontSize="small" />
        </IconButton>
        <IconButton title="Zoom Out" onClick={zoomOut} className="game-image-widget-button game-image-widget-zoom-out">
          <ZoomOut fontSize="small" />
        </IconButton>
      </div>

      <Backdrop open={preview} onClick={() => setPreview(false)} classes={{ root: "game-image-widget-backdrop-preview" }}>
        <IconButton onClick={() => setPreview(false)} className="preview-close">
          <Close />
        </IconButton>
        <img src={src} className="image-preview" alt={`preview-${src}`} />
      </Backdrop>
    </div>
    : <></>
}

export default ImageWidget;