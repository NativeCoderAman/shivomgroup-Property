import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData } from '../../api/apis';

// Async thunk to fetch attendance details
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async ({userId,token}, { rejectWithValue }) => {
    try {
      const response = await fetchData(`kitchenMaster/attendance/${userId}`,token);
      return response;
    } catch (error) {
      return rejectWithValue(error || 'Failed to fetch attendance');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
