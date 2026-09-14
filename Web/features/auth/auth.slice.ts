import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import localforage from "localforage";
import { persistReducer } from "redux-persist";
import { USER_LOGIN_SUCCESS } from "../../utils/constraint";
import { getEncryptedText, getDecryptedText } from "../../utils/encryption";
import { apiChangeUserPassword, apiGetUserInforByToken, apiGetUserByToken, apiLogin, apiRegisterUserId, apiRequestResetPassword, apiResetPassword, apiCheckLogin, apiUpdateUserInfor } from "./auth.api";
import { LOCAL_SESSION_ID } from "./auth.config";
import UserInfo from "../../models/UserInfo";

type FetchUserResult = {
  _id: string;
  token: string;
  user?: any;
}

export type AuthState = {
  userId: string;
  loading: boolean;
  user: UserInfo & { info?: { class?: number, school?: string } } | null;
  student: UserInfo | null;
  userClub: string[] | [];
  checkLoginCode: number | null;
  token: string;
  loginCode: number | null;
  updateCode: number | null,
  fetchingAPI: boolean;
  showChangePassWord: boolean;
  showLoginPopup: boolean;
  showSignupPopup: boolean;
  showForgotPopup: boolean,
  showNotifyPopup: boolean,
  isForgot: boolean;
  class?: number;
  school?: string;
  dataResetPass: any;
  dataChangePass: any;
}

const initialState: AuthState = {
  userId: null,
  loading: true,
  user: null,
  student: null,
  userClub: [],
  checkLoginCode: null,
  token: null,
  loginCode: null,
  updateCode: null,
  fetchingAPI: false,
  showChangePassWord: false,
  showLoginPopup: false,
  showSignupPopup: false,
  showForgotPopup: false,
  showNotifyPopup: false,
  isForgot: false,
  dataResetPass: null,
  dataChangePass: null
}

export const authLocalForage = localforage.createInstance({
  name: "koolsoft-elearning-auth",
  storeName: "redux-persist"
})

export const registerUserId = createAsyncThunk("users/registerUserId", async () => {
  // const localUID = window.localStorage.getItem(LOCAL_USER_ID_KEY);
  // if (!!localUID) {
  //   return localUID;
  // }
  // TODO: create userId by bson-bject lib;
  const { userId }: { userId: string } = await apiRegisterUserId();
  // if (userId) window.localStorage.setItem(LOCAL_USER_ID_KEY, userId);
  return userId;
});

// export const login = createAsyncThunk("users/login", async (args: { username: string, password: string, token?: string }) => {
// const res = await apiLogin({
//     reqQuery: {
//       username: trim(args.username),
//       password: getEncryptedText(args.password),
//       token: args.token,
//       // version: '1.0'
//     }
//   });

//   return res
// });

export const login = createAsyncThunk("users/login", async (args: { email: string, password: string }) => {
  const res = await apiLogin(args);
  return res
});

export const updateUser = createAsyncThunk("user/update", async (args: {
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
}) => {
  const res = await apiUpdateUserInfor(args);
  return res
});

export const checkLogin = createAsyncThunk('users/checkLogin', async (args: { token: string }) => {
  const res = await apiCheckLogin(args)
  return { res, token: args.token }
})

export const logout = createAsyncThunk("users/logout", async () => {

})

export const fetchUserByToken = createAsyncThunk("users/fetchUserByToken", async (token: string): Promise<FetchUserResult> => {
  if (!token) {
    return { _id: null, token: null }
  };
  const user = await apiGetUserByToken(token);
  const additionInfo = await apiGetUserInforByToken({ token });
  return { _id: user?._id ?? '', token: !!user ? token : '', user: { ...user, info: additionInfo?.success ? additionInfo?.userInfoDetail?.info : '' } };
});

export const requestResetPassword = createAsyncThunk("users/requestResetPassword", async (args: { token: string, userId: string }) => {
  const dataResetPass = await apiRequestResetPassword({
    reqQuery: {
      token: args.token,
      userId: args.userId
    }
  });
  return dataResetPass;
});

export const resetPassword = createAsyncThunk("users/resetPassword", async (args: { token: string; password: string }) => {
  const loginCode = await apiResetPassword(args);
  return loginCode;
});

export const changePassword = createAsyncThunk("users/changePassword", async (args: { userId: string, oldPassword: string, newPassword: string }) => {
  const res = await apiChangeUserPassword({
    reqQuery: {
      userId: args.userId,
      oldPassword: getEncryptedText(args.oldPassword),
      newPassword: getEncryptedText(args.newPassword)
    }
  });
  return res;
});

const authSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.user = action.payload
    },
    setLoginCode: (state, action: PayloadAction<number | null>) => {
      state.loginCode = action.payload
    },
    setCheckLoginCode: (state, action: PayloadAction<number | null>) => {
      state.checkLoginCode = action.payload
    },
    setCheckUpdateCode: (state, action: PayloadAction<number | null>) => {
      state.updateCode = action.payload
    },
    setFetching: (state, action: PayloadAction<boolean>) => {
      state.fetchingAPI = action.payload
    },
    setShowChangePassWord: (state, action: PayloadAction<boolean>) => {
      state.showChangePassWord = action.payload
    },
    setShowLoginPopup: (state, action: PayloadAction<boolean>) => {
      state.showLoginPopup = action.payload
    },
    setShowSignupPopup: (state, action: PayloadAction<boolean>) => {
      state.showSignupPopup = action.payload
    },
    setShowForgotPopup: (state, action: PayloadAction<boolean>) => {
      state.showForgotPopup = action.payload
    },
    setShowNotifyPopup: (state, action: PayloadAction<boolean>) => {
      state.showNotifyPopup = action.payload
    },
    setIsForgot: (state, action: PayloadAction<boolean>) => {
      state.isForgot = action.payload
    },
    setDataResetPass: (state, action: PayloadAction<boolean>) => {
      state.dataResetPass = action.payload
    },
    setDataChangePass: (state, action: PayloadAction<boolean>) => {
      state.dataChangePass = action.payload
    },
    setLogout: (state, action) => {
      state.user = undefined;
      state.userId = '';
      state.token = null;
      window.localStorage.removeItem(LOCAL_SESSION_ID);
      window.localStorage.removeItem("token");
    }
  },
  extraReducers: (builder) => {
    builder
      // .addCase(registerUserId.fulfilled, (state, action) => {
      //   state.userId = action.payload;
      //   state.token = null;
      //   state.user = undefined;
      //   state.loading = false;
      //   state.fetchingAPI = false;
      // })
      // .addCase(login.fulfilled, (state, action: PayloadAction<Student>) => {
      //   const user = action.payload;
      //   state.user = user?.loginCode === LOGIN_SUCCESS ? user : undefined;
      //   state.userId = action.payload?._id ?? state.userId;
      //   state.token = user?.token || null;
      //   state.loginCode = user.loginCode;
      //   state.fetchingAPI = false;
      //   // if (!!user?._id) window.localStorage.setItem(LOCAL_USER_ID_KEY, user._id);
      // })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload?.data?.userId) {
          state.student = action.payload.data.userInfo
          state.userClub = action.payload.data.clubIds
        }
        state.fetchingAPI = false;
        state.checkLoginCode = action.payload.status
        if (action.payload.status === USER_LOGIN_SUCCESS) {
          action.payload.token = action.payload.token
          window.localStorage.setItem("token", action.payload.token)
        }
      })
      .addCase(checkLogin.fulfilled, (state, action) => {
        if (action.payload?.res.data?.userClubs) {
          state.student = action.payload.res.data.userClubs.userInfo
          state.userClub = action.payload.res.data.userClubs.clubIds
        }
        state.loading = false;
        state.token = action.payload.token
        state.checkLoginCode = action.payload.res.status
      })
      .addCase(fetchUserByToken.fulfilled, (state, action) => {
        const user = action.payload.user;
        if (user?.info) {
          const infoObject = JSON.parse(user.info);
          user.info = infoObject;
        }
        state.user = user;
        state.userId = action.payload?._id ?? state.userId;
        state.token = action.payload?.token;
        state.loading = false;
      })
      .addCase(requestResetPassword.fulfilled, (state, action) => {
        state.dataResetPass = action.payload;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loginCode = action.payload;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        console.log("action.payload: ", action)
        state.updateCode = action.payload.status
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.student = action.payload.data.userInfo
        state.userClub = action.payload.data.clubIds
        state.updateCode = action.payload.status
        if (action.payload.status === 1) { }
        window.localStorage.setItem("token", action.payload.token)
      })
    // builder.addMatcher(isAnyOf(logout.fulfilled, logout.rejected), (state) => {
    //   state.user = undefined;
    //   state.userId = '';
    //   state.token = null;
    //   window.localStorage.removeItem(LOCAL_SESSION_ID);
    //   window.localStorage.removeItem("token");
    // });
  }
});

const authReducer = typeof window === "undefined"
  ? authSlice.reducer
  : persistReducer({
    key: "auth",
    storage: authLocalForage,
    whitelist: ["token"],
    timeout: null
  }, authSlice.reducer);

export default authReducer;

export const { setUserInfo,
  setLoginCode, setAuthLoading, setFetching,
  setShowChangePassWord,
  setShowLoginPopup,
  setShowSignupPopup,
  setShowForgotPopup,
  setIsForgot,
  setCheckLoginCode,
  setCheckUpdateCode,
  setShowNotifyPopup,
  setDataResetPass,
  setDataChangePass,
  setLogout
} = authSlice.actions;