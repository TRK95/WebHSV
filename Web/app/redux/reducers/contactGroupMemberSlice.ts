import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import ClubMember from "../../../models/ClubMember"
import { PAGE_SIZE, RESPONSE_MEMBER_EXIST, RESPONSE_SUCCESS, STATUS_ACCEPTED } from "../../../utils/constraint"
import { apiApproveClub, apiGetMemberClubs, apiUpdateRole, apijoinClub } from "../../../utils/api/clubMembersApi"

export type ContactGroupMemberState = {
    contactGroupMembers: ClubMember[],
    loading: boolean,
    total: number,
    notifications: {
        isError: boolean,
        message: string
    },
    loadingApprove: boolean,
    loadingJoinContactGroup: boolean,
}

const initialState: ContactGroupMemberState = {
    contactGroupMembers: [],
    loading: false,
    total: 0,
    loadingApprove: false,
    loadingJoinContactGroup: false,
    notifications: {
        isError: false,
        message: ''
    }
}

export const loadContactGroupMember = createAsyncThunk(
    "contactGroupMembers/loadContactGroupMember", async (dataBody: any) => {
        const dataContactGroupMember = await apiGetMemberClubs({ reqQuery: dataBody })
        if (dataContactGroupMember.status === RESPONSE_SUCCESS) {
            const datas = dataContactGroupMember.data.map(data => new ClubMember(data))
            return { datas, total: dataContactGroupMember?.total };
        }
    }
)

export const approveMemberContactGroup = createAsyncThunk(
    "contactGroupMembers/approveMemberContactGroup", async (dataBody: {
        studentId: string,
        clubId: number,
        status: number
    }, { dispatch }) => {
    const dataContactGroupMember = await apiApproveClub(dataBody)
    if (dataContactGroupMember.status === RESPONSE_SUCCESS && dataContactGroupMember.data) {
        dispatch(loadContactGroupMember({
            limit: PAGE_SIZE,
            offset: 0,
            clubId: dataBody.clubId
        }))
        return new ClubMember(dataContactGroupMember.data)
    }
})

export const joinContactGroup = createAsyncThunk(
    "contactGroupMembers/joinContactGroup", async (dataBody: {
        studentId: string,
        clubId: number
    }, { dispatch }) => {
    const dataContactGroupMember = await apijoinClub({ reqQuery: dataBody })
    if (dataContactGroupMember.status === RESPONSE_SUCCESS) {
        dispatch(loadContactGroupMember({
            limit: PAGE_SIZE,
            offset: 0,
            clubId: dataBody.clubId
        }))
        return new ClubMember(dataContactGroupMember.data)
    }
    if (dataContactGroupMember.status === RESPONSE_MEMBER_EXIST) {
        return dataContactGroupMember.data
    }
})

export const updateRoleMember = createAsyncThunk(
    "contactGroupMembers/updateRoleMember", async (dataBody: {
        studentId: string,
        clubId: number,
        role: number
    }) => {
    const dataContactGroupMember = await apiUpdateRole(dataBody)
    return dataContactGroupMember
})


const contactGroupMembers = createSlice({
    name: "contactGroupMembers",
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
        const actionList = [loadContactGroupMember]
        actionList.forEach(action => {
            builder.addCase(action.pending, (state) => {
                state.loading = true;
            })
        })
        // load contactGroupMembers 
        builder.addCase(loadContactGroupMember.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.contactGroupMembers = [...action.payload.datas];
                state.total = action.payload.total || 0
            }
        });
        builder.addCase(loadContactGroupMember.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'Không tải được danh sách thành viên'
            }
        })

        // approve 
        builder.addCase(approveMemberContactGroup.pending, (state) => { state.loadingApprove = true })
        builder.addCase(approveMemberContactGroup.fulfilled, (state, action) => {
            state.loadingApprove = false
            state.notifications = {
                isError: false,
                message: action.payload?.status === STATUS_ACCEPTED ? 'Duyệt thành viên thành công' : 'Xóa thành viên thành công'
            }
        })
        builder.addCase(approveMemberContactGroup.rejected, (state) => {
            state.notifications = {
                isError: true,
                message: 'Không chấp nhận được thành viên'
            }
        })

        // joinContactGroup
        builder.addCase(joinContactGroup.pending, (state) => { state.loadingJoinContactGroup = true })
        builder.addCase(joinContactGroup.fulfilled, (state, action) => {
            state.loadingJoinContactGroup = false
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
        builder.addCase(joinContactGroup.rejected, (state) => {
            state.loadingJoinContactGroup = false
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

export const { resetMessageError } = contactGroupMembers.actions;

const contactGroupMembersReducer = contactGroupMembers.reducer;
export default contactGroupMembersReducer;