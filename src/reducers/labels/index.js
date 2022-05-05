import { createSlice } from '@reduxjs/toolkit';

export const labels = createSlice({
  name: 'labels',
  initialState: {
    storeLabels: [],
  },
  reducers: {
    setStoreLabels: (state, action) => {
      state.storeLabels = action.payload;
    },
  },
});

export const { setStoreLabels } = labels.actions;

export default labels.reducer;
