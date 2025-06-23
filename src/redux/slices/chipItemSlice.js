// redux/slices/curationSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { postRequestUnAuthenticated, postRequestAuthenticated } from './../../services/rest';
import { shareChips,upvoteChip,saveChip } from './profileItemsSlice';
import {createChipComment, createChipCommentReply } from './commentChipSlice';



export const fetchChip = createAsyncThunk('chipItems/fetchChip', async (chipId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated('/fetch/chip/from/chipId', { chipId: chipId });
      if (response.success) {
        return response.chip; 
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
});

export const saveExclusiveChipData = createAsyncThunk('chipItems/saveExclusiveChipData', async (chipId, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated('/save/excluive/chip/data',{chipId:chipId});
      if (response.success) {
        return response.updatedChip;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
export const getExclusiveChipData = createAsyncThunk('chipItems/getExclusiveChipData', async (chipId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated('/get/excluive/chip/data',{chipId});
      if (response.success) {
        return response.exclusive;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

export const chipSlice = createSlice({
  name: 'chipItem',
  initialState: {
    chip:{},
    exclusive_users:[],
    status:'idle',
    error: null,
  },
  reducers: {
    clearChip: (state) => {
      state.chip={};
    }
  },
  extraReducers:(builder)=>{
    builder
    .addCase(fetchChip.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChip.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chip = action.payload;
      })
      .addCase(fetchChip.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(getExclusiveChipData.fulfilled, (state, action) => {
        state.exclusive_users = action.payload;
      })
      .addCase(createChipComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        if (state.chip._id===updatedComment.chipId) {
          state.chip.comments+=1;
        }
      })
    .addCase(createChipCommentReply.fulfilled, (state, action) => {
        const updatedReply = action.payload;
        if (state.chip._id===updatedReply.parentCommentId.chipId) {
          state.chip.comments+=1;
        }
    })
      .addCase(upvoteChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        if(updatedChip._id===state.chip._id){
          state.chip.upvotes = updatedChip.upvotes; 
        }
      })
      .addCase(saveChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        if(updatedChip._id===state.chip._id){
          state.chip.saved_by = updatedChip.saved_by; 
        }
    })
    .addCase(shareChips.fulfilled, (state, action) => {
      const updatedChip = action.payload;
      if(updatedChip._id===state.chip._id){
        state.chip.shared_by = updatedChip.shared_by;
      }
    })
  },
 
});

export const { setChipField, setLocationField, setDateField, addImageUrl, removeImageUrl, clearChip } = chipSlice.actions;

export default chipSlice.reducer;