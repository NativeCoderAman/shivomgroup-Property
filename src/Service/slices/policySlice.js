import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import { fetchData } from "../api/apis";
const initialState = {
    loading: false,
    error: null,
    data: null
}

export const getPoliciesThunkApi = createAsyncThunk(
    'policy/getPoliciesThunkApi',
    async({token})=>{
        const response = await fetchData('policy',token);
        return response.data;
    }
)

const policySlice = createSlice({
    name: 'policy',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getPoliciesThunkApi.pending,(state)=>{
                state.loading = true;
            })
            .addCase(getPoliciesThunkApi.fulfilled,(state, action)=>{
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getPoliciesThunkApi.rejected,(state, action)=>{
                state.loading = false;
                state.error = action.error;
            });
    },
});

export default policySlice.reducer;