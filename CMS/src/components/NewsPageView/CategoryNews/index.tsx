
import { apiAddOrRemoveCategory, apiGetNewsCategory, apiGetNewsCategoryBySlug, apiUpdateNewsCategory, getNewsByDate } from '@/api/newsApi';
import NewsCategory from '@/models/NewsCategory';
import NewsModel from '@/models/NewsModel';
import { AppState } from '@/redux/reducer';
import { fetchNewsCategory, resetIsErrorNewsCategory } from '@/redux/reducer/newsCategorySlice';
import { RESPONSE_FAILED, RESPONSE_SUCCESS, statuses, STATUS_DELETED, STATUS_PRIVATE, STATUS_PUBLIC, TYPE_CLUB } from '@/utils/contrants';
import NonAccentVietnamese from '@/utils/nonAccentVN';
import { convertSlug } from '@/utils/slug';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Col, Form, Input, Modal, Radio, RadioChangeEvent, Row, Select, SelectProps, Space, Table, Popconfirm, message, Badge, notification, Tooltip, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Search from 'antd/lib/input/Search';
import TextArea from 'antd/lib/input/TextArea';
import { Option } from 'antd/lib/mentions';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import TinymceEditor from '../../TinymceEditor';
import TableView from '../../TableView';

export type NewsCategoryModel = NewsCategory & {
    key?: React.Key,
    category?: string,
    children?: Array<NewsCategoryModel>
}

