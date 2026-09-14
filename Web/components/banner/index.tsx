import { Container, Grid, useMediaQuery, useTheme } from "@mui/material"
import Image from "next/image"
import NextLink from "../NextLink"
import { IconBanner } from "./IconBanner"
import { useEffect, useState } from 'react'
import './style.scss'
import { useDispatch, useSelector } from "../../app/hooks"
import { setShowForgotPopup, setShowLoginPopup, setShowSignupPopup } from "../../features/auth/auth.slice"
import customMaxWidthContainer from "../../features/common/CustomMaxWidth"
export const Banner = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.authState)
    const [userClass, setUserClass] = useState<number>();
    const isClient = typeof window !== 'undefined'

    useEffect(() => {
        if (user?.info?.class)
            setUserClass(user.info.class);
    }, [user]);

    const theme = useTheme()
    const isLgDesktopUI = useMediaQuery(theme.breakpoints.down('xxl'))
    const isTabletUI = useMediaQuery(theme.breakpoints.down('lg'));

    return (
        <>
            <div className="banner-pages">
                <Container maxWidth={customMaxWidthContainer()}>
                    <Grid container className="banner-item">
                        <Grid item xs={8} md={6}>
                            <div className="left-banner">
                                <div data-aos-duration="500" className="text-1"> <span>HỌC THÔNG MINH</span></div>
                                <div data-aos-duration="500" className="text-2"><b>GIÁO DỤC </b><span>Hướng tới tương lai</span></div>
                                <div className="des">
                                    <div data-aos="fade-up" data-aos-duration="500"><IconBanner /><span>Bài tập phong phú, có lời giải chi tiết, cô đọng kiến thức.</span></div>
                                    <div data-aos="fade-up" data-aos-duration="800"><IconBanner /><span>Đánh giá năng lực, thống kê chi tiết quá trình học.</span></div>
                                    <div data-aos="fade-up" data-aos-duration="1000"><IconBanner /><span>Học Online mọi lúc mọi nơi.</span></div>
                                </div>
                                {userClass ? (
                                    <NextLink href={`lop-${userClass}/`}>
                                        <div className="register-now">
                                            <button >
                                                Học thử miễn phí <Image src="/images/icon-register.svg" width={25} height={25} />
                                            </button>
                                        </div>
                                    </NextLink>
                                ) : (
                                    <div className="register-now">
                                        <button onClick={() => {
                                            dispatch(setShowLoginPopup(false))
                                            dispatch(setShowForgotPopup(false))
                                            dispatch(setShowSignupPopup(true))
                                        }} >
                                            Học thử miễn phí <Image src="/images/icon-register.svg" width={25} height={25} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Grid>
                        <Grid item xs={4} md={6}>
                            <div className="right-banner">
                                <Image src='/images/banner.png' width={isLgDesktopUI ? 400 : 782} height={isLgDesktopUI ? 271 : 535} layout="responsive" />
                            </div>
                        </Grid>
                        <div className="contact-page">
                            {/* <NextLink href="tel:+0365391481">
                                <img src="/images/phone.svg" />
                            </NextLink><br /> */}
                            <NextLink
                                href="mailto:hotro.hocthongminh@gmail.com"
                                aProps={{ target: "_blank", rel: "nofollow" }}
                            >
                                <Image src="/images/email.svg" width={isTabletUI ? 30 : 60} height={isTabletUI ? 30 : 60} />
                            </NextLink><br />
                            <NextLink
                                href="https://www.facebook.com/giao.duc.hocthongminh"
                                aProps={{ target: "_blank", rel: "nofollow" }}
                            >
                                <Image src="/images/facebook.svg" width={isTabletUI ? 30 : 60} height={isTabletUI ? 30 : 60} />
                            </NextLink><br />
                        </div>
                    </Grid>
                </Container>
            </div>
        </>
    )
}
