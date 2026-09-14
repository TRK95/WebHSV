import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from '../../app/hooks';
import { setShowChangePassWord } from '../../features/auth/auth.slice';
import CloseIcon from '@mui/icons-material/Close';
import './style.scss';
import { useSnackbar } from 'notistack';
import { apiChangeUserPassword } from '../../features/auth/auth.api';
import { getEncryptedText } from '../../utils/encryption';

type AuthFormChangePass = {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
}

const ChangePassword = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<AuthFormChangePass>();
    const { showChangePassWord, student } = useSelector((state) => state.authState);
    const currentPasswordRef = useRef<string>("");
    const newPasswordRef = useRef<string>("");
    currentPasswordRef.current = watch("currentPassword", "");
    newPasswordRef.current = watch("newPassword", "");
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    const router = useRouter();
    const trans = useMemo(() => {
        const currentPassword = "Mật khẩu hiện tại", currentPasswordPlaceHolder = "Mật khẩu hiện tại";
        const newPassword = "Mật khẩu mới", newPasswordPlaceHolder = "Mật khẩu mới";
        const confirmPassword = "Xác nhận mật khẩu", confirmPasswordPlaceHolder = "Xác nhận mật khẩu";
        const changePassword = "Đổi mật khẩu";

        return { changePassword, currentPasswordPlaceHolder, currentPassword, newPassword, newPasswordPlaceHolder, confirmPassword, confirmPasswordPlaceHolder };
    }, [router.locale]);

    const handleClose = () => {
        dispatch(setShowChangePassWord(false));
    };

    const handleChangePassword = async (values: AuthFormChangePass) => {
        const { currentPassword, newPassword } = values;
        const data = await apiChangeUserPassword({
            reqQuery: {
                userId: student?._id,
                oldPassword: getEncryptedText(currentPassword),
                newPassword: getEncryptedText(newPassword)
            }
        });
        if (data.status === 1) {
            dispatch(setShowChangePassWord(false));
            enqueueSnackbar("Thay đổi mật khẩu thành công!", { variant: "success", autoHideDuration: 2000 });
        } else if (data.status === 0) {
            enqueueSnackbar("Bạn đã nhập sai mật khẩu hiện tại!", { variant: "error", autoHideDuration: 2000 });
        } else {
            enqueueSnackbar("Thay đổi mật khẩu thất bại!", { variant: "error", autoHideDuration: 2000 });
        }
    };

    return (
        <Dialog
            sx={{
                '& .MuiPaper-root': {
                    width: '100%',
                    borderRadius: '20px'
                }
            }}
            open={showChangePassWord}
            onClose={handleClose}
            aria-describedby="alert-dialog"
        >
            <div className="auth-form" style={{ padding: '25px' }}>
                <DialogTitle>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--primary-color-main)' }}>
                        <div className="close-box" onClick={handleClose}>
                            <CloseIcon color='inherit' />
                        </div>
                    </div>
                    <div className="title">{trans.changePassword}</div>
                </DialogTitle>
                <DialogContent>
                    <div style={{ backgroundColor: '#fff' }}>
                        <form className="auth-form-body">
                            <div className="auth-form-item">
                                <div className="input-item">
                                    <TextField
                                        type="password"
                                        {...register("currentPassword", { required: true })}
                                        sx={{ width: '100%' }}
                                        label={trans.currentPassword}
                                        id="outlined-size-normal"
                                        placeholder={trans.currentPasswordPlaceHolder}
                                        InputProps={{
                                            startAdornment: (
                                                <></>
                                            )
                                        }}
                                    />
                                </div>
                                {errors.currentPassword && <div className="auth-error-msg">Mật khẩu hiện tại không đúng!</div>}
                            </div>
                            <div className="auth-form-item">
                                <div className="input-item">
                                    <TextField
                                        type="password"
                                        {...register("newPassword", {
                                            required: true,
                                            minLength: {
                                                value: 8,
                                                message: "Mật khẩu phải có ít nhất 8 ký tự!"
                                            },
                                            validate: {
                                                differentFromCurrent: (value) => value !== currentPasswordRef.current || "Mật khẩu mới phải khác mật khẩu hiện tại!",
                                                hasUpperCase: (value) => /[A-Z]/.test(value) || "Mật khẩu phải chứa ít nhất một chữ cái viết hoa!",
                                                hasNumber: (value) => /[0-9]/.test(value) || "Mật khẩu phải chứa ít nhất một chữ số!"
                                            }
                                        })}
                                        sx={{ width: '100%' }}
                                        label={trans.newPassword}
                                        id="outlined-size-normal"
                                        placeholder={trans.newPasswordPlaceHolder}
                                        InputProps={{
                                            startAdornment: (
                                                <></>
                                            )
                                        }}
                                    />
                                </div>
                                {errors.newPassword && <div className="auth-error-msg">{errors.newPassword.message}</div>}
                            </div>
                            <div className="auth-form-item">
                                <div className="input-item">
                                    <TextField
                                        type="password"
                                        {...register("confirmPassword", {
                                            required: true,
                                            minLength: {
                                                value: 8,
                                                message: "Mật khẩu phải có ít nhất 8 ký tự!"
                                            },
                                            validate: (value) => value === newPasswordRef.current || "Xác nhận mật khẩu không đúng!"
                                        })}
                                        sx={{ width: '100%' }}
                                        label={trans.confirmPassword}
                                        id="outlined-size-normal"
                                        placeholder={trans.confirmPasswordPlaceHolder}
                                        InputProps={{
                                            startAdornment: (
                                                <></>
                                            )
                                        }}
                                    />
                                </div>
                                {errors.confirmPassword && <div className="auth-error-msg">{errors.confirmPassword.message}</div>}
                            </div>
                            <div className="auth-form-btn">
                                <Button
                                    type='submit'
                                    variant="outlined"
                                    className="btn-submit"
                                    onClick={handleSubmit((values) => handleChangePassword(values))}
                                >{trans.changePassword}</Button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    )
}

export default ChangePassword;
