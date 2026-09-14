import { beforeUpload } from "@/utils/limitedSizeImg";
import { PlusOutlined } from "@ant-design/icons";
import { Modal, Upload } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useState } from "react";

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const UploadAvatar = ({
    defaultUrl,
    onChangeUrl,
    // beforeUpload = () => true
}: {
    defaultUrl?: string | null;
    onChangeUrl: (value: string) => void;
    // beforeUpload?: (file: RcFile) => boolean
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isPreview, setIsPreview] = useState<boolean>(true)

    useEffect(() => {
        if (defaultUrl) {
            setFileList([
                {
                    uid: '-1',
                    name: 'default.png',
                    status: 'done',
                    url: defaultUrl,
                }
            ])
            onChangeUrl(defaultUrl)
        }
    }, [defaultUrl])

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(
            file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
        );
    };

    const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        if (isPreview) {
            setFileList(newFileList);
            onChangeUrl(newFileList?.[0]?.response ?? '')
        }
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải lên</div>
        </div>
    );

    return (
        <>
            <Upload
                action={`${process.env.API_ENDPOINT_UPLOAD}/api/cms-alumni/upload-file?baseFolder=${process.env.BUCKET_BASE_FOLDER ?? 'hust-cms-dev'}`}
                listType="picture-card"
                fileList={fileList}
                maxCount={1}
                onChange={handleChange}
                beforeUpload={(file: RcFile) => {
                    const check = beforeUpload(file)
                    setIsPreview(check)
                    return check
                }}
                onPreview={handlePreview}
            >
                {uploadButton}
            </Upload>
            <i>{'Tỉ lệ ảnh: 3 : 2 (ngang : dọc)'}</i>
            <Modal
                visible={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="avatar" style={{ width: "100%" }} src={previewImage} />
            </Modal>
        </>
    );
}

export default UploadAvatar;