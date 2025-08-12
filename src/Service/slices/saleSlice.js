import {createSlice} from '@reduxjs/toolkit';
import {
  createCustomSalesThunkAPI,
  createNewSaleItemsThunkAPI,
  createSaleThunkAPI,
  deleteCustomeSaleThunkAPI,
  deleteMainSaleThunkAPI,
  deleteSalesItmeThunkAPI,
  generateSalesReportThunkAPI,
  genrateCustomSaleInvoiceThunkAPI,
  genrateSaleInvoiceThunkAPI,
  getAllBillDetailsThunkAPI,
  getCustomSaleDataThunkAPI,
  getElectricityBillRecordsForStudentThunkAPI,
  getLatestInvoiceNoThunkAPI,
  getSalesDataThunkAPI,
  getSalesItemDataThunkAPI,
  getSalesItemDetailsThunkAPI,
  getSalesItemsThunkAPI,
  getStudentDetailsByIdThunkAPI,
  getStudentsNameByRoomNoThunkAPI,
  makePaymentInForSalesThunkAPI,
  saleStatementThunkAPI,
  studentCustomSalesDetailsThunkAPI,
  studentSalesDetailsThunkAPI,
  updateCustomSalesThunkAPI,
  updatePaymentInForSalesThunkAPI,
  updateReceivedPaymentThunkAPI,
  updateSaleThunkAPI,
  updateSalesItemThunkAPI,
  getSalesHeaderDataThunkAPI,
  getCustomSalePartyDetailsThunkApi,
  createCustomSalePaymentInThunkAPI,
  deleteRegSalePaymentInThunkApi,
  deleteCustomSalePaymentInThunkApi,
} from '../api/thunks';

const INITIAL_STATE = {
  saleHeaderResponse: {
    response: [],
    loading: false,
  },
  getLatestInvoiceNoResponse: {
    response: [],
    loading: false,
  },
  getSalesDataResponse: {
    response: [],
    loading: false,
  },
  getCustomSaleDataResponse: {
    response: [],
    loading: false,
  },
  studentSalesDetailsResponse: {
    response: [],
    loading: false,
  },
  studentCustomSalesDetailsResponse: {
    response: [],
    loading: false,
  },
  getStudentsNameByRoomNoResponse: {
    response: [],
    loading: false,
  },
  getStudentDetailsByIdResponse: {
    response: [],
    loading: false,
  },
  getSalesItemsResponse: {
    response: [],
    loading: false,
  },
  getElectricityBillRecordsForStudentResponse: {
    response: [],
    loading: false,
  },
  getSalesItemDetailsResponse: {
    response: [],
    loading: false,
  },
  getAllBillDetailsResponse: {
    response: [],
    loading: false,
  },
  makePaymentInForSalesResponse: {
    response: [],
    loading: false,
  },
  updatePaymentInForSalesResponse: {
    response: [],
    loading: false,
  },
  createSaleResponse: {
    response: [],
    loading: false,
  },
  createCustomSalesResponse: {
    response: [],
    loading: false,
  },
  updateSaleResponse: {
    response: [],
    loading: false,
  },
  updateCustomSalesResponse: {
    response: [],
    loading: false,
  },
  genrateSaleInvoiceResponse: {
    response: [],
    loading: false,
  },
  genrateCustomSaleInvoiceResponse: {
    response: [],
    loading: false,
  },
  generateSalesReportResponse: {
    response: [],
    loading: false,
  },
  saleStatementResponse: {
    response: [],
    loading: false,
  },
  deleteMainSaleResponse: {
    response: [],
    loading: false,
  },
  deleteCustomeSaleResponse: {
    response: [],
    loading: false,
  },
  getSalesItemDataResponse: {
    response: [],
    loading: false,
  },
  createNewSaleItemsResponse: {
    response: [],
    loading: false,
  },
  updateSalesItemResponse: {
    response: [],
    loading: false,
  },
  deleteSalesItmeResponse: {
    response: [],
    loading: false,
  },
  salesItems: {
    response: [],
    loading: false,
  },
  getCustomSalePartyDetails: {
    response: [],
    loading: false,
  },
  createCustomSalePaymentInData: {
    response: [],
    loading: false,
  },
  deleteRegSalePaymentInResponse: {
    response: [],
    loading: false,
  },
  deleteCustomSalePaymentInResponse: {
    response: [],
    loading: false,
  },
  updateReceivedPaymentResponse:{
    response:[],
    loading:false
  }

};

