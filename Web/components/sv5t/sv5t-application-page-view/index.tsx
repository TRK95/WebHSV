import { Container } from "@mui/material";
import {
  Alert, Badge, Button, Card, Col, DatePicker, Descriptions, Empty, Form, Input,
  message, Modal, Progress, Row, Select, Space, Table, Tag, Upload,
} from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, FilePdfOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { setShowLoginPopup } from "../../../features/auth/auth.slice";
import customMaxWidthContainer from "../../../features/common/CustomMaxWidth";
import {
  apiCreateSv5tClaim, apiGetMySv5tDashboard, apiSubmitSv5tApplication,
  apiUploadSv5tEvidence, SV5T_CRITERIA,
} from "../../../utils/api/sv5tApi";

const resultView = (status?: string) => {
  if (status === "PASSED") return <Alert showIcon type="success" message="Hồ sơ hiện tại: ĐẠT" description="Bạn đã đủ số hoạt động đã được xác minh cho tất cả tiêu chí." />;
  if (status === "PENDING") return <Alert showIcon type="warning" message="Hồ sơ hiện tại: CHỜ DUYỆT" description="Nếu các minh chứng đang chờ được duyệt, hồ sơ sẽ đủ điều kiện." />;
  return <Alert showIcon type="error" message="Hồ sơ hiện tại: CHƯA ĐẠT" description="Bạn còn thiếu ít nhất một tiêu chí và chưa có đủ minh chứng đang chờ duyệt để bù phần thiếu." />;
};

