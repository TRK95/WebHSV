import { Button, Container, Grid, Link, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { useRouter } from "next/router";
import { useSelector } from '../../app/hooks';
import appConfigs from "../../config/appConfigs.json";
import CtaButton from "../CtaButton";
import AppFunctions from './app-functions';
import "./style.scss";
import WebFunctions from './web-functions';

const Functions = () => {
  const { appName } = useSelector((state) => state.appInfos.appInfo);
  const data = appConfigs[appName] || {};
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const router = useRouter();
  const webFunction = "Chức năng của web "
  const practiceCtaBtn = 'Làm bài thi thử ngay!'
  const appFunctions = "Chức năng của App"
  return (
    <div id="functions">
      <Container maxWidth="xl">
        <div id="web-function">
          <h2 className="title-function" style={{ color: data.titleColor }} >{webFunction}</h2>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6} sx={{ width: '100%', height: '100%' }} display="flex" justifyContent="center">
              <div style={{
                position: 'relative',
                width: isTabletUI ? '55%' : '100%',
                height: isTabletUI ? '55%' : '100%',
                maxHeight: 452
              }}>
                <Image layout='responsive' width="100%" height="100%" objectFit='contain' src={`/images/app/${appName}/img-web-function.png`} alt="web-functions" />
              </div>
            </Grid>
            <Grid item xs={12} lg={6}>
              <WebFunctions />
            </Grid>
          </Grid>
          <div className="cta-go-test-web">
            <CtaButton
              url={data.multiLocales ? (router.locale === router.defaultLocale ? `${data.testSlug || '#'}` : `/${router.locale}${data.testSlug || '#'}`) : (data.testSlug || "#")}
              title={practiceCtaBtn}
              color={data.btnTestTitleColor}
              endIcon={<svg width="34" height="48" viewBox="0 0 34 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.2631 8.22653C17.0408 5.51128 18.8292 3.81505 21.0378 3.19836C24.5842 2.32409 27.8074 3.60682 29.5463 6.24307C31.2706 8.85654 31.1301 12.3117 29.1841 14.6902C28.9447 14.9833 28.6711 15.2498 28.3974 15.5165C28.2444 15.6656 28.0912 15.8148 27.9441 15.9687C27.516 16.4175 27.4357 16.9208 27.86 17.4119C28.2942 17.9145 28.8222 17.8496 29.3292 17.5377C29.4864 17.4402 29.6238 17.3118 29.7613 17.1833C29.7987 17.1483 29.8362 17.1132 29.8741 17.0788C32.8548 14.3567 33.6816 10.1576 31.9956 6.34079C30.3951 2.72069 26.558 0.528237 22.3232 0.812843C18.5403 1.06441 15.158 3.93361 14.1926 7.71429C14.1772 7.77286 14.1576 7.83458 14.1378 7.89736C14.0704 8.1103 13.9992 8.33542 14.0716 8.49121C14.2524 8.88225 14.5263 9.42445 14.8547 9.50619C15.1863 9.58715 15.6745 9.23604 16.013 8.97267C16.1371 8.87683 16.1742 8.6728 16.2109 8.47077C16.2262 8.38633 16.2415 8.30223 16.2631 8.22653ZM28.9128 30.3341C29.9505 29.0474 31.4206 28.8058 32.671 29.7247C33.8873 30.6201 34.0934 32.133 33.187 33.4937C32.7545 34.1377 32.3207 34.7838 31.8902 35.429L31.6754 35.7497C30.1467 38.0316 28.5706 40.3844 26.9841 42.6774C23.7774 47.3115 18.068 48.5067 13.1003 45.5823C12.4281 45.1864 11.6852 44.7477 10.9119 44.2795C10.2987 43.9082 9.66508 43.5189 9.03226 43.119C6.72298 41.6593 5.21646 39.6293 4.55109 37.0828C3.98481 34.9168 3.42335 32.7148 2.88169 30.5832C2.79563 30.2468 2.70988 29.9098 2.62413 29.5728C2.5384 29.2359 2.45267 28.899 2.36663 28.5626L2.36 28.5642L2.17356 27.8352C1.94088 26.9255 1.71233 26.0183 1.48296 25.1078L1.47998 25.096C1.22121 24.0685 1.08715 23.3592 0.957854 22.675C0.804446 21.8632 0.657733 21.0868 0.317361 19.8567C0.0856695 19.0195 0.202322 18.2873 0.64551 17.7947C0.965731 17.4394 1.59224 17.0522 2.75568 17.2327C3.98469 17.4221 4.91971 18.1862 5.45632 19.4394L6.61373 22.1445C7.05749 23.1827 7.34507 23.8133 7.63427 24.4474C7.9181 25.0698 8.2035 25.6955 8.63964 26.7135C8.73683 26.9424 8.83694 27.1758 8.95188 27.3848C9.06805 27.5918 9.18906 27.6734 9.25709 27.6783C9.32927 27.6858 9.46625 27.6238 9.61425 27.4263C9.70613 27.3024 9.79223 27.1559 9.88427 26.9993L9.88687 26.9948C9.92431 26.9283 9.9626 26.8651 10.0009 26.8019L12.3496 22.9277C12.5202 22.6466 12.6911 22.3649 12.8624 22.0826C15.4394 17.8353 18.0904 13.466 20.7316 9.17898C21.1236 8.54104 21.7845 7.95164 22.4991 7.60662C23.5041 7.1197 24.7348 7.49414 25.2979 8.45954C25.6981 9.1451 25.7338 9.25034 25.7598 9.97689C25.7755 10.4436 25.5447 11.5331 25.3386 11.8265C25.3255 11.8456 25.3123 11.8646 25.2992 11.8833C25.2639 11.9339 25.2295 11.9832 25.1998 12.0323C23.3707 15.0531 21.5374 18.0713 19.7041 21.0896L18.3854 23.2626L18.2088 23.5543C17.8803 24.1108 17.9272 24.3008 17.9288 24.3074C17.9335 24.3326 17.9843 24.38 18.077 24.4334L18.0778 24.4338C18.1966 24.5002 18.3593 24.5911 18.7607 23.933C19.3549 22.961 19.9451 21.9864 20.5352 21.0118L20.5359 21.0107L21.3066 19.7379L21.3943 19.5931C21.4762 19.4531 21.5593 19.3111 21.6611 19.1665C22.5038 17.9624 24.0083 17.6219 25.2401 18.351L25.263 18.3648C26.5185 19.1251 26.9207 20.6425 26.1972 21.9076C25.5944 22.9642 24.9504 24.0183 24.3267 25.0343C24.0578 25.4736 23.7877 25.915 23.5197 26.3576C23.4777 26.427 23.4345 26.4983 23.3904 26.5664L23.3879 26.5705C23.2953 26.7187 23.2078 26.8589 23.1397 26.9945C22.9537 27.372 23.0826 27.4449 23.2221 27.5238L23.2225 27.524L23.2232 27.5244C23.3398 27.5895 23.4731 27.6638 23.6651 27.3655C23.9443 26.9325 24.2197 26.4776 24.4865 26.0371L24.4867 26.0367C24.6769 25.7227 24.8682 25.4067 25.0625 25.0952C26.0043 23.5916 27.4955 23.1509 28.8603 23.9746L28.8645 23.9771C30.226 24.8016 30.5225 26.3247 29.6178 27.8563C29.2436 28.4883 28.8323 29.1675 28.3584 29.9315C28.0528 30.4221 28.1798 30.5063 28.3253 30.6027L28.3265 30.6035C28.4537 30.6889 28.5689 30.7614 28.9128 30.3341Z" fill={data.btnTestTitleColor || "#fff"} />
              </svg>}
              backgroundColor={data.btnTestBackground}
              backgroundLayerColor={data.btnTestBackgroundLayer}
              titleClassName="cta-go-test-web-button-title"
              buttonClassName="cta-go-test-web-button"
              borderRadius={27}
            />
          </div>
        </div>
        <div id="app-function">
          <h2 className="title-function" style={{ color: data.titleColor }} >{appFunctions}</h2>
          <AppFunctions />
        </div>
      </Container>
    </div>
  )
}

export default Functions