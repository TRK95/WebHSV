import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Slide, TextField, useMediaQuery } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/system';
import { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../../app/hooks';
import { setShowLoginPopup, setShowSignupPopup } from '../../features/auth/auth.slice';
import { apiRegister, apiRegisterUserId } from '../../features/auth/auth.api';
import { RESPONSE_MEMBER_EXIST, RESPONSE_SUCCESS, STATUS_PUBLIC } from '../../utils/constraint';
import './style.scss';

type AuthFormRegister = {
  fullName: string;
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
  return (
    <Slide
      easing={{
        enter: "cubic-bezier(0, 1.5, .8, 1)",
        exit: "linear"
      }}
      direction="down"
      ref={ref}
      {...props}
    />
  );
});

const RegisterForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'));
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
      const { userId } = await apiRegisterUserId();
      const res = await apiRegister({
        reqBody: {
          userId,
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
        enqueueSnackbar("Email này đã tồn tại, bạn hãy đăng nhập hoặc dùng email khác.", { variant: "error", autoHideDuration: 2500 });
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
      sx={{
        '& .MuiPaper-root': {
          width: isMobileUI ? 'unset' : '100%',
          maxWidth: '640px',
          borderRadius: '20px',
          position: 'absolute',
          top: 48,
        },
      }}
    >
      <div className="auth-form">
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--primary-color-main)' }} >
            <div className="close-box" onClick={handleClose}>
              <CloseIcon color='inherit' />
            </div>
          </div>
          <div className="title">Đăng ký</div>
        </DialogTitle>
        <DialogContent>
          <form className="auth-form-body" onSubmit={handleSubmit(values => handleRegister(values))} >
            <div className="auth-form-item">
              <div className="input-item">
                <TextField
                  {...register("fullName", { required: true })}
                  sx={{ width: '100%' }}
                  label="Họ và tên" placeholder="Nhập họ và tên"
                />
              </div>
              {errors.fullName?.type === "required" && <div className='error-message'>Vui lòng nhập họ và tên!</div>}
            </div>

            <div className="auth-form-item">
              <div className="input-item">
                <TextField
                  {...register("email", {
                    required: true,
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                  })}
                  sx={{ width: '100%' }}
                  label="Email" placeholder="Nhập email"
                />
              </div>
              {errors.email?.type === "required" && <div className='error-message'>Vui lòng nhập email!</div>}
              {errors.email?.type === "pattern" && <div className='error-message'>Email chưa đúng định dạng!</div>}
            </div>

            <div className="auth-form-item">
              <div className="input-item">
                <TextField
                  {...register("password", { required: true, minLength: 6 })}
                  type="password"
                  sx={{ width: '100%' }}
                  label="Mật khẩu" placeholder="Nhập mật khẩu"
                />
              </div>
              {errors.password?.type === "required" && <div className='error-message'>Vui lòng nhập mật khẩu!</div>}
              {errors.password?.type === "minLength" && <div className='error-message'>Mật khẩu tối thiểu 6 ký tự!</div>}
            </div>

            <div className="auth-form-item">
              <div className="input-item">
                <TextField
                  {...register("confirmPassword", {
                    required: true,
                    validate: value => value === watch("password")
                  })}
                  type="password"
                  sx={{ width: '100%' }}
                  label="Nhập lại mật khẩu" placeholder="Nhập lại mật khẩu"
                />
              </div>
              {errors.confirmPassword?.type === "required" && <div className='error-message'>Vui lòng nhập lại mật khẩu!</div>}
              {errors.confirmPassword?.type === "validate" && <div className='error-message'>Mật khẩu nhập lại chưa khớp!</div>}
            </div>

            <div className="auth-form-item">
              <div className="input-item">
                <TextField
                  {...register("phoneNumber")}
                  sx={{ width: '100%' }}
                  label="Số điện thoại" placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div className="auth-form-item">
              <div className="input-item">
                <TextField
                  {...register("className")}
                  sx={{ width: '100%' }}
                  label="Lớp" placeholder="Ví dụ: K66-CNTT"
                />
              </div>
            </div>

            <div className="auth-form-item">
              <div className="input-item">
                <TextField
                  {...register("schoolName")}
                  sx={{ width: '100%' }}
                  label="Trường/Viện" placeholder="Ví dụ: Trường CNTT&TT"
                />
              </div>
            </div>

            <div className="auth-form-btn">
              <Button
                type='submit'
                variant="outlined"
                className="btn-submit"
                disabled={submitting}
              >
                {submitting ? <CircularProgress style={{ color: "white", width: '30px', height: '30px' }} /> : "Đăng ký"}
              </Button>
            </div>

            <div className="auth-form-switch">
              Đã có tài khoản? <span onClick={openLogin}>Đăng nhập</span>
            </div>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  )
}

export default RegisterForm;
