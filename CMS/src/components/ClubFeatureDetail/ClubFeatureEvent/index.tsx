
import NewsInCategory from '@/models/NewsInCategory';
import NewsModel from '@/models/NewsModel';
import { AppState } from '@/redux/reducer';
import { PAGE_SIZE, RESPONSE_FAILED, RESPONSE_SUCCESS, statuses, STATUS_DELETED, STATUS_PRIVATE, STATUS_PUBLIC, STATUS_OPEN, CONTENT_TYPE_NORMAL, STATUS_REGISTER_JOIN } from '@/utils/contrants';
import NonAccentVietnamese from '@/utils/nonAccentVN';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { Badge, Button, Col, Form, Input, message, Modal, notification, Row, Select, Space, Table, Tooltip, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconExternalLink } from '@/assets/icon/externalLink';
import './style.scss';
import ClubFeatureChild from '@/models/ClubFeatureChild';
import { createClubFeatureDetail, loadClubFeatureDetailByFeatureId, setIsLoading } from '@/redux/reducer/clubFeatureDetailSlice';
import ClubFeatureDetail from '@/models/ClubFeatureDetail';

import { resetNotification } from '@/redux/reducer/clubCategorySlice';
import ModalEvents from './Modals/ModalEvents';
import { useForm } from 'antd/lib/form/Form';
import { apiUpdateClubFeatureDetail } from '@/api/clubFeatureApi';
import ModalMemberManage from './Modals/ModalMemberManage';

export const TYPE_SORT_OLDEST = 0
export const TYPE_SORT_NEWEST = 1

export type News = NewsModel & {
    key?: React.Key,
    inCategories?: Array<NewsInCategory>
}

