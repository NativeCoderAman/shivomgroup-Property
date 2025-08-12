import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import BASE_URL from '../../Utils/config';
import axios from 'axios';

const INITIAL_STATE = {
    data: null,
    error: null,
    status: 'idle',
  };
  
export const handleBasicRoomDetails = createAsyncThunk(
  'Rooms/handleBasicRoomDetails',
  async () => {
    const response = await axios.get(BASE_URL + 'getRoomsDetails');
    return response.data;
  },
);

const getBasicRoomSlice = createSlice({
  name: 'basicDetails',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(handleBasicRoomDetails.pending, state => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(handleBasicRoomDetails.fulfilled, (state, action) => {
        
        state.status = 'success';
        state.error = null;
        state.data = action?.payload;
      })
      .addCase(handleBasicRoomDetails.rejected, (state, action) => {
        
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
export default getBasicRoomSlice.reducer;
