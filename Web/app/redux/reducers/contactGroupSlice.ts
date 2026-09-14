import { PAGE_SIZE, RESPONSE_SUCCESS, STATUS_DELETED, STATUS_PUBLIC } from "../../../utils/constraint";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from ".";
import Club from "../../../models/clubsModel";
import { apiCreateClubApi, apiGetClubsByCategory, apiUpdateClubApi, getClubsByTypeApi, reqBodyCreateClubs, reqQueryClubs } from "../../../utils/api/clubsApi";
import { apiSetPresidentClub } from "../../../utils/api/clubMembersApi";
import ClubMember from "../../../models/ClubMember";

export type ContactGroupState = {
    contactGroups: Club[],
    loading: boolean,
    total: number,
    category: number,
    status: number,
    notifications: {
        isError: boolean,
        message: string
    }
};

const initialState: ContactGroupState = {
    contactGroups: [],
    loading: false,
    total: 0,
    category: 0,
    status: STATUS_PUBLIC,
    notifications: {
        isError: false,
        message: ''
    }
};

export const loadContactGroupsByCategory = createAsyncThunk(
    "contactGroup/loadContactGroupsByCategory", async (dataBody: {
        categoryId: number,
        status: number
    }) => {
    const dataClubs = await apiGetClubsByCategory(dataBody)
    if (dataClubs.status === RESPONSE_SUCCESS) {
        const datas = dataClubs.data.map(data => new Club(data))
        return datas
    }
}
)

export const loadContactGroups = createAsyncThunk(
    "contactGroup/loadClub",
    async (dataBody: reqQueryClubs) => {
        const dataClubs = await getClubsByTypeApi({ reqQuery: dataBody })
        if (dataClubs.status === RESPONSE_SUCCESS) {
            const datas = dataClubs.data.map(data => new Club(data))
            return { datas, total: dataClubs.total };
        }
    }
);

export const createContactGroup = createAsyncThunk(
    "contactGroup/createClub",
    async (dataBody: reqBodyCreateClubs & {
        presidentId: string
    }, { dispatch, getState }) => {
        const store: any = getState()
        // const { presidentId, ...datas } = dataBody
        const { presidentId, ...datas } = dataBody
        const dataContactGroup = await apiCreateClubApi({ reqBody: dataBody })
        if (dataContactGroup.status === RESPONSE_SUCCESS) {
            const data = new Club(dataContactGroup.data);
            if (store.clubsReducer.category) {
                dispatch(loadContactGroupsByCategory({
                    categoryId: store.clubsReducer.category,
                    status: store.clubsReducer.status
                }))
            } else {
                dispatch(loadContactGroups({
                    limit: PAGE_SIZE,
                    offset: 0,
                    type: dataBody.type,
                    status: store.clubsReducer.status
                }))
            }
            if (presidentId) {
                dispatch(setPresidentContactGroup({
                    clubId: data.id || 0,
                    studentId: presidentId
                }))
            }
            return data
        }
    }
);

export const updateContactGroup = createAsyncThunk(
    "contactGroup/updateClub",
    async (dataBody: Club & {
        isLoadContactGroup?: boolean
    }, { dispatch, getState }) => {
        const store: any = getState();
        // const { presidentId, ...dataBodys } = dataBody
        const { isLoadContactGroup = true, ...value } = dataBody
        const dataClub = await apiUpdateClubApi({ reqBody: dataBody })
        if (dataClub.status === RESPONSE_SUCCESS) {
            const data = new Club(dataClub.data);
            if (store.clubsReducer.category) {
                dispatch(loadContactGroupsByCategory({
                    categoryId: store.clubsReducer.category,
                    status: store.clubsReducer.status
                }))
            } else {
                dispatch(loadContactGroups({
                    limit: PAGE_SIZE,
                    offset: 0,
                    type: dataBody.type,
                    status: store.clubsReducer.status
                }))
            }
            return data
        }

    }
);

