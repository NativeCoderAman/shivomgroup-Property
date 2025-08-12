import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  createTenantStudentRegFormDownloadThunkAPI,
  getStudentRoommatesThunkAPI,
  studentDetailsThunkAPI,
  tenantCreatePaymentInInvoiceThunkAPI,
  tenantGenrateSaleInvoiceThunkAPI,
  tenantStudentSalesDetailsThunkAPI,
  tenantTermsAndConditionspdfThunkAPI,
} from '../../api/thunks';

const INITIAL_STATE = {
  studentDetailsResponse: {
    response: [],
    loading: false,
  },
  createTenantStudentRegFormDownloadResponse: {
    response: [],
    loading: false,
  },
  tenantTermsAndConditionspdfResponse: {
    response: [],
    loading: false,
  },
  tenantStudentSalesDetailsResponse: {
    response: [],
    loading: false,
  },
  tenantGenrateSaleInvoiceResponse: {
    response: [],
    loading: false,
  },
  tenantCreatePaymentInInvoiceResponse: {
    response: [],
    loading: false,
  },
  getStudentRoommatesResponse: {
    response: [],
    loading: false,
  },
};

const clientProfileSlice = createSlice({
  name: 'clientProfile',
  initialState: INITIAL_STATE,

  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(studentDetailsThunkAPI.pending, state => {
        state.studentDetailsResponse.loading = true;
      })
      .addCase(studentDetailsThunkAPI.fulfilled, (state, action) => {
        state.studentDetailsResponse.loading = false;
        state.studentDetailsResponse.response = action?.payload;
      })
      .addCase(studentDetailsThunkAPI.rejected, (state, action) => {
        state.studentDetailsResponse.loading = false;
        state.studentDetailsResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          studentDetailsResponse: INITIAL_STATE.studentDetailsResponse,
        };
      })
      .addCase(createTenantStudentRegFormDownloadThunkAPI.pending, state => {
        state.createTenantStudentRegFormDownloadResponse.loading = true;
      })
      .addCase(
        createTenantStudentRegFormDownloadThunkAPI.fulfilled,
        (state, action) => {
          
          state.createTenantStudentRegFormDownloadResponse.loading = false;
          state.createTenantStudentRegFormDownloadResponse.response =
            action?.payload;
        },
      )
      .addCase(
        createTenantStudentRegFormDownloadThunkAPI.rejected,
        (state, action) => {
          
          state.createTenantStudentRegFormDownloadResponse.loading = false;
          state.createTenantStudentRegFormDownloadResponse.error = action
            ?.payload?.error
            ? action.payload.error
            : 'Something went wrong';
          state = {
            ...state,
            createTenantStudentRegFormDownloadResponse:
              INITIAL_STATE.createTenantStudentRegFormDownloadResponse,
          };
        },
      )
      .addCase(tenantTermsAndConditionspdfThunkAPI.pending, state => {
        state.tenantTermsAndConditionspdfResponse.loading = true;
      })
      .addCase(
        tenantTermsAndConditionspdfThunkAPI.fulfilled,
        (state, action) => {
          
          state.tenantTermsAndConditionspdfResponse.loading = false;
          state.tenantTermsAndConditionspdfResponse.response = action?.payload;
        },
      )
      .addCase(
        tenantTermsAndConditionspdfThunkAPI.rejected,
        (state, action) => {
          
          state.tenantTermsAndConditionspdfResponse.loading = false;
          state.tenantTermsAndConditionspdfResponse.error = action?.payload
            ?.error
            ? action.payload.error
            : 'Something went wrong';
          state = {
            ...state,
            tenantTermsAndConditionspdfResponse:
              INITIAL_STATE.tenantTermsAndConditionspdfResponse,
          };
        },
      )
      .addCase(tenantStudentSalesDetailsThunkAPI.pending, state => {
        state.tenantStudentSalesDetailsResponse.loading = true;
      })
      .addCase(tenantStudentSalesDetailsThunkAPI.fulfilled, (state, action) => {
        
        state.tenantStudentSalesDetailsResponse.loading = false;
        state.tenantStudentSalesDetailsResponse.response =
          action?.payload?.data;
      })
      .addCase(tenantStudentSalesDetailsThunkAPI.rejected, (state, action) => {
        
        state.tenantStudentSalesDetailsResponse.loading = false;
        state.tenantStudentSalesDetailsResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          tenantStudentSalesDetailsResponse:
            INITIAL_STATE.tenantStudentSalesDetailsResponse,
        };
      })
      .addCase(tenantGenrateSaleInvoiceThunkAPI.pending, state => {
        state.tenantGenrateSaleInvoiceResponse.loading = true;
      })
      .addCase(tenantGenrateSaleInvoiceThunkAPI.fulfilled, (state, action) => {
        
        state.tenantGenrateSaleInvoiceResponse.loading = false;
        state.tenantGenrateSaleInvoiceResponse.response = action?.payload?.data;
      })
      .addCase(tenantGenrateSaleInvoiceThunkAPI.rejected, (state, action) => {
        
        state.tenantGenrateSaleInvoiceResponse.loading = false;
        state.tenantGenrateSaleInvoiceResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          tenantGenrateSaleInvoiceResponse:
            INITIAL_STATE.tenantGenrateSaleInvoiceResponse,
        };
      })
      .addCase(tenantCreatePaymentInInvoiceThunkAPI.pending, state => {
        state.tenantCreatePaymentInInvoiceResponse.loading = true;
      })
      .addCase(
        tenantCreatePaymentInInvoiceThunkAPI.fulfilled,
        (state, action) => {
          
          state.tenantCreatePaymentInInvoiceResponse.loading = false;
          state.tenantCreatePaymentInInvoiceResponse.response =
            action?.payload?.data;
        },
      )
      .addCase(
        tenantCreatePaymentInInvoiceThunkAPI.rejected,
        (state, action) => {
          
          state.tenantCreatePaymentInInvoiceResponse.loading = false;
          state.tenantCreatePaymentInInvoiceResponse.error = action?.payload
            ?.error
            ? action.payload.error
            : 'Something went wrong';
          state = {
            ...state,
            tenantCreatePaymentInInvoiceResponse:
              INITIAL_STATE.tenantCreatePaymentInInvoiceResponse,
          };
        },
      )
      .addCase(getStudentRoommatesThunkAPI.pending, state => {
        state.getStudentRoommatesResponse.loading = true;
      })
      .addCase(getStudentRoommatesThunkAPI.fulfilled, (state, action) => {
        
        state.getStudentRoommatesResponse.loading = false;
        state.getStudentRoommatesResponse.response = action?.payload?.data;
      })
      .addCase(getStudentRoommatesThunkAPI.rejected, (state, action) => {
        
        state.getStudentRoommatesResponse.loading = false;
        state.getStudentRoommatesResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          getStudentRoommatesResponse:
            INITIAL_STATE.getStudentRoommatesResponse,
        };
      });
  },
});
export default clientProfileSlice.reducer;
