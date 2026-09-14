import { apiCreateClubFeatureChild, apiDeleteClubFeatureChild, apiGetClubFeatureChild, apiUpdateClubFeatureChild } from "@/api/clubFeatureApi";
import ClubFeatureChild from "@/models/ClubFeatureChild";
import { RESPONSE_SUCCESS, STATUS_DELETED, STATUS_PRIVATE, TYPE_CLUB } from "@/utils/contrants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type ClubFeatureChildState = {
    clubFeatureChilds: ClubFeatureChild[],
    loading: boolean,
    addNewClubFeature?: ClubFeatureChild,
    notifications: {
        isError: boolean,
        message: string
    }
};

const initialState: ClubFeatureChildState = {
    clubFeatureChilds: [],
    loading: false,
    addNewClubFeature: undefined,
    notifications: {
        isError: false,
        message: ''
    }
};

export const loadClubFeatureChild = createAsyncThunk(
    "clubFeatureChild/loadclubFeatureChild",
    async (dataBody: {
        parentId: string,
        status: number
    }) => {
        const dataClubFeatureChild = await apiGetClubFeatureChild(dataBody)
        if (dataClubFeatureChild.status === RESPONSE_SUCCESS) {
            const datas = dataClubFeatureChild.data.map(data => new ClubFeatureChild(data))
            return datas;
        }
    }
);

export const createClubFeatureChild = createAsyncThunk(
    "clubFeatureChild/createClubFeatureChild",
    async (dataBody: ClubFeatureChild) => {
        const dataClubFeatureChild = await apiCreateClubFeatureChild(dataBody)
        if (dataClubFeatureChild.status === RESPONSE_SUCCESS) {
            const datas = new ClubFeatureChild(dataClubFeatureChild.data)
            return datas;
        }
    }
);

export const updateClubFeatureChild = createAsyncThunk(
    "clubFeatureChild/updateClubFeatureChild",
    async (dataBody: ClubFeatureChild) => {
        const dataClubFeatureChild = await apiUpdateClubFeatureChild(dataBody)
        if (dataClubFeatureChild.status === RESPONSE_SUCCESS) {
            const datas = new ClubFeatureChild(dataClubFeatureChild.data)
            return datas;
        }
    }
);

export const deleteClubFeatureChild = createAsyncThunk(
    "clubFeatureChild/deleteClubFeatureChild",
    async (dataBody: { featureId: string }) => {
        const dataClubFeatureChild = await apiDeleteClubFeatureChild(dataBody)
        if (dataClubFeatureChild.status === RESPONSE_SUCCESS) {
            const datas = new ClubFeatureChild(dataClubFeatureChild.data)
            return datas;
        }
    }
);

const clubFeatureChild = createSlice({
    name: "clubFeatureChilds",
    initialState,
    reducers: {
        resetNotification: (state) => {
            state.notifications = {
                isError: false,
                message: ''
            }
        }
    },
    extraReducers: (builder) => {
        const actionList = [loadClubFeatureChild, createClubFeatureChild, updateClubFeatureChild, deleteClubFeatureChild]
        actionList.forEach(action => {
            builder.addCase(action.pending, (state) => {
                state.loading = true;
            })
        })
        // loadClubFeatureChild
        builder.addCase(loadClubFeatureChild.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) state.clubFeatureChilds = [...action.payload];
        })
        builder.addCase(loadClubFeatureChild.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'không tải được danh sách danh mục'
            }
        })
        // createClubFeatureChild
        builder.addCase(createClubFeatureChild.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) {
                state.addNewClubFeature = action.payload
                state.clubFeatureChilds.push(action.payload)
                state.notifications = {
                    isError: false,
                    message: 'tạo danh mục thành công'
                }
            }
        })
        builder.addCase(createClubFeatureChild.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'lỗi ! không tạo được danh sách danh mục'
            }
        })
        // updateClubFeatureChild
        builder.addCase(updateClubFeatureChild.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) {
                state.addNewClubFeature = action.payload
                const index = state.clubFeatureChilds.findIndex(item => item?._id === state.addNewClubFeature?._id);
                if (index !== -1) {
                    state.clubFeatureChilds[index] = state.addNewClubFeature;
                }

                state.notifications = {
                    isError: false,
                    message: 'cập nhật danh mục thành công'
                }
            }
        })
        builder.addCase(updateClubFeatureChild.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'lỗi ! không cập nhật được danh sách danh mục'
            }
        })
        // deleteClubFeatureChild
        builder.addCase(deleteClubFeatureChild.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) {
                state.addNewClubFeature = action.payload
                const index = state.clubFeatureChilds.findIndex(item => item?._id === state.addNewClubFeature?._id);
                if (index !== -1) {
                    state.clubFeatureChilds.splice(index, 1);
                }
                state.notifications = {
                    isError: false,
                    message: 'Xóa danh mục thành công'
                }
            }
        })
        builder.addCase(deleteClubFeatureChild.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'lỗi ! không xóa được danh sách danh mục'
            }
        })
    }
});

export const { resetNotification } = clubFeatureChild.actions;

const clubFeatureChildsReducer = clubFeatureChild.reducer;
export default clubFeatureChildsReducer;
