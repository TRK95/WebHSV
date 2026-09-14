import { CacheProvider, EmotionCache } from "@emotion/react";
import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import {
  BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title,
  Tooltip
} from "chart.js";
import { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { SnackbarProvider } from "notistack";
import { FC } from "react";
// @ts-ignore
import { ErrorBoundary } from "react-error-boundary";
import { PersistGate } from "redux-persist/integration/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper/core";
import {
  persistor, store, wrapper
} from "../app/store";
import ErrorView from "../features/error/ErrorView";
import lightTheme from "../styles/themes/lightTheme";
import "../styles/_global.scss";
import { postTimeOnSite } from "../utils/api/timeOnSiteApi";
import createEmotionCache from "../utils/createEmotionCache";
import { clearStoreIndexDB, connectIndexDB, insertDataToIndexDB } from "../utils/indexDB";

SwiperCore.use([Autoplay, Pagination, Navigation]);
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const clientSideEmotionCache = createEmotionCache();

if (typeof window !== "undefined") {
  let isHalted = true;
  // let haltedStartTime, haltedEndTime;
  let totalHaltedTime = 0;
  let totalTime = 0;
  // const updateHaltState = () => {
  //   if (isHalted) {
  //     haltedEndTime = new Date().getTime()
  //     totalHaltedTime += (haltedEndTime - haltedStartTime)
  //     haltedStartTime = new Date().getTime();
  //   } else {
  //     isHalted = true;
  //     haltedStartTime = new Date().getTime()
  //   }
  // }
  const dbUserActiveConnect = { db: undefined, data: [] };
  connectIndexDB("UserActive", "date", true, dbUserActiveConnect)
  window.addEventListener('scroll', () => {
    // if (isHalted) {
    //   updateHaltState();
    //   isHalted = false;
    // }
    // haltedStartTime = new Date().getTime();
    if (!isHalted) {
      isHalted = true;
    }
  })
  document.addEventListener("DOMContentLoaded", () => {
    // const startTimeOnSite = new Date().getTime();
    setInterval(() => {
      // if (new Date().getTime() - haltedStartTime > 39000) {
      //   updateHaltState();
      // }
      if (isHalted) {
        totalTime += 39;
        isHalted = false;
      }
    }, 39000)
    window.addEventListener("beforeunload", async () => {
      // const endTimeOnSite = new Date().getTime();
      // const totalTimeOnSite = endTimeOnSite - startTimeOnSite - totalHaltedTime;
      if (store.getState().authState.userId && totalTime) {
        const data = {
          // totalTime: totalTimeOnSite,
          totalTime,
          date: new Date().getTime(),
          userId: store.getState().authState.userId
        }
        dbUserActiveConnect.data.push(data);
        const res = await postTimeOnSite({ data: dbUserActiveConnect.data });
        if (!res && data.userId) {
          insertDataToIndexDB(dbUserActiveConnect.db, data, 'UserActive');
        } else {
          clearStoreIndexDB(dbUserActiveConnect.db, 'UserActive');
        }
      } else {
        dbUserActiveConnect.db.close();
      }
    })
  }
  );
}

const App: FC<AppProps & { emotionCache: EmotionCache }> = ({ Component, pageProps, emotionCache = clientSideEmotionCache }) => (
  <CacheProvider value={emotionCache}>
    <ThemeProvider theme={lightTheme}>
      <ErrorBoundary FallbackComponent={({ error }) => <Container><ErrorView message={error.message} /></Container>}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: "center", vertical: "top" }} autoHideDuration={5000}>
          {typeof window !== "undefined"
            ? <PersistGate loading={null} persistor={persistor}>
              <NextNProgress color="#007aff" height={2} options={{ showSpinner: false }} />
              <Component {...pageProps} />
            </PersistGate>
            : <Component {...pageProps} />}
        </SnackbarProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </CacheProvider>
);

export default wrapper.withRedux(App);