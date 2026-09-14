export const STATUS_DELETED = -1;
export const STATUS_PRIVATE = 0;
export const STATUS_PUBLIC = 1;
export const STATUS_WAITTING_EVENTS = 2;
export const STATUS_OPEN = 3;

// User Role in HOI SV 
export const CHU_TICH_HOI = 1;
export const PHO_CHU_TICH_HOI = 2;
export const CHU_TICH_CLB = 3;
export const PHO_CHU_TICH_CLB = 4;
export const HOI_VIEN = 5;

// Organization
export const HOI_SV = 1;
export const BAN_THU_KY = 2;
export const LIEN_CHI_HOI = 3;
export const CAU_LAC_BO = 4;
export const DOI_NHOM = 5;

// User Role In Organization
export const CHU_TICH = 1;
export const PHO_CHU_TICH = 2;
export const QUAN_LY = 3;
export const THANH_VIEN = 4;

// User Activity
export const FINISH_ACTIVITY = 1;
export const NOT_FINISH_ACTIVITY = 2;
export const VIOLATE_ACTIVITY = 3;

// Type Activity
export const TYPE_ACTIVITY = 1;
export const TYPE_EVENT = 2;

// Type Offical Paper
export const INTERNAL_PAPER = 1;
export const EXTERNAL_PAPER = 2;

// Status User Paper
export const SENT_PAPER = 1;
export const RECEIVED_PAPER = 2;
export const ACCEPT_PAPER = 3;
export const REJECT_PAPER = 4;

// member
export const HIDE_MEMBER = 0;
export const SHOW_MEMBER = 1;

export const STATUS_WAITING = 0;
export const STATUS_ACCEPTED = 1;

export const ROLE_PRESIDENT = 1;
export const ROLE_MEMBER = 0;

export const TYPE_CLUB = 0; // CÂU LẠC BỘ
export const TYPE_CONTACT_BOARD = 1; // BAN LIÊN LẠC
export const TYPE_GROUP = 1; // vinh danh Tập thể
export const TYPE_PERSONAL = 0; // vinh danh loai ca nhan
export const TYPE_KINDNESS = 2; // hao tam

export const MEMBER_CLUB = 0; // thành viên
export const PRESIDENT_CLUB = 1; // chủ tịch

export const RESPONSE_SUCCESS = 0;
export const RESPONSE_FAILED = -1;
export const RESPONSE_MEMBER_EXIST = 2;

export const PAGE_SIZE = 15;

// loại tin tức
export const CONTENT_TYPE_NORMAL = 0;
export const CONTENT_TYPE_FILE = 1;

// trạng thái duyệt ngừoi dùng
export const STATUS_DATA_WAITING = 0;
export const STATUS_DATA_REJECTED = -1;
export const STATUS_DATA_CONFIRMED = 1;

// trạng thái feedback
export const STATUS_FEEDBACK_WAITING = 0;
export const STATUS_FEEDBACK_ACCEPTED = 1;
export const STATUS_FEEDBACK_DELETED = -1;

// trạng thái checkin
export const TYPE_CHECKIN_ALL = 0;
export const TYPE_CHECKIN_NOT = -1;
export const TYPE_CHECKIN_DONE = 1;
export const TYPE_REQUIRE_BANKING = 3;

export const statuses = [
  {
    value: STATUS_PUBLIC,
    label: "Công khai",
  },
  {
    value: STATUS_PRIVATE,
    label: "Riêng tư",
  },
  {
    value: STATUS_DELETED,
    label: "Đã xóa",
  },
  {
    value: STATUS_OPEN,
    label: "Mặc định",
  },
];

export const statusesMember = [
  {
    value: STATUS_WAITING,
    label: "Chờ duyệt",
  },
  {
    value: STATUS_ACCEPTED,
    label: "Đã Duyệt",
  },
];

export const statusesUser = [
  {
    value: STATUS_DATA_WAITING,
    label: "Chờ duyệt",
  },
  {
    value: STATUS_DATA_CONFIRMED,
    label: "Đã Duyệt",
  },
  {
    value: STATUS_DATA_REJECTED,
    label: "Đã Từ Chối",
  },
];

export const typeHonors = [
  {
    value: TYPE_PERSONAL,
    label: "Cá nhân",
  },
  {
    value: TYPE_GROUP,
    label: "Tập thể",
  },
];

export const userTypeHonor = [
  {
    value: 1,
    label: "Sinh viên",
  },
  {
    value: 2,
    label: "Giáo viên",
  },
  {
    value: 3,
    label: "Doanh nghiệp",
  },
];

export const statusesFeedback = [
  {
    value: STATUS_FEEDBACK_WAITING,
    label: "Chờ duyệt",
  },
  {
    value: STATUS_FEEDBACK_ACCEPTED,
    label: "Hoàn thành",
  },
  {
    value: STATUS_FEEDBACK_DELETED,
    label: "Đã xóa",
  },
];

