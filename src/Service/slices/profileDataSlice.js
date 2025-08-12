import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../api/apis";

export const getAdminSubscriptionThunkApi = createAsyncThunk(
    'adminsubscription/getAdminSubscriptionThunkApi',
    async (token) => {
        return await fetchData('businessSubscriptionHistory', token);
    }
);

export const activePlansPermissionsThunkApi = createAsyncThunk(
    'adminsubscription/activePlansPermissionsThunkApi',
    async (token) => {
        return await fetchData('activePlansPermissions', token);
    }
);

export const managerProfileThunkApi = createAsyncThunk(
    'manager/managerProfileThunkApi',
    async ({ token, id }) => {
        return await fetchData(`getActiveEmpProfile/${id}`, token);
    }
);

const INITIAL_DATA = {
    adminSubscriptionResponse: {
        loading: false,
        error: null,
        response: [],
    },
    activePlansPermissionsResponse: {
        loading: false,
        error: null,
        response: [],
    },
    managerProfileResponse: {
        loading: false,
        error: null,
        response: [],
    },
};

const profileDataSlice = createSlice({
    name: 'adminSubscription',
    initialState: INITIAL_DATA,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAdminSubscriptionThunkApi.pending, (state) => {
                state.adminSubscriptionResponse.loading = true;
            })
            .addCase(getAdminSubscriptionThunkApi.fulfilled, (state, action) => {
                state.adminSubscriptionResponse.loading = false;
                state.adminSubscriptionResponse.response = action?.payload?.subscriptionDetails;
            })
            .addCase(getAdminSubscriptionThunkApi.rejected, (state, action) => {
                state.adminSubscriptionResponse.loading = false;
                state.adminSubscriptionResponse.error = action.payload;
            })
            .addCase(activePlansPermissionsThunkApi.pending, (state) => {
                state.activePlansPermissionsResponse.loading = true;
            })
            .addCase(activePlansPermissionsThunkApi.fulfilled, (state, action) => {
                state.activePlansPermissionsResponse.loading = false;
                state.activePlansPermissionsResponse.response = action?.payload?.data;
            })
            .addCase(activePlansPermissionsThunkApi.rejected, (state, action) => {
                state.activePlansPermissionsResponse.loading = false;
                state.activePlansPermissionsResponse.error = action?.payload?.data;
            })
            .addCase(managerProfileThunkApi.pending, (state) => {
                state.managerProfileResponse.loading = true;
            })
            .addCase(managerProfileThunkApi.fulfilled, (state, action) => {
                state.managerProfileResponse.loading = false;
                state.managerProfileResponse.response = action?.payload?.data;
            })
            .addCase(managerProfileThunkApi.rejected, (state, action) => {
                state.managerProfileResponse.loading = false;
                state.managerProfileResponse.error = action?.payload?.data;
            });
    }
});

export default profileDataSlice.reducer;