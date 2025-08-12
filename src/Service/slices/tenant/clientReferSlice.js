import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  getAppRefersThunkAPI,
  getHostelRefersThunkAPI,
  referAppThunkAPI,
  referEarnAdminSetupThunkAPI,
  referEarnSetupThunkAPI,
  referhostelThunkAPI,
} from '../../api/thunks';

const INITIAL_STATE = {
  getHostelRefersResponse: {
    response: [],
    loading: false,
  },
  referEarnSetupResponse: {
    response: [],
    loading: false,
  },
  referhostelResponse: {
    response: [],
    loading: false,
  },
  referAppResponse: {
    response: [],
    loading: false,
  },
  getAppRefersResponse: {
    response: [],
    loading: false,
  },
  referEarnAdminSetupResponse: {
    response: [],
    loading: false,
  },
};

const clientReferSlice = createSlice({
  name: 'clientRefer',
  initialState: INITIAL_STATE,

  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getHostelRefersThunkAPI.pending, state => {
        state.getHostelRefersResponse.loading = true;
      })
      .addCase(getHostelRefersThunkAPI.fulfilled, (state, action) => {
        state.getHostelRefersResponse.loading = false;
        state.getHostelRefersResponse.response = action?.payload?.data;
        
      })
      .addCase(getHostelRefersThunkAPI.rejected, (state, action) => {
        state.getHostelRefersResponse.loading = false;
        state.getHostelRefersResponse.error = action?.payload?.error
        ? action.payload.error
        : 'Something went wrong';
        state = {
          ...state,
          getHostelRefersResponse: INITIAL_STATE.getHostelRefersResponse,
        };
      })
      .addCase(referEarnSetupThunkAPI.pending, state => {
        state.referEarnSetupResponse.loading = true;
      })
      .addCase(referEarnSetupThunkAPI.fulfilled, (state, action) => {
        
        state.referEarnSetupResponse.loading = false;
        state.referEarnSetupResponse.response = action?.payload?.data;
      })
      .addCase(referEarnSetupThunkAPI.rejected, (state, action) => {
        state.referEarnSetupResponse.loading = false;
        state.referEarnSetupResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          referEarnSetupResponse: INITIAL_STATE.referEarnSetupResponse,
        };
      })
      .addCase(referhostelThunkAPI.pending, state => {
        state.referhostelResponse.loading = true;
      })
      .addCase(referhostelThunkAPI.fulfilled, (state, action) => {
        state.referhostelResponse.loading = false;
        state.referhostelResponse.response = action?.payload?.data;
      })
      .addCase(referhostelThunkAPI.rejected, (state, action) => {
        state.referhostelResponse.loading = false;
        state.referhostelResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          referhostelResponse: INITIAL_STATE.referhostelResponse,
        };
      })
      .addCase(referAppThunkAPI.pending, state => {
        state.referAppResponse.loading = true;
      })
      .addCase(referAppThunkAPI.fulfilled, (state, action) => {
        
        state.referAppResponse.loading = false;
        state.referAppResponse.response = action?.payload?.data;
      })
      .addCase(referAppThunkAPI.rejected, (state, action) => {
        state.referAppResponse.loading = false;
        state.referAppResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          referAppResponse: INITIAL_STATE.referAppResponse,
        };
      })
      .addCase(getAppRefersThunkAPI.pending, state => {
        state.getAppRefersResponse.loading = true;
      })
      .addCase(getAppRefersThunkAPI.fulfilled, (state, action) => {
        
        state.getAppRefersResponse.loading = false;
        state.getAppRefersResponse.response = action?.payload?.data;
      })
      .addCase(getAppRefersThunkAPI.rejected, (state, action) => {
        state.getAppRefersResponse.loading = false;
        state.getAppRefersResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          getAppRefersResponse: INITIAL_STATE.getAppRefersResponse,
        };
      })
      .addCase(referEarnAdminSetupThunkAPI.pending, state => {
        state.referEarnAdminSetupResponse.loading = true;
      })
      .addCase(referEarnAdminSetupThunkAPI.fulfilled, (state, action) => {
        
        state.referEarnAdminSetupResponse.loading = false;
        state.referEarnAdminSetupResponse.response = action?.payload?.data;
      })
      .addCase(referEarnAdminSetupThunkAPI.rejected, (state, action) => {
        state.referEarnAdminSetupResponse.loading = false;
        state.referEarnAdminSetupResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
        state = {
          ...state,
          referEarnAdminSetupResponse:
            INITIAL_STATE.referEarnAdminSetupResponse,
        };
      });
  },
});
export default clientReferSlice.reducer;
