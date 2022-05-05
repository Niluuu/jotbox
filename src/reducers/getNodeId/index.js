import { createSlice } from '@reduxjs/toolkit';

export const nodeId = createSlice({
  name: 'nodeId',
  initialState: {
    nodeID: '',
    updateModalIsOpen: false,
  },
  reducers: {
    getIdNode: (state, action) => {
      state.nodeID = action.payload;
      state.updateModalIsOpen = true;
    },
    closeUpdateModalIsOpen: (state) => {
      state.updateModalIsOpen = false;
    },
  },
});

export const { getIdNode, closeUpdateModalIsOpen } = nodeId.actions;

export default nodeId.reducer;
