export const jwtSecret = "koolsoftdev!2020";
export const jwtSecretNew = "383v2wt927mwvg0rlcybwh";
export const TOKEN_EXPIRED = 24 * 60 * 60; //1d
export const TOKEN_IOS_EXPIRED = 20 * 60;
export const TOKEN_FORGOT_PASS_EXPIRED = 10 * 60; //10p;
export const SUPER_ACCOUNT = "6aajSgy3Dg9,Rx(_Az$a";
export const SUPER_PASSWORD = "d761d7a04a597d6b80bf0c8674b176c5a31d969af9ad80aac5dda22d58f4ce8a";
export const jwtCmsHSV = "hsvdhbkhn";

export const LOGIN_FAILED = -1;
export const LOGIN_SUCCESS = 0;
export const LOGIN_ACCOUNT_IS_USED = 1;
export const LOGIN_ACCOUNT_NOT_EXIST = 2;
export const LOGIN_WRONG_PASSWORD = 3;
export const LOGIN_WRONG_PROVIDER = 4;
export const LOGIN_ACCOUNT_NOT_ACTIVATED = 5;
export const LOGIN_MOBILE_IS_USED = 6;
export const LOGIN_USER_NOT_GRANTED_PERMISSION = 7;
export const LOGIN_TOKEN_INVALID = 8;
export const LOGIN_WAIT_FOR_EMAIL_VERIFICATION = 9;


export const CHANGE_PASS_FAILED = -1;
export const CHANGE_PASS_SUCCESS = 0;
export const CHANGE_PASS_WRONG_PASSWORD = 2;
export const CHANGE_PASS_NOT_FOUND_USER = 3;

export const EXAM_SCORE_WAITING = 1;
export const EXAM_SCORE_PLAY = 2;
export const EXAM_SCORE_FINISH = 3;

export const STUDY_SCORE_TYPE_PRACTICE = 0;
export const STUDY_SCORE_TYPE_TEST = 1;

export const BASE_URL_END_POINT = 'https://hoctot.com/luyen-thi/';
export const BASE_URL_API = 'https://dev-dot-hoctot-edu.appspot.com/api?action=';

export const TOPIC_TYPE_LESSON = 1;
export const TOPIC_TYPE_EXERCISE = 2;
export const TOPIC_TYPE_TEST = 3;
export const TOPIC_TYPE_CATEGORY = 4;

export const TOPIC_TYPE_CHILD_TOPIC = 1;
export const TOPIC_TYPE_CHILD_CARD = 2;
export const TOPIC_TYPE_CHILD_COURSE = 3;
export const TOPIC_TYPE_CHILD_CARD_MAPPING = 4;

export const STATUS_DELETED = -1;
export const STATUS_PRIVATE = 0;
export const STATUS_UPDATED = 0;
export const STATUS_PUBLIC = 1;
export const STATUS_TESTING = 2;
export const STATUS_WAITING = 3;
export const STATUS_OPEN = 4;
export const STATUS_EXPIRED = 5;
export const STATUS_NORMAL = 0;

export const CONVERSATION_TYPE_TOPIC = 0;
export const CONVERSATION_TYPE_VIDEO = 1;
export const CONVERSATION_TYPE_CARD = 2;
export const CONVERSATION_TYPE_CHAT = 3;
export const CONVERSATION_TYPE_COURSE = 4;

export const SCENARIO_TYPE_VIDEO = 0;
export const SCENARIO_TYPE_LIVE_STREAM = 1;
export const SCENARIO_TYPE_READING = 2;
export const SCENARIO_TYPE_COACHING = 3;
export const SCENARIO_TYPE_VIRTUAL_CLASSS = 4;
export const SCENARIO_TYPE_EXERCISE = 5;

export const VIDEO_PAUSE_PLAY = 0;
export const VIDEO_CONTINUE_PLAY = 1;

export const FACE_TYPE_ANSWER_CORRECT = 2;
export const FACE_TYPE_ANSWER_IN_CORRECT = 3;

export const QUESTION_BOOKMARK = 1;
export const QUESTION_NOT_BOOKMARK = 0;

export const CATEGORY_COURSE = 0;
export const CATEGORY_NEWS = 1;
export const CATEGORY_DOCUMENT = 2;


export const COURSE_TYPE_VIDEO_ONLINE = 0;
export const COURSE_TYPE_LIVESTREAM = 1;
export const COURSE_TYPE_QUESTION_BANK = 2;
export const COURSE_TYPE_EXERCISE = 3;
export const COURSE_TYPE_TEST = 4;
export const COURSE_TYPE_DOCUMENT = 5;

export const CARD_IS_CHILD = 2;
export const CARD_HAS_CHILD = 1;
export const CARD_NORMAL = 0;

export const COMBO_TYPE_CREATE_COMBO = 0;
export const COMBO_TYPE_CATEGORY = 1;

export const ORDER_TYPE_RETAIL = 0;
export const ORDER_TYPE_COMBO = 1;
export const ORDER_TYPE_DEALSHOCK = 2;


export const USER_STUDY_BOUGHT = 0;
export const USER_STUDY_TRIAL = 1;

export const USER_COURSE_REJECT = -1;
export const USER_COURSE_WAITING = 0;
export const USER_COURSE_APPROVE = 1;

export const USER_TYPE_STUDENT = 0;
export const USER_TYPE_ROLE = 1;

export const STUDY_SCORE_DETAIL_NO_STUDY = -1;
export const STUDY_SCORE_DETAIL_CORRECT = 0;
export const STUDY_SCORE_DETAIL_IN_CORRECT = 1;

export const TOPIC_CONTENT_TYPE_CARD = 0;
export const TOPIC_CONTENT_TYPE_FILE_PDF = 1;

export const ROLE_COURSE_SCOPE = 0;
export const ROLE_CATEGORY_SCOPE = 1;
export const ROLE_SYSTEM_SCOPE = 2;

export const READ_STATUS = 1;
export const UNREAD_STATUS = 0;

export const REPLY_STATUS = 1;
export const UNREPLY_STATUS = 0;
export const NOTE_STATUS = 2;

export const SCENARIO_VIDEO = 0;
export const SCENARIO_EXERCISE = 1;

export const VIDEO_CONTENT_TYPE_QUESTION = 0;
export const VIDEO_CONTENT_TYPE_DOCUMENT = 1;
export const VIDEO_CONTENT_TYPE_VIDEO = 2;
export const VIDEO_CONTENT_TYPE_TEXT = 3;
export const VIDEO_CONTENT_TYPE_AUDIO = 4;
export const VIDEO_CONTENT_TYPE_BILINGUAL = 5;
export const VIDEO_CONTENT_TYPE_SUBTITLE = 6;
export const VIDEO_CONTENT_TYPE_AUDIO_IN_LIVE = 7;
export const DOCUMENT_WAITING = 0;
export const DOCUMENT_NOT_APPROVE = 1;
export const DOCUMENT_APPROVED = 2;

export const GRADING_STATUS = 1;
export const GRADED_STATUS = 2;

export const NOT_PAYMENT = 0;
export const PAYMENT_MOMO = 1;
export const PAYMENT_VNPAY = 2;
export const PAYMENT_BANK = 3;
export const PAYMENT_COD = 4;
export const PAYMENT_VISA = 5;
export const PAYMENT_PAYPAL = 6;
export const PAYMENT_GIF = 7;
export const PAYMENT_TC_ACELLUS = 8;
export const PAYMENT_MB_QR = 9;

export const FREE = 0;
export const STANDARD = 1;
export const PREMIUM = 2;