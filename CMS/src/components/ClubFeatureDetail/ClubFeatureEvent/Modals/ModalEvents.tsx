import { RESPONSE_SUCCESS, STATUS_EVENTS, STATUS_NO_REGISTER, STATUS_PUBLIC } from "@/utils/contrants"
import { convertSlug } from "@/utils/slug"
import { Col, DatePicker, Form, FormInstance, Input, message, Modal, ModalProps, Row, Select } from "antd"
import locale from 'antd/es/date-picker/locale/vi_VN'
import TextArea from "antd/lib/input/TextArea"
import moment from "moment"
import { useEffect, useState } from "react"
import TinymceEditor from "@/components/TinymceEditor"
import UploadAvatarCrop from "@/components/UploadAvatar"
import ClubFeatureChild from "@/models/ClubFeatureChild"
import { apiGetClubFeatureDetailBySlug } from "@/api/clubFeatureApi"
import ClubFeatureDetail from "@/models/ClubFeatureDetail"

const ModalEvents = (props: ModalProps & {
    feature?: ClubFeatureChild,
    value?: ClubFeatureDetail,
    descRef: React.MutableRefObject<any>,
    dataUpload?: string,
    setDataupload: (dataUpload?: string) => void,
    eventsForm: FormInstance<any>,
    clubId?: string,
}) => {
    const { feature, descRef, dataUpload, eventsForm, value, setDataupload, visible, clubId, ...rest } = props
    const { RangePicker }: { RangePicker: any } = DatePicker
    const [showTimeRegister, setShowTimeRegister] = useState<boolean>(false)
    useEffect(() => {
        if (value) {
            const { title, criteria, avatar = "", slug, status, fromDate, toDate, content, registerFromDate, registerToDate, settingStatus, clubId } = value
            eventsForm.setFieldsValue({
                title, criteria, avatar, slug, status, fromDate,
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

    const checkSlugIsExist = async (slug: string) => {
        if (slug) {
            const data = await apiGetClubFeatureDetailBySlug({ slug: slug, featureId: feature?._id ?? "" })
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
                            label={feature?.title}
                            name="title"
                            rules={[{ required: true, message: `Điền tên ${feature?.title}` }]}
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

                        <Form.Item label={<h3>Ảnh {feature?.title}</h3>} name="avatar">
                            <UploadAvatarCrop
                                defaultUrl={value?.avatar}
                                onChangeUrl={(value) => setDataupload(value)}
                                width={3}
                                height={2}
                                baseFolder="events"
                            />
                        </Form.Item>

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

                        <Form.Item label={`Cài đặt ${feature?.title}`} name='settingStatus' rules={[{
                            required: true,
                            message: `Cài đặt ${feature?.title}`
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
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default ModalEvents