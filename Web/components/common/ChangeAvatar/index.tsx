import Image from "next/image";
import React, { useState } from "react";
import { Upload } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect } from "react";
import './style.scss'

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const ChangeAvatar = ({
    defaultUrl,
    onChangeUrl,
}: {
    defaultUrl?: string | null;
    onChangeUrl: (value: string) => void;
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);

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
        setFileList(newFileList);
        onChangeUrl(newFileList?.[0]?.response ?? '')
    }

    return (
        <>
            <Upload
                id="file-upload"
                action={`${process.env.NEXT_PUBLIC_API_ENDPOINT_UPLOAD}/api/upload-file?baseFolder=avatar`}
                listType="picture-card"
                fileList={fileList}
                maxCount={1}
                showUploadList={false}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                <span className="ant-upload">
                </span>
            </Upload>
        </>
    );
}

export default ChangeAvatar;