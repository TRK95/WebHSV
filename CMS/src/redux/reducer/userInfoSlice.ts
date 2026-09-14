import UserInfo from "@/models/UserInfo";
import ClubMember from "@/models/ClubMember";
import { PAGE_SIZE, RESPONSE_SUCCESS, STATUS_DELETED, STATUS_PUBLIC } from "@/utils/contrants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from ".";
import { apiAuthorizeByToken, apiCheckPresidentSignIn } from "@/api/userInfoApi";
import { message } from "antd";

export type UserInfoState = {
    userInfo: ClubMember | null,
    token: string,
    loading: boolean,
    status: number,
    notifications: {
        isError: boolean,
        message: string
    }
}

const initialState: UserInfoState = {
    userInfo: null,
    token: "",
    loading: false,
    status: STATUS_PUBLIC,
    notifications: {
        isError: false,
        message: ''
    }
}

export const getPresidentSignIn = createAsyncThunk(
    "userInfo/presidentSignIn", async (dataBody: {
        email: string,
        password: string
    }) => {
    const presidentInfo = await apiCheckPresidentSignIn(dataBody)
    if (presidentInfo.status === RESPONSE_SUCCESS) {
        const data = new ClubMember(presidentInfo.data)
        const token = presidentInfo.token
        return { data, token }
    }
})

export const fetchPresidentByToken = createAsyncThunk(
    "userInfo/fetchPresidentByToken", async (
        token: string
    ) => {
    const president = await apiAuthorizeByToken({ token })
    if (president.status === RESPONSE_SUCCESS) {
        const data = new ClubMember(president.data)
        return { data, token: token }
    }
})

const userInfo = createSlice({
    name: "userInfo",
    initialState,
    reducers: {
        resetNotification: (state) => {
            state.notifications = {
                isError: false,
                message: ''
            }
        }
    },
    extraReducers: builder => {
        const actionList = [getPresidentSignIn]
        actionList.forEach(action => {
            builder.addCase(action.pending, (state) => {
                state.loading = true;
            })
            // 
            builder.addCase(getPresidentSignIn.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.userInfo = action.payload.data;
                    state.token = action.payload.token;
                    message.success('Đăng nhập thành công!')
                    window.location.href = process.env.PATH_NAME || '/to-chuc';
                }
            })
            builder.addCase(getPresidentSignIn.rejected, (state) => {
                state.loading = false;
                state.notifications = {
                    isError: true,
                    message: 'Đăng nhập không thành công'
                }
            })
            builder.addCase(fetchPresidentByToken.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload) {
                    state.userInfo = state.userInfo ?? action.payload.data;
                    state.token = !!state.token ? state.token : action.payload.token;
                }
            })
            builder.addCase(fetchPresidentByToken.rejected, (state) => {
                state.loading = false;
                state.notifications = {
                    isError: true,
                    message: 'Không thể truy cập website'
                }
            })
        })
    }
})

export const { resetNotification } = userInfo.actions;

const userInfoReducer = userInfo.reducer;
export default userInfoReducer;
