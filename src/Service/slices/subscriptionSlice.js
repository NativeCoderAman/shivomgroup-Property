import {createSlice} from '@reduxjs/toolkit';
import {
  addSubscriptionPlanThunkAPI,
  filterSubscriptionDetailsThunkAPI,
  subscriptionFeatureAndPermissionCompareThunkAPI,
  subscriptionFeaturesDetailsByFilterThunkAPI,
  getSubscriptionPage,
} from '../api/thunks';

const INITIAL_STATE = {
  getAllSubscriptionDetailsResponse: {
    response: [],
    loading: false,
  },
  filterSubscriptionDetailsResponse: {
    response: [],
    loading: false,
  },
  subscriptionFeaturesDetailsByFilterResponse: {
    response: [],
    loading: false,
  },
  subscriptionFeatureAndPermissionCompareResponse: {
    response: [],
    loading: false,
  },

  addSubscriptionPlanResponse: {
    response: [],
    loading: false,
  },
  getSubscriptionPageResponse: {
    response: [],
    loading: false,
  },
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: builder => {
    builder

      .addCase(filterSubscriptionDetailsThunkAPI.pending, state => {
        state.filterSubscriptionDetailsResponse.loading = true;
      })
      .addCase(filterSubscriptionDetailsThunkAPI.fulfilled, (state, action) => {
        state.filterSubscriptionDetailsResponse.loading = false;
        state.filterSubscriptionDetailsResponse.response =
          action?.payload?.data;
      })
      .addCase(filterSubscriptionDetailsThunkAPI.rejected, (state, action) => {
        //
        state.filterSubscriptionDetailsResponse.error = action?.error?.message;
        state = {
          ...state,
          filterSubscriptionDetailsResponse:
            INITIAL_STATE.filterSubscriptionDetailsResponse,
        };
      })
      .addCase(subscriptionFeaturesDetailsByFilterThunkAPI.pending, state => {
        state.subscriptionFeaturesDetailsByFilterResponse.loading = true;
      })
      .addCase(
        subscriptionFeaturesDetailsByFilterThunkAPI.fulfilled,
        (state, action) => {
          state.subscriptionFeaturesDetailsByFilterResponse.loading = false;
          state.subscriptionFeaturesDetailsByFilterResponse.response =
            action?.payload?.data;
        },
      )
      .addCase(
        subscriptionFeaturesDetailsByFilterThunkAPI.rejected,
        (state, action) => {
          //
          state.subscriptionFeaturesDetailsByFilterResponse.error =
            action?.error?.message;
          state = {
            ...state,
            subscriptionFeaturesDetailsByFilterResponse:
              INITIAL_STATE.subscriptionFeaturesDetailsByFilterResponse,
          };
        },
      )
      .addCase(
        subscriptionFeatureAndPermissionCompareThunkAPI.pending,
        state => {
          state.subscriptionFeatureAndPermissionCompareResponse.loading = true;
        },
      )
      .addCase(
        subscriptionFeatureAndPermissionCompareThunkAPI.fulfilled,
        (state, action) => {
          state.subscriptionFeatureAndPermissionCompareResponse.loading = false;
          state.subscriptionFeatureAndPermissionCompareResponse.response =
            action?.payload?.data;
        },
      )
      .addCase(
        subscriptionFeatureAndPermissionCompareThunkAPI.rejected,
        (state, action) => {
          //
          state.subscriptionFeatureAndPermissionCompareResponse.error =
            action?.error?.message;
          state = {
            ...state,
            subscriptionFeatureAndPermissionCompareResponse:
              INITIAL_STATE.subscriptionFeatureAndPermissionCompareResponse,
          };
        },
      )

      .addCase(addSubscriptionPlanThunkAPI.pending, state => {
        state.addSubscriptionPlanResponse.loading = true;
      })
      .addCase(addSubscriptionPlanThunkAPI.fulfilled, (state, action) => {
        state.addSubscriptionPlanResponse.loading = false;
        state.addSubscriptionPlanResponse.response = action?.payload?.data;
      })
      .addCase(addSubscriptionPlanThunkAPI.rejected, (state, action) => {
        //
        state.addSubscriptionPlanResponse.error = action?.error?.message;
        state = {
          ...state,
          addSubscriptionPlanResponse:
            INITIAL_STATE.addSubscriptionPlanResponse,
        };
      })
      .addCase(getSubscriptionPage.pending, state => {
        state.getSubscriptionPageResponse.loading = true;
      })
      .addCase(getSubscriptionPage.fulfilled, (state, action) => {
        state.getSubscriptionPageResponse.loading = false;
        state.getSubscriptionPageResponse.response = action?.payload;
      })
      .addCase(getSubscriptionPage.rejected, (state, action) => {
        //
        state.getSubscriptionPageResponse.error = action?.error;
        state = {
          ...state,
          getSubscriptionPageResponse:
            INITIAL_STATE.getSubscriptionPageResponse,
        };
      });
  },
});
export default subscriptionSlice.reducer;
