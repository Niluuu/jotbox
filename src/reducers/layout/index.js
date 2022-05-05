import { createSlice } from '@reduxjs/toolkit';

export const layoutGridType = createSlice({
  name: 'gridType',
  initialState: {
    grid: false,
  },
  reducers: {
    toggleGrid: (state) => {
      state.grid = !state.grid;
    },
  },
});

export const { toggleGrid } = layoutGridType.actions;

export default layoutGridType.reducer;
