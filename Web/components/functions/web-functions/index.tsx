import { Grid } from '@mui/material';
import { useSelector } from '../../../app/hooks';
import appConfig from '../../../config/appConfigs.json';
import WebFunctionExamSimulator from "./WebFunctionExamSimulator";
import WebFunctionNoLogin from "./WebFunctionNoLogin";
import WebFunctionResultStats from "./WebFunctionResultStats";
import WebFunctionTestBank from "./WebFunctionTestBank";
import "./webFunction.scss";
import { useRouter } from 'next/router';
import ViWebFunctionTestBank from './ViWebFunctionTestBank';
import ViWebFunctionExamSimulator from './ViWebFunctionExamSimulator';
import ViWebFunctionNoLogin from './ViWebFunctionNoLogin';
import ViWebFunctionResultStar from './ViWebFunctionResultStar';
import { AppState } from '../../../app/store';
const WebFunctions = () => {
    const router = useRouter();
    const { appName } = useSelector((state: AppState) => state.appInfos.appInfo);
    const iconColor = (appConfig[appName] || {}).iconWebFcColor;
    const testBank = <ViWebFunctionTestBank iconColor={iconColor} />
    const examSimulator = <ViWebFunctionExamSimulator iconColor={iconColor} />
    const noLogin = <ViWebFunctionNoLogin iconColor={iconColor} />
    const resultStar = <ViWebFunctionResultStar iconColor={iconColor} />
    return (
        <Grid container justifyContent="space-between" alignItems="center" textAlign="center" id="web-function-grid">
            <Grid item xs={12} sm={6} className="grid-web-function-item">
                {testBank}
            </Grid>
            <Grid item xs={12} sm={6} className="grid-web-function-item">
                {examSimulator}
            </Grid>
            <Grid item xs={12} sm={6} className="grid-web-function-item">
                {noLogin}
            </Grid>
            <Grid item xs={12} sm={6} className="grid-web-function-item">
                {resultStar}

            </Grid>
        </Grid>
    )
}

export default WebFunctions