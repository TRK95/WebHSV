
import { apiAddOrRemoveCategory, apiGetcategoryOfNews, apiGetNewsBySlug, apiGetNewsCategory, apiUpdateNews } from '@/api/newsApi';
import NewsCategory from '@/models/NewsCategory';
import NewsInCategory from '@/models/NewsInCategory';
import NewsModel from '@/models/NewsModel';
import { AppState } from '@/redux/reducer';
import { fetchNewsCategory, resetIsErrorNewsCategory } from '@/redux/reducer/newsCategorySlice';
import { fetchNewsList, fetchNewsListByCategory, resetIsErrorNews, setIsLoading } from '@/redux/reducer/newsSlice';
import { PAGE_SIZE, RESPONSE_FAILED, RESPONSE_SUCCESS, statuses, STATUS_DELETED, STATUS_PRIVATE, STATUS_PUBLIC, STATUS_OPEN, CONTENT_TYPE_NORMAL } from '@/utils/contrants';
import NonAccentVietnamese from '@/utils/nonAccentVN';
import { convertSlug } from '@/utils/slug';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Badge, Button, Col, Form, Input, message, Modal, notification, Row, Select, Space, Table, Tooltip, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TextArea from 'antd/lib/input/TextArea';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TinymceEditor from '../TinymceEditor';
import UploadAvatarCrop from '../UploadAvatar';
import locale from 'antd/es/date-picker/locale/vi_VN'
import { IconExternalLink } from '@/assets/icon/externalLink';
import './style.scss';

export const TYPE_SORT_OLDEST = 0
export const TYPE_SORT_NEWEST = 1

export type News = NewsModel & {
    key?: React.Key,
    inCategories?: Array<NewsInCategory>
}

