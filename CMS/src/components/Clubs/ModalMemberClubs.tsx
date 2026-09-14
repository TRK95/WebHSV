import { apiApproveClub, apiGetMemberClubs, apijoinClub, apiUploadMembers } from "@/api/clubMembersApi";
import Club from "@/models/Club";
import ClubMember from "@/models/ClubMember";
import { PAGE_SIZE, statusesMember, STATUS_ACCEPTED, STATUS_WAITING, MEMBER_CLUB, PRESIDENT_CLUB, STATUS_DELETED, RESPONSE_SUCCESS, RESPONSE_MEMBER_EXIST } from "@/utils/contrants";
import { CrownOutlined, InfoCircleOutlined, MinusCircleOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { AutoComplete, Avatar, Button, Image, Input, message, Modal, ModalProps, notification, Popconfirm, Space, Table, Tabs, Tag, Tooltip, Typography, Upload } from "antd";
import { ColumnsType } from "antd/es/table";
import moment, { duration } from "moment";
import { useCallback, useEffect, useState } from "react";
import { PopupNoteUser } from "../PopupNoteUser";
import { apiGetUserInfoByUserName } from "@/api/userInfoApi";
import { apiSearchStudent } from "@/api/searchStudentApi";

interface DataType {
    key: string;
    name: string;
    birth: number;
    phoneNumber: string;
    status: number;
    role: number;
    student: any;
    value?: ClubMember;
}

const ModalMemberClubs = (props: ModalProps & {
    value: Club
}) => {
    const { value, visible, ...rest } = props
    const [dataView, setDataView] = useState<DataType[]>([])
    const [dataFillter, setDataFillter] = useState<DataType[]>([]);
    const [isOpenPreviewImg, setIsOpenPreviewImg] = useState(false);
    const [srcImg, setSrcImg] = useState<string>('');
    const [indexApprove, setIndexApprove] = useState<number>(-1);
    const [dataUserSearch, setDataUserSearch] = useState<any[]>([]);
    const [userJoinClub, setUserJoinClub] = useState<any>();
    const [valueSearch, setValueSearch] = useState<string>('')
    const [isOpenNote, setIsOpenNote] = useState<boolean>(false)
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(1)
    const [loadingSearch, setLoadingSearch] = useState<boolean>(false)
    const [loadingJoin, setLoadingJoin] = useState<boolean>(false);
    const [loadingApprove, setLoadingApprove] = useState<boolean>(false);
    const [loadingClubMembers, setLoadingClubMembers] = useState<boolean>(false);
    const [key, setKey] = useState<number>(-1)
    const [member, setMember] = useState<ClubMember>()
    const [file, setFile] = useState<File | null>(null);
    const [loadingUpload, setLoadingUpload] = useState(false);

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
            loadMemberClubs(100, 0);
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

    const loadMemberClubs = async (limit: number, offset: number) => {
        try {
            setLoadingClubMembers(true)
            const data = await apiGetMemberClubs({
                clubId: value?._id || '',
                limit,
                offset
            })

            if (data.status === RESPONSE_SUCCESS) {
                // chủ tịch lên đầu
                const clubMembers = data?.data.map(o => convertDataToTable(o))
                const president = clubMembers.filter(mem => mem.role === PRESIDENT_CLUB)
                const dataViews = [...president, ...clubMembers.filter(mem => mem.role !== PRESIDENT_CLUB)]
                setDataView(dataViews)
            } else {
                notification.error({
                    message: 'không tải được danh sách thành viên',
                    duration: 1.5
                })
            }
            setTotal(data.total || 0)
        } catch (error) {
            notification.error({
                message: 'lỗi server , không tải được danh sách thành viên',
                duration: 1.5
            })
            setTotal(0)
        } finally {
            setLoadingClubMembers(false)
        }
    }

    const handlePagination = (page: number, pageSize?: number | undefined) => {
        setPage(page - 1)
    }

    const convertDataToTable = (value: ClubMember) => {
        const { _id, clubId, joinDate, role, status, userId, student } = value
        return {
            key: `${_id}`,
            name: student?.fullName,
            birth: student?.birthdate,
            phoneNumber: student?.phoneNumber || 'Không có',
            status,
            joinDate,
            role,
            student,
            value,
        }
    }

    const onSearch = async (value: string) => {
        if (value?.trim()) {
            setLoadingSearch(true)
            const datas = await apiSearchStudent({
                keyword: value?.trim(),
                // token: 'PNiIwCMI8VrDA16n3IQj-ALUMI',
                // sessionId: window.localStorage.getItem('sessionId') || ''
            })
            // const datas = await apiGetUserInfoByUserName({ reqBody: { name: value?.trim() } })
            if (datas.length > 0)
                setDataUserSearch(datas)
            else
                notification.error({
                    message: "Không thể tìm thấy sinh viên",
                    duration: 1.5
                })
            setLoadingSearch(false)
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

    const handleAddMember = async () => {
        setLoadingJoin(true)
        if (userJoinClub.userId && value?._id) {
            try {
                const data = await apijoinClub({
                    clubId: value?._id || '',
                    // note: ''
                }, {
                    user: userJoinClub,
                })
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
                loadMemberClubs(100, 0)
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

    const handleAcceptMember = async (member: ClubMember | undefined, index: number) => {
        setIndexApprove(index)
        setLoadingApprove(true)
        if (value?._id && member?.userId) {
            try {
                const data = await apiApproveClub({
                    clubId: value?._id,
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
                loadMemberClubs(100, 0)
            }
        }
        setLoadingApprove(false)
    }

    const handleRemoveMember = async (member: ClubMember | undefined) => {
        setLoadingClubMembers(true)
        if (value?._id && member?.userId) {
            try {
                const data = await apiApproveClub({
                    clubId: value?._id,
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
                loadMemberClubs(100, 0)
            }
        }
        setLoadingClubMembers(false)
    }

    const handleFileChange = (info) => {
        setFile(info.file);
    };

    const handleUpload = async () => {
        if (!file) {
            notification.error({
                message: 'Chưa chọn file',
                description: 'Vui lòng chọn file để tải lên.',
            });
            return;
        }

        setLoadingUpload(true);
        try {
            const clubId = value?._id ?? "";
            const res = await apiUploadMembers(file, clubId);
            if (res.status === 0) {
                notification.success({
                    message: 'Thành công',
                    description: 'Thêm thành viên thành công.',
                });
                setFile(null)
            } else {
                notification.error({
                    message: 'Thất bại',
                    description: 'Thêm thành viên thất bại.',
                });
                setFile(null)
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra trong quá trình thêm thành viên.',
            });
        } finally {
            setLoadingUpload(false);
            setFile(null)
            // onClose();
        }
    };

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
            width: '15%',
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
            width: '15%',
            render: (text: any) => (
                <div>{text?.className}</div>
            )
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'student',
            width: '15%',
            render: (text: any) => (
                <div>{text?.email}</div>
            )
        },
        {
            title: 'Chức vụ',
            key: 'role',
            dataIndex: 'role',
            align: 'center',
            render(value: number, record, index) {
                return (
                    value === MEMBER_CLUB ? (
                        <Tag color="#2db7f5">Thành Viên</Tag>
                    ) : (
                        <Tag color="#87d068" icon={<CrownOutlined color="#ffd819" />}>Chủ Tịch</Tag>
                    )
                )
            },
        },
        {
            title: 'Quê quán',
            key: 'home',
            dataIndex: 'student',
            width: '15%',
            render: (text: any) => (
                <div>{text?.homeProvince}</div>
            )
        },
        {
            title: 'Action',
            key: 'value',
            dataIndex: 'value',
            align: 'center',
            render: (text: ClubMember, record, index) => (
                <Space size="small">
                    <Tooltip title='Thông tin'>
                        <Button
                            onClick={() => {
                                setIsOpenNote(true)
                                setMember(text)
                                setIndexApprove(index)
                            }}
                            type='dashed'
                            style={{
                                color: "#ff8b18"
                            }}
                        >
                            <InfoCircleOutlined />
                        </Button>
                    </Tooltip>
                    {text?.role === 0 && <Popconfirm
                        title="bạn có muốn xóa khỏi CLB ?"
                        okText='có'
                        cancelText='không'
                        onConfirm={async () => {
                            setIndexApprove(-1)
                            handleRemoveMember(text)
                        }}
                    >
                        <Tooltip title='Loại khỏi CLB'>
                            <Button
                                type='dashed'
                                style={{
                                    color: "red"
                                }}
                            >
                                <MinusCircleOutlined />
                            </Button>
                        </Tooltip>
                    </Popconfirm>}
                </Space>
            )
        },

    ]
    return (
        <Modal
            visible={visible}
            {...rest}
        >
            <Space size="small" style={{ marginBottom: '10px ' }}>
                <Typography.Title level={3}>Danh sách thành viên trong nhóm</Typography.Title>
                <AutoComplete
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
                        if (userJoinClub) {
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
                <Button
                    size="middle"
                    type="primary"
                    onClick={handleAddMember}
                    loading={loadingJoin}
                >
                    Thêm
                </Button>
                <Upload
                    beforeUpload={() => false} // Prevent automatic upload
                    onChange={handleFileChange}
                    accept=".xlsx"
                >
                    <Button icon={<UploadOutlined />}>Chọn file</Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={handleUpload}
                    loading={loadingUpload}
                    disabled={!file}
                >
                    Thêm
                </Button>
            </Space>
            <Tabs onChange={handleFillter} type="card" defaultActiveKey={`${status[0].value}`}
                tabBarGutter={5}
                className='modalMember-tabs'
            >
                {status.map((st, index) => (
                    <Tabs.TabPane tab={st.label} key={st.value}>
                        <Table
                            loading={loadingClubMembers}
                            scroll={{ y: 'calc(100vh - 450px)' }}
                            // pagination={{
                            //     pageSize: PAGE_SIZE,
                            //     total,
                            //     defaultCurrent: 1,
                            //     onChange: handlePagination,
                            //     current: page
                            // }}
                            sticky size='middle'
                            bordered
                            columns={columns}
                            dataSource={dataFillter}
                        />
                    </Tabs.TabPane>
                ))}
            </Tabs>
            <Image
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
            <PopupNoteUser
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
        </Modal>
    )
}

export default ModalMemberClubs