export default function Sv5tApplicationPageView() {
  const dispatch = useDispatch();
  const student = useSelector((state) => state.authState.student);
  const reduxToken = useSelector((state) => state.authState.token);
  const [storedToken, setStoredToken] = useState<string>();
  const token = reduxToken || storedToken;
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [claimModal, setClaimModal] = useState(false);
  const [suggestModal, setSuggestModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>();
  const [pdf, setPdf] = useState<File>();
  const [formSuggest] = Form.useForm();

  const refresh = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await apiGetMySv5tDashboard(token);
      if (res?.status === 0) setData(res.data);
      else message.error(res?.message || "Không tải được hồ sơ SV5T");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (typeof window !== "undefined") setStoredToken(window.localStorage.getItem("token") || undefined);
  }, [reduxToken]);
  useEffect(() => { refresh(); }, [token]);

  const claimByActivity = useMemo(() => {
    const map: Record<string, any> = {};
    (data?.claims || []).forEach((c) => { if (c.activityId) map[String(c.activityId)] = c; });
    return map;
  }, [data]);

  const uploadAndCreateClaim = async (payload: any) => {
    if (!pdf) return message.warning("Bạn cần chọn file PDF minh chứng");
    const uploaded = await apiUploadSv5tEvidence(token, pdf);
    if (uploaded?.status !== 0) return message.error(uploaded?.message || "Không tải được PDF");
    const created = await apiCreateSv5tClaim(token, { ...payload, campaignId: data.campaign._id, evidenceObject: uploaded.data.evidenceObject });
    if (created?.status === 0) {
      message.success("Đã nộp minh chứng. Hoạt động đang chờ admin kiểm tra.");
      setPdf(undefined); setClaimModal(false); setSuggestModal(false); formSuggest.resetFields(); await refresh();
    } else message.error(created?.message || "Không nộp được minh chứng");
  };

  const submit = async () => {
    const res = await apiSubmitSv5tApplication(token, data.campaign._id);
    if (res?.status === 0) {
      message.success("Đã nộp hồ sơ và tính kết quả hiện tại");
      await refresh();
    } else message.error("Không nộp được hồ sơ");
  };

  if (!student || !token) return <Container maxWidth={customMaxWidthContainer()} style={{ paddingTop: 40, paddingBottom: 60 }}>
    <Alert
      type="info"
      showIcon
      message="Bạn cần đăng nhập bằng tài khoản sinh viên để nộp hồ sơ Sinh viên 5 tốt."
      action={<Button type="primary" onClick={() => dispatch(setShowLoginPopup(true))}>Đăng nhập</Button>}
    />
  </Container>;
  if (!data?.campaign) return <Container maxWidth={customMaxWidthContainer()} style={{ paddingTop: 40, paddingBottom: 60 }}><Empty description="Hiện chưa có đợt xét Sinh viên 5 tốt đang mở" /></Container>;

  const verifiedRows = (data.criteria || []).flatMap((c) => (c.verifiedItems || []).map((item, i) => ({
    key: `${c.key}-${i}-${item.activity?._id || item.claim?._id}`,
    criterion: c.title,
    title: item.activity?.title || item.claim?.title,
    date: item.activity?.activityDate || item.claim?.activityDate,
    source: item.source,
  })));

  const pendingClaims = (data.claims || []).filter((c) => c.status === 0);
  const availableManual = (data.manualActivities || []).filter((a) => !claimByActivity[String(a._id)]);

  return <Container maxWidth={customMaxWidthContainer()} style={{ paddingTop: 28, paddingBottom: 60 }}>
    <Row gutter={[16, 16]} align="middle" justify="space-between">
      <Col><h1 style={{ marginBottom: 4 }}>Hồ sơ Sinh viên 5 tốt</h1><div>{data.campaign.title} · {data.campaign.academicYear}</div></Col>
      <Col><Button size="large" type="primary" onClick={submit}>Nộp / cập nhật hồ sơ</Button></Col>
    </Row>

    <div style={{ marginTop: 18 }}>{resultView(data.resultStatus)}</div>
    {data.application && <Descriptions size="small" bordered style={{ marginTop: 12 }} column={{ xs: 1, sm: 2 }}>
      <Descriptions.Item label="Đã nộp">{moment(data.application.submittedAt).format("HH:mm DD/MM/YYYY")}</Descriptions.Item>
      <Descriptions.Item label="Kết quả được cập nhật">{moment(data.application.lastCalculatedAt).format("HH:mm DD/MM/YYYY")}</Descriptions.Item>
    </Descriptions>}

    <h2 style={{ marginTop: 28 }}>Tiến độ 5 tiêu chí</h2>
    <Row gutter={[12, 12]}>{(data.criteria || []).map((c) => {
      const percent = c.minVerifiedActivities > 0 ? Math.min(100, Math.round((c.verified / c.minVerifiedActivities) * 100)) : 100;
      return <Col xs={24} sm={12} md={8} key={c.key}><Card size="small" title={<Space>{c.passed ? <CheckCircleOutlined style={{ color: "green" }} /> : c.pending > 0 ? <ClockCircleOutlined style={{ color: "orange" }} /> : null}<span>{c.title}</span></Space>}>
        <Progress percent={percent} status={c.passed ? "success" : "active"} />
        <div>Đã xác minh: <b>{c.verified}/{c.minVerifiedActivities}</b>{c.pending > 0 && <> · Chờ duyệt: <b>{c.pending}</b></>}</div>
      </Card></Col>;
    })}</Row>

    <Card title="Hoạt động đã được tự động/ thủ công xác nhận" style={{ marginTop: 24 }}>
      <Table pagination={false} rowKey="key" dataSource={verifiedRows} columns={[
        { title: "Tiêu chí", dataIndex: "criterion" },
        { title: "Hoạt động", dataIndex: "title" },
        { title: "Ngày", dataIndex: "date", render: (v) => v ? moment(v).format("DD/MM/YYYY") : "" },
        { title: "Xác minh", dataIndex: "source", render: (v) => v === "AUTO_LIST" ? <Tag color="blue">Có tên trong CSV</Tag> : <Tag color="green">Admin đã duyệt PDF</Tag> },
      ] as any} locale={{ emptyText: "Chưa có hoạt động nào được xác minh" }} />
    </Card>

    <Card title="Hoạt động có sẵn nhưng cần nộp minh chứng" style={{ marginTop: 20 }} extra={<Button icon={<PlusOutlined />} onClick={() => { setPdf(undefined); setSuggestModal(true); }}>Đề xuất hoạt động khác</Button>}>
      <Table pagination={false} rowKey="_id" dataSource={availableManual} columns={[
        { title: "Hoạt động", dataIndex: "title" },
        { title: "Tiêu chí", dataIndex: "criterionKey", render: (v) => SV5T_CRITERIA.find((c) => c.key === v)?.title || v },
        { title: "Đơn vị tổ chức", dataIndex: "organizer" },
        { title: "Ngày", dataIndex: "activityDate", render: (v) => v ? moment(v).format("DD/MM/YYYY") : "" },
        { title: "", render: (_, r) => <Button icon={<FilePdfOutlined />} onClick={() => { setSelectedActivity(r); setPdf(undefined); setClaimModal(true); }}>Nộp PDF</Button> },
      ] as any} />
    </Card>

    <Card title={<Space>Hoạt động đang chờ admin kiểm tra <Badge count={pendingClaims.length} /></Space>} style={{ marginTop: 20 }}>
      <Table pagination={false} rowKey="_id" dataSource={pendingClaims} columns={[
        { title: "Hoạt động", dataIndex: "title" },
        { title: "Tiêu chí", dataIndex: "criterionKey", render: (v) => SV5T_CRITERIA.find((c) => c.key === v)?.title || v },
        { title: "Nộp lúc", dataIndex: "createDate", render: (v) => moment(v).format("HH:mm DD/MM/YYYY") },
        { title: "Minh chứng", dataIndex: "evidenceUrl", render: (v) => v ? <a href={v} target="_blank" rel="noreferrer">Xem PDF</a> : "-" },
        { title: "Trạng thái", render: () => <Tag color="gold">Chờ duyệt</Tag> },
      ] as any} locale={{ emptyText: "Không có hoạt động nào đang chờ duyệt" }} />
    </Card>

    <Modal destroyOnClose visible={claimModal} title={`Nộp minh chứng: ${selectedActivity?.title || ""}`} onCancel={() => setClaimModal(false)} onOk={() => uploadAndCreateClaim({ activityId: selectedActivity?._id })} okText="Nộp minh chứng">
      <Alert type="info" showIcon message="Chỉ nhận file PDF. Minh chứng sẽ ở trạng thái chờ duyệt cho tới khi admin kiểm tra." style={{ marginBottom: 14 }} />
      <Upload beforeUpload={(file) => { setPdf(file as any); return false; }} maxCount={1} accept="application/pdf,.pdf"><Button icon={<UploadOutlined />}>Chọn PDF minh chứng</Button></Upload>
    </Modal>

    <Modal destroyOnClose visible={suggestModal} title="Đề xuất thêm hoạt động" onCancel={() => setSuggestModal(false)} onOk={async () => { const v = await formSuggest.validateFields(); await uploadAndCreateClaim({ ...v, activityDate: v.activityDate?.valueOf(), source: "SUGGESTED" }); }} okText="Gửi đề xuất" width={620}>
      <Form layout="vertical" form={formSuggest}>
        <Form.Item name="title" label="Tên hoạt động" rules={[{ required: true }]}><Input /></Form.Item>
        <Row gutter={12}><Col span={12}><Form.Item name="criterionKey" label="Tiêu chí đề xuất" rules={[{ required: true }]}><Select options={(data.campaign.criteria || SV5T_CRITERIA).map((c) => ({ value: c.key, label: c.title }))} /></Form.Item></Col><Col span={12}><Form.Item name="activityDate" label="Ngày tham gia"><DatePicker style={{ width: "100%" }} /></Form.Item></Col></Row>
        <Form.Item name="organizer" label="Đơn vị tổ chức"><Input /></Form.Item>
        <Form.Item label="PDF minh chứng" required><Upload beforeUpload={(file) => { setPdf(file as any); return false; }} maxCount={1} accept="application/pdf,.pdf"><Button icon={<UploadOutlined />}>Chọn PDF</Button></Upload></Form.Item>
      </Form>
    </Modal>
  </Container>;
}
