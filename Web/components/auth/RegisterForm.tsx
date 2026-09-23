import { CircularProgress, Dialog, IconButton, useMediaQuery } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { useTheme } from '@mui/system';
import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../../app/hooks';
import { setShowLoginPopup, setShowSignupPopup } from '../../features/auth/auth.slice';
import { apiRegister } from '../../features/auth/auth.api';
import { RESPONSE_MEMBER_EXIST, RESPONSE_SUCCESS, STATUS_PUBLIC } from '../../utils/constraint';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BadgeIcon from '@mui/icons-material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MilitaryTechOutlinedIcon from '@mui/icons-material/MilitaryTechOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import './style.scss';

type AuthFormRegister = {
  fullName: string;
  studentId: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  className?: string;
  schoolName?: string;
}

export const RegisterTransition = forwardRef(function RegisterTransition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <div ref={ref as any} {...props} />;
});

const microsoftLoginUrl = process.env.NEXT_PUBLIC_MICROSOFT_LOGIN_URL || 'https://login.microsoftonline.com/';

const RegisterForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down('md'));
  const showSignupPopup = useSelector(state => state.authState.showSignupPopup);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<AuthFormRegister>({
    mode: 'onChange'
  });

  const handleClose = () => {
    dispatch(setShowSignupPopup(false));
  }

  const openLogin = () => {
    dispatch(setShowSignupPopup(false));
    dispatch(setShowLoginPopup(true));
  }

  const handleRegister = async (values: AuthFormRegister) => {
    if (submitting) return;
    if (values.password !== values.confirmPassword) {
      enqueueSnackbar("Mật khẩu nhập lại chưa khớp!", { variant: "error", autoHideDuration: 2000 });
      return;
    }

    setSubmitting(true);
    try {
      const studentId = values.studentId.trim();
      const res = await apiRegister({
        reqBody: {
          userId: studentId,
          status: STATUS_PUBLIC,
          fullName: values.fullName.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
          phoneNumber: values.phoneNumber?.trim() ?? "",
          className: values.className?.trim() ?? "",
          schoolName: values.schoolName?.trim() ?? "",
        }
      });

      if (res?.status === RESPONSE_SUCCESS) {
        reset();
        dispatch(setShowSignupPopup(false));
        dispatch(setShowLoginPopup(true));
        enqueueSnackbar("Đăng ký tài khoản thành công, bạn có thể đăng nhập ngay.", { variant: "success", autoHideDuration: 2500 });
        return;
      }

      if (res?.status === RESPONSE_MEMBER_EXIST) {
        enqueueSnackbar("Email hoặc MSSV này đã tồn tại, bạn hãy đăng nhập hoặc dùng thông tin khác.", { variant: "error", autoHideDuration: 2500 });
        return;
      }

      enqueueSnackbar("Chưa đăng ký được tài khoản, bạn thử lại sau nhé.", { variant: "error", autoHideDuration: 2500 });
    } catch (error) {
      enqueueSnackbar("Có lỗi khi đăng ký tài khoản, bạn thử lại sau nhé.", { variant: "error", autoHideDuration: 2500 });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={showSignupPopup}
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
      <div className="auth-portal auth-portal-register">
        <aside className="auth-portal-hero">
          <div className="auth-portal-badge"><span /> Cổng dịch vụ Đoàn - Hội Bách Khoa</div>
          <h2>Kích hoạt tài khoản Hội viên để bắt đầu tham gia phong trào</h2>
          <p>Tài khoản local dùng cho bản demo và kiểm thử hồ sơ Sinh viên 5 tốt. Khi có OAuth Microsoft, tài khoản trường sẽ là phương thức chính.</p>
          <div className="auth-portal-benefits">
            <div><BadgeIcon /><span><strong>Thông tin cá nhân rõ ràng</strong>MSSV, email, lớp và đơn vị đào tạo được lưu để đối soát minh chứng.</span></div>
            <div><MilitaryTechOutlinedIcon /><span><strong>Hồ sơ 5 tốt đầy đủ dữ liệu</strong>Không còn sinh mã tự động khi đăng ký tài khoản test.</span></div>
            <div><QrCodeScannerOutlinedIcon /><span><strong>Đồng bộ hoạt động</strong>CSV hoạt động có thể đối chiếu trực tiếp với MSSV bạn nhập.</span></div>
            <div><GroupsOutlinedIcon /><span><strong>Thử nghiệm vai trò sinh viên</strong>Dùng tài khoản local để kiểm tra nộp hồ sơ, minh chứng và tiến độ.</span></div>
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
            <h1>Đăng ký tài khoản Hội viên</h1>
          </div>
          <p className="auth-portal-subtitle">
            Ưu tiên dùng email sinh viên Bách Khoa (<code>@sis.hust.edu.vn</code>). Tài khoản này phục vụ demo local và kiểm thử hồ sơ.
          </p>

          <a className="auth-microsoft-button" href={microsoftLoginUrl} target="_blank" rel="noreferrer">
            <span className="microsoft-logo"><i /><i /><i /><i /></span>
            Tiếp tục bằng Office 365 HUST
            <strong>Khi có SSO</strong>
          </a>

          <div className="auth-divider"><span />Hoặc tạo tài khoản local để test<span /></div>

          <form className="auth-portal-form auth-register-form" onSubmit={handleSubmit(handleRegister)}>
            <label className="auth-field">
              <span>Họ và tên</span>
              <div className={errors.fullName ? 'auth-input is-error' : 'auth-input'}>
                <PersonOutlineOutlinedIcon />
                <input {...register("fullName", { required: true })} placeholder="Nguyễn Văn A" autoComplete="name" />
              </div>
              {errors.fullName && <small>Vui lòng nhập họ và tên.</small>}
            </label>

            <label className="auth-field">
              <span>Mã số sinh viên</span>
              <div className={errors.studentId ? 'auth-input is-error' : 'auth-input'}>
                <BadgeIcon />
                <input
                  {...register("studentId", { required: true, pattern: /^[A-Za-z0-9._-]+$/ })}
                  placeholder="20224567"
                  autoComplete="off"
                />
              </div>
              {errors.studentId?.type === "required" && <small>Vui lòng nhập MSSV.</small>}
              {errors.studentId?.type === "pattern" && <small>MSSV chỉ gồm chữ, số, dấu chấm, gạch ngang hoặc gạch dưới.</small>}
            </label>

            <label className="auth-field">
              <span>Email Bách Khoa</span>
              <div className={errors.email ? 'auth-input is-error' : 'auth-input'}>
                <EmailOutlinedIcon />
                <input
                  {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
                  placeholder="nam.th224567@sis.hust.edu.vn"
                  autoComplete="email"
                />
              </div>
              {errors.email?.type === "required" && <small>Vui lòng nhập email.</small>}
              {errors.email?.type === "pattern" && <small>Email chưa đúng định dạng.</small>}
            </label>

            <label className="auth-field">
              <span>Số điện thoại</span>
              <div className="auth-input">
                <PhoneOutlinedIcon />
                <input {...register("phoneNumber")} placeholder="0123456789" autoComplete="tel" />
              </div>
            </label>

            <label className="auth-field">
              <span>Lớp</span>
              <div className="auth-input">
                <SchoolOutlinedIcon />
                <input {...register("className")} placeholder="K66-CNTT" />
              </div>
            </label>

            <label className="auth-field">
              <span>Trường/Viện</span>
              <div className="auth-input">
                <SchoolOutlinedIcon />
                <input {...register("schoolName")} placeholder="Trường CNTT&TT" />
              </div>
            </label>

            <label className="auth-field">
              <span>Mật khẩu</span>
              <div className={errors.password ? 'auth-input is-error' : 'auth-input'}>
                <LockOutlinedIcon />
                <input {...register("password", { required: true, minLength: 6 })} type="password" placeholder="Tối thiểu 6 ký tự" autoComplete="new-password" />
              </div>
              {errors.password?.type === "required" && <small>Vui lòng nhập mật khẩu.</small>}
              {errors.password?.type === "minLength" && <small>Mật khẩu tối thiểu 6 ký tự.</small>}
            </label>

            <label className="auth-field">
              <span>Nhập lại mật khẩu</span>
              <div className={errors.confirmPassword ? 'auth-input is-error' : 'auth-input'}>
                <LockOutlinedIcon />
                <input
                  {...register("confirmPassword", { required: true, validate: value => value === watch("password") })}
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword?.type === "required" && <small>Vui lòng nhập lại mật khẩu.</small>}
              {errors.confirmPassword?.type === "validate" && <small>Mật khẩu nhập lại chưa khớp.</small>}
            </label>

            <button className="auth-submit auth-register-submit" type="submit" disabled={submitting}>
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Tạo tài khoản local'}
            </button>
          </form>

          <div className="auth-note">
            <SchoolOutlinedIcon />
            <div>
              <strong>Đã có tài khoản?</strong>
              <p>Quay lại form đăng nhập để thử nộp hồ sơ Sinh viên 5 tốt. <button type="button" onClick={openLogin}>Đăng nhập ngay</button></p>
            </div>
          </div>
        </main>
      </div>
    </Dialog>
  )
}

export default RegisterForm;
