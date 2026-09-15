
import { useMediaQuery, Grid } from "@mui/material";
import { Container, useTheme } from "@mui/system";
import Image from "next/image";
import { useEffect, useState } from "react";
import customMaxWidthContainer from "../../../features/common/CustomMaxWidth";
import NewsModel from "../../../models/newsModel";
import { RESPONSE_SUCCESS } from "../../../utils/constraint";
import './style.scss'
import { apiGetNewsByDate } from "../../../utils/api/newsApi";
import NewsInCategory from "../../../models/newsIncategory";
import moment from "moment";
import { getDisplayImage } from "../../../utils/image";

export const MAX_DATA_DISPLAY = 5

function News({ title }: { title?: string }) {
    const theme = useTheme()
    const isSmallTabletUI = useMediaQuery(theme.breakpoints.down('md'))
    const [newsArrayData, setNewsArrayData] = useState<Array<NewsModel & {
        inCategories?: NewsInCategory[];
    }>>([])
    const [total, setTotal] = useState(0)

    useEffect(() => {
        (async function () {
            const response = await apiGetNewsByDate({
                reqQuery: {
                    limit: MAX_DATA_DISPLAY,
                    offset: 0,
                }
            })

            if (response.status === RESPONSE_SUCCESS) {
                setNewsArrayData(response.data)
                setTotal(response.total)
            }
        })()
    }, [])

    const handleShowMore = () => {
        window.location.href = '/tin-tuc/tat-ca-tin-tuc'
    }

    return (
        <Container maxWidth={customMaxWidthContainer()}>
            <div id="activity-and-news">
                <div className='activity-and-news-title title-h1'>
                    {title}
                </div>
                <div className="activity-and-news-body">
                    {newsArrayData.length > 0 &&
                        <Grid container>
                            <Grid item md={6} sm={12} xs={12}>
                                <Grid item md={12} sm={12} xs={12} style={{ height: "100%", paddingRight: "16px" }}>
                                    <div className="news-item" data-aos="fade-up" onClick={() => window.location.href = `/${newsArrayData[0]?.slug ? newsArrayData[0].slug : ''}`} style={{ height: "100%" }}>
                                        <Image objectFit="cover" src={getDisplayImage(newsArrayData[0]?.avatar)} width={730} height={419} style={{ height: "100%" }} />
                                        <div className="news-desc">
                                            <div className="news-title small-size-text">{newsArrayData[0]?.title}</div>
                                            <div className="news-time small-size-text" >
                                                <Image src="/images/icon/datetime.svg" width={20} height={20} />
                                                {moment(newsArrayData[0]?.createDate).format("DD/MM/YYYY - HH:mm")}
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>

                            {!isSmallTabletUI && <Grid item md={3} sm={12}>
                                <Grid container style={{ padding: "0 16px", borderRight: '1px solid #EBF1F2', borderLeft: "1px solid #EBF1F2" }}>
                                    <Grid item md={12}>
                                        <div className="news-item" data-aos="fade-up"
                                            style={{ borderBottom: "1px solid #EBF1F2", paddingBottom: "16px" }}
                                            onClick={() => window.location.href = `/${newsArrayData[1]?.slug ? newsArrayData[2].slug : ''}`} >
                                            <Image objectFit="cover" src={getDisplayImage(newsArrayData[1]?.avatar)} layout='responsive' width={287} height={185} />
                                            <div className="news-desc">
                                                <div className="news-title small-size-text">{newsArrayData[1]?.title}</div>
                                                <div className="news-time small-size-text" >
                                                    <Image src="/images/icon/datetime.svg" width={20} height={20} />
                                                    {moment(newsArrayData[1]?.createDate).format("DD/MM/YYYY - HH:mm")}
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item md={12}>
                                        <div className="news-item" data-aos="fade-up"
                                            style={{ paddingTop: "16px" }}
                                            onClick={() => window.location.href = `/${newsArrayData[2]?.slug ? newsArrayData[2].slug : ''}`} >
                                            <Image objectFit="cover" src={getDisplayImage(newsArrayData[2]?.avatar)} layout='responsive' width={287} height={185} />
                                            <div className="news-desc">
                                                <div className="news-title small-size-text">{newsArrayData[2]?.title}</div>
                                                <div className="news-time small-size-text" >
                                                    <Image src="/images/icon/datetime.svg" width={20} height={20} />
                                                    {moment(newsArrayData[2]?.createDate).format("DD/MM/YYYY - HH:mm")}
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>}
                            {!isSmallTabletUI && <Grid item md={3} sm={12}>
                                <Grid container style={{ paddingLeft: "16px", rowGap: "8px" }}>
                                    <Grid container spacing={1} style={{ paddingBottom: "8px", borderBottom: "1px solid #EBF1F2" }}>
                                        <Grid item md={5}>
                                            <div className="news-item news-item-row" data-aos="fade-up" onClick={() => window.location.href = `/${newsArrayData[1]?.slug ? newsArrayData[1].slug : ''}`} >
                                                <div className="news-desc">
                                                    <div className="news-title small-size-text">{newsArrayData[1]?.title}</div>
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={7}>
                                            <div className="news-item news-item-row" data-aos="fade-up" onClick={() => window.location.href = `/${newsArrayData[2]?.slug ? newsArrayData[2].slug : ''}`} >
                                                <Image objectFit="cover" src={getDisplayImage(newsArrayData[2]?.avatar)} layout='responsive' width={133} height={75} />
                                            </div>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={1} style={{ paddingBottom: "8px", borderBottom: "1px solid #EBF1F2" }}>
                                        <Grid item md={5}>
                                            <div className="news-item news-item-row" data-aos="fade-up" onClick={() => window.location.href = `/${newsArrayData[1]?.slug ? newsArrayData[1].slug : ''}`} >
                                                <div className="news-desc">
                                                    <div className="news-title small-size-text">{newsArrayData[1]?.title}</div>
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={7}>
                                            <div className="news-item news-item-row" data-aos="fade-up" onClick={() => window.location.href = `/${newsArrayData[2]?.slug ? newsArrayData[2].slug : ''}`} >
                                                <Image objectFit="cover" src={getDisplayImage(newsArrayData[2]?.avatar)} layout='responsive' width={133} height={75} />
                                            </div>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={1} style={{ paddingBottom: "8px", borderBottom: "1px solid #EBF1F2" }}>
                                        <Grid item md={5}>
                                            <div className="news-item news-item-row" data-aos="fade-up" onClick={() => window.location.href = `/${newsArrayData[1]?.slug ? newsArrayData[1].slug : ''}`} >
                                                <div className="news-desc">
                                                    <div className="news-title small-size-text">{newsArrayData[1]?.title}</div>
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={7}>
                                            <div className="news-item news-item-row" data-aos="fade-up" onClick={() => window.location.href = `/${newsArrayData[2]?.slug ? newsArrayData[2].slug : ''}`} >
                                                <Image objectFit="cover" src={getDisplayImage(newsArrayData[2]?.avatar)} layout='responsive' width={133} height={75} />
                                            </div>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={1} style={{ paddingBottom: "8px", borderBottom: "1px solid #EBF1F2" }}>
                                        <Grid item md={5}>
                                            <div className="news-item news-item-row" data-aos="fade-up" onClick={() => window.location.href = `/${newsArrayData[1]?.slug ? newsArrayData[1].slug : ''}`} >
                                                <div className="news-desc">
                                                    <div className="news-title small-size-text">{newsArrayData[1]?.title}</div>
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={7}>
                                            <div className="news-item news-item-row" data-aos="fade-up" onClick={() => window.location.href = `/${newsArrayData[2]?.slug ? newsArrayData[2].slug : ''}`} >
                                                <Image objectFit="cover" src={getDisplayImage(newsArrayData[2]?.avatar)} layout='responsive' width={133} height={75} />
                                            </div>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={1}>
                                        <Grid item md={5}>
                                            <div className="news-item news-item-row" data-aos="fade-up" onClick={() => window.location.href = `/${newsArrayData[1]?.slug ? newsArrayData[1].slug : ''}`} >
                                                <div className="news-desc">
                                                    <div className="news-title small-size-text">{newsArrayData[1]?.title}</div>
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid item md={7}>
                                            <div className="news-item news-item-row" data-aos="fade-up" onClick={() => window.location.href = `/${newsArrayData[2]?.slug ? newsArrayData[2].slug : ''}`} >
                                                <Image objectFit="cover" src={getDisplayImage(newsArrayData[2]?.avatar)} layout='responsive' width={133} height={75} />
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            }

                            {newsArrayData.length > MAX_DATA_DISPLAY && <Grid item md={12} sm={12}>
                                <Grid container spacing={4} >
                                    {newsArrayData.slice(isSmallTabletUI ? 2 : MAX_DATA_DISPLAY, newsArrayData.length).map((item, index) => (
                                        <Grid item sm={6} md={6} lg={4} key={index} >
                                            <div className="news-item" data-aos="fade-up" onClick={() => window.location.href = `/${item?.slug ? item.slug : ''}`} >
                                                <Image objectFit="cover" src={getDisplayImage(item?.avatar)} layout='responsive' width={350} height={260} />
                                                <div className="news-desc small-size-text"> {item?.title} </div>
                                            </div>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>}
                        </Grid>
                    }
                </div>
                <div className="activity-and-news-actions">
                    <button onClick={handleShowMore}>Xem tất cả</button>
                </div>
            </div>
        </Container >
    );
}

export default News;
