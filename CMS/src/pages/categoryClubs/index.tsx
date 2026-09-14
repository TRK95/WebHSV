import ClubCategory from '@/models/ClubCategory';
import { AppState } from '@/redux/reducer';
import { resetNotification } from '@/redux/reducer/clubCategorySlice';
import { PAGE_SIZE, statuses, STATUS_DELETED, STATUS_PRIVATE, STATUS_PUBLIC, TYPE_CLUB } from '@/utils/contrants';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Badge, Button, Col, Modal, notification, Popconfirm, Row, Select, Space, Table, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useForm } from 'antd/lib/form/Form';
import _, { values } from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import ModalCategory from '../../components/Clubs/DrawerCategory';
import { createClubCategorys, deleteClubCategorys, loadClubCategorys, updateClubCategorys } from '../../redux/reducer/clubCategorySlice';
interface DataType {
    key: string;
    name: string;
    slug: string;
    clubNum: number;
    status: number;
    data?: any; // dataType
    children?: DataType[];
    createDate: number;
}

function CategoryClubs() {

    const [categoryForm] = useForm();
    const dispatch = useDispatch();
    const descRef = useRef<any>();
    const clubCategoryReducer = useSelector((state: AppState) => state.categoryClubsReducer)
    const clubCategorys = clubCategoryReducer.categoryClubs;
    const loadingClubCategory = clubCategoryReducer.loading;
    const notificationCategory = clubCategoryReducer.notifications
    const addNewCategory = clubCategoryReducer.addNewCategory;
    const [dataUpload, setDataupload] = useState<string>()
    const [dataView, setDataView] = useState<DataType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [valueEdit, setValueEdit] = useState<ClubCategory | undefined>(undefined)
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [status, setStatus] = useState<number>(STATUS_PUBLIC);

    useEffect(() => {
        // call api
        loadCategorys()
    }, [])

    useEffect(() => {
        if (notificationCategory.message) {
            if (notificationCategory.isError) {
                notification.error({
                    message: notificationCategory.message,
                    duration: 1.5
                })
            } else {
                notification.success({
                    message: notificationCategory.message,
                    duration: 1.5
                })
            }
            dispatch(resetNotification())
        }
    }, [notificationCategory])

    useEffect(() => {
        const arr = _.sortBy(clubCategorys, [(category) => {
            return category.index
        }]);
        setDataView(arr.map(o => convertData(o)))
    }, [clubCategorys])

    useEffect(() => {
        if (addNewCategory && addNewCategory._id) {
            loadCategorys();
        }
    }, [addNewCategory])

    const convertData = (o: ClubCategory) => {
        return {
            key: `${o._id || ""}`,
            name: o.name,
            slug: o.slug,
            clubNum: o.clubNum,
            status: o.status,
            data: o,
            avatar: o.avatar,
            createDate: o.createDate,
        }
    }

    const loadCategorys = async () => {
        // load categoryClub 
        dispatch(loadClubCategorys({
            parentId: '-1',
            type: TYPE_CLUB,
            status: status
        }))
    }


    const handleOk = () => {
        categoryForm.validateFields()
            .then(value => {
                if (isEdit) {
                    if (valueEdit?._id) {
                        dispatch(updateClubCategorys({
                            ...value,
                            avatar: dataUpload ?? null,
                            _id: valueEdit?._id,
                            clubNum: valueEdit?.clubNum,
                            des: descRef?.current?.getContent(),
                            type: TYPE_CLUB,
                            createDate: valueEdit?.createDate ? moment(valueEdit?.createDate).valueOf() : null
                        }))
                    } else {
                        // không có id 
                        notification.error({
                            message: 'không thể cập nhật danh mục này',
                            duration: 1.5
                        })
                    }
                } else {
                    dispatch(createClubCategorys({
                        ...value,
                        avatar: dataUpload ?? null,
                        des: descRef?.current?.getContent(),
                        type: TYPE_CLUB
                    }))
                }
                // reset
                handleCancel();
            })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setValueEdit(undefined);
        categoryForm.resetFields();
        descRef?.current?.setContent('')
    }

    const handleChangeStatus = (value: number) => {
        setStatus(value)
        // filter
        dispatch(loadClubCategorys({
            parentId: "-1",
            type: TYPE_CLUB,
            status: value
        }))
    }

    const onDragEnd = (result: any) => {
        const destination = result.destination;
        const source = result.source;
        let dataSource = dataView[source.index];
        dataView.splice(source.index, 1);
        dataView.splice(destination.index, 0, dataSource)

        setDataView([...dataView])
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            width: '4%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Đường dẫn',
            dataIndex: 'slug',
            key: 'slug',
            width: '25%'
        },
        {
            title: 'Số lượng Tổ chức',
            dataIndex: 'clubNum',
            key: 'clubNum',
            width: '10%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text: number) => {
                return (
                    <Space size='small'>
                        <Badge status={text === STATUS_PUBLIC ? 'success' : (text === STATUS_PRIVATE ? 'warning' : "error")} />
                        <div>{statuses.find(o => o.value === text)?.label}</div>
                    </Space>
                )
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createDate',
            key: 'createDate',
            render: (text, row) => (
                <span>{text > 0 ? moment(text).format('HH:mm:ss DD/MM/YYYY') : ""}</span>
            )
        },
        {
            title: 'Action',
            dataIndex: 'data',
            key: 'data',
            align: 'center',
            render: (text: ClubCategory, record) => (
                <Space size='large' style={{ fontSize: '20px' }}>
                    <Tooltip title="Chỉnh sửa">
                        <div
                            style={{
                                color: '#ff8b18',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setValueEdit(text);
                                setIsModalOpen(true)
                                setIsEdit(true)
                            }}
                        >
                            <EditOutlined />
                        </div>
                    </Tooltip>

                    {text.status !== STATUS_DELETED &&
                        <Tooltip title="Xóa">
                            <div style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => {
                                    Modal.confirm({
                                        title: 'Bạn có muốn xóa danh mục tổ chức?',
                                        icon: <ExclamationCircleOutlined />,
                                        content: `${text.name}`,
                                        onOk() {
                                            dispatch(deleteClubCategorys(text))
                                        },
                                        okType: 'danger',
                                        okText: "Có",
                                        cancelText: 'Không'
                                    });
                                }}
                            >
                                <DeleteOutlined />
                            </div>
                        </Tooltip>
                    }
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ overflow: 'hidden' }}>
                <Row gutter={{ xl: 48, md: 16, xs: 0 }} style={{ marginBottom: 10 }}>
                    <Col xl={8} md={8} xs={24}>
                        <label>Trạng thái : </label>
                        <Select
                            value={status}
                            style={{ width: '100%' }}
                            onChange={handleChangeStatus}
                            options={statuses}
                        />
                    </Col>
                    <Col xl={16} md={16} xs={24} style={{ position: 'relative' }}>
                        <Button
                            type='primary'
                            onClick={() => {
                                setIsModalOpen(true)
                                setIsEdit(false)
                            }}
                            style={{ position: 'absolute', right: 24, bottom: 0 }}
                        >
                            Tạo danh mục
                        </Button>
                    </Col>
                </Row>
            </div>

            <Typography.Title level={4}>Danh sách danh mục tổ chức</Typography.Title>

            <DragDropContext
                onDragEnd={onDragEnd}
            >
                <Table
                    loading={loadingClubCategory}
                    scroll={{ y: 'calc(100vh - 310px)' }}
                    sticky
                    bordered
                    columns={columns}
                    dataSource={dataView}
                    pagination={{
                        pageSize: PAGE_SIZE
                    }}
                    rowKey="id"
                    rowClassName={"row-item"}
                    components={{
                        body: {
                            wrapper: (val: any) => {

                                return (
                                    <Droppable
                                        droppableId="droppableCategoryClub"
                                    >
                                        {(provided, snapshot) => (
                                            <tbody
                                                ref={provided.innerRef}
                                                key={val.index}
                                                {...val}
                                                {...provided.droppableProps}
                                                className={`${val.className} ${snapshot.isDraggingOver
                                                    ? "is-dragging-over"
                                                    : ""
                                                    }`}
                                            >
                                            </tbody>
                                        )}
                                    </Droppable>
                                )
                            },
                            row: (val: any) => {
                                const { index, record, ...props } = val

                                return (
                                    <Draggable
                                        key={record?.key || ""}
                                        draggableId={record?.key || ""}
                                        index={index}
                                    >
                                        {(provided, snapshot) => {
                                            return record?.key ? (
                                                <tr
                                                    ref={provided.innerRef}
                                                    {...props}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={`row-item ${props.className} ${snapshot.isDragging ? "row-dragging" : ""}`}
                                                ></tr>
                                            ) : <tr></tr>;
                                        }}
                                    </Draggable>
                                )
                            }
                        }
                    }}
                    onRow={(record, index) => {
                        return {
                            index,
                            record,
                            onTouchEnd: (e) => {
                                e.preventDefault();
                            }
                        }
                    }}
                />
            </DragDropContext>

            <ModalCategory
                visible={isModalOpen}
                maskClosable={false}
                categoryForm={categoryForm}
                value={valueEdit}
                dataUpload={dataUpload}
                setDataupload={setDataupload}
                width="40%"
                title={isEdit ? "Sửa danh mục" : "Tạo danh mục"}
                bodyStyle={{ paddingBottom: 80 }}
                footerStyle={{ textAlign: 'right' }}
                onClose={handleCancel}
                footer={
                    <Space>
                        <Button onClick={handleCancel}>Hủy</Button>
                        <Button onClick={handleOk} type="primary">
                            {isEdit ? "Cập nhật" : "Tạo"}
                        </Button>
                    </Space>
                }
                descRef={descRef}
                type={TYPE_CLUB}
            />
        </div>
    )

}

export default CategoryClubs;