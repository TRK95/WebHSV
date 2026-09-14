import React from 'react';
import { useSelector } from '../../app/hooks';
import { wrapper } from '../../app/store';
// import AuthView from '../../components/auth/AuthView';
import Layout from '../../features/common/Layout';
import usePageAuth from '../../hooks/usePageAuth';
import { getWebAppProps } from "../../utils/getSEOProps";

import { SnackbarProvider } from 'notistack';

const LoginPage = () => {
  // const appInfo = useSelector((state) => state.appInfos.appInfo);

  usePageAuth('/');

  return (
    <Layout
      // {...getWebAppProps(appInfo)} 
      title={"Login"}>
      {/* <AuthView /> */}
    </Layout>
  )
}

export const getStaticProps = wrapper.getStaticProps(async ({ store, params }) => {
  // const appName = process.env.NEXT_PUBLIC_APP_NAME;
  // if (!appName) throw new Error("appName is not defined");
  // const appInfo = await apiGetAppSettingDetails({ appName });
  // store.dispatch(setAppInfo(appInfo));
  // if (!appInfo) return {
  //   notFound: true
  // }
  return {
    props: {
    }
  }
});

export default LoginPage