import { createSlice } from '@reduxjs/toolkit';

export const gaps = createSlice({
  name: 'gaps',
  initialState: {
    gaps: [],
  },
  reducers: {
    gapsToProps: (state, action) => {
      state.gaps = action.payload;
    },
  },
});

export const { gapsToProps } = gaps.actions;

export default gaps.reducer;
