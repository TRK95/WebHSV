import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type OrderSliceState = {
  // apiPort: string;
  // token: string;
};

const initialState: OrderSliceState = {
  // apiPort: process.env.API_ENDPOINT ?? '',
  // token: process.env.TOKEN ?? '',
};

// export const joinOrder = createAsyncThunk(
//   "order/joinOrder",
//   async (dataBody: { orderId: number | undefined; status: number }) => {
//     const dataUserOrder = await joinOrderApi(dataBody);
//     return dataUserOrder;
//   }
// );

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // setCurrentOrder: (state, action: PayloadAction<Order>) => {
    //   state.currentOrder = action.payload;
    // },
  },
  extraReducers: (builder) => {
    // builder.addCase(joinOrder.fulfilled, (state, action) => {
    //   state.joinOrderSuccess = action.payload;
    // });
  },
});

// export const {
//   setCurrentOrder,
// } = orderSlice.actions;

const orderSliceReducer = orderSlice.reducer;
export default orderSliceReducer;
