import { createSlice } from '@reduxjs/toolkit';

export const nodes = createSlice({
  name: 'nodes',
  initialState: {
    nodes: [],
    updateNodes: false,
  },
  reducers: {
    getNodesToProps: (state, action) => {
      state.nodes = action.payload.map((parsTodo) => ({
        ...parsTodo,
        todo: JSON.parse(parsTodo.todo),
      }));
    },
    setNodesToProps: (state, action) => {
      state.nodes = [{ ...action.payload, todo: JSON.parse(action.payload.todo) }, ...state.nodes];
    },
    updateNodesToProps: (state, action) => {
      state.nodes = state.nodes.map((newCart) =>
        newCart.id === action.payload.id
          ? { ...action.payload, todo: JSON.parse(action.payload.todo) }
          : newCart,
      );
    },
    removeNodesToProps: (state, action) => {
      state.nodes = state.nodes.filter((newCart) => newCart.id !== action.payload);
    },
    setUpdateNodes: (state) => {
      state.updateNodes = !state.updateNodes;
    },
  },
});

export const {
  getNodesToProps,
  setNodesToProps,
  updateNodesToProps,
  removeNodesToProps,
  setUpdateNodes,
} = nodes.actions;

export default nodes.reducer;
