import { apiGetNewsCategory } from "@/api/newsApi";
import { NewsCategoryModel } from "@/components/NewsPageView/CategoryNews";
import NewsCategory from "@/models/NewsCategory";
import { DOMAIN_ID_ALUMNI } from "@/utils/contrants";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type newsCategoryState = {
    newsCategory: Array<NewsCategory & {
        key?: React.Key,
        category?: string,
        children?: Array<NewsCategoryModel>
    }>,
    loading: boolean,
    isError: boolean
};

const initialState: newsCategoryState = {
    newsCategory: [],
    loading: false,
    isError: false
};

export const fetchNewsCategory = createAsyncThunk("newsCategory/fetchNewsCategory", async (args: { parentId: string, status: number, type?: number }) => {
    const res = await apiGetNewsCategory(args);
    return res.data;
});

const newsCategory = createSlice({
    name: "newsCategory",
    initialState,
    reducers: {
        resetIsErrorNewsCategory: (state) => {
            state.isError = false
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchNewsCategory.pending, state => { state.loading = true })
        builder.addCase(fetchNewsCategory.fulfilled, (state, action: PayloadAction<Array<NewsCategory>>) => {
            if(!action.payload) {
                state.newsCategory = []
            } else {
                state.newsCategory = action.payload?.map((item, index) => {
                    return {
                        ...item,
                        key: index + 1
                    }
                })
                state.loading = false
            }
        })
        builder.addCase(fetchNewsCategory.rejected, state => {
            state.loading = false;
            state.isError = true
        })
    }
});

export const { resetIsErrorNewsCategory } = newsCategory.actions;
const newsCategoryReducer = newsCategory.reducer;
export default newsCategoryReducer;
