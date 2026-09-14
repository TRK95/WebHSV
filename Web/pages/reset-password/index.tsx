import { Container } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "../../app/hooks";
import { ROUTER_LOGIN } from "../../app/router";
import { wrapper } from "../../app/store";
import ResetPassForm from "../../components/auth/ResetPassForm";
import Footer from "../../components/footer";
import { apiGetAppSettingDetails } from "../../features/appInfo/appInfo.api";
import { setAppInfo } from "../../features/appInfo/appInfo.slice";
import { apiGetResetPasswordTokenStatus } from "../../features/auth/auth.api";
import { setLoginCode } from "../../features/auth/auth.slice";
import Layout from "../../features/common/Layout";
import { APP_NAME } from "../../utils/checkApp";
import { getWebAppProps } from "../../utils/getSEOProps";

const ResetPasswordPage = (props: {
    token: string;
    userId: string;
    account: string;
    isValidToken: boolean;
}) => {
    const {
        isValidToken,
        token,
        userId,
        account
    } = props;

    const appInfo = useSelector((state) => state.appInfos.appInfo);
    const dispatch = useDispatch();
    const router = useRouter();

    return <Layout
        {...getWebAppProps(appInfo)}
        title="Cài lại mật khẩu"
        disableAds
        disableAuth
        disableFBMessenger
    >
        {isValidToken
            ? <ResetPassForm
                account={account}
                token={token}
                userId={userId}
                onSuccess={() => {
                    dispatch(setLoginCode(null));
                    setTimeout(() => {
                        router.push({
                            pathname: "/",
                            query: {
                                account
                            }
                        })
                    }, 1000);
                }}
            />
            : <Container maxWidth="xl">
                <p>This link has expired</p>
            </Container>}
    </Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ query, store }) => {
    const appInfo = await apiGetAppSettingDetails({ appName: APP_NAME });
    if (!appInfo) return {
        notFound: true,
    };
    store.dispatch(setAppInfo(appInfo));

    const token = query.token as string;
    let isValidToken = true;
    let userId = '';
    let account = '';
    if (!token) isValidToken = false;
    else {
        const user = await apiGetResetPasswordTokenStatus(token, true);
        if (!user) isValidToken = false;
        else {
            userId = user.userId;
            account = user.account
        }
    }
    // if (!isValidToken) {

    // }
    return {
        props: {
            isValidToken,
            token,
            userId,
            account
        }
    }
});

export default ResetPasswordPage;