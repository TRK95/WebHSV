import { Button, Container, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useSnackbar } from "notistack";
import { PropsWithoutRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "../../app/hooks";
import { ROUTER_RESET_PASSWORD } from "../../app/router";
import { requestResetPassword, setIsForgot, setLoginCode, setShowForgotPopup, setShowLoginPopup, setShowSignupPopup, setShowNotifyPopup } from "../../features/auth/auth.slice";
import { isValidEmail } from "../../utils/format";
import AuthInput from "./AuthInput";
import './style.scss';
import CloseIcon from '@mui/icons-material/Close';
import { Transition } from "./LoginForm";
import { LOGIN_SUCCESS } from "../../modules/share/constraint";

type AuthFormForgotPass = {
  email: string;
}

const getSiteName = (siteAddress: string) => {
  try {
    return new URL(siteAddress).hostname;
  } catch (e) {
    return "";
  }
}

const ForgotPassForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AuthFormForgotPass>();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  // const appInfo = useSelector((state) => state.appInfos.appInfo);
  const { showForgotPopup, loginCode, dataResetPass, isForgot } = useSelector(state => state.authState)

  useEffect(() => {
    if (isForgot && dataResetPass) {
      dispatch(setShowForgotPopup(false))
      dispatch(setShowNotifyPopup(true))
      reset({ email: '' })
      dispatch(setIsForgot(false))
    }
  }, [isForgot])

  const onClickSubmit = async (values: AuthFormForgotPass) => {
    const { email } = values;
    // const host = (process.env.NODE_ENV !== "production" ? '' : (appInfo.siteAddress ?? ''));
    //request reset password ở đây => test
    await dispatch(requestResetPassword({
      token: 'PNiIwCMI8VrDA16n3IQj-ALUMI',
      userId: email
    }));
    dispatch(setIsForgot(true))
  }

  const handleChangeToLoginPopup = () => {
    dispatch(setShowForgotPopup(false))
    dispatch(setShowLoginPopup(true))
    dispatch(setShowSignupPopup(false))
  }

  return <Dialog
    open={showForgotPopup}
    // TransitionComponent={Transition}
    keepMounted
    onClose={() => dispatch(setShowForgotPopup(false))}
    sx={{
      '& .MuiPaper-root': {
        width: '100%',
        maxWidth: '600px',
        borderRadius: '20px',
        position: 'absolute',
        top: 48,
      }
    }}
  >
    <div className="auth-form">
      <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--primary-color-main)' }} >
          <div className="close-box" onClick={() => dispatch(setShowForgotPopup(false))}>
            <CloseIcon color='inherit' />
          </div>
        </div>
        <div style={{ marginBottom: '10px', color: 'var(--primary-color-main)' }}>
          <Button onClick={handleChangeToLoginPopup} size='large' color="inherit" startIcon={<ArrowBackIosNewIcon />}>
            Quay lại
          </Button>
        </div>
        <div className="title">Đặt lại mật khẩu</div>
      </DialogTitle>
      <DialogContent>
        <form className="auth-form-body" onSubmit={handleSubmit(values => onClickSubmit(values))}>
          <div className="desc">Quên mật khẩu? Hãy điền địa chỉ email của bạn. Mật khẩu của bạn sẽ được tạo mới và gửi về email của bạn.</div>
          <div className="auth-form-item">
            <div className="input-item">
              <TextField
                {...register("email", { required: true })}
                type="email"
                sx={{ width: '100%' }}
                label="Email" id="outlined-size-normal" defaultValue="" />
            </div>
          </div>

          <div className="auth-form-btn" style={{ marginTop: '10px' }}>
            <Button
              type="submit"
              className="btn-submit"
            >
              Quên mật khẩu
            </Button>
          </div>
        </form>
      </DialogContent>
    </div>
  </Dialog>
}

export default ForgotPassForm;