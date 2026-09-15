import { DEFAULT_SV5T_CRITERIA } from "../models/Sv5t";

declare const fetch: any;

const API_ENDPOINT = (process.env.DEMO_API_ENDPOINT || "https://webhsv.onrender.com").replace(/\/$/, "");
const DEMO_IMAGE = "/images/demo/hsv-soict-avatar.png";
const STATUS_PUBLIC = 1;
const STATUS_REGISTER = 2;
const TYPE_CLUB = 0;
const CONTENT_TYPE_NORMAL = 0;
const CONTENT_TYPE_FILE = 1;
const CONTENT_TYPE_INTRODUCE = 4;
const CONTENT_TYPE_SV5T = 5;

const time = (value: string) => new Date(value).getTime();
const url = (path: string, query?: Record<string, any>) => {
  const target = new URL(`${API_ENDPOINT}/api/${path}`);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) target.searchParams.set(key, String(value));
  });
  return target.href;
};

const request = async (path: string, init?: any, query?: Record<string, any>) => {
  const res = await fetch(url(path, query), {
    method: init?.method || "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const data = await res.json();
  if (!res.ok || data?.status === -1) {
    throw new Error(`${path} failed: ${JSON.stringify(data)}`);
  }
  return data;
};

const get = (path: string, query?: Record<string, any>) => request(path, { method: "GET" }, query);
const post = (path: string, body?: any, query?: Record<string, any>) => request(path, { method: "POST", body: JSON.stringify(body || {}) }, query);

const content = (title: string, body: string) => `
  <h2>${title}</h2>
  <p>${body}</p>
  <p>Đây là dữ liệu demo phục vụ chạy thử hệ thống Hội Sinh viên SOICT. Nội dung có thể chỉnh sửa trực tiếp trong CMS và sẽ hiển thị trên Web sau khi lưu.</p>
`;

const upsertCategory = async (type: number, title: string, slug: string, des: string, index: number) => {
  const existed = await get("news/getCategoryNewsBySlug", { slug });
  const payload = {
    _id: existed?.data?._id,
    title,
    slug,
    des,
    type,
    index,
    status: STATUS_PUBLIC,
    createDate: time(`2026-09-${10 + index}T08:00:00+07:00`),
  };
  return (await post("news/updateNewsCategory", payload)).data;
};

const upsertNews = async (category: any, item: any) => {
  const existed = await get("news/getNewsBySlug", { slug: item.slug });
  const news = (await post("news/updateNews", {
    _id: existed?.data?._id,
    title: item.title,
    slug: item.slug,
    shortDes: item.shortDes,
    content: content(item.title, item.shortDes),
    avatar: DEMO_IMAGE,
    writer: "Hội Sinh viên SOICT",
    contentType: item.contentType,
    status: STATUS_PUBLIC,
    createDate: item.createDate,
    docUrl: item.docUrl || "",
  })).data;

  const currentCategories = news?._id ? await post("news/getCategoriesOfNew", {}, { newId: news._id }) : { data: [] };
  const isLinked = currentCategories?.data?.some((current: any) => String(current?._id) === String(category?._id));
  if (news?._id && category?._id && !isLinked) {
    await post("news/addOrRemoveNewFromCategory", {}, { newsId: news._id, adds: category._id });
  }
  return news;
};

const seedNewsLikeContent = async () => {
  const newsCategories = [
    await upsertCategory(0, "Hoạt động Hội Sinh viên", "hoat-dong-hoi-sinh-vien", "Tin nhanh về các chương trình, chiến dịch và hoạt động thường xuyên của Hội Sinh viên Trường CNTT&TT.", 1),
    await upsertCategory(0, "Học tập - Nghiên cứu", "hoc-tap-nghien-cuu", "Các hoạt động học thuật, nghiên cứu khoa học, cuộc thi công nghệ và hỗ trợ sinh viên học tập.", 2),
    await upsertCategory(0, "Gương mặt SOICT", "guong-mat-soict", "Câu chuyện sinh viên tiêu biểu, tập thể nổi bật và các dấu ấn trong cộng đồng SOICT.", 3),
  ];
  const introCategories = [
    await upsertCategory(4, "Trường Đại học Bách khoa Hà Nội", "truong-dai-hoc-bach-khoa-ha-noi", "Thông tin giới thiệu tổng quan về Đại học Bách khoa Hà Nội và môi trường sinh viên.", 1),
    await upsertCategory(4, "Hội Sinh viên Trường CNTT&TT", "hoi-sinh-vien-truong-cntt-tt", "Vai trò, cơ cấu và định hướng hoạt động của Hội Sinh viên Trường CNTT&TT.", 2),
  ];
  const documentCategories = [
    await upsertCategory(3, "Biểu mẫu Hội viên", "bieu-mau-hoi-vien", "Các biểu mẫu phục vụ hội viên, chi hội và câu lạc bộ.", 1),
    await upsertCategory(3, "Quy chế - Quy định", "quy-che-quy-dinh", "Văn bản hướng dẫn, quy định nội bộ và tài liệu điều hành.", 2),
  ];
  const sv5tCategories = [
    await upsertCategory(5, "Giới thiệu Sinh viên 5 tốt", "gioi-thieu", "Tổng quan phong trào Sinh viên 5 tốt cấp Trường và cách tham gia.", 1),
    await upsertCategory(5, "Tiêu chí xét chọn", "tieu-chi-xet-chon", "Các tiêu chí Đạo đức tốt, Học tập tốt, Thể lực tốt, Tình nguyện tốt và Hội nhập tốt.", 2),
    await upsertCategory(5, "Hoạt động minh chứng", "hoat-dong-minh-chung", "Danh sách hoạt động gợi ý để sinh viên tích lũy minh chứng cho hồ sơ Sinh viên 5 tốt.", 3),
  ];

  const items = [
    [newsCategories[0], "Hội Sinh viên SOICT khởi động năm học 2026 - 2027", "hoi-sinh-vien-soict-khoi-dong-nam-hoc-2026-2027", "Chuỗi hoạt động đầu năm tập trung vào kết nối tân sinh viên, giới thiệu các ban chuyên môn và định hướng phong trào.", CONTENT_TYPE_NORMAL, "2026-09-14T09:00:00+07:00"],
    [newsCategories[1], "Workshop Git, Docker và quy trình làm sản phẩm cho sinh viên năm hai", "workshop-git-docker-quy-trinh-lam-san-pham", "Buổi thực hành giúp sinh viên nắm quy trình cộng tác kỹ thuật, quản lý phiên bản và triển khai thử nghiệm.", CONTENT_TYPE_NORMAL, "2026-09-13T14:00:00+07:00"],
    [newsCategories[2], "Sinh viên SOICT đạt giải cao tại cuộc thi sáng tạo công nghệ trẻ", "sinh-vien-soict-dat-giai-cao-cuoc-thi-sang-tao-cong-nghe-tre", "Nhóm sinh viên xây dựng nền tảng hỗ trợ học tập cá nhân hóa và được đánh giá cao ở tính ứng dụng.", CONTENT_TYPE_NORMAL, "2026-09-12T18:30:00+07:00"],
    [introCategories[0], "Không gian học tập và nghiên cứu tại Bách khoa Hà Nội", "khong-gian-hoc-tap-nghien-cuu-bach-khoa-ha-noi", "Bách khoa Hà Nội là môi trường đào tạo kỹ thuật hàng đầu, nơi sinh viên được khuyến khích học tập chủ động và nghiên cứu ứng dụng.", CONTENT_TYPE_INTRODUCE, "2026-09-11T08:30:00+07:00"],
    [introCategories[1], "Hội Sinh viên Trường CNTT&TT: kết nối, hỗ trợ và lan tỏa", "hoi-sinh-vien-truong-cntt-tt-ket-noi-ho-tro-lan-toa", "Hội Sinh viên là cầu nối giữa sinh viên, chi hội, câu lạc bộ và nhà trường trong các hoạt động phong trào.", CONTENT_TYPE_INTRODUCE, "2026-09-10T10:00:00+07:00"],
    [documentCategories[0], "Mẫu đăng ký tham gia Hội Sinh viên SOICT", "mau-dang-ky-tham-gia-hoi-sinh-vien-soict", "Biểu mẫu demo dùng cho hội viên mới, có thể thay bằng file chính thức trong CMS.", CONTENT_TYPE_FILE, "2026-09-09T09:15:00+07:00", "/documents/demo/mau-dang-ky-hoi-vien.pdf"],
    [documentCategories[1], "Quy trình xét duyệt hoạt động Sinh viên 5 tốt cấp Trường", "quy-trinh-xet-duyet-hoat-dong-sinh-vien-5-tot-cap-truong", "Tài liệu mô tả các bước đề xuất, kiểm tra minh chứng và xác nhận hoạt động trong năm học.", CONTENT_TYPE_FILE, "2026-09-08T15:00:00+07:00", "/documents/demo/quy-trinh-sv5t.pdf"],
    [sv5tCategories[0], "Phong trào Sinh viên 5 tốt năm học 2026 - 2027", "phong-trao-sinh-vien-5-tot-nam-hoc-2026-2027", "Thông tin tổng quan về phong trào, mốc thời gian nộp hồ sơ và cách theo dõi tiến độ xét chọn.", CONTENT_TYPE_SV5T, "2026-09-14T16:00:00+07:00"],
    [sv5tCategories[1], "Gợi ý chuẩn bị minh chứng cho 5 tiêu chí", "goi-y-chuan-bi-minh-chung-cho-5-tieu-chi", "Sinh viên nên lưu lại giấy chứng nhận, danh sách tham gia và kết quả học tập ngay sau mỗi hoạt động.", CONTENT_TYPE_SV5T, "2026-09-13T11:00:00+07:00"],
  ];

  for (const [category, title, slug, shortDes, contentType, createDate, docUrl] of items) {
    await upsertNews(category, { title, slug, shortDes, contentType, createDate: time(createDate as string), docUrl });
  }
};

const upsertClubCategory = async (item: any) => {
  const existed = await get("club/getClubCategoryBySlug", { slug: item.slug });
  return (await post("club/updateClubCategory", { ...item, _id: existed?.data?._id })).data;
};

const upsertClub = async (item: any) => {
  const existed = await get("club/getClubBySlug", { slug: item.slug });
  return (await post("club/updateClub", { ...item, _id: existed?.data?._id })).data;
};

const seedClubs = async () => {
  const categories = [
    await upsertClubCategory({ name: "Ban Tổ chức và Xây dựng Hội", slug: "ban-to-chuc-va-xay-dung-hoi", des: "<p>Phụ trách phát triển hội viên, kết nối chi hội và hỗ trợ vận hành các hoạt động chung của Hội Sinh viên.</p>", status: STATUS_PUBLIC, createDate: time("2026-09-11T08:00:00+07:00"), clubNum: 2, type: TYPE_CLUB, avatar: DEMO_IMAGE }),
    await upsertClubCategory({ name: "Câu lạc bộ học thuật", slug: "cau-lac-bo-hoc-thuat", des: "<p>Nơi sinh viên cùng học, cùng làm dự án, luyện thi và chia sẻ kinh nghiệm nghiên cứu công nghệ.</p>", status: STATUS_PUBLIC, createDate: time("2026-09-12T08:00:00+07:00"), clubNum: 2, type: TYPE_CLUB, avatar: DEMO_IMAGE }),
    await upsertClubCategory({ name: "Đội nhóm tình nguyện", slug: "doi-nhom-tinh-nguyen", des: "<p>Các đội nhóm lan tỏa tinh thần trách nhiệm cộng đồng qua chiến dịch tình nguyện, hỗ trợ tân sinh viên và hoạt động xã hội.</p>", status: STATUS_PUBLIC, createDate: time("2026-09-13T08:00:00+07:00"), clubNum: 2, type: TYPE_CLUB, avatar: DEMO_IMAGE }),
  ];

  const clubs = [
    ["Liên Chi hội Sinh viên SOICT", "lien-chi-hoi-sinh-vien-soict", categories[0], "Điều phối hoạt động chi hội, hỗ trợ cán bộ lớp và kết nối sinh viên trong toàn Trường.", 320, "Nguyễn Minh Anh"],
    ["Ban Truyền thông SOICT", "ban-truyen-thong-soict", categories[0], "Sản xuất nội dung, truyền thông sự kiện và xây dựng hình ảnh sinh viên SOICT năng động.", 48, "Trần Hà My"],
    ["CLB Lập trình SOICT", "clb-lap-trinh-soict", categories[1], "Không gian luyện thuật toán, làm sản phẩm phần mềm và chia sẻ kinh nghiệm thực tập.", 86, "Phạm Đức Long"],
    ["CLB An toàn thông tin SOICT", "clb-an-toan-thong-tin-soict", categories[1], "Tổ chức seminar, CTF nội bộ và hỗ trợ sinh viên tiếp cận lĩnh vực an toàn thông tin.", 64, "Lê Quang Huy"],
    ["Đội Sinh viên tình nguyện SOICT", "doi-sinh-vien-tinh-nguyen-soict", categories[2], "Thực hiện các hoạt động hỗ trợ cộng đồng, tiếp sức mùa thi và mùa hè xanh.", 120, "Đỗ Khánh Linh"],
    ["Đội Hỗ trợ Tân sinh viên", "doi-ho-tro-tan-sinh-vien", categories[2], "Đồng hành cùng sinh viên khóa mới trong tuần sinh hoạt công dân và giai đoạn nhập học.", 72, "Vũ Nhật Nam"],
  ];

  for (const [name, slug, category, shortDes, memNum, presidentName] of clubs) {
    await upsertClub({
      name,
      slug,
      shortDes,
      des: content(name as string, shortDes as string),
      categoryId: (category as any)._id,
      categoryName: (category as any).slug,
      status: STATUS_PUBLIC,
      ownerId: "demo-seed",
      createDate: time("2026-09-01T08:00:00+07:00"),
      type: TYPE_CLUB,
      memNum,
      avatar: DEMO_IMAGE,
      showMem: 1,
      settingStatus: STATUS_REGISTER,
      president: { fullName: presidentName, email: `${slug}@soict.hust.edu.vn`, phoneNumber: "0900000000" },
      presidentId: "",
      contactInfo: `<p>Email: ${slug}@soict.hust.edu.vn</p><p>Fanpage: Hội Sinh viên SOICT</p>`,
    });
  }
};

const seedEvents = async () => {
  const events = [
    ["Ngày hội chào tân sinh viên SOICT 2026", "ngay-hoi-chao-tan-sinh-vien-soict-2026", "Hội Sinh viên Trường CNTT&TT phối hợp cùng các câu lạc bộ trực thuộc.", "2026-09-25T08:00:00+07:00", "2026-09-25T17:00:00+07:00", 250],
    ["Tech Talk: Hành trang thực tập cho sinh viên CNTT", "tech-talk-hanh-trang-thuc-tap-cho-sinh-vien-cntt", "CLB Lập trình SOICT và Ban Học tập - Nghiên cứu.", "2026-10-03T18:30:00+07:00", "2026-10-03T21:00:00+07:00", 180],
    ["Giải chạy SOICT Run for Five Good", "giai-chay-soict-run-for-five-good", "Hội Sinh viên SOICT và Đội Sinh viên tình nguyện SOICT.", "2026-10-12T06:00:00+07:00", "2026-10-12T09:00:00+07:00", 300],
  ];

  for (const [title, slug, hostBy, fromDate, toDate, memNum] of events) {
    const existed = await get("events/getEventsBySlug", { slug });
    await post("events/updateEvent", {
      _id: existed?.data?._id,
      title,
      slug,
      hostBy: `<p>${hostBy}</p>`,
      fromDate: time(fromDate as string),
      toDate: time(toDate as string),
      memNum,
      content: content(title as string, "Sự kiện demo có lịch trình, ban tổ chức và nội dung mô tả giống một hoạt động thật để kiểm tra giao diện Web/CMS."),
      criteria: "<ul><li>Sinh viên Trường CNTT&TT quan tâm tới hoạt động.</li><li>Đăng ký trước thời hạn và tham gia đúng giờ.</li></ul>",
      avatar: DEMO_IMAGE,
      status: STATUS_PUBLIC,
      settingStatus: STATUS_REGISTER,
      registerFromDate: time("2026-09-15T08:00:00+07:00"),
      registerToDate: time("2026-10-10T23:59:59+07:00"),
    });
  }
};

const seedSv5t = async () => {
  const campaigns = await get("sv5t/campaigns");
  const current = campaigns?.data?.find((item: any) => item.academicYear === "2026-2027");
  const campaign = (await post("sv5t/campaigns/upsert", {
    _id: current?._id,
    title: "Sinh viên 5 tốt SOICT 2026 - 2027",
    academicYear: "2026-2027",
    status: STATUS_PUBLIC,
    submitFrom: time("2026-09-15T00:00:00+07:00"),
    submitTo: time("2027-05-31T23:59:59+07:00"),
    criteria: DEFAULT_SV5T_CRITERIA,
  })).data;

  const existingActivities = await get("sv5t/activities", { campaignId: campaign._id });
  const activities = [
    ["DAO_DUC", "Tuần sinh hoạt công dân và văn hóa học đường SOICT", "Hội Sinh viên SOICT", "2026-09-20T08:00:00+07:00"],
    ["HOC_TAP", "Workshop phương pháp học tập và nghiên cứu khoa học", "Ban Học tập - Nghiên cứu", "2026-10-05T18:30:00+07:00"],
    ["THE_LUC", "Giải chạy SOICT Run for Five Good", "Đội Sinh viên tình nguyện SOICT", "2026-10-12T06:00:00+07:00"],
    ["TINH_NGUYEN", "Ngày Chủ nhật xanh tại khuôn viên Bách khoa", "Đội Sinh viên tình nguyện SOICT", "2026-10-18T07:30:00+07:00"],
    ["HOI_NHAP", "English Tech Sharing: Present your project", "CLB Lập trình SOICT", "2026-11-02T19:00:00+07:00"],
  ];

  for (const [criterionKey, title, organizer, activityDate] of activities) {
    const existed = existingActivities?.data?.find((item: any) => item.title === title);
    const payload = {
      _id: existed?._id,
      campaignId: campaign._id,
      title,
      criterionKey,
      organizer,
      activityDate: time(activityDate as string),
      verificationMode: "AUTO_LIST",
      status: STATUS_PUBLIC,
    };
    await post(existed?._id ? "sv5t/activities/update" : "sv5t/activities", payload);
  }
};

const main = async () => {
  console.log(`Seeding demo content through ${API_ENDPOINT}`);
  await seedNewsLikeContent();
  await seedClubs();
  await seedEvents();
  await seedSv5t();
  console.log("Demo content seeded successfully through API.");
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
