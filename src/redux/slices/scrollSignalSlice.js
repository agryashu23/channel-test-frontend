import { createSlice } from '@reduxjs/toolkit';

const scrollSignalSlice = createSlice({
  name: 'scrollSignal',
  initialState: { triggerScroll: false },
  reducers: {
    triggerScrollToBottom: (state) => {
      state.triggerScroll = true;
    },
    resetScrollTrigger: (state) => {
      state.triggerScroll = false;
    },
  },
});

export const { triggerScrollToBottom, resetScrollTrigger } = scrollSignalSlice.actions;
export default scrollSignalSlice.reducer;


