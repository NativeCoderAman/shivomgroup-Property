import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData } from '../../api/apis';

// Async thunk to fetch attendance details
export const fetchSalary = createAsyncThunk(
  'salary/fetchSalary',
  async ({userId,token}, { rejectWithValue }) => {
    try {
      const response = await fetchData(`kitchmaster/salary/${userId}`,token);
      return response;
    } catch (error) {
      return rejectWithValue(error || 'Failed to fetch salary');
    }
  }
);



const salarySlice = createSlice({
  name: 'salary',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalary.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchSalary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default salarySlice.reducer;