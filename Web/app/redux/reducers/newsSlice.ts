
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { News } from "../../../components/news/detail-news-page-view";
import { apiGetNewsByDate, apiGetNewsInCategory } from "../../../utils/api/newsApi";
import NewsModel from "../../../models/newsModel";

export type newsState = {
    newsListData: Array<News>,
    newsListTotal: number,
    loading: boolean
    isError: boolean,
};

const initialState: newsState = {
    newsListData: [],
    newsListTotal: 0,
    loading: false,
    isError: false
};

export const fetchNewsList = createAsyncThunk("newsList/fetchNewsList", async (req: {
    pageSize: number,
    offset: number,
    status: number
}) => {
    const res = await apiGetNewsByDate({
        reqQuery: {
            limit: req.pageSize,
            offset: req.offset,
            status: req.status
        }
    });
    return {
        data: res.data ?? [],
        total: res.total
    };
});

export const fetchNewsListByCategory = createAsyncThunk("newsList/fetchNewsListByCategory", async (req: {
    limit: number,
    offset: number,
    categoryId: number,
    status?: number
}) => {
    const res = await apiGetNewsInCategory({
        reqQuery: {
            limit: req.limit,
            offset: req.offset,
            status: req.status || 0,
            categoryId: req.categoryId
        }
    });
    return {
        data: res.data?.map(o => o.news || {}) ?? []
    };
})

const newsSlice = createSlice({
    name: "newsList",
    initialState,
    reducers: {
        resetIsErrorNews: (state) => {
            state.isError = false
        },
        setIsLoading: (state, action) => {
            state.loading = action.payload
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchNewsList.pending, (state) => { state.loading = true })
        builder.addCase(fetchNewsList.fulfilled, (state, action: PayloadAction<{ data: Array<News>, total: number }>) => {
            state.newsListData = action.payload?.data.map((item, index) => {
                return {
                    ...item,
                    key: index + 1
                }
            })
            state.newsListTotal = action.payload.total
            state.loading = false
        })
        builder.addCase(fetchNewsList.rejected, (state) => {
            state.loading = false;
            state.isError = true
        })
        builder.addCase(fetchNewsListByCategory.pending, (state) => { state.loading = true })
        builder.addCase(fetchNewsListByCategory.fulfilled, (state, action: PayloadAction<{ data: Array<any> }>) => {
            state.newsListData = action.payload?.data?.map((item, index) => {
                return {
                    ...item,
                    key: index + 1
                }
            })
            state.loading = false
        })
        builder.addCase(fetchNewsListByCategory.rejected, (state) => {
            state.loading = false;
            state.isError = true
        })
    }
});

export const { resetIsErrorNews, setIsLoading } = newsSlice.actions;
const newsReducer = newsSlice.reducer;
export default newsReducer;