function NewsPageView() {
    const descRef = useRef<any>();
    const dispatch = useDispatch()
    const [form] = Form.useForm();

    const newsReducer = useSelector((state: AppState) => state.newsReducer)
    const newsCategoryReducer = useSelector((state: AppState) => state.newsCategoryReducer)
    const newsCategory = newsCategoryReducer.newsCategory
    const newsListData = newsReducer.newsListData
    const newsListTotal = newsReducer.newsListTotal
    const isErrorNews = newsReducer.isError
    const isErrorCategory = newsCategoryReducer.isError
    const isLoading = newsReducer.loading

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [postDetailUpdate, setPostDetailUpdate] = useState<News | undefined>(undefined)
    const [page, setPage] = useState<number>(0);
    const [pageDefault, setPageDefault] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE)
    const [dataUpload, setDataupload] = useState<string>()
    const [status, setStatus] = useState<number>(STATUS_PUBLIC)
    const [category, setCategory] = useState<string>("0");
    // const [categoryInNews, setCategoryInNews] = useState<NewsCategory[]>([])
    const [categoryInNews, setCategoryInNews] = useState<NewsCategory[]>([])
    const [loadingcategoryInNews, setLoadingcategoryInNews] = useState<boolean>(false)
    const [childCategoryOptions, setChildCategoryOptions] = useState<{ value: number, label: string }[]>([])

    const columns: ColumnsType<News> = [
        {
            title: "STT",
            dataIndex: 'key',
            align: 'center',
            width: '5%'
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '25%',
            render: (text: Array<NewsInCategory>, record) => {
                const parentSlug = record.inCategories?.map((item) => {
                    // console.log(newsCategory);

                    return newsCategory?.filter(newsCate => {
                        // return Number(newsCate?.id) === item?.categoryId
                        return newsCate?._id === item?.categoryId
                    }).map(item => {
                        return item?.slug
                    })
                })
                let isViewNews = false
                if (record.status === 1 || record.status === 3) {
                    isViewNews = true
                } else {
                    isViewNews = false
                }
                return (
                    <Row gutter={10}>
                        <Col span={21}>
                            {record.title}
                        </Col>
                        {isViewNews === true &&
                            <Col span={3}>
                                <Tooltip title="View">
                                    <div style={{ color: 'blue', cursor: 'pointer' }}
                                        onClick={() => {
                                            window.open(`${process.env.API_ENDPOINT_REDIRECT}/${record.slug}`, '_blank')
                                        }}
                                    >
                                        <IconExternalLink />
                                    </div>
                                </Tooltip>
                            </Col>
                        }
                    </Row>
                )
            }
        },
        {
            title: 'Danh mục cha',
            dataIndex: 'inCategories',
            key: 'category',
            width: '20%',
            render: (text: Array<NewsInCategory>, record) => {
                if (categoryInNews.length) {
                    return categoryInNews.map((item) => item?.title).join(";")
                } else {
                    return record.inCategories?.map((item) => {
                        return newsCategory?.filter(newsCate => {
                            // return Number(newsCate?.id) === item?.categoryId
                            return newsCate?._id === item?.categoryId
                        }).map(item => {
                            return item?.title
                        })
                    }).join(";")
                }
            }
        },
        {
            title: 'Đường dẫn',
            dataIndex: 'slug',
            key: 'slug',
            width: '20%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '8%',
            render: (text, record) => {
                if (record.status === STATUS_PRIVATE) {
                    return <div style={{ display: 'flex' }}>
                        <Badge status='warning' />{'riêng tư'}
                    </div>
                } else if (record.status === STATUS_PUBLIC) {
                    return <div style={{ display: 'flex' }}>
                        <Badge status='success' />{'công khai'}
                    </div>
                } else if (record.status === STATUS_DELETED) {
                    return <div style={{ display: 'flex' }}>
                        <Badge status='error' />{'đã xóa'}
                    </div>
                } else if (record.status === STATUS_OPEN) {
                    return <div style={{ display: 'flex' }}>
                        <Badge status='success' />{'Mặc định'}
                    </div>
                }
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createDate',
            key: 'createDate',
            render: (text, row) => (
                <span>{text > 0 ? moment(text).format('HH:mm:ss DD/MM/YYYY') : ""}</span>
            )
        },
        {
            title: 'Hành động',
            key: 'operation',
            fixed: 'right',
            align: 'center',
            render: (text, record) =>
                <Space size='large' style={{ fontSize: '20px' }}>
                    <Tooltip title="Chỉnh sửa">
                        <div
                            style={{
                                color: '#ff8b18',
                                cursor: 'pointer'
                            }}
                            onClick={async () => {
                                form.resetFields()
                                setIsModalOpen(true)
                                setPostDetailUpdate(record)
                                form.setFieldsValue({
                                    createDate: record?.createDate ? moment(record?.createDate) : null
                                })
                                // khi dang filter theo danh muc
                                if (category !== "0") {
                                    try {
                                        setLoadingcategoryInNews(true)
                                        const categoryOfnews = await apiGetcategoryOfNews({
                                            // newId: record.id || 0
                                            newId: record._id || "0"
                                        })

                                        if (categoryOfnews.status === RESPONSE_SUCCESS) {
                                            setCategoryInNews(categoryOfnews.data)
                                            setLoadingcategoryInNews(false)
                                        } else {
                                            notification.error({
                                                message: 'Không load được danh mục của tin tức này'
                                            })
                                        }
                                    } catch (error) {
                                        notification.error({
                                            message: 'Không load được danh mục của tin tức này'
                                        })
                                    }
                                }

                            }}
                        >
                            <EditOutlined />
                        </div>
                    </Tooltip>

                    {text.status !== STATUS_DELETED &&
                        <Tooltip title="Xóa">
                            <div style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => {
                                    Modal.confirm({
                                        title: 'Bạn có muốn xóa tin tức?',
                                        icon: <ExclamationCircleOutlined />,
                                        content: `${text.title}`,
                                        onOk() {
                                            onDelete(record)
                                        },
                                        okType: 'danger',
                                        okText: "Có",
                                        cancelText: 'Không'
                                    });
                                }}
                            >
                                <DeleteOutlined />
                            </div>
                        </Tooltip>
                    }
                </Space>
        },
    ];
    const [columnsFilter, setColumnsFilter] = useState<ColumnsType<News>>(columns);

    useEffect(() => {
        dispatch(fetchNewsCategory({
            // parentId: -1,
            parentId: "-1",
            status: STATUS_PUBLIC,
            type: 0
        }))
    }, [])

    useEffect(() => {
        setColumnsFilter(columns)
        if (category === "0") { // all
            setColumnsFilter(columns)
        } else {
            const newColumns = columns.filter(o => {
                return o.key !== "category"
            })
            setColumnsFilter(newColumns)
        }
    }, [newsCategory, category])

    useEffect(() => {
        if (category === "0") { // all
            dispatch(fetchNewsList({
                pageSize,
                offset: (page * pageSize),
                status: status,
                contentType: CONTENT_TYPE_NORMAL
            }))
        } else {
            // filter
            dispatch(fetchNewsListByCategory({
                categoryId: category,
                limit: pageSize,
                offset: (page * pageSize),
                status: status
            }))
        }
    }, [page, pageSize])

    useEffect(() => {
        if (isErrorNews) {
            notification.error({
                message: 'Không tải được danh sách tin tức',
                duration: 1.5
            })
            dispatch(resetIsErrorNews())
        }
        if (isErrorCategory) {
            notification.error({
                message: 'Không tải được danh sách danh mục tin tức',
                duration: 1.5
            })
            dispatch(resetIsErrorNewsCategory())
        }
    }, [isErrorNews, isErrorCategory])

    useEffect(() => {
        if (postDetailUpdate) {
            form.setFieldsValue({
                title: postDetailUpdate.title,
                slug: postDetailUpdate.slug,
                shortDes: postDetailUpdate.shortDes,
                status: postDetailUpdate.status,
                // inCategories: categoryInNews.length ? categoryInNews.map(o => o.id) : postDetailUpdate?.inCategories
                //     ?.filter(item => newsCategory.find(category => Number(category.id) === item.categoryId)) // loại bỏ trường hợp thuộc category đã xóa
                inCategories: categoryInNews.length ? categoryInNews.map(o => o._id) : postDetailUpdate?.inCategories
                    ?.filter(item => newsCategory.find(category => category._id === item.categoryId)) // loại bỏ trường hợp thuộc category đã xóa
                    .map(item => item.categoryId)
            })
        }
    }, [postDetailUpdate, categoryInNews])

    const onDelete = async (values: News) => {
        const response = await apiUpdateNews({
            reqBody: {
                ...values,
                status: STATUS_DELETED
            }
        })

        if (response.status === RESPONSE_SUCCESS) {
            setStatus(-1)
            dispatch(fetchNewsList({
                pageSize,
                offset: (page * pageSize),
                status: -1,
                contentType: CONTENT_TYPE_NORMAL
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
                    writer: values?.writer ?? "",
                    status: values?.status,
                    contentType: CONTENT_TYPE_NORMAL
                }
                if (values?.createDate) {
                    Object.assign(bodyReq, { createDate: moment(values?.createDate).valueOf() })
                }
                // const categorysBefore = postDetailUpdate?.inCategories?.map(item => item.categoryId) || []
                const categorysBefore = categoryInNews.length ? categoryInNews.map(item => item._id) : postDetailUpdate?.inCategories?.map(item => item.categoryId) || []
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
                            // id: postDetailUpdate?.id,
                            _id: postDetailUpdate?._id,
                            ...bodyReq
                        }
                    })
                } else {
                    result = await apiUpdateNews({
                        reqBody: bodyReq
                    })
                }
                if (result.status === RESPONSE_SUCCESS) {
                    message.success("Cập nhật tin tức thành công")
                    // cập nhật danh mục cha
                    const reqQuery = {
                        // newsId: result?.data?.id,
                        newsId: result?.data?._id,
                        adds: categoryAdds,
                        removes: categoryRemoves,
                    }
                    const createCategoryRes = await apiAddOrRemoveCategory({ reqQuery })
                    if (createCategoryRes.status === RESPONSE_SUCCESS) {
                        message.success("Cập nhật danh mục tin tức thành công!")
                    } else {
                        message.error("Cập nhật danh mục tin tức thất bại!")
                    }
                    descRef?.current?.setContent('')
                } else {
                    message.error("Cập nhật tin tức thất bại!")
                    descRef?.current?.setContent('')
                }
                dispatch(fetchNewsList({
                    pageSize,
                    offset: (page * pageSize),
                    status: status,
                    contentType: CONTENT_TYPE_NORMAL
                }))
            })
            .catch((infor) => {
                console.log("validate Fields:", infor)
            })
    }

    const onSearch = (values: any) => {
        const _values = NonAccentVietnamese(values.toLocaleLowerCase())
        setSearchValue(_values)
    }

    const handlePagination = (page: number, pageSize?: number | undefined) => {
        setPageDefault(page)
        setPage(page - 1)
        setPageSize(pageSize || PAGE_SIZE)
    }

    const checkSlugIsExist = async (slug: string) => {
        if (slug) {
            const data = await apiGetNewsBySlug({ slug })
            if (data.status === RESPONSE_SUCCESS) {
                // check trường hợp update
                // const id = data.data?.id;
                // return id !== postDetailUpdate?.id && data.data !== null
                const _id = data.data?._id;
                return _id !== postDetailUpdate?._id && data.data !== null
            } else {
                message.error('Không check được danh sách slug')
                return true
            }
        }
    }

    const handleChangeStatus = (value: number) => {
        setStatus(value)
        if (category === "0") { // all
            dispatch(fetchNewsList({
                pageSize,
                offset: 0,
                status: value,
                contentType: CONTENT_TYPE_NORMAL
            }))
        } else {
            // filter
            dispatch(fetchNewsListByCategory({
                categoryId: category,
                limit: pageSize,
                offset: 0,
                status: value
            }))
        }
    }

    const handleChangeCategory = (value: string) => {
        setPageDefault(1)
        setCategory(value)
        if (value === "0") { // all
            dispatch(fetchNewsList({
                pageSize,
                offset: 0,
                status: status,
                contentType: CONTENT_TYPE_NORMAL
            }))
        } else {
            // filter
            dispatch(fetchNewsListByCategory({
                categoryId: value,
                limit: pageSize,
                offset: 0,
                status: status
            }))
        }
    }

    const options = newsCategory.map(item => {
        return {
            value: item._id || "0",
            label: item.title
        }
    })

    return (
        <>
            <div id="posts">
                <Space>
                    <Button type="primary" onClick={() => {
                        setIsModalOpen(true)
                        setPostDetailUpdate(undefined)
                        form.resetFields()
                    }}>TẠO TIN TỨC</Button>
                    <div className="posts-actions">
                        <Space>
                            <Input placeholder="Tìm kiếm tin tức" onChange={((e) => onSearch(e.target.value))} style={{ width: 200 }} />
                            <Space size='small' style={{
                                marginLeft: "50px"
                            }}>
                                <label>Chọn trạng thái : </label>
                                <Select
                                    value={status}
                                    style={{ width: '130px' }}
                                    onChange={handleChangeStatus}
                                    options={statuses}
                                />
                            </Space>
                            <Space size='small' style={{
                                marginLeft: "50px",
                            }}>
                                <label>Chọn danh mục : </label>
                                <Select
                                    value={category}
                                    style={{ width: '200px' }}
                                    onChange={handleChangeCategory}
                                    options={[
                                        {
                                            value: "0",
                                            label: 'All'
                                        },
                                        ...options
                                    ]}
                                />
                            </Space>
                        </Space>
                    </div>
                </Space>

                <div className="posts-body">
                    <div className="list-post">
                        <div style={{ display: 'flex' }}>
                            <h2 className="list-post-title">
                                Danh sách tin tức
                            </h2>
                        </div>
                        <Table
                            bordered
                            scroll={{ y: 'calc(100vh - 330px)' }}
                            loading={isLoading}
                            columns={columnsFilter}
                            dataSource={newsListData.filter((item, index) => {
                                const itemName = NonAccentVietnamese(item.title?.toLocaleLowerCase())
                                return itemName?.includes(searchValue)
                            })}
                            pagination={{
                                current: pageDefault,
                                defaultPageSize: PAGE_SIZE,
                                showSizeChanger: true,
                                onChange: handlePagination,
                                pageSizeOptions: [`${PAGE_SIZE - 5}`, `${PAGE_SIZE}`, `${PAGE_SIZE + 5}`, `${PAGE_SIZE + 10}`],
                                total: newsListTotal,
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tin tức`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Modal add Posts */}
            <Modal
                maskClosable={false}
                centered
                title={postDetailUpdate ? 'Sửa tin tức' : 'Tạo tin tức'}
                visible={isModalOpen}
                onOk={onFinish}
                onCancel={() => {
                    setIsModalOpen(false)
                    setPostDetailUpdate(undefined)
                    setCategoryInNews([])
                    descRef?.current?.setContent('')
                }}
                width="100%" >
                <div className="posts-modal-add">
                    <Form
                        id="form"
                        form={form}
                        layout="vertical"
                        style={{ top: 0, height: "75vh", overflowY: "auto" }}
                    >
                        <Row gutter={{ xl: 24, md: 16, xs: 0 }}>
                            <Col xl={18} md={16} xs={24}>
                                <Form.Item name="title" label={<h3>{postDetailUpdate ? "Sửa tiêu đề" : "Thêm tiêu đề"}</h3>} rules={[
                                    { required: true, message: 'Vui lòng nhập thông tin!' },
                                ]} >
                                    <Input onChange={(e) => form.setFieldsValue({ ["slug"]: `${convertSlug(e.target.value)}` })} placeholder="Thêm tiêu đề" />
                                </Form.Item>
                                <Form.Item name="slug" label={<h3>{postDetailUpdate ? "Sửa Đường dẫn (slug)" : "Thêm Đường dẫn (slug)"}</h3>} rules={[
                                    { required: true, message: 'Vui lòng nhập thông tin!' },
                                    {
                                        validator: async (rule, value) => {
                                            const isExist = await checkSlugIsExist(value);
                                            return isExist ? Promise.reject(new Error('slug đã tồn tại')) : Promise.resolve()
                                        },
                                    }
                                ]} >
                                    <Input placeholder="Thêm đường dẫn" />
                                </Form.Item>
                                <Form.Item name="shortDes" label={<h3>{postDetailUpdate ? "Sửa mô tả ngắn" : "Thêm mô tả ngắn"}</h3>} rules={[
                                    { required: true, message: 'Vui lòng nhập thông tin!' },
                                ]} >
                                    <TextArea rows={4} placeholder="Mô tả ngắn" minLength={4} />
                                </Form.Item>
                                <Form.Item label={<h3>{postDetailUpdate ? "Sửa nội dung chi tiết" : "Thêm nội dung chi tiết"}</h3>} rules={[
                                    { required: true, message: 'Vui lòng nhập thông tin!' },
                                ]} >
                                    <TinymceEditor
                                        id="description"
                                        key="description"
                                        value={postDetailUpdate ? postDetailUpdate?.content : ''}
                                        editorRef={descRef}
                                        heightEditor="500px"
                                        baseFolder="news"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} md={8} xs={24}>
                                <div className="posts-modal-add-actions">
                                    <h3 className="posts-modal-add-actions-title">Thông tin cơ bản</h3>
                                    <div className="posts-modal-add-actions-body">
                                        <div className="posts-modal-add-actions-body-item">
                                            <Form.Item initialValue={postDetailUpdate ? postDetailUpdate.status : STATUS_PUBLIC} name="status" label={<h3>Trạng thái</h3>} rules={[
                                                { required: true, message: 'Vui lòng nhập thông tin!' },
                                            ]} >
                                                <Select
                                                    style={{ width: '100%' }}
                                                    options={statuses}
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="posts-modal-add-actions-body-item">
                                            <Form.Item label={<h3>Danh mục cha</h3>} name="inCategories" rules={[
                                                { required: true, message: 'Vui lòng chọn danh mục!' },
                                            ]} >
                                                <Select
                                                    mode="multiple"
                                                    placeholder="Chọn danh mục"
                                                    style={{ width: '100%' }}
                                                    options={options}
                                                // loading={loadingcategoryInNews}
                                                // disabled={loadingcategoryInNews}
                                                />
                                            </Form.Item>
                                        </div>
                                        <Form.Item
                                            label="Ngày tạo"
                                            name="createDate"
                                            rules={[
                                                // { required: true, message: 'nhập thời gian' }
                                            ]}
                                        >
                                            <DatePicker
                                                showTime
                                                placeholder="Chọn ngày tạo"
                                                format="HH:mm:ss DD-MM-YYYY"
                                                locale={locale}
                                                style={{
                                                    width: '100%'
                                                }}
                                            />
                                        </Form.Item>
                                        <div className="posts-modal-add-actions-body-item">
                                            <Form.Item initialValue={postDetailUpdate?.avatar} label={<h3>Ảnh bìa tin tức</h3>} name="avatar" >
                                                <UploadAvatarCrop
                                                    defaultUrl={postDetailUpdate?.avatar}
                                                    onChangeUrl={(value) => setDataupload(value)}
                                                    width={3}
                                                    height={2}
                                                    baseFolder='news'
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default NewsPageView;
