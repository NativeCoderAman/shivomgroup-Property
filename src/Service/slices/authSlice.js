import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  businessRegisterThunkAPI,
  changeUserPasswordThunkAPI,
  getSubscriptionDetailsThunkAPI,
  loginUserThunkAPI,
  logoutUserSessionThunkAPI,
} from '../api/thunks';

const INITIAL_STATE = {
  loginResponse: null,
  error: null,
  loading: false,
  userData: [],
  logoutUserSessionResponse: {
    response: [],
    loading: false,
  },
  changeUserPasswordResponse: {
    response: [],
    loading: false,
  },
  registerData: [],
  businessRegisterReponse: {
    response: [],
    loading: false,
  },
  getSubscriptionDetailsResponse: {
    response: [],
    loading: false,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState: INITIAL_STATE,

  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setRegisterData: (state, action) => {
      state.registerData = [...action.payload];
    },
    logOut: (state, action) => {
      state.userData = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUserThunkAPI.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunkAPI.fulfilled, (state, action) => {
        
        state.loading = false;
        state.error = null;
        state.loginResponse = action?.payload;
      })
      .addCase(loginUserThunkAPI.rejected, (state, action) => {
        // 
        state.loading = false;
        state.error =
          action?.error?.message === 'Request failed with status code 401'
            ? 'Invalid Username and Password'
            : 'Something went wrong';

      })
      .addCase(logoutUserSessionThunkAPI.pending, state => {
        state.logoutUserSessionResponse = true;
      })
      .addCase(logoutUserSessionThunkAPI.fulfilled, (state, action) => {
        
        state.logoutUserSessionResponse.loading = false;
        state.logoutUserSessionResponse.response = action?.payload;
      })
      .addCase(logoutUserSessionThunkAPI.rejected, (state, action) => {
        // 
        state.logoutUserSessionResponse.loading = false;
        state.logoutUserSessionResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
      })
      .addCase(changeUserPasswordThunkAPI.pending, state => {
        state.changeUserPasswordResponse = true;
      })
      .addCase(changeUserPasswordThunkAPI.fulfilled, (state, action) => {
        
        state.changeUserPasswordResponse.loading = false;
        state.changeUserPasswordResponse.response = action?.payload;
      })
      .addCase(changeUserPasswordThunkAPI.rejected, (state, action) => {
        // 
        state.changeUserPasswordResponse.loading = false;
        state.changeUserPasswordResponse.error = action?.payload?.error
          ? action.payload.error
          : 'Something went wrong';
      })
      .addCase(businessRegisterThunkAPI.pending, state => {
        state.businessRegisterReponse.loading = true;
      })
      .addCase(businessRegisterThunkAPI.fulfilled, (state, action) => {
        
        state.businessRegisterReponse.loading = false;
        state.businessRegisterReponse.response = action?.payload?.data;
      })
      .addCase(businessRegisterThunkAPI.rejected, (state, action) => {
        // 
        state.businessRegisterReponse.loading = false;
        state.businessRegisterReponse.error = action?.error?.message;
        state = {
          ...state,
          businessRegisterReponse: INITIAL_STATE.businessRegisterReponse,
        };
      })
      .addCase(getSubscriptionDetailsThunkAPI.pending, state => {
        state.getSubscriptionDetailsResponse.loading = true;
      })
      .addCase(getSubscriptionDetailsThunkAPI.fulfilled, (state, action) => {
        
        state.getSubscriptionDetailsResponse.loading = false;
        state.getSubscriptionDetailsResponse.response = action?.payload?.data;
      })
      .addCase(getSubscriptionDetailsThunkAPI.rejected, (state, action) => {
        // 
        state.getSubscriptionDetailsResponse.loading = false;
        state.getSubscriptionDetailsResponse.error = action?.error?.message;
        state = {
          ...state,
          getSubscriptionDetailsResponse:
            INITIAL_STATE.getSubscriptionDetailsResponse,
        };
      });
  },
});
export const {setUserData, logOut} = authSlice.actions;
export default authSlice.reducer;
