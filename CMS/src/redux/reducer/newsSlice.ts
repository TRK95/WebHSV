import { getNewsByDate, apiGetNewsInCategory } from "@/api/newsApi";
import { News } from "@/components/NewsPageView";
import NewsInCategory from "@/models/NewsInCategory";
import NewsModel from "@/models/NewsModel";
import { DOMAIN_ID_ALUMNI, PAGE_SIZE } from "@/utils/contrants";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    status: number,
    contentType?: number
}) => {
    const res = await getNewsByDate({
        reqQuery: {
            limit: req.pageSize,
            offset: req.offset,
            status: req.status,
            contentType: req.contentType
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
    // categoryId: number,
    categoryId: string,
    status?: number
}) => {
    const res = await apiGetNewsInCategory({
        limit: req.limit,
        offset: req.offset,
        status: req.status || 0, 
        categoryId: req.categoryId
    });
    return {
        data: res.data?.map(o => o.news || {}) ?? [],
        total: res.total
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
        builder.addCase(fetchNewsListByCategory.fulfilled, (state, action: PayloadAction<{ data: Array<News>, total: number}>) => {
            state.newsListData = action.payload?.data?.map((item, index) => {
                return {
                    ...item,
                    key: index + 1
                }
            })
            state.newsListTotal = action.payload.total
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
