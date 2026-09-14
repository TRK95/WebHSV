
import NewsInCategory from '@/models/NewsInCategory';
import NewsModel from '@/models/NewsModel';
import { AppState } from '@/redux/reducer';
import { PAGE_SIZE, RESPONSE_FAILED, RESPONSE_SUCCESS, statuses, STATUS_DELETED, STATUS_PRIVATE, STATUS_PUBLIC, STATUS_OPEN, CONTENT_TYPE_NORMAL, STATUS_REGISTER_JOIN } from '@/utils/contrants';
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
import TinymceEditor from '@/components/TinymceEditor';
import UploadAvatarCrop from '@/components/UploadAvatar';
import locale from 'antd/es/date-picker/locale/vi_VN'
import { IconExternalLink } from '@/assets/icon/externalLink';
import ClubFeatureChild from '@/models/ClubFeatureChild';
import { loadClubFeatureDetailByFeatureId, setIsLoading } from '@/redux/reducer/clubFeatureDetailSlice';
import ClubFeatureDetail from '@/models/ClubFeatureDetail';
import { resetNotification } from '@/redux/reducer/clubCategorySlice';
import { apiCreateClubFeatureDetail, apiGetClubFeatureDetailBySlug, apiUpdateClubFeatureDetail } from '@/api/clubFeatureApi';
import './style.scss';

export const TYPE_SORT_OLDEST = 0
export const TYPE_SORT_NEWEST = 1

export type News = NewsModel & {
    key?: React.Key,
    inCategories?: Array<NewsInCategory>
}

