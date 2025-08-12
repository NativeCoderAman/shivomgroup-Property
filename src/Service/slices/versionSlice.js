import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASE_URL from "../../Utils/config";
import DeviceInfo from 'react-native-device-info';

// AsyncThunk to fetch APK version details
export const fetchVersionDetails = createAsyncThunk(
  "version/fetchVersionDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}apk-version`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const versionSlice = createSlice({
  name: "version",
  initialState: {
    version: null,
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVersionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVersionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.version = action.payload.version.version;
        state.current = DeviceInfo.getVersion(); // e.g., "1.0.0"
      })
      .addCase(fetchVersionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default versionSlice.reducer;
