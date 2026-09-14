import { beforeUpload } from '@/utils/limitedSizeImg';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { ModalProps } from "antd";
import React, { useEffect, useRef, useState } from 'react';
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

type BeforeUpload = Exclude<UploadProps["beforeUpload"], undefined>;
type BeforeUploadReturnType = ReturnType<BeforeUpload>;

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const UploadAvatarCrop = (props: {
    defaultUrl?: string | null;
    onChangeUrl: (value: string) => void;
    width: number;
    height: number;
    baseFolder: string;
}) => {
    const { defaultUrl, onChangeUrl, width, height, baseFolder } = props
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isPreview, setIsPreview] = useState<boolean>(true);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [modalImage, setModalImage] = useState("");

    useEffect(() => {
        if (defaultUrl) {
            setFileList([
                {
                    uid: '-1',
                    name: 'avatar',
                    status: 'done',
                    url: defaultUrl,
                }
            ])
            onChangeUrl(defaultUrl)
        }
    }, [defaultUrl])

    const cropperRef = useRef<ReactCropperElement>(null);

    const onCancel = useRef<ModalProps["onCancel"]>();
    const onOk = useRef<ModalProps["onOk"]>();

    const innerBeforeUpload: BeforeUpload = (file, fileList) => {
        const check = beforeUpload(file)
        setIsPreview(check)
        return new Promise(async (resolve) => {
            // get file result
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                if (typeof reader.result === "string") {
                    setModalImage(reader.result);
                }
            });
            reader.readAsDataURL(file as unknown as Blob);

            // on modal cancel
            onCancel.current = () => {
                setModalImage("");
                resolve(Upload.LIST_IGNORE);
            };

            // on modal confirm
            onOk.current = () => {
                setModalImage("");
                if (typeof cropperRef.current?.cropper !== "undefined") {
                    const canvas = cropperRef.current?.cropper.getCroppedCanvas();
                    const { type, name, uid } = file as UploadFile;
                    canvas.toBlob(
                        async (blob) => {
                            const newFile = new File([blob as BlobPart], name, { type });
                            Object.assign(newFile, { uid });
                            try {
                                resolve(newFile)
                            } catch (err) {
                                resolve(err as BeforeUploadReturnType)
                            }
                        },
                        type,
                        1
                    );
                }
            };
        });
    };

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
                action={`${process.env.API_ENDPOINT_UPLOAD}/api/upload-file?baseFolder=${baseFolder}`}
                // action={`${process.env.API_ENDPOINT_UPLOAD}/api/cms-alumni/upload-file?baseFolder=${process.env.BUCKET_BASE_FOLDER ?? 'hust-cms-dev'}`}
                // action={`https://test-toeic.online:1443/api/upload-file?baseFolder=${process.env.BUCKET_BASE_FOLDER ?? 'hust-cms-dev'}`}
                listType="picture-card"
                fileList={fileList}
                maxCount={1}
                onChange={onChange}
                onPreview={onPreview}
                beforeUpload={innerBeforeUpload}
            >
                {uploadButton}
            </Upload>
            {modalImage && (
                <Modal
                    visible={true}
                    title="Chỉnh sửa ảnh"
                    onCancel={onCancel.current}
                    onOk={onOk.current}
                    maskClosable={false}
                    destroyOnClose
                >
                    <Cropper
                        ref={cropperRef}
                        style={{ height: 400, width: "100%" }}
                        zoomTo={0.5}
                        initialAspectRatio={width / height}
                        src={modalImage}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false}
                        guides={true}
                    />
                </Modal>
            )}
            <i>{`Tỉ lệ ảnh: ${width}:${height} (ngang : dọc)`}</i>
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
};

export default UploadAvatarCrop;