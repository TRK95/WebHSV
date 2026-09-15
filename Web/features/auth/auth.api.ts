import { get, getEndpoint, post } from "../../utils/fetcher"
import ObjectId from "bson-objectid";
import { LOGIN_FAILED } from "../../modules/share/constraint";
import { GET_API, POST_API } from "../../utils/api";
import Student from "../../models/studentModel";
import { LOGIN_CODE_FAILED, LOGIN_CODE_SUCCESS, STATUS_DATA_REJECTED, USER_LOGIN_FAILED } from "../../utils/constraint";
import ClubMember from "../../models/ClubMember";
import UserInfo from "../../models/UserInfo";

export const apiRegisterUserId = async () => {
  // const { data, error } = await post({ endpoint: "/api/users/register-id" });
  // return {
  //   error,
  //   userId: error ? '' : data?.userId
  // }

  return Promise.resolve({ userId: ObjectId(new Date().getTime()).toHexString() });
}

// export const apiLogin = async ({ reqQuery }): Promise<{ data: Student & string, status: number }> => {
//   const url = 'alumni/login'
//   const res = await POST_API({ url, reqQuery });

//   if (res.status !== 200) {
//     return {
//       data: null,
//       status: LOGIN_FAILED
//     }
//   }

//   return res.data ?? {}
// }

export const apiLogin = async (reqBody: { email: string, password: string }): Promise<{ data: { userId: string, clubIds: string[], userInfo: UserInfo }, token: string, status: number }> => {
  const url = 'userInfos/signInMember';
  const res = await POST_API({ url, reqBody });

  if (res.status !== 200) {
    return {
      data: null,
      token: "",
      status: LOGIN_FAILED
    }
  }

  return res.data ?? [];
}


export const apiCheckLogin = async (reqBody: { token: string }): Promise<{ data: any, status: number }> => {
  const url = 'userInfos/authorizeByToken';
  const res = await POST_API({ url, reqBody });

  if (res.status !== 200) {
    return {
      data: null,
      status: LOGIN_FAILED
    }
  }

  return res.data ?? [];
}


// export const apiCheckLogin = async ({ reqQuery }): Promise<{ data: Student & string, status: number }> => {
//   const url = 'check-login';
//   const res = await GET_API({ url, reqQuery });

//   if (res.status !== 200) {
//     return {
//       data: null,
//       status: LOGIN_FAILED
//     }
//   }

//   return res.data ?? {}
// }

export const apiRegister = async ({ reqBody }): Promise<{
  data: any, status: number
}> => {
  const url = 'userInfos/createUserInfo'
  const res = await POST_API({ url, reqBody });

  if (res.status !== 200) {
    return {
      data: null,
      status: STATUS_DATA_REJECTED
    }
  }

  return res.data ?? {};
}

// export const apiLogout = async (token: string) => {
//   const { data, error } = await post({ endpoint: "/api/logout", body: {}, customHeaders: { "x-access-token": token } })
//   return error ? null : data;
// }

export const apiLogout = async ({ reqQuery }): Promise<{ data: string, status: number }> => {
  const url = "logout";
  const res = await POST_API({ url, reqQuery })
  return res
}

export const apiChangeUserPassword = async ({ reqQuery }): Promise<{ data: any, status: number }> => {
  const url = '/userInfos/changePassword';
  const res = await POST_API({ url, reqQuery });
  if (res.status !== 200) {
    return {
      data: null,
      status: LOGIN_FAILED
    }
  }
  return res.data ?? {}
}

export const apiGetUserByToken = async (token: string): Promise<UserInfo> => {
  const { data, error } = await post({
    endpoint: "/api/get-user-from-token", customHeaders: {
      "x-access-token": token
    }
  });
  return error ? null : data
}

export const apiUpdateUserInfor = async (
  args: {
    _id?: string,
    userId?: string,
    status?: number,
    fullName?: string,
    birthdate?: number,
    className?: string,
    schoolName?: string,
    year?: number,
    phoneNumber?: string,
    email?: string,
    studentYear?: string,
    avatarUrl?: string,
    homeProvince?: string,
    password?: string
  }
): Promise<{ data: any, token: string, status: number }> => {
  const { data, error } = await post({ endpoint: "/api/userInfos/updateUserInfo", body: { ...args } })
  return error ? null : data;
}

export const apiGetUserInforByToken = async ({ token }: { token: string }): Promise<{
  success: boolean,
  userInfoDetail: UserInfo & { info: string }
}> => {
  const { data, error } = await post({ endpoint: "/api/get-user-additional-info-from-token", body: { token } })
  return error ? null : data;
}

export type ForgotAppPasswordArgs = {
  token: string;
  userId: string;
}

export const apiRequestResetPassword = async ({ reqQuery }): Promise<{
  data: any, status: number
}> => {
  const url = 'alumni/password/reset'
  const res = await POST_API({ url, reqQuery });
  if (res.status !== 200) {
    return {
      data: null,
      status: LOGIN_FAILED
    }
  }
  return res.data ?? {};
}

export const apiGetResetPasswordTokenStatus = async (token: string, local?: boolean): Promise<{ userId: string; account: string } | null> => {
  const { data, error } = await get({
    endpoint: getEndpoint("/api/forgot-app-password/token-status", local), customHeaders: {
      "x-access-token": token
    },
  });
  return error ? null : data;
}

export const apiResetPassword = async (args: {
  token: string;
  password: string;
}): Promise<number> => {
  const { data, error } = await post({
    endpoint: "/api/reset-app-password", body: { password: args.password }, customHeaders: {
      "x-access-token": args.token
    }
  });
  return error ? LOGIN_FAILED : (data?.loginCode ?? LOGIN_FAILED)
}
