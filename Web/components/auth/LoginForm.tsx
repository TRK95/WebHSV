import { Button, CircularProgress, Container, Dialog, DialogContent, DialogTitle, Divider, FormGroup, InputAdornment, Slide, TextField, useMediaQuery } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { forwardRef, PropsWithoutRef, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from '../../app/hooks';
import { login, setCheckLoginCode, setFetching, setLoginCode, setShowForgotPopup, setShowLoginPopup, setShowSignupPopup } from '../../features/auth/auth.slice';
import { encodePassword } from '../../utils/encryption';
import AuthInput from './AuthInput';
import CloseIcon from '@mui/icons-material/Close';
import './style.scss';
import { useSnackbar } from 'notistack';
import { useTheme } from '@mui/system';

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
    <Slide
      easing={{
        enter: "cubic-bezier(0, 1.5, .8, 1)",
        exit: "linear"
      }}
      // timeout={{
      //   enter: 1000,
      //   exit: 1000
      // }}
      direction="down"
      ref={ref}
      {...props}
    />
  );
});

const LoginForm = (props: PropsWithoutRef<{
  defaultAccount?: string;
}>) => {
  const { defaultAccount } = props;
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const theme = useTheme()
  const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'))


  const { register, handleSubmit, reset, formState: { errors } } = useForm<AuthFormLogin>({
    mode: 'onChange'
  });
  const { fetchingAPI, user, student } = useSelector((state) => state.authState);
  const showLoginPopup = useSelector(state => state.authState.showLoginPopup)

  useEffect(() => {
    if (student?._id) {
      dispatch(setShowLoginPopup(false))
      reset({ username: '', password: '' });
      const msg = "Bạn đã đăng nhập thành công!"
      enqueueSnackbar(msg, { variant: "success", autoHideDuration: 2000, onClose: () => dispatch(setCheckLoginCode(null)) })
    }
  }, [student])

  const handleLogin = (values: AuthFormLogin) => {
    if (fetchingAPI) return;
    dispatch(setFetching(true))
    const { username, password } = values;
    // const username = _account.trim().toLowerCase();
    // encodePassword(username, _password)
    // dispatch(login({ username, password: password, token: 'PNiIwCMI8VrDA16n3IQj-ALUMI' }));
    dispatch(login({ email: username, password: password }));
  }

  const router = useRouter();
  const trans = useMemo(() => {
    const account = "Tài khoản"; const accountPlaceholder = "Nhập email";
    const password = "Mật khẩu"; const passwordPlaceHolder = "Nhập mật khẩu";
    // const forgotPassword = "Bạn quên mật khẩu?"; 
    const login = "Đăng nhập";
    const or = "HOẶC";
    const resetPassword = "Đặt lại mật khẩu";
    return { account, accountPlaceholder, password, passwordPlaceHolder, login, or, resetPassword }
  }, [router.locale]);

  return (
    <Dialog
      open={showLoginPopup}
      // TransitionComponent={Transition}
      keepMounted
      onClose={() => dispatch(setShowLoginPopup(false))}
      sx={{
        '& .MuiPaper-root': {
          width: isMobileUI ? 'unset' : '100%',
          maxWidth: '600px',
          borderRadius: '20px',
          position: 'absolute',
          top: 48,
        },
      }}
    >
      <div className="auth-form">
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--primary-color-main)' }} >
            <div className="close-box" onClick={() => dispatch(setShowLoginPopup(false))}>
              <CloseIcon color='inherit' />
            </div>
          </div>
          <div className="title">{trans.login}</div>
        </DialogTitle>
        <DialogContent>
          <form className="auth-form-body" onSubmit={handleSubmit(values => handleLogin(values))} >
            <div className="auth-form-item">
              {/* <label htmlFor="" className="item-name">{_account} (*)</label> */}
              <div className="input-item">
                <TextField
                  {...register("username", { required: true })}
                  sx={{ width: '100%' }}
                  label="Tài khoản" id="outlined-size-normal" placeholder="Nhập email" InputProps={{
                    startAdornment: (
                      <></>
                    )
                  }}
                />
              </div>
              {errors.username?.type === "required" && <div className='error-message'>Vui lòng nhập thông tin!</div>}
            </div>
            <div className="auth-form-item">
              {/* <label htmlFor="" className="item-name">{_password} (*)</label> */}
              <div className="input-item">
                <TextField
                  {...register("password", { required: true })}
                  type="password"
                  sx={{ width: '100%' }}
                  label="Mật khẩu" id="outlined-size-normal" placeholder="Nhập mật khẩu" InputProps={{
                    startAdornment: (
                      <></>
                    )
                  }}
                />
              </div>
              {errors.password?.type === "required" && <div className='error-message'>Vui lòng nhập thông tin!</div>}
            </div>

            <div className="auth-form-btn">
              <Button
                type='submit'
                variant="outlined"
                className="btn-submit"
                onSubmit={handleSubmit((values) => handleLogin(values))}
              >{fetchingAPI ? <CircularProgress style={{ color: "white", width: '30px', height: '30px' }} /> : trans.login}</Button>
            </div>
          </form >
        </DialogContent>
      </div >
    </Dialog >
  )
}

export default LoginForm