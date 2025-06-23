// redux/slices/curationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { postRequestAuthenticated } from "./../../services/rest";
import { postRequestUnAuthenticated } from "./../../services/rest";
import { shareChips, upvoteChip, saveChip } from "./profileItemsSlice";

export const fetchChipComments = createAsyncThunk(
  "chipComments/fetchComments",
  async (chipId, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated(
        "/fetch/chip/comments",
        { chipId: chipId }
      );
      if (response.success) {
        return response.comments;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createChipComment = createAsyncThunk(
  "chipComments/createChipComment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/create/chip/comment",
        data
      );
      if (response.success) {
        return response.comment;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const toggleCommentUpvote = createAsyncThunk(
  "chipComments/toggleCommentUpvote",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/toggle/comment/upvote",
        { id }
      );
      if (response.success) {
        return response.comment;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const toggleCommentReplyUpvote = createAsyncThunk(
  "chipComments/toggleCommentReplyUpvote",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/toggle/comment/reply/upvote",
        data
      );
      if (response.success) {
        return response.reply;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createChipCommentReply = createAsyncThunk(
  "chipComments/createChipCommentReply",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated(
        "/create/chip/comment/reply",
        data
      );
      if (response.success) {
        return response.reply;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const commentChipSlice = createSlice({
  name: "commentChip ",
  initialState: {
    chip: {},
    comments: [],
    status: "idle",
    addstatus: "idle",
    error: null,
    isScroll: true,
  },
  reducers: {
    clearCommentChip: (state) => {
      state.comments = [];
      state.chip = {};
    },
    setCommentChip: (state, action) => {
      state.comments = [];
      state.chip = action.payload;
    },
    setScroll: (state, action) => {
      state.isScroll = action.payload;
    },
    clearComments: (state) => state.initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChipComments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChipComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchChipComments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createChipComment.fulfilled, (state, action) => {
        state.addstatus = "succeeded";
        state.comments.push(action.payload);
      })
      .addCase(createChipComment.rejected, (state, action) => {
        state.addstatus = "failed";
        state.error = action.error.message;
      })
      .addCase(createChipComment.pending, (state, action) => {
        state.addstatus = "loading";
      })
      .addCase(toggleCommentUpvote.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const commentIndex = state.comments.findIndex(
          (comment) => comment._id === updatedComment._id
        );
        state.comments[commentIndex].upvotes = updatedComment.upvotes;
      })
      .addCase(toggleCommentReplyUpvote.fulfilled, (state, action) => {
        const updatedReply = action.payload;
        const commentIndex = state.comments.findIndex(
          (comment) => comment._id === updatedReply.parentCommentId
        );
        if (commentIndex !== -1) {
          const replyIndex = state.comments[commentIndex].replies.findIndex(
            (reply) => reply._id === updatedReply._id
          );
          state.comments[commentIndex].replies[replyIndex].upvotes =
            updatedReply.upvotes;
        }
      })
      .addCase(createChipCommentReply.fulfilled, (state, action) => {
        state.addstatus = "succeeded";
        const newReply = action.payload;
        const commentIndex = state.comments.findIndex(
          (comment) => comment._id === newReply.parentCommentId._id
        );
        if (commentIndex !== -1) {
          state.comments[commentIndex].replies.push(newReply);
        }
      })
      .addCase(createChipCommentReply.rejected, (state, action) => {
        state.addstatus = "failed";
        state.error = action.error.message;
      })
      .addCase(createChipCommentReply.pending, (state, action) => {
        state.addstatus = "loading";
      })
      .addCase(upvoteChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        state.chip.upvotes = updatedChip.upvotes;
      })
      .addCase(saveChip.fulfilled, (state, action) => {
        const updatedChip = action.payload;
        state.chip.saved_by = updatedChip.saved_by;
      })
      .addCase(shareChips.fulfilled, (state, action) => {
        state.chip.shared_by = action.payload.shared_by;
      });
  },
});

export const { setCommentChip, clearCommentChip, setScroll } =
  commentChipSlice.actions;

export default commentChipSlice.reducer;
