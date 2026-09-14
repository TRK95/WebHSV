import { apiApproveClub, apiGetMemberClubs, apijoinClub, apiSetPresidentClub, apiUpdateRole, reqQueryClubMember } from "@/api/clubMembersApi"
import ClubMember from "@/models/ClubMember"
import { UserInfoI } from "@/models/UserInfo"
import { PAGE_SIZE, RESPONSE_MEMBER_EXIST, RESPONSE_SUCCESS, STATUS_ACCEPTED } from "@/utils/contrants"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export type ClubMemberState = {
    clubMembers: ClubMember[],
    loading: boolean,
    total: number,
    notifications: {
        isError: boolean,
        message: string
    },
    loadingApprove: boolean,
    loadingJoinClub: boolean,
}

const initialState: ClubMemberState = {
    clubMembers: [],
    loading: false,
    total: 0,
    loadingApprove: false,
    loadingJoinClub: false,
    notifications: {
        isError: false,
        message: ''
    }
}

export const loadCLubMember = createAsyncThunk(
    "clubMembers/loadCLubMember", async (dataBody: reqQueryClubMember) => {
        const dataClubMember = await apiGetMemberClubs(dataBody)
        if (dataClubMember.status === RESPONSE_SUCCESS) {
            const datas = dataClubMember.data.map(data => new ClubMember(data))
            return { datas, total: dataClubMember.total };
        }
    }
)

export const approveMemberClub = createAsyncThunk(
    "clubMembers/approveMemberClub", async (dataBody: {
        userId: string,
        clubId: string,
        status: number
    }, { dispatch }) => {
    const dataClubMember = await apiApproveClub(dataBody)
    if (dataClubMember.status === RESPONSE_SUCCESS && dataClubMember.data) {
        dispatch(loadCLubMember({
            limit: PAGE_SIZE,
            offset: 0,
            clubId: dataBody.clubId
        }))
        return new ClubMember(dataClubMember.data)
    }
})

export const joinClub = createAsyncThunk(
    "clubMembers/joinClub", async (dataBody: {
        user: UserInfoI,
        clubId: string
    }, { dispatch }) => {
    const dataClubMember = await apijoinClub({ clubId: dataBody.clubId }, { user: dataBody.user })
    if (dataClubMember.status === RESPONSE_SUCCESS) {
        dispatch(loadCLubMember({
            limit: PAGE_SIZE,
            offset: 0,
            clubId: dataBody.clubId
        }))
        return new ClubMember(dataClubMember.data)
    }
    if (dataClubMember.status === RESPONSE_MEMBER_EXIST) {
        return dataClubMember.data
    }
})

export const updateRoleMember = createAsyncThunk(
    "clubMembers/updateRoleMember", async (dataBody: {
        userId: string,
        clubId: string,
        role: number
    }) => {
    const dataClubMember = await apiUpdateRole(dataBody)
    return dataClubMember
})


const clubMembers = createSlice({
    name: "clubMembers",
    initialState,
    reducers: {
        resetMessageError: (state) => {
            state.notifications = {
                isError: false,
                message: ''
            }
        },
        setClubMembers: (state, action) => {
            state.clubMembers = action.payload
        }
    },
    extraReducers: (builder) => {
        const actionList = [loadCLubMember]
        actionList.forEach(action => {
            builder.addCase(action.pending, (state) => {
                state.loading = true;
            })
        })
        // load clubMembers 
        builder.addCase(loadCLubMember.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.clubMembers = [...action.payload.datas];
                state.total = action.payload.total || 0
            }
        });
        builder.addCase(loadCLubMember.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'không tải được danh sách thành viên'
            }
        })

        // approve 
        builder.addCase(approveMemberClub.pending, (state) => { state.loadingApprove = true })
        builder.addCase(approveMemberClub.fulfilled, (state, action) => {
            state.loadingApprove = false
            state.notifications = {
                isError: false,
                message: action.payload?.status === STATUS_ACCEPTED ? 'duyệt thành viên thành công' : 'xóa thành viên thành công'
            }
        })
        builder.addCase(approveMemberClub.rejected, (state) => {
            state.notifications = {
                isError: true,
                message: 'không chấp nhận được thành viên'
            }
        })

        // joinClub
        builder.addCase(joinClub.pending, (state) => { state.loadingJoinClub = true })
        builder.addCase(joinClub.fulfilled, (state, action) => {
            state.loadingJoinClub = false
            if (typeof action.payload === 'string') {
                state.notifications = {
                    isError: true,
                    message: 'người dùng đã gửi yêu cầu tham gia trước đó'
                }
            } else {
                state.notifications = {
                    isError: false,
                    message: 'gửi yêu cầu thành công'
                }
            }
        })
        builder.addCase(joinClub.rejected, (state) => {
            state.loadingJoinClub = false
            state.notifications = {
                isError: true,
                message: 'không thể thêm thành viên'
            }
        })

        // updateRoleMember
        builder.addCase(updateRoleMember.pending, state => { state.loadingApprove = true })
        builder.addCase(updateRoleMember.fulfilled, (state, action) => {
            state.loadingApprove = false
            if (action.payload.status === RESPONSE_SUCCESS) {
                state.notifications = {
                    isError: false,
                    message: 'cập nhật thành công'
                }
            }
        })
        builder.addCase(updateRoleMember.rejected, (state) => {
            state.loadingApprove = false
            state.notifications = {
                isError: false,
                message: 'lỗi server , cập nhật không thành công'
            }
        })

    }
})

export const { resetMessageError, setClubMembers } = clubMembers.actions;

const clubMembersReducer = clubMembers.reducer;
export default clubMembersReducer;