const salesSlice = createSlice({
  name: 'sales',
  initialState: INITIAL_STATE,
  reducers: {
    setSalesItems: (state, action) => {
      state.salesItems.response = [
        ...state.salesItems.response,
        action.payload,
      ];
    },
    setUpdateSalesItems: (state, action) => {
      state.salesItems.response = [
        ...state.salesItems.response,
        ...action.payload,
      ];
    },
    removeSalesItem: (state, action) => {
      state.salesItems.response = state.salesItems.response.filter(
        (item, i) => {
          return i !== action.payload;
        },
      );
    },
    removeAllSalesItem: (state, action) => {
      state.salesItems = INITIAL_STATE.salesItems;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getSalesHeaderDataThunkAPI.pending, state => {
        state.saleHeaderResponse.loading = true;
      })
      .addCase(getSalesHeaderDataThunkAPI.fulfilled, (state, action) => {
        state.saleHeaderResponse.loading = false;
        state.saleHeaderResponse.response = action?.payload?.data;
      })
      .addCase(getSalesHeaderDataThunkAPI.rejected, (state, action) => {
        state.saleHeaderResponse.loading = false;
        state.saleHeaderResponse.error = action?.payload;
      })
      .addCase(getLatestInvoiceNoThunkAPI.pending, state => {
        state.getLatestInvoiceNoResponse.loading = true;
      })
      .addCase(getLatestInvoiceNoThunkAPI.fulfilled, (state, action) => {
        state.getLatestInvoiceNoResponse.loading = false;
        state.getLatestInvoiceNoResponse.response = action?.payload?.data;
      })
      .addCase(getLatestInvoiceNoThunkAPI.rejected, (state, action) => {
        state.getLatestInvoiceNoResponse.loading = false;
        state.getLatestInvoiceNoResponse.error = action?.error?.message;
        state = {
          ...state,
          getLatestInvoiceNoResponse: INITIAL_STATE.getLatestInvoiceNoResponse,
        };
      })
      .addCase(getSalesDataThunkAPI.pending, state => {
        state.getSalesDataResponse.loading = true;
      })
      .addCase(getSalesDataThunkAPI.fulfilled, (state, action) => {
        state.getSalesDataResponse.loading = false;
        state.getSalesDataResponse.response = action?.payload?.data;
      })
      .addCase(getSalesDataThunkAPI.rejected, (state, action) => {
        state.getSalesDataResponse.loading = false;
        state.getSalesDataResponse.error = action?.error?.message;
        state = {
          ...state,
          getSalesDataResponse: INITIAL_STATE.getSalesDataResponse,
        };
      })
      .addCase(getCustomSaleDataThunkAPI.pending, state => {
        state.getCustomSaleDataResponse.loading = true;
      })
      .addCase(getCustomSaleDataThunkAPI.fulfilled, (state, action) => {
        state.getCustomSaleDataResponse.loading = false;
        state.getCustomSaleDataResponse.response = action?.payload?.data;
      })
      .addCase(getCustomSaleDataThunkAPI.rejected, (state, action) => {
        state.getCustomSaleDataResponse.loading = false;
        state.getCustomSaleDataResponse.error = action?.error?.message;
        state = {
          ...state,
          getCustomSaleDataResponse: INITIAL_STATE.getCustomSaleDataResponse,
        };
      })
      .addCase(studentSalesDetailsThunkAPI.pending, state => {
        state.studentSalesDetailsResponse.loading = true;
      })
      .addCase(studentSalesDetailsThunkAPI.fulfilled, (state, action) => {
        state.studentSalesDetailsResponse.loading = false;
        state.studentSalesDetailsResponse.response = action?.payload?.data;
      })
      .addCase(studentSalesDetailsThunkAPI.rejected, (state, action) => {
        state.studentSalesDetailsResponse.loading = false;
        state.studentSalesDetailsResponse.error = action?.error?.message;
        state = {
          ...state,
          studentSalesDetailsResponse:
            INITIAL_STATE.studentSalesDetailsResponse,
        };
      })
      .addCase(studentCustomSalesDetailsThunkAPI.pending, state => {
        state.studentCustomSalesDetailsResponse.loading = true;
      })
      .addCase(studentCustomSalesDetailsThunkAPI.fulfilled, (state, action) => {
        state.studentCustomSalesDetailsResponse.loading = false;
        state.studentCustomSalesDetailsResponse.response =
          action?.payload?.data;
      })
      .addCase(studentCustomSalesDetailsThunkAPI.rejected, (state, action) => {
        state.studentCustomSalesDetailsResponse.loading = false;
        state.studentCustomSalesDetailsResponse.error = action?.error?.message;
        state = {
          ...state,
          studentCustomSalesDetailsResponse:
            INITIAL_STATE.studentCustomSalesDetailsResponse,
        };
      })
      .addCase(getStudentsNameByRoomNoThunkAPI.pending, state => {
        state.getStudentsNameByRoomNoResponse.loading = true;
      })
      .addCase(getStudentsNameByRoomNoThunkAPI.fulfilled, (state, action) => {
        state.getStudentsNameByRoomNoResponse.loading = false;
        state.getStudentsNameByRoomNoResponse.response = action?.payload?.data;
      })
      .addCase(getStudentsNameByRoomNoThunkAPI.rejected, (state, action) => {
        state.getStudentsNameByRoomNoResponse.loading = false;
        state.getStudentsNameByRoomNoResponse.error = action?.error?.message;
        state = {
          ...state,
          getStudentsNameByRoomNoResponse:
            INITIAL_STATE.getStudentsNameByRoomNoResponse,
        };
      })
      .addCase(getStudentDetailsByIdThunkAPI.pending, state => {
        state.getStudentDetailsByIdResponse.loading = true;
      })
      .addCase(getStudentDetailsByIdThunkAPI.fulfilled, (state, action) => {
        state.getStudentDetailsByIdResponse.loading = false;
        state.getStudentDetailsByIdResponse.response = action?.payload?.data;
      })
      .addCase(getStudentDetailsByIdThunkAPI.rejected, (state, action) => {
        state.getStudentDetailsByIdResponse.loading = false;
        state.getStudentDetailsByIdResponse.error = action?.error?.message;
        state = {
          ...state,
          getStudentDetailsByIdResponse:
            INITIAL_STATE.getStudentDetailsByIdResponse,
        };
      })
      .addCase(getSalesItemsThunkAPI.pending, state => {
        state.getSalesItemsResponse.loading = true;
      })
      .addCase(getSalesItemsThunkAPI.fulfilled, (state, action) => {
        state.getSalesItemsResponse.loading = false;
        state.getSalesItemsResponse.response = action?.payload?.data;
      })
      .addCase(getSalesItemsThunkAPI.rejected, (state, action) => {
        state.getSalesItemsResponse.error = action?.error?.message;
        state = {
          ...state,
          getSalesItemsResponse: INITIAL_STATE.getSalesItemsResponse,
        };
      })
      .addCase(getElectricityBillRecordsForStudentThunkAPI.pending, state => {
        state.getElectricityBillRecordsForStudentResponse.loading = true;
      })
      .addCase(
        getElectricityBillRecordsForStudentThunkAPI.fulfilled,
        (state, action) => {
          state.getElectricityBillRecordsForStudentResponse.loading = false;
          state.getElectricityBillRecordsForStudentResponse.response =
            action?.payload?.data;
        },
      )
      .addCase(
        getElectricityBillRecordsForStudentThunkAPI.rejected,
        (state, action) => {
          state.getElectricityBillRecordsForStudentResponse.error =
            action?.error?.message;
          state = {
            ...state,
            getElectricityBillRecordsForStudentResponse:
              INITIAL_STATE.getElectricityBillRecordsForStudentResponse,
          };
        },
      )
      .addCase(getSalesItemDetailsThunkAPI.pending, state => {
        state.getSalesItemDetailsResponse.loading = true;
      })
      .addCase(getSalesItemDetailsThunkAPI.fulfilled, (state, action) => {
        state.getSalesItemDetailsResponse.loading = false;
        state.getSalesItemDetailsResponse.response = action?.payload?.data;
      })
      .addCase(getSalesItemDetailsThunkAPI.rejected, (state, action) => {
        state.getSalesItemDetailsResponse.error = action?.error?.message;
        state = {
          ...state,
          getSalesItemDetailsResponse:
            INITIAL_STATE.getSalesItemDetailsResponse,
        };
      })
      .addCase(getAllBillDetailsThunkAPI.pending, state => {
        state.getAllBillDetailsResponse.loading = true;
      })
      .addCase(getAllBillDetailsThunkAPI.fulfilled, (state, action) => {
        state.getAllBillDetailsResponse.loading = false;
        state.getAllBillDetailsResponse.response = action?.payload?.data;
      })
      .addCase(getAllBillDetailsThunkAPI.rejected, (state, action) => {
        state.getAllBillDetailsResponse.error = action?.error?.message;
        state = {
          ...state,
          getAllBillDetailsResponse: INITIAL_STATE.getAllBillDetailsResponse,
        };
      })
      .addCase(makePaymentInForSalesThunkAPI.pending, state => {
        state.makePaymentInForSalesResponse.loading = true;
      })
      .addCase(makePaymentInForSalesThunkAPI.fulfilled, (state, action) => {
        state.makePaymentInForSalesResponse.loading = false;
        state.makePaymentInForSalesResponse.response = action?.payload?.data;
      })
      .addCase(makePaymentInForSalesThunkAPI.rejected, (state, action) => {
        state.makePaymentInForSalesResponse.error = action?.error?.message;
        state = {
          ...state,
          makePaymentInForSalesResponse:
            INITIAL_STATE.makePaymentInForSalesResponse,
        };
      })
      .addCase(updatePaymentInForSalesThunkAPI.pending, state => {
        state.updatePaymentInForSalesResponse.loading = true;
      })
      .addCase(updatePaymentInForSalesThunkAPI.fulfilled, (state, action) => {
        state.updatePaymentInForSalesResponse.loading = false;
        state.updatePaymentInForSalesResponse.response = action?.payload?.data;
      })
      .addCase(updatePaymentInForSalesThunkAPI.rejected, (state, action) => {
        state.updatePaymentInForSalesResponse.error = action?.error?.message;
        state = {
          ...state,
          updatePaymentInForSalesResponse:
            INITIAL_STATE.updatePaymentInForSalesResponse,
        };
      })
      .addCase(createSaleThunkAPI.pending, state => {
        state.createSaleResponse.loading = true;
      })
      .addCase(createSaleThunkAPI.fulfilled, (state, action) => {
        state.createSaleResponse.loading = false;
        state.createSaleResponse.response = action?.payload?.data;
      })
      .addCase(createSaleThunkAPI.rejected, (state, action) => {
        state.createSaleResponse.loading = false;
        state.createSaleResponse.error = action?.error?.message;
        state = {
          ...state,
          createSaleResponse: INITIAL_STATE.createSaleResponse,
        };
      })
      .addCase(createCustomSalesThunkAPI.pending, state => {
        state.createCustomSalesResponse.loading = true;
      })
      .addCase(createCustomSalesThunkAPI.fulfilled, (state, action) => {
        state.createCustomSalesResponse.loading = false;
        state.createCustomSalesResponse.response = action?.payload?.data;
      })
      .addCase(createCustomSalesThunkAPI.rejected, (state, action) => {
        state.createCustomSalesResponse.loading = false;
        state.createCustomSalesResponse.error = action?.error?.message;
        state = {
          ...state,
          createCustomSalesResponse: INITIAL_STATE.createCustomSalesResponse,
        };
      })
      .addCase(updateSaleThunkAPI.pending, state => {
        state.updateSaleResponse.loading = true;
      })
      .addCase(updateSaleThunkAPI.fulfilled, (state, action) => {
        state.updateSaleResponse.loading = false;
        state.updateSaleResponse.response = action?.payload?.data;
      })
      .addCase(updateSaleThunkAPI.rejected, (state, action) => {
        state.updateSaleResponse.loading = false;
        state.updateSaleResponse.error = action?.error?.message;
        state = {
          ...state,
          updateSaleResponse: INITIAL_STATE.updateSaleResponse,
        };
      })
      .addCase(updateCustomSalesThunkAPI.pending, state => {
        state.updateCustomSalesResponse.loading = true;
      })
      .addCase(updateCustomSalesThunkAPI.fulfilled, (state, action) => {
        state.updateCustomSalesResponse.loading = false;
        state.updateCustomSalesResponse.response = action?.payload?.data;
      })
      .addCase(updateCustomSalesThunkAPI.rejected, (state, action) => {
        state.updateCustomSalesResponse.loading = false;
        state.updateCustomSalesResponse.error = action?.error?.message;
        state = {
          ...state,
          updateCustomSalesResponse: INITIAL_STATE.updateCustomSalesResponse,
        };
      })
      .addCase(genrateSaleInvoiceThunkAPI.pending, state => {
        state.genrateSaleInvoiceResponse.loading = true;
      })
      .addCase(genrateSaleInvoiceThunkAPI.fulfilled, (state, action) => {
        state.genrateSaleInvoiceResponse.loading = false;
        state.genrateSaleInvoiceResponse.response = action?.payload?.data;
      })
      .addCase(genrateSaleInvoiceThunkAPI.rejected, (state, action) => {
        state.genrateSaleInvoiceResponse.loading = false;
        state.genrateSaleInvoiceResponse.error = action?.error?.message;
        state = {
          ...state,
          genrateSaleInvoiceResponse: INITIAL_STATE.genrateSaleInvoiceResponse,
        };
      })
      .addCase(genrateCustomSaleInvoiceThunkAPI.pending, state => {
        state.genrateCustomSaleInvoiceResponse.loading = true;
      })
      .addCase(genrateCustomSaleInvoiceThunkAPI.fulfilled, (state, action) => {
        state.genrateCustomSaleInvoiceResponse.loading = false;
        state.genrateCustomSaleInvoiceResponse.response = action?.payload?.data;
      })
      .addCase(genrateCustomSaleInvoiceThunkAPI.rejected, (state, action) => {
        state.genrateCustomSaleInvoiceResponse.loading = false;
        state.genrateCustomSaleInvoiceResponse.error = action?.error?.message;
        state = {
          ...state,
          genrateCustomSaleInvoiceResponse:
            INITIAL_STATE.genrateCustomSaleInvoiceResponse,
        };
      })
      .addCase(generateSalesReportThunkAPI.pending, state => {
        state.generateSalesReportResponse.loading = true;
      })
      .addCase(generateSalesReportThunkAPI.fulfilled, (state, action) => {
        state.generateSalesReportResponse.loading = false;
        state.generateSalesReportResponse.response = action?.payload?.data;
      })
      .addCase(generateSalesReportThunkAPI.rejected, (state, action) => {
        state.generateSalesReportResponse.loading = false;
        state.generateSalesReportResponse.error = action?.error?.message;
        state = {
          ...state,
          generateSalesReportResponse:
            INITIAL_STATE.generateSalesReportResponse,
        };
      })
      .addCase(saleStatementThunkAPI.pending, state => {
        state.saleStatementResponse.loading = true;
      })
      .addCase(saleStatementThunkAPI.fulfilled, (state, action) => {
        state.saleStatementResponse.loading = false;
        state.saleStatementResponse.response = action?.payload?.data;
      })
      .addCase(saleStatementThunkAPI.rejected, (state, action) => {
        state.saleStatementResponse.loading = false;
        state.saleStatementResponse.error = action?.error?.message;
        state = {
          ...state,
          saleStatementResponse: INITIAL_STATE.saleStatementResponse,
        };
      })
      .addCase(deleteMainSaleThunkAPI.pending, state => {
        state.deleteMainSaleResponse.loading = true;
      })
      .addCase(deleteMainSaleThunkAPI.fulfilled, (state, action) => {
        state.deleteMainSaleResponse.loading = false;
        state.deleteMainSaleResponse.response = action?.payload?.data;
      })
      .addCase(deleteMainSaleThunkAPI.rejected, (state, action) => {
        state.deleteMainSaleResponse.loading = false;
        state.deleteMainSaleResponse.error = action?.error?.message;
        state = {
          ...state,
          deleteMainSaleResponse: INITIAL_STATE.deleteMainSaleResponse,
        };
      })
      .addCase(deleteCustomeSaleThunkAPI.pending, state => {
        state.deleteCustomeSaleResponse.loading = true;
      })
      .addCase(deleteCustomeSaleThunkAPI.fulfilled, (state, action) => {
        state.deleteCustomeSaleResponse.loading = false;
        state.deleteCustomeSaleResponse.response = action?.payload?.data;
      })
      .addCase(deleteCustomeSaleThunkAPI.rejected, (state, action) => {
        state.deleteCustomeSaleResponse.loading = false;
        state.deleteCustomeSaleResponse.error = action?.error?.message;
        state = {
          ...state,
          deleteCustomeSaleResponse: INITIAL_STATE.deleteCustomeSaleResponse,
        };
      })
      .addCase(getSalesItemDataThunkAPI.pending, state => {
        //for items that appears on sales section for selection
        state.getSalesItemDataResponse.loading = true;
      })
      .addCase(getSalesItemDataThunkAPI.fulfilled, (state, action) => {
        state.getSalesItemDataResponse.loading = false;
        state.getSalesItemDataResponse.response = action?.payload?.data;
      })
      .addCase(getSalesItemDataThunkAPI.rejected, (state, action) => {
        state.getSalesItemDataResponse.loading = false;
        state.getSalesItemDataResponse.error = action?.error?.message;
        state = {
          ...state,
          getSalesItemDataResponse: INITIAL_STATE.getSalesItemDataResponse,
        };
      })
      .addCase(createNewSaleItemsThunkAPI.pending, state => {
        //for items that appears on sales section for selection
        state.createNewSaleItemsResponse.loading = true;
      })
      .addCase(createNewSaleItemsThunkAPI.fulfilled, (state, action) => {
        state.createNewSaleItemsResponse.loading = false;
        state.createNewSaleItemsResponse.response = action?.payload?.data;
      })
      .addCase(createNewSaleItemsThunkAPI.rejected, (state, action) => {
        state.createNewSaleItemsResponse.error = action?.error?.message;
        state = {
          ...state,
          createNewSaleItemsResponse: INITIAL_STATE.createNewSaleItemsResponse,
        };
      })
      .addCase(updateSalesItemThunkAPI.pending, state => {
        //for items that appears on sales section for selection
        state.createNewSaleItemsResponse.loading = true;
      })
      .addCase(updateSalesItemThunkAPI.fulfilled, (state, action) => {
        state.createNewSaleItemsResponse.loading = false;
        state.createNewSaleItemsResponse.response = action?.payload?.data;
      })
      .addCase(updateSalesItemThunkAPI.rejected, (state, action) => {
        state.createNewSaleItemsResponse.error = action?.error?.message;
        state = {
          ...state,
          createNewSaleItemsResponse: INITIAL_STATE.createNewSaleItemsResponse,
        };
      })
      .addCase(deleteSalesItmeThunkAPI.pending, state => {
        //for items that appears on sales section for selection
        state.deleteSalesItmeResponse.loading = true;
      })
      .addCase(deleteSalesItmeThunkAPI.fulfilled, (state, action) => {
        state.deleteSalesItmeResponse.loading = false;
        state.deleteSalesItmeResponse.response = action?.payload?.data;
      })
      .addCase(deleteSalesItmeThunkAPI.rejected, (state, action) => {
        state.deleteSalesItmeResponse.error = action?.error?.message;
        state = {
          ...state,
          deleteSalesItmeResponse: INITIAL_STATE.deleteSalesItmeResponse,
        };
      })
      .addCase(getCustomSalePartyDetailsThunkApi.pending, state => {
        state.getCustomSalePartyDetails.loading = true;
      })
      .addCase(getCustomSalePartyDetailsThunkApi.fulfilled, (state, action) => {
        state.getCustomSalePartyDetails.response = action?.payload?.data;
        state.getCustomSalePartyDetails.loading = false;
      })
      .addCase(getCustomSalePartyDetailsThunkApi.rejected, (state, action) => {
        state.getCustomSalePartyDetails.response = action?.payload?.data;
        state.getCustomSalePartyDetails.loading = false;
      })
      .addCase(createCustomSalePaymentInThunkAPI.pending, state => {
        state.createCustomSalePaymentInData.loading = true;
      })
      .addCase(createCustomSalePaymentInThunkAPI.fulfilled, (state, action) => {
        state.createCustomSalePaymentInData.response = action?.payload?.data;
        state.createCustomSalePaymentInData.loading = false;
      })
      .addCase(createCustomSalePaymentInThunkAPI.rejected, (state, action) => {
        state.createCustomSalePaymentInData.response = action?.payload?.data;
        state.createCustomSalePaymentInData.loading = false;
      })
      .addCase(deleteRegSalePaymentInThunkApi.pending, state => {
        state.deleteRegSalePaymentInResponse.loading = true;
      })
      .addCase(deleteRegSalePaymentInThunkApi.fulfilled, (state, action) => {
        state.deleteRegSalePaymentInResponse.response = action?.payload?.data;
        state.deleteRegSalePaymentInResponse.loading = false;
      })
      .addCase(deleteRegSalePaymentInThunkApi.rejected, (state, action) => {
        state.deleteRegSalePaymentInResponse.response = action?.payload?.data;
        state.deleteRegSalePaymentInResponse.loading = false;
      })
      .addCase(deleteCustomSalePaymentInThunkApi.pending, state => {
        state.deleteCustomSalePaymentInResponse.loading = true;
      })
      .addCase(deleteCustomSalePaymentInThunkApi.fulfilled, (state, action) => {
        state.deleteCustomSalePaymentInResponse.response = action?.payload?.data;
        state.deleteCustomSalePaymentInResponse.loading = false;
      })
      .addCase(deleteCustomSalePaymentInThunkApi.rejected, (state, action) => {
        state.deleteCustomSalePaymentInResponse.response = action?.payload?.data;
        state.deleteCustomSalePaymentInResponse.loading = false;
      })
      .addCase(updateReceivedPaymentThunkAPI.pending, state => {
        state.updateReceivedPaymentResponse.loading = true;
      })
      .addCase(updateReceivedPaymentThunkAPI.fulfilled, (state, action) => {
        state.updateReceivedPaymentResponse.response = action?.payload?.data;
        state.updateReceivedPaymentResponse.loading = false;
      })
      .addCase(updateReceivedPaymentThunkAPI.rejected, (state, action) => {
        state.updateReceivedPaymentResponse.response = action?.payload?.data;
        state.updateReceivedPaymentResponse.loading = false;
      });
  },
});
export const {
  setSalesItems,
  setUpdateSalesItems,
  removeSalesItem,
  removeAllSalesItem,
} = salesSlice.actions;
export default salesSlice.reducer;
