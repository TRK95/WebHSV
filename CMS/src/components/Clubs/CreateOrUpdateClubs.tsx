import { apiGetClubPresident, apiSetPresidentClub } from "@/api/clubMembersApi"
import { apiGetClubsBySlug } from "@/api/clubsApi"
import { apiSearchStudent } from "@/api/searchStudentApi"
import Club from "@/models/Club"
import { AppState } from "@/redux/reducer"
import { updateRoleMember } from "@/redux/reducer/clubMemberSlice"
import { updateClub } from "@/redux/reducer/clubSlice"
import { HIDE_MEMBER, RESPONSE_SUCCESS, ROLE_MEMBER, SHOW_MEMBER, statuses, STATUS_EVENTS, STATUS_PUBLIC, TYPE_CLUB, TYPE_CONTACT_BOARD } from "@/utils/contrants"
import { convertSlug } from "@/utils/slug"
import { CloseOutlined } from "@ant-design/icons"
import { AutoComplete, Button, Col, DatePicker, Form, FormInstance, Input, message, Modal, ModalProps, notification, Popconfirm, Row, Select, Switch, Tooltip } from "antd"
import locale from 'antd/es/date-picker/locale/vi_VN'
import TextArea from "antd/lib/input/TextArea"
import moment from "moment"
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import TinymceEditor from "../TinymceEditor"
import UploadAvatarCrop from "../UploadAvatar"
import { apiCreateUserInfo } from "@/api/userInfoApi"
import UserInfo from "@/models/UserInfo"

