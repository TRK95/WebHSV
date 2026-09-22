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
import Image from 'next/image';
import NonAccentVietnamese from '../../../utils/checkNonVietNameseAccent';
import { getDisplayImage } from '../../../utils/image';

function NewsPageView({ slugs = [], newsCategories = [], pageQuery = 1 }: { slugs?: string[], newsCategories?: Array<NewsCategory>, pageQuery }) {
    const router = useRouter()
    const routeSlugs = router.query.newsDetailSlug
    const activeSlug = Array.isArray(routeSlugs) ? routeSlugs[0] : slugs?.[0]
    const activePage = Number(router.query.page ?? pageQuery ?? 1)
    const [newsData, setNewsData] = useState<Array<NewsModel>>([])
    const [searchValue, setSearchValue] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [offset, setOffset] = useState((Number(pageQuery) - 1) * 5)
    const [totalAllNews, setTotalAllNews] = useState(0)
    const [totalNewsInCate, setTotalNewsInCate] = useState(0)
    const [page, setPage] = useState(Number(pageQuery))
    const [newsInCategory, setNewsIncategory] = useState<Array<NewsInCategory & { news: NewsModel }>>([])
    const [categoryId, setCategoryId] = useState<number>(
        newsCategories.filter(item => item.slug === activeSlug)[0]?._id
            ? newsCategories.filter(item => item.slug === activeSlug)[0]?._id
            : null
    )
    const [path, setPath] = useState<{
        label?: string,
        slug?: string
    }>({
        label: newsCategories?.filter(item => item?.slug === activeSlug)[0]?.title ? newsCategories?.filter(item => item?.slug === activeSlug)[0]?.title : 'Tất cả tin tức',
        slug: newsCategories?.filter(item => item?.slug === activeSlug)[0]?.slug ? `tin-tuc/${newsCategories?.filter(item => item?.slug === activeSlug)[0]?.slug}?page=${activePage}` : `tin-tuc/tat-ca-tin-tuc?page=${activePage}`
    })

    useEffect(() => {
        if (activeSlug) {
            setLoading(true)
            const newsCategory = newsCategories.find(item => item?.slug === activeSlug)
            setCategoryId(newsCategory?._id ?? null)
            setPath({
                label: newsCategory?.title ?? 'Tất cả tin tức',
                slug: newsCategory?.slug ? `tin-tuc/${newsCategory.slug}?page=${activePage}` : `tin-tuc/tat-ca-tin-tuc?page=${activePage}`
            })
        }
    }, [activeSlug, newsCategories])

    useEffect(() => {
        setPage(activePage)
        setOffset((activePage - 1) * MAX_DATA_DISPLAY)
    }, [activePage])

    const getNewsByDate = async () => {
        setLoading(true)
        try {
            const response = await apiGetNewsByDate({
                reqQuery: {
                    limit: MAX_DATA_DISPLAY,
                    offset: offset,
                }
            })

            if (response.status === RESPONSE_SUCCESS) {
                setNewsData(response.data)
                setTotalAllNews(response.total)
            }
        } finally {
            setLoading(false)
        }
    }

    const getNewsInCategory = async (categoryId) => {
        setLoading(true)
        try {
            const responseNewsInCate = await apiGetNewsInCategory({
                reqQuery: {
                    offset: offset,
                    limit: MAX_DATA_DISPLAY,
                    categoryId: categoryId
                }
            })
            if (responseNewsInCate.status === RESPONSE_SUCCESS) {
                setNewsIncategory(responseNewsInCate.data)
                setTotalNewsInCate(responseNewsInCate.total)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!categoryId) {
            getNewsByDate()
        } else {
            getNewsInCategory(categoryId)
        }
    }, [offset, page, categoryId])

    const changePageAllNews = (event: React.ChangeEvent<unknown>, value: number) => {
        setLoading(true)
        router.push(`/tin-tuc/tat-ca-tin-tuc?page=${value}`, undefined, { shallow: true, scroll: false })
        setPage(value)
        setOffset((value - 1) * 5)
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const changePageCateNews = (event: React.ChangeEvent<unknown>, value: number) => {
        router.push(`/tin-tuc/${activeSlug ?? 'tat-ca-tin-tuc'}?page=${value}`, undefined, { shallow: true, scroll: false })
        setPage(value)
        setOffset((value - 1) * 5)
        setLoading(true)
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const handleChangeCate = (item: NewsCategory) => {
        router.push(`/tin-tuc/${item.slug}`, undefined, { shallow: true, scroll: false })
        setPage(1)
        setOffset(0)
        window.scrollTo(0, 0);
        setCategoryId(item?._id)
        setPath({
            label: item?.title ?? '',
            slug: `tin-tuc/${item?.slug}`
        })
        if (activeSlug === item.slug) {
            setLoading(false)
        } else {
            setLoading(true)
        }
    }

    return (
        <div id="news-page-view">
            <Container maxWidth={customMaxWidthContainer()}>
                <BreadCrumb path={[{ label: 'Tin tức', slug: `tin-tuc/tat-ca-tin-tuc` }, { label: path?.label, slug: path?.slug }]} />
                {
                    <div>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4} md={3}>
                                <div className="news-page-view-side-bar-wrapper">
                                    <div className="news-page-view-side-bar">
                                        <ul>
                                            <li className={activeSlug === 'tat-ca-tin-tuc' ? 'active' : ''} onClick={() => {
                                                router.push(`/tin-tuc/tat-ca-tin-tuc`, undefined, { shallow: true, scroll: false })
                                                setNewsIncategory([])
                                                setCategoryId(null)
                                                setPage(1)
                                                setOffset(0)
                                                setPath({ label: 'Tất cả tin tức', slug: `tin-tuc/tat-ca-tin-tuc` })
                                                if (!categoryId) {
                                                    setLoading(false)
                                                } else (
                                                    setLoading(true)
                                                )
                                            }}><p>Tất cả tin tức</p></li>
                                            {newsCategories.map((item, index) => (
                                                <li onClick={() => handleChangeCate(item)} className={activeSlug === item.slug ? 'active' : ''} key={index}>
                                                    <p>{item?.title}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Grid>

                            <Grid item xs={12} sm={8} md={9}>
                                <div className="news-page-view-header">
                                    <div className="news-page-view-header-title title-h1">
                                        <div className="title-h1-icon">
                                            <Image src='/images/icon-head-subject.svg' layout='responsive' width={20} height={20} />
                                        </div>
                                        {newsCategories?.find(item => item?.slug === activeSlug)?.title ?? 'Tất cả tin tức'}
                                    </div>
                                    <div className="news-page-view-header-actions">
                                        <input type="search" onChange={(e) => setSearchValue(e.target.value)} placeholder="Tìm kiếm" />
                                    </div>
                                </div>
                                {!loading
                                    ? <>
                                        {!categoryId
                                            ?
                                            <>
                                                {newsData.length &&
                                                    newsData.map((item, index) => {
                                                        const searchValueNoAccent = NonAccentVietnamese(searchValue)
                                                        const newsName = NonAccentVietnamese(item.title)
                                                        if (newsName.includes(searchValueNoAccent)) {
                                                            return <Grid key={index} item xs={12} sm={12} md={12}>
                                                                <NextLink href={`/${item.slug}`}>
                                                                    <div className="news-page-view-item">
                                                                        <div className="news-page-view-item-image">
                                                                            <img
                                                                            src={getDisplayImage(item?.avatar)}
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
                                                                                {item?.title}
                                                                            </h3>
                                                                            <h5>
                                                                                <i style={{ color: 'var(--primary-color-main)' }}>{`Ngày: ${moment(item?.createDate).format('DD/MM/YYYY')}`}</i>
                                                                            </h5>
                                                                            <p className="news-page-view-item-desc dot-4">
                                                                                {item?.shortDes}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </NextLink>
                                                            </Grid>
                                                        }
                                                    })
                                                }
                                                <Grid item sm={12} xs={12} md={12}>
                                                    <div className="news-page-view-pagination">
                                                        <Stack spacing={2}>
                                                            <Pagination style={{ display: 'flex', justifyContent: ' center' }} count={Math.ceil(totalAllNews / MAX_DATA_DISPLAY)} page={page} onChange={changePageAllNews} defaultValue={page} />
                                                        </Stack>
                                                    </div>
                                                </Grid>
                                            </>
                                            :
                                            <>
                                                {newsInCategory.map((item, index) => {
                                                    const searchValueNoAccent = NonAccentVietnamese(searchValue)
                                                    const newsName = NonAccentVietnamese(item.news.title)
                                                    if (newsName.includes(searchValueNoAccent)) {
                                                        return <Grid key={index} item xs={12} sm={12} md={12}>
                                                            <NextLink href={`/${item.news?.slug}`}>
                                                                <div className="news-page-view-item">
                                                                    <div className="news-page-view-item-image">
                                                                        <img
                                                                            src={getDisplayImage(item.news?.avatar)}
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
                                                    }
                                                })
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

export default NewsPageView;
