import { useState } from "react";
import { GameObject } from "../../game.core";
import AudioButton from "../AudioButton";
import SelectIcon from "../FlashCardOverview/SelectIcon";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import styled from "@emotion/styled";
import VolumeActiveIcon from "./VolumeActiveIcon";
import VolumeOffIcon from "./VolumeOffIcon";

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 300,
    },
});

function WordTypeDetailBox(props: { nameType: string, color: string, wordList: GameObject[], itemsToShow: number }) {
    const { nameType, color, wordList, itemsToShow } = props
    const [expanded, setExpanded] = useState(false)
    const [itemToShow, setItemToShow] = useState(itemsToShow)

    const handleSeeMore = () => {
        setItemToShow(wordList.length)
        setExpanded(true)
    }

    return (
        <>
            <div className="word-type-detail-title" style={{ color: `${color}` }}>{nameType} {`(${wordList.length})`}</div>
            {
                wordList.slice(0, itemToShow).map(word => (
                    <div className="word-type-detail-item" key={word.id}>
                        <CustomWidthTooltip title={word.question.content} placement="bottom-start">
                            <div className="word-type-detail-item-name dot-2">
                                {word.question.content}
                            </div>
                        </CustomWidthTooltip>
                        <CustomWidthTooltip title={<span dangerouslySetInnerHTML={{ __html: word.question.hint }} />}>
                            <div className="word-type-detail-item-spelling dot-2" dangerouslySetInnerHTML={{ __html: word.question.hint }} />
                        </CustomWidthTooltip>
                        <CustomWidthTooltip title={<span dangerouslySetInnerHTML={{ __html: word.explanation }} />}>
                            <div className="word-type-detail-item-explain dot-2" dangerouslySetInnerHTML={{ __html: word.explanation }} />
                        </CustomWidthTooltip>
                        <div className="word-type-detail-item-volume">
                            <AudioButton
                                PlayVolumeIcon={<VolumeActiveIcon />}
                                PauseVolumeIcon={<VolumeOffIcon />}
                                customIconVolume
                                src={word?.question?.urlSound}
                                className="word-type-detail-item-volume-btn"
                                size="small"
                            />
                        </div>
                    </div>
                ))
            }

            <div className="word-type-detail-loadmore-wrapper">
                {wordList.length >= 2 && !expanded
                    ? <button
                        style={{ borderColor: `${color}`, color: `${color}` }}
                        onClick={handleSeeMore}
                        className="word-type-detail-loadmore-btn">
                        See More
                        <SelectIcon color={color} />
                    </button>
                    : <></>
                }
            </div>
        </>
    );
}

export default WordTypeDetailBox;