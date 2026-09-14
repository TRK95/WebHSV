import { Button, Grid } from "@mui/material";
import { PropsWithoutRef } from "react";
import RawLink from "../../components/RawLink";
import NotFoundImage from "./NotFoundImage";
import "./errorView.scss";
import appConfigs from "../../config/appConfigs.json";

const appName = process.env.NEXT_PUBLIC_APP_NAME;
const appConfig = appConfigs[appName];

const ErrorView = (props: PropsWithoutRef<{
  errorCode?: number;
  message?: string
}>) => {
  const { errorCode = 500, message = 'Internal Server Error' } = props;
  return <Grid container className="error-view">
    <Grid item xs={12} sm={6} className="error-info error-general-info">
      {message === "Not Found" && <NotFoundImage color={appConfig?.titleColor} />}
      <div className="error-name">{
        message === "Not Found"
          ? <>Page <b>Not Found</b></>
          : <>{message}</>
      }</div>
    </Grid>

    <Grid item xs={12} sm={6} className="error-info error-details">
      <div className="alert">Oops!</div>
      <div className="error-code">Error code: {message === "Not Found" ? 404 : errorCode}</div>
      <div className="error-message">{message === "Not Found"
        ? "We can’t find the page you’re looking for!"
        : ""}</div>

      <RawLink href="/">
        <Button
          sx={{ background: `${appConfig?.menuBackground || "#fff"} !important`, color: `${appConfig?.menuTextColor || "#000"} !important` }}
          className="error-back-button"
        >
          GO BACK HOME</Button>
      </RawLink>
    </Grid>
  </Grid>
};

export default ErrorView;