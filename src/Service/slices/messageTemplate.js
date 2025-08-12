import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData} from '../api/apis';

export const getAllMessageTemplate = createAsyncThunk(
    'messageTemplate/getMessageTemplate',
    async ({ token }) => {
        return await fetchData('messages-templates', token);
    }
)

const initialState = {
    allmessageTemplate: {
        response: [],
        loading: false,
        error: null,
    }
}

const MessageTemplateSlice = createSlice({
    name: "messageTemplate",
    initialState: initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // handling Message-template
            .addCase(getAllMessageTemplate.pending, state => {
                state.allmessageTemplate.loading = true;
            })
            .addCase(getAllMessageTemplate.fulfilled, (state, action) => {
                state.allmessageTemplate.loading = false;
                state.allmessageTemplate.response = action?.payload?.data || [];
            })
            .addCase(getAllMessageTemplate.rejected, (state, action) => {
                state.allmessageTemplate.loading = false;
                state.allmessageTemplate.error = action?.error?.message || 'Failed to fetch data';
            })
    }
})

export default MessageTemplateSlice.reducer;