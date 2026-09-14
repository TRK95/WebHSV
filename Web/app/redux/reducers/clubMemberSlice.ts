import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import ClubMember from "../../../models/ClubMember"
import { PAGE_SIZE, RESPONSE_MEMBER_EXIST, RESPONSE_SUCCESS, STATUS_ACCEPTED } from "../../../utils/constraint"
import { apiApproveClub, apiGetMemberClubs, apiUpdateRole, apijoinClub } from "../../../utils/api/clubMembersApi"

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
    "clubMembers/loadCLubMember", async (dataBody: any) => {
        const dataClubMember = await apiGetMemberClubs({ reqQuery: dataBody })
        if (dataClubMember.status === RESPONSE_SUCCESS) {
            const datas = dataClubMember.data.map(data => new ClubMember(data))
            return { datas, total: dataClubMember?.total };
        }
    }
)

export const approveMemberClub = createAsyncThunk(
    "clubMembers/approveMemberClub", async (dataBody: {
        studentId: string,
        clubId: number,
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
        studentId: string,
        clubId: number
    }, { dispatch }) => {
    const dataClubMember = await apijoinClub({ reqQuery: dataBody })
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
        studentId: string,
        clubId: number,
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
                message: 'Không tải được danh sách thành viên'
            }
        })

        // approve 
        builder.addCase(approveMemberClub.pending, (state) => { state.loadingApprove = true })
        builder.addCase(approveMemberClub.fulfilled, (state, action) => {
            state.loadingApprove = false
            state.notifications = {
                isError: false,
                message: action.payload?.status === STATUS_ACCEPTED ? 'Duyệt thành viên thành công' : 'Xóa thành viên thành công'
            }
        })
        builder.addCase(approveMemberClub.rejected, (state) => {
            state.notifications = {
                isError: true,
                message: 'Không chấp nhận được thành viên'
            }
        })

        // joinClub
        builder.addCase(joinClub.pending, (state) => { state.loadingJoinClub = true })
        builder.addCase(joinClub.fulfilled, (state, action) => {
            state.loadingJoinClub = false
            if (typeof action.payload === 'string') {
                state.notifications = {
                    isError: false,
                    message: 'Người dùng đã gửi yêu cầu tham gia trước đó'
                }
            } else {
                state.notifications = {
                    isError: false,
                    message: 'Gửi yêu cầu thành công'
                }
            }
        })
        builder.addCase(joinClub.rejected, (state) => {
            state.loadingJoinClub = false
            state.notifications = {
                isError: true,
                message: 'Không thể thêm thành viên'
            }
        })

        // updateRoleMember
        builder.addCase(updateRoleMember.pending, state => { state.loadingApprove = true })
        builder.addCase(updateRoleMember.fulfilled, (state, action) => {
            state.loadingApprove = false
            if (action.payload.status === RESPONSE_SUCCESS) {
                state.notifications = {
                    isError: false,
                    message: 'Cập nhật thành công'
                }
            }
        })
        builder.addCase(updateRoleMember.rejected, (state) => {
            state.loadingApprove = false
            state.notifications = {
                isError: false,
                message: 'Lỗi server , cập nhật không thành công'
            }
        })

    }
})

export const { resetMessageError } = clubMembers.actions;

const clubMembersReducer = clubMembers.reducer;
export default clubMembersReducer;