import { Grid, Container, Stack, Pagination, CircularProgress } from "@mui/material";
import './style.scss'
import customMaxWidthContainer from "../../features/common/CustomMaxWidth";
import { useEffect, useState } from "react";
import { apiGetNewsBySlug, apiGetNewsInCategory } from "../../utils/api/newsApi";
import NewsModel from "../../models/newsModel";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import { useRouter } from "next/router";

function IntroducePageView({
    introduceSlug,
    introduceCategories,
    introduceDetail
}: {
    introduceSlug: string | string[],
    introduceCategories: Array<NewsModel>,
    introduceDetail: NewsModel
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [path, setPath] = useState<{
        label?: string,
        slug?: string
    }>({
        label: introduceCategories?.filter(item => item?.slug === introduceSlug)[0]?.title ? introduceCategories?.filter(item => item?.slug === introduceSlug)[0]?.title : 'Trường đại học bách khoa',
        slug: introduceCategories?.filter(item => item?.slug === introduceSlug)[0]?.slug ? introduceCategories?.filter(item => item?.slug === introduceSlug)[0]?.slug : 'gioi-thieu/hoi-sinh-vien-dai-hoc-bach-khoa-ha-noi'
    })
    const [dataNewsOpen, setDataNewsOpen] = useState({ title: '', content: '' })

    const getOpenNews = async (slug) => {
        const newsBySlugRes = await apiGetNewsBySlug({
            reqQuery: {
                slug: slug,
            }
        })
        if (newsBySlugRes && newsBySlugRes.data) {
            setDataNewsOpen({
                title: newsBySlugRes.data.title,
                content: newsBySlugRes.data.content
            })
        }
    }

    useEffect(() => {
        getOpenNews('hoi-sinh-vien-dai-hoc-bach-khoa-ha-noi')
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [introduceSlug])

    const handleChangeCate = (item: NewsModel) => {
        router.push(`/gioi-thieu/${item?.slug}`)
        window.scrollTo(0, 0);
        setPath({
            label: item?.title ?? '',
            slug: `gioi-thieu/${item?.slug ?? ''}`
        })

        if (item?.slug === introduceSlug) {
            setLoading(false)
        } else {
            setLoading(true)
        }
    }

    return (
        <div id="introduce-page-view">
            <Container maxWidth={customMaxWidthContainer()}>
                {
                    <div>
                        <BreadCrumb path={[{ label: 'Giới thiệu', slug: 'gioi-thieu/hoi-sinh-vien-dai-hoc-bach-khoa-ha-noi' }, { label: path?.label, slug: path?.slug }]} />
                        <Grid container spacing={2}>
                            <Grid item md={3}>
                                <div className="introduce-page-view-side-bar">
                                    <ul>
                                        {introduceCategories?.length > 0 &&
                                            introduceCategories?.map(item => (
                                                <li key={item?._id} className={item?.slug === introduceSlug ? 'active' : ''} onClick={() => handleChangeCate(item)} >
                                                    <p>{item?.title}</p>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </Grid>

                            <Grid item md={9}>
                                {!loading
                                    ? <>
                                        {introduceDetail && introduceSlug !== 'hoi-sinh-vien-dai-hoc-bach-khoa-ha-noi'
                                            ? <div className="introduce-page-view-main">
                                                <h2 className="introduce-page-view-main-title">
                                                    {introduceDetail?.title}
                                                </h2>
                                                <div className="introduce-page-view-main-content" dangerouslySetInnerHTML={{ __html: introduceDetail?.content }} />
                                            </div>
                                            : <div className="introduce-page-view-main">
                                                {dataNewsOpen.title && dataNewsOpen.content
                                                    ?
                                                    <>
                                                        <h2 className="introduce-page-view-main-title">
                                                            {dataNewsOpen?.title}
                                                        </h2>
                                                        <div className="introduce-page-view-main-content" dangerouslySetInnerHTML={{ __html: dataNewsOpen?.content }} />
                                                    </>
                                                    :
                                                    <p>
                                                        Từ khi thành lập năm 1956, Trường Đại học Bách khoa Hà Nội luôn giữ vững vị thế là trường đại học kỹ thuật hàng đầu của Việt Nam. Trong xu thế hội nhập quốc tế, Nhà trường ngày càng nâng cao được uy tín về chất lượng đào tạo và năng lực nghiên cứu khoa học trong khu vực và trên thế giới.
                                                        <br />
                                                        <br />
                                                        Trải qua 59 năm xây dựng và phát triển, Nhà trường đã đào tạo được hàng trăm ngàn Kỹ sư, Thạc sĩ và Tiến sĩ, đóng góp to lớn cho sự nghiệp xây dựng và bảo vệ Tổ quốc. Nhiều người trong số đó đã trở thành các nhà lãnh đạo cao cấp của Đảng và Nhà nước, các nhà khoa học đầu ngành, lãnh đạo các trường đại học và viện nghiên cứu, lãnh đạo và chuyên gia kỹ thuật nắm giữ những vị trí chủ chốt trong các tập đoàn, tổng công ty, doanh nghiệp Nhà nước và tư nhân. Trường Đại học Bách khoa Hà Nội tự hào bởi chính sự thành công của các thế hệ sinh viên đã làm nên uy tín và thương hiệu BÁCH KHOA.
                                                        <br />
                                                        <br />
                                                        Với mong muốn kết nối các thế hệ sinh viên để chia sẻ, hợp tác và hỗ trợ cùng phát triển, phát huy những giá trị truyền thống BÁCH KHOA, Trường ĐHBK Hà Nội chính thức ra mắt “Mạng lưới Cựu sinh viên Đại học Bách khoa Hà Nội” vào ngày 15/10/2015 nhân dịp Lễ kỷ niệm 59 năm ngày thành lập Trường.
                                                        <br />
                                                        <br />
                                                        Với mục tiêu đó, Nhà trường trân trọng kính mời Ông/Bà tham gia Mạng lưới cựu sinh viên Đại học Bách khoa Hà Nội. Sự tham gia của Ông/Bà là niềm vinh dự của Nhà trường, là sự động viên to lớn đối với các thế hệ sinh viên Bách khoa.
                                                        <br />
                                                        <br />
                                                        Trân trọng!
                                                        <br />
                                                        <br />
                                                        HIỆU TRƯỞNG
                                                        <br />
                                                        <br />
                                                        PGS TS. Huỳnh Quyết Thắng
                                                    </p>
                                                }
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

export default IntroducePageView;