function CategoryNews() {
    const dispatch = useDispatch()
    const descRef = useRef<any>();
    const [form] = Form.useForm();
    const newsCategoryReducer = useSelector((state: AppState) => state.newsCategoryReducer)
    const newsCategory = newsCategoryReducer.newsCategory
    const isError = newsCategoryReducer.isError
    const isLoading = newsCategoryReducer.loading
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newsCategoryDetail, setNewsCategoryDetail] = useState<NewsCategoryModel | undefined>(undefined)
    const [searchValue, setSearchValue] = useState('')
    const [dataView, setDataView] = useState<Array<NewsCategoryModel>>([]);
    const [status, setStatus] = useState<number>(STATUS_PUBLIC)

    useEffect(() => {
        dispatch(fetchNewsCategory({
            // parentId: -1,
            parentId: "-1",
            status: status,
            type: 0
        }))
    }, [])

    useEffect(() => {
        if (isError) {
            notification.error({
                message: 'Không tải được danh sách danh mục tin tức',
                duration: 1.5
            })
            dispatch(resetIsErrorNewsCategory())
        }
    }, [isError])

    useEffect(() => {
        const arr = _.sortBy(newsCategory, [(category) => {
            return category.index
        }]);;
        setDataView(arr.filter(item => {
            const itemName = NonAccentVietnamese(item.title?.toLocaleLowerCase())
            return itemName?.includes(searchValue)
        }))
    }, [newsCategory, searchValue])

    useEffect(() => {
        if (newsCategoryDetail) {
            const parentId = Number(newsCategoryDetail.parentId) === -1 ? null : newsCategoryDetail.parentId
            form.setFieldsValue({
                title: newsCategoryDetail.title,
                slug: newsCategoryDetail.slug,
                status: newsCategoryDetail.status,
                des: newsCategoryDetail.des,
                parentId
            })
        }
    }, [newsCategoryDetail])

    const onDelete = async (values: NewsCategoryModel) => {
        const response = await apiUpdateNewsCategory({
            reqBody: {
                ...values,
                status: STATUS_DELETED
            }
        })

        if (response.status === RESPONSE_SUCCESS) {
            setStatus(-1)
            dispatch(fetchNewsCategory({
                // parentId: -1,
                parentId: "-1",
                status: -1,
                type: 0
            }))
            message.success('Xóa Danh mục thành công !')
        } else if (response.status === RESPONSE_FAILED) {
            message.success('Xóa danh mục không thành công !')
        }
    }

    const onFinish = () => {
        form.validateFields()
            .then(async (values: NewsCategoryModel) => {
                setIsModalOpen(false)

                const bodyReq = {
                    title: values?.title ?? '',
                    des: descRef?.current?.getContent() ?? '',
                    slug: values?.slug ?? '',
                    parentId: values?.parentId ?? "-1",
                    type: values?.type ?? TYPE_CLUB,
                    status: values.status
                }
                if (newsCategoryDetail) {
                    const updateRes = await apiUpdateNewsCategory({
                        reqBody: {
                            ...bodyReq,
                            _id: newsCategoryDetail._id
                        }
                    })

                    if (updateRes.status === RESPONSE_SUCCESS) {
                        dispatch(fetchNewsCategory({
                            // parentId: -1,
                            parentId: "-1",
                            status: status,
                            type: 0
                        }))
                        message.success("Cập nhật danh mục tin tức thành công!")
                    } else if (updateRes.status === RESPONSE_FAILED) {
                        message.error("Cập nhật danh mục tin tức thất bại!")
                    }
                } else {
                    const createRes = await apiUpdateNewsCategory({
                        reqBody: {
                            ...bodyReq,
                        }
                    })

                    if (createRes.status === RESPONSE_SUCCESS) {
                        dispatch(fetchNewsCategory({
                            // parentId: -1,
                            parentId: "-1",
                            status: status,
                            type: 0
                        }))
                        message.success("Tạo danh mục tin tức thành công!")
                    } else if (createRes.status === RESPONSE_FAILED) {
                        message.error("Tạo danh mục tin tức thất bại!")
                    }
                }

            })
            .catch((infor) => {
                console.log('error', infor)
            })
    }

    const onSearch = (values: any) => {
        const _values = NonAccentVietnamese(values.toLocaleLowerCase())
        setSearchValue(_values)
    }

    const checkSlugIsExist = async (slug: string) => {
        if (slug) {
            const data = await apiGetNewsCategoryBySlug({ slug })
            if (data.status === RESPONSE_SUCCESS) {
                // check trường hợp update
                // const id = data.data?.id;
                // return id !== newsCategoryDetail?.id && data.data !== null
                const _id = data.data?._id;
                return _id !== newsCategoryDetail?._id && data.data !== null
            } else {
                message.error('Không check được danh sách slug')
                return true
            }
        }
    }

    const handleChangeStatus = (value: number) => {
        setStatus(value)
        // filter
        dispatch(fetchNewsCategory({
            // parentId: -1,
            parentId: "-1",
            status: value,
            type: 0
        }))
    }

    const onDragEnd = (result) => {
        const destination = result.destination;
        const source = result.source;
        let dataSource = dataView[source.index];
        dataView.splice(source.index, 1);
        dataView.splice(destination.index, 0, dataSource)

        setDataView(dataView.filter(item => {
            const itemName = NonAccentVietnamese(item.title?.toLocaleLowerCase())
            return itemName?.includes(searchValue)
        }))
    };

    const options = newsCategory.map(item => {
        return {
            // value: item.id || 0,
            value: item._id || "0",
            label: item.title
        }
    })

    const columns: ColumnsType<NewsCategoryModel> = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'title',
            key: 'title',
            width: '30%',
        },
        {
            title: 'Đường dẫn',
            dataIndex: 'slug',
            key: 'slug',
            width: '30%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                if (record.status === STATUS_PRIVATE) {
                    return <div style={{ display: 'flex' }}>
                        <Badge status='warning' />{'Riêng tư'}
                    </div>
                } else if (record.status === STATUS_PUBLIC) {
                    return <div style={{ display: 'flex' }}>
                        <Badge status='success' />{'Công khai'}
                    </div>
                } else if (record.status === STATUS_DELETED) {
                    return <div style={{ display: 'flex' }}>
                        <Badge status='error' />{'đã xóa'}
                    </div>
                }
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
            title: 'Hành động',
            key: 'operation',
            fixed: 'right',
            align: 'center',
            render: (text, record) =>
                <Space size='large' style={{ fontSize: '20px' }}>
                    <Tooltip title="Chỉnh sửa">
                        <div
                            style={{
                                color: '#ff8b18',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setIsModalOpen(true)
                                setNewsCategoryDetail(record)
                            }}
                        >
                            <EditOutlined />
                        </div>
                    </Tooltip>

                    {
                        text.status !== STATUS_DELETED &&
                        <Tooltip title="Xóa">
                            <div style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => {
                                    Modal.confirm({
                                        title: 'Bạn có muốn xóa danh mục tin tức?',
                                        icon: <ExclamationCircleOutlined />,
                                        content: `${text.title}`,
                                        onOk() {
                                            onDelete(record)
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
                </Space>,
        },
    ];

    return (
        <>
            <div id="posts">
                <Space>
                    <Button type="primary" onClick={() => {
                        setIsModalOpen(true)
                        setNewsCategoryDetail(undefined)
                        form.resetFields()
                    }}>TẠO DANH MỤC TIN TỨC</Button>
                    <div className="posts-actions">
                        <Space>
                            <Input placeholder="Tìm kiếm danh mục" onChange={((e) => onSearch(e.target.value))} style={{ width: 200 }} />
                            <Space size='small' style={{
                                marginLeft: "50px"
                            }}>
                                <label>Chọn trạng thái : </label>
                                <Select
                                    value={status}
                                    style={{ width: '300px' }}
                                    onChange={handleChangeStatus}
                                    options={statuses}
                                />
                            </Space>
                        </Space>
                    </div>
                </Space>

                <div className="posts-body">
                    <div className="list-post">
                        <div style={{ display: 'flex' }}>
                            <h2 className="list-post-title">
                                Danh sách danh mục
                            </h2>
                        </div>
                        <DragDropContext
                            onDragEnd={onDragEnd}
                        >
                            <Table
                                bordered
                                scroll={{ y: 'calc(100vh - 330px)' }}
                                loading={isLoading}
                                columns={columns}
                                dataSource={dataView}
                                // rowKey="id"
                                rowKey="_id"
                                components={{
                                    body: {
                                        wrapper: (val: any) => (
                                            <Droppable
                                                droppableId="droppable"
                                            >
                                                {(provided, snapshot) => (
                                                    <tbody
                                                        ref={provided.innerRef}
                                                        {...val}
                                                        {...provided.droppableProps}
                                                        className={`${val.className} ${snapshot.isDraggingOver
                                                            ? "is-dragging-over"
                                                            : ""
                                                            }`}
                                                    ></tbody>
                                                )}
                                            </Droppable>
                                        ),
                                        row: (val: any) => {
                                            const { index, record, columnId, ...props } = val

                                            return (props["data-row-key"] !== undefined ? (
                                                <Draggable
                                                    key={props["data-row-key"]}
                                                    draggableId={`${props["data-row-key"]}`}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => {
                                                        return (
                                                            <tr
                                                                ref={provided.innerRef}
                                                                {...props}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={`row-item ${props.className} ${snapshot.isDragging ? "row-dragging" : ""}`}
                                                            ></tr>
                                                        );
                                                    }}
                                                </Draggable>
                                            ) : (
                                                <tr {...props}></tr>
                                            )
                                            )
                                        }
                                    }
                                }}
                                onRow={(record, index) => {
                                    return {
                                        index,
                                        record,
                                        onTouchEnd: (e) => {
                                            // if (e.defaultPrevented) {
                                            //     return;
                                            // }
                                            e.preventDefault();
                                            // toggleSelectionInGroup(record.id);
                                        }
                                    }
                                }}
                                expandable={{
                                    expandedRowRender: (record) => (
                                        <TableView
                                            data={record}
                                            columns={columns}
                                        />
                                    ),
                                    // rowExpandable: record => Number(record.id) !== 0,
                                }}
                            />
                        </DragDropContext>

                    </div>
                </div>
            </div >

            <Modal
                maskClosable={false}
                centered
                title={!!newsCategoryDetail ? 'Sửa Danh mục tin tức' : 'Tạo Danh mục tin tức'}
                getContainer={false}
                visible={isModalOpen}
                onOk={onFinish}
                onCancel={() => {
                    setIsModalOpen(false)
                    setNewsCategoryDetail(undefined)
                }}
                width="100%"
            >
                <div className="posts-modal-add">
                    <Form
                        id="form"
                        form={form}
                        layout="vertical"
                        style={{ top: 0 }}
                    >
                        <Row gutter={{ xl: 24, md: 16, xs: 0 }}>
                            <Col xl={18} md={16} xs={24}>
                                <Form.Item name="title" label={<h3>{!!newsCategoryDetail ? "Sửa tiêu đề" : "Thêm tiêu đề"}</h3>} rules={[
                                    { required: true, message: 'Vui lòng nhập thông tin!' }
                                ]} >
                                    <Input onChange={(e) => form.setFieldsValue({ ["slug"]: `${convertSlug(e.target.value)}` })} placeholder="Thêm tiêu đề" />
                                </Form.Item>
                                <Form.Item name="slug" label={<h3>{!!newsCategoryDetail ? "Sửa Đường dẫn (slug)" : "Thêm Đường dẫn (slug)"}</h3>} rules={[
                                    { required: true, message: 'Vui lòng nhập thông tin!' },
                                    {
                                        validator: async (rule, value) => {
                                            const isExist = await checkSlugIsExist(value);
                                            return isExist ? Promise.reject(new Error('slug đã tồn tại')) : Promise.resolve()
                                        },
                                    }
                                ]} >
                                    <Input placeholder="Thêm đường dẫn" />
                                </Form.Item>
                                <Form.Item label={<h3>{!!newsCategoryDetail ? "Sửa mô tả chi tiết" : "Thêm mô tả chi tiết"}</h3>} rules={[
                                    { required: true, message: 'Vui lòng nhập thông tin!' },
                                ]} >
                                    <TinymceEditor
                                        id="description"
                                        key="description"
                                        editorRef={descRef}
                                        value={newsCategoryDetail ? newsCategoryDetail?.des : ''}
                                        heightEditor="300px"
                                        baseFolder="news"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={6} md={8} xs={24}>
                                <div className="posts-modal-add-actions">
                                    <h3 className="posts-modal-add-actions-title">Thông tin cơ bản</h3>
                                    <div className="posts-modal-add-actions-body">
                                        <Form.Item initialValue={STATUS_PUBLIC} name="status" label={<h3>Trạng thái</h3>} rules={[
                                            { required: true, message: 'Vui lòng nhập thông tin!' },
                                        ]} >
                                            <Select
                                                style={{ width: 120 }}
                                                options={statuses}
                                            />
                                        </Form.Item>
                                        <Form.Item label={<h3>Danh mục cha</h3>} name="parentId" >
                                            <Select
                                                placeholder="Chọn danh mục"
                                                style={{ width: '100%' }}
                                                options={options}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Modal>
        </>
    )
}

export default CategoryNews;