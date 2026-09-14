import { apiGetClubFeatureChild, apiGetClubFeatureChildBySlug } from '@/api/clubFeatureApi';
import { apiDeleteUserInfo } from '@/api/userInfoApi';
import { IconEvent } from '@/assets/icon/event';
import { IconExternalLink } from '@/assets/icon/externalLink';
import { IconNews } from '@/assets/icon/news';
import ModalClubs from '@/components/Clubs/CreateOrUpdateClubs';
import ModalMemberClubs from '@/components/Clubs/ModalMemberClubs';
import Club from '@/models/Club';
import ClubFeatureChild from '@/models/ClubFeatureChild';
import UserInfo from '@/models/UserInfo';
import { AppState } from '@/redux/reducer';
import { loadClubCategorys } from '@/redux/reducer/clubCategorySlice';
import { createClubFeatureChild, deleteClubFeatureChild, updateClubFeatureChild } from '@/redux/reducer/clubFeatureChildSlice';
import { loadCLubMember, setClubMembers } from '@/redux/reducer/clubMemberSlice';
import { createClub, deleteClub, loadClubByPresidentId, loadClubs, loadClubsByCategory, resetIsNotification, setCategoryClubs, setStatus, updateClub } from '@/redux/reducer/clubSlice';
import { HIDE_MEMBER, PAGE_SIZE, statuses, STATUS_DELETED, STATUS_PRIVATE, STATUS_PUBLIC, TYPE_CLUB, RESPONSE_SUCCESS } from '@/utils/contrants';
import NonAccentVietnamese from '@/utils/nonAccentVN';
import { convertSlug } from '@/utils/slug';
import { AppstoreAddOutlined, CalendarOutlined, ClearOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusCircleOutlined, ReadOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Badge, Button, Col, Dropdown, Input, Form, Menu, Modal, notification, Popconfirm, Row, Select, Space, Table, Tooltip, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useForm } from 'antd/lib/form/Form';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { useEffect, useState, useRef, ChangeEventHandler } from 'react';
import { useDispatch, useSelector } from 'react-redux';
interface DataType {
    key: string;
    name: string;
    status: number;
    owner: string;
    numMem: number;
    slug: string;
    category: string;
    value?: Club;
    createDate: number;
}

