import { TOrderResponse, getFeedsApi, getOrderByNumberApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from 'src/services/store';

export type TFeedsSlice = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loadingData: boolean;
  error: string | null | undefined;
  orderByNumber: TOrderResponse | null;
  success: boolean;
};

export const initialState: TFeedsSlice = {
  orders: [],
  total: 0,
  totalToday: 0,
  loadingData: true,
  error: null,
  orderByNumber: null,
  success: false
};

export const getAllFeeds = createAsyncThunk('feeds/getAll', getFeedsApi);

export const getOrderByNumber = createAsyncThunk(
  'feeds/getOrderById',
  async (number: number) => getOrderByNumberApi(number)
);

const feedsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllFeeds.pending, (state) => {
        state.loadingData = true;
        state.error = null;
      })
      .addCase(getAllFeeds.rejected, (state, action) => {
        state.loadingData = false;
        state.error = action.error.message;
      })
      .addCase(getAllFeeds.fulfilled, (state, action) => {
        state.loadingData = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loadingData = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loadingData = false;
        state.error = action.error.message;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loadingData = false;
        state.error = null;
        state.orderByNumber = action.payload;
      });
  }
});

const feedsSliceSelectors = (state: RootState) => state.feeds;

export const getOrdersData = createSelector(
  [feedsSliceSelectors],
  (state) => state.orders
);

export const getIsLoading = createSelector(
  [feedsSliceSelectors],
  (state) => state.loadingData
);

export const getTotalOrders = createSelector(
  [feedsSliceSelectors],
  (state) => state.total
);
export const getTodayOrders = createSelector(
  [feedsSliceSelectors],
  (state) => state.totalToday
);

export const getOrderByNumberSelector = createSelector(
  [feedsSliceSelectors],
  (state) => state.orderByNumber?.orders[0]
);

export const isSearchSuccessSelector = createSelector(
  [feedsSliceSelectors],
  (state) => state.orderByNumber?.success
);

export const feedsSliceReducer = feedsSlice.reducer;
