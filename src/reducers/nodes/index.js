import { createSlice } from '@reduxjs/toolkit';

export const nodes = createSlice({
  name: 'nodes',
  initialState: {
    nodes: [],
  },
  reducers: {
    setNodesToProps: (state, action) => {
      state.nodes = action.payload;
    },
  },
});

export const { setNodesToProps } = nodes.actions;

export default nodes.reducer;
