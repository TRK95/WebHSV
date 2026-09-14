import ModalEvents from "@/components/Events/ModalEvents";
import ModalMemberManage from "@/components/Events/ModalMemberManage";
import Event from "@/models/Event";
import { AppState } from "@/redux/reducer";
import { createOrUpdateEvents, loadEvents, resetNotification, setStatus } from "@/redux/reducer/eventSlice";
import { DOMAIN_ID_ALUMNI, PAGE_SIZE, statuses, STATUS_DELETED, STATUS_PRIVATE, STATUS_PUBLIC, DOMAIN_ID_CDBK } from "@/utils/contrants";
import NonAccentVietnamese from "@/utils/nonAccentVN";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, TeamOutlined } from "@ant-design/icons";
import { Badge, Button, Col, Input, Modal, notification, Row, Select, Space, Table, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import './style.scss';
import { IconExternalLink } from "@/assets/icon/externalLink";

interface DataType {
    key: string;
    title: string;
    criteria: string;
    slug: string;
    status: number;
    fromDate: number;
    toDate: number;
    data?: Event; // dataType
    createDate: number;
}

function EventsPage() {
    const dispatch = useDispatch();
    const descRef = useRef<any>();
    const [eventsForm] = useForm();

    const eventReducer = useSelector((state: AppState) => state.eventsReducer)
    const events = eventReducer.events;
    const isLoading = eventReducer.loading;
    const notifications = eventReducer.notifications;
    const total = eventReducer.total;
    const statusEvent = eventReducer.status

    const [dataView, setDataView] = useState<DataType[]>([])
    const [valueEdit, setValueEdit] = useState<Event | undefined>(undefined)
    const [valueModalMember, setValueModalMember] = useState<Event | undefined>(undefined)
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZE)
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [dataUpload, setDataupload] = useState<string>()
    const [isOpenModalMember, setIsOpenModalMember] = useState<boolean>(false)
    const [clubId, setClubId] = useState<string>('')

    useEffect(() => {
        return () => {
            dispatch(setStatus(STATUS_PUBLIC))
        }
    }, [])

    useEffect(() => {
        dispatch(loadEvents({
            limit: pageSize,
            offset: page * pageSize,
            status: statusEvent
        }))
    }, [page, pageSize])

    useEffect(() => {
        setDataView(events.map(o => convertDataToTable(o)))
    }, [events])

    useEffect(() => {
        if (notifications.message) {
            if (notifications.isError) {
                notification.error({
                    message: notifications.message,
                    duration: 1.5
                })
            } else {
                notification.success({
                    message: notifications.message,
                    duration: 1.5
                })
            }
            dispatch(resetNotification())
        }
    }, [notifications])

    const convertDataToTable = (value: Event) => {
        const { title, criteria, slug, status, fromDate, toDate, createDate } = value
        return {
            // key: `${value.id || ""}`,
            key: `${value._id || ""}`,
            title,
            criteria,
            slug,
            status,
            fromDate,
            toDate,
            data: value,
            createDate
        }
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
                if (isEdit && valueEdit) {
                    dispatch(createOrUpdateEvents({
                        ...rest,
                        // id: valueEdit.id,
                        _id: valueEdit._id,
                        avatar,
                        content,
                        clubId,
                        fromDate,
                        toDate,
                        registerFromDate,
                        registerToDate
                    }))
                } else {
                    dispatch(createOrUpdateEvents({
                        ...rest,
                        avatar,
                        content,
                        clubId,
                        fromDate,
                        toDate,
                        registerFromDate,
                        registerToDate
                    }))
                }
                setStatus(-1)
                // reset 
                handleCancel();
            })

    }

    const handleCancel = () => {
        // reset
        setIsOpenModal(false)
        eventsForm.resetFields()
        setValueEdit(undefined)
    }

    const handlePagination = (page: number, pageSize?: number | undefined) => {
        setPage(page - 1)
        setPageSize(pageSize || PAGE_SIZE)
    }

    const handleChangeStatus = (value: number) => {
        setPage(0)
        dispatch(setStatus(value))
        // filter
        dispatch(loadEvents({
            limit: pageSize,
            offset: (page * pageSize),
            status: value
        }))
    }

    const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = NonAccentVietnamese(e.target.value.toLocaleLowerCase())
        const newdata = events.filter((item) => NonAccentVietnamese(item?.title?.toLocaleLowerCase())?.includes(value))
        setDataView(newdata.map(o => convertDataToTable(o)))
    }

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

    const columns: ColumnsType<DataType> = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            width: '4%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên Sự Kiện',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
            render: (text, record) => {
                let isViewNews = false
                if (record.status === 1 || record.status === 3) {
                    isViewNews = true
                } else {
                    isViewNews = false
                }
                return (
                    <Row gutter={10} >
                        <Col span={21}>
                            {record.title}
                        </Col>
                        {
                            isViewNews === true &&
                            <Col span={3}>
                                <Tooltip title="View" >
                                    <div style={{ color: 'blue', cursor: 'pointer' }}
                                        onClick={() => { window.open(`${process.env.API_ENDPOINT_REDIRECT}/su-kien/tat-ca-su-kien/${record.slug}`, '_blank') }}
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
            width: '20%'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text: number) => {
                return (
                    <Space size='small' >
                        <Badge status={text === STATUS_PUBLIC ? 'success' : (text === STATUS_PRIVATE ? 'warning' : "error")} />
                        < div > {statuses.find(o => o.value === text)?.label} </div>
                    </Space>
                )
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createDate',
            key: 'createDate',
            render: (text, row) => (
                <span>{text > 0 ? moment(text).format('HH:mm:ss DD/MM/YYYY') : ""} </span>
            )
        },
        {
            title: 'Số lượng tham gia',
            dataIndex: 'data',
            key: 'data',
            width: '8%',
            align: 'center',
            render: (text: Event, row) => (
                <b style={{ fontSize: '15px' }
                }> {text?.memNum} </b>
            )
        },
        {
            title: 'Action',
            dataIndex: 'data',
            key: 'data',
            width: '10%',
            align: 'center',
            render: (text: Event, record) => (
                <Space size='middle' style={{ fontSize: '20px' }
                }>
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
                                setValueEdit(text)
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
                                            dispatch(createOrUpdateEvents({
                                                ...text,
                                                status: STATUS_DELETED
                                            }))
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
            )
        }
    ];

    return (
        <div>
            <div style={{ overflow: 'hidden' }}>
                <Row gutter={{ xl: 48, md: 16, xs: 0 }} style={{ marginBottom: 10 }}>
                    <Col xl={8} md={8} xs={24} >
                        <label>Trạng thái: </label>
                        < Select
                            value={statusEvent}
                            style={{ width: '100%' }}
                            onChange={handleChangeStatus}
                            options={statuses}
                        />
                    </Col>
                    < Col xl={8} md={8} xs={24} >
                        <label style={{ display: 'block' }}> Tìm kiếm: </label>
                        < Input.Search placeholder="Tìm kiếm sự kiện" onChange={handleSearch} style={{ width: '100%' }} />
                    </Col>
                    < Col xl={8} md={8} xs={24} style={{ position: 'relative' }}>
                        <Button
                            type='primary'
                            onClick={() => {
                                setIsOpenModal(true)
                                setIsEdit(false)
                                setValueEdit(undefined)
                                eventsForm.resetFields()
                            }}
                            style={{ position: 'absolute', right: 24, bottom: 0 }}
                        >
                            Tạo Sự Kiện
                        </Button>
                    </Col>
                </Row>
            </div>
            < Typography.Title level={4} > Danh sách sự kiện </Typography.Title>
            < Table
                loading={isLoading}
                scroll={{ y: 'calc(100vh - 360px)' }}
                sticky
                bordered
                columns={columns}
                dataSource={dataView}
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: PAGE_SIZE,
                    pageSizeOptions: [`${PAGE_SIZE - 5}`, `${PAGE_SIZE}`, `${PAGE_SIZE + 5}`, `${PAGE_SIZE + 10}`],
                    defaultCurrent: 1,
                    onChange: handlePagination,
                    total
                }}
                rowClassName={(record, index) => (handleMakeColor(record.fromDate, record.toDate))}
            />
            < ModalEvents
                visible={isOpenModal}
                maskClosable={false}
                eventsForm={eventsForm}
                width='100%'
                title={isEdit ? 'Sửa sự kiện' : 'Tạo sự kiện'}
                cancelText='Hủy'
                okText={isEdit ? 'Cập nhật' : 'Tạo'}
                onOk={handleOk}
                onCancel={handleCancel}
                style={{ top: 20 }}
                value={valueEdit}
                descRef={descRef}
                dataUpload={dataUpload}
                setDataupload={setDataupload}
                isEvent={true}
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
                    setValueEdit(undefined)
                    setIsOpenModalMember(false)
                    dispatch(loadEvents({
                        limit: pageSize,
                        offset: page * pageSize,
                        status: statusEvent
                    }))
                }}
                onCancel={() => {
                    setValueEdit(undefined)
                    setIsOpenModalMember(false)
                }}
            />}
        </div>
    );
}

export default EventsPage;