import { Grid, Container, CircularProgress, Stack, Pagination } from '@mui/material'
import Image from 'next/image';
import IconButtonStart from './iconList/IconButtonStart';
import { useEffect, useState } from 'react'
import './style.scss'
import Club from '../../../models/clubsModel';
import ClubCategory from '../../../models/clubsCategoryModel';
import { apiGetClubsByCategoryId, apiGetClubsByDate } from '../../../utils/api/clubsApi';
import { CLUB_TYPE, DOMAIN_ID_ALUMNI, RESPONSE_SUCCESS } from '../../../utils/constraint';
import customMaxWidthContainer from '../../../features/common/CustomMaxWidth';
import NonAccentVietnamese from '../../../utils/checkNonVietNameseAccent';
import BreadCrumb from '../../breadcrumb/BreadCrumb';
import { useRouter } from 'next/router';
import NextLink from '../../NextLink';
import { getPurifiedContent } from '../../../utils/format';

export const MAX_CLUBS_DATA_DISPLAY = 10

function NetWorkClubPageView({
    clubCategories,
    slugs
}: {
    clubCategories: Array<ClubCategory>,
    slugs?: string[]
}) {
    const currentCategory = clubCategories?.find(item => item?.slug === slugs?.[0])
    const [clubsData, setClubsData] = useState<Array<Club>>([])
    const [categoryId, setCategoryId] = useState<string>(
        currentCategory?._id
            ? currentCategory?._id
            : null
    )
    const [clubsByCategoryId, setClubsByCategoryId] = useState<Array<Club>>([])
    const [clubName, setClubName] = useState<string>(
        currentCategory?.name
            ? currentCategory?.name
            : undefined,
    )
    const [categoryDescription, setCategoryDescription] = useState<string>(currentCategory?.des ?? '')
    const [searchValue, setSearchValue] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const [offset, setOffset] = useState(0)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [path, setPath] = useState<{
        label?: string,
        slug?: string
    }>({
        label: !!currentCategory?.name
            ? currentCategory?.name
            : 'Tất cả tổ chức',
        slug: !!currentCategory?.slug
            ? `${currentCategory?.slug}`
            : 'to-chuc/tat-ca-to-chuc'
    })
    useEffect(() => {
        if (categoryId) {
            (async function () {
                const clubsResponse = await apiGetClubsByCategoryId({
                    reqQuery: {
                        categoryId: categoryId
                    }
                })

                if (clubsResponse.status === RESPONSE_SUCCESS) {
                    setClubsByCategoryId(clubsResponse.data)
                }
            })()
        }
    }, [categoryId, slugs?.[0]])

    useEffect(() => {
        (async function () {
            const clubsRes = await apiGetClubsByDate({
                reqQuery: {
                    limit: MAX_CLUBS_DATA_DISPLAY,
                    offset: offset,
                    type: CLUB_TYPE,
                }
            })

            if (clubsRes.status === RESPONSE_SUCCESS) {
                if (clubsRes.data.length !== total) {
                    setClubsData(clubsRes.data)
                }
                setTotal(clubsRes.total)
            }
        })()
    }, [offset, page])

    const handleChangeCate = (item: ClubCategory) => {
        router.push(`/to-chuc/${item.slug}`)
        setCategoryId(item._id)
        setClubName(item.name)
        setCategoryDescription(item.des ?? '')
        window.scrollTo(0, 0);
        setPath({
            label: item?.name ?? '',
            slug: `to-chuc/${item?.slug ?? ''}`
        })
        if (item.slug === slugs?.[0]) {
            setLoading(false)
        } else {
            setLoading(true)
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [clubName, slugs?.[0]])

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        // router.push({
        //     pathname: router?.pathname,
        //     query: { 'page': `${value}` }
        // })
        setPage(value)
        setOffset((value - 1) * 5)
    }

    return (
        <Container maxWidth={customMaxWidthContainer()} >
            <div id="network-club-page-view">
                <BreadCrumb path={[{ label: 'Tổ chức', slug: 'to-chuc/tat-ca-to-chuc' }, { label: path?.label, slug: path?.slug }]} />
                <div className="network-club-page-view-layout">
                    <div className="network-club-side-bar-wrapper">
                        <div className="network-club-side-bar">
                            {/* <div className="network-club-side-bar-title title-h1">
                                Các tổ chức
                            </div> */}
                            <ul className="network-club-side-bar-options">
                                <li onClick={() => {
                                    router.push('/to-chuc/tat-ca-to-chuc')
                                    setClubsByCategoryId([])
                                    setCategoryId(null)
                                    setLoading(false)
                                    setPath({ label: 'Tất cả tổ chức', slug: 'to-chuc/tat-ca-to-chuc' })
                                    setClubName(undefined)
                                    setCategoryDescription('')
                                }} className={`network-club-side-bar-options-item ${slugs?.length > 0 && slugs[0] === 'tat-ca-to-chuc' ? 'active' : ''}`}>
                                    <div className="side-bar-options-name">Tất cả tổ chức</div>
                                </li>
                                {clubCategories.map((item, index) => (
                                    <li onClick={() => handleChangeCate(item)} key={index} className={`network-club-side-bar-options-item ${slugs?.length && slugs?.[0] === item.slug ? 'active' : ''}`}>
                                        {/* <div className="side-bar-options-icon">
                                            {item.icon}
                                        </div> */}
                                        <div className="side-bar-options-name">{item.name}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="network-club-main">
                        <div className="network-club-main-header">
                            <div className="network-club-main-header-title title-h1">
                                <div className="title-h1-icon">
                                    <Image src='/images/icon-head-subject.svg' layout='responsive' width={20} height={20} />
                                </div>
                                {`${clubName ? `${clubName}` : 'Tất cả tổ chức'}`}
                            </div>
                            <div className="network-club-main-header-actions">
                                <input type="search" onChange={(e) => setSearchValue(e.target.value)} placeholder="Tìm kiếm" />
                            </div>
                        </div>
                        {!!categoryDescription && (
                            <div
                                className="network-club-category-description"
                                dangerouslySetInnerHTML={{ __html: getPurifiedContent(categoryDescription) }}
                            />
                        )}
                        {!loading
                            ? <div className="network-club-main-body">
                                <Grid container spacing={2}>
                                    <>
                                        {!(clubsByCategoryId.length > 0) && !categoryId
                                            ? <>
                                                {clubsData.map((item, index) => {
                                                    const searchValueNoAccent = NonAccentVietnamese(searchValue)
                                                    const clubName = NonAccentVietnamese(item.name)
                                                    if (clubName.includes(searchValueNoAccent)) {
                                                        return (
                                                            <Grid item key={index} md={4} sm={4} xs={6}>
                                                                <NextLink href={`/to-chuc/tat-ca/${item.slug ?? ''}`}>
                                                                    <div className="network-club-main-body-item">
                                                                        <div className="network-club-main-body-item-images">
                                                                            <Image objectFit='cover' src={item?.avatar?.includes('http') ? item.avatar : '/images/e-hust-clubs.jpg'} layout="responsive" width={280} height={146} />
                                                                        </div>
                                                                        <div className="network-club-main-body-item-content">
                                                                            <div className="item-content-name dot-2">
                                                                                {item.name}
                                                                            </div>
                                                                            <div className="item-content-members">
                                                                                {`Thành viên: ${item.memNum}`}
                                                                            </div>
                                                                            <div className="item-content-leader">
                                                                                {`Chủ tịch: ${item?.president?.fullName ?? 'Chưa có'}`}
                                                                            </div>
                                                                            <div className="item-content-short-desc dot-3">
                                                                                {`Mô tả ngắn: ${item?.shortDes?.length > 0 ? item?.shortDes : 'Chưa có'}`}
                                                                            </div>
                                                                            <div className="item-content-actions">
                                                                                <button onClick={() => window.location.href = `/to-chuc/tat-ca/${item.slug ?? ''}`}>
                                                                                    <div style={{ marginRight: '6px', display: 'flex', alignItems: 'center' }}>
                                                                                        <IconButtonStart />
                                                                                    </div>
                                                                                    Xem chi tiết
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </NextLink>
                                                            </Grid>
                                                        )
                                                    }
                                                })}
                                            </>
                                            : <>
                                                {clubsByCategoryId.map((item, index) => {
                                                    const searchValueNoAccent = NonAccentVietnamese(searchValue)
                                                    const clubName = NonAccentVietnamese(item.name)
                                                    if (clubName.includes(searchValueNoAccent)) {
                                                        return (
                                                            <Grid item key={index} md={4} sm={4} xs={6}>
                                                                <NextLink href={`/to-chuc/${slugs?.[0]}/${item.slug ?? ''}`}>
                                                                    <div className="network-club-main-body-item">
                                                                        <div className="network-club-main-body-item-images">
                                                                            <Image objectFit='cover' src={item?.avatar?.includes('http') ? item.avatar : '/images/e-hust-clubs.jpg'} layout="responsive" width={280} height={146} />
                                                                        </div>
                                                                        <div className="network-club-main-body-item-content">
                                                                            <div className="item-content-name dot-2">
                                                                                {item.name}
                                                                            </div>
                                                                            <div className="item-content-members">
                                                                                {`Thành viên: ${item.memNum}`}
                                                                            </div>
                                                                            <div className="item-content-leader">
                                                                                {`Chủ tịch: ${item?.president?.fullName ?? 'Chưa có'}`}
                                                                            </div>
                                                                            <div className="item-content-short-desc dot-3">
                                                                                {`Mô tả ngắn: ${item?.shortDes?.length > 0 ? item?.shortDes : 'Chưa có'}`}
                                                                            </div>
                                                                            <div className="item-content-actions">
                                                                                <button onClick={() => window.location.href = `/to-chuc/${slugs?.[0]}/${item.slug ?? ''}`}>
                                                                                    <div style={{ marginRight: '6px', display: 'flex', alignItems: 'center' }}>
                                                                                        <IconButtonStart />
                                                                                    </div>
                                                                                    Xem chi tiết
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </NextLink>
                                                            </Grid>
                                                        )
                                                    }
                                                })}
                                            </>
                                        }
                                    </>
                                </Grid>
                            </div>
                            : <div style={{ margin: '60px auto', textAlign: 'center' }}>
                                <CircularProgress />
                            </div>
                        }

                        {!(clubsByCategoryId.length > 0) && !categoryId
                            && <div className="network-club-page-view-pagination" style={{ marginTop: '10px' }}>
                                <Stack spacing={2}>
                                    <Pagination style={{ display: 'flex', justifyContent: ' center' }} count={Math.ceil(total / MAX_CLUBS_DATA_DISPLAY)} page={page} onChange={handleChangePagination} />
                                </Stack>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default NetWorkClubPageView;
