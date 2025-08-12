import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchData, postData } from '../../api/apis';

// Thunks
export const referVerifyThunkAPi = createAsyncThunk(
  'tenant/referVerifyThunkAPi',
  async ({ data, number, token }) => {
    const response = await fetchData(`verifiedHostelToken?referCode=${data}&referMobileNo=${number}`, token);
    return response;
  }
);

export const tenantSeltRegistrationThunkApi = createAsyncThunk(
  'tenant/tenantSeltRegistrationThunkApi',
  async ({ data, token, id }) => {
    const response = await postData(`tenantStudentSelfRegister/${id}`, token, data);
    return response;
  }
);

export const getPincodeThunkApi = createAsyncThunk(
  'tenant/getPincodeThunkApi',
  async ({ pinno, token }) => {
    const response = await fetchData(`getAddressDetailByPincode?pincode=${pinno}`, token);
    return response;
  }
);

export const getStateDataThunkApi = createAsyncThunk(
  'tenant/getStateDataThunkApi',
  async ({ countryName }) => {
    const response = await fetchData(`getAddressDetailsOption?countryName=${countryName}`);
    return response;
  }
);

export const getDistrictDataThunkApi = createAsyncThunk(
  'tenant/getDistrictDataThunkApi',
  async ({ countryName, stateName }) => {
    const response = await fetchData(`getAddressDetailsOption?countryName=${countryName}&stateName=${stateName}`);
    return response;
  }
);

// Initial State
const initialState = {
  referVerifyData: {
    loading: false,
    data: null,
    error: null
  },
  tenantRegisterResponse: {
    loading: false,
    data: null,
    error: null,
  },
  pincodeResponse: {
    loading: false,
    data: [],
    error: null,
  },
  stateResponse: {
    loading: false,
    data: [],
    error: null,
  },
  districtResponse: {
    loading: false,
    data: [],
    error: null,
  },
};

// Reusable handler for pending, fulfilled, and rejected states
const handlePending = (state, responseKey) => {
  state[responseKey].loading = true;
  state[responseKey].data = responseKey === 'referVerifyData' ? null : [];
};

const handleFulfilled = (state, action, responseKey) => {
  state[responseKey].loading = false;
  state[responseKey].data = action.payload;
};

const handleRejected = (state, action, responseKey) => {
  const errorMessage = action.error?.message || 'Something went wrong';
  state[responseKey].loading = false;
  state[responseKey].error = errorMessage;
};

// Slice
const tenantRefereVerifySlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Refer Verification
      .addCase(referVerifyThunkAPi.pending, (state) => handlePending(state, 'referVerifyData'))
      .addCase(referVerifyThunkAPi.fulfilled, (state, action) => {
        state.referVerifyData.loading = false;
        state.referVerifyData.data = action.payload.refer_code_is_valid;
      })
      .addCase(referVerifyThunkAPi.rejected, (state, action) => handleRejected(state, action, 'referVerifyData'))

      // Pincode
      .addCase(getPincodeThunkApi.pending, (state) => handlePending(state, 'pincodeResponse'))
      .addCase(getPincodeThunkApi.fulfilled, (state, action) => handleFulfilled(state, action, 'pincodeResponse'))
      .addCase(getPincodeThunkApi.rejected, (state, action) => handleRejected(state, action, 'pincodeResponse'))

      // State
      .addCase(getStateDataThunkApi.pending, (state) => handlePending(state, 'stateResponse'))
      .addCase(getStateDataThunkApi.fulfilled, (state, action) => handleFulfilled(state, action, 'stateResponse'))
      .addCase(getStateDataThunkApi.rejected, (state, action) => handleRejected(state, action, 'stateResponse'))

      // District
      .addCase(getDistrictDataThunkApi.pending, (state) => handlePending(state, 'districtResponse'))
      .addCase(getDistrictDataThunkApi.fulfilled, (state, action) => handleFulfilled(state, action, 'districtResponse'))
      .addCase(getDistrictDataThunkApi.rejected, (state, action) => handleRejected(state, action, 'districtResponse'))

      // Tenant Self Registration
      .addCase(tenantSeltRegistrationThunkApi.pending, (state) => handlePending(state, 'tenantRegisterResponse'))
      .addCase(tenantSeltRegistrationThunkApi.fulfilled, (state, action) => handleFulfilled(state, action, 'tenantRegisterResponse'))
      .addCase(tenantSeltRegistrationThunkApi.rejected, (state, action) => handleRejected(state, action, 'tenantRegisterResponse'));
  },
});

export default tenantRefereVerifySlice.reducer;
