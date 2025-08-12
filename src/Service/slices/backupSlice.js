import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postData } from '../api/apis';

// Async thunk to handle API call
export const getBackupAsyncThunkApi = createAsyncThunk(
  'backupSlice/getBackupAsyncThunkApi',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      const response = await postData('database-backup', token, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Initial state
const initialState = {
  backupResponse:{
    loading: false,
    response: [],
    error: null,
  }
};

// Slice
const backupSlice = createSlice({
  name: 'backupSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getBackupAsyncThunkApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBackupAsyncThunkApi.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload.data;
        state.error = null;
      })
      .addCase(getBackupAsyncThunkApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export default backupSlice.reducer;
