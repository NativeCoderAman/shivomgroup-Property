import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {fetchData, postData} from '../api/apis';

export const getAutoPermissionDataThunkApi = createAsyncThunk(
  'permission/getAutoPermissionDataThunkApi',
  async ({token}, {getState, rejectWithValue}) => {
    return await fetchData('getAutoPermissionData', token);
  },
);

export const postAutoPermissionDataThunkApi = createAsyncThunk(
  'permission/postAutoPermissionDataThunkApi',
  async ({token,data}, {getState}) => {
    return await postData('storeAutoPermissionData', token, data);
  },
);

const initialState = {
  autoPermissionsData: {
    loading: false,
    data: [],
    error: null,
  },
  autoPermissionsDataForUpdate: {
    loading: false,
    data: [],
    error: null,
  }
};

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAutoPermissionDataThunkApi.pending, state => {
        state.autoPermissionsData.loading = true;
      })
      .addCase(getAutoPermissionDataThunkApi.fulfilled, (state, action) => {
        state.autoPermissionsData.loading = false;
        state.autoPermissionsData.data = action.payload.data;
      })
      .addCase(getAutoPermissionDataThunkApi.rejected, (state, action) => {
        state.autoPermissionsData.loading = false;
        state.autoPermissionsData.error = action.payload;
      })
      .addCase(postAutoPermissionDataThunkApi.pending, state => {
        state.autoPermissionsDataForUpdate.loading = true;
      })
      .addCase(postAutoPermissionDataThunkApi.fulfilled, (state, action) => {
        state.autoPermissionsDataForUpdate.loading = false;
        state.autoPermissionsDataForUpdate.data = action.payload;
      })
      .addCase(postAutoPermissionDataThunkApi.rejected, (state, action) => {
        state.autoPermissionsDataForUpdate.loading = false;
        state.autoPermissionsDataForUpdate.error = action.payload;
      });
  },
});

export default permissionSlice.reducer;
