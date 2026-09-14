import { Button, Modal, ModalProps, Space, Typography } from "antd"
import { STATUS_WAITING } from "../utils/constraint"

export const PopupNoteUser = (props: ModalProps & {
    textNote?: string,
    value?: any,
    handleCloseModalNote: () => void,
    handleOkModalNote: () => void,
    status?: number
}) => {
    const { textNote, value, handleCloseModalNote, handleOkModalNote, status, ...rest } = props
    return (
        <Modal
            {...rest}
            closable={false}
            footer={
                <Space size='small'>
                    <Button type="default" onClick={handleCloseModalNote}>Thoát</Button>
                    {status === STATUS_WAITING ? (
                        <Button
                            className='ClubMember__status ClubMember__status--waiting'
                            color="#5624d0"
                            onClick={handleOkModalNote}
                        >Duyệt</Button>
                    ) : (
                        <div className='ClubMember__status ClubMember__status--joined'
                        >Đã Tham Gia</div>
                    )}
                </Space>
            }
        >
            <Typography.Text>{textNote}</Typography.Text>
        </Modal>
    )
}