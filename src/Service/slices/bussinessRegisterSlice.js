import {createSlice} from '@reduxjs/toolkit';
import {
  addTermsAndConditionsThunkAPI,
  deleteTermsAndConditionsThunkAPI,
  getBusinessImgAndBusinessNamesThunkAPI,
  getBusinessProfileDataThunkAPI,
  getBusinessProfileDocumetsThunkAPI,
  getInvoiceTermsAndCondtionsThunkAPI,
  updateBusinessProfileImgThunkAPI,
  updateBusinessProfileThunkAPI,
  uploadDocumetsThunkAPI,
  checkBusinessNameThunkApi,
  checkBusinessEmailThunkApi,
  checkBusinessMobileThunkApi
} from '../api/thunks';

const INITIAL_STATE = {
  getBusinessImgAndBusinessNamesResponse: {
    response: [],
    loading: false,
  },
  getBusinessProfileDataResponse: {
    response: [],
    loading: false,
  },
  updateBusinessProfileResponse: {
    response: [],
    loading: false,
  },
  updateBusinessProfileImgResponse: {
    response: [],
    loading: false,
  },
  uploadDocumetsResponse: {
    response: [],
    loading: false,
  },
  getBusinessProfileDocumetsResponse: {
    response: [],
    loading: false,
  },
  getInvoiceTermsAndCondtionsResponse: {
    response: [],
    loading: false,
  },
  addTermsAndConditionsResponse: {
    response: [],
    loading: false,
  },
  deleteTermsAndConditionsResponse: {
    response: [],
    loading: false,
  },
  checkBusinessNameResponse: {
    response: [],
    loading: false,
  },
  checkBusinessEmailResponse: {
    response: [],
    loading: false,
  },
  checkBusinessMobileResponse: {
    response: [],
    loading: false,
  },
};

