import { createSlice } from '@reduxjs/toolkit';

export const labels = createSlice({
  name: 'labels',
  initialState: {
    labels: [],
  },
  reducers: {
    labelsToProps: (state, action) => {
      state.labels = action.payload;
    },
  },
});

export const { labelsToProps } = labels.actions;

export default labels.reducer;