function ClubFeatureEvent(props: { feature: ClubFeatureChild }) {
    const { feature } = props
    const descRef = useRef<any>();
    const dispatch = useDispatch()
    const [eventsForm] = useForm();

    const { userInfo } = useSelector((state: AppState) => state.userInfoReducer)
    const { clubFeatureDetails, notifications, loading, featureListTotal } = useSelector((state: AppState) => state.clubFeatureDetailsReducer)

    const [searchValue, setSearchValue] = useState('')
    const [postDetailUpdate, setPostDetailUpdate] = useState<ClubFeatureDetail | undefined>(undefined)
    const [valueModalMember, setValueModalMember] = useState<ClubFeatureDetail | undefined>(undefined)
    const [isOpenModalMember, setIsOpenModalMember] = useState<boolean>(false)
    const [page, setPage] = useState<number>(0);
    const [pageDefault, setPageDefault] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE)
    const [status, setStatus] = useState<number>(STATUS_PUBLIC)
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [dataUpload, setDataupload] = useState<string>()

    const handleMakeColor = (fromDate: number, toDate: number) => {
        const dateNow = Date.now();

        if (dateNow < fromDate) {
            // chưa diễn ra
            return 'event_date--yellow'
        }
        if (dateNow > fromDate && dateNow < toDate) {
            // đang diễn ra
            return 'event_date--green'
        }
        if (dateNow > fromDate && dateNow > toDate) {
            // kết thúc
            return 'event_date--red'
        }
        return ""
    }

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
            title: 'Bắt Đầu',
            dataIndex: 'fromDate',
            key: 'fromDate',
            render: (date: number) => (
                <span>{date > 0 ? moment(date).format('HH:mm:ss DD/MM/YYYY') : ""} </span>
            )
        },
        {
            title: 'Kết Thúc',
            dataIndex: 'toDate',
            key: 'toDate',
            render: (date: number) => (
                <span>{date > 0 ? moment(date).format('HH:mm:ss DD/MM/YYYY') : ""} </span>
            )
        },
        {
            title: 'Đường dẫn',
            dataIndex: 'slug',
            key: 'slug',
            width: '15%',
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
            title: 'Số lượng tham gia',
            dataIndex: 'memNum',
            key: 'memNum',
            width: '8%',
            align: 'center',
            render: (text: ClubFeatureDetail, row) => (
                <b style={{ fontSize: '15px' }
                }> {text} </b>
            )
        },
        {
            title: 'Hành động',
            key: 'operation',
            fixed: 'right',
            align: 'center',
            render: (text, record) =>
                <Space size='middle' style={{ fontSize: '20px' }}>
                    <Tooltip title="Quản lý" >
                        <div
                            style={
                                {
                                    color: '#185fff',
                                    cursor: 'pointer'
                                }
                            }
                            onClick={() => {
                                setValueModalMember(text)
                                setIsOpenModalMember(true)
                            }}
                        >
                            <TeamOutlined />
                        </div>
                    </Tooltip>
                    < Tooltip title="Chỉnh sửa" >
                        <div
                            style={
                                {
                                    color: '#ff8b18',
                                    cursor: 'pointer'
                                }
                            }
                            onClick={() => {
                                setIsEdit(true)
                                setPostDetailUpdate(text)
                                setIsOpenModal(true)
                                eventsForm.resetFields()
                            }}
                        >
                            <EditOutlined />
                        </div>
                    </Tooltip>

                    {
                        text.status !== STATUS_DELETED &&
                        <Tooltip title="Xóa" >
                            <div style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => {
                                    Modal.confirm({
                                        title: 'Bạn có muốn xóa sự kiện?',
                                        icon: <ExclamationCircleOutlined />,
                                        content: `${text.title}`,
                                        onOk() {
                                            onDelete(record)
                                        },
                                        okType: 'danger',
                                        okText: "Có",
                                        cancelText: 'Không'
                                    });
                                }
                                }
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
            eventsForm.setFieldsValue({
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

    const onSearch = (values: any) => {
        const _values = NonAccentVietnamese(values.toLocaleLowerCase())
        setSearchValue(_values)
    }

    const handleOk = () => {
        eventsForm.validateFields()
            .then((value: any) => {
                const { time, timeRegister, ...rest } = value
                const avatar = dataUpload ?? ""
                const content = descRef?.current?.getContent()
                const fromDate = time[0].valueOf()
                const toDate = time[1].valueOf()
                let registerFromDate = 0
                let registerToDate = 0

                if (timeRegister) {
                    registerFromDate = timeRegister[0].valueOf()
                    registerToDate = timeRegister[1].valueOf()
                }

                // create / update
                if (isEdit && postDetailUpdate) {
                    dispatch(createClubFeatureDetail({
                        ...rest,
                        // id: valueEdit.id,
                        _id: postDetailUpdate._id,
                        clubId: feature?.parentId,
                        featureId: feature?._id,
                        status: 1,
                        createDate: postDetailUpdate?.createDate ? moment(postDetailUpdate?.createDate).valueOf() : undefined,
                        contentType: 3,
                        avatar,
                        content,
                        fromDate,
                        toDate,
                        registerFromDate,
                        registerToDate,
                    }))
                } else {
                    dispatch(createClubFeatureDetail({
                        ...rest,
                        clubId: feature?.parentId,
                        featureId: feature?._id,
                        avatar,
                        content,
                        fromDate,
                        toDate,
                        registerFromDate,
                        registerToDate,
                        status: 1,
                        contentType: 3,
                        memNum: 0
                    }))
                }
                dispatch(loadClubFeatureDetailByFeatureId({
                    limit: pageSize,
                    offset: (page * pageSize),
                    status: 1,
                    featureId: feature?._id ?? ""
                }));
                setStatus(1)
                // reset 
                handleCancel();
            })

    }

    const handleCancel = () => {
        // reset
        setIsOpenModal(false)
        eventsForm.resetFields()
        setPostDetailUpdate(undefined)
    }

    const handlePagination = (page: number, pageSize?: number | undefined) => {
        setPageDefault(page)
        setPage(page - 1)
        setPageSize(pageSize || PAGE_SIZE)
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
                        setIsOpenModal(true)
                        setPostDetailUpdate(undefined)
                        eventsForm.resetFields()
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
                            rowClassName={(record, index) => (handleMakeColor(record.fromDate, record.toDate))}
                        />
                    </div>
                </div>
            </div>

            {/* Modal add Posts */}
            < ModalEvents
                feature={feature}
                visible={isOpenModal}
                maskClosable={false}
                eventsForm={eventsForm}
                width='100%'
                title={isEdit ? `Sửa ${feature?.title}` : `Tạo ${feature?.title}`}
                cancelText='Hủy'
                okText={isEdit ? 'Cập nhật' : 'Tạo'}
                onOk={handleOk}
                onCancel={handleCancel}
                style={{ top: 20 }}
                value={postDetailUpdate}
                descRef={descRef}
                dataUpload={dataUpload}
                setDataupload={setDataupload}
                clubId={feature?.parentId}
            />

            {valueModalMember && <ModalMemberManage
                visible={isOpenModalMember}
                value={valueModalMember}
                title={`Sự kiện ${valueModalMember?.title}`}
                width='100%'
                okText='Cập nhật'
                cancelText='Hủy'
                maskClosable={false}
                style={{ top: 20 }}
                onOk={() => {
                    setPostDetailUpdate(undefined)
                    setIsOpenModalMember(false)
                    dispatch(loadClubFeatureDetailByFeatureId({
                        limit: pageSize,
                        offset: (page * pageSize),
                        status: status,
                        featureId: feature?._id ?? ""
                    }))
                }}
                onCancel={() => {
                    setPostDetailUpdate(undefined)
                    setIsOpenModalMember(false)
                }}
            />}
        </>
    )
}

export default ClubFeatureEvent;