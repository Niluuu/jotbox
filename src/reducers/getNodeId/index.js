import { createSlice } from '@reduxjs/toolkit';

export const nodeId = createSlice({
  name: 'nodeId',
  initialState: {
    modalNode: undefined,
    nodeID: '',
    updateModalIsOpen: false,
  },
  reducers: {
    getModalNode: (state, action) => {
      state.modalNode = action.payload;
      state.updateModalIsOpen = true;
    },
    getIdNode: (state, action) => {
      state.nodeID = action.payload;
      state.updateModalIsOpen = true;
    },
    closeUpdateModalIsOpen: (state) => {
      state.updateModalIsOpen = false;
    },
  },
});

export const { getModalNode, getIdNode, closeUpdateModalIsOpen } = nodeId.actions;

export default nodeId.reducer;
