// redux/slices/curationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  postRequestAuthenticated,
  postRequestAuthenticatedWithFile,
} from "./../../services/rest";

export const createTransactionOrder = createAsyncThunk(
  "payment/createTransactionOrder",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/create/transaction/order",data);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/verify/payment", data);
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const failedPayment = createAsyncThunk(
  "payment/failedPayment",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestAuthenticated("/failed/payment", {id:id});
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);




export const paymentSlice = createSlice({
  name: "paymentSlice ",
  initialState: {
   data:{},
   paymentData:null,
   paymentType:"subscription",
   paymentError:null,
   loading:false,
   paymentStatus:"idle",
   paymentLoading:false,
  },
  reducers: {
    setPaymentField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    clearPaymentData: (state) => {
      state.paymentData = null;
      state.paymentType = "subscription";
      state.paymentError = null;
      state.loading = false;
      state.paymentStatus = "idle";
      state.paymentLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createTransactionOrder.pending, (state) => {
      state.paymentLoading = true;
    });
    builder.addCase(createTransactionOrder.fulfilled, (state, action) => {
      state.paymentLoading = false;
    });
    builder.addCase(createTransactionOrder.rejected, (state, action) => {
      state.paymentLoading = false;
      state.paymentError = action.payload;
    });
  },
});

export const {
  setPaymentField,
  clearPaymentData,
} = paymentSlice.actions;

export default paymentSlice.reducer;
