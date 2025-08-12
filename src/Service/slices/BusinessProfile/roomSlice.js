import { createSlice } from '@reduxjs/toolkit';
import { getRoomByIdThunk, getRoomsThunk, updateRoomThunk } from '../../api/thunks';

const initialState = {
  roomsList: [],
  loading: false,
  error: null,
  selectedRoom: null,
  selectedRoomLoading: false,
  selectedRoomError: null,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    clearSelectedRoom: (state) => {
      state.selectedRoom = null;
      state.selectedRoomError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.selectedRoomError = null;
      state.updateError = null;
    },
    clearUpdateStatus: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
       .addCase(getRoomsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roomsList = action.payload?.data || [];
      })
      .addCase(getRoomsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(getRoomByIdThunk.pending, (state) => {
        state.selectedRoomLoading = true;
        state.selectedRoomError = null;
      })
      .addCase(getRoomByIdThunk.fulfilled, (state, action) => {
        state.selectedRoomLoading = false;
        state.selectedRoom = action.payload?.data || null;
      })
      .addCase(getRoomByIdThunk.rejected, (state, action) => {
        state.selectedRoomLoading = false;
        state.selectedRoomError = action.payload;
      })

       .addCase(updateRoomThunk.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateRoomThunk.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        
        const updatedRoom = action.payload.data;
        if (updatedRoom) {
          const index = state.roomsList.findIndex(room => room.id === updatedRoom.id);
          if (index !== -1) {
            state.roomsList[index] = updatedRoom;
          }
          if (state.selectedRoom && state.selectedRoom.id === updatedRoom.id) {
            state.selectedRoom = updatedRoom;
          }
        }
      })
      .addCase(updateRoomThunk.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });


      
  },
});

export const { clearSelectedRoom, clearError, clearUpdateStatus } = roomSlice.actions;
export default roomSlice.reducer;
