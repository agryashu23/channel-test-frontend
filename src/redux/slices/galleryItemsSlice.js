// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { postRequestAuthenticated } from './../../services/rest';

// export const fetchGalleryItems = createAsyncThunk('galleryItems/fetchItems', async (username, { rejectWithValue }) => {
//     try {
//       const response = await postRequestAuthenticated('/gallery/chips/curations', {username });
//       console.log(response);
//       if (response.success) {
//         return response.items;
//       } else {
//         return rejectWithValue(response.message);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   });

//   export const upvoteChip = createAsyncThunk('galleryItems/upvoteChip', async (chipId, { rejectWithValue }) => {
//     try {
//       const response = await postRequestAuthenticated('/upvote/chip', { chip_id: chipId });
//       if (response.success) {
//         return response.updatedChip; 
//       } else {
//         return rejectWithValue(response.message);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   });
//   export const saveChip = createAsyncThunk('galleryItems/saveChip', async ({ chipId, curationId, originId } ,{ rejectWithValue }) => {
//     try {
//       const response = await postRequestAuthenticated('/save/chip', { chip_id: chipId, curation_id:curationId, origin_id:originId });
//       if (response.success) {
//         return response.updatedChip; 
//       } else {
//         return rejectWithValue(response.message);
//       }
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   });
  

// export const galleryItemsSlice = createSlice({
//   name: 'galleryItems',
//   initialState: {
//     items: [],
//     status: 'idle',
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchGalleryItems.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchGalleryItems.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.items = action.payload;
//       })
//       .addCase(fetchGalleryItems.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       })
//       .addCase(upvoteChip.fulfilled, (state, action) => {
//         const updatedChip = action.payload;
//         const index = state.items.findIndex(item => item._id === updatedChip._id);
//         if (index !== -1) {
//             state.items[index].upvotes = updatedChip.upvotes; 
//         }
//     })
//       .addCase(saveChip.fulfilled, (state, action) => {
//         const updatedChip = action.payload;
//         const index = state.items.findIndex(item => item._id === updatedChip._id);
//         if (index !== -1) {
//             state.items[index].saved_by = updatedChip.saved_by; 
//         }
//     })
     
//   },
// });

// export default galleryItemsSlice.reducer;
