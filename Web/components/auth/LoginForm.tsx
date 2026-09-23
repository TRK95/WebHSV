import { CircularProgress, Dialog, IconButton, useMediaQuery } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useTheme } from '@mui/system';
import { forwardRef, PropsWithoutRef, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../../app/hooks';
import { login, setCheckLoginCode, setFetching, setShowForgotPopup, setShowLoginPopup, setShowSignupPopup } from '../../features/auth/auth.slice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BadgeIcon from '@mui/icons-material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import './style.scss';

type AuthFormLogin = {
  username: string,
  password: string
}

export const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return (
    <div ref={ref as any} {...props} />
  );
});

const microsoftLoginUrl = process.env.NEXT_PUBLIC_MICROSOFT_LOGIN_URL || 'https://login.microsoftonline.com/';

const LoginForm = (props: PropsWithoutRef<{
  defaultAccount?: string;
}>) => {
  const { defaultAccount } = props;
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AuthFormLogin>({
    mode: 'onChange',
    defaultValues: {
      username: defaultAccount || '',
      password: ''
    }
  });
  const { fetchingAPI, student } = useSelector((state) => state.authState);
  const showLoginPopup = useSelector(state => state.authState.showLoginPopup);

  useEffect(() => {
    if (student?._id) {
      dispatch(setShowLoginPopup(false));
      reset({ username: '', password: '' });
      enqueueSnackbar("Bạn đã đăng nhập thành công!", { variant: "success", autoHideDuration: 2000, onClose: () => dispatch(setCheckLoginCode(null)) });
    }
  }, [student]);

  const handleClose = () => {
    dispatch(setShowLoginPopup(false));
  };

  const handleLogin = (values: AuthFormLogin) => {
    if (fetchingAPI) return;
    const email = values.username.trim();
    const password = values.password;
    if (!email || !password) return;
    dispatch(setFetching(true));
    dispatch(login({ email, password }));
  };

  const openSignup = () => {
    dispatch(setShowLoginPopup(false));
    dispatch(setShowSignupPopup(true));
  };

  const openForgotPassword = () => {
    dispatch(setShowLoginPopup(false));
    dispatch(setShowForgotPopup(true));
  };

  return (
    <Dialog
      open={showLoginPopup}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth={false}
      sx={{
        '& .MuiDialog-paper': {
          width: isMobileUI ? 'calc(100vw - 24px)' : 'min(1180px, calc(100vw - 64px))',
          maxWidth: '1180px',
          borderRadius: isMobileUI ? '22px' : '26px',
          overflow: 'hidden',
          margin: isMobileUI ? '12px' : '32px',
        },
      }}
    >
      <div className="auth-portal auth-portal-login">
        <aside className="auth-portal-hero">
          <div className="auth-portal-badge"><span /> Cổng dịch vụ Đoàn - Hội Bách Khoa</div>
          <h2>Một tài khoản duy nhất cho mọi hoạt động tại Bách Khoa</h2>
          <p>Hệ sinh thái số hóa công tác Hội Sinh viên, lưu trữ minh chứng rèn luyện và thúc đẩy phong trào Sinh viên 5 tốt Đại học Bách Khoa Hà Nội.</p>
          <div className="auth-portal-benefits">
            <div><BadgeIcon /><span><strong>Quản lý hồ sơ & chứng nhận hoạt động</strong>Lưu trữ số hóa thẻ Hội viên điện tử và chứng chỉ tình nguyện chính quy.</span></div>
            <div><MilitaryTechOutlinedIcon /><span><strong>Nộp hồ sơ “Sinh viên 5 tốt” trực tuyến</strong>Tra cứu tiến độ xét duyệt cấp Viện/Trường theo thời gian thực.</span></div>
            <div><QrCodeScannerOutlinedIcon /><span><strong>Điểm danh sự kiện QR & điểm rèn luyện</strong>Tích hợp tự động vào bảng điểm ĐRL hằng kỳ trên cổng đào tạo SIS.</span></div>
            <div><GroupsOutlinedIcon /><span><strong>Mạng lưới CLB & kênh cán bộ Chi hội</strong>Trao đổi thông tin tức thời cùng ban cán sự lớp và Ban chấp hành Hội.</span></div>
          </div>
          <div className="auth-portal-trust">
            <div className="auth-portal-avatars">
              <span />
              <span />
              <span />
            </div>
            <div><strong>35.000+ sinh viên Bách Khoa</strong><p>Tin cậy đăng nhập và tham gia phong trào mỗi học kỳ</p></div>
          </div>
        </aside>

        <main className="auth-portal-main">
          <div className="auth-portal-topbar">
            <button type="button" onClick={handleClose}><ArrowBackIcon /> Trang chủ Hội Sinh viên</button>
            <div className="auth-lang-switch"><span>VI</span><span>EN</span></div>
            <IconButton className="auth-close" onClick={handleClose}><CloseIcon /></IconButton>
          </div>

          <div className="auth-portal-title">
            <span />
            <h1>Đăng nhập Cổng Hội viên</h1>
          </div>
          <p className="auth-portal-subtitle">
            Sử dụng tài khoản Email sinh viên Bách Khoa (<code>@sis.hust.edu.vn</code>) hoặc tài khoản local để test.
          </p>

          <a className="auth-microsoft-button" href={microsoftLoginUrl} target="_blank" rel="noreferrer">
            <span className="microsoft-logo"><i /><i /><i /><i /></span>
            Đăng nhập nhanh bằng Office 365 HUST
            <strong>Khuyên dùng</strong>
          </a>

          <div className="auth-divider"><span />Hoặc đăng nhập bằng tài khoản local<span /></div>

          <form className="auth-portal-form" onSubmit={handleSubmit(handleLogin)}>
            <label className="auth-field">
              <span>Mã số sinh viên (MSSV) hoặc Email Bách Khoa</span>
              <div className={errors.username ? 'auth-input is-error' : 'auth-input'}>
                <EmailOutlinedIcon />
                <input
                  {...register("username", { required: true })}
                  placeholder="vd: 20224567 hoặc nam.th224567@sis.hust.edu.vn"
                  autoComplete="username"
                />
              </div>
              {errors.username && <small>Vui lòng nhập tài khoản.</small>}
            </label>

            <label className="auth-field">
              <span>Mật khẩu <button type="button" onClick={openForgotPassword}>Quên mật khẩu?</button></span>
              <div className={errors.password ? 'auth-input is-error' : 'auth-input'}>
                <LockOutlinedIcon />
                <input
                  {...register("password", { required: true })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                />
                <button type="button" className="auth-icon-button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                </button>
              </div>
              {errors.password && <small>Vui lòng nhập mật khẩu.</small>}
            </label>

            <label className="auth-remember">
              <input type="checkbox" defaultChecked />
              <span>Ghi nhớ phiên đăng nhập trên thiết bị này</span>
            </label>

            <button className="auth-submit" type="submit" disabled={fetchingAPI}>
              {fetchingAPI ? <CircularProgress size={24} color="inherit" /> : <>Đăng nhập vào hệ thống <LoginOutlinedIcon /></>}
            </button>
          </form>

          <div className="auth-note">
            <SchoolOutlinedIcon />
            <div>
              <strong>Tân sinh viên K71? Tài khoản Hội viên được đồng bộ tự động từ hệ thống Quản lý đào tạo.</strong>
              <p>Chưa có tài khoản local? <button type="button" onClick={openSignup}>Đăng ký ngay</button></p>
            </div>
          </div>

          <footer className="auth-portal-footer">
            <div>
              <strong>Kênh hỗ trợ kỹ thuật Đoàn - Hội:</strong>
              <span><EmailOutlinedIcon /> support.hsv@hust.edu.vn</span>
            </div>
            <div className="auth-security"><FactCheckOutlinedIcon /> Mã hóa SSL 256-bit</div>
          </footer>
        </main>
      </div>
    </Dialog>
  )
}

export default LoginForm
