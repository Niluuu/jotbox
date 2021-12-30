import { createSlice } from '@reduxjs/toolkit'

export const nodes = createSlice({
  name: 'nodes',
  initialState: {
    nodeID: "",
    updateModalIsOpen: false
  },
  reducers: {
    getIdNode: (state, action) => {
        state.nodeID = action.payload
        state.updateModalIsOpen = true 
    },
    closeUpdateModalIsOpen: (state) => {
      state.updateModalIsOpen = false
    },
  },
})

export const { getIdNode, closeUpdateModalIsOpen } = nodes.actions

export default nodes.reducer