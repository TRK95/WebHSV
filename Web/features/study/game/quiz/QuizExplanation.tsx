import { Button, Theme } from "@mui/material";
import { MathJax } from "better-react-mathjax";
import { PropsWithoutRef, useMemo, useState } from "react";
import { SxProps } from "@mui/system";
import { useDispatch, useSelector } from "../../../../app/hooks";
import ExplanationLockIcon from "../ExplanationLockIcon";
import { ExplanationType } from "../game.core";
import RichContent from "../RichContent";
import "./quizExplanation.scss";
import { setShowLoginPopup } from "../../../auth/auth.slice";

const QuizExplanation = (props: PropsWithoutRef<{
  explanation?: string;
  type?: ExplanationType
}>) => {
  const dispatch = useDispatch()
  const [show, setShow] = useState(true);
  const mathJax = useSelector((state) => state.gameState.mathJax);
  const { user } = useSelector(state => state.authState)
  const label = useMemo(() =>
    props.type === "explanation-example" ? "Giải thích / Ví dụ" : (props.type === "example" ? "Ví dụ" : "Giải thích")
    , [props.type]);

  const desktopMenuItemStyle: SxProps<Theme> = {
    display: 'block', textAlign: 'left', fontWeight: 700, flex: "0 0 auto", cursor: "pointer",
    padding: '6px 16px',
  }

  return props.explanation
    ? <div className="game-object-explanation quiz-explanation">
      <div className="quiz-explanation-button-wrap">
        {/* <Button
          className="quiz-explanation-button"
          size="small" onClick={() => setShow(!show)}>{show ? `Ẩn ${label}` : `Hiển thị ${label}`}
        </Button> */}
        <Button
          className="quiz-explanation-button"
          size="small">
          {label}
        </Button>
      </div>
      {show && <>
        {user ? (
          <RichContent mathJax={mathJax}>
            <div className="game-object-explanation-content" dangerouslySetInnerHTML={{
              __html: props.explanation
            }}></div>
          </RichContent>
        ) : (
          <div className="explanation-lock">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div><ExplanationLockIcon /></div>
              <div className="explanation-text">Hãy đăng nhập ngay để được xem giải chi tiết!</div>
            </div>

            <div className="app-bar-header-auth">
              <Button
                onClick={() => {
                  dispatch(setShowLoginPopup(true))
                }}
                sx={{
                  ...desktopMenuItemStyle,
                  padding: '4px 12px'
                }}
              >
                Đăng nhập
              </Button>
            </div>
          </div>
        )}
      </>}
    </div>
    : <></>;
}

export default QuizExplanation;