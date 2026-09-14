import {
  apiCreateSv5tActivity,
  apiGetSv5tActivities,
  apiGetSv5tApplications,
  apiGetSv5tCampaigns,
  apiGetSv5tClaims,
  apiImportSv5tCsv,
  apiReviewSv5tClaim,
  apiUpsertSv5tCampaign,
  SV5T_CRITERIA,
} from "@/api/sv5tApi";
import {
  Badge, Button, Card, Col, DatePicker, Form, Input, InputNumber, message, Modal,
  Radio, Row, Select, Space, Statistic, Table, Tabs, Tag, Upload,
} from "antd";
import { UploadOutlined, CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";

const { TabPane } = Tabs;

const resultTag = (status: string) => {
  if (status === "PASSED") return <Tag color="green">Đạt</Tag>;
  if (status === "PENDING") return <Tag color="gold">Chờ duyệt</Tag>;
  return <Tag color="red">Chưa đạt</Tag>;
};

export default function Sv5tApplicationPageView() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [campaignId, setCampaignId] = useState<string>();
  const [activities, setActivities] = useState<any[]>([]);
  const [claims, setClaims] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [campaignModal, setCampaignModal] = useState(false);
  const [activityModal, setActivityModal] = useState(false);
  const [formCampaign] = Form.useForm();
  const [formActivity] = Form.useForm();
  const [csvFile, setCsvFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  const selectedCampaign = useMemo(() => campaigns.find((c) => c._id === campaignId), [campaigns, campaignId]);

  const loadCampaigns = async () => {
    const res = await apiGetSv5tCampaigns();
    if (res?.status === 0) {
      setCampaigns(res.data || []);
      setCampaignId((old) => old || res.data?.[0]?._id);
    }
  };

  const loadCampaignData = async (id?: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const [a, c, app] = await Promise.all([
        apiGetSv5tActivities(id),
        apiGetSv5tClaims(id, 0),
        apiGetSv5tApplications(id),
      ]);
      setActivities(a?.data || []);
      setClaims(c?.data || []);
      setApplications(app?.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadCampaigns(); }, []);
  useEffect(() => { loadCampaignData(campaignId); }, [campaignId]);

  const createCampaign = async () => {
    const values = await formCampaign.validateFields();
    const criteria = SV5T_CRITERIA.map((c) => ({
      ...c,
      minVerifiedActivities: Number(values[`min_${c.key}`] ?? 1),
    }));
    const res = await apiUpsertSv5tCampaign({
      title: values.title,
      academicYear: values.academicYear,
      status: 1,
      submitFrom: values.period?.[0]?.valueOf() || 0,
      submitTo: values.period?.[1]?.valueOf() || 0,
      criteria,
    });
    if (res?.status === 0) {
      message.success("Đã tạo đợt xét Sinh viên 5 tốt");
      setCampaignModal(false); formCampaign.resetFields(); await loadCampaigns();
    } else message.error("Không tạo được đợt xét");
  };

  const createActivity = async () => {
    if (!campaignId) return;
    const values = await formActivity.validateFields();
    if (values.verificationMode === "AUTO_LIST" && !csvFile) {
      message.warning("Nếu chọn auto-check, bạn cần tải CSV. Nếu chưa có danh sách, hãy chọn manual-check.");
      return;
    }
    const res = await apiCreateSv5tActivity({
      campaignId,
      title: values.title,
      criterionKey: values.criterionKey,
      organizer: values.organizer,
      activityDate: values.activityDate?.valueOf() || 0,
      verificationMode: values.verificationMode,
      status: 1,
    });
    if (res?.status !== 0) return message.error("Không tạo được hoạt động");
    if (values.verificationMode === "AUTO_LIST") {
      if (!csvFile) return message.warning("Hoạt động đã tạo nhưng chưa có CSV. Có thể tải CSV sau.");
      const imported = await apiImportSv5tCsv(res.data._id, csvFile);
      if (imported?.status === 0) message.success(`Đã tạo hoạt động và auto-check ${imported.data.total} sinh viên`);
      else message.error(imported?.message || "Không đọc được CSV");
    } else message.success("Đã tạo hoạt động manual-check");
    setActivityModal(false); formActivity.resetFields(); setCsvFile(undefined); await loadCampaignData(campaignId);
  };

  const reviewClaim = async (claim: any, status: number) => {
    const res = await apiReviewSv5tClaim(claim._id, { status });
    if (res?.status === 0) {
      message.success(status === 1 ? "Đã duyệt minh chứng" : "Đã từ chối minh chứng");
      await loadCampaignData(campaignId);
    }
  };

  const activityColumns: any[] = [
    { title: "Hoạt động", dataIndex: "title" },
    { title: "Tiêu chí", dataIndex: "criterionKey", render: (v) => SV5T_CRITERIA.find((c) => c.key === v)?.title || v },
    { title: "Ngày", dataIndex: "activityDate", render: (v) => v ? moment(v).format("DD/MM/YYYY") : "" },
    { title: "Cách check", dataIndex: "verificationMode", render: (v) => v === "AUTO_LIST" ? <Tag color="blue">CSV tự động</Tag> : <Tag color="gold">Minh chứng PDF</Tag> },
    { title: "Đã auto-check", dataIndex: "participantCount", align: "center" },
    { title: "Tải/ghi đè CSV", render: (_, r) => <Upload beforeUpload={async (file) => { const x = await apiImportSv5tCsv(r._id, file as any); x?.status === 0 ? message.success(`Đã check ${x.data.total} SV`) : message.error(x?.message); await loadCampaignData(campaignId); return false; }} showUploadList={false} accept=".csv"><Button size="small" icon={<UploadOutlined />}>CSV</Button></Upload> },
  ];

  const claimColumns: any[] = [
    { title: "MSSV", dataIndex: "studentId", width: 120 },
    { title: "Họ tên", dataIndex: "fullName", width: 180 },
    { title: "Hoạt động", dataIndex: "title" },
    { title: "Tiêu chí", dataIndex: "criterionKey", render: (v) => SV5T_CRITERIA.find((c) => c.key === v)?.title || v },
    { title: "Nguồn", dataIndex: "source", render: (v) => v === "SUGGESTED" ? <Tag color="purple">SV đề xuất</Tag> : <Tag>Hoạt động có sẵn</Tag> },
    { title: "Minh chứng", dataIndex: "evidenceUrl", render: (v) => v ? <a href={v} target="_blank" rel="noreferrer">Mở PDF</a> : "-" },
    { title: "Duyệt", fixed: "right", render: (_, r) => <Space><Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => reviewClaim(r, 1)}>Duyệt</Button><Button danger size="small" icon={<CloseOutlined />} onClick={() => reviewClaim(r, -1)}>Từ chối</Button></Space> },
  ];

  const applicationColumns: any[] = [
    { title: "MSSV", dataIndex: "studentId" },
    { title: "Họ tên", dataIndex: "fullName" },
    { title: "Nộp lúc", dataIndex: "submittedAt", render: (v) => moment(v).format("HH:mm DD/MM/YYYY") },
    { title: "Kết quả hiện tại", dataIndex: "resultStatus", render: resultTag },
    { title: "Tính lại", dataIndex: "lastCalculatedAt", render: (v) => moment(v).format("HH:mm DD/MM/YYYY") },
  ];

  return <div style={{ padding: 24 }}>
    <Row justify="space-between" align="middle" gutter={[16, 16]}>
      <Col><h2>Hồ sơ Sinh viên 5 tốt</h2></Col>
      <Col><Space>
        <Select style={{ width: 300 }} value={campaignId} onChange={setCampaignId} placeholder="Chọn đợt xét" options={campaigns.map((c) => ({ value: c._id, label: `${c.title} (${c.academicYear})` }))} />
        <Button icon={<PlusOutlined />} onClick={() => setCampaignModal(true)}>Tạo đợt xét</Button>
      </Space></Col>
    </Row>

    {selectedCampaign && <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={8}><Card><Statistic title="Hoạt động" value={activities.length} /></Card></Col>
      <Col span={8}><Card><Statistic title="Minh chứng chờ duyệt" value={claims.length} /></Card></Col>
      <Col span={8}><Card><Statistic title="Hồ sơ đã nộp" value={applications.length} /></Card></Col>
    </Row>}

    <Card>
      <Tabs>
        <TabPane tab="Hoạt động & auto-check" key="activities">
          <div style={{ marginBottom: 12 }}><Button type="primary" onClick={() => setActivityModal(true)} disabled={!campaignId}>Thêm hoạt động</Button></div>
          <Table rowKey="_id" loading={loading} dataSource={activities} columns={activityColumns} scroll={{ x: 1000 }} />
        </TabPane>
        <TabPane tab={<span>Chờ duyệt <Badge count={claims.length} /></span>} key="claims">
          <Table rowKey="_id" loading={loading} dataSource={claims} columns={claimColumns} scroll={{ x: 1100 }} />
        </TabPane>
        <TabPane tab="Hồ sơ đã nộp" key="applications">
          <Table rowKey="_id" loading={loading} dataSource={applications} columns={applicationColumns} />
        </TabPane>
      </Tabs>
    </Card>

    <Modal visible={campaignModal} title="Tạo đợt xét Sinh viên 5 tốt" onCancel={() => setCampaignModal(false)} onOk={createCampaign} width={700}>
      <Form layout="vertical" form={formCampaign}>
        <Row gutter={12}><Col span={14}><Form.Item name="title" label="Tên đợt xét" rules={[{ required: true }]}><Input placeholder="Sinh viên 5 tốt cấp Trường 2025–2026" /></Form.Item></Col><Col span={10}><Form.Item name="academicYear" label="Năm học" rules={[{ required: true }]}><Input placeholder="2025-2026" /></Form.Item></Col></Row>
        <Form.Item name="period" label="Thời gian nhận hồ sơ"><DatePicker.RangePicker style={{ width: "100%" }} /></Form.Item>
        <h4>Số hoạt động đã xác minh tối thiểu theo tiêu chí</h4>
        <Row gutter={12}>{SV5T_CRITERIA.map((c) => <Col span={8} key={c.key}><Form.Item name={`min_${c.key}`} label={c.title} initialValue={1}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item></Col>)}</Row>
      </Form>
    </Modal>

    <Modal visible={activityModal} title="Thêm hoạt động SV5T" onCancel={() => setActivityModal(false)} onOk={createActivity} width={650}>
      <Form layout="vertical" form={formActivity} initialValues={{ verificationMode: "AUTO_LIST" }}>
        <Form.Item name="title" label="Tên hoạt động" rules={[{ required: true }]}><Input /></Form.Item>
        <Row gutter={12}><Col span={12}><Form.Item name="criterionKey" label="Tiêu chí" rules={[{ required: true }]}><Select options={SV5T_CRITERIA.map((c) => ({ value: c.key, label: c.title }))} /></Form.Item></Col><Col span={12}><Form.Item name="activityDate" label="Ngày tổ chức"><DatePicker style={{ width: "100%" }} /></Form.Item></Col></Row>
        <Form.Item name="organizer" label="Đơn vị tổ chức"><Input /></Form.Item>
        <Form.Item name="verificationMode" label="Cách xác minh" rules={[{ required: true }]}><Radio.Group><Radio value="AUTO_LIST">Có danh sách CSV → auto-check</Radio><Radio value="MANUAL">Không có danh sách → SV nộp PDF</Radio></Radio.Group></Form.Item>
        <Form.Item noStyle shouldUpdate={(p, c) => p.verificationMode !== c.verificationMode}>{({ getFieldValue }) => getFieldValue("verificationMode") === "AUTO_LIST" ? <Form.Item label="CSV gồm cột MSSV và Họ tên"><Upload beforeUpload={(file) => { setCsvFile(file as any); return false; }} maxCount={1} accept=".csv"><Button icon={<UploadOutlined />}>Chọn CSV</Button></Upload></Form.Item> : null}</Form.Item>
      </Form>
    </Modal>
  </div>;
}
