import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { fetchData,postData,putData,deleteData } from "../api/apis";

export const adminReferListThunkApi = createAsyncThunk(
    'adminRefer/adminReferListThunkApi',
    async(token) => {
        return await fetchData('getAdminRefers',token);
    }
);

export const adminReferMessageThunkApi = createAsyncThunk(
    'adminRefer/adminReferMessageThunkApi',
    async(token) => {
        const response =  await fetchData('getActiveAdminReferalData',token);
        console.log(response);
        return response;
    }
);

export const adminReferCreateThunkApi = createAsyncThunk(
    'adminRefer/adminReferCreateThunkApi',
    async({data,token}) => {
        console.log('post data:',data);
        const response =  await postData('storeAdminRefer',token,data);
        console.log(response);
        return response;
    }
);

const initialState =  {
    adminReferList:{
        response: [],
        loading: false,
        error: null,
    },
    adminReferMessage: {
        response: [],
        loading: false,
        error: null,
    },
    adminReferCreate: {
        response: [],
        loading: false,
        error: null,
    },
};

const adminReferSlice = createSlice({
    name: 'adminRefer',
    initialState,
    reducers:{},
    extraReducers: builder => {
        builder
            .addCase(adminReferListThunkApi.pending,(state)=>{
                state.adminReferList.loading = true;
            })
            .addCase(adminReferListThunkApi.fulfilled,(state,action)=>{
                state.adminReferList.loading = false;
                state.adminReferList.response = action?.payload?.data;
            })
            .addCase(adminReferListThunkApi.rejected,(state,action)=>{
                state.adminReferList.loading = false;
                state.adminReferList.error = action?.payload?.data;
            })
            .addCase(adminReferMessageThunkApi.pending,(state)=>{
                state.adminReferMessage.loading = true;
            })
            .addCase(adminReferMessageThunkApi.fulfilled,(state,action)=>{
                state.adminReferMessage.loading = false;
                state.adminReferMessage.response = action?.payload?.data;
            })
            .addCase(adminReferMessageThunkApi.rejected,(state,action)=>{
                state.adminReferMessage.loading = false;
                state.adminReferMessage.error = action?.payload?.data;
            })
            .addCase(adminReferCreateThunkApi.pending,(state)=>{
                state.adminReferCreate.loading = true;
            })
            .addCase(adminReferCreateThunkApi.fulfilled,(state,action)=>{
                state.adminReferCreate.loading = false;
                state.adminReferCreate.response = action?.payload?.data;
            })
            .addCase(adminReferCreateThunkApi.rejected,(state,action)=>{
                state.adminReferCreate.loading = false;
                state.adminReferCreate.error = action?.payload?.data;
            });
    }
});

export default adminReferSlice.reducer;