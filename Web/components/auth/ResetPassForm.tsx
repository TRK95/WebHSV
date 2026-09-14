import { Button, Container } from "@mui/material";
import { useSnackbar } from "notistack";
import { PropsWithoutRef, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "../../app/hooks";
import { resetPassword } from "../../features/auth/auth.slice";
import { LOGIN_SUCCESS } from "../../modules/share/constraint";
import { encodePassword } from "../../utils/encryption";
import AuthInput from "./AuthInput";
import "./style.scss";

type AuthFormResetPass = {
    password: string;
    confirmPassword: string;
}

const ResetPassForm = (props: PropsWithoutRef<{
    onSuccess?: () => void,
    account?: string;
    userId?: string;
    token?: string;
}>) => {
    const {
        onSuccess = () => { },
        account,
        userId,
        token
    } = props;
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<AuthFormResetPass>();
    const { enqueueSnackbar } = useSnackbar();
    const loginCode = useSelector((state) => state.authState.loginCode);
    const dispatch = useDispatch();
    const passwordRef = useRef<string>("");
    passwordRef.current = watch("password", "");

    const onClickSubmit = (values: AuthFormResetPass) => {
        const { password: _password } = values;
        dispatch(resetPassword({
            token, password: encodePassword(userId, _password)
        }));
    }

    useEffect(() => {
        if (loginCode !== null && loginCode !== LOGIN_SUCCESS) {
            enqueueSnackbar("Có gì đó sai, vui lòng thử lại!", { variant: "error", autoHideDuration: 2000 })
        } else if (loginCode === LOGIN_SUCCESS) {
            enqueueSnackbar("Cài lại mật khẩu thành công!", { variant: "success", autoHideDuration: 2000 })
            onSuccess();
        }
    }, [loginCode]);

    return (
        <Container maxWidth="xl">
            <div className="auth-form">
                <div className="title">Cài lại mật khẩu</div>
                <span className="desc" style={{ textTransform: 'capitalize' }}>Chào {account}!</span>
                <form onSubmit={handleSubmit((values) => onClickSubmit(values))}>
                    <div className="auth-form-item">
                        <label htmlFor="password" className="item-name">Mật khẩu mới</label>
                        <div className="input-item">
                            <AuthInput
                                type="password"
                                autoComplete="new-password"
                                fullWidth
                                {...register("password", { minLength: 6, required: true })}
                            />
                            {errors.password?.type === "minLength" && <div className="auth-error-msg">Dùng ít nhất 6 ký tự!</div>}
                        </div>
                    </div>

                    <div className="auth-form-item">
                        <label htmlFor="password" className="item-name">Xác nhận mật khẩu</label>
                        <div className="input-item">
                            <AuthInput
                                type="password"
                                autoComplete="new-password"
                                fullWidth
                                {...register("confirmPassword", { minLength: 6, required: true, validate: (value) => value === passwordRef.current || "Xác nhận mật khẩu không khớp" })}
                            />
                            {errors.confirmPassword?.type === "minLength" && <div className="auth-error-msg">Dùng ít nhất 6 ký tự!</div>}
                            {errors.confirmPassword?.type === "validate" && <div className="auth-error-msg">Xác nhận mật khẩu không khớp!</div>}
                        </div>
                    </div>

                    <div className="auth-form-btn">
                        <Button
                            type="submit"
                            className="btn-submit"
                        >
                            Cài lại mật khẩu
                        </Button>
                    </div>
                </form>
            </div>
        </Container>
    )
}

export default ResetPassForm;