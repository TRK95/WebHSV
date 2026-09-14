import { useMediaQuery, useTheme } from "@mui/material";
import { PropsWithChildren } from "react";
import Layout, { LayoutProps } from "../common/Layout";
import StudyHeader from "./StudyHeader";

const StudyLayout = (props: PropsWithChildren<LayoutProps>) => {
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down('lg'));
  return (<Layout {...props} backgroundColor={isTabletUI ? "#FDFDFE" : "#F2F3F7"} disableDefaultHeader noAlternateLink>
    <StudyHeader />
    {props.children}
  </Layout>)
}

export default StudyLayout;