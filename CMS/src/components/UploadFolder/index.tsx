import { beforeUpload } from '@/utils/limitedSizeImg';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const UploadFolderNews = (props: {
    defaultUrl?: string | null;
    onChangeUrl: (value: string) => void;
    width: number;
    height: number;
    baseFolder: string;
}) => {
    const { defaultUrl, onChangeUrl, width, height, baseFolder} = props
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isPreview, setIsPreview] = useState<boolean>(true);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    useEffect(() => {
        if (defaultUrl) {
            setFileList([
                {
                    uid: '-1',
                    name: 'file-album',
                    status: 'done',
                    url: defaultUrl,
                }
            ])
            onChangeUrl(defaultUrl)
        }
    }, [defaultUrl])

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        if (isPreview) {
            setFileList(newFileList);
            onChangeUrl(newFileList?.[0]?.response ?? '')
        }
    };

    const onPreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(
            file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
        );
    };

    const handleCancel = () => setPreviewOpen(false);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải lên</div>
        </div>
    );

    return (
        <>
            <Upload
                action={`${process.env.API_ENDPOINT_UPLOAD}/api/upload-static-folder?baseFolder=${baseFolder}`}
                listType="picture-card"
                fileList={fileList}
                maxCount={1}
                onChange={onChange}
                onPreview={onPreview}
                // beforeUpload={(file: RcFile) => {
                //     const check = beforeUpload(file)
                //     setIsPreview(check)
                //     return check
                // }}
                // directory
            >
                {uploadButton}
            </Upload>
        </>
    );
};

export default UploadFolderNews;