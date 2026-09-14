import { AccountCircleTwoTone, Close } from "@mui/icons-material";
import { AppBar, Box, Container, Divider, Drawer, Grid, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import Image from 'next/image';
import { useRouter } from "next/router";
import { KeyboardEvent, MouseEvent, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import NextLink from "../../components/NextLink";
import RawLink from "../../components/RawLink";
import appConfigs from "../../config/appConfigs.json";
import { LOCALE_SESSION_KEY } from "../../config/MapContraint";
import { logout } from "../auth/auth.slice";
import AppDownloadButton from "../common/AppDownloadButton";
import MenuBarIcon from "./icons/MenuBarIcon";
import "./StudyHeader.scss";
import { setOpenTabletMenu } from "./studyLayout.slice";


const StudyHeader = () => {
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const appConfig = appConfigs[appInfo?.appName] || {};
  const theme = useTheme();
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  const token = useSelector((state) => state.authState.token);
  const user = useSelector((state) => state.authState.user);
  const openTabletMenu = useSelector((state) => state.studyLayoutState.openTabletMenu);
  // const [openTabletMenu, setOpenTabletMenu] = useState(false);
  const [userMenuEl, setUserMenuEl] = useState<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const homeHref = useMemo(() => {
    if (typeof sessionStorage !== "undefined" && appConfig.multiLocales) {
      const locale = sessionStorage.getItem(LOCALE_SESSION_KEY);
      if (router.locales?.includes(locale)) {
        return router.defaultLocale === locale ? "/" : `/${locale}`;
      }
      return "/";
    }
    return "/";
  }, [typeof sessionStorage, appConfig]);
  const handleClickLogin = () => {
    const { pathname, search, hash } = window.location;
    const redirectURI = `${pathname}${search}${hash}`;
    router.push(`/login?redirect_uri=${encodeURIComponent(redirectURI)}`);
  }

  const handleLogout = () => {
    dispatch(logout({ token }));
    setUserMenuEl(null);
    setTimeout(() => {
      router.reload();
    }, 300);
  }

  const toggleDrawer = (open: boolean) => (evt: KeyboardEvent | MouseEvent) => {
    if (evt.type === "keydown" && ((evt as KeyboardEvent).key === "Tab" || (evt as KeyboardEvent).key === "Shift")) return;
    dispatch(setOpenTabletMenu(open));
  }

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <AppBar position="static" color="inherit" elevation={isTabletUI ? 1 : 0}>
        <Container maxWidth="xl_game" className={classNames("app-bar-container", isTabletUI ? "tablet" : "")}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={3} className={classNames(
              "app-bar-header-left",
              isSmallDesktop ? "small-desktop" : "",
              isTabletUI ? "tablet" : ""
            )}>
              {/* LOGO */}
              <RawLink href={homeHref} suppressHydrationWarning>
                <div style={{ width: "100%", height: isTabletUI ? "40px" : "71px", position: 'relative', display: "flex", alignItems: "center" }}>
                  {appInfo?.appLogo
                    && <Image
                      layout="fill"
                      objectFit="contain"
                      objectPosition="left"
                      src={appInfo.appLogo}
                      alt="logo" />}
                </div>
              </RawLink>
            </Grid>

            <Grid item xs={6} className={classNames("app-bar-header-mid")}>
              <div className={classNames("app-buttons", isTabletUI ? "hide-on-mobile" : "")}>
                {/* CH Play & AppStore */}
                <AppDownloadButton
                  source="chplay"
                  link={appInfo?.linkGooglePlay}
                  linkStyle={{ marginRight: "30px" }}
                  color="#000000"
                  hoverColor="#ffffff"
                  background="#F2F3F7"
                  hoverBackround="#2C3546"
                />
                <AppDownloadButton
                  source="appstore"
                  link={appInfo?.linkAppStore}
                  color="#000000"
                  hoverColor="#ffffff"
                  background="#F2F3F7"
                  hoverBackround="#2C3546"
                />
              </div>
            </Grid>

            <Grid item xs={3} className={classNames(
              "app-bar-header-right",
              isSmallDesktop ? "small-desktop" : "",
              isTabletUI ? "tablet" : ""
            )}>
              {/* Menu: HOME & BLOG */}
              <div className={classNames("desktop-menu", isTabletUI ? "hide-on-mobile" : "")} >
                <div className="desktop-menu-link plain-anchor-tag"><NextLink href="/">Home</NextLink></div>
                {/* <div className="desktop-menu-link plain-anchor-tag"><Link href="/blog">Blog</Link></div> */}
                {!!user
                  ? <>
                    <div className="desktop-user-wrap"
                      onClick={(evt) => setUserMenuEl(evt.currentTarget)}
                    >
                      {/* <AccountCircleTwoTone /> */}
                      <Image
                        className="user-avatar-img desktop"
                        src="/images/user-avatar.svg"
                        alt="user-avatar"
                        width={34}
                        height={34} />
                    </div>
                    <Menu
                      anchorEl={userMenuEl}
                      open={!!userMenuEl}
                      onClose={() => setUserMenuEl(null)}
                      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                      transformOrigin={{ vertical: "top", horizontal: "center" }}
                    >
                      <div style={{ padding: 8, paddingBottom: 0 }}>
                        <Box display="flex" alignItems="center">
                          <AccountCircleTwoTone />
                          <span style={{ marginLeft: "10px" }}>{user.name}</span>
                        </Box>
                        <Divider />
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </div>
                    </Menu>
                  </>
                  : <>
                    <div className="desktop-menu-link plain-anchor-tag"
                      onClick={handleClickLogin}
                    >Login</div>
                  </>}
              </div>

              <div className={classNames("tablet-nav", isTabletUI ? "" : "hide-on-desktop")}>
                <div className="tablet-nav-icon" onClick={toggleDrawer(true)}><MenuBarIcon /></div>
                <Drawer
                  anchor="left"
                  open={openTabletMenu}
                  onClose={toggleDrawer(false)}
                  PaperProps={{
                    className: "tablet-drawer-wrap"
                  }}
                >
                  <div className="tablet-close-button">
                    <IconButton onClick={toggleDrawer(false)}><Close /></IconButton>
                  </div>
                  {!!user && <div className="tablet-user-info">
                    <Image
                      className="user-avatar-img"
                      src="/images/user-avatar.svg"
                      alt="user-avatar"
                      width={34}
                      height={34} />
                    <div className="tablet-user-info-name">{user.name}</div>
                  </div>}
                  <div className={classNames("tablet-menu-link", !user ? "logged-out" : "")}><NextLink href="/">Home</NextLink></div>
                  {!!user && <div className="tablet-menu-link" onClick={handleLogout}>Logout</div>}
                  {!user && <div className="tablet-menu-link" onClick={handleClickLogin}>Login</div>}
                  {/* <div className="tablet-menu-link plain-anchor-tag"><Link href="/blog">Blog</Link></div> */}
                  <div className="tablet-app-download">
                    <AppDownloadButton source="chplay" link={appInfo?.linkGooglePlay} border="#1d1d1d" hoverBorder="#1d1d1d" />
                  </div>
                  <div className="tablet-app-download">
                    <AppDownloadButton source="appstore" link={appInfo?.linkAppStore} border="#1d1d1d" hoverBorder="#1d1d1d" />
                  </div>
                </Drawer>
              </div>
            </Grid>
          </Grid>
        </Container>
      </AppBar>
    </div >);
}

export default StudyHeader;