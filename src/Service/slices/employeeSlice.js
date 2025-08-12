import {createSlice} from '@reduxjs/toolkit';
import {
  SalarySetupRecordThunkAPI,
  addAttendanceThunkAPI,
  addEmployeeThunkAPI,
  addNewUserRollThunkAPI,
  createEmpSalaryRecordsThunkAPI,
  createPaymentSetupThunkAPI,
  createReferAndEarnSetupThunkAPI,
  deleteAttendanceThunkAPI,
  deleteEmpSalaryRecordsThunkAPI,
  deleteEmployesThunkAPI,
  empAttendacesRecordsThunkAPI,
  generateUniqueEmpFormNoThunkAPI,
  getAllPermissionThunkAPI,
  getEmpAttendaceThunkAPI,
  getEmpSalaryByMonthThunkAPI,
  getEmpTotalAttendaceThunkAPI,
  getEmployesThunkAPI,
  getReferEarnSetupDataThunkAPI,
  getSalaryRecordsByIdThunkAPI,
  storeEmpAttendanceThunkAPI,
  updateAddUserRollThunkAPI,
  updateEmpAttendaceThunkAPI,
  updateEmployeesThunkAPI,
  updateSalaryRecordsThunkAPI,
} from '../api/thunks';

const INITIAL_STATE = {
  getAllPermissionResponse: {
    response: [],
    loading: false,
  },
  getEmployesResponse: {
    response: [],
    loading: false,
  },
  addEmployeeResponse: {
    response: [],
    loading: false,
  },
  updateEmployeesResponse: {
    response: [],
    loading: false,
  },
  addNewUserRollResponse: {
    response: [],
    loading: false,
  },
  generateUniqueEmpFormNoResponse: {
    response: [],
    loading: false,
  },
  updateAddUserRollResponse: {
    response: [],
    loading: false,
  },
  deleteEmployesResponse: {
    response: [],
    loading: false,
  },
  getReferEarnSetupDataResponse: {
    response: [],
    loading: false,
  },
  createReferAndEarnSetupResponse: {
    response: [],
    loading: false,
  },
  getEmpSalaryByMonthResponse: {
    response: [],
    loading: false,
  },
  deleteEmpSalaryRecordsResponse: {
    response: [],
    loading: false,
  },
  createEmpSalaryRecordsResponse: {
    response: [],
    loading: false,
  },
  getSalaryRecordsByIdResponse: {
    response: [],
    loading: false,
  },
  updateSalaryRecordsResponse: {
    response: [],
    loading: false,
  },
  SalarySetupRecordResponse: {
    response: [],
    loading: false,
  },
  createPaymentSetupResponse: {
    response: [],
    loading: false,
  },
  getEmpAttendaceResponse: {
    response: [],
    loading: false,
  },
  getEmpTotalAttendaceResponse: {
    response: [],
    loading: false,
  },
  empAttendacesRecordsResponse: {
    response: [],
    loading: false,
  },
  storeEmpAttendanceResponse: {
    response: [],
    loading: false,
  },
  addAttendanceResponse: {
    response: [],
    loading: false,
  },
  updateEmpAttendaceResponse: {
    response: [],
    loading: false,
  },
  deleteAttendanceResponse: {
    response: [],
    loading: false,
  },
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllPermissionThunkAPI.pending, state => {
        state.getAllPermissionResponse.loading = true;
      })
      .addCase(getAllPermissionThunkAPI.fulfilled, (state, action) => {
        state.getAllPermissionResponse.loading = false;
        state.getAllPermissionResponse.response = action?.payload?.data;
      })
      .addCase(getAllPermissionThunkAPI.rejected, (state, action) => {
        state.getAllPermissionResponse.loading = false;
        state.getAllPermissionResponse.error = action?.error?.message;
        state = {
          ...state,
          getAllPermissionResponse: INITIAL_STATE.getAllPermissionResponse,
        };
      })
      .addCase(getEmployesThunkAPI.pending, state => {
        state.getEmployesResponse.loading = true;
      })
      .addCase(getEmployesThunkAPI.fulfilled, (state, action) => {
        
        state.getEmployesResponse.loading = false;
        state.getEmployesResponse.response = action?.payload?.data;
      })
      .addCase(getEmployesThunkAPI.rejected, (state, action) => {
        // 
        state.getEmployesResponse.loading = false;
        state.getEmployesResponse.error = action?.error?.message;
        state = {
          ...state,
          getEmployesResponse: INITIAL_STATE.getEmployesResponse,
        };
      })
      .addCase(addEmployeeThunkAPI.pending, state => {
        state.addEmployeeResponse.loading = true;
      })
      .addCase(addEmployeeThunkAPI.fulfilled, (state, action) => {
        
        state.addEmployeeResponse.loading = false;
        state.addEmployeeResponse.response = action?.payload?.data;
      })
      .addCase(addEmployeeThunkAPI.rejected, (state, action) => {
        // 
        state.addEmployeeResponse.loading = false;
        state.addEmployeeResponse.error = action?.error?.message;
        state = {
          ...state,
          addEmployeeResponse: INITIAL_STATE.addEmployeeResponse,
        };
      })
      .addCase(updateEmployeesThunkAPI.pending, state => {
        state.updateEmployeesResponse.loading = true;
      })
      .addCase(updateEmployeesThunkAPI.fulfilled, (state, action) => {
        
        state.updateEmployeesResponse.loading = false;
        state.updateEmployeesResponse.response = action?.payload?.data;
      })
      .addCase(updateEmployeesThunkAPI.rejected, (state, action) => {
        // 
        state.updateEmployeesResponse.loading = false;
        state.updateEmployeesResponse.error = action?.error?.message;
        state = {
          ...state,
          updateEmployeesResponse: INITIAL_STATE.updateEmployeesResponse,
        };
      })
      .addCase(addNewUserRollThunkAPI.pending, state => {
        state.addNewUserRollResponse.loading = true;
      })
      .addCase(addNewUserRollThunkAPI.fulfilled, (state, action) => {
        
        state.addNewUserRollResponse.loading = false;
        state.addNewUserRollResponse.response = action?.payload?.data;
      })
      .addCase(addNewUserRollThunkAPI.rejected, (state, action) => {
        // 
        state.addNewUserRollResponse.loading = false;
        state.addNewUserRollResponse.error = action?.error?.message;
        state = {
          ...state,
          addNewUserRollResponse: INITIAL_STATE.addNewUserRollResponse,
        };
      })
      .addCase(generateUniqueEmpFormNoThunkAPI.pending, state => {
        state.generateUniqueEmpFormNoResponse.loading = true;
      })
      .addCase(generateUniqueEmpFormNoThunkAPI.fulfilled, (state, action) => {
        
        state.generateUniqueEmpFormNoResponse.loading = false;
        state.generateUniqueEmpFormNoResponse.response = action?.payload?.data;
      })
      .addCase(generateUniqueEmpFormNoThunkAPI.rejected, (state, action) => {
        // 
        state.generateUniqueEmpFormNoResponse.loading = false;
        state.generateUniqueEmpFormNoResponse.error = action?.error?.message;
        state = {
          ...state,
          generateUniqueEmpFormNoResponse:
            INITIAL_STATE.generateUniqueEmpFormNoResponse,
        };
      })
      .addCase(updateAddUserRollThunkAPI.pending, state => {
        state.updateAddUserRollResponse.loading = true;
      })
      .addCase(updateAddUserRollThunkAPI.fulfilled, (state, action) => {
        
        state.updateAddUserRollResponse.loading = false;
        state.updateAddUserRollResponse.response = action?.payload?.data;
      })
      .addCase(updateAddUserRollThunkAPI.rejected, (state, action) => {
        // 
        state.updateAddUserRollResponse.loading = false;
        state.updateAddUserRollResponse.error = action?.error?.message;
        state = {
          ...state,
          updateAddUserRollResponse: INITIAL_STATE.updateAddUserRollResponse,
        };
      })
      .addCase(deleteEmployesThunkAPI.pending, state => {
        state.deleteEmployesResponse.loading = true;
      })
      .addCase(deleteEmployesThunkAPI.fulfilled, (state, action) => {
        
        state.deleteEmployesResponse.loading = false;
        state.deleteEmployesResponse.response = action?.payload?.data;
      })
      .addCase(deleteEmployesThunkAPI.rejected, (state, action) => {
        // 
        state.deleteEmployesResponse.loading = false;
        state.deleteEmployesResponse.error = action?.error?.message;
        state = {
          ...state,
          deleteEmployesResponse: INITIAL_STATE.deleteEmployesResponse,
        };
      })
      .addCase(getReferEarnSetupDataThunkAPI.pending, state => {
        state.getReferEarnSetupDataResponse.loading = true;
      })
      .addCase(getReferEarnSetupDataThunkAPI.fulfilled, (state, action) => {
        state.getReferEarnSetupDataResponse.loading = false;
        state.getReferEarnSetupDataResponse.response = action?.payload?.data;
      })
      .addCase(getReferEarnSetupDataThunkAPI.rejected, (state, action) => {
        // 
        state.getReferEarnSetupDataResponse.loading = false;
        state.getReferEarnSetupDataResponse.error = action?.error?.message;
        state = {
          ...state,
          getReferEarnSetupDataResponse:
            INITIAL_STATE.getReferEarnSetupDataResponse,
        };
      })
      .addCase(createReferAndEarnSetupThunkAPI.pending, state => {
        state.createReferAndEarnSetupResponse.loading = true;
      })
      .addCase(createReferAndEarnSetupThunkAPI.fulfilled, (state, action) => {
        state.createReferAndEarnSetupResponse.loading = false;
        state.createReferAndEarnSetupResponse.response = action?.payload?.data;
      })
      .addCase(createReferAndEarnSetupThunkAPI.rejected, (state, action) => {
        state.createReferAndEarnSetupResponse.loading = false;
        state.createReferAndEarnSetupResponse.error = action?.error?.message;
        // 
        state = {
          ...state,
          createReferAndEarnSetupResponse:
            INITIAL_STATE.createReferAndEarnSetupResponse,
        };
      })
      .addCase(getEmpSalaryByMonthThunkAPI.pending, state => {
        state.getEmpSalaryByMonthResponse.loading = true;
      })
      .addCase(getEmpSalaryByMonthThunkAPI.fulfilled, (state, action) => {
        
        state.getEmpSalaryByMonthResponse.loading = false;
        state.getEmpSalaryByMonthResponse.response = action?.payload?.data;
      })
      .addCase(getEmpSalaryByMonthThunkAPI.rejected, (state, action) => {
        // 
        state.getEmpSalaryByMonthResponse.loading = false;
        state.getEmpSalaryByMonthResponse.error = action?.error?.message;
        state = {
          ...state,
          getEmpSalaryByMonthResponse:
            INITIAL_STATE.getEmpSalaryByMonthResponse,
        };
      })
      .addCase(deleteEmpSalaryRecordsThunkAPI.pending, state => {
        state.deleteEmpSalaryRecordsResponse.loading = true;
      })
      .addCase(deleteEmpSalaryRecordsThunkAPI.fulfilled, (state, action) => {
        
        state.deleteEmpSalaryRecordsResponse.loading = false;
        state.deleteEmpSalaryRecordsResponse.response = action?.payload?.data;
      })
      .addCase(deleteEmpSalaryRecordsThunkAPI.rejected, (state, action) => {
        // 
        state.deleteEmpSalaryRecordsResponse.loading = false;
        state.deleteEmpSalaryRecordsResponse.error = action?.error?.message;
        state = {
          ...state,
          deleteEmpSalaryRecordsResponse:
            INITIAL_STATE.deleteEmpSalaryRecordsResponse,
        };
      })
      .addCase(createEmpSalaryRecordsThunkAPI.pending, state => {
        state.createEmpSalaryRecordsResponse.loading = true;
      })
      .addCase(createEmpSalaryRecordsThunkAPI.fulfilled, (state, action) => {
        
        state.createEmpSalaryRecordsResponse.loading = false;
        state.createEmpSalaryRecordsResponse.response = action?.payload?.data;
      })
      .addCase(createEmpSalaryRecordsThunkAPI.rejected, (state, action) => {
        // 
        state.createEmpSalaryRecordsResponse.loading = false;
        state.createEmpSalaryRecordsResponse.error = action?.error?.message;
        state = {
          ...state,
          createEmpSalaryRecordsResponse:
            INITIAL_STATE.createEmpSalaryRecordsResponse,
        };
      })
      .addCase(getSalaryRecordsByIdThunkAPI.pending, state => {
        state.getSalaryRecordsByIdResponse.loading = true;
      })
      .addCase(getSalaryRecordsByIdThunkAPI.fulfilled, (state, action) => {
        
        state.getSalaryRecordsByIdResponse.loading = false;
        state.getSalaryRecordsByIdResponse.response = action?.payload?.data;
      })
      .addCase(getSalaryRecordsByIdThunkAPI.rejected, (state, action) => {
        // 
        state.getSalaryRecordsByIdResponse.loading = false;
        state.getSalaryRecordsByIdResponse.error = action?.error?.message;
        state = {
          ...state,
          getSalaryRecordsByIdResponse:
            INITIAL_STATE.getSalaryRecordsByIdResponse,
        };
      })
      .addCase(updateSalaryRecordsThunkAPI.pending, state => {
        state.updateSalaryRecordsResponse.loading = true;
      })
      .addCase(updateSalaryRecordsThunkAPI.fulfilled, (state, action) => {
        
        state.updateSalaryRecordsResponse.loading = false;
        state.updateSalaryRecordsResponse.response = action?.payload?.data;
      })
      .addCase(updateSalaryRecordsThunkAPI.rejected, (state, action) => {
        // 
        state.updateSalaryRecordsResponse.loading = false;
        state.updateSalaryRecordsResponse.error = action?.error?.message;
        state = {
          ...state,
          updateSalaryRecordsResponse:
            INITIAL_STATE.updateSalaryRecordsResponse,
        };
      })
      .addCase(SalarySetupRecordThunkAPI.pending, state => {
        state.SalarySetupRecordResponse.loading = true;
      })
      .addCase(SalarySetupRecordThunkAPI.fulfilled, (state, action) => {
        
        state.SalarySetupRecordResponse.loading = false;
        state.SalarySetupRecordResponse.response = action?.payload?.data;
      })
      .addCase(SalarySetupRecordThunkAPI.rejected, (state, action) => {
        // 
        state.SalarySetupRecordResponse.loading = false;
        state.SalarySetupRecordResponse.error = action?.error?.message;
        state = {
          ...state,
          SalarySetupRecordResponse: INITIAL_STATE.SalarySetupRecordResponse,
        };
      })
      .addCase(createPaymentSetupThunkAPI.pending, state => {
        state.createPaymentSetupResponse.loading = true;
      })
      .addCase(createPaymentSetupThunkAPI.fulfilled, (state, action) => {
        
        state.createPaymentSetupResponse.loading = false;
        state.createPaymentSetupResponse.response = action?.payload?.data;
      })
      .addCase(createPaymentSetupThunkAPI.rejected, (state, action) => {
        // 
        state.createPaymentSetupResponse.loading = false;
        state.createPaymentSetupResponse.error = action?.error?.message;
        state = {
          ...state,
          createPaymentSetupResponse: INITIAL_STATE.createPaymentSetupResponse,
        };
      })
      .addCase(getEmpAttendaceThunkAPI.pending, state => {
        state.getEmpAttendaceResponse.loading = true;
      })
      .addCase(getEmpAttendaceThunkAPI.fulfilled, (state, action) => {
        
        state.getEmpAttendaceResponse.loading = false;
        state.getEmpAttendaceResponse.response = action?.payload?.data;
      })
      .addCase(getEmpAttendaceThunkAPI.rejected, (state, action) => {
        // 
        state.getEmpAttendaceResponse.loading = false;
        state.getEmpAttendaceResponse.error = action?.error?.message;
        state = {
          ...state,
          getEmpAttendaceResponse: INITIAL_STATE.getEmpAttendaceResponse,
        };
      })
      .addCase(getEmpTotalAttendaceThunkAPI.pending, state => {
        state.getEmpTotalAttendaceResponse.loading = true;
      })
      .addCase(getEmpTotalAttendaceThunkAPI.fulfilled, (state, action) => {
        
        state.getEmpTotalAttendaceResponse.loading = false;
        state.getEmpTotalAttendaceResponse.response = action?.payload?.data;
      })
      .addCase(getEmpTotalAttendaceThunkAPI.rejected, (state, action) => {
        // 
        state.getEmpTotalAttendaceResponse.loading = false;
        state.getEmpTotalAttendaceResponse.error = action?.error?.message;
        state = {
          ...state,
          getEmpTotalAttendaceResponse:
            INITIAL_STATE.getEmpTotalAttendaceResponse,
        };
      })
      .addCase(empAttendacesRecordsThunkAPI.pending, state => {
        state.empAttendacesRecordsResponse.loading = true;
      })
      .addCase(empAttendacesRecordsThunkAPI.fulfilled, (state, action) => {
        
        state.empAttendacesRecordsResponse.loading = false;
        state.empAttendacesRecordsResponse.response = action?.payload?.data;
      })
      .addCase(empAttendacesRecordsThunkAPI.rejected, (state, action) => {
        
        state.empAttendacesRecordsResponse.error = action?.error?.message;
        state = {
          ...state,
          empAttendacesRecordsResponse:
            INITIAL_STATE.empAttendacesRecordsResponse,
        };
      })
      .addCase(storeEmpAttendanceThunkAPI.pending, state => {
        state.storeEmpAttendanceResponse.loading = true;
      })
      .addCase(storeEmpAttendanceThunkAPI.fulfilled, (state, action) => {
        
        state.storeEmpAttendanceResponse.loading = false;
        state.storeEmpAttendanceResponse.response = action?.payload?.data;
      })
      .addCase(storeEmpAttendanceThunkAPI.rejected, (state, action) => {
        
        state.storeEmpAttendanceResponse.error = action?.error?.message;
        state = {
          ...state,
          storeEmpAttendanceResponse: INITIAL_STATE.storeEmpAttendanceResponse,
        };
      })
      .addCase(addAttendanceThunkAPI.pending, state => {
        state.addAttendanceResponse.loading = true;
      })
      .addCase(addAttendanceThunkAPI.fulfilled, (state, action) => {
        
        state.addAttendanceResponse.loading = false;
        state.addAttendanceResponse.response = action?.payload?.data;
      })
      .addCase(addAttendanceThunkAPI.rejected, (state, action) => {
        
        state.addAttendanceResponse.error = action?.error?.message;
        state = {
          ...state,
          addAttendanceResponse: INITIAL_STATE.addAttendanceResponse,
        };
      })
      .addCase(updateEmpAttendaceThunkAPI.pending, state => {
        state.updateEmpAttendaceResponse.loading = true;
      })
      .addCase(updateEmpAttendaceThunkAPI.fulfilled, (state, action) => {
        
        state.updateEmpAttendaceResponse.loading = false;
        state.updateEmpAttendaceResponse.response = action?.payload?.data;
      })
      .addCase(updateEmpAttendaceThunkAPI.rejected, (state, action) => {
        
        state.updateEmpAttendaceResponse.error = action?.error?.message;
        state = {
          ...state,
          updateEmpAttendaceResponse: INITIAL_STATE.updateEmpAttendaceResponse,
        };
      })
      .addCase(deleteAttendanceThunkAPI.pending, state => {
        state.deleteAttendanceResponse.loading = true;
      })
      .addCase(deleteAttendanceThunkAPI.fulfilled, (state, action) => {
        
        state.deleteAttendanceResponse.loading = false;
        state.deleteAttendanceResponse.response = action?.payload?.data;
      })
      .addCase(deleteAttendanceThunkAPI.rejected, (state, action) => {
        
        state.deleteAttendanceResponse.error = action?.error?.message;
        state = {
          ...state,
          deleteAttendanceResponse: INITIAL_STATE.deleteAttendanceResponse,
        };
      });
  },
});
export default employeeSlice.reducer;
