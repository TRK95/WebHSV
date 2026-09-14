import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import React, { PropsWithoutRef, useState } from 'react';
import appConfigs from "../../../config/appConfigs.json";
import AppFunctionCommunityConnect from "./AppFunctionCommunityConnect";
import AppFunctionDailyGoal from "./AppFunctionDailyGoal";
import AppFunctionMultiQuestionsSets from "./AppFunctionMultiQuestionsSets";
import AppFunctionOfflineMode from "./AppFunctionOfflineMode";
import ViAppFunctionDailyGoal from "./ViAppFunctionDailyGoal";
import ViAppFunctionMultiQuestionsSets from "./ViAppFunctionMultiQuestionsSets";
import ViAppFunctionOfflineMode from "./ViAppFunctionOfflineMode";
import ViAppFunctionCommunityConnect from "./ViAppFunctionCommunityConnect";

const appName = process.env.NEXT_PUBLIC_APP_NAME;
const {
    appFcBackground, appHoverFcBackground,
    descAppFcColor, descHoverAppFcColor,
    textAppFcColor, appHoverColor,
    iconAppFcColor, iconHoverAppFcColor
} = appConfigs[appName] || {};
const TOTAL_APP_FUNCTIONS = 4;

const AppFunctionItem = (props: PropsWithoutRef<{ index: number; hovering?: boolean }>) => {
    const { index, hovering = false } = props;
    const [bgColor, descColor, titleColor, iconColor] = !!hovering
        ? [appHoverFcBackground, descHoverAppFcColor, appHoverColor, iconHoverAppFcColor]
        : [appFcBackground, descAppFcColor, textAppFcColor, iconAppFcColor]
    const router = useRouter();


    const multiQuestion = <ViAppFunctionMultiQuestionsSets bgColor={bgColor} descColor={descColor} titleColor={titleColor} iconColor={iconColor} />
    const dailyGoal = <ViAppFunctionDailyGoal bgColor={bgColor} descColor={descColor} titleColor={titleColor} iconColor={iconColor} />
    const communityConnect = <ViAppFunctionCommunityConnect bgColor={bgColor} descColor={descColor} titleColor={titleColor} iconColor={iconColor} />
    const offlineMode = <ViAppFunctionOfflineMode bgColor={bgColor} descColor={descColor} titleColor={titleColor} iconColor={iconColor} />
    switch (index) {
        case 1:
            return multiQuestion
        case 2:
            return dailyGoal
        case 3:
            return communityConnect
        case 4:
            return offlineMode
        default:
            return <></>
    }
}

const AppFunctions = () => {
    const [mapHover, setMapHover] = useState<boolean[]>(new Array(TOTAL_APP_FUNCTIONS).fill(false));
    const handleAppFunctionMouseEvent = (index: number, hovering: boolean) => {
        const _mapHover = [...mapHover];
        if (hovering) _mapHover.forEach((_, i) => { _mapHover[i] = i === index });
        else _mapHover[index] = false;
        setMapHover(_mapHover);
    }

    return <Grid container spacing="3px">
        {[1, 2, 3, 4].map((pos, index) => {
            return <Grid key={index} item xs={12} sm={6} lg={3}>
                <div className="app-function-item"
                    onMouseEnter={() => handleAppFunctionMouseEvent(index, true)}
                    onMouseLeave={() => handleAppFunctionMouseEvent(index, false)}
                >
                    <AppFunctionItem index={pos} hovering={mapHover[index]} />
                </div>
            </Grid>
        })}
    </Grid>
}

export default AppFunctions