import { apiGetClubCategoryBySlug } from "@/api/clubCategoryApi"
import TinymceEditor from "@/components/TinymceEditor"
import ClubCategory from "@/models/ClubCategory"
import { RESPONSE_SUCCESS, statuses, STATUS_PUBLIC, TYPE_CLUB } from "@/utils/contrants"
import { convertSlug } from "@/utils/slug"
import { Col, Drawer, DrawerProps, Form, FormInstance, Input, message, Row, Select } from "antd"
import { useEffect, useState } from "react"
import "./style.scss"
import UploadAvatarCrop from "../UploadAvatar"

const ModalCategory = (props: DrawerProps & {
    categoryForm: FormInstance<any>,
    value?: ClubCategory,
    descRef: React.MutableRefObject<any>,
    type: number,
    dataUpload?: string,
    setDataupload: (dataUpload?: string) => void
}) => {
    const { categoryForm, value, descRef, dataUpload, setDataupload, type, ...rest } = props

    useEffect(() => {
        categoryForm.setFieldsValue({
            name: value?.name || "",
            slug: value?.slug || "",
            avatar: value?.avatar || "",
            status: value?.status ?? STATUS_PUBLIC,
        })
    }, [value])

    const checkSlugIsExist = async (slug: string) => {
        if (slug) {
            const data = await apiGetClubCategoryBySlug({ slug })
            if (data?.status === RESPONSE_SUCCESS) {
                // check đúng type CLB || ban liên lạc 
                const typeRes = data?.data?.type

                // check trường hợp update
                const id = data?.data?._id;
                return id !== value?._id && data?.data !== null && type === typeRes
            } else {
                message.error('Không check được danh sách slug')
                return true
            }
        }
    }

    return (
        <Drawer
            {...rest}
        >
            <Form
                form={categoryForm}
                layout="vertical"
                autoComplete="off"
                initialValues={{
                    status: STATUS_PUBLIC,
                    avatar: value?.avatar || null,
                }}
            >
                <Row gutter={{ xl: 48, md: 16, xs: 0 }}>
                    <Col>
                        <Form.Item
                            label={`Tên danh mục ${type === TYPE_CLUB ? "Tổ chức" : "Ban liên lạc"}`}
                            name="name"
                            rules={[{ required: true, message: `Điền tên danh mục ${type === TYPE_CLUB ? "Tổ chức" : "Ban liên lạc"}` }]}
                        >
                            <Input onChange={(e) => {
                                categoryForm.setFieldsValue({ slug: convertSlug(e.target.value) })
                            }} />
                        </Form.Item>

                        <Form.Item
                            label="Đường dẫn(slug)"
                            name="slug"
                            rules={[
                                { required: true, message: "Điền đường dẫn cho danh mục" },
                                {
                                    validator: async (rule, value) => {
                                        const isExist = await checkSlugIsExist(value);
                                        return isExist ? Promise.reject(new Error('slug đã tồn tại')) : Promise.resolve()
                                    },
                                }

                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[{ required: true, message: "Nhập trạng thái" }]}
                        >
                            <Select
                                options={statuses}
                            />
                        </Form.Item>

                        <Form.Item label={<h3>{`Ảnh danh mục ${type === TYPE_CLUB ? "Tổ chức" : "Ban liên lạc"}`}</h3>} name="avatar">
                            <UploadAvatarCrop
                                defaultUrl={value?.avatar}
                                onChangeUrl={(value) => setDataupload(value)}
                                width={3}
                                height={2}
                                baseFolder="clubs"
                            />
                        </Form.Item>

                        <Form.Item className="model-category__formItem" label="Mô tả">
                            <TinymceEditor
                                id="descriptionCategory"
                                key="descriptionCategory"
                                heightEditor="500px"
                                editorRef={descRef}
                                value={value?.des || ""}
                                baseFolder="clubs"
                            />
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </Drawer>
    )
}

export default ModalCategory 