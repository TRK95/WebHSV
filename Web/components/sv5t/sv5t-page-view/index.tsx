import { Container, Grid, Stack, Pagination } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import customMaxWidthContainer from '../../../features/common/CustomMaxWidth';
import NewsModel from '../../../models/newsModel';
import { DOMAIN_ID_ALUMNI, RESPONSE_SUCCESS } from '../../../utils/constraint';
import NextLink from '../../NextLink';
import { MAX_DATA_DISPLAY } from '../activity-news';
import './style.scss'
import NewsCategory from '../../../models/newsCategoryModel';
import { apiGetNewsByDate, apiGetNewsInCategory } from '../../../utils/api/newsApi';
import BreadCrumb from '../../breadcrumb/BreadCrumb';
import moment from 'moment';
import NewsInCategory from '../../../models/newsIncategory';

function Sv5tPageView({ slugs, newsCategories, pageQuery }: { slugs?: string[], newsCategories?: Array<NewsCategory>, pageQuery }) {
    const router = useRouter()
    const [newsData, setNewsData] = useState<Array<NewsModel>>([])
    const [loading, setLoading] = useState(true)
    const [offset, setOffset] = useState((Number(pageQuery) - 1) * 5)
    const [totalAllNews, setTotalAllNews] = useState(0)
    const [totalNewsInCate, setTotalNewsInCate] = useState(0)
    const [page, setPage] = useState(Number(pageQuery))
    const [newsInCategory, setNewsIncategory] = useState<Array<NewsInCategory & { news: NewsModel }>>([])
    const [categoryId, setCategoryId] = useState<number>(
        newsCategories.filter(item => item.slug === slugs[0])[0]?._id
            ? newsCategories.filter(item => item.slug === slugs[0])[0]?._id
            : null
    )
    const [path, setPath] = useState<{
        label?: string,
        slug?: string
    }>({
        label: newsCategories?.filter(item => item?.slug === slugs?.[0])[0]?.title ? newsCategories?.filter(item => item?.slug === slugs?.[0])[0]?.title : 'Giới thiệu',
        slug: newsCategories?.filter(item => item?.slug === slugs?.[0])[0]?.slug ? `sinh-vien-5-tot/${newsCategories?.filter(item => item?.slug === slugs?.[0])[0]?.slug}?page=${Number(pageQuery)}` : `sinh-vien-5-tot/gioi-thieu?page=${Number(pageQuery)}`
    })

    useEffect(() => {
        if (slugs[0]) {
            setLoading(true)
            const newsCategory = newsCategories.filter(item => item?.slug === slugs[0])
            if (newsCategory) {
                setCategoryId(newsCategory[0]?._id)
            }
        }
    }, [slugs[0]])

    const getNewsByDate = async () => {
        const response = await apiGetNewsByDate({
            reqQuery: {
                limit: MAX_DATA_DISPLAY,
                offset: offset,
            }
        })

        if (response.status === RESPONSE_SUCCESS) {
            if (response.data.length !== totalAllNews) {
                setLoading(false)
                setNewsData(response.data)
            }
            setTotalAllNews(response.total)
        }
    }

    const getNewsInCategory = async (categoryId) => {
        const responseNewsInCate = await apiGetNewsInCategory({
            reqQuery: {
                offset: offset,
                limit: MAX_DATA_DISPLAY,
                categoryId: categoryId
            }
        })
        if (responseNewsInCate.status === RESPONSE_SUCCESS) {
            setLoading(false)
            setNewsIncategory(responseNewsInCate.data)
            setTotalNewsInCate(responseNewsInCate.total)
        }
    }

    useEffect(() => {
        if (!categoryId) {
            getNewsByDate()
        } else {
            getNewsInCategory(categoryId)
        }
    }, [offset, page, categoryId])

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [slugs[0], page, categoryId])

    const changePageCateNews = (event: React.ChangeEvent<unknown>, value: number) => {
        router.push(`/sinh-vien-5-tot/${slugs}?page=${value}`)
        setPage(value)
        setOffset((value - 1) * 5)
        setLoading(true)
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const handleChangeCate = (item: NewsCategory) => {
        router.push(`/sinh-vien-5-tot/${item.slug}`)
        setPage(1)
        setOffset(0)
        window.scrollTo(0, 0);
        setCategoryId(item?._id)
        setPath({
            label: item?.title ?? '',
            slug: `sinh-vien-5-tot/${item?.slug}`
        })
        if (slugs[0] === item.slug) {
            setLoading(false)
        } else {
            setLoading(true)
        }
    }

    return (
        <div id="news-page-view">
            <Container maxWidth={customMaxWidthContainer()}>
                <BreadCrumb path={[{ label: 'Sinh viên 5 tốt', slug: `sinh-vien-5-tot/gioi-thieu` }, { label: path?.label, slug: path?.slug }]} />
                {
                    <div>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4} md={3}>
                                <div className="news-page-view-side-bar-wrapper">
                                    <div className="news-page-view-side-bar">
                                        <ul>
                                            {newsCategories.map((item, index) => (
                                                <li onClick={() => handleChangeCate(item)} className={slugs?.length > 0 && slugs[0] === item.slug ? 'active' : ''} key={index}>
                                                    <p>{item?.title}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Grid>

                            <Grid item xs={12} sm={8} md={9}>
                                {!loading
                                    ? <>
                                        {newsInCategory.map((item, index) => (
                                            <Grid key={index} item xs={12} sm={12} md={12}>
                                                <NextLink href={`/${item.news?.slug}`}>
                                                    <div className="news-page-view-item">
                                                        <div className="news-page-view-item-image">
                                                            <img
                                                                src={item.news?.avatar?.includes('http') ? item.news?.avatar : '/images/huy-hieu-hoi.png'}
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.onerror = null;
                                                                    target.src = '/images/huy-hieu-hoi.png';
                                                                }}
                                                                style={{ objectFit: 'cover' }}
                                                            />
                                                        </div>
                                                        <div className="news-page-view-item-content">
                                                            <h3 className="news-page-view-item-title">
                                                                {item.news?.title}
                                                            </h3>
                                                            <h5>
                                                                <i style={{ color: "var(--primary-color-main)" }} >{`Ngày: ${moment(item.news?.createDate).format('DD/MM/YYYY')}`}</i>
                                                            </h5>
                                                            <p className="news-page-view-item-desc dot-4">
                                                                {item.news?.shortDes}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </NextLink>
                                            </Grid>
                                        ))
                                        }
                                        {newsInCategory && newsInCategory?.length > 0 &&
                                            <Grid item sm={12} xs={12} md={12}>
                                                <div className="news-page-view-pagination">
                                                    <Stack spacing={2}>
                                                        <Pagination style={{ display: 'flex', justifyContent: ' center' }} count={Math.ceil(totalNewsInCate / MAX_DATA_DISPLAY)} page={page} onChange={changePageCateNews} defaultValue={page} />
                                                    </Stack>
                                                </div>
                                            </Grid>
                                        }
                                    </>
                                    : <div style={{ margin: '100px auto', textAlign: 'center' }}>
                                        <CircularProgress />
                                    </div>
                                }
                            </Grid>
                        </Grid>
                    </div>
                }
            </Container >
        </div >
    );
}

export default Sv5tPageView;
