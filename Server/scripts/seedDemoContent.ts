import mongoose from "mongoose";
import dotenv from "../utils/dotenv";
import { CategoryModel } from "../database/mongo/Category";
import { NewModel } from "../database/mongo/New";
import { NewInCategoryModel } from "../database/mongo/NewInCategory";
import { ClubCategoryModel } from "../database/mongo/ClubCategory";
import { ClubModel } from "../database/mongo/Club";
import { EventModel } from "../database/mongo/Event";
import { Sv5tActivityModel, Sv5tCampaignModel, Sv5tParticipantModel } from "../database/mongo/Sv5t";
import { DEFAULT_SV5T_CRITERIA } from "../models/Sv5t";
import {
  CONTENT_TYPE_FILE,
  CONTENT_TYPE_NORMAL,
  STATUS_PUBLIC,
  STATUS_REGISTER,
  TYPE_CLUB,
} from "../utils/contrants";

dotenv.config();

const DEMO_IMAGE = "/images/demo/hsv-soict-avatar.png";
const OWNER_ID = "demo-seed";

const content = (title: string, body: string) => `
  <h2>${title}</h2>
  <p>${body}</p>
  <p>Đây là dữ liệu demo phục vụ chạy thử hệ thống Hội Sinh viên SOICT. Nội dung có thể chỉnh sửa trực tiếp trong CMS và sẽ hiển thị trên Web sau khi lưu.</p>
`;

const time = (value: string) => new Date(value).getTime();

const connect = async () => {
  const {
    DB_URL,
    DB_HOST = "127.0.0.1",
    DB_PORT = "27017",
    DB_NAME,
  } = process.env;

  const mongoUrl = DB_URL || `mongodb://${DB_HOST}:${DB_PORT}`;
  await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    dbName: DB_NAME,
  });
};

