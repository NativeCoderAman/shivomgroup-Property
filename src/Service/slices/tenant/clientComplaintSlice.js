import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  createComplaintThunkAPI,
  createNoticeRequestThunkAPI,
  deleteTenanatNoticeThunkAPI,
  getComplaintOfStudentThunkAPI,
  getMenusThunkAPI,
  getNoticesOfStudentThunkAPI,
  getStudentElectricityBillThunkAPI,
  studentSalesAccountDetailsThunkAPI,
} from '../../api/thunks';

const INITIAL_STATE = {
  createComplaintResponse: {
    response: [],
    loading: false,
  },
  getComplaintOfStudentResponse: {
    response: [],
    loading: false,
  },
  getMenusResponse: {
    response: [],
    loading: false,
  },
  studentSalesAccountDetailsResponse: {
    response: [],
    loading: false,
  },
  studentSalesAccountDetailsResponse: {
    response: [],
    loading: false,
  },
  getNoticesOfStudentResponse: {
    response: [],
    loading: false,
  },
  createNoticeRequestResponse: {
    response: [],
    loading: false,
  },
  deleteTenanatNoticeResponse: {
    response: [],
    loading: false,
  },
  getStudentElectricityBillResponse: {
    response: [],
    loading: false,
  },
};

const clientComplaintSlice = createSlice({
  name: 'clientComplaint',
  initialState: INITIAL_STATE,

  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createComplaintThunkAPI.pending, state => {
        state.createComplaintResponse.loading = true;
      })
      .addCase(createComplaintThunkAPI.fulfilled, (state, action) => {
        state.createComplaintResponse.loading = false;
        state.createComplaintResponse.response = action?.payload;
      })
      .addCase(createComplaintThunkAPI.rejected, (state, action) => {
        state.createComplaintResponse.loading = false;
        state.createComplaintResponse.response = action?.payload;

        // state.createComplaintResponse.error = action?.payload?.error
        //   ? action.payload.error
        //   : 'Something went wrong';
        // state = {
        //   ...state,
        //   createComplaintResponse: INITIAL_STATE.createComplaintResponse,
        // };
      })
      .addCase(getComplaintOfStudentThunkAPI.pending, state => {
        state.getComplaintOfStudentResponse.loading = true;
      })
      .addCase(getComplaintOfStudentThunkAPI.fulfilled, (state, action) => {
        
        state.getComplaintOfStudentResponse.loading = false;
        state.getComplaintOfStudentResponse.response = action?.payload;
      })
      .addCase(getComplaintOfStudentThunkAPI.rejected, (state, action) => {
        // 
        state.getComplaintOfStudentResponse.loading = false;
        state.getComplaintOfStudentResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          getComplaintOfStudentResponse:
            INITIAL_STATE.getComplaintOfStudentResponse,
        };
      })
      .addCase(getMenusThunkAPI.pending, state => {
        state.getMenusResponse.loading = true;
      })
      .addCase(getMenusThunkAPI.fulfilled, (state, action) => {
        
        state.getMenusResponse.loading = false;
        state.getMenusResponse.response = action?.payload?.data;
      })
      .addCase(getMenusThunkAPI.rejected, (state, action) => {
        
        state.getMenusResponse.loading = false;
        state.getMenusResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          getMenusResponse: INITIAL_STATE.getMenusResponse,
        };
      })
      .addCase(studentSalesAccountDetailsThunkAPI.pending, state => {
        state.studentSalesAccountDetailsResponse.loading = true;
      })
      .addCase(
        studentSalesAccountDetailsThunkAPI.fulfilled,
        (state, action) => {
          state.studentSalesAccountDetailsResponse.loading = false;
          state.studentSalesAccountDetailsResponse.response =
            action?.payload?.data;
        },
      )
      .addCase(studentSalesAccountDetailsThunkAPI.rejected, (state, action) => {
        
        state.studentSalesAccountDetailsResponse.loading = false;
        state.studentSalesAccountDetailsResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          studentSalesAccountDetailsResponse:
            INITIAL_STATE.studentSalesAccountDetailsResponse,
        };
      })
      .addCase(getNoticesOfStudentThunkAPI.pending, state => {
        state.getNoticesOfStudentResponse.loading = true;
      })
      .addCase(getNoticesOfStudentThunkAPI.fulfilled, (state, action) => {
        
        state.getNoticesOfStudentResponse.loading = false;
        state.getNoticesOfStudentResponse.response = action?.payload?.data;
      })
      .addCase(getNoticesOfStudentThunkAPI.rejected, (state, action) => {
        
        state.getNoticesOfStudentResponse.loading = false;
        state.getNoticesOfStudentResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          getNoticesOfStudentResponse:
            INITIAL_STATE.getNoticesOfStudentResponse,
        };
      })
      .addCase(createNoticeRequestThunkAPI.pending, state => {
        state.createNoticeRequestResponse.loading = true;
      })
      .addCase(createNoticeRequestThunkAPI.fulfilled, (state, action) => {
        state.createNoticeRequestResponse.loading = false;
        state.createNoticeRequestResponse.response = action?.payload?.data;
      })
      .addCase(createNoticeRequestThunkAPI.rejected, (state, action) => {
        state.createNoticeRequestResponse.loading = false;
        // state.createNoticeRequestResponse.error = action?.payload;

        // state.createNoticeRequestResponse.error = action?.payload?.error
        //   ? action.payload.error
        //   : 'Something went wrong';
        // state = {
        //   ...state,
        //   createNoticeRequestResponse:
        //     INITIAL_STATE.createNoticeRequestResponse,
        // };
      })
      .addCase(deleteTenanatNoticeThunkAPI.pending, state => {
        state.deleteTenanatNoticeResponse.loading = true;
      })
      .addCase(deleteTenanatNoticeThunkAPI.fulfilled, (state, action) => {
        
        state.deleteTenanatNoticeResponse.loading = false;
        state.deleteTenanatNoticeResponse.response = action?.payload?.data;
      })
      .addCase(deleteTenanatNoticeThunkAPI.rejected, (state, action) => {
        
        state.deleteTenanatNoticeResponse.loading = false;
        state.deleteTenanatNoticeResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          deleteTenanatNoticeResponse:
            INITIAL_STATE.deleteTenanatNoticeResponse,
        };
      })
      .addCase(getStudentElectricityBillThunkAPI.pending, state => {
        state.getStudentElectricityBillResponse.loading = true;
      })
      .addCase(getStudentElectricityBillThunkAPI.fulfilled, (state, action) => {
        
        state.getStudentElectricityBillResponse.loading = false;
        state.getStudentElectricityBillResponse.response =
          action?.payload?.data;
      })
      .addCase(getStudentElectricityBillThunkAPI.rejected, (state, action) => {
        
        state.getStudentElectricityBillResponse.loading = false;
        state.getStudentElectricityBillResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          getStudentElectricityBillResponse:
            INITIAL_STATE.getStudentElectricityBillResponse,
        };
      });
  },
});
export default clientComplaintSlice.reducer;
