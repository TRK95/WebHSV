
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RESPONSE_SUCCESS } from "../../../utils/constraint";
import ClubCategory from "../../../models/clubsCategoryModel";
import { apiGetClubCategories } from "../../../utils/api/clubsApi";

export type CategoryContactGroupState = {
    categoryContactGroup: ClubCategory[],
    loading: boolean,
    notifications: {
        isError: boolean,
        message: string
    }
};

const initialState: CategoryContactGroupState = {
    categoryContactGroup: [],
    loading: false,
    notifications: {
        isError: false,
        message: ''
    }
};

export const loadContactGroupCategories = createAsyncThunk(
    "contactGroupCategory/loadContactGroupCategorys",
    async (dataBody: {
        type: number,
        parentId: number,
        status: number
    }) => {
        const dataClubCategorys = await apiGetClubCategories({ reqQuery: dataBody })
        if (dataClubCategorys.status === RESPONSE_SUCCESS) {
            const datas = dataClubCategorys.data.map(data => new ClubCategory(data))
            return datas;
        }
    }
);

const categoryContactGroup = createSlice({
    name: "categoryContactGroup",
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
        const actionList = [loadContactGroupCategories]
        actionList.forEach(action => {
            builder.addCase(action.pending, (state) => {
                state.loading = true;
            })
        })
        // loadClubCategorys
        builder.addCase(loadContactGroupCategories.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) state.categoryContactGroup = [...action.payload];
        })
        builder.addCase(loadContactGroupCategories.rejected, (state) => {
            state.loading = false;
            state.notifications = {
                isError: true,
                message: 'Không tải được danh sách danh mục'
            }
        })
        // createClubCategorys
    }
});

export const { resetNotification } = categoryContactGroup.actions;

const categoryContactGroupReducer = categoryContactGroup.reducer;
export default categoryContactGroupReducer;
