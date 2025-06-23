import { createSlice } from '@reduxjs/toolkit';

const imageCardsSlice = createSlice({
  name: 'imageCards',
  initialState:[],
  reducers: {
    addImageCard: (state, action) => {
      const newImage = {
        ...action.payload,
      };
      state.push(newImage);
    },
    removeImageCard: (state, action) => {
      return state.filter(image => image.id !== action.payload);
    },
    setImageCards: (state, action) => {
      return action.payload;
    },
  },
});

export const { addImageCard, removeImageCard, setImageCards } = imageCardsSlice.actions;

export default imageCardsSlice.reducer;
