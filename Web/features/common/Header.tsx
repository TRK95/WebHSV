import { Button, CircularProgress, Container, Popover, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from 'next/image';
import { useRouter } from "next/router";
import { ForwardedRef, forwardRef, PropsWithoutRef, useEffect, useState } from "react";
import appConfigs from "../../config/appConfigs.json";
import Navigation from "../../components/navigation";
import NextLink from "../../components/NextLink";
import "./Header.scss";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from "../../app/hooks";
import { setCheckLoginCode, setLoginCode, setShowLoginPopup, setShowSignupPopup, setShowNotifyPopup, setDataChangePass, setDataResetPass, setLogout } from "../auth/auth.slice";
import { SxProps } from "@mui/system";
import PersonIcon from '@mui/icons-material/Person';
import { Logout as LogoutIcon } from "@mui/icons-material";
import LoginForm from "../../components/auth/LoginForm";
import { useSnackbar } from "notistack";
import ForgotPassForm from "../../components/auth/ForgotPassForm";
import ChangePassword from "../../components/auth/ChangePassword";
import customMaxWidthContainer from "./CustomMaxWidth";
import { RESPONSE_SUCCESS, STATUS_PUBLIC, USER_LOGIN_FAILED } from "../../utils/constraint";
import NavItem from "../../components/navigation/NavItem";
import { apiGetNewsCategories } from "../../utils/api/newsApi";
import { apiGetClubById, apiGetClubCategories } from "../../utils/api/clubsApi";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import NotifyPopup from "../../components/NotifyPopup/NotifyPopup";

const Header = forwardRef((props: PropsWithoutRef<{ disableAuth?: boolean }>) => {
  const theme = useTheme();
  const router = useRouter();
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobileUI = useMediaQuery(theme.breakpoints.down("sm"))
  const data = appConfigs[appName] || {};
  const [anchorUser, setAnchorUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const handleRedirectToLoginPage = () => {
  //   const { pathname, search, hash } = window.location;
  //   let currentURI = pathname;
  //   if (currentURI?.startsWith(`/${ROUTER_LOGIN}`)) return;
  //   if (router.locale !== router.defaultLocale) currentURI = `/${router.locale}${currentURI}`;
  //   const redirectURI = `${currentURI}${search}${hash}`;
  //   router.push(`/${ROUTER_LOGIN}?redirect_uri=${encodeURIComponent(redirectURI)}`);
  //   // window.location.href = ;
  // }

  const { loginCode, showLoginPopup, showForgotPopup, student, userClub, checkLoginCode, showChangePassWord, showNotifyPopup, dataResetPass } = useSelector(state => state.authState)
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const [dataIntroduceNav, setDataIntroduceNav] = useState<Array<NavItem>>([])
  const [dataNetworkNav, setDataNetworkNav] = useState<Array<NavItem>>([])
  const [dataNewsNav, setDataNewsNav] = useState<Array<NavItem>>([])
  const [dataSv5tNav, setDataSv5tNav] = useState<Array<NavItem>>([])
  const [dataDocsNav, setDataDocsNav] = useState<Array<NavItem>>([])
  const [clubNav, setClubNav] = useState<Array<NavItem>>([])

  useEffect(() => {
    (async () => {
      const introduceNavRes = await apiGetNewsCategories({
        reqQuery: {
          parentId: -1,
          type: 4,
          status: STATUS_PUBLIC,
        }
      })

      if (introduceNavRes.status === RESPONSE_SUCCESS) {
        const introduceCategories = await Promise.all(
          (introduceNavRes?.data ?? []).map(async item => {
            const childrenRes = await apiGetNewsCategories({
              reqQuery: {
                parentId: item._id,
                status: STATUS_PUBLIC,
              }
            })

            return [
              {
                name: item?.title,
                slug: `/gioi-thieu/${item?.slug}`
              },
              ...(
                childrenRes.status === RESPONSE_SUCCESS
                  ? childrenRes?.data?.map(childItem => ({
                    name: childItem?.title,
                    slug: `/gioi-thieu/${childItem?.slug}`
                  })) ?? []
                  : []
              )
            ]
          })
        )
        const introduceNavItems = introduceCategories.reduce((result, items) => [...result, ...items], [])

        setDataIntroduceNav([
          {
            name: 'Giới thiệu',
            slug: introduceNavItems[0]?.slug ?? '/gioi-thieu',
            childs: introduceNavItems
          }
        ])
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const networkContactGroupRes = await apiGetClubCategories({
        reqQuery: {
          type: 0,
          parentId: -1,
        }
      })

      if (networkContactGroupRes.status === RESPONSE_SUCCESS) {
        setDataNetworkNav([
          {
            name: 'Tổ chức trực thuộc',
            slug: '/to-chuc/tat-ca-to-chuc',
            childs:
              networkContactGroupRes?.data?.map(item => {
                return {
                  name: item.name,
                  slug: `/to-chuc/${item.slug}`
                }
              })

          }
        ])
      }
    })()
  }, [])

  useEffect(() => {
    const fetchClubDetails = async () => {
      if (userClub.length) {
        const clubDetails = await Promise.all(
          userClub.map(async (clubId: string) => {
            const clubDetail = await apiGetClubById({
              reqQuery: {
                clubId: clubId
              }
            });
            if (clubDetail) {
              return {
                name: clubDetail?.data?.name,
                slug: clubDetail?.data?.slug
              };
            }
            return null;
          })
        );

        const validClubDetails = clubDetails.filter(detail => detail !== null);

        setClubNav([
          {
            name: 'Tổ chức của bạn',
            slug: '/to-chuc-cua-ban',
            childs: validClubDetails as { name: string; slug: string; }[]
          }
        ]);
      }
    };
    fetchClubDetails();
  }, [userClub]);

  useEffect(() => {
    (async () => {
      const newsCategoriesRes = await apiGetNewsCategories({
        reqQuery: {
          parentId: -1,
        }
      })

      if (newsCategoriesRes.status === RESPONSE_SUCCESS) {
        setDataNewsNav([
          {
            name: 'Tin tức',
            slug: '/tin-tuc/tat-ca-tin-tuc',
            childs: newsCategoriesRes?.data?.map(item => {
              return {
                name: item.title,
                slug: `/tin-tuc/${item.slug ?? ''}`
              }
            })
          }
        ])
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const sv5tCategoriesRes = await apiGetNewsCategories({
        reqQuery: {
          parentId: -1,
          type: 5
        }
      })

      if (sv5tCategoriesRes.status === RESPONSE_SUCCESS) {
        setDataSv5tNav([
          {
            name: 'Phong trào sinh viên 5 tốt',
            slug: '/sinh-vien-5-tot/gioi-thieu',
            childs: [
              { name: 'Nộp hồ sơ Sinh viên 5 tốt', slug: '/sinh-vien-5-tot/ho-so' },
              ...(sv5tCategoriesRes?.data?.map(item => {
                return {
                  name: item.title,
                  slug: `/sinh-vien-5-tot/${item.slug ?? ''}`
                }
              }) ?? [])
            ]
          }
        ])
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const docCategoriesRes = await apiGetNewsCategories({
        reqQuery: {
          parentId: -1,
          type: 3
        }
      })

      if (docCategoriesRes.status === RESPONSE_SUCCESS) {
        setDataDocsNav([
          {
            name: 'Văn bản',
            slug: '/',
            childs: docCategoriesRes?.data?.map(item => {
              return {
                name: item.title,
                slug: `/tai-lieu/${item.slug ?? ''}`
              }
            })
          }
        ])
      }
    })()
  }, [])

  // useEffect(() => {
  //   let msg = ''
  //   if (loginCode !== null && loginCode === LOGIN_SUCCESS) {
  //     console.log('loginCode: ', loginCode);

  //     if (isLogined) {
  //       msg = "Bạn đã đăng nhập thành công!"
  //     } else if (isSignup) {
  //       msg = "Bạn đã đăng ký tài khoản thành công!"
  //     } else if (isForgot) {
  //       msg = "Chúng tôi đã gửi email quên mật khẩu cho bạn!"
  //     }
  //   }

  // }, [isLogined, loginCode])
  useEffect(() => {
    let msg = '';
    if (checkLoginCode !== null && checkLoginCode === USER_LOGIN_FAILED) {
      msg = "Bạn đã nhập sai tài khoản hoặc mật khẩu!"
    }
    msg && enqueueSnackbar(msg, { variant: "error", autoHideDuration: 2000, onClose: () => dispatch(setCheckLoginCode(null)) })
  }, [checkLoginCode])

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

  const isLgDesktopUI = useMediaQuery(theme.breakpoints.down("xxl"))
  return <>
    <div>
      <div className="app-bar-header">
        <Container maxWidth={customMaxWidthContainer()} style={{ padding: isMobileUI && '4px' }}>
          <div className="app-bar-header-nav">
            {isTabletUI && <Navigation disableAuth={props.disableAuth} listNav={[...dataIntroduceNav, ...dataNetworkNav, ...dataNewsNav, ...dataSv5tNav, ...clubNav, ...dataDocsNav]} />}
            <div className="left-nav-header">
              <NextLink href="/">
                <div className="logo">
                  <Image src="/images/logo.png" layout="responsive" width={76} height={76} priority={true} />
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
                    <CircularProgress className="loading-header" />
                  ) : (
                    <>
                      {!student
                        ? <div className="app-bar-header-auth">
                          <Button
                            onClick={() => {
                              // handleRedirectToLoginPage();
                              dispatch(setShowLoginPopup(true))
                            }}
                            sx={{
                              ...desktopMenuItemStyle,
                              padding: isLgDesktopUI ? '4px 12px' : '6px 8px',
                            }}
                          >
                            {loginText}
                          </Button>
                        </div>
                        : <>
                          <div className="app-bar-header-auth">
                            <Button onClick={(e) => setAnchorUser(e.currentTarget)}>
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
        </Container>
      </div>
      <div className="app-bar-header-bottom">
        <Container maxWidth={customMaxWidthContainer()} style={{ padding: isMobileUI && '4px' }}>
          <div className="app-bar-header-bottom-nav">
            <div className="main-nav-header">
              {!isTabletUI && <Navigation disableAuth={props.disableAuth} listNav={[...dataIntroduceNav, ...dataNetworkNav, ...dataNewsNav, ...dataSv5tNav, ...clubNav, ...dataDocsNav]} />}
            </div>
          </div>
        </Container>
      </div>
    </div>
    {/* <div className="nav-bar-header" ref={ref}>
      <Navigation disableAuth={props.disableAuth} />
    </div> */}
    {showLoginPopup && <LoginForm />}
    {/* login popup */}
    {/* {showSignupPopup && <RegisterForm isPopUp />} */}
    {showForgotPopup && <ForgotPassForm />}
    {showChangePassWord && <ChangePassword />}
    {showNotifyPopup && dataResetPass &&
      <NotifyPopup
        title='Đặt lại mật khẩu'
        content={dataResetPass.data}
        onClose={() => {
          dispatch(setShowNotifyPopup(false))
          dispatch(setShowLoginPopup(true))
          dispatch(setDataResetPass(null))
        }}
      />
    }
    {showNotifyPopup && loginCode &&
      <NotifyPopup
        title='Thay đổi mật khẩu'
        content={loginCode === 1 ? 'Bạn đã thay đổi mật khẩu thành công' : 'Thay đổi mật khẩu thất bại, xin vui lòng kiểm tra lại mật khẩu hiện tại'}
        onClose={() => {
          dispatch(setShowNotifyPopup(false))
          dispatch(setDataChangePass(null))
          dispatch(setLoginCode(null))
        }}
      />
    }
  </>
});

export default Header;
