import { apiCreateCategorys, apiGetCategorys, apiUpdateCategorys, reqBodyCreateClubCategory } from "@/api/clubCategoryApi";
import { apiCreateClubFeatureDetail, apiGetClubFeatureDetailByClubId, apiGetClubFeatureDetailByFeatureId } from "@/api/clubFeatureApi";
import ClubCategory from "@/models/ClubCategory";
import ClubFeatureDetail from "@/models/ClubFeatureDetail";
import { RESPONSE_SUCCESS, STATUS_DELETED, STATUS_PRIVATE, TYPE_CLUB } from "@/utils/contrants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

export type ClubFeatureDetailState = {
    clubFeatureDetails: ClubFeatureDetail[],
    loading: boolean,
    featureListTotal: number,
    addNewClubFeature?: ClubFeatureDetail,
    notifications: {
        isError: boolean,
        message: string
    }
};

const initialState: ClubFeatureDetailState = {
    clubFeatureDetails: [],
    loading: false,
    featureListTotal: 0,
    addNewClubFeature: undefined,
    notifications: {
        isError: false,
        message: ''
    }
};

export const loadClubFeatureDetailByClubId = createAsyncThunk(
    "clubFeatureDetail/loadClubFeatureDetailByClubId",
    async (dataBody: {
        limit: number, offset: number, clubId: string, status: number
    }) => {
        const dataClubFeatureDetail = await apiGetClubFeatureDetailByClubId(dataBody)
        if (dataClubFeatureDetail.status === RESPONSE_SUCCESS) {
            const datas = dataClubFeatureDetail.data.map(data => new ClubFeatureDetail(data))
            return datas;
        }
    }
);

export const loadClubFeatureDetailByFeatureId = createAsyncThunk(
    "clubFeatureDetail/loadClubFeatureDetailByFeatureId",
    async (dataBody: {
        limit: number, offset: number, featureId: string, status: number
    }) => {
        const dataClubFeatureDetail = await apiGetClubFeatureDetailByFeatureId(dataBody)
        if (dataClubFeatureDetail.status === RESPONSE_SUCCESS) {
            const datas = dataClubFeatureDetail.data.map(data => new ClubFeatureDetail(data))
            return datas;
        }
    }
);

export const createClubFeatureDetail = createAsyncThunk(
    "clubFeatureDetail/createClubFeatureDetail",
    async (dataBody: ClubFeatureDetail) => {
        const dataClubFeatureDetail = await apiCreateClubFeatureDetail(dataBody)
        if (dataClubFeatureDetail.status === RESPONSE_SUCCESS) {
            const datas = new ClubFeatureDetail(dataClubFeatureDetail.data)
            return datas;
        }
    }
);

export const updateClubFeatureDetail = createAsyncThunk(
    "clubFeatureDetail/updateClubFeatureDetail",
    async (dataBody: ClubFeatureDetail) => {
        const dataClubFeatureDetail = await apiCreateClubFeatureDetail(dataBody)
        if (dataClubFeatureDetail.status === RESPONSE_SUCCESS) {
            const datas = new ClubFeatureDetail(dataClubFeatureDetail.data)
            return datas;
        }
    }
);

const clubFeatureDetail = createSlice({
    name: "clubFeatureDetails",
    initialState,
    reducers: {
        resetNotification: (state) => {
            state.notifications = {
                isError: false,
                message: ''
            }
        },
        setIsLoading: (state, action) => {
            state.loading = action.payload
        }
    },
    extraReducers: (builder) => {
        const actionList = [loadClubFeatureDetailByClubId, loadClubFeatureDetailByFeatureId, createClubFeatureDetail, updateClubFeatureDetail]
        actionList.forEach(action => {
            builder.addCase(action.pending, (state) => {
                state.loading = true;
            })
        })
        // loadClubFeatureDetailByClubId
        builder.addCase(loadClubFeatureDetailByClubId.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) state.clubFeatureDetails = [...action.payload];
        })
        builder.addCase(loadClubFeatureDetailByClubId.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'không tải được danh sách danh mục'
            }
        })
        // loadClubFeatureDetailByFeatureId
        builder.addCase(loadClubFeatureDetailByFeatureId.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) state.clubFeatureDetails = [...action.payload];
        })
        builder.addCase(loadClubFeatureDetailByFeatureId.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'không tải được danh sách danh mục'
            }
        })
        // createClubFeatureDetail
        builder.addCase(createClubFeatureDetail.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) {
                state.addNewClubFeature = action.payload
                state.notifications = {
                    isError: false,
                    message: 'tạo danh mục thành công'
                }
                message.success(`Cập nhật ${action.payload?.title} thành công`);
            }
        })
        builder.addCase(createClubFeatureDetail.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'lỗi ! không tạo được danh sách danh mục'
            }
        })
        // updateClubFeatureDetail
        builder.addCase(updateClubFeatureDetail.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) {
                state.addNewClubFeature = action.payload
                state.notifications = {
                    isError: false,
                    message: 'cập nhật danh mục thành công'
                }
            }
        })
        builder.addCase(updateClubFeatureDetail.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'lỗi ! không cập nhật được danh sách danh mục'
            }
        })

    }
});

export const { resetNotification, setIsLoading } = clubFeatureDetail.actions;

const clubFeatureDetailsReducer = clubFeatureDetail.reducer;
export default clubFeatureDetailsReducer;
