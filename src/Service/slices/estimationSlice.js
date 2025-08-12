import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData, postData, putData, deleteData } from '../api/apis';

const initialState = {
    estimationData: {
        response: [], // List of all estimations
        loading: false,
        error: null,
    },
    estimationNumber: {
        response: [], // List of all estimations
        loading: false,
        error: null,
    },
    tenantEstimationData: {
        response: [], // List of all estimations
        loading: false,
        error: null,
    },
    genrateEstimationInvoiceData: {
        response: [], // List of all estimations
        loading: false,
        error: null,
    }
};

// Async thunk to fetch all estimations
export const fetchEstimations = createAsyncThunk(
    'estimation/fetchEstimations',
    async ({ filter }, { getState }) => {
        const { token } = getState().root.auth.userData;
        let url = 'getEstimationSaleData'
        const query = new URLSearchParams();
        query.append('filter[year]', filter?.year || 'all');
        query.append('filter[month]', filter?.month || 'all');
        url += `?${query.toString()}`;
        return await fetchData(url, token);
    }
);

// Async thunk to add a new estimation
export const addEstimation = createAsyncThunk(
    'estimation/addEstimation',
    async (data, { getState }) => {
        const { token } = getState().root.auth.userData;
        return await postData('storeEstimation', token, data);
    }
);

// Async thunk to update an estimation by ID
export const updateEstimation = createAsyncThunk(
    'estimation/updateEstimation',
    async (data, { getState }) => {
        const { token } = getState().root.auth.userData;
        return await postData(`updateEstimationSale`, token, data);
    }
);

// Async thunk to delete an estimation by ID
export const deleteEstimation = createAsyncThunk(
    'estimation/deleteEstimation',
    async (id, { getState }) => {
        const { token } = getState().root.auth.userData;
        return await deleteData(`deleteEstimationSale?invoiceNo=${id}`, token);
    }
);


// Async thunk to fetch estimations number
export const fetchEstimationsNumber = createAsyncThunk(
    'estimation/fetchEstimationsNumber',
    async (_, { getState }) => {
        const { token } = getState().root.auth.userData;
        return await fetchData('getLatestEstimationNumber', token);
    }
);

// Async thunk to fetch single tenant estimations
export const fetchEstimationsSingleTenant = createAsyncThunk(
    'estimation/fetchEstimationsSingleTenant',
    async (id, { getState }) => {
        const { token } = getState().root.auth.userData;
        return await fetchData(`getEstimationCandidateData/${id}`, token);
    }
);

// Async thunk to fetch  tenant estimations
export const genrateEstimationInvoice = createAsyncThunk(
    'estimation/genrateEstimationInvoice',
    async (id, { getState }) => {
        const { token } = getState().root.auth.userData;
        return await fetchData(`genrateEstimationInvoice/${id}`, token);
    }
);

const estimationSlice = createSlice({
    name: 'estimation',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch estimations
            .addCase(fetchEstimations.pending, (state) => {
                state.estimationData.loading = true;
                state.estimationData.error = null;
            })
            .addCase(fetchEstimations.fulfilled, (state, action) => {
                state.estimationData.loading = false;
                state.estimationData.response = action.payload.data;
            })
            .addCase(fetchEstimations.rejected, (state, action) => {
                state.estimationData.loading = false;
                state.estimationData.error = action.payload;
            })
            // Add estimation
            .addCase(addEstimation.pending, (state) => {
                state.estimationData.loading = true;
                state.estimationData.error = null;
            })
            .addCase(addEstimation.fulfilled, (state, action) => {
                state.estimationData.loading = false;
                // state.estimationData.response = action.payload.data;
            })
            .addCase(addEstimation.rejected, (state, action) => {
                state.estimationData.loading = false;
                state.estimationData.error = action.payload;
            })
            // Update estimation
            .addCase(updateEstimation.pending, (state) => {
                state.estimationData.loading = true;
                state.estimationData.error = null;
            })
            .addCase(updateEstimation.fulfilled, (state, action) => {
                state.estimationData.loading = false;
                const index = state.estimationData.response.findIndex(estimation => estimation.id === action.payload.id);
                if (index !== -1) {
                    state.estimationData.response[index] = action.payload;
                }
            })
            .addCase(updateEstimation.rejected, (state, action) => {
                state.estimationData.loading = false;
                state.estimationData.error = action.payload;
            })
            // Delete estimation
            .addCase(deleteEstimation.pending, (state) => {
                state.estimationData.loading = true;
                state.estimationData.error = null;
            })
            .addCase(deleteEstimation.fulfilled, (state, action) => {
                state.estimationData.loading = false;
                state.estimationData.response = state.estimationData.response.filter(estimation => estimation.id !== action.payload);
            })
            .addCase(deleteEstimation.rejected, (state, action) => {
                state.estimationData.loading = false;
                state.estimationData.error = action.payload;
            })
            // Fetch estimation number
            .addCase(fetchEstimationsNumber.pending, (state) => {
                state.estimationNumber.loading = true;
                state.estimationNumber.error = null;
            })
            .addCase(fetchEstimationsNumber.fulfilled, (state, action) => {
                state.estimationNumber.loading = false;
                state.estimationNumber.response = action.payload.data;
            })
            .addCase(fetchEstimationsNumber.rejected, (state, action) => {
                state.estimationNumber.loading = false;
                state.estimationNumber.error = action.payload;
            })
            // Fetch single tenant estimations
            .addCase(fetchEstimationsSingleTenant.pending, (state) => {
                state.tenantEstimationData.loading = true;
                state.tenantEstimationData.error = null;
            })
            .addCase(fetchEstimationsSingleTenant.fulfilled, (state, action) => {
                state.tenantEstimationData.loading = false;
                state.tenantEstimationData.response = action.payload.data;
            })
            .addCase(fetchEstimationsSingleTenant.rejected, (state, action) => {
                state.tenantEstimationData.loading = false;
                state.tenantEstimationData.error = action.payload;
            })
            // Fetch invoice tenant estimations
            .addCase(genrateEstimationInvoice.pending, (state) => {
                state.genrateEstimationInvoiceData.loading = true;
                state.genrateEstimationInvoiceData.error = null;
            })
            .addCase(genrateEstimationInvoice.fulfilled, (state, action) => {
                state.genrateEstimationInvoiceData.loading = false;
                state.genrateEstimationInvoiceData.response = action.payload.data;
            })
            .addCase(genrateEstimationInvoice.rejected, (state, action) => {
                state.genrateEstimationInvoiceData.loading = false;
                state.genrateEstimationInvoiceData.error = action.payload;
            });
    },
});

export default estimationSlice.reducer;
