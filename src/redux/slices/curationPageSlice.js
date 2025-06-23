import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
} from "./../../services/rest";
import {
  createChip,
  updateChip,
  upvoteChip,
  saveChip,
  shareChips,
} from "./profileItemsSlice";
import { deleteChip } from "./deleteChipSlice";
import { createChipComment, createChipCommentReply } from "./commentChipSlice";
import { pushChipToCuration } from "./pushItemsSlice";

export const fetchCuration = createAsyncThunk(
  "curation/fetchCuration",
  async (curId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        `/fetch/curation/from/curationId`,
        { curation_id: curId }
      );
      if (response.success) {
        return response.curation;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchChips = createAsyncThunk(
  "curation/fetchChips",
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
export const saveCuration = createAsyncThunk(
  "curation/saveCuration",
  async (curationId, { getState, rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/toggle/save/curation", {
        curation_id: curationId,
      });
      // console.log(response);
      if (response.success) {
        return response.updatedCuration;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const shareCuration = createAsyncThunk(
  "curation/shareCuration",
  async (curationId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated("/curation/shared_by", {
        curation_id: curationId,
      });
      if (response.success) {
        return response.curation;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const curationPageSlice = createSlice({
  name: "curationPage",
  initialState: {
    curation: {},
    error: null,
    status: "idle",
    chips: [],
    chipstatus: "idle",
    chipError: null,
  },
  reducers: {
    setCurationField: (state, action) => {
      const { field, value } = action.payload;
      state.curation[field] = value;
    },
    updateCurationPage: (state, action) => {
      const updatedCuration = action.payload;
      state.curation = { ...state.curation, ...updatedCuration };
    },
    updateChipPage: (state, action) => {
      const updatedChip = action.payload;
      state.chips = { ...state.curation, ...updatedChip };
    },
    clearItems: (state) => {
      state.chips = [];
      state.curation = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCuration.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCuration.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.curation = action.payload;
      })
      .addCase(fetchCuration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(saveCuration.fulfilled, (state, action) => {
        state.curation.saved_by = action.payload.saved_by;
      })
      .addCase(saveCuration.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchChips.pending, (state) => {
        state.chipstatus = "loading";
      })
      .addCase(fetchChips.fulfilled, (state, action) => {
        state.chipstatus = "succeeded";
        state.chips = action.payload;
      })
      .addCase(fetchChips.rejected, (state, action) => {
        state.chipstatus = "failed";
        state.chipError = action.payload;
      })
      .addCase(createChip.fulfilled, (state, action) => {
        if (state.curation._id === action.payload.curation) {
          state.chips.unshift(action.payload);
        }
      })
      .addCase(updateChip.fulfilled, (state, action) => {
        if (state.curation._id === action.payload.curation) {
          const index = state.chips.findIndex(
            (chip) => chip._id === action.payload._id
          );
          if (index !== -1) {
            state.chips[index] = action.payload;
          }
        }
      })
      .addCase(pushChipToCuration.fulfilled, (state, action) => {
        const data = action.payload;
        const curation_id = data.curation_id;
        const isCurr =
          state.curation._id === curation_id &&
          data.chip.curation !== state.curation._id;
        if (isCurr) {
          const index = state.chips.findIndex(
            (item) => item._id === data.chip._id
          );
          if (index !== -1) {
            state.chips.splice(index, 1);
          }
        }
      })
      .addCase(createChipComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index2 = state.chips.findIndex(
          (item) => item._id === updatedComment.chipId
        );
        if (index2 !== -1) {
          state.chips[index2].comments += 1;
        }
      })
      .addCase(createChipCommentReply.fulfilled, (state, action) => {
        const updatedReply = action.payload;
        const index2 = state.chips.findIndex(
          (item) => item._id === updatedReply.parentCommentId.chipId
        );
        if (index2 !== -1) {
          state.chips[index2].comments += 1;
        }
      })
      .addCase(upvoteChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        const index = state.chips.findIndex(
          (item) => item._id === updatedChip._id
        );
        if (index !== -1) {
          state.chips[index].upvotes = updatedChip.upvotes;
        }
      })
      .addCase(saveChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        const index = state.chips.findIndex(
          (item) => item._id === updatedChip._id
        );
        if (index !== -1) {
          state.chips[index].saved_by = updatedChip.saved_by;
        }
      })
      .addCase(shareChips.fulfilled, (state, action) => {
        const chip = action.payload;
        const index = state.chips.findIndex((item) => item._id === chip._id);
        if (index !== -1) {
          state.chips[index].shared_by = chip.shared_by;
        }
      })
      .addCase(shareCuration.fulfilled, (state, action) => {
        state.curation.shared_by = action.payload.shared_by;
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

export const {
  setCurationField,
  updateCurationPage,
  updateChipPage,
  clearItems,
} = curationPageSlice.actions;

export default curationPageSlice.reducer;

export const SelectfetchChipsStatus = (state) => state.curationPage.chipstatus;
export const SelectfetchChipsError = (state) => state.curationPage.chiperror;
