import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Popover, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { memo, PropsWithoutRef, useState, MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "../../../app/hooks";
import { getFormattedContentWithImg, getStorageURL } from "../../../utils/format";
import { Face } from "./game.core";
import { setIsCheckShowCollapse } from "./game.slice";
import GameAudioPlayer from "./GameAudioPlayer";
import HTMLContent from "./HTMLContent";
import ImageWidget from "./ImageWidget";
import "./questionView.scss";
import RichContent from "./RichContent";
const QuestionView = memo((props: PropsWithoutRef<{
  question: Face;
  isPara?: boolean,
  isSize?: number,
  isRoot?: boolean;
  className?: string;
}>) => {
  const { question, isPara, isSize, isRoot, className } = props;
  const mathJax = useSelector((state) => state.gameState.mathJax);
  const userPlaying = useSelector((state) => state.gameState.userPlaying);
  const [isOpen, setisOpen] = useState(false)
  const [widthText, setWidthText] = useState(100)
  const [menuEl, setMenuEl] = useState<HTMLDivElement | null>(null);
  const [textSizeChangeEl, setTextSizeChangeEl] = useState<HTMLImageElement | null>(null);
  const [sizeTextPara, setSizeTextPara] = useState(isSize)
  const dispatch = useDispatch();
  const [maxWidthModal, setMaxWidthModal] = useState<any>()
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down('lg'));
  const showPopupContentParaFullScreen = () => {
    if (!question.content) return;
    setisOpen(true);
    setMaxWidthModal('xl');
  }
  const showPopupContentParaMedium = () => {
    setExpanded(!expanded)
    setShow(!show)
    dispatch(setIsCheckShowCollapse(expanded))
  }

  const showPopupContentParaSmall = (event: MouseEvent<HTMLImageElement>) => {
    if (!question.content) return;
    setTextSizeChangeEl(event.currentTarget);
  }

  const ascSize = () => {
    setSizeTextPara(sizeTextPara + _.divide(isSize, 10))
    setWidthText(widthText + 10)
  }

  const descSize = () => {
    setSizeTextPara(sizeTextPara - _.divide(isSize, 10))
    setWidthText(widthText - 10)
  }
  const reSizeText = () => {
    setSizeTextPara(isSize)
    setWidthText(100)
  }
  const [expanded, setExpanded] = useState(true);
  const open = Boolean(textSizeChangeEl);

  return <div className={classNames(
    "game-object-question",
    isPara && isRoot ? "para-root" : "",
    isTabletUI ? "tablet" : "",
    !question.content && !question.urlImage ? "no-content" : "",
    className
  )}>
    {!!question.urlSound && !(isPara && isRoot) && <div className="game-object-question-sound">
      <GameAudioPlayer
        src={getStorageURL(question.urlSound)}
        playOnRender={!!userPlaying && !!isRoot}
      />
    </div>}

    {!!question.urlImage && !(isPara && isRoot) && <div className="game-object-question-image">
      <ImageWidget src={getStorageURL(question.urlImage)} width={300} />
    </div>}

    {(!!question.content || (isPara && isRoot && !!question.urlImage)) && <RichContent mathJax={mathJax}>
      {isPara && isRoot
        ? <div className={classNames(
          "content-para-scroll",
          isTabletUI ? "tablet" : "",
          !!textSizeChangeEl ? "open-menu" : ""
        )} ref={setMenuEl}>
          <Collapse
            collapsedSize="50px"
            in={expanded}
            classes={{
              root: "content-para-scroll-collapse-root",
              wrapper: "content-para-scroll-collapse-wrapper",
              wrapperInner: "content-para-scroll-collapse-wrapper-inner"
            }}
          >
            <div
              style={{ fontSize: `${sizeTextPara}px`, padding: '0 4px' }}
              className="game-object-question-text content-game-para-custom"
            >
              <div className="game-object-question-image">
                <ImageWidget src={getStorageURL(question.urlImage)} width={300} />
              </div>
              <div><HTMLContent content={getFormattedContentWithImg(question.content)} /></div>
            </div>

          </Collapse>
          <div className="zoom-para">
            <img className="change-text-size" onClick={showPopupContentParaSmall} src="/images/smallscreen.svg" alt="SmallScreen" />
            <Popover className="show-zoom-in-out"
              classes={{
                paper: "change-text-size-pop-paper"
              }}
              open={open}
              anchorEl={textSizeChangeEl}
              onClose={() => setTextSizeChangeEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              container={menuEl}
            >
              <div className="custom-popover">
                <span>{widthText}%</span>
                <button onClick={() => ascSize()}> + </button>
                <button onClick={() => descSize()}> - </button>
                <button onClick={() => reSizeText()}> Reset </button>
              </div>
            </Popover>
            <img onClick={() => showPopupContentParaFullScreen()} src="/images/fullscreen.svg" alt="fullscreen" />
            <div onClick={() => showPopupContentParaMedium()} className="show-content-gamepara">
              {!show ? <ExpandLessIcon className="down" /> : <ExpandMoreIcon className="up" />}
            </div>
          </div>
        </div>
        : <>
          <div className="game-object-question-text"
            style={{ marginRight: "17px" }}
            dangerouslySetInnerHTML={{ __html: getFormattedContentWithImg(question.content) }}
          />
        </>
      }
    </RichContent>}

    <Dialog
      open={isOpen}
      onClose={() => setisOpen(false)}
      fullWidth
      maxWidth={maxWidthModal}
      id="dialog-content-para"
    >
      <DialogTitle className="submit-game-confirm-modal-title"></DialogTitle>
      <DialogContent sx={{ textAlign: "justify" }} className="dialog-question-text-content">
        <div
          className='game-object-question-text'
          dangerouslySetInnerHTML={{ __html: getFormattedContentWithImg(question?.content) }}
        >
        </div>
      </DialogContent>
      <DialogActions className="submit-game-confirm-modal-actions">
      </DialogActions>
    </Dialog>

  </div>
});

export default QuestionView;