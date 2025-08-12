import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {fetchData, postData, deleteData} from '../../api/apis';

// Async thunk to fetch attendance details
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async ({userId, token}, {rejectWithValue}) => {
    try {
      const response = await fetchData(
        `kitchenMaster/ExpenseRequested/${userId}`,
        token,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error || 'Failed to fetch salary');
    }
  },
);

export const fetchComplaints = createAsyncThunk(
  'food/fetchComplaints',
  async (token, {rejectWithValue}) => {
    try {
      const response = await fetchData(
        `foodComplaintsForKitchanMaster`,
        token,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error || 'Failed to fetch salary');
    }
  },
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expenseData, {rejectWithValue}) => {
    try {
      const response = await postData(API_URL, expenseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add expense');
    }
  },
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({id, expenseData}, {rejectWithValue}) => {
    try {
      const response = await postData(`${API_URL}/${id}`, expenseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to update expense',
      );
    }
  },
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id, {rejectWithValue}) => {
    try {
      await deleteData(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Failed to delete expense',
      );
    }
  },
);

const expenseNoteSlice = createSlice({
  name: 'expenses',
  initialState: {
    data: [],
    loading: false,
    error: null,
    complaintData: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchComplaints.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaintData = action?.payload?.data;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchExpenses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          expense => expense.id === action.payload.id,
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.data = state.data.filter(
          expense => expense.id !== action.payload,
        );
      });
  },
});

export default expenseNoteSlice.reducer;
