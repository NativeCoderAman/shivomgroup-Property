import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {fetchData, postData} from '../api/apis';

export const getCustomSalePartyDetailsThunkApi = createAsyncThunk(
  'sales/getCustomSalePartyDetailsThunkApi',
  async (_,{getState}) => {
    const {token} = getState().root.auth.userData;
    return await fetchData('getCustomSalePartyDetails', token);
  },
);

export const createPartyThunkApi = createAsyncThunk(
  'sales/createPartyThunkApi',
  async (data,{getState}) => {
    const {token} = getState().root.auth.userData;
    return await postData('createParty', token, data);
  },
);

const initialState = {
  getPartyData: {
    response: [],
    loading: false,
  },
  postPartyData: {
    response: [],
    loading: false,
  },
};

// Slice
const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    resetCreatePartyStatus(state) {
      state.createPartyStatus = null;
    },
  },
  extraReducers: builder => {
    // Handle getCustomSalePartyDetailsThunkApi
    builder.addCase(getCustomSalePartyDetailsThunkApi.pending, state => {
      state.getPartyData.loading = true;
    });
    builder.addCase(
      getCustomSalePartyDetailsThunkApi.fulfilled,
      (state, action) => {
        state.getPartyData.loading = false;
        state.getPartyData.response = action.payload.data;
      },
    );
    builder.addCase(
      getCustomSalePartyDetailsThunkApi.rejected,
      (state, action) => {
        state.getPartyData.loading = false;
        state.getPartyData.response = action.payload;
      },
    );

    // Handle createPartyThunkApi
    builder.addCase(createPartyThunkApi.pending, state => {
      state.postPartyData.loading = true;
    });
    builder.addCase(createPartyThunkApi.fulfilled, (state, action) => {
      state.postPartyData.loading = false;
      state.postPartyData.response = action.payload.data;
    });
    builder.addCase(createPartyThunkApi.rejected, (state, action) => {
      state.postPartyData.loading = false;
      state.postPartyData.response = action.payload.error;
    });
  },
});

// Export Actions
export const {resetCreatePartyStatus} = salesSlice.actions;

// Export Reducer
export default salesSlice.reducer;
