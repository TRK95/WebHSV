import { Skeleton } from "@mui/material";
import { memo } from "react";
import "./style.scss";

const QuestionPaletteSkeleton = memo(() => {
  return <div id="question-palette-panel">
    <div className="current-topic-label"><Skeleton sx={{ minWidth: "96px" }} /></div>
    <div className="question-palette-main">
      <div className="question-palette-body">
        <div className="questions-list">
          <div className="question-list-row"><Skeleton sx={{ width: "100%" }} /></div>
          <div className="question-list-row"><Skeleton sx={{ width: "100%" }} /></div>
          <div className="question-list-row"><Skeleton sx={{ width: "100%" }} /></div>
        </div>
      </div>
    </div>
  </div>
});

export default QuestionPaletteSkeleton;