import { Container, Grid } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import customMaxWidthContainer from '../../../features/common/CustomMaxWidth';
import NewsModel from '../../../models/newsModel';
import { RESPONSE_SUCCESS, STATUS_PUBLIC } from '../../../utils/constraint';
import './style.scss'
import NewsCategory from '../../../models/newsCategoryModel';
import { apiGetNewsInCategory } from '../../../utils/api/newsApi';
import BreadCrumb from '../../breadcrumb/BreadCrumb';
import NewsInCategory from '../../../models/newsIncategory';
import { getPurifiedContent } from '../../../utils/format';
import ContentSidebar from '../../common/ContentSidebar';

type CategoryId = string | number;

function Sv5tPageView({ slugs = [], newsCategories = [], pageQuery = 1 }: { slugs?: string[], newsCategories?: Array<NewsCategory>, pageQuery }) {
    const router = useRouter()
    const routeSlugs = router.query.sv5tDetailSlug
    const activeSlug = Array.isArray(routeSlugs) ? routeSlugs[0] : slugs?.[0]
    const initialCategory = newsCategories?.find(item => item?.slug === activeSlug)
    const [loading, setLoading] = useState(true)
    const [newsInCategory, setNewsIncategory] = useState<Array<NewsInCategory & { news: NewsModel }>>([])
    const [categoryId, setCategoryId] = useState<CategoryId | null>(initialCategory?._id ?? null)
    const [path, setPath] = useState<{
        label?: string,
        slug?: string
    }>({
        label: initialCategory?.title ?? 'Giới thiệu',
        slug: initialCategory?.slug ? `sinh-vien-5-tot/${initialCategory.slug}?page=${Number(pageQuery)}` : `sinh-vien-5-tot/gioi-thieu?page=${Number(pageQuery)}`
    })

    useEffect(() => {
        if (activeSlug) {
            setLoading(true)
            const newsCategory = newsCategories?.find(item => item?.slug === activeSlug)
            setCategoryId(newsCategory?._id ?? null)
            setPath({
                label: newsCategory?.title ?? 'Giới thiệu',
                slug: newsCategory?.slug ? `sinh-vien-5-tot/${newsCategory.slug}` : 'sinh-vien-5-tot/gioi-thieu'
            })
        }
    }, [activeSlug, newsCategories])

    const getNewsInCategory = async (categoryId) => {
        const responseNewsInCate = await apiGetNewsInCategory({
            reqQuery: {
                offset: 0,
                limit: 1,
                status: STATUS_PUBLIC,
                categoryId: categoryId
            }
        })
        if (responseNewsInCate.status === RESPONSE_SUCCESS) {
            setNewsIncategory(responseNewsInCate.data)
        } else {
            setNewsIncategory([])
        }
        setLoading(false)
    }

    useEffect(() => {
        if (categoryId) {
            getNewsInCategory(categoryId)
        } else {
            setNewsIncategory([])
            setLoading(false)
        }
    }, [categoryId])

    const handleChangeCate = (item: NewsCategory) => {
        router.push(`/sinh-vien-5-tot/${item.slug}`, undefined, { shallow: true, scroll: false })
        window.scrollTo(0, 0);
        setCategoryId(item?._id)
        setPath({
            label: item?.title ?? '',
            slug: `sinh-vien-5-tot/${item?.slug}`
        })
        if (activeSlug === item.slug) {
            setLoading(false)
        } else {
            setLoading(true)
        }
    }
    const selectedNews = newsInCategory?.[0]?.news;

    return (
        <div id="news-page-view">
            <Container maxWidth={customMaxWidthContainer()}>
                <BreadCrumb path={[{ label: 'Sinh viên 5 tốt', slug: `sinh-vien-5-tot/gioi-thieu` }, { label: path?.label, slug: path?.slug }]} />
                {
                    <div>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4} md={3}>
                                <ContentSidebar
                                    items={newsCategories?.map((item) => ({
                                        key: item._id || item.slug,
                                        label: item?.title,
                                        active: activeSlug === item.slug,
                                        onClick: () => handleChangeCate(item),
                                    }))}
                                />
                            </Grid>

                            <Grid item xs={12} sm={8} md={9}>
                                {!loading
                                    ? <>
                                        {selectedNews
                                            ? <div className="news-page-view-detail">
                                                <h2 className="news-page-view-detail-title">
                                                    {selectedNews.title}
                                                </h2>
                                                <div
                                                    className="news-page-view-detail-content"
                                                    dangerouslySetInnerHTML={{ __html: getPurifiedContent(selectedNews.content || selectedNews.shortDes || '') }}
                                                />
                                            </div>
                                            : <div className="news-page-view-empty">
                                                Chưa có nội dung cho danh mục này.
                                            </div>
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
