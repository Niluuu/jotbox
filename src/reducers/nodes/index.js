import { createSlice } from '@reduxjs/toolkit';

export const nodes = createSlice({
  name: 'nodes',
  initialState: {
    nodes: [],
    updateNodes: false,
  },
  reducers: {
    setNodesToProps: (state, action) => {
      state.nodes = action.payload;
    },
    setUpdateNodes: (state) => {
      state.updateNodes = !state.updateNodes;
    },
  },
});

export const { setNodesToProps, setUpdateNodes } = nodes.actions;

export default nodes.reducer;
