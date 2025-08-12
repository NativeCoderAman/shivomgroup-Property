import { createSlice } from "@reduxjs/toolkit";
import { getPropertyThunk, updatePropertyThunk } from "../../api/thunks";

const propertySlice = createSlice({
  name: 'property',
  initialState: {
    propertyList: [],     
    loading: false,
    error: null,
    updateLoading: false,    
    updateError: null,       
    updateSuccess: false,    
  },
  reducers: {
    clearUpdateStatus: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    }
  },
  extraReducers: (builder) => {
    builder
       .addCase(getPropertyThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPropertyThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.propertyList = action.payload?.data ? [action.payload.data] : [];
      })
      .addCase(getPropertyThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch property';
      })
      
       .addCase(updatePropertyThunk.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updatePropertyThunk.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        
         const updatedProperty = action.payload.data;
        if (updatedProperty && state.propertyList.length > 0) {
          state.propertyList[0] = updatedProperty;  
        }
      })
      .addCase(updatePropertyThunk.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || 'Failed to update property';
      });
  },
});

export const { clearUpdateStatus, clearError } = propertySlice.actions;
export default propertySlice.reducer;
