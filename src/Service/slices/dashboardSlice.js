import {createSlice} from '@reduxjs/toolkit';
import {
  compaintGraphCategoryDataThunkAPI,
  complainBoardGraphDataThunkAPI,
  expenseGraphDataThunkAPI,
  expensesGraphWithCategoryNameThunkAPI,
  getDashboardBoxDataThunkAPI,
  profitLossDetailsThunkAPI,
  saleExpensesGraphThunkAPI,
  saleGraphDataThunkAPI,
} from '../api/thunks';

const INITIAL_STATE = {
  getDashboardBoxDataResponse: {
    response: [],
    loading: false,
  },
  profitLossDetailsResponse: {
    response: [],
    loading: false,
  },
  saleExpensesGraphResponse: {
    response: [],
    loading: false,
  },
  saleGraphDataResponse: {
    response: [],
    loading: false,
  },
  expenseGraphDataResponse: {
    response: [],
    loading: false,
  },
  expensesGraphWithCategoryNameResponse: {
    response: [],
    loading: false,
  },
  complainBoardGraphDataResponse: {
    response: [],
    loading: false,
  },
  compaintGraphCategoryDataResponse: {
    response: [],
    loading: false,
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getDashboardBoxDataThunkAPI.pending, state => {
        state.getDashboardBoxDataResponse.loading = true;
      })
      .addCase(getDashboardBoxDataThunkAPI.fulfilled, (state, action) => {
        
        state.getDashboardBoxDataResponse.loading = false;
        state.getDashboardBoxDataResponse.response = action?.payload?.data;
      })
      .addCase(getDashboardBoxDataThunkAPI.rejected, (state, action) => {
        // 
        state.getDashboardBoxDataResponse.loading = false;
        state.getDashboardBoxDataResponse.error = action?.error?.message;
        state = {
          ...state,
          getDashboardBoxDataResponse:
            INITIAL_STATE.getDashboardBoxDataResponse,
        };
      })
      .addCase(profitLossDetailsThunkAPI.pending, state => {
        state.profitLossDetailsResponse.loading = true;
      })
      .addCase(profitLossDetailsThunkAPI.fulfilled, (state, action) => {
        
        state.profitLossDetailsResponse.loading = false;
        state.profitLossDetailsResponse.response = action?.payload?.data;
      })
      .addCase(profitLossDetailsThunkAPI.rejected, (state, action) => {
        // 
        state.profitLossDetailsResponse.loading = false;
        state.profitLossDetailsResponse.error = action?.error?.message;
        state = {
          ...state,
          profitLossDetailsResponse: INITIAL_STATE.profitLossDetailsResponse,
        };
      })
      .addCase(saleExpensesGraphThunkAPI.pending, state => {
        state.saleExpensesGraphResponse.loading = true;
      })
      .addCase(saleExpensesGraphThunkAPI.fulfilled, (state, action) => {
        
        state.saleExpensesGraphResponse.loading = false;
        state.saleExpensesGraphResponse.response = action?.payload?.data;
      })
      .addCase(saleExpensesGraphThunkAPI.rejected, (state, action) => {
        // 
        state.saleExpensesGraphResponse.loading = false;
        state.saleExpensesGraphResponse.error = action?.error?.message;
        state = {
          ...state,
          saleExpensesGraphResponse: INITIAL_STATE.saleExpensesGraphResponse,
        };
      })
      .addCase(saleGraphDataThunkAPI.pending, state => {
        state.saleGraphDataResponse.loading = true;
      })
      .addCase(saleGraphDataThunkAPI.fulfilled, (state, action) => {
        
        state.saleGraphDataResponse.loading = false;
        state.saleGraphDataResponse.response = action?.payload?.data;
      })
      .addCase(saleGraphDataThunkAPI.rejected, (state, action) => {
        // 
        state.saleGraphDataResponse.loading = false;
        state.saleGraphDataResponse.error = action?.error?.message;
        state = {
          ...state,
          saleGraphDataResponse: INITIAL_STATE.saleGraphDataResponse,
        };
      })
      .addCase(expenseGraphDataThunkAPI.pending, state => {
        state.expenseGraphDataResponse.loading = true;
      })
      .addCase(expenseGraphDataThunkAPI.fulfilled, (state, action) => {
        
        state.expenseGraphDataResponse.loading = false;
        state.expenseGraphDataResponse.response = action?.payload?.data;
      })
      .addCase(expenseGraphDataThunkAPI.rejected, (state, action) => {
        // 
        state.expenseGraphDataResponse.loading = false;
        state.expenseGraphDataResponse.error = action?.error?.message;
        state = {
          ...state,
          expenseGraphDataResponse: INITIAL_STATE.expenseGraphDataResponse,
        };
      })
      .addCase(expensesGraphWithCategoryNameThunkAPI.pending, state => {
        state.expensesGraphWithCategoryNameResponse.loading = true;
      })
      .addCase(
        expensesGraphWithCategoryNameThunkAPI.fulfilled,
        (state, action) => {
          
          state.expensesGraphWithCategoryNameResponse.loading = false;
          state.expensesGraphWithCategoryNameResponse.response =
            action?.payload?.data;
        },
      )
      .addCase(
        expensesGraphWithCategoryNameThunkAPI.rejected,
        (state, action) => {
          // 
          state.expensesGraphWithCategoryNameResponse.loading = false;
          state.expensesGraphWithCategoryNameResponse.error =
            action?.error?.message;
          state = {
            ...state,
            expensesGraphWithCategoryNameResponse:
              INITIAL_STATE.expensesGraphWithCategoryNameResponse,
          };
        },
      )
      .addCase(complainBoardGraphDataThunkAPI.pending, state => {
        state.complainBoardGraphDataResponse.loading = true;
      })
      .addCase(complainBoardGraphDataThunkAPI.fulfilled, (state, action) => {
        
        state.complainBoardGraphDataResponse.loading = false;
        state.complainBoardGraphDataResponse.response = action?.payload?.data;
      })
      .addCase(complainBoardGraphDataThunkAPI.rejected, (state, action) => {
        // 
        state.complainBoardGraphDataResponse.loading = false;
        state.complainBoardGraphDataResponse.error = action?.error?.message;
        state = {
          ...state,
          complainBoardGraphDataResponse:
            INITIAL_STATE.complainBoardGraphDataResponse,
        };
      })
      .addCase(compaintGraphCategoryDataThunkAPI.pending, state => {
        state.compaintGraphCategoryDataResponse.loading = true;
      })
      .addCase(compaintGraphCategoryDataThunkAPI.fulfilled, (state, action) => {
        
        state.compaintGraphCategoryDataResponse.loading = false;
        state.compaintGraphCategoryDataResponse.response =
          action?.payload?.data;
      })
      .addCase(compaintGraphCategoryDataThunkAPI.rejected, (state, action) => {
        // 
        state.compaintGraphCategoryDataResponse.loading = false;
        state.compaintGraphCategoryDataResponse.error = action?.error?.message;
        state = {
          ...state,
          compaintGraphCategoryDataResponse:
            INITIAL_STATE.compaintGraphCategoryDataResponse,
        };
      });
  },
});
export default dashboardSlice.reducer;
