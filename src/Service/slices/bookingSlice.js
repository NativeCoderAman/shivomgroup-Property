import {createSlice} from '@reduxjs/toolkit';
import {addStudentBookingThunkAPI} from '../api/thunks';

const INITIAL_STATE = {
  addStudentBookingResponse: {
    response: [],
    loading: false,
  },
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(addStudentBookingThunkAPI.pending, state => {
        state.addStudentBookingResponse.loading = true;
      })
      .addCase(addStudentBookingThunkAPI.fulfilled, (state, action) => {
        
        state.addStudentBookingResponse.loading = false;
        state.addStudentBookingResponse.response = action?.payload?.data;
      })
      .addCase(addStudentBookingThunkAPI.rejected, (state, action) => {
        
        state.addStudentBookingResponse.loading = false;
        state.addStudentBookingResponse.error = action?.error?.message;
        state = {
          ...state,
          addStudentBookingResponse: INITIAL_STATE.addStudentBookingResponse,
        };
      });
  },
});
export default bookingSlice.reducer;
