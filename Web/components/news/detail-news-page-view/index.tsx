import { Container } from "@mui/system";
import customMaxWidthContainer from "../../../features/common/CustomMaxWidth";
import NewsModel from "../../../models/newsModel";
import moment from "moment";
import './style.scss'
import BreadCrumb from "../../breadcrumb/BreadCrumb";
import { Form, message, notification } from "antd";
import { PAGE_SIZE, RESPONSE_FAILED, RESPONSE_SUCCESS, STATUS_DELETED, STATUS_PUBLIC } from "../../../utils/constraint";
import { useRef, useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from "../../../app/hooks";
import NewsCategory from "../../../models/newsCategoryModel";
import { apiGetNewsBySlug, apiGetcategoryOfNews, apiUpdateNews } from "../../../utils/api/newsApi";
import { fetchNewsList, resetIsErrorNews, setIsLoading } from "../../../app/redux/reducers/newsSlice";
import _ from "lodash";
import { Button as ButtonMui } from '@mui/material'
import EditClubIcon from "../../club/detail-club-page-view/EditClubIcon";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { fetchNewsCategory, resetIsErrorNewsCategory } from "../../../app/redux/reducers/newsCategorySlice";
import NewsInCategory from "../../../models/newsIncategory";
import { useSnackbar } from "notistack";

export type News = NewsModel & {
    key?: React.Key,
    inCategories?: Array<NewsInCategory>
}

function DetailNewsPageView({ newsDetail, slug }: { newsDetail: NewsModel, slug?: string }) {
    const paths = [{ label: newsDetail?.contentType === 0 ? 'Tin tức' : "Sinh viên 5 tốt", slug: 'tin-tuc/tat-ca-tin-tuc' }, { label: newsDetail.title, slug: slug }]
    const student = useSelector(state => state.authState.student)
    const descRef = useRef<any>();
    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const newsReducer = useSelector((state) => state.newsReducer)
    const newsCategoryReducer = useSelector((state) => state.newsCategoryReducer)
    const newsCategory = newsCategoryReducer.newsCategory
    const isErrorNews = newsReducer.isError
    const isErrorCategory = newsCategoryReducer.isError
    const isLoading = newsReducer.loading

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [postDetailUpdate, setPostDetailUpdate] = useState<News | undefined>(undefined)
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE)
    const [dataUpload, setDataupload] = useState<string>()
    const [status, setStatus] = useState<number>(STATUS_PUBLIC)
    const [category, setCategory] = useState<number>(0);
    const [categoryInNews, setCategoryInNews] = useState<NewsCategory[]>([])
    const [loadingcategoryInNews, setLoadingcategoryInNews] = useState<boolean>(false)
    const { enqueueSnackbar } = useSnackbar()

    const onDelete = async (values: News) => {
        const response = await apiUpdateNews({
            reqBody: {
                ...values,
                status: STATUS_DELETED
            }
        })

        if (response.status === RESPONSE_SUCCESS) {
            dispatch(fetchNewsList({
                pageSize,
                offset: page * pageSize,
                status: status
            }))
            message.success('Xóa tin tức thành công !')
        } else if (response.status === RESPONSE_FAILED) {
            message.success('Xóa không thành công !')
        }
    }

    const onFinish = () => {
        form.validateFields()
            .then(async (values) => {
                setIsModalOpen(false)
                setPostDetailUpdate(undefined)
                dispatch(setIsLoading(true))
                setCategoryInNews([])
                const bodyReq = {
                    title: values?.title.trim() ?? "",
                    content: descRef?.current?.getContent().trim() ?? "",
                    shortDes: values?.shortDes.trim(),
                    avatar: dataUpload ?? "",
                    slug: values?.slug,
                    ownerId: values?.ownerId ?? "",
                    status: values?.status
                }
                const categorysBefore = postDetailUpdate?.inCategories?.map(item => item.categoryId) || []
                const categorysAfter = values.inCategories
                const categoryRemoves = _.difference(categorysBefore, categorysAfter).join(",")
                const categoryAdds = _.difference(categorysAfter, categorysBefore).join(",")

                let result: {
                    data: NewsModel;
                    status: number;
                };

                if (postDetailUpdate) {
                    result = await apiUpdateNews({
                        reqBody: {
                            id: postDetailUpdate?._id,
                            ...bodyReq
                        }
                    })
                } else {
                    result = await apiUpdateNews({
                        reqBody: bodyReq
                    })
                }
                if (result.status === RESPONSE_SUCCESS) {
                    enqueueSnackbar("Cập nhật tin tức thành công", { variant: "success", autoHideDuration: 2000 })
                    // cập nhật danh mục cha
                    // const reqQuery = {
                    //     newsId: result?.data?._id,
                    //     adds: categoryAdds,
                    //     removes: categoryRemoves,
                    // }
                    // const createCategoryRes = await apiAddOrRemoveNewsCategory({ reqQuery })
                    // if (createCategoryRes.status === RESPONSE_SUCCESS) {
                    //     message.success("Cập nhật danh mục tin tức thành công!")
                    // } else {
                    //     message.error("Cập nhật danh mục tin tức thất bại!")
                    // }
                    setTimeout(() => {
                        window.location.replace('/tin-tuc/tat-ca-tin-tuc')
                    }, 1000)
                } else {
                    enqueueSnackbar("Cập nhật tin tức thành công", { variant: "error", autoHideDuration: 2000 })
                }
                dispatch(fetchNewsList({
                    pageSize,
                    offset: page * pageSize,
                    status: status
                }))
            })
            .catch((infor) => {
                console.log("validate Fields:", infor)
            })
    }

    const checkSlugIsExist = async (slug: string) => {
        if (slug) {
            const data = await apiGetNewsBySlug({ reqQuery: { slug } })
            if (data.status === RESPONSE_SUCCESS) {
                // check trường hợp update
                const id = data.data?._id;
                return id !== postDetailUpdate?._id && data.data !== null
            } else {
                message.error('không check được danh sách slug')
                return true
            }
        }
    }

    useEffect(() => {
        if (isErrorNews) {
            notification.error({
                message: 'không tải được danh sách tin tức',
                duration: 1.5
            })
            dispatch(resetIsErrorNews())
        }
        if (isErrorCategory) {
            notification.error({
                message: 'không tải được danh sách danh mục tin tức',
                duration: 1.5
            })
            dispatch(resetIsErrorNewsCategory())
        }
    }, [isErrorNews, isErrorCategory])

    useEffect(() => {
        dispatch(fetchNewsCategory({
            parentId: -1,
            status: STATUS_PUBLIC
        }))
    }, [])

    useEffect(() => {
        if (postDetailUpdate) {
            form.setFieldsValue({
                title: postDetailUpdate.title,
                slug: postDetailUpdate.slug,
                shortDes: postDetailUpdate.shortDes,
                status: postDetailUpdate.status,
                inCategories: categoryInNews.length ? categoryInNews.map(o => o._id) : postDetailUpdate?.inCategories
                    ?.filter(item => newsCategory.find(category => category._id === item.categoryId)) // loại bỏ trường hợp thuộc category đã xóa
                    .map(item => item.categoryId)
            })
        }
    }, [postDetailUpdate, categoryInNews])

    // const options = newsCategory.map(item => {
    //     return {
    //         value: item._id || 0,
    //         label: item.title
    //     }
    // })

    const isAdmin = student?.fullName?.toLowerCase() === "admin"
    const renderActions = useMemo(() => {
        if (isAdmin)
            return <ButtonMui
                startIcon={<EditClubIcon />}
                color="inherit"
                endIcon={<KeyboardArrowRightIcon />}
                onClick={async () => {
                    setIsModalOpen(true)
                    setPostDetailUpdate(newsDetail)
                    if (category !== 0) {
                        try {
                            setLoadingcategoryInNews(true)
                            const categoryOfnews = await apiGetcategoryOfNews({
                                newId: newsDetail._id || ''
                            })

                            if (categoryOfnews.status === RESPONSE_SUCCESS) {
                                setCategoryInNews(categoryOfnews.data)
                                setLoadingcategoryInNews(false)
                            } else {
                                notification.error({
                                    message: 'không load được danh mục của tin tức này'
                                })
                            }
                        } catch (error) {
                            notification.error({
                                message: 'không load được danh mục của tin tức này'
                            })
                        }
                    }
                }}
            >
                Chỉnh sửa thông tin
            </ButtonMui>
    }, [student])

    return (<div id='detail-news-page-view' style={{ padding: '20px 0', color: 'var(--textColor)' }}>
        <Container maxWidth={customMaxWidthContainer()}>
            <BreadCrumb path={paths} />
            {newsDetail ? <div className="detail-news-page-view-content">
                <div className="detail-news-page-view-header">
                    <h2 className="detail-news-header-title" style={{ marginBottom: '8px' }}>
                        {newsDetail?.title ?? 'Không có tiêu đề'}
                    </h2>
                    <i className="detail-news-header-date" style={{ color: 'var(--primary-color-main)' }}>
                        {`Ngày: ${moment(newsDetail?.createDate).format('DD/MM/YYYY')}`}
                    </i>
                    <div className="detail-news-page-view-header-actions">
                        {renderActions}
                    </div>
                </div>
                {newsDetail?.content
                    ? <div className="detail-news-page-view-body" dangerouslySetInnerHTML={{ __html: newsDetail?.content }}>
                    </div>
                    : <div className="detail-news-page-view-body">
                        <p>Không có dữ liệu</p>
                    </div>
                }
            </div>
                : <h3>
                    Không có dữ liệu
                </h3>
            }
        </Container>
    </div>
    );
}

export default DetailNewsPageView;