const bussinessRegisterSlice = createSlice({
  name: 'bussiness',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getBusinessImgAndBusinessNamesThunkAPI.pending, state => {
        state.getBusinessImgAndBusinessNamesResponse.loading = true;
      })
      .addCase(
        getBusinessImgAndBusinessNamesThunkAPI.fulfilled,
        (state, action) => {
          state.getBusinessImgAndBusinessNamesResponse.loading = false;
          state.getBusinessImgAndBusinessNamesResponse.response =
            action?.payload?.data;
        },
      )
      .addCase(
        getBusinessImgAndBusinessNamesThunkAPI.rejected,
        (state, action) => {
          state.getBusinessImgAndBusinessNamesResponse.loading = false;
          state.getBusinessImgAndBusinessNamesResponse.error =
            action?.error?.message;
          state = {
            ...state,
            getBusinessImgAndBusinessNamesResponse:
              INITIAL_STATE.getBusinessImgAndBusinessNamesResponse,
          };
        },
      )
      .addCase(getBusinessProfileDataThunkAPI.pending, state => {
        state.getBusinessProfileDataResponse.loading = true;
      })
      .addCase(getBusinessProfileDataThunkAPI.fulfilled, (state, action) => {
        state.getBusinessProfileDataResponse.loading = false;
        state.getBusinessProfileDataResponse.response = action?.payload?.data;
      })
      .addCase(getBusinessProfileDataThunkAPI.rejected, (state, action) => {
        //
        state.getBusinessProfileDataResponse.loading = false;
        state.getBusinessProfileDataResponse.error = action?.error?.message;
        state = {
          ...state,
          getBusinessProfileDataResponse:
            INITIAL_STATE.getBusinessProfileDataResponse,
        };
      })
      .addCase(updateBusinessProfileThunkAPI.pending, state => {
        state.updateBusinessProfileResponse.loading = true;
      })
      .addCase(updateBusinessProfileThunkAPI.fulfilled, (state, action) => {
        state.updateBusinessProfileResponse.loading = false;
        state.updateBusinessProfileResponse.response = action?.payload?.data;
      })
      .addCase(updateBusinessProfileThunkAPI.rejected, (state, action) => {
        state.updateBusinessProfileResponse.loading = false;
        state.updateBusinessProfileResponse.error = action?.error?.message;
        state = {
          ...state,
          updateBusinessProfileResponse:
            INITIAL_STATE.updateBusinessProfileResponse,
        };
      })
      .addCase(updateBusinessProfileImgThunkAPI.pending, state => {
        state.updateBusinessProfileImgResponse.loading = true;
      })
      .addCase(updateBusinessProfileImgThunkAPI.fulfilled, (state, action) => {
        state.updateBusinessProfileImgResponse.loading = false;
        state.updateBusinessProfileImgResponse.response = action?.payload?.data;
      })
      .addCase(updateBusinessProfileImgThunkAPI.rejected, (state, action) => {
        state.updateBusinessProfileImgResponse.loading = false;
        state.updateBusinessProfileImgResponse.error = action?.error?.message;
        state = {
          ...state,
          updateBusinessProfileImgResponse:
            INITIAL_STATE.updateBusinessProfileImgResponse,
        };
      })
      .addCase(uploadDocumetsThunkAPI.pending, state => {
        state.uploadDocumetsResponse.loading = true;
      })
      .addCase(uploadDocumetsThunkAPI.fulfilled, (state, action) => {
        state.uploadDocumetsResponse.loading = false;
        state.uploadDocumetsResponse.response = action?.payload?.data;
      })
      .addCase(uploadDocumetsThunkAPI.rejected, (state, action) => {
        state.uploadDocumetsResponse.loading = false;
        state.uploadDocumetsResponse.error = action?.error?.message;
        state = {
          ...state,
          uploadDocumetsResponse: INITIAL_STATE.uploadDocumetsResponse,
        };
      })
      .addCase(getBusinessProfileDocumetsThunkAPI.pending, state => {
        state.getBusinessProfileDocumetsResponse.loading = true;
      })
      .addCase(
        getBusinessProfileDocumetsThunkAPI.fulfilled,
        (state, action) => {
          state.getBusinessProfileDocumetsResponse.loading = false;
          state.getBusinessProfileDocumetsResponse.response =
            action?.payload?.data;
        },
      )
      .addCase(getBusinessProfileDocumetsThunkAPI.rejected, (state, action) => {
        state.getBusinessProfileDocumetsResponse.loading = false;
        state.getBusinessProfileDocumetsResponse.error = action?.error?.message;
        state = {
          ...state,
          getBusinessProfileDocumetsResponse:
            INITIAL_STATE.getBusinessProfileDocumetsResponse,
        };
      })
      .addCase(getInvoiceTermsAndCondtionsThunkAPI.pending, state => {
        state.getInvoiceTermsAndCondtionsResponse.loading = true;
      })
      .addCase(
        getInvoiceTermsAndCondtionsThunkAPI.fulfilled,
        (state, action) => {
          state.getInvoiceTermsAndCondtionsResponse.loading = false;
          state.getInvoiceTermsAndCondtionsResponse.response =
            action?.payload?.data;
        },
      )
      .addCase(
        getInvoiceTermsAndCondtionsThunkAPI.rejected,
        (state, action) => {
          state.getInvoiceTermsAndCondtionsResponse.loading = false;
          state.getInvoiceTermsAndCondtionsResponse.error =
            action?.error?.message;
          state = {
            ...state,
            getInvoiceTermsAndCondtionsResponse:
              INITIAL_STATE.getInvoiceTermsAndCondtionsResponse,
          };
        },
      )
      .addCase(addTermsAndConditionsThunkAPI.pending, state => {
        state.addTermsAndConditionsResponse.loading = true;
      })
      .addCase(addTermsAndConditionsThunkAPI.fulfilled, (state, action) => {
        state.addTermsAndConditionsResponse.loading = false;
        state.addTermsAndConditionsResponse.response = action?.payload?.data;
      })
      .addCase(addTermsAndConditionsThunkAPI.rejected, (state, action) => {
        state.addTermsAndConditionsResponse.loading = false;
        state.addTermsAndConditionsResponse.error = action?.error?.message;
        state = {
          ...state,
          addTermsAndConditionsResponse:
            INITIAL_STATE.addTermsAndConditionsResponse,
        };
      })
      .addCase(deleteTermsAndConditionsThunkAPI.pending, state => {
        state.deleteTermsAndConditionsResponse.loading = true;
      })
      .addCase(deleteTermsAndConditionsThunkAPI.fulfilled, (state, action) => {
        state.deleteTermsAndConditionsResponse.loading = false;
        state.deleteTermsAndConditionsResponse.response = action?.payload?.data;
      })
      .addCase(deleteTermsAndConditionsThunkAPI.rejected, (state, action) => {
        state.deleteTermsAndConditionsResponse.loading = false;
        state.deleteTermsAndConditionsResponse.error = action?.error?.message;
        state = {
          ...state,
          deleteTermsAndConditionsResponse:
            INITIAL_STATE.deleteTermsAndConditionsResponse,
        };
      })
      .addCase(checkBusinessNameThunkApi.pending, state => {
        state.checkBusinessNameResponse.loading = true;
      })
      .addCase(checkBusinessNameThunkApi.fulfilled, (state, action) => {
        state.checkBusinessNameResponse.loading = false;
        state.checkBusinessNameResponse.response = action?.payload?.data;
      })
      .addCase(checkBusinessNameThunkApi.rejected, (state, action) => {
        state.checkBusinessNameResponse.loading = false;
        state.checkBusinessNameResponse.response = action?.payload;
      })
      .addCase(checkBusinessEmailThunkApi.pending, state => {
        state.checkBusinessEmailResponse.loading = true;
      })
      .addCase(checkBusinessEmailThunkApi.fulfilled, (state, action) => {
        state.checkBusinessEmailResponse.loading = false;
        state.checkBusinessEmailResponse.response = action?.payload?.data;
      })
      .addCase(checkBusinessEmailThunkApi.rejected, (state, action) => {
        state.checkBusinessEmailResponse.loading = false;
        state.checkBusinessEmailResponse.response = action?.payload?.data;
      })
      .addCase(checkBusinessMobileThunkApi.pending, state => {
        state.checkBusinessMobileResponse.loading = true;
      })
      .addCase(checkBusinessMobileThunkApi.fulfilled, (state, action) => {
        state.checkBusinessMobileResponse.loading = false;
        state.checkBusinessMobileResponse.response = action?.payload?.data;
      })
      .addCase(checkBusinessMobileThunkApi.rejected, (state, action) => {
        state.checkBusinessMobileResponse.loading = false;
        state.checkBusinessMobileResponse.response = action?.payload;
      });
  },
});
export default bussinessRegisterSlice.reducer;