const ModalClubs = (props: ModalProps & {
    value?: Club,
    descRef: React.MutableRefObject<any>,
    dataUpload?: string,
    setDataupload: (dataUpload?: string) => void,
    categoryForm: FormInstance<any>,
    isEdit: boolean,
    setPresidentId: React.Dispatch<React.SetStateAction<string>>
    presidentId: string,
    setPresident: React.Dispatch<React.SetStateAction<UserInfo | null>>
    type: number,
    isShowMember?: number,
    setIsShowMember?: React.Dispatch<React.SetStateAction<number>>
}) => {
    const { value, isEdit, categoryForm, descRef, dataUpload, setDataupload, setPresidentId, presidentId, setPresident, type, isShowMember, setIsShowMember = () => { }, visible, ...rest } = props
    const dispatch = useDispatch()
    // const { MonthPicker }: { MonthPicker: any } = DatePicker
    // const { MonthPicker } = DatePicker
    const clubMembersReducer = useSelector((state: AppState) => state.clubMembersReducer)
    const listCategoryClubs = useSelector((state: AppState) => state.categoryClubsReducer.categoryClubs);
    const members = clubMembersReducer.clubMembers
    const loadingRemovePresident = clubMembersReducer.loadingApprove
    const loadingAddPresident = clubMembersReducer.loadingJoinClub
    const [categorys, setCategorys] = useState<{ value: string, label: string, slug: string }[]>([]);
    const [dataPresidentUser, setDataPresidentUser] = useState<any[]>([]);
    const [namePresident, setNamePresident] = useState<string>('');
    const [searchLoading, setSearchLoading] = useState<boolean>(false)

    useEffect(() => {
        setCategorys(listCategoryClubs.map(o => ({
            value: o._id || '',
            label: o.name,
            slug: o.slug
        })))
    }, [listCategoryClubs])

    useEffect(() => {
        if (value) {
            categoryForm.setFieldsValue({
                name: value?.name,
                slug: value?.slug,
                categoryId: value?.categoryId || '',
                categoryName: value?.categoryName || '',
                status: value?.status,
                presidentId: value?.president?.fullName || '',
                avatar: value?.avatar,
                shortDes: value?.shortDes,
                settingStatus: value?.settingStatus === 0 ? null : value?.settingStatus,
                createDate: value?.createDate ? moment(Number(value?.createDate)) : null,
                contactInfo: value?.contactInfo || ''
            })
            setIsShowMember(value?.showMem)
        } else {
            setIsShowMember(HIDE_MEMBER)
        }
    }, [value, visible])

    useEffect(() => {
        if (isEdit) {
            loadPresident()
        }
    }, [members])

    const loadPresident = async () => {
        try {
            const data = await apiGetClubPresident({
                clubId: value?._id || ''
            })
            if (data.status === RESPONSE_SUCCESS && data.data?._id) {
                setPresidentId(data.data?._id)
                setNamePresident(`${data.data?.fullName} (${data.data?.userId})`)
            } else {
                setPresidentId('')
                setNamePresident('')
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi server, ko load được chủ tịch',
                duration: 1.5
            })
        }
    }

    const checkSlugIsExist = async (slug: string) => {
        if (slug) {
            const data = await apiGetClubsBySlug({ slug })
            if (data?.status === RESPONSE_SUCCESS) {
                // check trường hợp update
                const id = data?.data?._id;
                return id !== value?._id && data?.data !== null
            } else {
                message.error('Không check được danh sách slug')
                return true
            }
        }
    }

    const onSearch = async (value: string) => {
        setSearchLoading(true)
        if (value?.trim()) {
            const datas = await apiSearchStudent({
                keyword: value?.trim(),
                //     token: 'PNiIwCMI8VrDA16n3IQj-ALUMI',
                //     sessionId: window.localStorage.getItem('sessionId') || ''
            })
            // const datas = await apiGetUserInfoByUserName({ reqBody: { name: value?.trim() } })
            if (datas.length > 0)
                setDataPresidentUser(datas)
            else
                notification.error({
                    message: "Không thể tìm thấy sinh viên",
                    duration: 1.5
                })
        } else {
            setDataPresidentUser([])
        }
        setSearchLoading(false)
    }

    const onSelect = async (values: any, data: any) => {
        if (isEdit) {
            if (presidentId) message.error('Bạn phải xóa chủ tịch trước đó')
            else {
                const dataPresident = await apiSetPresidentClub({
                    clubId: value?._id || '',
                }, {
                    user: {
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
                    }
                })
                if (dataPresident && dataPresident?.status === RESPONSE_SUCCESS) {
                    setPresidentId(dataPresident?.data?.student._id)
                    setPresident(dataPresident?.data?.student);
                }
                setDataPresidentUser([])
                setNamePresident(`${values} (${data.user.studentId})`)
            }
        } else {
            const dataCreate = await apiCreateUserInfo({
                reqBody: {
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
                }
            })
            if (dataCreate.status === RESPONSE_SUCCESS) {
                setPresidentId(!!dataCreate.data._id ? dataCreate.data._id : "")
                setPresident(dataCreate?.data);
            }
            setDataPresidentUser([])
            setNamePresident(`${values} (${data.user.studentId})`)
        }
    }

    const handleRemovePresident = () => {
        if (isEdit) {
            // call api remove
            dispatch(updateRoleMember({
                clubId: value?._id || '',
                userId: presidentId,
                role: ROLE_MEMBER
            }))
            setPresident(null)
            // update Club with new president
            if (value) {
                dispatch(updateClub({
                    ...value,
                    presidentId: null,
                    president: null,
                    isLoadClub: false
                }))
            }
        }
        setPresidentId('')
        setNamePresident('')
    }

    return (
        <Modal
            visible={visible}
            {...rest}
        >
            <Form
                layout="vertical"
                form={categoryForm}
                autoComplete="off"
                initialValues={{
                    status: STATUS_PUBLIC,
                }}
            >
                <Row gutter={{ xl: 48, md: 16, xs: 0 }}>
                    <Col xl={16} md={16} xs={24} style={{ borderRight: "0.1px solid #ccc" }}>
                        <Form.Item
                            label="Tên tổ chức"
                            name="name"
                            rules={[{ required: true, message: "Điền tên tổ chức" }]}
                        >
                            <Input onChange={(e) => {
                                categoryForm.setFieldsValue({ slug: convertSlug(e.target.value) })
                            }} />
                        </Form.Item>

                        <Form.Item label="Mô tả ngắn" name='shortDes'>
                            <TextArea rows={5} placeholder="Mô tả ngắn" minLength={4} maxLength={700} />
                        </Form.Item>

                        <Form.Item className="model-category__formItem" label="Mô tả">
                            <TinymceEditor
                                id="descriptionClubs"
                                key="descriptionClubs"
                                editorRef={descRef}
                                value={value?.des ?? ''}
                                heightEditor="645px"
                                baseFolder="clubs"
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={8} md={8} xs={24}>
                        <Form.Item label={<h3>{`Ảnh tổ chức`}</h3>} name="avatar">
                            <UploadAvatarCrop
                                defaultUrl={value?.avatar}
                                onChangeUrl={(value) => setDataupload(value)}
                                width={3}
                                height={2}
                                baseFolder="clubs"
                            />
                        </Form.Item>
                        <Form.Item label="Đường dẫn(slug)" name="slug" rules={[
                            { required: true, message: `Điền đường dẫn cho tổ chức` },
                            {
                                validator: async (rule, value) => {
                                    const isExist = await checkSlugIsExist(value);
                                    return isExist ? Promise.reject(new Error('slug đã tồn tại')) : Promise.resolve()
                                },
                            }
                        ]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Ngày thành lập"
                            name="createDate"
                            rules={[
                                // { required: true, message: 'nhập thời gian' }
                            ]}
                        >
                            <DatePicker
                                locale={locale}
                                style={{
                                    width: '100%'
                                }}
                                format='DD/MM/YYYY'
                            />
                        </Form.Item>

                        <Form.Item label="Danh mục" name="categoryId" rules={[{ required: true, message: "Nhập danh mục cho tổ chức" }]}>
                            <Select
                                options={categorys}
                            />
                        </Form.Item>

                        <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: "Nhập trạng thái cho tổ chức" }]}>
                            {/* <Radio.Group>
                                {statuses.map(status => (
                                    <Radio key={status.value} value={status.value}>{status.label}</Radio>
                                ))}
                            </Radio.Group> */}
                            <Select
                                options={statuses}
                            />
                        </Form.Item>

                        <Form.Item name='settingStatus' label={`Cài đặt tổ chức}`}
                            rules={[{ required: true, message: `Chọn cài đặt tổ chức` }]}
                        >
                            <Select
                                options={STATUS_EVENTS}
                            />
                        </Form.Item>

                        {<Form.Item name='showMem' label={`Công khai thành viên của tổ chức?`}>
                            {/* <Radio.Group>
                                <Radio key={1} value={1}>Có</Radio>
                                <Radio key={2} value={2}>Không</Radio>
                            </Radio.Group> */}
                            <Tooltip title={`Click để ${!!isShowMember ? 'tắt' : 'mở'}`}>
                                <Switch checked={!!isShowMember} onChange={() => {
                                    setIsShowMember(!!isShowMember ? HIDE_MEMBER : SHOW_MEMBER)
                                }} />
                            </Tooltip>
                        </Form.Item>}

                        <Form.Item label={`Chủ tịch`} name="presidentId" style={{ marginBottom: '5px' }}>
                            <AutoComplete
                                options={dataPresidentUser?.map((data, index) => ({
                                    key: index,
                                    value: data?.fullName,
                                    label: `${data?.fullName} (${data?.studentId})`,
                                    id: data?.studentId,
                                    user: data
                                }))}
                                onSelect={onSelect}
                                // open={dataPresidentUser.length > 0}
                                onChange={(value) => {
                                    if (value === '') {
                                        setDataPresidentUser([])
                                    }
                                }}
                            >
                                <Input.Search
                                    placeholder="Tìm kiếm sinh viên"
                                    allowClear
                                    onSearch={onSearch}
                                    loading={searchLoading || loadingAddPresident}
                                />
                            </AutoComplete>
                        </Form.Item>
                        {namePresident && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <i>{namePresident}</i>
                                <Popconfirm
                                    title={`Bạn muốn xóa chủ tịch ?`}
                                    onConfirm={handleRemovePresident}
                                    okText="Có"
                                    cancelText="Không"
                                >
                                    <Button loading={loadingRemovePresident} style={{
                                        color: 'red',
                                        borderColor: 'red'
                                    }} size="small" icon={<CloseOutlined />}></Button>
                                </Popconfirm>
                            </div>
                        )}
                        <Form.Item label="Thông tin liên hệ chủ tịch" name='contactInfo' style={{ marginTop: '20px' }}>
                            <TextArea rows={4} placeholder="Nhập thông tin liên hệ chủ tịch" minLength={4} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ModalClubs