export const deleteContactGroup = createAsyncThunk(
    "contactGroup/deleteClub",
    async (dataBody: Club, { dispatch, getState }) => {
        const store: any = getState();
        const dataClub = await apiUpdateClubApi({
            reqBody: {
                ...dataBody,
                status: STATUS_DELETED
            }
        })
        if (dataClub.status === RESPONSE_SUCCESS) {
            const data = new Club(dataClub.data);
            if (store.clubsReducer.category) {
                dispatch(loadContactGroupsByCategory({
                    categoryId: store.clubsReducer.category,
                    status: store.clubsReducer.status
                }))
            } else {
                dispatch(loadContactGroups({
                    limit: PAGE_SIZE,
                    offset: 0,
                    type: dataBody.type,
                    status: store.clubsReducer.status
                }))
            }
            return data
        }
    }
);

export const setPresidentContactGroup = createAsyncThunk(
    "contactGroupMembers/setPresidentClub", async (dataBody: {
        studentId: string,
        clubId: number
    }) => {
    const dataClubMember = await apiSetPresidentClub(dataBody)
    if (dataClubMember.status === RESPONSE_SUCCESS && dataClubMember.data) {
        return new ClubMember(dataClubMember.data)
    }
})

const contactGroup = createSlice({
    name: "contactGroup",
    initialState,
    reducers: {
        resetIsNotification: (state) => {
            state.notifications = {
                isError: false,
                message: ''
            }
        },
        setCategoryContactGroup: (state, action) => {
            state.category = action.payload
        },
        setStatus: (state, action) => {
            state.status = action.payload
        }
    },
    extraReducers: (builder) => {
        const actionList = [loadContactGroups, createContactGroup, updateContactGroup, deleteContactGroup, loadContactGroupsByCategory]
        actionList.forEach(action => {
            builder.addCase(action.pending, (state) => {
                state.loading = true;
            })
        })
        // load
        builder.addCase(loadContactGroups.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.contactGroups = [...action.payload.datas];
                state.total = action.payload.total || 0
            }
        });
        builder.addCase(loadContactGroups.rejected, (state) => {
            state.loading = false;
        })
        // loadContactGroupsByCategory
        builder.addCase(loadContactGroupsByCategory.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.contactGroups = [...action.payload];
            }
        });
        builder.addCase(loadContactGroupsByCategory.rejected, (state) => {
            state.loading = false;
        })

        // createClub
        builder.addCase(createContactGroup.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.notifications = {
                    isError: false,
                    message: 'Tạo thành công'
                }
            }
        });
        builder.addCase(createContactGroup.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'Lỗi! tạo không thành công'
            }
        })
        // updateClub
        builder.addCase(updateContactGroup.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.notifications = {
                    isError: false,
                    message: 'Cập nhật thành công'
                }
            }
        });
        builder.addCase(updateContactGroup.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'Lỗi! cập nhật không thành công'
            }
        })
        // deleteClub
        builder.addCase(deleteContactGroup.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload) {
                state.notifications = {
                    isError: false,
                    message: 'Xóa thành công'
                }
            }
        });
        builder.addCase(deleteContactGroup.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'Lỗi! xóa không thành công'
            }
        })
        // setPresidentClub
        builder.addCase(setPresidentContactGroup.pending, state => { state.loading = true })
        builder.addCase(setPresidentContactGroup.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) {
                state.notifications = {
                    isError: false,
                    message: 'Thêm chủ tịch thành công'
                }
            }
        })
        builder.addCase(setPresidentContactGroup.rejected, (state) => {
            state.loading = false
            state.notifications = {
                isError: false,
                message: 'Lỗi! thêm chủ tịch không thành công'
            }
        })
    },
});

export const { resetIsNotification, setCategoryContactGroup, setStatus } = contactGroup.actions;

const contactGroupReducer = contactGroup.reducer;
export default contactGroupReducer;
