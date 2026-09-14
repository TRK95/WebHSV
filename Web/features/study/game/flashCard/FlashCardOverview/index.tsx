import { Button, Grid, MenuItem, Select, Slider } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SelectIcon from './SelectIcon'
import { withStyles } from "@mui/styles";
import _ from "lodash";
import { useSnackbar } from "notistack";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "../../../../../app/hooks";
import { CardStudyOrder, FlashCardView, onStartFlashCardGame, setCardStudyOrder, setFlashCardView, setQuestionsPlayNum } from "../../game.slice";
import "./flashCardOverview.scss";

export const questionsPlayNumKey = "flash_card_q";

const ProgressSlider = withStyles({
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

const FlashCardOverview = () => {
  const totalQuestions = useSelector((state) => state.gameState.totalQuestions);
  const questionsPlayNum = useSelector((state) => state.gameState.questionsPlayNum);
  const cardStudyOrder = useSelector((state) => state.gameState.cardStudyOrder);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);
  const userId = useSelector((state) => state.authState.userId);
  const { enqueueSnackbar } = useSnackbar();

  const questionsPlayNumOpts = useMemo(() => {
    if (totalQuestions <= 10) return [totalQuestions];
    return [...(_.range(10, totalQuestions, 5)), totalQuestions];
  }, [totalQuestions]);

  const { mapCardBox } = useMemo(() => {
    const topicProgress = topicProgresses[topic?._id]?.userId === userId ? topicProgresses[topic?._id] : undefined;
    const boxCard = topicProgress?.boxCard ?? {};
    const mapCardBox: Map<CardStudyOrder, number> = new Map<CardStudyOrder, number>();
    const mapBoxNum: { [x: number]: string[] } = {};
    Object.keys(boxCard).map((cardId) => {
      const boxNum = boxCard[cardId] > 0 ? 1 : 0;
      mapBoxNum[boxNum] = [...mapBoxNum[boxNum] || [], cardId];
    });
    const correctArr = mapBoxNum[1] ?? [];
    const incorrectArr = mapBoxNum[0] ?? [];
    mapCardBox.set(CardStudyOrder.MEMORIZED, correctArr.length);
    mapCardBox.set(CardStudyOrder.UNMEMORIZED, incorrectArr.length);
    const newCount = totalQuestions - (correctArr.length + incorrectArr.length);
    mapCardBox.set(CardStudyOrder.NEW, newCount < 0 ? 0 : newCount);
    mapCardBox.set(CardStudyOrder.MARKED, topicProgress?.cardBookmarks?.length ?? 0);
    return {
      progress: topicProgress?.progress ?? 0,
      mapCardBox
    }
  }, [topicProgresses, topic?._id, userId, totalQuestions]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!!topic?._id && !!totalQuestions) {
      const mapQuestionsPlayNum = JSON.parse(localStorage.getItem(questionsPlayNumKey) || "{}");
      dispatch(setQuestionsPlayNum(mapQuestionsPlayNum[topic._id] || totalQuestions))
    }
  }, [topic?._id, totalQuestions]);

  const onChangeQuestionsPlayNum = (value: number) => {
    dispatch(setQuestionsPlayNum(value));
    const mapQuestionsPlayNum = JSON.parse(localStorage.getItem(questionsPlayNumKey) || "{}");
    localStorage.setItem(questionsPlayNumKey, JSON.stringify({
      ...mapQuestionsPlayNum, [topic._id]: value
    }));
  }

  const handleClickGameButton = (args: {
    flashCardView: FlashCardView;
  }) => {
    if (cardStudyOrder !== CardStudyOrder.DEFAULT) {
      if (
        (cardStudyOrder === CardStudyOrder.MEMORIZED && mapCardBox.get(CardStudyOrder.MEMORIZED) <= 0)
        || (cardStudyOrder === CardStudyOrder.UNMEMORIZED && mapCardBox.get(CardStudyOrder.UNMEMORIZED) <= 0)
        || (cardStudyOrder === CardStudyOrder.NEW && mapCardBox.get(CardStudyOrder.NEW) <= 0)
        || (cardStudyOrder === CardStudyOrder.MARKED && mapCardBox.get(CardStudyOrder.MARKED) <= 0)
      ) {
        enqueueSnackbar("No Data!", { variant: "info" });
        return;
      }
    }
    dispatch(setFlashCardView(args.flashCardView));
    dispatch(onStartFlashCardGame());
  }

  return <div id="flash-card-overview">
    <div className="title">Overview</div>

    <div className="list-overview-item">
      <div className="overview-item">
        <div className="overview-item-label">Total cards</div>
        <div className="overview-item-value fixed-value">{totalQuestions} cards</div>
      </div>

      <div className="overview-item">
        <div className="overview-item-label">Practice</div>
        <div className="overview-item-value option-value">
          <Select

            IconComponent={SelectIcon}
            size="small" className="option-value-selector" id="fc-question-play-nums" value={questionsPlayNum} onChange={(evt) => onChangeQuestionsPlayNum(evt.target.value as number)}>
            {questionsPlayNumOpts.map((value) =>
              <MenuItem key={value} value={value}>{value} cards</MenuItem>
            )}
          </Select>
        </div>
      </div>

      <div className="overview-item">
        <div className="overview-item-label">Priority</div>
        <div className="overview-item-value option-value">
          <Select
            IconComponent={SelectIcon}
            size="small" className="option-value-selector" id="fc-card-study-order" value={cardStudyOrder} onChange={(evt) => {
              dispatch(setCardStudyOrder(evt.target.value as CardStudyOrder));
            }}>
            <MenuItem value={CardStudyOrder.DEFAULT}>Default</MenuItem>
            <MenuItem value={CardStudyOrder.NEW}>New</MenuItem>
            <MenuItem value={CardStudyOrder.MEMORIZED}>Memorized</MenuItem>
            <MenuItem value={CardStudyOrder.UNMEMORIZED}>Unmemorized</MenuItem>
            <MenuItem value={CardStudyOrder.MARKED}>Marked</MenuItem>
          </Select>
        </div>
      </div>
    </div>
    {/* 
    <div className="overview-progress">
      <div className="overview-progress-label">Progress</div>
      <ProgressSlider value={progress} valueLabelDisplay="on" valueLabelFormat={(value) => <>{value}%</>} />
    </div> */}

    <div className="overview-game-buttons">
      <Button className="play-button practice"
        onClick={() => handleClickGameButton({ flashCardView: FlashCardView.CARD })}
      >
        Practice now
      </Button>

      <Button className="play-button game"
        onClick={() => handleClickGameButton({ flashCardView: FlashCardView.GAME })}
      >
        Play game
      </Button>
    </div>
  </div>
}

export default FlashCardOverview;