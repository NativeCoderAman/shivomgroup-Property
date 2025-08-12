import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  checkStudentPasswordIsCreatedOrNotThunkAPI,
  createStudentPasswordThunkAPI,
  studentLoginThunkAPI,
  studentSingUpThunkAPI,
  tenantResetStudentPasswordThunkAPI,
  tenantforgetStudentPasswordThunkAPI,
  tenantverifyForgetPasswordOtpThunkAPI,
  profileStatusCheckApi,
} from '../../api/thunks';

const INITIAL_STATE = {
  studentLoginResponse: {
    response: [],
    loading: false,
  },
  studentSingUpResponse: {
    response: [],
    loading: false,
  },
  createStudentPasswordResponse: {
    response: [],
    loading: false,
  },
  checkStudentPasswordIsCreatedOrNotResponse: {
    response: [],
    loading: false,
  },
  tenantforgetStudentPasswordResponse: {
    response: [],
    loading: false,
  },
  tenantverifyForgetPasswordOtpResponse: {
    response: [],
    loading: false,
  },
  tenantResetStudentPasswordResponse: {
    response: [],
    loading: false,
  },
  profileStatusCheckApiResponse: {
    response: [],
    loading: false,
  },

  clientSessionData: {
    token: null,
    studentID: null,
    userType: null,
    id: null,
    hostelStatus: null,
    mobileNumber: null,
  },
};

const clientAuthSlice = createSlice({
  name: 'clientAuth',
  initialState: INITIAL_STATE,

  reducers: {
    setTenantToken: (state, action) => {
      state.clientSessionData = action.payload;
    },
    clearTenantSession: state => {
      state.clientSessionData = INITIAL_STATE.clientSessionData;
      // Clear other session-related state for the tenant...
    },
  },
  extraReducers: builder => {
    builder
      .addCase(studentLoginThunkAPI.pending, state => {
        state.studentLoginResponse.loading = true;
      })
      .addCase(studentLoginThunkAPI.fulfilled, (state, action) => {
        state.studentLoginResponse.loading = false;
        state.studentLoginResponse.response = action?.payload;
      })
      .addCase(studentLoginThunkAPI.rejected, (state, action) => {
        state.studentLoginResponse.loading = false;
        state.studentLoginResponse.response = action?.payload;
      })
      .addCase(studentSingUpThunkAPI.pending, state => {
        state.studentSingUpResponse.loading = true;
      })
      .addCase(studentSingUpThunkAPI.fulfilled, (state, action) => {
        state.studentSingUpResponse.loading = false;
        state.studentSingUpResponse.response = action?.payload;
      })
      .addCase(studentSingUpThunkAPI.rejected, (state, action) => {
        state.studentSingUpResponse.loading = false;
        state.studentSingUpResponse.error =
          action?.error?.message === 'Request failed with status code 406'
            ? 'Hostel ID is not valid'
            : action?.error?.message === 'Request failed with status code 409'
            ? 'You are already registered please go to login'
            : 'Something went wrong';
      })
      .addCase(createStudentPasswordThunkAPI.pending, state => {
        state.createStudentPasswordResponse.loading = true;
      })
      .addCase(createStudentPasswordThunkAPI.fulfilled, (state, action) => {
        state.createStudentPasswordResponse.loading = false;
        state.createStudentPasswordResponse.response = action?.payload;
      })
      .addCase(createStudentPasswordThunkAPI.rejected, (state, action) => {
        state.createStudentPasswordResponse.loading = false;
        state.createStudentPasswordResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
      })
      .addCase(checkStudentPasswordIsCreatedOrNotThunkAPI.pending, state => {
        state.checkStudentPasswordIsCreatedOrNotResponse.loading = true;
      })
      .addCase(
        checkStudentPasswordIsCreatedOrNotThunkAPI.fulfilled,
        (state, action) => {
          state.checkStudentPasswordIsCreatedOrNotResponse.loading = false;
          state.checkStudentPasswordIsCreatedOrNotResponse.response =
            action?.payload;
        },
      )
      .addCase(
        checkStudentPasswordIsCreatedOrNotThunkAPI.rejected,
        (state, action) => {
          state.checkStudentPasswordIsCreatedOrNotResponse.loading = false;
          state.checkStudentPasswordIsCreatedOrNotResponse.error = action
            ?.payload?.error
            ? action.payload.error
            : 'Something went wrong';
        },
      )
      .addCase(tenantforgetStudentPasswordThunkAPI.pending, state => {
        state.tenantforgetStudentPasswordResponse.loading = true;
      })
      .addCase(
        tenantforgetStudentPasswordThunkAPI.fulfilled,
        (state, action) => {
          state.tenantforgetStudentPasswordResponse.loading = false;
          state.tenantforgetStudentPasswordResponse.response = action?.payload;
        },
      )
      .addCase(
        tenantforgetStudentPasswordThunkAPI.rejected,
        (state, action) => {
          state.tenantforgetStudentPasswordResponse.loading = false;
          state.tenantforgetStudentPasswordResponse.error = action?.payload
            ?.error
            ? action.payload.error
            : 'Something went wrong';
        },
      )
      .addCase(tenantverifyForgetPasswordOtpThunkAPI.pending, state => {
        state.tenantverifyForgetPasswordOtpResponse.loading = true;
      })
      .addCase(
        tenantverifyForgetPasswordOtpThunkAPI.fulfilled,
        (state, action) => {
          state.tenantverifyForgetPasswordOtpResponse.loading = false;
          state.tenantverifyForgetPasswordOtpResponse.response =
            action?.payload;
        },
      )
      .addCase(
        tenantverifyForgetPasswordOtpThunkAPI.rejected,
        (state, action) => {
          state.tenantverifyForgetPasswordOtpResponse.loading = false;
          state.tenantverifyForgetPasswordOtpResponse.error = action?.payload
            ?.error
            ? action.payload.error
            : 'Something went wrong';
        },
      )
      .addCase(tenantResetStudentPasswordThunkAPI.pending, state => {
        state.tenantResetStudentPasswordResponse.loading = true;
      })
      .addCase(
        tenantResetStudentPasswordThunkAPI.fulfilled,
        (state, action) => {
          state.tenantResetStudentPasswordResponse.loading = false;
          state.tenantResetStudentPasswordResponse.response = action?.payload;
        },
      )
      .addCase(tenantResetStudentPasswordThunkAPI.rejected, (state, action) => {
        state.tenantResetStudentPasswordResponse.loading = false;
        state.tenantResetStudentPasswordResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
      })
      .addCase(profileStatusCheckApi.pending, state => {
        state.profileStatusCheckApiResponse.loading = true;
        state.profileStatusCheckApiResponse.error = null;
      })
      .addCase(profileStatusCheckApi.fulfilled, (state, action) => {
        state.profileStatusCheckApiResponse.loading = false;
        state.profileStatusCheckApiResponse.response = action?.payload;
        state.clientSessionData.hostelStatus = action?.payload?.hostelStatus;
        state.clientSessionData.studentID = action?.payload?.studentData?.student_id;
      })
      .addCase(profileStatusCheckApi.rejected, (state, action) => {
        state.profileStatusCheckApiResponse.loading = false;
        state.profileStatusCheckApiResponse.response = action.payload;
      });
  },
});
export const {setTenantToken, clearTenantSession} = clientAuthSlice.actions;
export default clientAuthSlice.reducer;
