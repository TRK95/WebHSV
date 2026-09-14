import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from "@mui/icons-material/Person";
import { Box, Button, CircularProgress, Container, Divider, Drawer, IconButton, List, ListItem, MenuItem, Popover, Select, Theme, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SxProps } from "@mui/system";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { LOCALE_SESSION_KEY } from "../../config/MapContraint";
import siteConfig from "../../config/siteConfig.json";
import { setLogout, setShowLoginPopup, setShowSignupPopup } from "../../features/auth/auth.slice";
import { setUseDynamicNav } from "../../features/common/layout.slice";
import GlobalLangIcon from "./GlobalLangIcon";
import localeInfo from "./locale-info.json";
import NavItem from "./NavItem";
import NavItemLink from "./NavItemLink";
import { Logout as LogoutIcon } from "@mui/icons-material";
import "./style.scss";
import NextLink from "../NextLink";
import Image from 'next/image';
import customMaxWidthContainer from "../../features/common/CustomMaxWidth";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
const NAV_STICKY_CLASS = "nav-sticky";

const Navigation = (props: PropsWithoutRef<{ disableAuth?: boolean, listNav?: Array<NavItem> }>) => {
  const { menu = [] } = (siteConfig || {}) as { menu: Array<NavItem> };
  const { listNav } = props
  const data: any = {};
  const multiLocales = !!data.multiLocales;
  const theme = useTheme();
  const navRef = useRef<HTMLDivElement | null>(null);
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'))
  const { student, userClub } = useSelector((state) => state.authState);
  const [isSticky, setIsSticky] = useState(false)
  const dispatch = useDispatch();
  const router = useRouter();

  const _menu = menu.map((menuItem) => {
    if (menuItem.name === 'Tổ chức của bạn' && userClub.length === 0) {
      return null;
    }

    listNav?.forEach(navItem => {
      if (navItem.name === menuItem.name) {
        menuItem = navItem;
      }
    });

    return menuItem;
  }).filter(menuItem => menuItem !== null);

  const [anchorElNav, setAnchorElNav] = useState(false);
  const [lang, setLang] = useState(router.locale);
  const [openSelectLang, setOpenSelectLang] = useState(false);
  const [anchorUser, setAnchorUser] = useState<any>(null);
  const [isShowAuth, setIsShowAuth] = useState(false);
  const [isShowResponsiveHeader, SetIsShowResponsiveHeader] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const navScroll = (_: Event) => {
      if (window.scrollY > 80) {
        if (navRef.current) {
          setIsShowAuth(true)
          SetIsShowResponsiveHeader(true)
          setIsSticky(true)
          navRef.current.classList.add(NAV_STICKY_CLASS);
        }
      } else {
        if (navRef.current) {
          setIsShowAuth(false)
          SetIsShowResponsiveHeader(false)
          setIsSticky(false)
          navRef.current.classList.remove(NAV_STICKY_CLASS);
        }
      }
    }
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", navScroll);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", navScroll);
      }
      dispatch(setUseDynamicNav(false));
    }
  }, []);

  useEffect(() => {
    setLang(router.locale);
    sessionStorage.setItem(LOCALE_SESSION_KEY, router.locale);
  }, [router.locale]);
  const handleChangeLang = (locale: string) => {
    setOpenSelectLang(false);
    setAnchorElNav(false);
    // window.location.href = `/${locale}${router.asPath}`;
    router.push(router.asPath, undefined, { locale });
  }

  const handleLogout = () => {
    dispatch(setLogout(null));
    setIsLoading(true)
    // window.location.replace('/');
    // router.replace("/")
    setTimeout(() => {
      router.reload();
    }, 300)
  }

  const open = Boolean(anchorUser);
  const desktopMenuItemStyle: SxProps<Theme> = {
    display: 'block', textAlign: 'left', fontWeight: 700, color: data.menuTextColor, flex: "0 0 auto", cursor: "pointer",
    padding: isTabletUI ? '3px 8px' : '6px 16px',
    "&:hover": {
      color: data.menuHoverColor
    }
  }
  const loginText = "Đăng nhập"
  const signupText = "Đăng ký"

  const isLgDesktopUI = useMediaQuery(theme.breakpoints.down('xxl'))
  return (
    <div id="web-nav" ref={navRef}>
      <div style={{ background: data.menuBackground }} className="vcvb">
        <Container maxWidth={customMaxWidthContainer()} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobileUI && '4px' || isTabletUI && ' 0 16px' }} >
          {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> */}
          {
            isTabletUI &&
            <div style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center'
            }}>
              <Box>
                <IconButton size="large" aria-controls="menu-appbar" aria-haspopup="true" sx={{ color: "#fff", padding: 0 }}
                  onClick={() => setAnchorElNav(true)}
                >
                  <MenuIcon style={{ color: "var(--primary-color-main, #1788ca)" }} />
                </IconButton>
                <Drawer
                  anchor="left"
                  open={anchorElNav}
                  onClose={() => setAnchorElNav(false)}
                  PaperProps={{
                    id: "mobile-nav",
                    style: {
                      background: data.menuBackground,
                      color: data.menuTextColor
                    }
                  }}
                >
                  <Box
                    sx={{ width: 310 }}
                    role="presentation"
                    position="relative"
                  >
                    <div className="collapse-icon-wrap">
                      <IconButton onClick={() => setAnchorElNav(false)}><CloseIcon fontSize="small" style={{ fill: data.menuTextColor }} /></IconButton>
                    </div>
                    <List className="list-menu-tablet">
                      {_menu.map((item, index) => {
                        return (
                          <ListItem key={index}>
                            <NavItemLink {...item} type="toggle" onClickCallback={() => setAnchorElNav(false)} />
                          </ListItem>
                        )
                      })}
                      {multiLocales && <>
                        <Divider sx={{ borderColor: data.menuTextColor }} />
                        <div className="select-lang-tablet">
                          <div className="select-lang-tablet-label-wrap">
                            <GlobalLangIcon fill={data.menuTextColor} />
                            <label className="select-lang-label" htmlFor="select-lang-tablet-options">{localeInfo[router.locale]?.selectLabel}</label>
                          </div>
                          <Select
                            id="select-lang-tablet-options"
                            value={lang}
                            onChange={(evt) => handleChangeLang(evt.target.value)}
                            sx={{ color: data.menuTextColor, borderRadius: "50px", "& fieldset": { borderColor: `${data.menuTextColor} !important` }, "& svg": { color: data.menuTextColor } }}
                            MenuProps={{ id: "nav-select-lang-tablet" }}
                            IconComponent={(props) => <ExpandMoreIcon {...props} />}
                          >
                            {router.locales?.map((locale) =>
                              <MenuItem className="lang-item" key={locale} value={locale}>
                                <img className="lang-item-flag" alt={lang} src={`/images/flag-icons/${locale}.svg`} width="20" height="20" />
                                <div className="lang-item-label">{localeInfo[locale]?.label ?? ''}</div>
                              </MenuItem>
                            )}
                          </Select>
                        </div>
                      </>}
                    </List>
                  </Box>
                </Drawer>
              </Box>
              {isShowResponsiveHeader && <>
                <div className="app-bar-header-nav" style={{ flex: 1 }}>
                  <div className="left-nav-header" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <NextLink href="/">
                      <div className="logo">
                        <Image src="/images/logo.png" layout="responsive" width={60} height={60} priority={true} />
                      </div>
                      <Typography>
                        HỆ THỐNG QUẢN TRỊ HỘI SINH VIÊN ĐẠI HỌC BÁCH KHOA HÀ NỘI
                      </Typography>
                    </NextLink>
                  </div>
                  <div className="right-nav-header">
                    {props.disableAuth
                      ? <></>
                      : <>
                        {isLoading ? (
                          <CircularProgress className="loading-header-mobile" />
                        ) : (
                          <>
                            {!student
                              ? <div className="app-bar-header-auth">
                                <Button
                                  onClick={() => {
                                    // handleRedirectToLoginPage();
                                    setAnchorElNav(false);
                                    dispatch(setShowLoginPopup(true))
                                  }}
                                  sx={{
                                    ...desktopMenuItemStyle,
                                    padding: isLgDesktopUI ? '4px 12px' : '6px 8px',
                                  }}
                                >
                                  {loginText}
                                </Button>
                                {/* <Button
                                onClick={() => {
                                  dispatch(setShowSignupPopup(true))
                                }}
                                sx={{
                                  ...desktopMenuItemStyle,
                                  display: isMobileUI && 'none',
                                  padding: isLgDesktopUI ? '4px 12px' : '6px 8px',
                                }}
                              >
                                {signupText}
                              </Button> */}
                              </div>
                              : <>
                                <div className="app-bar-header-auth">
                                <Button sx={{
                                  ...desktopMenuItemStyle,
                                  padding: isLgDesktopUI ? '4px 12px' : '6px 8px',
                                  display: 'flex'
                                }} onClick={(e) => setAnchorUser(e.currentTarget)}>
                                  <AccountCircleIcon sx={{ color: "#fff", cursor: "pointer" }} />
                                  <span style={{ marginLeft: 6 }}>{student.fullName || "Tài khoản"}</span>
                                </Button>
                                  <Popover
                                    open={open}
                                    anchorEl={anchorUser}
                                    onClose={() => setAnchorUser(null)}
                                    anchorOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'left',
                                    }}
                                  >
                                    <div className="username" style={{ display: "flex", justifyItems: "center", padding: "10px", cursor: "pointer" }} onClick={() => router.push(`/thong-tin-ca-nhan`)}><PersonIcon sx={{ marginRight: '7px' }} />{student.fullName}</div>
                                    {/* <div className="register-event" style={{ display: "flex", justifyItems: "center", padding: "10px", cursor: "pointer" }} onClick={() => router.push(`/dang-ky-dich-vu`)}><AppRegistrationIcon sx={{ marginRight: '7px' }} />Đăng ký dịch vụ</div> */}
                                    <div className="logout" style={{ display: "flex", justifyItems: "center", padding: "10px", cursor: "pointer" }} onClick={() => handleLogout()}><LogoutIcon sx={{ marginRight: '8px' }} /> Đăng xuất</div>
                                  </Popover>
                                </div>
                              </>
                            }
                          </>
                        )}
                      </>}
                  </div>
                </div>
              </>

              }
            </div>
          }
          {!isTabletUI && <>
            {isSticky &&
              <div className="left-nav-header">
                <NextLink href="/">
                  <div className="logo logo-sticky">
                    <Image src="/images/logo.png" width={88} height={88} priority={true} />
                  </div>
                  <Typography>
                    HỆ THỐNG QUẢN TRỊ HỘI SINH VIÊN ĐẠI HỌC BÁCH KHOA HÀ NỘI
                  </Typography>
                </NextLink>
              </div>
            }
            {
              isShowAuth && <div style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
                {isLoading ? (
                  <CircularProgress className="loading-header" />
                ) : (
                  <div>
                    {
                      !student
                        ? <div className="app-bar-header-auth" style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
                          <Button
                            onClick={() => {
                              // handleRedirectToLoginPage();
                              setAnchorElNav(false);
                              dispatch(setShowLoginPopup(true))
                            }}
                            sx={{
                              ...desktopMenuItemStyle,
                              padding: isLgDesktopUI ? '4px 12px' : '6px 8px',
                              display: 'flex'
                            }}
                          >
                            {loginText}
                          </Button>
                        </div>
                        : <>
                          <div className="app-bar-header-auth">
                            <Button sx={{
                              ...desktopMenuItemStyle,
                              padding: isLgDesktopUI ? '4px 12px' : '6px 8px',
                              display: 'flex'
                            }} onClick={(e) => setAnchorUser(e.currentTarget)}>
                              <AccountCircleIcon sx={{ color: "#fff", cursor: "pointer" }} />
                              <span style={{ marginLeft: 6 }}>{student.fullName || "Tài khoản"}</span>
                            </Button>
                            <Popover
                              open={open}
                              anchorEl={anchorUser}
                              onClose={() => setAnchorUser(null)}
                              anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                              }}
                            >
                              <div className="username" style={{ display: "flex", justifyItems: "center", padding: "10px", cursor: "pointer" }} onClick={() => router.push(`/thong-tin-ca-nhan`)}><PersonIcon sx={{ marginRight: '7px' }} />{student.fullName}</div>
                              {/* <div className="register-event" style={{ display: "flex", justifyItems: "center", padding: "10px", cursor: "pointer" }} onClick={() => router.push(`/dang-ky-dich-vu`)}><AppRegistrationIcon sx={{ marginRight: '7px' }} />Đăng ký dịch vụ</div> */}
                              <div className="logout" style={{ display: "flex", justifyItems: "center", padding: "10px", cursor: "pointer" }} onClick={() => handleLogout()}><LogoutIcon sx={{ marginRight: '8px' }} /> Đăng xuất</div>
                            </Popover>
                          </div>
                        </>
                    }
                  </div>
                )}
              </div>
            }
          </>
          }
          {/* </div> */}
        </Container>
      </div>
      <div className="app-bar-header-bottom" style={{ display: isTabletUI && "none" }}>
        <Container maxWidth={customMaxWidthContainer()} style={{ padding: isMobileUI && '4px' }}>
          <div className="app-bar-header-bottom-nav">
            <div className="main-nav-header">
              <div className="main-menu-wrap">
                {_menu.map((item, index) => {
                  return (<div className="menu-item-desktop-wrap" key={index}>
                    <NavItemLink {...item} type="nav" tabActive={router.query?.slugs?.includes(item?.slug?.slice(1))} />
                  </div>)
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Navigation