// event
export const STATUS_NO_REGISTER = 1; //->  không cho đăng ký tham gia
export const STATUS_REGISTER = 2; //ấn nút đăng ký tham gia -> tham gia ngay không cần duyệt
export const STATUS_REGISTER_JOIN = 3; //ấn nút đăng ký tham gia -> tham gia cần quản trị viên duyệt

export const STATUS_EVENTS = [
  {
    value: STATUS_REGISTER_JOIN,
    label: "Đăng ký tham gia (Cần phê duyệt)",
  },
  {
    value: STATUS_REGISTER,
    label: "Đăng ký tham gia (Không cần duyệt)",
  },
  {
    value: STATUS_NO_REGISTER,
    label: "Không cho đăng ký",
  },
];

//
export const SALE = 0;
export const LEADER_SALE = 1;
export const ADMIN = 2;
export const CARER = 3;

export const TRANSACTION_ALL = -1;
export const TRANSACTION_NONE = 0;
export const TRANSACTION_SUCCESS = 1;
export const TRANSACTION_WATTING = 2;
export const TRANSACTION_DELETE = 3;
export const TRANSACTION_REFUND = 4;
export const ORDER_STATISTIC = 5;
export const MY_ORDER = 6;
export const BOOK_TRANSACTION_BOUGHT = 0;
export const BOOK_TRANSACTION_GIFT = 1;

export const DOMAIN_ID_EHUST = 1;
export const DOMAIN_ID_ALUMNI = 2;
export const DOMAIN_ID_CDBK = 3;

export const BUY_BOOK = 1;
export const NO_BUY_BOOK = 0;

export const TRANSACTION_REFUND_DEFAULT = 0;
export const TRANSACTION_REFUND_OK = 1;
export const TRANSACTION_REFUND_CANCLE = 2;

export const CLASS_RESERVE = 5;

export const STATUS_SENT = 1;
export const STATUS_UNSENT = 0;
export const SENT_MAIL = 1;
export const STOP_SENT_MAIL = 0;

export const MAIL = "mail";
export const PUSH_NOTIFICATION = "push-notification";

export const QUAN_LY_DON_HANG = "quan-ly-don-hang";
export const QUAN_LY_SACH = "quan-ly-don-hang/sach";
export const QUAN_LY_NGUOI_DUNG = "quan-ly-don-hang/quan-ly-nguoi-dung";
export const QUAN_LY_MAIL = "quan-ly-mail";
export const QUAN_LY_CONG_TAC_VIEN = "quan-ly-don-hang/affiliate";
export const QUAN_LY_HOC_VIEN = "quan-ly-don-hang/quan-ly-hoc-vien";
export const QUAN_LY_CODE = "quan-ly-don-hang/quan-ly-code";
export const TRANG_TONG_QUAN = "/";
export const QUAN_LY_TAT_CA_DON_HANG = "quan-ly-don-hang/tat-ca-don-hang";
export const QUAN_LY_QUYEN = "quan-ly-don-hang/quan-ly-quyen";
export const THONG_KE = "quan-ly-don-hang/thong-ke";

export const QUAN_LY_NHOM_HOC_VIEN = "quan-ly-don-hang/nhom";
export const QUAN_LY_DEADLINE_NHOM = "quan-ly-deadline-nhom";

export const GEN_CODE_TYPE_DEFAULT = 0;
export const GEN_CODE_TYPE_NUMBER = 1;
export const GEN_CODE_TYPE_CHAR = 2;

export const USER_GROUP_SUCCESS = 1;
export const USER_GROUP_WATTING = 0;
export const USER_GROUP_DELETE = -1;

export const ONE_DAY_MILLISECONDS = 24 * 60 * 60 * 1000;

export const MEMBER_NEWEST_JOIN = 0;
export const MEMBER_OLDEST_JOIN = 1;

export const ROLE_ADMIN_SYSTEM = 99;
export const ROLE_SUPPORT_TEACHER = 98;
export const ROLE_NVKD = 97;
export const ROLE_NEWS_MANAGER = 96;
export const ROLE_ADMIN = 69;
export const ROLE_PARENT = 4;
export const ROLE_CONTENT_MANAGER = 3;
export const ROLE_TEACHER = 2;
export const ROLE_TEACHER_MANAGER = 13;
export const ROLE_ADMIN_COURSE = 1;
export const ROLE_STUDENT = 0;
export const ROLE_ADMIN_AREA = 100;

export const UPLOAD_FILE_IMAGE = 1;
export const UPLOAD_FILE_SOUND = 2;
export const UPLOAD_FILE_XLS = 3;
export const UPLOAD_FILE_PDF = 4;
export const UPLOAD_FILE_WORD = 5;

export const SUCCESS = 1;
export const FAILED = 0;

export const PAYMENT_STATUS_INIT = 0;
export const PAYMENT_STATUS_SUCCESS = 1;
export const PAYMENT_STATUS_FAILURE = 2;
export const PAYMENT_STATUS_UNKNOWN = 3;

export const TRANSACTION_REPLIED = 4;
export const TRANSACTION_PROCESSING = 5; //5;
export const TRANSACTION_FAILT = 6;