function Clubs() {
    const dispatch = useDispatch();
    const [categoryForm] = useForm();
    const [featureForm] = useForm();
    const [featureFormEdit] = useForm();
    const { Option } = Select;
    const descRef = useRef<any>();
    const clubCategorysReducer = useSelector((state: AppState) => state.categoryClubsReducer);
    const clubsReducer = useSelector((state: AppState) => state.clubsReducer);
    const { userInfo, token } = useSelector((state: AppState) => state.userInfoReducer)
    const categoryList = clubCategorysReducer.categoryClubs;
    const notificationCategory = clubCategorysReducer.notifications;
    const loadingClubCategory = clubCategorysReducer.loading;
    const clubs = clubsReducer.clubs;
    const categoryClubs = clubsReducer.category || '0';
    const notificationClubs = clubsReducer.notifications;
    const loadingClubs = clubsReducer.loading;
    const total = clubsReducer.total
    const statusClubs = clubsReducer.status;
    const presidentToken = window.localStorage.getItem("presidentToken")
    const [dataView, setDataView] = useState<DataType[]>([]);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isOpenModalMember, setIsOpenModalMember] = useState<boolean>(false);
    const [categorys, setCategorys] = useState<{ value: string, label: string, slug: string }[]>([]);
    const [valueEdit, setValueEdit] = useState<Club>();
    const [valueToShowMember, setValueToShowMember] = useState<Club>();
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isEditFeature, setIsEditFeature] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [dataUpload, setDataupload] = useState<string>()
    const [presidentId, setPresidentId] = useState<string>('')
    const [president, setPresident] = useState<UserInfo | null>(null)
    const [isShowMember, setIsShowMember] = useState<number>(HIDE_MEMBER);
    const [isOpenModalFeature, setIsOpenModalFeature] = useState<boolean>(false);
    const [selectedClub, setSelectedClub] = useState<Club>()
    const [hoveredClub, setHoveredClub] = useState<Club>();
    const [clubFeatureChildList, setClubFeatureChildList] = useState<ClubFeatureChild[]>([]);
    const [selectedclubFeatureChild, setSelectedclubFeatureChild] = useState<ClubFeatureChild>()

    useEffect(() => {
        handleLoadCategorys();
        return () => {
            dispatch(setCategoryClubs(0))
            dispatch(setStatus(STATUS_PUBLIC))
        }
    }, [])

    useEffect(() => {
        dispatch(loadClubs({
            limit: PAGE_SIZE,
            offset: page * PAGE_SIZE,
            type: TYPE_CLUB,
            status: statusClubs
        }))
    }, [page, userInfo])

    useEffect(() => {
        if (notificationCategory.message) {
            if (notificationCategory.isError) {
                notification.error({
                    message: notificationCategory.message,
                    duration: 1.5
                })
            }
        }
        if (notificationClubs.message) {
            if (notificationClubs.isError) {
                notification.error({
                    message: notificationClubs.message,
                    duration: 1.5
                })
            } else {
                notification.success({
                    message: notificationClubs.message,
                    duration: 1.5
                })
            }
            dispatch(resetIsNotification())
        }
    }, [notificationClubs])

    useEffect(() => {
        setCategorys([
            {
                value: '0',
                label: 'All',
                slug: "",
            }, ...categoryList.map(o => ({
                value: o._id || '',
                label: o.name,
                slug: o.slug
            }))
        ])
    }, [categoryList])

    const checkSlugIsExist = async (parentId: string | undefined, slug: string, value: any) => {
        if (parentId && slug) {
            const data = await apiGetClubFeatureChildBySlug({ parentId, slug })
            if (data?.status === RESPONSE_SUCCESS) {
                // check trường hợp update
                const id = data?.data?._id;
                return id !== value?._id && data?.data !== null
            }
            else {
                message.error('Không check được danh sách slug')
                return true
            }
        }
    }

    useEffect(() => {
        setDataView(clubs.map(o => convertDataToTable(o)))
    }, [clubs, categoryList])

    const handleLoadCategorys = async () => {
        // load category api
        dispatch(loadClubCategorys({
            type: TYPE_CLUB,
            parentId: "-1",
            status: STATUS_PUBLIC
        }))
    }

    const handleChangeCategory = (value: string) => {
        dispatch(setCategoryClubs(value))
        // filter
        if (value === '0') {
            dispatch(loadClubs({
                limit: PAGE_SIZE,
                offset: 0,
                type: TYPE_CLUB,
                status: statusClubs
            }))
        } else {
            dispatch(loadClubsByCategory({
                categoryId: value,
                status: statusClubs
            }))
        }
    }

    const handleChangeStatus = (value: number) => {
        dispatch(setStatus(value))
        // filter
        if (categoryClubs !== '0') {
            // fillter cả category
            dispatch(loadClubsByCategory({
                categoryId: categoryClubs,
                status: value
            }))
        } else {
            dispatch(loadClubs({
                limit: PAGE_SIZE,
                offset: 0,
                type: TYPE_CLUB,
                status: value
            }))
        }

    }

    const handleSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = NonAccentVietnamese(e.target.value.toLocaleLowerCase())
        const newdata = clubs.filter((item) => NonAccentVietnamese(item?.name?.toLocaleLowerCase())?.includes(value))
        setDataView(newdata.map(o => convertDataToTable(o)))
    }

    const handlePagination = (page: number, pageSize?: number | undefined) => {
        setPage(page - 1)
    }

    const handleClubHover = (club) => {
        setHoveredClub(club)
    };

    useEffect(() => {
        if (hoveredClub?._id) {
            const fetchClubFeatureChildList = async () => {
                const data = await apiGetClubFeatureChild({ parentId: hoveredClub._id, status: 1 })
                if (data) {
                    setClubFeatureChildList(data.data)
                }
            }
            fetchClubFeatureChildList();
        }
    }, [hoveredClub, featureForm, isEditFeature])


    const convertDataToTable = (value: Club) => {
        const category = categoryList.length && categoryList.find(o => o._id === value.categoryId)
        return {
            key: `${value._id || ""}`,
            name: value.name,
            status: value.status,
            owner: value.ownerId || 'chưa cập nhật',
            numMem: value.memNum,
            value: value,
            slug: value.slug,
            category: category ? category.name : 'chưa cập nhật',
            createDate: value.createDate,
        }
    }

    const handleOk = () => {
        categoryForm.validateFields()
            .then((value) => {
                const avatar = dataUpload ?? ""
                const { time, categoryId, ...rest } = value
                if (isEdit) {
                    if (valueEdit?._id) {
                        // update
                        dispatch(updateClub({
                            ...rest,
                            _id: valueEdit?._id,
                            memNum: valueEdit?.memNum,
                            type: TYPE_CLUB,
                            avatar,
                            categoryId: categoryId,
                            categoryName: categorys?.find(c => c.value === categoryId)?.slug,
                            des: descRef?.current?.getContent(),
                            presidentId: presidentId || null,
                            showMem: isShowMember,
                            createDate: moment(value?.createDate).valueOf(),
                            president: president || null
                        }))
                    } else {
                        // không có id 
                        notification.error({
                            message: 'không thể cập nhật Tổ chức này',
                            duration: 1.5
                        })
                    }
                } else {
                    dispatch(createClub({
                        ...rest,
                        type: TYPE_CLUB,
                        avatar,
                        des: descRef?.current?.getContent(),
                        categoryId: categoryId,
                        categoryName: categorys?.find(c => c.value === categoryId)?.slug,
                        presidentId: presidentId || null,
                        showMem: isShowMember,
                        president: president || null
                    }))
                }
                setStatus(-1)
                // reset
                setPresidentId('')
                setIsOpenModal(false)
                categoryForm.resetFields();
                setValueEdit(undefined);
            })
    }

    const handleCancel = async () => {
        setPresidentId('')
        setIsOpenModal(false)
        categoryForm.resetFields();
        setValueEdit(undefined);
        if (!isEdit && president) {
            await apiDeleteUserInfo({ reqQuery: { userId: president.userId } })
        }
    }

    const handleCancelFeature = () => {
        featureForm.resetFields();
        setIsOpenModalFeature(false)
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'STT',
            key: 'index',
            width: '4%',
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên Tổ chức',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            render: (text, record) => {
                let isViewNews = false
                if (record.status === 1 || record.status === 3) {
                    isViewNews = true
                } else {
                    isViewNews = false
                }
                return (
                    <Row gutter={10}>
                        <Col span={21}>
                            {record.name}
                        </Col>
                        {isViewNews === true &&
                            <Col span={3}>
                                <Tooltip title="View">
                                    <div style={{ color: 'blue', cursor: 'pointer' }}
                                        onClick={() => {
                                            window.open(`${process.env.API_ENDPOINT_REDIRECT}/cau-lac-bo/tat-ca/${record.slug}`, '_blank')
                                        }}
                                    >
                                        <IconExternalLink />
                                    </div>
                                </Tooltip>
                            </Col>
                        }
                    </Row>
                )
            },
        },
        {
            title: "Đường dẫn",
            dataIndex: "slug",
            width: '20%',
            key: "slug",
        },
        {
            title: "Danh mục",
            dataIndex: "category",
            key: "category",
        },
        {
            title: "Chủ tịch",
            dataIndex: "value",
            key: "president",
            render: (text: Club) => {
                return text.president?.fullName ? (<i>{text.president?.fullName}</i>) : <span>Chưa có</span>
            }
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (text: number) => {
                return (
                    <Space size='small'>
                        <Badge status={text === STATUS_PUBLIC ? 'success' : (text === STATUS_PRIVATE ? 'warning' : "error")} />
                        <div>{statuses.find(o => o.value === text)?.label}</div>
                    </Space>
                )
            }
        },
        {
            title: "SL thành viên",
            dataIndex: "numMem",
            align: 'center',
            key: "numMem",
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
            title: 'Action',
            dataIndex: 'value',
            key: 'value',
            width: '20%',
            align: 'center',
            render: (text: Club, record) => (
                <Space size="large" style={{ fontSize: '20px' }}>
                    <Tooltip title='Member'>
                        <div
                            style={{
                                color: '#1839ff',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                dispatch(setClubMembers([]))
                                setIsOpenModalMember(true)
                                setValueToShowMember(text)
                            }}>
                            <UsergroupAddOutlined />
                        </div>
                    </Tooltip>

                    <Tooltip title="Chỉnh sửa">
                        <div
                            style={{
                                color: '#ff8b18',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setValueEdit(text);
                                setIsOpenModal(true)
                                setIsEdit(true)
                                categoryForm.resetFields();
                            }}>
                            <EditOutlined />
                        </div>
                    </Tooltip>

                    {text.status !== STATUS_DELETED && !token &&
                        <Tooltip title="Xóa">
                            <div
                                style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => {
                                    Modal.confirm({
                                        title: 'Bạn có muốn xóa Tổ chức?',
                                        icon: <ExclamationCircleOutlined />,
                                        content: `${text.name}`,
                                        onOk() {
                                            dispatch(deleteClub({
                                                ...text,
                                                type: TYPE_CLUB
                                            }))
                                        },
                                        okType: 'danger',
                                        okText: "Có",
                                        cancelText: 'Không'
                                    });
                                }}>
                                <DeleteOutlined />
                            </div>
                        </Tooltip>
                    }

                    {
                        !!presidentToken && (
                            <Dropdown
                                overlay={
                                    <Menu>
                                        <Menu.Item disabled={true}>Tạo danh mục con</Menu.Item>
                                        {clubFeatureChildList?.map((menuItem, index) => (
                                            <Menu.Item key={index}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignContent: "center", alignItems: "center" }}>
                                                    <span style={{ width: "100%" }} onClick={() => {
                                                        featureForm.setFieldsValue({
                                                            _id: menuItem?._id,
                                                            title: menuItem?.title,
                                                            slug: menuItem?.slug,
                                                            shortDes: menuItem?.shortDes,
                                                            type: String(menuItem?.type)
                                                        })
                                                        setIsOpenModalFeature(true)
                                                        setIsEditFeature(true)
                                                        setSelectedclubFeatureChild(menuItem)
                                                    }}>{menuItem?.title}</span>
                                                    <DeleteOutlined onClick={() => {
                                                        Modal.confirm({
                                                            title: 'Bạn có muốn xóa danh mục?',
                                                            icon: <ExclamationCircleOutlined />,
                                                            content: `${menuItem.title} - ${text.name}`,
                                                            onOk() {
                                                                featureFormEdit.validateFields()
                                                                    .then(async (value) => {
                                                                        if (menuItem?._id) {
                                                                            dispatch(deleteClubFeatureChild({ featureId: menuItem._id }))
                                                                            setIsEditFeature(true)
                                                                            featureFormEdit.resetFields()
                                                                            setHoveredClub(undefined)
                                                                        }
                                                                    })
                                                                setStatus(-1)
                                                            },
                                                            okType: 'danger',
                                                            okText: "Có",
                                                            cancelText: 'Không'
                                                        });
                                                    }} style={{ color: "red", fontSize: "16px" }} />
                                                </div>
                                            </Menu.Item>
                                        ))}
                                        <Menu.Item
                                            onClick={() => {
                                                setIsOpenModalFeature(true)
                                                setSelectedClub(text)
                                            }}
                                        >Tạo thêm danh mục con mới</Menu.Item>
                                    </Menu>
                                }
                            >
                                <AppstoreAddOutlined style={{ color: '#5AB2FF', cursor: 'pointer' }}
                                    onMouseEnter={() => handleClubHover(text)}
                                />
                            </Dropdown>
                        )
                    }
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ overflow: 'hidden', display: token ? "none" : "initial" }}>
                <Row gutter={{ xl: 48, md: 16, xs: 0 }} style={{ marginBottom: 10 }}>
                    <Col xl={8} md={8} xs={24}>
                        <label>Chọn danh mục : </label>
                        <Select
                            loading={loadingClubCategory}
                            style={{ width: '100%' }}
                            onChange={handleChangeCategory}
                            options={categorys}
                            value={categoryClubs}
                        />
                    </Col>
                    <Col xl={8} md={8} xs={24}>
                        <label>Chọn trạng thái : </label>
                        <Select
                            value={statusClubs}
                            style={{ width: '100%' }}
                            onChange={handleChangeStatus}
                            options={statuses}
                        />
                    </Col>
                    <Col xl={5} md={5} xs={24}>
                        <label style={{ display: 'block' }}>Tìm kiếm : </label>
                        <Input.Search placeholder="Tìm kiếm Tổ chức" onChange={handleSearch} style={{ width: '100%' }} />
                    </Col>
                    <Col xl={3} md={3} xs={24} style={{ position: 'relative' }}>
                        <Button type='primary'
                            onClick={() => {
                                setIsOpenModal(true),
                                    setIsEdit(false),
                                    categoryForm.resetFields();
                            }}
                            style={{ position: 'absolute', right: 24, bottom: 0 }}
                        >Tạo Tổ chức</Button>
                    </Col>
                </Row>
            </div>

            <Typography.Title level={4}>Danh sách tổ chức của bạn</Typography.Title>

            <Table
                loading={loadingClubs}
                scroll={{ y: 'calc(100vh - 310px)' }}
                pagination={{
                    pageSize: PAGE_SIZE,
                    defaultCurrent: 1,
                    onChange: handlePagination,
                    total
                }}
                sticky
                size='middle'
                bordered
                columns={columns}
                dataSource={dataView}
            />
            {
                isOpenModalFeature && <Modal
                    visible={isOpenModalFeature}
                    title="Tạo danh mục con"
                    maskClosable={false}
                    width='50%'
                    cancelText='Hủy'
                    okText={isEditFeature ? "Chỉnh sửa" : "Tạo"}
                    style={{ top: "30%" }}
                    onCancel={() => {
                        handleCancelFeature()
                    }}
                    onOk={() => {
                        featureForm.validateFields()
                            .then((value) => {
                                if (!isEditFeature) {
                                    dispatch(createClubFeatureChild({
                                        ...value,
                                        parentId: selectedClub?._id,
                                        status: 1,
                                    }))
                                    setStatus(1)
                                    handleCancelFeature();
                                    message.success("Tạo thư mục con thành công")
                                    setHoveredClub(undefined)
                                }
                                else {
                                    dispatch(updateClubFeatureChild({
                                        ...value,
                                        _id: selectedclubFeatureChild?._id,
                                        parentId: selectedclubFeatureChild?.parentId,
                                        status: 1,
                                    }))
                                    setStatus(-1)
                                    handleCancelFeature();
                                    message.success("Chỉnh sửa thư mục con thành công")
                                    setHoveredClub(undefined)
                                }
                            })
                    }}
                >
                    <div>
                        <p>{selectedClub?.name}</p>
                        <p>Nhập tên danh mục mới:</p>
                        <Form
                            form={featureForm}
                            autoComplete="off"
                            initialValues={{
                                status: STATUS_PUBLIC,
                            }}
                        >
                            <Form.Item label="Tên danh mục" name="title"
                                rules={[{ required: true, message: "Điền tên danh mục con" }]}>
                                <Input onChange={(e) => {
                                    featureForm.setFieldsValue({ slug: convertSlug(e.target.value) })
                                }} />
                            </Form.Item>
                            <Form.Item label="Đường dẫn(slug)" name="slug" rules={[
                                { required: true, message: `Điền đường dẫn cho danh mục con` },
                                {
                                    validator: async (rule, value) => {
                                        const isExist = await checkSlugIsExist(isEditFeature ? selectedclubFeatureChild?.parentId : selectedClub?._id, value, selectedclubFeatureChild);
                                        return isExist ? Promise.reject(new Error('slug đã tồn tại')) : Promise.resolve()
                                    },
                                }
                            ]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Định dạng thư mục" name="type" rules={[{ required: true, message: "Chọn định dạng danh mục con" }]}>
                                <Select
                                    style={{ width: 120 }}
                                    // value={featureForm.getFieldValue("type")}
                                    // onChange={handleChange}
                                    options={[
                                        { value: '1', label: 'Tin tức' },
                                        { value: '2', label: 'Văn bản' },
                                        { value: '3', label: 'Sự kiện' },
                                    ]}

                                />

                            </Form.Item>
                            <Form.Item label="Mô tả ngắn" name='shortDes'>
                                <TextArea rows={5} placeholder="Mô tả ngắn" minLength={4} maxLength={700} />
                            </Form.Item>
                        </Form>
                    </div>
                </Modal >
            }
            {
                isOpenModal && <ModalClubs
                    visible={isOpenModal}
                    maskClosable={false}
                    categoryForm={categoryForm}
                    width='100%'
                    title={isEdit ? 'Sửa Tổ chức' : 'Tạo Tổ chức'}
                    cancelText='Hủy'
                    okText={isEdit ? 'Cập nhật' : 'Tạo'}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    style={{ top: 20 }}
                    value={valueEdit}
                    descRef={descRef}
                    isEdit={isEdit}
                    dataUpload={dataUpload}
                    setDataupload={setDataupload}
                    setPresidentId={setPresidentId}
                    presidentId={presidentId}
                    setPresident={setPresident}
                    type={TYPE_CLUB}
                    isShowMember={isShowMember}
                    setIsShowMember={setIsShowMember}
                />
            }
            {
                valueToShowMember && (
                    <ModalMemberClubs
                        value={valueToShowMember}
                        title={`Tổ chức ${valueToShowMember?.name}`}
                        okText='Cập nhật'
                        cancelText='Hủy'
                        visible={isOpenModalMember}
                        width='100%'
                        maskClosable={false}
                        style={{ top: 20 }}
                        onOk={() => {
                            setIsOpenModalMember(false)
                            if (categoryClubs !== '0') {
                                // fillter cả category
                                dispatch(loadClubsByCategory({
                                    categoryId: categoryClubs,
                                    status: statusClubs
                                }))
                            } else {
                                dispatch(loadClubs({
                                    limit: PAGE_SIZE,
                                    offset: page * PAGE_SIZE,
                                    type: TYPE_CLUB,
                                    status: statusClubs
                                }))
                            }
                        }}
                        onCancel={() => {
                            setIsOpenModalMember(false)
                        }}
                    />
                )
            }
        </div >
    )

}

export default Clubs;