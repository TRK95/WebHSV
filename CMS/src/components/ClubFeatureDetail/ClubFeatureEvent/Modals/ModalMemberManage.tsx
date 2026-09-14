import EventMember from "@/models/EventMember";
import { PAGE_SIZE, RESPONSE_MEMBER_EXIST, RESPONSE_SUCCESS, statusesMember, STATUS_ACCEPTED, STATUS_DELETED, STATUS_WAITING } from "@/utils/contrants";
import { InfoCircleOutlined, MinusCircleOutlined, UndoOutlined, UserOutlined } from "@ant-design/icons";
import { AutoComplete, Avatar, Button, Image, Input, Modal, ModalProps, notification, Popconfirm, Space, Table, Tabs, Tooltip, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { PopupNoteUser } from "@/components/PopupNoteUser";
import { apiGetUserInfoByUserName } from "@/api/userInfoApi";
import FeatureDetailMember from "@/models/FeatureDetailMember";
import ClubFeatureDetail from "@/models/ClubFeatureDetail";
import { apiApproveClubFeature, apiGetMemberFeatureDetail, apiJoinClubFeature } from "@/api/clubFeatureApi";
import { apiSearchStudent } from "@/api/searchStudentApi";
import { UserInfoI } from "@/models/UserInfo";

interface DataType {
    key: string;
    name: string;
    birth: number;
    phoneNumber: string;
    status: number;
    joinDate: number;
    student: any;
    value?: FeatureDetailMember;
}

const ModalMemberManage = (props: ModalProps & {
    value: ClubFeatureDetail
}) => {
    const { value, visible, ...rest } = props
    const [dataView, setDataView] = useState<DataType[]>([])
    const [dataFillter, setDataFillter] = useState<DataType[]>([]);
    const [isOpenPreviewImg, setIsOpenPreviewImg] = useState(false);
    const [srcImg, setSrcImg] = useState<string>('');
    const [indexApprove, setIndexApprove] = useState<number>(-1);
    const [dataUserSearch, setDataUserSearch] = useState<any[]>([]);
    // const [dataUserSearch, setDataUserSearch] = useState<UserInfo | null>();
    const [userJoinEvent, setUserJoinClub] = useState<UserInfoI | null>(null);
    const [valueSearch, setValueSearch] = useState<string>('')
    const [isOpenNote, setIsOpenNote] = useState<boolean>(false)
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [loadingSearch, setLoadingSearch] = useState<boolean>(false)
    const [loadingJoin, setLoadingJoin] = useState<boolean>(false);
    const [loadingApprove, setLoadingApprove] = useState<boolean>(false);
    const [loadingClubMembers, setLoadingClubMembers] = useState<boolean>(false);
    const [key, setKey] = useState<number>(-1)
    const [member, setMember] = useState<FeatureDetailMember>()

    const status = [
        {
            value: -1,
            label: 'All'
        },
        ...statusesMember
    ]

    useEffect(() => {
        setValueSearch('')
        if (visible) {
            loadMemberEvents(100, 0);
        }
    }, [visible])

    useEffect(() => {
        handleFillter(`${key}`)
    }, [dataView])

    const handleFillter = useCallback((keys: string) => {
        const value = Number(keys);
        if (value !== key) {
            setPage(1)
        }
        setKey(value)
        if (value !== -1) {
            const newData = dataView.filter(data => data.status === value)
            setTotal(newData.length)
            setDataFillter(newData)
        } else {
            setDataFillter(dataView)
            setTotal(dataView.length)
        }
    }, [dataView])

    const loadMemberEvents = async (limit: number, offset: number) => {
        try {
            setLoadingClubMembers(true)
            // const data = await apiGetMemberEvent({
            const data = await apiGetMemberFeatureDetail({
                // eventId: value?.id || 0,
                featureDetailId: value?._id || "0",
                limit,
                offset
            })

            if (data.status === RESPONSE_SUCCESS) {
                setDataView(data.data.map(o => convertToTable(o)))
            } else {
                notification.error({
                    message: 'Không tải được danh sách thành viên',
                    duration: 1.5
                })
            }
            setTotal(data.total || 0)
        } catch (error) {
            notification.error({
                message: 'Lỗi server , không tải được danh sách thành viên',
                duration: 1.5
            })
            setTotal(0)
        } finally {
            setLoadingClubMembers(false)
        }
    }

    const convertToTable = (data: FeatureDetailMember) => {
        // const { id, joinDate, status, student } = data
        const { _id, joinDate, status, student } = data
        return {
            // key: `${id}`,
            key: `${_id}`,
            name: student?.fullName,
            birth: student?.birthdate,
            phoneNumber: student?.phoneNumber,
            status,
            joinDate,
            student,
            value: data,
        }
    }

    const onSearch = async (value: string) => {
        if (value?.trim()) {
            setLoadingSearch(true)
            const datas = await apiSearchStudent({
                keyword: value?.trim(),
                //     token: 'PNiIwCMI8VrDA16n3IQj-ALUMI',
                //     sessionId: window.localStorage.getItem('sessionId') || ''
            })
            // const datas = await apiGetUserInfoByUserName({ reqBody: { name: value?.trim() } })
            setLoadingSearch(false)
            if (datas.length > 0)
                setDataUserSearch(datas)
            else
                notification.error({
                    message: "Không thể tìm thấy sinh viên",
                    duration: 1.5
                })
        } else {
            setDataUserSearch([])
            setUserJoinClub(null)
        }
    }

    const onSelect = (value: string, data: any) => {
        setUserJoinClub({
            userId: data.user.studentId,
            status: data.user.status,
            fullName: data.user.fullName,
            birthdate: data.user.birthdate,
            className: data.user.className,
            schoolName: data.user.schoolName,
            year: data.user.year,
            phoneNumber: data.user.phoneNumber,
            email: data.user.email,
            studentYear: data.user.studentYear,
            avatarUrl: data.user.avatarUrl,
            homeProvince: data.user.homeProvince
        })
        setDataUserSearch([])
    }

    const handlePagination = (page: number, pageSize?: number | undefined) => {
        setPage(page)
    }

    const handleAddMember = async () => {
        setLoadingJoin(true)
        // if (userJoinEvent && value?.id) {
        if (userJoinEvent && value?._id) {
            try {
                const data = await apiJoinClubFeature({
                    featureDetailId: value?._id || "0",
                    note: '',
                    status: 1
                }, { user: userJoinEvent })
                if (data.status === RESPONSE_SUCCESS) {
                    notification.success({
                        message: 'Thêm thành viên thành công',
                        duration: 1.5
                    })
                } else if (data.status === RESPONSE_MEMBER_EXIST) {
                    notification.error({
                        message: 'Người dùng đã được thêm trước đó',
                        duration: 1.5
                    })
                } else {
                    notification.error({
                        message: 'Thêm người dùng không thành công',
                        duration: 1.5
                    })
                }
            } catch (error) {
                notification.error({
                    message: 'Thêm người dùng không thành công , lỗi server',
                    duration: 1.5
                })
            } finally {
                loadMemberEvents(100, 0)
            }
        } else {
            notification.error({
                message: 'Bạn phải chọn người dùng trước',
                duration: 1.5
            })
        }
        setLoadingJoin(false)
    }

    const handleCloseModalNote = () => {
        setIsOpenNote(false)
    }

    const handleAcceptMember = async (member: FeatureDetailMember | undefined, index: number) => {
        setIndexApprove(index)
        setLoadingApprove(true)
        // if (value?.id && member?.userId) {
        if (value?._id && member?.userId) {
            try {
                const data = await apiApproveClubFeature({
                    // eventId: value?.id,
                    featureDetailId: value?._id,
                    userId: member?.userId,
                    status: STATUS_ACCEPTED
                })
                if (data.status === 2) {
                    notification.error({
                        message: 'Không tồn tại',
                        duration: 1.5
                    })
                } else if (data.status === RESPONSE_SUCCESS) {
                    notification.success({
                        message: 'Duyệt thành công',
                        duration: 1.5
                    })
                } else {
                    notification.error({
                        message: 'Lỗi, không duyệt được',
                        duration: 1.5
                    })
                }
            } catch (error) {
                notification.error({
                    message: 'Lỗi server, không duyệt được thành viên'
                })
            } finally {
                loadMemberEvents(100, 0)
            }
        }
        setLoadingApprove(false)
    }

    const handleRemoveMember = async (member: FeatureDetailMember | undefined) => {
        setLoadingClubMembers(true)
        // if (value?.id && member?.userId) {
        if (value?._id && member?.userId) {
            try {
                const data = await apiApproveClubFeature({
                    // eventId: value?.id,
                    featureDetailId: value?._id,
                    userId: member?.userId,
                    status: STATUS_DELETED
                })
                if (data.status === 2) {
                    notification.error({
                        message: 'Không tồn tại',
                        duration: 1.5
                    })
                } else if (data.status === RESPONSE_SUCCESS) {
                    notification.success({
                        message: 'Xoá thành công',
                        duration: 1.5
                    })
                } else {
                    notification.error({
                        message: 'Lỗi, không xoá được',
                        duration: 1.5
                    })
                }
            } catch (error) {
                notification.error({
                    message: 'Lỗi server, không xoá được thành viên'
                })
            } finally {
                loadMemberEvents(100, 0)
            }
        }
        setLoadingClubMembers(false)
    }

    const handleUndoMember = async (member: FeatureDetailMember | undefined) => {
        setLoadingClubMembers(true)
        // if (value?.id && member?.userId) {
        if (value?._id && member?.userId) {
            try {
                const data = await apiApproveClubFeature({
                    // eventId: value?.id,
                    featureDetailId: value?._id,
                    userId: member?.userId,
                    status: STATUS_WAITING
                })
                if (data.status === 2) {
                    notification.error({
                        message: 'Không tồn tại',
                        duration: 1.5
                    })
                } else if (data.status === RESPONSE_SUCCESS) {
                    notification.success({
                        message: 'Hoàn tác phê duyệt thành công',
                        duration: 1.5
                    })
                } else {
                    notification.error({
                        message: 'Lỗi, không hoàn tác phê duyệt được',
                        duration: 1.5
                    })
                }
            } catch (error) {
                notification.error({
                    message: 'Lỗi server, không hoàn tác phê duyệt được thành viên'
                })
            } finally {
                loadMemberEvents(100, 0)
            }
        }
        setLoadingClubMembers(false)
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'STT',
            key: 'index',
            width: '5%',
            align: 'center',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Họ tên',
            key: 'name',
            dataIndex: 'student',
            width: '10%',
            render: (text: any) => (
                <Space size='small'>
                    {text?.avatarUrl
                        ? <div
                            style={{
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setIsOpenPreviewImg(true)
                                setSrcImg(text?.avatarUrl)
                            }}
                        >
                            <Avatar size='small' src={text?.avatarUrl} />
                        </div>
                        : <Avatar size='small' icon={<UserOutlined />} />
                    }
                    <div>{text?.fullName || 'không có'}</div>
                </Space>
            )
        },
        {
            title: 'MSSV',
            key: 'mssv',
            dataIndex: 'student',
            width: '7%',
            render: (text: any) => (
                <div>{text?.userId}</div>
            )
        },
        {
            title: 'Ngày sinh',
            key: 'birth',
            dataIndex: 'birth',
            width: '6%',
            render: (text: number) => (
                <div>{moment(text).format("DD/MM/YYYY")}</div>
            )
        },
        {
            title: 'Số điện thoại',
            key: 'phoneNumber',
            dataIndex: 'phoneNumber',
            width: '7%',
            render: (text) => (<Typography.Paragraph style={{ marginBottom: 0 }} copyable={{ tooltips: false }}>{text}</Typography.Paragraph>)
        },
        {
            title: 'Lớp',
            key: 'class',
            dataIndex: 'student',
            width: '10%',
            render: (text: any) => (
                <div>{text?.className}</div>
            )
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'student',
            width: '13%',
            render: (text: any) => (
                <div>{text?.email}</div>
            )
        },
        {
            title: 'Trạng thái',
            key: 'value',
            dataIndex: 'value',
            width: '12%',
            align: 'center',
            render: (text: FeatureDetailMember, _, index) => {
                const status = text?.status

                return (
                    <Space size='small' >
                        {status === STATUS_WAITING ? (
                            <Button
                                className='ClubMember__status ClubMember__status--waiting'
                                color="#5624d0"
                                onClick={async () => {
                                    setIndexApprove(index)
                                    handleAcceptMember(text, index)
                                }
                                }
                                loading={index === indexApprove && loadingApprove
                                }
                            > Duyệt </Button>
                        ) : (
                            <div className='ClubMember__status ClubMember__status--joined'
                            > Đã Tham Gia </div>
                        )}

                    </Space>
                )
            }
        },
        {
            title: 'Ngày tham gia',
            key: 'joinDate',
            dataIndex: 'joinDate',
            width: '10%',
            render: (text: number) => {
                return <i>{moment(text).format("DD/MM/YYYY")} </i>
            }
        },
        {
            title: 'Note',
            key: 'note',
            dataIndex: 'value',
            render: (value: EventMember) => {
                return <div>{value?.note || 'Không có'
                }</div>
            }
        },
        {
            title: 'Action',
            key: 'value',
            dataIndex: 'value',
            align: 'center',
            render: (text: FeatureDetailMember, record, index) => (
                <Space size="small" >
                    <Tooltip title='Thông tin' >
                        <Button
                            onClick={
                                () => {
                                    setIsOpenNote(true)
                                    setMember(text)
                                    setIndexApprove(index)
                                }
                            }
                            type='dashed'
                            style={{
                                color: "#ff8b18"
                            }
                            }
                        >
                            <InfoCircleOutlined />
                        </Button>
                    </Tooltip>
                    < Popconfirm
                        title="bạn có muốn xóa khỏi Sự kiện ?"
                        okText='có'
                        cancelText='Không'
                        onConfirm={() => {
                            setIndexApprove(-1)
                            handleRemoveMember(text)
                        }}
                    >
                        <Tooltip title='Loại khỏi Sự kiện' >
                            <Button
                                type='dashed'
                                style={{
                                    color: "red"
                                }}
                            >
                                <MinusCircleOutlined />
                            </Button>
                        </Tooltip>
                    </Popconfirm>
                    < Popconfirm
                        title="Bạn có muốn hủy bỏ phê duyệt?"
                        okText='có'
                        cancelText='Không'
                        onConfirm={() => {
                            setIndexApprove(0)
                            handleUndoMember(text)
                        }}
                    >
                        <Tooltip title='Hủy bỏ phê duyệt' >
                            <Button
                                type='dashed'
                                style={{
                                    color: "#A34343"
                                }}
                            >
                                <UndoOutlined />
                            </Button>
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        },

    ]
    return (
        <div>
            <Modal
                visible={visible}
                {...rest}
            >
                <Space size="small" style={{ marginBottom: '10px ' }}>
                    <Typography.Title level={3}> Danh sách đăng kí tham gia </Typography.Title>
                    < AutoComplete
                        options={dataUserSearch?.map(data => ({
                            key: `${data?.studentId}${Math.random()}`,
                            value: data.fullName,
                            label: `${data?.fullName} (${data?.studentId})`,
                            id: data?.studentId,
                            user: data
                        }))}
                        onSelect={onSelect}
                        // open={dataUserSearch.length > 0}
                        onChange={(value) => {
                            setValueSearch(value)
                            if (userJoinEvent) {
                                setUserJoinClub(null);
                            }
                            if (value === '') {
                                setDataUserSearch([])
                            }
                        }}
                        value={valueSearch}
                    >
                        <Input.Search
                            placeholder="Tìm kiếm sinh viên"
                            allowClear
                            onSearch={onSearch}
                            loading={loadingSearch}
                        />
                    </AutoComplete>
                    < Button
                        size="middle"
                        type="primary"
                        onClick={handleAddMember}
                        loading={loadingJoin}
                    >
                        Thêm
                    </Button>
                </Space>
                < Tabs onChange={handleFillter} type="card" defaultActiveKey={`${status[0].value}`}
                    tabBarGutter={5}
                    className='modalMember-tabs'
                >
                    {
                        status.map((st, index) => (
                            <Tabs.TabPane tab={st.label} key={st.value} >
                                <Table
                                    loading={loadingClubMembers}
                                    scroll={{ y: 'calc(100vh - 450px)' }}
                                    pagination={{
                                        pageSize: PAGE_SIZE,
                                        defaultCurrent: 1,
                                        onChange: handlePagination,
                                        total,
                                        current: page
                                    }}
                                    sticky size='middle' bordered columns={columns} dataSource={dataFillter} />
                            </Tabs.TabPane>
                        ))}
                </Tabs>
                < Image
                    width={200}
                    style={{ display: 'none' }}
                    src={srcImg}
                    preview={{
                        visible: isOpenPreviewImg,
                        src: srcImg,
                        onVisibleChange: value => {
                            setIsOpenPreviewImg(value);
                        },
                    }}
                />
            </Modal>
            < PopupNoteUser
                visible={isOpenNote}
                title='Giới thiệu'
                textNote={`${member?.note || 'Không có thông tin giới thiệu'}`}
                handleCloseModalNote={handleCloseModalNote}
                handleOkModalNote={() => {
                    handleCloseModalNote()
                    handleAcceptMember(member, indexApprove)
                }}
                status={member?.status}
            />
        </div>
    )
}

export default ModalMemberManage