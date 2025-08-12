import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData} from '../api/apis';

export const salesFilterStructure = createAsyncThunk(
    'filterdItems/salesFilterStructure',
    async ({ token }) => {
        return await fetchData('salesFilterStructure', token);
    }
)

const initialState = {
     allFilterItems: {
        response: [],
        loading: false,
        error: null,
    }
}

const FaqSlice = createSlice({
    name: "filterdItems",
    initialState: initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(salesFilterStructure.pending, state => {
                state. allFilterItems.loading = true;
            })
            .addCase(salesFilterStructure.fulfilled, (state, action) => {
                state. allFilterItems.loading = false;
                state. allFilterItems.response = action?.payload?.data || [];
            })
            .addCase(salesFilterStructure.rejected, (state, action) => {
                state. allFilterItems.loading = false;
                state. allFilterItems.error = action?.error?.message || 'Failed to fetch data';
            })
    }
})

export default FaqSlice.reducer;