import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData} from '../api/apis';

export const getAllDocumantationemplate = createAsyncThunk(
    'getalldocumentaion/getAllDocumantationemplate',
    async ({ token }) => {
        return await fetchData('help-support-doc', token);
    }
)

const initialState = {
    getAllDocumentTemplate: {
        response: [],
        loading: false,
        error: null,
    }
}

const DocumentationSlice = createSlice({
    name: "getalldocumentaion",
    initialState: initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getAllDocumantationemplate.pending, state => {
                state.getAllDocumentTemplate.loading = true;
            })
            .addCase(getAllDocumantationemplate.fulfilled, (state, action) => {
                state.getAllDocumentTemplate.loading = false;
                state.getAllDocumentTemplate.response = action?.payload?.data || [];
            })
            .addCase(getAllDocumantationemplate.rejected, (state, action) => {
                state.getAllDocumentTemplate.loading = false;
                state.getAllDocumentTemplate.error = action?.error?.message || 'Failed to fetch data';
            })
    }
})

export default DocumentationSlice.reducer;