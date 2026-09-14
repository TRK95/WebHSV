import { apiGetNewsCategory } from "@/api/newsApi";
import NewsCategory from "@/models/NewsCategory";
import { RESPONSE_SUCCESS, STATUS_PUBLIC } from "@/utils/contrants";
import NonAccentVietnamese from "@/utils/nonAccentVN";
import { message, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { NewsCategoryModel } from "./NewsPageView/CategoryNews";

const TableView = (props: { data: NewsCategoryModel, columns: ColumnsType<NewsCategoryModel> }) => {
    const { data, columns } = props
    const [dataView, setDataView] = useState<NewsCategoryModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        searchNewsCategory()
    }, [])
    const searchNewsCategory = async () => {
        try {
            const categoryChild = await apiGetNewsCategory({
                // parentId: Number(data.id) || 0,
                parentId: data._id || "0",
                status: data.status
            })
            if (categoryChild.status === RESPONSE_SUCCESS) {

                setDataView(categoryChild.data.map((o, i) => ({
                    ...o,
                    key: i
                })))
                setLoading(false)
            } else {
                message.error('không thể tải danh mục này')
            }
        } catch (error) {
            message.error('lỗi server')
            console.log(error);
        }
    }
    return (
        <div style={{
            marginTop: '20px',

        }}>
            <Table
                bordered
                loading={loading}
                columns={columns}
                dataSource={dataView}
            // rowClassName={(record, index) => "table_child--yellow"}
            // expandable={{
            //     expandedRowRender: (record) => (
            //     <TableView
            //         data = {record}
            //         columns={columns}
            //     />),
            //     rowExpandable: record => Number(record.id) !== 0,
            // }}
            />
        </div>
    )
}

export default TableView