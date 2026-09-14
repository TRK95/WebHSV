import { Grid, Slider } from "@mui/material";
import { withStyles } from "@mui/styles";
import { useMemo } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useSelector } from "../../../../../app/hooks";
import {
  EXAM_TYPE_TOEIC,
  SKILL_TYPE_LISTENING,
  SKILL_TYPE_READING
} from "../../../../../modules/share/constraint";
import { getSkillTypeValues, getTOEICScore } from "../../game.scoreUtils";
import "./toeicOverview.scss";

const ScoreSlider = withStyles({
  root: {
    marginTop: "30px"
  },
  rail: {
    height: "10px",
    borderRadius: 0,
    backgroundColor: "#F0F0F0",
    opacity: 1
  },
  track: {
    height: "10px",
    borderRadius: 0,
    backgroundColor: "#19CE7A",
    border: "none"
  },
  thumb: {
    height: 0
  },
  mark: {
    display: "none"
  },
  markLabel: {
    color: "var(--textColor)",
    fontWeight: 600,
    fontSize: "16px"
  },
  valueLabel: {
    backgroundColor: "#19CE7A",
    borderRadius: "12px",
    width: "45px",
    fontWeight: 700
  }
})(Slider);

const TOEICOverview = () => {
  const mapExamTypeSkills = useSelector((state) => state.gameState.mapExamTypeSkills);
  const questionItems = useSelector((state) => state.gameState.questionItems);

  const { score: totalScore, mapStats } = useMemo(() => {
    const skills = mapExamTypeSkills[EXAM_TYPE_TOEIC]?.data ?? [];
    const skillTypeValues = getSkillTypeValues(skills);
    return getTOEICScore({
      skillTypeValues, questionItems
    });
  }, [mapExamTypeSkills, questionItems.length]);

  const renderScoreSlider = (value: number) => (<ScoreSlider
    value={value}
    valueLabelDisplay="on" min={5} max={495}
    marks={[
      { value: 5, label: <>5</> }, { value: 495, label: <>495</> }
    ]}
    disabled
  />)

  return <div id="toeic-overview-panel">
    <Grid container className="toeic-score">
      <Grid item xs={9} className="toeic-score-left">
        <div className="toeic-score-panel toeic-score-listing-score">
          <div className="count-questions">
            <div className="label-wrap">
              <div className="label">Listening</div>
              <div className="number">
                {mapStats[SKILL_TYPE_LISTENING]?.correct}/{mapStats[SKILL_TYPE_LISTENING]?.count}
              </div>
            </div>

            <div className="score-slider">
              {renderScoreSlider(mapStats[SKILL_TYPE_LISTENING]?.score ?? 5)}
            </div>
          </div>
        </div>

        <div className="toeic-score-panel toeic-score-reading-score">
          <div className="count-questions">
            <div className="label-wrap">
              <div className="label">Reading</div>
              <div className="number">
                {mapStats[SKILL_TYPE_READING]?.correct}/{mapStats[SKILL_TYPE_READING]?.count}
              </div>
            </div>

            <div className="score-slider">
              {renderScoreSlider(mapStats[SKILL_TYPE_READING]?.score ?? 5)}
            </div>
          </div>
        </div>
      </Grid>

      <Grid item xs={3} className="toeic-score-right">
        <div className="title-score">TOTAL SCORE</div>
        <div className="total-score-wrap">
          <CircularProgressbar
            className="total-score-circle"
            minValue={0}
            maxValue={990}
            value={totalScore}
            strokeWidth={5}
            styles={buildStyles({
              textSize: "30px",
              strokeLinecap: "butt",
              pathColor: "#19CE7A",
              trailColor: "#F0F0F0",
            })}
          />
          <div className="total-score-text">{totalScore}</div>
        </div>
      </Grid>
    </Grid>
  </div>
}

export default TOEICOverview;