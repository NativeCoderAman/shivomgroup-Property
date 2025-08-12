import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import BASE_URL from '../../Utils/config';
import axios from 'axios';
import {fetchData, postData, deleteData} from '../api/apis';
const INITIAL_STATE = {
  roomsListResponse: {
    response: [],
    loading: false,
  },
  roomsBasicDataResponse: {
    response: [],
    loading: false,
  },
  createRoomDataResponse: {
    response: [],
    loading: false,
  },
  deleteRoomResponse: {
    response: [],
    loading: false,
  },
  updateRoomResponse: {
    response: [],
    loading: false,
  },
  roomReportResponse: {
    response: [],
    loading: false,
  },
};

export const handleRoomsListAPI = createAsyncThunk(
  'Rooms/handleRoomsListAPI',
  async (_, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await fetchData('getRoomsDetails', token);
  },
);

export const createRoomThunkAPI = createAsyncThunk(
  'Rooms/createRoom',
  async (data, {getState}) => {
    const {token} = getState().root.auth.userData;
    return postData(`createRoom`, token, data);
  },
);

export const updateRoomThunkAPI = createAsyncThunk(
  'Rooms/updateRoom',
  async (data, {getState}) => {
    const {token} = getState().root.auth.userData;
    return postData(`updateRoom/${data.roomNo}`, token, data);
  },
);

export const deleteRoomThunkAPI = createAsyncThunk(
  'Rooms/deleteRoom',
  async (roomId, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await deleteData(`deleteRoom/${roomId}`, token);
  },
);

export const handleBasicRoomDetails = createAsyncThunk(
  'Rooms/handleBasicRoomDetails',
  async (_, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await fetchData('getBasicRoomDetails', token);
  },
);

export const handleRoomReportThunkApi = createAsyncThunk(
  'Rooms/handleRoomReportThunkApi',
  async (_, {getState}) => {
    const {token} = getState().root.auth.userData;
    return await fetchData('downloadRoomSeatReports', token);
  },
);

const getAllRoomsSlice = createSlice({
  name: 'allRooms',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(handleRoomsListAPI.pending, state => {
        state.roomsListResponse.loading = true;
      })
      .addCase(handleRoomsListAPI.fulfilled, (state, action) => {
        state.roomsListResponse.loading = false;
        state.roomsListResponse.response = action?.payload?.data;
      })
      .addCase(handleRoomsListAPI.rejected, (state, action) => {
        state.roomsListResponse.loading = false;
        // state.roomsListResponse.error = action?.error?.message;
        state = {...state, roomsListResponse: INITIAL_STATE.roomsListResponse};
      })
      .addCase(handleBasicRoomDetails.pending, state => {
        state.roomsBasicDataResponse.loading = true;
      })
      .addCase(handleBasicRoomDetails.fulfilled, (state, action) => {
        state.roomsBasicDataResponse.loading = false;
        state.roomsBasicDataResponse.response = action?.payload?.data;
      })
      .addCase(handleBasicRoomDetails.rejected, (state, action) => {
        state.roomsBasicDataResponse.loading = false;

        // state.roomsBasicDataResponse.error = action?.error?.message;
        state = {
          ...state,
          roomsBasicDataResponse: INITIAL_STATE.roomsBasicDataResponse,
        };
      })
      .addCase(createRoomThunkAPI.pending, state => {
        state.createRoomDataResponse.loading = true;
      })
      .addCase(createRoomThunkAPI.fulfilled, (state, action) => {
        state.createRoomDataResponse.loading = false;
        state.createRoomDataResponse.response = action?.payload?.data;
      })
      .addCase(createRoomThunkAPI.rejected, (state, action) => {
        state.createRoomDataResponse.loading = false;

        // state.createRoomDataResponse.error = action?.error?.message;
        state = {
          ...state,
          createRoomDataResponse: INITIAL_STATE.createRoomDataResponse,
        };
      })
      .addCase(deleteRoomThunkAPI.pending, state => {
        state.deleteRoomResponse.loading = true;
      })
      .addCase(deleteRoomThunkAPI.fulfilled, (state, action) => {
        state.deleteRoomResponse.loading = false;
        state.deleteRoomResponse.response = action?.payload?.data;
      })
      .addCase(deleteRoomThunkAPI.rejected, (state, action) => {
        state.deleteRoomResponse.loading = false;

        state.deleteRoomResponse.error = action?.error?.message;
        state = {
          ...state,
          deleteRoomResponse: INITIAL_STATE.deleteRoomResponse,
        };
      })
      .addCase(updateRoomThunkAPI.pending, state => {
        state.updateRoomResponse.loading = true;
      })
      .addCase(updateRoomThunkAPI.fulfilled, (state, action) => {
        state.updateRoomResponse.loading = false;
        state.updateRoomResponse.response = action?.payload?.data;
      })
      .addCase(updateRoomThunkAPI.rejected, (state, action) => {
        state.updateRoomResponse.loading = false;

        // state.updateRoomResponse.error = action?.error?.message;
        state = {
          ...state,
          updateRoomResponse: INITIAL_STATE.updateRoomResponse,
        };
      })
      .addCase(handleRoomReportThunkApi.pending, state => {
        state.roomReportResponse.loading = true;
        state.roomReportResponse.error = null;
        state.roomReportResponse.response = [];
      })
      .addCase(handleRoomReportThunkApi.fulfilled, (state, action) => {
        state.roomReportResponse.loading = false;
        state.roomReportResponse.response = action?.payload?.data;
      })
      .addCase(handleRoomReportThunkApi.rejected, (state, action) => {
        state.roomReportResponse.loading = false;
        state.roomReportResponse.error = action?.error?.message;
      });
  },
});

export default getAllRoomsSlice.reducer;
