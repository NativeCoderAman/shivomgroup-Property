// import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
// import BASE_URL from '../../Utils/config';
// import axios from 'axios';

// const INITIAL_STATE = {
//   data: null,
//   error: null,
//   status: 'idle',
// };

// export const handleUserHostelAPI = createAsyncThunk(
//   'AllHostels/handleUserHostelAPI',
//   async phoneNumber => {
//     const response = await axios.post(BASE_URL + 'hostelname', {
//       userName: '9516760054',
//       userType: 'admin',
//     });
//     return response.data;
//   },
// );

// const getUserHostelSlice = createSlice({
//   name: 'hostelNames',
//   initialState: INITIAL_STATE,
//   reducers: {},
//   extraReducers: builder => {
//     builder
//       .addCase(handleUserHostelAPI.pending, state => {
//         state.loading = true;
//         state.status = 'loading';
//       })
//       .addCase(handleUserHostelAPI.fulfilled, (state, action) => {
//         
//         state.status = 'success';
//         state.error = null;
//         state.data = action?.payload.data;
//       })
//       .addCase(handleUserHostelAPI.rejected, (state, action) => {
//         
//         state.status = 'failed';
//         state.error = action.error.message;
//       });
//   },
// });
// export default getUserHostelSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import BASE_URL from '../../Utils/config';

const INITIAL_STATE = {
  data: null,
  error: null,
  status: 'idle',
};

export const handleUserHostelAPI = createAsyncThunk(
  'AllHostels/handleUserHostelAPI',
  async ({phoneNumber,userType}) => {
    const formData = new FormData();
    formData.append('userName', phoneNumber);
    formData.append('userType', userType);
    try {
      const response = await axios.post(`${BASE_URL}hostelname`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Boundary will be calculated automatically
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Response Status:', error.response.status);
        console.error('Response Headers:', error.response.headers);
        throw error.response.data;
      } else if (error.request) {
        console.error('Request Data:', error.request);
        throw new Error('Network Error');
      } else {
        console.error('Error Message:', error.message);
        throw new Error('Network Error');
      }
    }
  }
);

const getUserHostelSlice = createSlice({
  name: 'hostelname',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(handleUserHostelAPI.pending, state => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(handleUserHostelAPI.fulfilled, (state, action) => {
        state.status = 'success';
        state.error = null;
        state.data = action.payload;
      })
      .addCase(handleUserHostelAPI.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default getUserHostelSlice.reducer;
