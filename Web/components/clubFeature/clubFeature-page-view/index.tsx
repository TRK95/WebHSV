import { Container, Grid, Stack, Pagination } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import customMaxWidthContainer from '../../../features/common/CustomMaxWidth';
import { RESPONSE_SUCCESS, STATUS_PUBLIC } from '../../../utils/constraint';
import NextLink from '../../NextLink';
import { MAX_DATA_DISPLAY } from '../../news/activity-news';
import './style.scss'
import BreadCrumb from '../../breadcrumb/BreadCrumb';
import moment from 'moment';
import ClubFeatureChild from '../../../models/ClubFeatureChild';
import ClubFeatureDetail from '../../../models/ClubFeatureDetail';
import { apiGetClubFeatureDetailByFeatureId } from '../../../utils/api/clubFeatureApi';
import Club from '../../../models/clubsModel';
import { apiGetClubBySlug } from '../../../utils/api/clubsApi';

function FeaturePageView({ clubSlug, featureSlug, featureId, featureCategories, pageQuery }: { clubSlug?: string, featureSlug?: string, featureId?: string, featureCategories?: Array<ClubFeatureChild>, pageQuery }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [offset, setOffset] = useState((Number(pageQuery) - 1) * 5)
    const [totalNewsInCate, setTotalNewsInCate] = useState(0)
    const [page, setPage] = useState(Number(pageQuery))
    const [newsInCategory, setNewsIncategory] = useState<Array<ClubFeatureDetail>>([])
    const [clubDetail, setClubDetail] = useState<Club>()
    const [firstFeature, setFirstFeature] = useState<ClubFeatureChild>()
    const [path, setPath] = useState<{
        label?: string,
        slug?: string
    }>({
        label: featureCategories?.filter(item => item?._id === featureId)[0]?.title && featureCategories?.filter(item => item?._id === featureId)[0]?.title,
        slug: featureCategories?.filter(item => item?._id === featureId)[0]?.slug && `to-chuc-cua-ban/${clubSlug}/${featureCategories?.filter(item => item?._id === featureId)[0]?.slug}?page=${Number(pageQuery)}`
    })

    useEffect(() => {
        const fetchClub = async () => {
            if (clubSlug) {
                const res = await apiGetClubBySlug({
                    reqQuery: {
                        slug: clubSlug
                    }
                })
                if (res.status === RESPONSE_SUCCESS) {
                    setClubDetail(res.data)
                }
            }
        }
        fetchClub()
    }, [clubSlug])

    useEffect(() => {
        setFirstFeature(featureCategories?.filter(item => item?._id === featureId)[0])
    }, [featureCategories, featureId])

    const getNewsInCategory = async () => {
        const response = await apiGetClubFeatureDetailByFeatureId({
            limit: MAX_DATA_DISPLAY,
            offset: offset,
            featureId: featureId,
            status: STATUS_PUBLIC
        })

        if (response.status === RESPONSE_SUCCESS) {
            setLoading(false)
            setNewsIncategory(response.data)
            setTotalNewsInCate(response.total)
        }
    }

    useEffect(() => {
        if (featureId) {
            getNewsInCategory()
        }
    }, [offset, page, featureId])

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [clubSlug, page, featureId])

    const changePageCateNews = (event: React.ChangeEvent<unknown>, value: number) => {
        router.push(`/to-chuc-cua-ban/${clubSlug}/${featureSlug}-${featureId}/?page=${value}`)
        setPage(value)
        setOffset((value - 1) * 5)
        setLoading(true)
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    const handleChangeCate = (item: ClubFeatureChild) => {
        router.push(`/to-chuc-cua-ban/${clubSlug}/${item.slug}-${item._id}`)
        setPage(1)
        setOffset(0)
        window.scrollTo(0, 0);
        setPath({
            label: item?.title ?? '',
            slug: `to-chuc-cua-ban/${clubSlug}/${item.slug}-${item._id}`
        })
        if (featureId === item._id) {
            setLoading(false)
        } else {
            setLoading(true)
        }
    }
    return (
        <div id="news-page-view">
            <Container maxWidth={customMaxWidthContainer()}>
                <BreadCrumb path={[
                    { label: `${clubDetail?.name}`, slug: featureCategories && `to-chuc-cua-ban/${clubSlug}/${featureCategories[0]?.slug}-${featureCategories[0]?._id}/?page=${Number(pageQuery)}` },
                    { label: path?.label, slug: path?.slug }
                ]} />
                {
                    <div>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4} md={3}>
                                <div className="news-page-view-side-bar-wrapper">
                                    <div className="news-page-view-side-bar">
                                        <ul>
                                            {featureCategories.map((item, index) => (
                                                <li onClick={() => handleChangeCate(item)} className={featureId && featureId === item._id ? 'active' : ''} key={index}>
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
                                        {
                                            featureId && <>
                                                {newsInCategory.map((item, index) => (
                                                    <Grid key={index} item xs={12} sm={12} md={12}>
                                                        <NextLink href={`/to-chuc-cua-ban/${clubSlug}/${featureSlug}/${item?.slug}`}>
                                                            <div className="news-page-view-item">
                                                                <div className="news-page-view-item-image">
                                                                    <img
                                                                        src={item?.avatar?.includes('http') ? item?.avatar : '/images/huy-hieu-hoi.png'}
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
                                                                        <i style={{ color: "var(--primary-color-main)" }} >{`Ngày: ${moment(item?.createDate).format('DD/MM/YYYY')}`}</i>
                                                                    </h5>
                                                                    <p className="news-page-view-item-desc dot-4">
                                                                        {item?.shortDes}
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

export default FeaturePageView;
