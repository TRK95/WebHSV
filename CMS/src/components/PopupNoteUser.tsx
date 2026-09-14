import { apiGetEduPrograms, apiGetUnitTrainings } from "@/api/inforApi";
import { STATUS_ACCEPTED, STATUS_WAITING } from "@/utils/contrants"
import { Button, Card, Col, Modal, ModalProps, Row, Space, Typography } from "antd"
import moment from "moment";
import { useEffect, useState } from "react";

export const PopupNoteUser = (props: ModalProps & {
    textNote?: string,
    valueUser?: any,
    handleCloseModalNote: () => void,
    handleOkModalNote: () => void,
    status?: number,
    detail?: boolean,
}) => {
    const { textNote, valueUser, handleCloseModalNote, handleOkModalNote, status, detail = false, ...rest } = props
    const [unitTraning, setUnitTraining] = useState('Không xác định')
    const [eduProgram, setEduProgram] = useState('Không xác định')
    useEffect(() => {
        (async () => {
            const unitTrainingRes = await apiGetUnitTrainings()
            let data = unitTrainingRes.data
            if (data) {
                let unit = data.filter(item => item.id === valueUser.departmentId)
                if (unit) {
                    setUnitTraining(unit[0].name)
                }
            }
        })()
    }, [valueUser])

    useEffect(() => {
        (async () => {
            const optionsEduProgramRes = await apiGetEduPrograms()
            let data = optionsEduProgramRes.data
            if (data) {
                let program = data.filter(item => item.id === valueUser.programId)
                if (program) {
                    setEduProgram(program[0].name)
                }
            }
        })()
    }, [valueUser])

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
                        status === STATUS_ACCEPTED ? (
                            <div className='ClubMember__status ClubMember__status--joined'>Đã Tham Gia</div>
                        ) : (
                            <div className='ClubMember__status ClubMember__status--rejected'>Đã Từ Chối</div>
                        )
                    )}
                </Space>
            }
        >
            {
                detail
                    ? (
                        <Row style={{ marginBottom: '10px' }} >
                            {/* <Card title="Thông tin người dùng nhập" bordered={true}> */}
                            <div style={{ fontSize: '14px' }}>
                                <div style={{ marginBottom: '10px' }}><b>Họ Tên : </b><i>{valueUser?.fullName}</i></div>
                                <div style={{ marginBottom: '10px' }}><b>Ngày Sinh : </b><i>{moment(valueUser?.birthdate).format('DD/MM/YYYY')}</i></div>
                                <div style={{ marginBottom: '10px' }}><b>Số Điện Thoại : </b><i>{valueUser?.phoneNumber}</i></div>
                                <div style={{ marginBottom: '10px' }}><b>Ngành Học : </b><i>{valueUser?.majorName}</i></div>
                                <div style={{ marginBottom: '10px' }}><b>Năm Nhập Học : </b><i>{valueUser?.year}</i></div>
                                <div style={{ marginBottom: '10px' }}><b>Khoa Viện Đào Tạo : </b><i>{unitTraning}</i></div>
                                <div style={{ marginBottom: '10px' }}><b>Hệ Đào Tạo : </b><i>{eduProgram}</i></div>
                                <div style={{ marginBottom: '10px' }}><b>Ngày Gửi : </b><i>{moment(valueUser?.createDate).format('HH:mm:ss DD/MM/YYYY')}</i></div>
                                <div style={{ marginBottom: '10px' }}><b>Email : </b><i>{valueUser?.email}</i></div>
                                <div style={{ marginBottom: '10px' }}><b>Ghi Chú : </b><i>{valueUser?.notes}</i></div>
                            </div>
                            {/* </Card> */}
                            {/* <Col span={12}>
                                <Card title="Thông tin tìm kiếm" bordered={true}>
                                    <div>
                                        <div><b>Họ Tên : </b><i></i></div>
                                        <div><b>Ngày Sinh : </b><i></i></div>
                                        <div><b>Số Điện Thoại : </b><i></i></div>
                                        <div><b>Ngành Học : </b><i></i></div>
                                        <div><b>Năm Nhập Học : </b><i></i></div>
                                        <div><b>Khoa Viện Đào Tạo : </b><i></i></div>
                                        <div><b>Hệ Đào Tạo : </b><i></i></div>
                                        <div><b>Ngày Gửi : </b><i></i></div>
                                        <div><b>Email : </b><i></i></div>
                                        <div><b>Ghi Chú : </b><i></i></div>
                                    </div>
                                </Card>
                            </Col> */}
                        </Row>
                    )
                    : (
                        <Typography.Text>{textNote}</Typography.Text>
                    )
            }
        </Modal>
    )
}