const upsert = async (model: any, filter: any, data: any) => {
  return model.findOneAndUpdate(
    filter,
    { $set: data },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

const upsertCategory = (type: number, title: string, slug: string, des: string, index: number) => {
  return upsert(CategoryModel, { slug, type }, {
    title,
    slug,
    des,
    type,
    index,
    status: STATUS_PUBLIC,
    createDate: time(`2026-09-${10 + index}T08:00:00+07:00`),
  });
};

const upsertNews = async (
  category: any,
  item: {
    title: string;
    slug: string;
    shortDes: string;
    contentType: number;
    createDate: number;
    docUrl?: string;
  }
) => {
  const news = await upsert(NewModel, { slug: item.slug }, {
    title: item.title,
    slug: item.slug,
    shortDes: item.shortDes,
    content: content(item.title, item.shortDes),
    avatar: DEMO_IMAGE,
    ownerId: OWNER_ID,
    contentType: item.contentType,
    status: STATUS_PUBLIC,
    createDate: item.createDate,
    lastUpdate: Date.now(),
    docUrl: item.docUrl ?? "",
  });

  await upsert(NewInCategoryModel, { newsId: news._id, categoryId: category._id }, {
    newsId: news._id,
    categoryId: category._id,
    index: 0,
    date: item.createDate,
  });

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
    await upsertCategory(4, "Ban Chấp hành", "ban-chap-hanh", "Thông tin về Ban Chấp hành, các ban chuyên môn và đầu mối liên hệ.", 3),
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

  await Promise.all([
    upsertNews(newsCategories[0], {
      title: "Hội Sinh viên SOICT khởi động năm học 2026 - 2027",
      slug: "hoi-sinh-vien-soict-khoi-dong-nam-hoc-2026-2027",
      shortDes: "Chuỗi hoạt động đầu năm tập trung vào kết nối tân sinh viên, giới thiệu các ban chuyên môn và định hướng phong trào.",
      contentType: CONTENT_TYPE_NORMAL,
      createDate: time("2026-09-14T09:00:00+07:00"),
    }),
    upsertNews(newsCategories[1], {
      title: "Workshop Git, Docker và quy trình làm sản phẩm cho sinh viên năm hai",
      slug: "workshop-git-docker-quy-trinh-lam-san-pham",
      shortDes: "Buổi thực hành giúp sinh viên nắm quy trình cộng tác kỹ thuật, quản lý phiên bản và triển khai thử nghiệm.",
      contentType: CONTENT_TYPE_NORMAL,
      createDate: time("2026-09-13T14:00:00+07:00"),
    }),
    upsertNews(newsCategories[2], {
      title: "Sinh viên SOICT đạt giải cao tại cuộc thi sáng tạo công nghệ trẻ",
      slug: "sinh-vien-soict-dat-giai-cao-cuoc-thi-sang-tao-cong-nghe-tre",
      shortDes: "Nhóm sinh viên xây dựng nền tảng hỗ trợ học tập cá nhân hóa và được đánh giá cao ở tính ứng dụng.",
      contentType: CONTENT_TYPE_NORMAL,
      createDate: time("2026-09-12T18:30:00+07:00"),
    }),
    upsertNews(introCategories[0], {
      title: "Không gian học tập và nghiên cứu tại Bách khoa Hà Nội",
      slug: "khong-gian-hoc-tap-nghien-cuu-bach-khoa-ha-noi",
      shortDes: "Bách khoa Hà Nội là môi trường đào tạo kỹ thuật hàng đầu, nơi sinh viên được khuyến khích học tập chủ động và nghiên cứu ứng dụng.",
      contentType: 4,
      createDate: time("2026-09-11T08:30:00+07:00"),
    }),
    upsertNews(introCategories[1], {
      title: "Hội Sinh viên Trường CNTT&TT: kết nối, hỗ trợ và lan tỏa",
      slug: "hoi-sinh-vien-truong-cntt-tt-ket-noi-ho-tro-lan-toa",
      shortDes: "Hội Sinh viên là cầu nối giữa sinh viên, chi hội, câu lạc bộ và nhà trường trong các hoạt động phong trào.",
      contentType: 4,
      createDate: time("2026-09-10T10:00:00+07:00"),
    }),
    upsertNews(documentCategories[0], {
      title: "Mẫu đăng ký tham gia Hội Sinh viên SOICT",
      slug: "mau-dang-ky-tham-gia-hoi-sinh-vien-soict",
      shortDes: "Biểu mẫu demo dùng cho hội viên mới, có thể thay bằng file chính thức trong CMS.",
      contentType: CONTENT_TYPE_FILE,
      createDate: time("2026-09-09T09:15:00+07:00"),
      docUrl: "/documents/demo/mau-dang-ky-hoi-vien.pdf",
    }),
    upsertNews(documentCategories[1], {
      title: "Quy trình xét duyệt hoạt động Sinh viên 5 tốt cấp Trường",
      slug: "quy-trinh-xet-duyet-hoat-dong-sinh-vien-5-tot-cap-truong",
      shortDes: "Tài liệu mô tả các bước đề xuất, kiểm tra minh chứng và xác nhận hoạt động trong năm học.",
      contentType: CONTENT_TYPE_FILE,
      createDate: time("2026-09-08T15:00:00+07:00"),
      docUrl: "/documents/demo/quy-trinh-sv5t.pdf",
    }),
    upsertNews(sv5tCategories[0], {
      title: "Phong trào Sinh viên 5 tốt năm học 2026 - 2027",
      slug: "phong-trao-sinh-vien-5-tot-nam-hoc-2026-2027",
      shortDes: "Thông tin tổng quan về phong trào, mốc thời gian nộp hồ sơ và cách theo dõi tiến độ xét chọn.",
      contentType: 5,
      createDate: time("2026-09-14T16:00:00+07:00"),
    }),
    upsertNews(sv5tCategories[1], {
      title: "Gợi ý chuẩn bị minh chứng cho 5 tiêu chí",
      slug: "goi-y-chuan-bi-minh-chung-cho-5-tieu-chi",
      shortDes: "Sinh viên nên lưu lại giấy chứng nhận, danh sách tham gia và kết quả học tập ngay sau mỗi hoạt động.",
      contentType: 5,
      createDate: time("2026-09-13T11:00:00+07:00"),
    }),
  ]);
};

const seedClubs = async () => {
  const categories = [
    await upsert(ClubCategoryModel, { slug: "ban-to-chuc-va-xay-dung-hoi", type: TYPE_CLUB }, {
      name: "Ban Tổ chức và Xây dựng Hội",
      slug: "ban-to-chuc-va-xay-dung-hoi",
      des: "<p>Phụ trách phát triển hội viên, kết nối chi hội và hỗ trợ vận hành các hoạt động chung của Hội Sinh viên.</p>",
      status: STATUS_PUBLIC,
      createDate: time("2026-09-11T08:00:00+07:00"),
      clubNum: 2,
      type: TYPE_CLUB,
      avatar: DEMO_IMAGE,
    }),
    await upsert(ClubCategoryModel, { slug: "cau-lac-bo-hoc-thuat", type: TYPE_CLUB }, {
      name: "Câu lạc bộ học thuật",
      slug: "cau-lac-bo-hoc-thuat",
      des: "<p>Nơi sinh viên cùng học, cùng làm dự án, luyện thi và chia sẻ kinh nghiệm nghiên cứu công nghệ.</p>",
      status: STATUS_PUBLIC,
      createDate: time("2026-09-12T08:00:00+07:00"),
      clubNum: 2,
      type: TYPE_CLUB,
      avatar: DEMO_IMAGE,
    }),
    await upsert(ClubCategoryModel, { slug: "doi-nhom-tinh-nguyen", type: TYPE_CLUB }, {
      name: "Đội nhóm tình nguyện",
      slug: "doi-nhom-tinh-nguyen",
      des: "<p>Các đội nhóm lan tỏa tinh thần trách nhiệm cộng đồng qua chiến dịch tình nguyện, hỗ trợ tân sinh viên và hoạt động xã hội.</p>",
      status: STATUS_PUBLIC,
      createDate: time("2026-09-13T08:00:00+07:00"),
      clubNum: 2,
      type: TYPE_CLUB,
      avatar: DEMO_IMAGE,
    }),
  ];

  const clubData = [
    ["Liên Chi hội Sinh viên SOICT", "lien-chi-hoi-sinh-vien-soict", categories[0], "Điều phối hoạt động chi hội, hỗ trợ cán bộ lớp và kết nối sinh viên trong toàn Trường.", 320, "Nguyễn Minh Anh"],
    ["Ban Truyền thông SOICT", "ban-truyen-thong-soict", categories[0], "Sản xuất nội dung, truyền thông sự kiện và xây dựng hình ảnh sinh viên SOICT năng động.", 48, "Trần Hà My"],
    ["CLB Lập trình SOICT", "clb-lap-trinh-soict", categories[1], "Không gian luyện thuật toán, làm sản phẩm phần mềm và chia sẻ kinh nghiệm thực tập.", 86, "Phạm Đức Long"],
    ["CLB An toàn thông tin SOICT", "clb-an-toan-thong-tin-soict", categories[1], "Tổ chức seminar, CTF nội bộ và hỗ trợ sinh viên tiếp cận lĩnh vực an toàn thông tin.", 64, "Lê Quang Huy"],
    ["Đội Sinh viên tình nguyện SOICT", "doi-sinh-vien-tinh-nguyen-soict", categories[2], "Thực hiện các hoạt động hỗ trợ cộng đồng, tiếp sức mùa thi và mùa hè xanh.", 120, "Đỗ Khánh Linh"],
    ["Đội Hỗ trợ Tân sinh viên", "doi-ho-tro-tan-sinh-vien", categories[2], "Đồng hành cùng sinh viên khóa mới trong tuần sinh hoạt công dân và giai đoạn nhập học.", 72, "Vũ Nhật Nam"],
  ];

  for (const [name, slug, category, shortDes, memNum, presidentName] of clubData) {
    await upsert(ClubModel, { slug }, {
      name,
      slug,
      shortDes,
      des: content(name as string, shortDes as string),
      categoryId: (category as any)._id,
      categoryName: (category as any).slug,
      status: STATUS_PUBLIC,
      ownerId: OWNER_ID,
      createDate: time("2026-09-01T08:00:00+07:00"),
      type: TYPE_CLUB,
      memNum,
      avatar: DEMO_IMAGE,
      showMem: 1,
      settingStatus: STATUS_REGISTER,
      president: {
        fullName: presidentName,
        email: `${slug}@soict.hust.edu.vn`,
        phoneNumber: "0900000000",
      },
      presidentId: "",
      contactInfo: `<p>Email: ${slug}@soict.hust.edu.vn</p><p>Fanpage: Hội Sinh viên SOICT</p>`,
    });
  }
};

const seedEvents = async () => {
  const events = [
    {
      title: "Ngày hội chào tân sinh viên SOICT 2026",
      slug: "ngay-hoi-chao-tan-sinh-vien-soict-2026",
      hostBy: "<p>Hội Sinh viên Trường CNTT&TT phối hợp cùng các câu lạc bộ trực thuộc.</p>",
      fromDate: time("2026-09-25T08:00:00+07:00"),
      toDate: time("2026-09-25T17:00:00+07:00"),
      memNum: 250,
    },
    {
      title: "Tech Talk: Hành trang thực tập cho sinh viên CNTT",
      slug: "tech-talk-hanh-trang-thuc-tap-cho-sinh-vien-cntt",
      hostBy: "<p>CLB Lập trình SOICT và Ban Học tập - Nghiên cứu.</p>",
      fromDate: time("2026-10-03T18:30:00+07:00"),
      toDate: time("2026-10-03T21:00:00+07:00"),
      memNum: 180,
    },
    {
      title: "Giải chạy SOICT Run for Five Good",
      slug: "giai-chay-soict-run-for-five-good",
      hostBy: "<p>Hội Sinh viên SOICT và Đội Sinh viên tình nguyện SOICT.</p>",
      fromDate: time("2026-10-12T06:00:00+07:00"),
      toDate: time("2026-10-12T09:00:00+07:00"),
      memNum: 300,
    },
  ];

  for (const event of events) {
    await upsert(EventModel, { slug: event.slug }, {
      ...event,
      content: content(event.title, "Sự kiện demo có lịch trình, ban tổ chức và nội dung mô tả giống một hoạt động thật để kiểm tra giao diện Web/CMS."),
      criteria: "<ul><li>Sinh viên Trường CNTT&TT quan tâm tới hoạt động.</li><li>Đăng ký trước thời hạn và tham gia đúng giờ.</li></ul>",
      avatar: DEMO_IMAGE,
      status: STATUS_PUBLIC,
      createDate: Date.now(),
      settingStatus: STATUS_REGISTER,
      registerFromDate: time("2026-09-15T08:00:00+07:00"),
      registerToDate: time("2026-10-10T23:59:59+07:00"),
    });
  }
};

const seedSv5t = async () => {
  const campaign = await upsert(Sv5tCampaignModel, { academicYear: "2026-2027" }, {
    title: "Sinh viên 5 tốt SOICT 2026 - 2027",
    academicYear: "2026-2027",
    status: STATUS_PUBLIC,
    submitFrom: time("2026-09-15T00:00:00+07:00"),
    submitTo: time("2027-05-31T23:59:59+07:00"),
    criteria: DEFAULT_SV5T_CRITERIA,
    createDate: Date.now(),
  });

  const activities = [
    ["DAO_DUC", "Tuần sinh hoạt công dân và văn hóa học đường SOICT", "Hội Sinh viên SOICT", "2026-09-20T08:00:00+07:00", 180],
    ["HOC_TAP", "Workshop phương pháp học tập và nghiên cứu khoa học", "Ban Học tập - Nghiên cứu", "2026-10-05T18:30:00+07:00", 120],
    ["THE_LUC", "Giải chạy SOICT Run for Five Good", "Đội Sinh viên tình nguyện SOICT", "2026-10-12T06:00:00+07:00", 300],
    ["TINH_NGUYEN", "Ngày Chủ nhật xanh tại khuôn viên Bách khoa", "Đội Sinh viên tình nguyện SOICT", "2026-10-18T07:30:00+07:00", 90],
    ["HOI_NHAP", "English Tech Sharing: Present your project", "CLB Lập trình SOICT", "2026-11-02T19:00:00+07:00", 70],
  ];

  for (const [criterionKey, title, organizer, activityDate, participantCount] of activities) {
    const activity = await upsert(Sv5tActivityModel, { campaignId: campaign._id, title }, {
      campaignId: campaign._id,
      title,
      criterionKey,
      organizer,
      activityDate: time(activityDate as string),
      verificationMode: "AUTO_LIST",
      status: STATUS_PUBLIC,
      participantCount,
      createDate: Date.now(),
    });

    await upsert(Sv5tParticipantModel, { activityId: activity._id, studentId: "20230001" }, {
      campaignId: campaign._id,
      activityId: activity._id,
      studentId: "20230001",
      fullName: "Nguyễn Văn Test",
      createDate: Date.now(),
    });
  }
};

const main = async () => {
  await connect();
  await seedNewsLikeContent();
  await seedClubs();
  await seedEvents();
  await seedSv5t();
  await mongoose.disconnect();
  console.log("Demo content seeded successfully.");
};

main().catch(async (err) => {
  console.error("Failed to seed demo content:", err);
  await mongoose.disconnect();
  process.exit(1);
});