function ClubFeatureNews(props: { feature: ClubFeatureChild }) {
    const { feature } = props
    const descRef = useRef<any>();
    const dispatch = useDispatch()
    const [form] = Form.useForm();

    const { userInfo } = useSelector((state: AppState) => state.userInfoReducer)
    const { clubFeatureDetails, notifications, loading, featureListTotal } = useSelector((state: AppState) => state.clubFeatureDetailsReducer)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [postDetailUpdate, setPostDetailUpdate] = useState<ClubFeatureDetail | undefined>(undefined)
    const [page, setPage] = useState<number>(0);
    const [pageDefault, setPageDefault] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE)
    const [dataUpload, setDataupload] = useState<string>()
    const [status, setStatus] = useState<number>(STATUS_PUBLIC)

    const columns: ColumnsType<ClubFeatureDetail> = [
        {
            title: "STT",
            dataIndex: 'key',
            align: 'center',
            width: '5%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: '25%',
            render: (text: Array<ClubFeatureDetail>, record) => {
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
                        <Badge status='warning' />{'Riêng tư'}
                    </div>
                } else if (record.status === STATUS_PUBLIC) {
                    return <div style={{ display: 'flex' }}>
                        <Badge status='success' />{'Công khai'}
                    </div>
                } else if (record.status === STATUS_DELETED) {
                    return <div style={{ display: 'flex' }}>
                        <Badge status='error' />{'Đã xóa'}
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
                                        title: `Bạn có muốn xóa ${feature?.title}?`,
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

    useEffect(() => {
        if (feature && feature?._id) {
            dispatch(loadClubFeatureDetailByFeatureId({
                limit: pageSize,
                offset: (page * pageSize),
                status: status,
                featureId: feature._id
            }))
        }
    }, [feature, page, pageSize])

    useEffect(() => {
        if (notifications?.isError) {
            notification.error({
                message: `Không tải được danh sách ${feature?.title}`,
                duration: 1.5
            })
            dispatch(resetNotification())
        }
    }, [notifications])

    useEffect(() => {
        if (postDetailUpdate) {
            form.setFieldsValue({
                title: postDetailUpdate.title,
                slug: postDetailUpdate.slug,
                shortDes: postDetailUpdate.shortDes,
                status: postDetailUpdate.status,
            })
        }
    }, [postDetailUpdate])

    const onDelete = async (values: ClubFeatureDetail) => {
        const response = await apiUpdateClubFeatureDetail({
            ...values,
            status: STATUS_DELETED
        })

        if (response.status === RESPONSE_SUCCESS) {
            setStatus(-1)
            dispatch(loadClubFeatureDetailByFeatureId({
                limit: pageSize,
                offset: (page * pageSize),
                status: -1,
                featureId: feature._id ?? ""
            }))
            message.success(`Xóa ${feature?.title} thành công !`)
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

                const bodyReq = {
                    title: values?.title.trim() ?? "",
                    content: descRef?.current?.getContent().trim() ?? "",
                    shortDes: values?.shortDes.trim(),
                    avatar: dataUpload ?? "",
                    slug: values?.slug,
                    status: values?.status,
                    contentType: 1,
                    createDate: values?.createDate ? moment(values?.createDate).valueOf() : undefined,
                    featureId: feature?._id,
                    clubId: feature?.parentId ?? null,
                }

                // Ensure all required properties are set for ClubFeatureDetail
                const clubFeatureDetail = new ClubFeatureDetail({
                    ...bodyReq,
                    _id: postDetailUpdate?._id,  // retain existing ID if updating
                    criteria: postDetailUpdate?.criteria ?? "",
                    lastUpdate: Date.now(),
                    docUrl: postDetailUpdate?.docUrl ?? "",
                    fromDate: postDetailUpdate?.fromDate ?? 0,
                    toDate: postDetailUpdate?.toDate ?? 0,
                    settingStatus: postDetailUpdate?.settingStatus ?? STATUS_REGISTER_JOIN,
                    registerFromDate: postDetailUpdate?.registerFromDate ?? 0,
                    registerToDate: postDetailUpdate?.registerToDate ?? 0,
                });

                const result = await apiCreateClubFeatureDetail(
                    clubFeatureDetail
                );

                if (result.status === RESPONSE_SUCCESS) {
                    message.success(`Cập nhật ${feature?.title} thành công`);
                    descRef?.current?.setContent('');
                } else {
                    message.error(`Cập nhật ${feature?.title} thất bại!`);
                    descRef?.current?.setContent('');
                }
                dispatch(loadClubFeatureDetailByFeatureId({
                    limit: pageSize,
                    offset: (page * pageSize),
                    status: status,
                    featureId: feature._id ?? ""
                }));
            })
            .catch((info) => {
                console.log("validate Fields:", info);
            });
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
        if (slug && feature?._id) {
            const data = await apiGetClubFeatureDetailBySlug({ slug: slug, featureId: feature._id })
            if (data.status === RESPONSE_SUCCESS) {
                // check trường hợp update
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
        if (feature && feature?._id) {
            dispatch(loadClubFeatureDetailByFeatureId({
                limit: pageSize,
                offset: 0,
                status: value,
                featureId: feature._id
            }))
        }
    }

    return (
        <>
            <div id="posts">
                <Space>
                    <Button type="primary" onClick={() => {
                        setIsModalOpen(true)
                        setPostDetailUpdate(undefined)
                        form.resetFields()
                    }}>TẠO {feature?.title.toUpperCase()}</Button>
                    <div className="posts-actions">
                        <Space>
                            <Input placeholder={`Tìm kiếm ${feature?.title}`} onChange={((e) => onSearch(e.target.value))} style={{ width: 200 }} />
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
                        </Space>
                    </div>
                </Space>

                <div className="posts-body">
                    <div className="list-post">
                        <div style={{ display: 'flex' }}>
                            <h2 className="list-post-title">
                                Danh sách {feature?.title}
                            </h2>
                        </div>
                        <Table
                            bordered
                            scroll={{ y: 'calc(100vh - 330px)' }}
                            loading={loading}
                            columns={columns}
                            dataSource={clubFeatureDetails.filter((item, index) => {
                                const itemName = NonAccentVietnamese(item.title?.toLocaleLowerCase())
                                return itemName?.includes(searchValue)
                            })}
                            pagination={{
                                current: pageDefault,
                                defaultPageSize: PAGE_SIZE,
                                showSizeChanger: true,
                                onChange: handlePagination,
                                pageSizeOptions: [`${PAGE_SIZE - 5}`, `${PAGE_SIZE}`, `${PAGE_SIZE + 5}`, `${PAGE_SIZE + 10}`],
                                total: featureListTotal,
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} ${feature?.title}`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Modal add Posts */}
            <Modal
                maskClosable={false}
                centered
                title={postDetailUpdate ? `Sửa ${feature?.title}` : `Tạo ${feature?.title}`}
                visible={isModalOpen}
                onOk={onFinish}
                onCancel={() => {
                    setIsModalOpen(false)
                    setPostDetailUpdate(undefined)
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
                                <Form.Item label={<h3>{postDetailUpdate ? "Sửa mô tả chi tiết" : "Thêm mô tả chi tiết"}</h3>} rules={[
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
                                            <Form.Item initialValue={postDetailUpdate?.avatar} label={<h3>Ảnh bìa {feature?.title}</h3>} name="avatar" >
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

export default ClubFeatureNews;