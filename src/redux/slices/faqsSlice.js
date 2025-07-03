import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestUnAuthenticated,
  postRequestAuthenticated,
} from "./../../services/rest";

export const createFaq = createAsyncThunk(
  "faqs/create-faq",
  async (topicData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/create/faq", topicData);
      if (response.success) {
        return response.faq;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchFaqs = createAsyncThunk(
  "faqs/fetch-faqs",
  async (username, { rejectWithValue }) => {
    try {
      const response = await postRequestUnAuthenticated("/fetch/user/faqs", {
        username: username,
      });
      if (response.success) {
        return response.faqs;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateFaqsOrder = createAsyncThunk(
  "faqs/update-faqs-order",
  async (items, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/update/faqs/order", {
        items,
      });
      if (response.success) {
        return response.faqs;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const deleteFaq = createAsyncThunk(
  "faqs/delete-faq",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/delete/faq", {
        id,
      });
      if (response.success) {
        return response.faq;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateFaq = createAsyncThunk(
  "faqs/udpate-faq",
  async (faqData, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/update/faq", faqData);
      if (response.success) {
        return response.faq;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const FaqsSlice = createSlice({
  name: "Faqs",
  initialState: {
    faqs: [],
    question: "",
    answer: "",
    status: "idle",
    updatestatus: "idle",
    fetchedOnce:false,
    error: null,
    reorderItems: [],
    faq_id: "",
  },
  reducers: {
    setFaqData: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearFaqData: (state) => {
      state.question = "";
      state.answer = "";
      state.faq_id = "";
    },
    updateReorderItems: (state, action) => {
      const reorderedFaqs = action.payload;
      state.reorderItems = reorderedFaqs;
    },
    clearReorderItems: (state) => {
      state.reorderItems = [];
    },
    clearFaqIdtoDelete: (state) => {
      state.faq_id = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFaq.pending, (state) => {
        state.updatestatus = "loading";
      })
      .addCase(createFaq.fulfilled, (state, action) => {
        state.updatestatus = "idle";
        const faq = action.payload;
        state.faqs = faq.faqs;
      })
      .addCase(createFaq.rejected, (state, action) => {
        state.updatestatus = "idle";
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchFaqs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.status = "idle";
        state.faqs = action.payload;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteFaq.pending, (state) => {
        state.updatestatus = "loading";
      })
      .addCase(deleteFaq.fulfilled, (state, action) => {
        state.updatestatus = "idle";
        const faqId = action.payload;
        let index = state.faqs.findIndex((item) => item._id === faqId);
        if (index !== -1) {
          state.faqs.splice(index, 1);
        }
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.updatestatus = "idle";
        state.error = action.payload || action.error.message;
      })
      .addCase(updateFaq.pending, (state) => {
        state.updatestatus = "loading";
      })
      .addCase(updateFaq.fulfilled, (state, action) => {
        state.updatestatus = "idle";
        const faq = action.payload;
        let index = state.faqs.findIndex((item) => item._id === faq._id);
        if (index !== -1) {
          state.faqs[index] = faq;
        }
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.updatestatus = "idle";
        state.error = action.payload || action.error.message;
      })
      .addCase(updateFaqsOrder.pending, (state, action) => {
        state.updatestatus = "loading";
      })
       .addCase(updateFaqsOrder.fulfilled, (state, action) => {
        state.updatestatus = "idle";
        const faq = action.payload;
        state.faqs = faq.faqs;
      });
  },
});

export const {
  setFaqData,
  clearFaqData,
  updateReorderItems,
  clearReorderItems,
  clearFaqIdtoDelete,
} = FaqsSlice.actions;

export default FaqsSlice.reducer;
