import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchData } from '../api/apis';

// Async thunks
export const getProfitListThunkApi = createAsyncThunk(
  'profitloss/getProfitListThunkApi',
  async ({ token, year, filter, quater } = {}, { rejectWithValue }) => {
    try {
      const noFilters = !year && !filter && !quater;
      let url = 'profit-loss-report';
      if (!noFilters) {
        const params = new URLSearchParams();
        params.append('filter[year]', year || 'all');
        params.append('filter[month]', filter || 'all');
        if (quater) {
          params.append('filter[quarter]', quater);
        }
        url += `?${params.toString()}`;
      }
      const response = await fetchData(url, token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


export const ProfitLossFilterList = createAsyncThunk(
  'profitloss/ProfitLossFilterList',
  async ({ token }) => {
    return await fetchData('profit-loss-report', token);
  }
)
export const downloadProfitListThunkApi = createAsyncThunk(
  'profitloss/downloadProfitListThunkApi',
  async ({ token, year, filter, quater } = {}, { rejectWithValue }) => {
    try {
      const noFilters = !year && !filter && !quater;
      let url = 'download-profit-loss-report';
      if (!noFilters) {
        const params = new URLSearchParams();
        params.append('filter[year]', year || 'all');
        params.append('filter[month]', filter || 'all');
        if (quater) {
          params.append('filter[quarter]', quater);
        }
        url += `?${params.toString()}`;
      }
      const response = await fetchData(url, token);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);


// Initial state
const initialState = {
  profitListData: {
    response: [],
    loading: false,
    error: null,
  },
  downloadProfitData: {
    response: [],
    loading: false,
    error: null,
  },
};

// Slice
export const profitlossSlice = createSlice({
  name: 'profitloss',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Get Profit List
      .addCase(getProfitListThunkApi.pending, state => {
        state.profitListData.loading = true;
        state.profitListData.error = null;
      })
      .addCase(getProfitListThunkApi.fulfilled, (state, action) => {
        state.profitListData.loading = false;
        state.profitListData.response = action.payload;
        state.profitListData.error = null;
      })
      .addCase(getProfitListThunkApi.rejected, (state, action) => {
        state.profitListData.loading = false;
        state.profitListData.error =
          action.payload || 'Failed to fetch profit list';
      })
      // Download Profit List
      .addCase(downloadProfitListThunkApi.pending, state => {
        state.downloadProfitData.loading = true;
        state.downloadProfitData.error = null;
      })
      .addCase(downloadProfitListThunkApi.fulfilled, (state, action) => {
        state.downloadProfitData.loading = false;
        state.downloadProfitData.response = action.payload;
        state.downloadProfitData.error = null;
      })
      .addCase(downloadProfitListThunkApi.rejected, (state, action) => {
        state.downloadProfitData.loading = false;
        state.downloadProfitData.error =
          action.payload || 'Failed to download profit list';
      });
  },
});

export default profitlossSlice.reducer;
