import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequestUnAuthenticated } from "./../../services/rest";
import { upvoteChip, saveChip, createChip } from "./profileItemsSlice";
import { saveCuration } from "./curationPageSlice";
import { deleteChip } from "./deleteChipSlice";
import { createChipComment, createChipCommentReply } from "./commentChipSlice";

export const fetchSavedCurations = createAsyncThunk(
  "saved/fetchSavedCurations",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        `/fetch/saved/curations`,
        { user_id: userId }
      );
      // console.log(response);
      if (response.success) {
        return response.curations;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch chips for a selected curation
export const fetchChips = createAsyncThunk(
  "saved/fetchChips",
  async (curId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        `/fetch/chips/of/curation`,
        { curId }
      );
      if (response.success) {
        return response.chips;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch saved chips for a user
export const fetchSavedChips = createAsyncThunk(
  "saved/fetchSavedChips",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(`/fetch/saved/chips`, {
        user_id: userId,
      });
      if (response.success) {
        return response.chips;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const savedSlice = createSlice({
  name: "saved",
  initialState: {
    savedCurations: [],
    savedChips: [],
    chips: [],
    selectedCuration: null,
    loading: false,
    chipLoading: false,
    error: null,
    chipError: null,
  },
  reducers: {
    setSelectedCuration: (state, action) => {
      state.selectedCuration = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearCurationChips: (state) => {
      state.chips = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchSavedCurations
      .addCase(fetchSavedCurations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedCurations.fulfilled, (state, action) => {
        state.loading = false;
        state.savedCurations = action.payload;
        if (action.payload.length > 0) {
          state.selectedCuration = action.payload[0];
        }
      })
      .addCase(fetchSavedCurations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetchChips
      .addCase(fetchChips.pending, (state) => {
        state.chipLoading = true;
        state.chipError = null;
      })
      .addCase(fetchChips.fulfilled, (state, action) => {
        state.chipLoading = false;
        state.chips = action.payload;
      })
      .addCase(fetchChips.rejected, (state, action) => {
        state.chipLoading = false;
        state.chipError = action.payload;
      })

      // Handle fetchSavedChips
      .addCase(fetchSavedChips.pending, (state) => {
        state.chipLoading = true;
        state.chipError = null;
      })
      .addCase(fetchSavedChips.fulfilled, (state, action) => {
        state.chipLoading = false;
        state.savedChips = action.payload;
      })
      .addCase(fetchSavedChips.rejected, (state, action) => {
        state.chipLoading = false;
        state.chipError = action.payload;
      })
      .addCase(saveCuration.fulfilled, (state, action) => {
        const updatedCuration = action.payload;
        const index = state.savedCurations.findIndex(
          (curation) => curation._id === updatedCuration._id
        );
        if (index !== -1) {
          state.savedCurations.splice(index, 1);
        } else {
          state.savedCurations.push(updatedCuration);
        }
        if (state.selectedCuration?._id === updatedCuration._id) {
          state.selectedCuration.saved_by = updatedCuration.saved_by;
        }
      })
      .addCase(createChipComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index = state.chips.findIndex(
          (item) => item._id === updatedComment.chipId
        );
        if (index !== -1) {
          state.chips[index].comments += 1;
        }
        const index2 = state.savedChips.findIndex(
          (item) => item._id === updatedComment.chipId
        );
        if (index2 !== -1) {
          state.savedChips[index2].comments += 1;
        }
      })
      .addCase(createChipCommentReply.fulfilled, (state, action) => {
        const updatedReply = action.payload;
        const index = state.chips.findIndex(
          (item) => item._id === updatedReply.parentCommentId.chipId
        );
        if (index !== -1) {
          state.chips[index].comments += 1;
        }
        const index2 = state.savedChips.findIndex(
          (item) => item._id === updatedReply.parentCommentId.chipId
        );
        if (index2 !== -1) {
          state.savedChips[index2].comments += 1;
        }
      })
      .addCase(upvoteChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        if (
          state.selectedCuration &&
          state.chips.some((chip) => chip._id === updatedChip._id)
        ) {
          const index = state.chips.findIndex(
            (chip) => chip._id === updatedChip._id
          );
          if (index !== -1) {
            state.chips[index].upvotes = updatedChip.upvotes;
          }
        } else {
          const index = state.savedChips.findIndex(
            (chip) => chip._id === updatedChip._id
          );
          if (index !== -1) {
            state.savedChips[index].upvotes = updatedChip.upvotes;
          }
        }
      })
      .addCase(saveChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        if (
          state.selectedCuration &&
          state.chips.some((chip) => chip._id === updatedChip._id)
        ) {
          const index = state.chips.findIndex(
            (chip) => chip._id === updatedChip._id
          );
          if (index !== -1) {
            state.chips[index].saved_by = updatedChip.saved_by;
          }
          const savedChipsIndex = state.savedChips.findIndex(
            (chip) => chip._id === updatedChip._id
          );
          if (savedChipsIndex !== -1) {
            state.savedChips.splice(updatedChip);
          }
        } else {
          const index = state.savedChips.findIndex(
            (chip) => chip._id === updatedChip._id
          );
          if (index !== -1) {
            state.savedChips.splice(index, 1);
          } else {
            state.savedChips.push(updatedChip);
          }
        }
      })
      .addCase(createChip.fulfilled, (state, action) => {
        if (state.selectedCuration != null) {
          state.chips.unshift(action.payload);
        }
      })
      .addCase(deleteChip.fulfilled, (state, action) => {
        const chipId = action.payload._id;
        const index = state.chips.findIndex((item) => item._id === chipId);
        if (index !== -1) {
          state.chips.splice(index, 1);
        }
      });
  },
});

export const { setSelectedCuration, setError, clearCurationChips } =
  savedSlice.actions;

export default savedSlice.reducer;
