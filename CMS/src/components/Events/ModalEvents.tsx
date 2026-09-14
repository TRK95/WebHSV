import { apiGetEventBySlug } from "@/api/eventsApi"
import Event from "@/models/Event"
import { RESPONSE_SUCCESS, statuses, STATUS_EVENTS, STATUS_NO_REGISTER, STATUS_PUBLIC, PAGE_SIZE, TYPE_CLUB } from "@/utils/contrants"
import { convertSlug } from "@/utils/slug"
import { Col, DatePicker, Form, FormInstance, Input, message, Modal, ModalProps, Row, Select } from "antd"
import locale from 'antd/es/date-picker/locale/vi_VN'
import TextArea from "antd/lib/input/TextArea"
import moment from "moment"
import { useEffect, useState } from "react"
import TinymceEditor from "../TinymceEditor"
import UploadAvatarCrop from "../UploadAvatar"
import { loadClubs } from "@/redux/reducer/clubSlice"
import { useDispatch } from "react-redux"

const ModalEvents = (props: ModalProps & {
    value?: Event,
    descRef: React.MutableRefObject<any>,
    dataUpload?: string,
    setDataupload: (dataUpload?: string) => void,
    eventsForm: FormInstance<any>,
    isService?: boolean,
    isEvent?: boolean
}) => {
    const dispatch = useDispatch();
    const { descRef, dataUpload, eventsForm, value, setDataupload, visible, isService = false, isEvent = false, ...rest } = props
    const { RangePicker }: { RangePicker: any } = DatePicker
    const [showTimeRegister, setShowTimeRegister] = useState<boolean>(false)

    useEffect(() => {
        if (value) {
            const { title, criteria, avatar = "", slug, status, fromDate, toDate, content, registerFromDate, registerToDate, settingStatus, hostBy } = value
            eventsForm.setFieldsValue({
                title, criteria, avatar, slug, status, fromDate, hostBy,
                settingStatus: settingStatus === 0 ? null : settingStatus,
                time: [moment(fromDate ?? Date.now()), moment(toDate ?? moment().add(1, 'day'))],
                timeRegister: [moment(registerFromDate || Date.now()), moment(registerToDate || moment().add(1, 'day'))]
            })
            if (settingStatus === 0 || settingStatus === STATUS_NO_REGISTER) {
                setShowTimeRegister(false)
            } else {
                setShowTimeRegister(true)
            }
            descRef?.current?.setContent(content)
        } else {
            setShowTimeRegister(false)
            descRef?.current?.setContent('')
        }
    }, [visible])

    useEffect(() => {
        dispatch(loadClubs({
            limit: PAGE_SIZE,
            offset: 0,
            type: TYPE_CLUB,
            status: 1
        }))
    }, [])

    const checkSlugIsExist = async (slug: string) => {
        if (slug) {
            const data = await apiGetEventBySlug({ slug })
            if (data.status === RESPONSE_SUCCESS) {
                // check trường hợp update
                // const id = data?.data?.id;
                // return id !== value?.id && data.data !== null
                const _id = data?.data?._id;
                return _id !== value?._id && data.data !== null
            } else {
                message.error('Không check được danh sách slug')
                return true
            }
        }
    }

    return (
        <Modal
            visible={visible}
            {...rest}
        >
            <Form
                layout="vertical"
                form={eventsForm}
                autoComplete="off"
                initialValues={{
                    status: STATUS_PUBLIC,
                    time: [moment(Date.now()), moment(moment().add(1, 'day'))],
                    avatar: value?.avatar || null
                }}
            >
                <Row gutter={{ xl: 48, md: 16, xs: 0 }}>
                    <Col xl={16} md={16} xs={24} style={{ borderRight: "0.1px solid #ccc" }}>
                        <Form.Item
                            label={`${isService ? 'Tên dịch vụ' : 'Tên Sự Kiện'}`}
                            name="title"
                            rules={[{ required: true, message: `Điền tên ${isService ? 'Dịch vụ' : 'Sự kiện'}` }]}
                        >
                            <Input onChange={(e) => {
                                eventsForm.setFieldsValue({ slug: convertSlug(e.target.value) })
                            }} />
                        </Form.Item>

                        <Form.Item
                            label="Đường dẫn (slug)"
                            name="slug"
                            rules={[
                                { required: true, message: "Điền đường dẫn" },
                                {
                                    validator: async (rule, value) => {
                                        const isExist = await checkSlugIsExist(value);
                                        return isExist ? Promise.reject(new Error('Slug đã tồn tại')) : Promise.resolve()
                                    },
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item name="criteria" label="Tiêu chí chấm điểm rèn luyện" rules={[
                            // { required: true, message: 'Điền mô tả ngắn' },
                        ]} >
                            <TextArea rows={4} placeholder="Tiêu chí chấm điểm rèn luyện" minLength={4} />
                        </Form.Item>

                        <Form.Item className="model-category__formItem" label="Mô tả">
                            <TinymceEditor
                                id="contentEvents"
                                key="contentEvents"
                                editorRef={descRef}
                                value={value?.content ?? ''}
                                heightEditor="500px"
                                baseFolder="events"
                            />
                        </Form.Item>

                    </Col>
                    <Col xl={8} md={8} xs={24}>

                        <Form.Item label={<h3>Ảnh {`${isService ? 'Dịch vụ' : 'Sự kiện'}`}</h3>} name="avatar">
                            <UploadAvatarCrop
                                defaultUrl={value?.avatar}
                                onChangeUrl={(value) => setDataupload(value)}
                                width={3}
                                height={2}
                                baseFolder="events"
                            />
                        </Form.Item>

                        {!isService && <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: `Nhập trạng thái cho ${isService ? 'Dịch vụ' : 'Sự kiện'}` }]}>
                            <Select
                                options={statuses}
                            />
                        </Form.Item>}

                        <Form.Item
                            label="Thời gian bắt đầu - kết thúc"
                            name="time"
                            rules={[
                                { required: true, message: 'nhập thời gian' }
                            ]}
                        >
                            <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="DD/MM/YYYY HH:mm"
                                locale={locale}
                                style={{
                                    width: '100%'
                                }}
                            />
                        </Form.Item>

                        <Form.Item label={`Cài đặt ${isService ? 'Dịch vụ' : 'Sự kiện'}`} name='settingStatus' rules={[{
                            required: true,
                            message: `Cài đặt ${isService ? 'Dịch vụ' : 'Sự kiện'}`
                        }]}>
                            <Select
                                options={STATUS_EVENTS}
                                onChange={(value) => {
                                    if (value === STATUS_NO_REGISTER) {
                                        setShowTimeRegister(false)
                                    } else {
                                        setShowTimeRegister(true)
                                    }
                                }}
                            />
                        </Form.Item>

                        {
                            showTimeRegister && (
                                <Form.Item
                                    label="Thời gian đăng kí"
                                    name="timeRegister"
                                    rules={[
                                        { required: true, message: 'nhập thời gian' }
                                    ]}
                                >
                                    <RangePicker
                                        showTime={{ format: 'HH:mm' }}
                                        format="DD/MM/YYYY HH:mm"
                                        locale={locale}
                                        style={{
                                            width: '100%'
                                        }}
                                    />
                                </Form.Item>
                            )
                        }

                        <Form.Item label={`Tổ chức tạo hoạt động`} name='hostBy' rules={[{
                            required: true,
                            message: `Điền tên tổ chức tạo hoạt động'}`
                        }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ModalEvents