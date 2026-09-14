export const ENGLISH_COURSES_SLUG: string[] = ['tieng-anh'];
export const GRADE_TYPE_NONE: number = 0;
export const GRADE_TYPE_AVARAGE: number = 1;
export const GRADE_TYPE_GOOD: number = 2;
export const GRADE_TYPE_VERY_GOOD: number = 3;
export const QUESTION_LIMIT = 50;

export const PAGE_SIZE = 20;

export const HIDE_MEMBER = 0;
export const SHOW_MEMBER = 1;

export const REQUEST_SUCCESS = 0;
export const REQUEST_FAILED = -1;

export const RESPONSE_SUCCESS = 0;
export const RESPONSE_FAILED = -1;
export const RESPONSE_MEMBER_EXIST = 2

export const STATUS_DELETED = -1;
export const STATUS_PRIVATE = 0;
export const STATUS_PUBLIC = 1;
export const STATUS_WAITTING_EVENTS = 2;
export const STATUS_OPEN = 3;

export const DOMAIN_ID_EHUST = 1
export const DOMAIN_ID_ALUMNI = 2

export const CLUB_TYPE = 0
export const CONTACT_CLUB_TYPE = 1

export const USER_LOGIN_SUCCESS = 1
export const USER_LOGIN_FAILED = -1

export const LOGIN_CODE_SUCCESS = 1
export const LOGIN_CODE_FAILED = 0

export const ROLE_OWNER = 1
export const ROLE_MEMBER = 0

export const HONOR_TYPE_GROUP = 1; // vinh danh Tập thể
export const HONOR_TYPE_PERSONAL = 0 // vinh danh loai ca nhan

export const CHARITY_TYPE = 2

export const JOIN_STATUS_WAITING = 0;
export const JOIN_STATUS_ACCEPTED = 1;

export const STATUS_WAITING = 0;
export const STATUS_ACCEPTED = 1;

export const ROLE_PRESIDENT = 1;

export const TYPE_CLUB = 0; // CÂU LẠC BỘ
export const TYPE_CONTACT_BOARD = 1; // BAN LIÊN LẠC
export const TYPE_GROUP = 1; // vinh danh Tập thể
export const TYPE_PERSONAL = 0 // vinh danh loai ca nhan

export const MEMBER_CLUB = 0; // thành viên
export const PRESIDENT_CLUB = 1; // chủ tịch

export const STATUS_NO_REGISTER = 1;
export const STATUS_REGISTER = 2;
export const STATUS_REGISTER_JOIN = 3;

export const STATUS_DATA_REJECTED = -1;
export const STATUS_DATA_WAITING = 0;
export const STATUS_DATA_CONFIRMED = 1;

export const statuses = [
  {
    value: STATUS_PRIVATE,
    label: 'Riêng tư'
  },
  {
    value: STATUS_PUBLIC,
    label: 'Công khai'
  },
  {
    value: STATUS_DELETED,
    label: 'Đã xóa'
  },
  {
    value: STATUS_WAITTING_EVENTS,
    label: 'Chờ duyệt'
  }
]

export const statusesMember = [
  {
    value: STATUS_WAITING,
    label: 'Chờ duyệt'
  },
  {
    value: STATUS_ACCEPTED,
    label: 'Đã Duyệt'
  }
]

export const typeHonors = [
  {
    value: TYPE_PERSONAL,
    label: 'Cá nhân',
    slug: 'ca-nhan'
  },
  {
    value: TYPE_GROUP,
    label: 'Tập thể',
    slug: 'tap-the'
  }
]

export const userTypeHonor = [
  {
    value: 1,
    label: 'Sinh viên'
  },
  {
    value: 2,
    label: 'Giáo viên'
  },
  {
    value: 3,
    label: 'Doanh nghiệp'
  }
]

export const STATUS_EVENTS = [
  {
    value: STATUS_REGISTER_JOIN,
    label: 'Đăng ký tham gia (Cần phê duyệt)'
  },
  {
    value: STATUS_REGISTER,
    label: 'Đăng ký tham gia (Không cần duyệt)'
  },
  {
    value: STATUS_NO_REGISTER,
    label: 'Không cho đăng ký'
  }
]